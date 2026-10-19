import { useEffect, useRef, useState, useCallback } from "react";
import * as MP4BoxModule from "mp4box";

const MP4Box = (MP4BoxModule as any).default || MP4BoxModule;
const { createFile, DataStream } = MP4BoxModule as any;

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 60000;

interface FrameItem {
  ts: number; // in microseconds
  blob: Blob;
}

export function useVideoScrub(videoSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [dur, setDur] = useState(0);

  // Animation & decoding state stored in refs to avoid re-renders on rAF
  const stateRef = useRef({
    current: 0,
    target: 0,
    dur: 0,
    ready: false,
    reverted: false,
    painted: false,
    building: false,
    lastTime: performance.now(),
    bank: [] as FrameItem[],
    lru: new Map<number, ImageBitmap | null>(),
    lruOrder: [] as number[],
    inFlightDecodes: 0,
    videoDecoder: null as any,
  });

  // Binary search for nearest frame index
  const getNearestIndex = useCallback((tsMicro: number, bank: FrameItem[]): number => {
    if (!bank.length) return -1;
    let low = 0;
    let high = bank.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (bank[mid].ts < tsMicro) {
        low = mid + 1;
      } else if (bank[mid].ts > tsMicro) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    if (low >= bank.length) return bank.length - 1;
    if (high < 0) return 0;
    return Math.abs(bank[low].ts - tsMicro) < Math.abs(bank[high].ts - tsMicro) ? low : high;
  }, []);

  // Warm LRU cache around index (i-1..i+2)
  const warmLRU = useCallback((centerIdx: number) => {
    const s = stateRef.current;
    if (!s.bank.length) return;
    const start = Math.max(0, centerIdx - 1);
    const end = Math.min(s.bank.length - 1, centerIdx + 2);

    for (let i = start; i <= end; i++) {
      if (!s.lru.has(i)) {
        s.lru.set(i, null); // mark pending
        s.lruOrder.push(i);

        // Evict oldest if exceeding LRU_MAX
        while (s.lruOrder.length > LRU_MAX) {
          const evictIdx = s.lruOrder.shift();
          if (evictIdx !== undefined && evictIdx !== centerIdx) {
            const bmp = s.lru.get(evictIdx);
            if (bmp) {
              try {
                bmp.close();
              } catch (_) {}
            }
            s.lru.delete(evictIdx);
          }
        }

        const item = s.bank[i];
        createImageBitmap(item.blob)
          .then((bitmap) => {
            s.lru.set(i, bitmap);
          })
          .catch(() => {
            s.lru.delete(i);
          });
      }
    }
  }, []);

  // Scroll Progress Calculator
  const getProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return 0;
    const p = window.scrollY / totalScrollable;
    return Math.max(0, Math.min(1, p));
  }, []);

  // Handle Video Duration Loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        stateRef.current.dur = video.duration;
        setDur(video.duration);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    if (video.duration && !isNaN(video.duration)) {
      stateRef.current.dur = video.duration;
      setDur(video.duration);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // Frame Bank Builder using MP4Box & WebCodecs VideoDecoder
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof window === "undefined" || !("VideoDecoder" in window)) {
      stateRef.current.reverted = true;
      return;
    }

    let isCancelled = false;
    const s = stateRef.current;

    // 60s Watchdog: revert to HTML5 video seeking if decoding takes too long
    const watchdogTimer = setTimeout(() => {
      if (!s.ready && !s.painted) {
        s.reverted = true;
        setCanvasLive(false);
      }
    }, WATCHDOG);

    async function initDecoder(preferSoftware = false) {
      try {
        s.building = true;
        const res = await fetch(videoSrc, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (isCancelled) return;

        const mp4boxfile = createFile();
        const offscreenCanvas = document.createElement("canvas");
        const offscreenCtx = offscreenCanvas.getContext("2d");

        let videoTrackInfo: any = null;
        let decoder: VideoDecoder | null = null;
        const pendingSamples: any[] = [];
        let processing = false;

        async function processSampleQueue() {
          if (processing) return;
          processing = true;

          while (pendingSamples.length > 0) {
            if (isCancelled || s.reverted) break;

            // Throttle with LEAD so decode doesn't outrun blob encoding
            if (s.inFlightDecodes >= LEAD) {
              await new Promise((r) => setTimeout(r, 16));
              continue;
            }

            const sample = pendingSamples.shift();
            if (!sample || !decoder || decoder.state !== "configured") continue;

            try {
              s.inFlightDecodes++;
              const chunk = new EncodedVideoChunk({
                type: sample.is_sync ? "key" : "delta",
                timestamp: (sample.cts * 1e6) / sample.timescale,
                duration: (sample.duration * 1e6) / sample.timescale,
                data: sample.data,
              });
              decoder.decode(chunk);
            } catch (err) {
              s.inFlightDecodes--;
            }
          }

          processing = false;
        }

        decoder = new VideoDecoder({
          output: (frame: VideoFrame) => {
            if (isCancelled || s.reverted) {
              frame.close();
              s.inFlightDecodes = Math.max(0, s.inFlightDecodes - 1);
              return;
            }

            const timestamp = frame.timestamp;
            if (offscreenCanvas.width !== frame.displayWidth) {
              offscreenCanvas.width = frame.displayWidth;
              offscreenCanvas.height = frame.displayHeight;
            }

            offscreenCtx?.drawImage(frame, 0, 0);
            frame.close();

            offscreenCanvas.toBlob(
              (blob) => {
                s.inFlightDecodes = Math.max(0, s.inFlightDecodes - 1);
                if (blob && !isCancelled) {
                  s.bank.push({ ts: timestamp, blob });
                }
              },
              "image/webp",
              0.82
            );
          },
          error: (e) => {
            console.warn("VideoDecoder error:", e);
            if (!preferSoftware && !s.ready) {
              // Retry once with prefer-software
              initDecoder(true);
            } else {
              s.reverted = true;
              setCanvasLive(false);
            }
          },
        });

        mp4boxfile.onReady = (info: any) => {
          if (isCancelled) return;
          if (!info.videoTracks || !info.videoTracks.length) {
            s.reverted = true;
            return;
          }

          videoTrackInfo = info.videoTracks[0];
          if (!s.dur && videoTrackInfo.duration && videoTrackInfo.timescale) {
            const calculatedDur = videoTrackInfo.duration / videoTrackInfo.timescale;
            s.dur = calculatedDur;
            setDur(calculatedDur);
          }

          // Extract track description box (avcC, hvcC, vpcC, av1C)
          let description: Uint8Array | undefined;
          try {
            const trak = (mp4boxfile as any).getTrackById(videoTrackInfo.id);
            if (trak?.mdia?.minf?.stbl?.stsd?.entries) {
              for (const entry of trak.mdia.minf.stbl.stsd.entries) {
                const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
                if (box) {
                  const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
                  box.write(stream);
                  description = new Uint8Array(stream.buffer, 8);
                  break;
                }
              }
            }
          } catch (_) {}

          try {
            decoder?.configure({
              codec: videoTrackInfo.codec,
              codedWidth: videoTrackInfo.video?.width || 1920,
              codedHeight: videoTrackInfo.video?.height || 1080,
              description,
              hardwareAcceleration: preferSoftware ? "prefer-software" : "no-preference",
            });
          } catch (cfgErr) {
            if (!preferSoftware) {
              initDecoder(true);
            } else {
              s.reverted = true;
            }
            return;
          }

          mp4boxfile.setExtractionOptions(videoTrackInfo.id, null, {
            nbSamples: 1000,
            rapAlignment: false,
          });
          mp4boxfile.start();
        };

        mp4boxfile.onSamples = (_id: number, _user: any, samples: any[]) => {
          if (isCancelled || s.reverted) return;
          pendingSamples.push(...samples);
          processSampleQueue();
        };

        (buffer as any).fileStart = 0;
        mp4boxfile.appendBuffer(buffer);
        mp4boxfile.flush();

        // Check when bank reaches sufficient density to declare ready
        const readinessChecker = setInterval(() => {
          if (isCancelled) {
            clearInterval(readinessChecker);
            return;
          }
          if (s.bank.length > 30) {
            s.bank.sort((a, b) => a.ts - b.ts);
            s.ready = true;
            clearInterval(readinessChecker);
          }
        }, 300);
      } catch (err) {
        console.warn("Frame extraction fallback active:", err);
        s.reverted = true;
      }
    }

    // Build after window load or right away
    if (document.readyState === "complete") {
      initDecoder();
    } else {
      window.addEventListener("load", () => initDecoder(), { once: true });
    }

    return () => {
      isCancelled = true;
      clearTimeout(watchdogTimer);
      if (s.videoDecoder && s.videoDecoder.state !== "closed") {
        try {
          s.videoDecoder.close();
        } catch (_) {}
      }
    };
  }, [videoSrc]);

  // Main rAF Animation & Canvas Render Loop
  useEffect(() => {
    let animId: number;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderLoop = (time: number) => {
      const s = stateRef.current;
      const dt = Math.min(0.1, (time - s.lastTime) / 1000);
      s.lastTime = time;

      const p = getProgress();
      setScrollProgress(p);

      const duration = s.dur || 10;
      if (duration > 0) {
        s.target = p * duration;

        if (prefersReduced) {
          s.current = s.target;
        } else {
          s.current += (s.target - s.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(s.target - s.current) < SNAP) {
            s.current = s.target;
          }
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (s.ready && s.bank.length > 0 && canvas) {
          const targetTs = s.current * 1e6;
          const nearestIdx = getNearestIndex(targetTs, s.bank);

          if (nearestIdx >= 0) {
            warmLRU(nearestIdx);
            const bitmap = s.lru.get(nearestIdx);

            if (bitmap) {
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                if (!s.painted) {
                  s.painted = true;
                  setCanvasLive(true);
                }
              }
            }
          }
        } else if (video) {
          // Fallback: Seek video.currentTime directly
          if (!video.seeking && Math.abs(video.currentTime - s.current) > 0.01) {
            video.currentTime = s.current;
          }
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [getProgress, getNearestIndex, warmLRU]);

  // Recompute on window resize & orientationchange
  useEffect(() => {
    const handleResize = () => {
      setScrollProgress(getProgress());
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [getProgress]);

  const isLight = scrollProgress <= 0.55;

  return {
    containerRef,
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
    isLight,
    dur,
  };
}

export default useVideoScrub;

import { useEffect, useRef, useState, useCallback } from "react";
import * as MP4BoxModule from "mp4box";

const MP4Box = (MP4BoxModule as any).default || MP4BoxModule;
const { createFile, DataStream } = MP4BoxModule as any;

const LERP_TAU = 9; // smooth responsive tracking
const SNAP = 0.001;
const LEAD = 24;

interface FrameItem {
  ts: number; // in microseconds
  bitmap: ImageBitmap;
}

export function useVideoScrub(videoSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [dur, setDur] = useState(10);

  // Animation & decoding state stored in refs to avoid re-renders on rAF
  const stateRef = useRef({
    current: 0,
    target: 0,
    dur: 10,
    ready: false,
    reverted: false,
    painted: false,
    building: false,
    lastTime: performance.now(),
    bank: [] as FrameItem[],
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

  // Compute scroll progress p = clamp(0, 1, window.scrollY / (container.offsetHeight - window.innerHeight))
  const getProgress = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const container = containerRef.current;
    if (!container) return 0;
    const total = container.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return Math.min(1, Math.max(0, window.scrollY / total));
  }, []);

  // Sync duration from video element immediately
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        stateRef.current.dur = video.duration;
        setDur(video.duration);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    if (video.duration && !isNaN(video.duration)) {
      onLoadedMetadata();
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

    async function initDecoder(preferSoftware = false) {
      try {
        s.building = true;
        const res = await fetch(videoSrc, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (isCancelled) return;

        const mp4boxfile = createFile();
        let videoTrackInfo: any = null;
        let decoder: VideoDecoder | null = null;
        const pendingSamples: any[] = [];
        let processing = false;

        async function processSampleQueue() {
          if (processing) return;
          processing = true;

          while (pendingSamples.length > 0) {
            if (isCancelled || s.reverted) break;

            if (s.inFlightDecodes >= LEAD) {
              await new Promise((r) => setTimeout(r, 8));
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
          output: async (frame: VideoFrame) => {
            if (isCancelled || s.reverted) {
              frame.close();
              s.inFlightDecodes = Math.max(0, s.inFlightDecodes - 1);
              return;
            }

            const timestamp = frame.timestamp;

            try {
              // Direct GPU-to-GPU ImageBitmap creation (instantaneous & 100% crystal clear)
              const bitmap = await createImageBitmap(frame);
              frame.close();
              s.inFlightDecodes = Math.max(0, s.inFlightDecodes - 1);

              if (bitmap && !isCancelled) {
                s.bank.push({ ts: timestamp, bitmap });

                // Once we have a solid batch of decoded frames, activate canvas mode
                if (!s.ready && s.bank.length >= 10) {
                  s.bank.sort((a, b) => a.ts - b.ts);
                  s.ready = true;
                  setCanvasLive(true);
                }
              }
            } catch (bmpErr) {
              frame.close();
              s.inFlightDecodes = Math.max(0, s.inFlightDecodes - 1);
            }
          },
          error: (e) => {
            console.warn("VideoDecoder error:", e);
            if (!preferSoftware && !s.ready) {
              initDecoder(true);
            } else {
              s.reverted = true;
            }
          },
        });

        s.videoDecoder = decoder;

        mp4boxfile.onReady = (info: any) => {
          if (isCancelled) return;
          if (!info.videoTracks || !info.videoTracks.length) {
            s.reverted = true;
            return;
          }

          videoTrackInfo = info.videoTracks[0];
          if (videoTrackInfo.duration && videoTrackInfo.timescale) {
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
              codedWidth: videoTrackInfo.video?.width || 1280,
              codedHeight: videoTrackInfo.video?.height || 720,
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

        // Final sort when all samples are extracted
        const finishChecker = setInterval(() => {
          if (isCancelled) {
            clearInterval(finishChecker);
            return;
          }
          if (s.bank.length > 0) {
            s.bank.sort((a, b) => a.ts - b.ts);
            s.ready = true;
            setCanvasLive(true);
          }
          if (pendingSamples.length === 0 && !processing && s.bank.length > 0) {
            clearInterval(finishChecker);
          }
        }, 200);
      } catch (err) {
        console.warn("Frame extraction error, using video fallback:", err);
        s.reverted = true;
      }
    }

    initDecoder();

    return () => {
      isCancelled = true;
      if (s.videoDecoder && s.videoDecoder.state !== "closed") {
        try {
          s.videoDecoder.close();
        } catch (_) {}
      }
      // Clean up bitmaps
      for (const item of s.bank) {
        try {
          item.bitmap.close();
        } catch (_) {}
      }
      s.bank = [];
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
          // Responsive fluid LERP
          s.current += (s.target - s.current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(s.target - s.current) < SNAP) {
            s.current = s.target;
          }
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;

        // 1) Primary: Draw decoded high-res frame from bank on canvas
        if (s.ready && s.bank.length > 0 && canvas) {
          const targetTs = s.current * 1e6;
          const nearestIdx = getNearestIndex(targetTs, s.bank);

          if (nearestIdx >= 0) {
            const item = s.bank[nearestIdx];
            if (item && item.bitmap) {
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(item.bitmap, 0, 0, canvas.width, canvas.height);
                if (!s.painted) {
                  s.painted = true;
                  setCanvasLive(true);
                }
              }
            }
          }
        } else if (video) {
          // 2) Fallback: Keep video element seeking smoothly in sync
          if (!video.seeking && Math.abs(video.currentTime - s.current) > 0.02) {
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
  }, [getProgress, getNearestIndex]);

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

  return {
    containerRef,
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
    dur,
  };
}

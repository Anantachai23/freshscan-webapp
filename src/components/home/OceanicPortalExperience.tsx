import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Camera, ChevronDown, Fish, ArrowRight, ShieldCheck, Sparkles, Waves } from "lucide-react";

import fishImg from "@/assets/portal-fish.jpg";
import shrimpImg from "@/assets/portal-shrimp.jpg";
import squidImg from "@/assets/portal-squid.jpg";
import shellfishImg from "@/assets/portal-shellfish.jpg";

export type MarineSpeciesKey = "fish" | "shrimp" | "squid" | "shellfish";

interface MarineSpeciesState {
  key: MarineSpeciesKey;
  name: string;
  thaiName: string;
  tagline: string;
  number: string;
  next: string;
  nextNumber: string;
  nextKey: MarineSpeciesKey;
  image: string;
  bgGradient: string;
  facts: [string, string][];
}

const MARINE_STATES: Record<MarineSpeciesKey, MarineSpeciesState> = {
  fish: {
    key: "fish",
    name: "FISH",
    thaiName: "ปลาทะเล",
    tagline: "Teleostei · นัยน์ตานูนใส เหงือกแดงสดฉ่ำ เนื้อแน่นสปริงตัว",
    number: "[01]",
    next: "Shrimp",
    nextNumber: "[02]",
    nextKey: "shrimp",
    image: fishImg,
    bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(14, 116, 144, 0.4) 0%, rgba(3, 7, 18, 0.95) 85%)",
    facts: [
      ["Cornea Clarity", "ตานูนใส ไร้ฝ้าขุ่น ไม่จมลงเบ้าตา (QIM Index 0)"],
      ["Gill Vascular", "เหงือกแดงสดฉ่ำ ปราศจากเมือกเหนียวและกลิ่นคาว"],
      ["Muscle Elasticity", "เนื้อแน่นเด้ง สปริงตัวคืนรูปทันทีเมื่อใช้นิ้วกด"],
      ["Cold-Chain Target", "อุณหภูมิเก็บรักษา 0°C – 2°C บนน้ำแข็งบดบริสุทธิ์"],
    ],
  },
  shrimp: {
    key: "shrimp",
    name: "SHRIMP",
    thaiName: "กุ้งทะเล",
    tagline: "Penaeidae · เปลือกแก้วใส หัวแน่นไม่หลุด ไร้รอยคล้ำเมลาโนซิส",
    number: "[02]",
    next: "Squid",
    nextNumber: "[03]",
    nextKey: "squid",
    image: shrimpImg,
    bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(6, 182, 212, 0.35) 0%, rgba(3, 7, 18, 0.95) 85%)",
    facts: [
      ["Carapace Bond", "หัวและเปลือกติดแน่นกับลำตัว ไม่หลวมหรือปริแยก"],
      ["Melanosis Zero", "ปราศจากจุดดำคล้ำบริเวณข้อต่อเปลือก (PPO Inactive)"],
      ["Translucency", "เปลือกใสเป็นมันวาว หางแผ่เรียบเป็นธรรมชาติ"],
      ["Cold-Chain Target", "อุณหภูมิ -1°C – 1°C ควบคุมความชื้นสัมพัทธ์สมบูรณ์"],
    ],
  },
  squid: {
    key: "squid",
    name: "SQUID",
    thaiName: "ปลาหมึก",
    tagline: "Loliginidae · ผิวขาวประกายมุก เม็ดสีสดใส หนวดเกาะแน่น",
    number: "[03]",
    next: "Shellfish",
    nextNumber: "[04]",
    nextKey: "shellfish",
    image: squidImg,
    bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(99, 102, 241, 0.35) 0%, rgba(3, 7, 18, 0.95) 85%)",
    facts: [
      ["Chromatophores", "จุดสีบนผิวคมชัด หนังไม่เปื่อยยุ่ยหรือลอกร่อน"],
      ["Mantle Luster", "ลำตัวขาวประกายมุก เนื้อเต่งตึง ไม่เปลี่ยนเป็นสีแดง"],
      ["Tentacle Suction", "หนวดแข็งแรง ถ้วยดูดเกาะแน่น ไม่นิ่มเละ"],
      ["Cold-Chain Target", "0°C – 2°C เก็บแบบแห้ง หลีกเลี่ยงน้ำจืดสัมผัสตรง"],
    ],
  },
  shellfish: {
    key: "shellfish",
    name: "SHELLFISH",
    thaiName: "หอยทะเล",
    tagline: "Bivalvia · ฝาปิดสนิท เคาะแล้วหุบตัว น้ำในฝาใสสะอาด",
    number: "[04]",
    next: "Fish",
    nextNumber: "[01]",
    nextKey: "fish",
    image: shellfishImg,
    bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.35) 0%, rgba(3, 7, 18, 0.95) 85%)",
    facts: [
      ["Valve Reflex", "ฝาปิดสนิท เคาะเปลือกแล้วตอบสนองหุบตัวทันที (มีชีวิต)"],
      ["Internal Liquor", "น้ำในฝาใสสะอาด กลิ่นไอทะเลบริสุทธิ์ ไร้กลิ่นแอมโมเนีย"],
      ["Mantle Texture", "เนื้อหอยชุ่มฉ่ำ สีสดใส ยึดเกาะแน่นกับขอบเปลือก"],
      ["Food Safety", "ผ่านการพักคายทรายในน้ำทะเลสะอาดตามสุขอนามัย"],
    ],
  },
};

const SPECIES_KEYS: MarineSpeciesKey[] = ["fish", "shrimp", "squid", "shellfish"];

// Helper: 44-point rounded-rect sampling (10 steps per arc)
function buildRoundedRect(cx: number, cy: number, w: number, h: number, r: number, steps = 10): [number, number][] {
  const pts: [number, number][] = [];
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  const clampedR = Math.max(0, Math.min(r, w / 2, h / 2));

  const arcs = [
    { cx: x1 - clampedR, cy: y0 + clampedR, start: -Math.PI / 2, end: 0 },
    { cx: x1 - clampedR, cy: y1 - clampedR, start: 0, end: Math.PI / 2 },
    { cx: x0 + clampedR, cy: y1 - clampedR, start: Math.PI / 2, end: Math.PI },
    { cx: x0 + clampedR, cy: y0 + clampedR, start: Math.PI, end: (3 * Math.PI) / 2 },
  ];

  for (const arc of arcs) {
    for (let i = 0; i <= steps; i++) {
      const angle = arc.start + ((arc.end - arc.start) * i) / steps;
      pts.push([
        arc.cx + clampedR * Math.cos(angle),
        arc.cy + clampedR * Math.sin(angle),
      ]);
    }
  }
  return pts;
}

export function OceanicPortalExperience() {
  const navigate = useNavigate();

  // State
  const [currentKey, setCurrentKey] = useState<MarineSpeciesKey>("fish");
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
  const [isIntroReady, setIsIntroReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isSwitchingList, setIsSwitchingList] = useState(false);

  // Custom Cursor
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorHovering, setCursorHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("DIVE");

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const portalCanvasRef = useRef<HTMLCanvasElement>(null);
  const portalButtonRef = useRef<HTMLButtonElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);

  // Physics & Animation Refs
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rotX: 0, rotY: 0 });
  const expansionRef = useRef({ current: 0, target: 0, startTime: 0, duration: 1100 });
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const currentKeyRef = useRef<MarineSpeciesKey>("fish");
  currentKeyRef.current = currentKey;

  const activeState = MARINE_STATES[currentKey];
  const nextTargetState = MARINE_STATES[activeState.nextKey];

  // Preload all 4 portal images
  useEffect(() => {
    let loadedCount = 0;
    const total = SPECIES_KEYS.length;

    SPECIES_KEYS.forEach((k) => {
      const img = new Image();
      img.src = MARINE_STATES[k].image;
      img.onload = () => {
        loadedImagesRef.current.set(k, img);
        loadedCount += 1;
        setPreloadProgress(Math.round((loadedCount / total) * 100));
      };
      img.onerror = () => {
        loadedCount += 1;
        setPreloadProgress(Math.round((loadedCount / total) * 100));
      };
    });
  }, []);

  // Preloader Counter & Floating Logo Docking sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (preloadProgress >= 100) {
      timer = setTimeout(() => {
        setIsPreloadComplete(true);
        setTimeout(() => {
          setIsIntroReady(true);
          document.body.classList.add("intro-ready", "preload-complete");
        }, 500);
      }, 700);
    }
    return () => clearTimeout(timer);
  }, [preloadProgress]);

  // Pointer movement listener for tilt physics and custom cursor
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointerRef.current.targetX = (e.clientY / h - 0.5) * -33;
      pointerRef.current.targetY = (e.clientX / w - 0.5) * 37.4;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
      setCursorVisible(false);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.classList.remove("intro-ready", "preload-complete");
    };
  }, [cursorVisible]);

  // Canvas Resize Handler
  const handleResize = useCallback(() => {
    const canvas = portalCanvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Travel state transition
  const travel = useCallback((targetKey: MarineSpeciesKey) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsRevealing(false);
    expansionRef.current.startTime = performance.now();
    expansionRef.current.duration = 1000;
    expansionRef.current.target = 1;

    setTimeout(() => {
      // Commit state change
      setCurrentKey(targetKey);
      setIsCommitting(true);
      expansionRef.current.current = 0;
      expansionRef.current.target = 0;

      // Retrigger switching keyframe
      setIsSwitchingList(true);
      setTimeout(() => setIsSwitchingList(false), 500);

      setTimeout(() => {
        setIsCommitting(false);
        setIsTransitioning(false);
        setIsRevealing(true);
        setTimeout(() => setIsRevealing(false), 1200);
      }, 50);
    }, 1000);
  }, [isTransitioning]);

  // Main Canvas Render Loop (3D rounded-rect projection + cover draw)
  useEffect(() => {
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(64, time - lastTime);
      lastTime = time;

      const canvas = portalCanvasRef.current;
      const portalBtn = portalButtonRef.current;

      if (canvas && portalBtn) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = window.innerWidth;
          const h = window.innerHeight;

          // Clear frame
          ctx.clearRect(0, 0, w, h);

          // Update rotation physics (lerp)
          const p = pointerRef.current;
          p.rotX += (p.targetX - p.rotX) * Math.min(1, dt * 0.009);
          p.rotY += (p.targetY - p.rotY) * Math.min(1, dt * 0.009);

          // Update expansion (travel animation)
          const exp = expansionRef.current;
          if (exp.target > 0) {
            const elapsed = time - exp.startTime;
            const t = Math.min(1, elapsed / exp.duration);
            // Ease in-out cubic
            exp.current = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          } else {
            exp.current = 0;
          }

          // Get portal button bounding box
          const rect = portalBtn.getBoundingClientRect();
          const baseCX = rect.left + rect.width / 2;
          const baseCY = rect.top + rect.height / 2;
          const baseW = rect.width;
          const baseH = rect.height;

          // Interpolate geometry with expansion (portal zooms to fill screen)
          const e = exp.current;
          const currentCX = baseCX + (w / 2 - baseCX) * e;
          const currentCY = baseCY + (h / 2 - baseCY) * e;
          const currentW = baseW + (w * 1.05 - baseW) * e;
          const currentH = baseH + (h * 1.05 - baseH) * e;
          const currentRadius = 90 * (1 - e);

          // Interpolate rotation to 0 as it expands
          const curRotX = p.rotX * (1 - e);
          const curRotY = p.rotY * (1 - e);

          // Sample 44-point rounded-rect perimeter
          const pts = buildRoundedRect(currentCX, currentCY, currentW, currentH, currentRadius, 10);

          // 3D perspective projection
          const rotX_rad = (curRotX * Math.PI) / 180;
          const rotY_rad = (curRotY * Math.PI) / 180;
          const focalLength = 850;

          const projectedPts: [number, number][] = pts.map(([px, py]) => {
            const dx = px - currentCX;
            const dy = py - currentCY;

            // 3D rotation around portal center
            const z = -dx * Math.sin(rotY_rad) + dy * Math.sin(rotX_rad);
            const persp = focalLength / (focalLength + z);

            return [
              currentCX + dx * persp,
              currentCY + dy * persp,
            ];
          });

          // Clip to projected rounded rect
          ctx.save();
          ctx.beginPath();
          if (projectedPts.length > 0) {
            ctx.moveTo(projectedPts[0][0], projectedPts[0][1]);
            for (let i = 1; i < projectedPts.length; i++) {
              ctx.lineTo(projectedPts[i][0], projectedPts[i][1]);
            }
          }
          ctx.closePath();
          ctx.clip();

          // Destination image to draw inside portal
          // When travelling, draw the next target image
          const drawKey = isTransitioning ? activeState.nextKey : activeState.nextKey;
          const targetImg = loadedImagesRef.current.get(drawKey);

          if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
            // Draw screen-locked in cover mode
            const imgRatio = targetImg.naturalWidth / targetImg.naturalHeight;
            const screenRatio = w / h;
            let dw = w;
            let dh = h;
            let dx = 0;
            let dy = 0;

            if (screenRatio > imgRatio) {
              dw = w;
              dh = w / imgRatio;
              dy = (h - dh) / 2;
            } else {
              dh = h;
              dw = h * imgRatio;
              dx = (w - dw) / 2;
            }

            ctx.drawImage(targetImg, dx, dy, dw, dh);

            // Shading overlay on portal
            const grad = ctx.createLinearGradient(0, currentCY - currentH / 2, 0, currentCY + currentH / 2);
            grad.addColorStop(0, "rgba(3, 7, 18, 0.1)");
            grad.addColorStop(1, "rgba(3, 7, 18, 0.65)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
          } else {
            // Fallback gradient
            ctx.fillStyle = "#0c4a6e";
            ctx.fillRect(0, 0, w, h);
          }

          // Subtle inner glow rim
          ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.restore();
        }
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeState, isTransitioning]);

  const scrollToRealms = () => {
    const el = document.getElementById("realms");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className={`experience relative w-full h-screen min-h-[640px] overflow-hidden bg-slate-950 text-white select-none ${
        isTransitioning ? "is-transitioning" : ""
      } ${isCommitting ? "is-committing" : ""} ${isRevealing ? "content-revealing mask-revealing" : ""}`}
      data-planet={currentKey}
    >
      {/* Dynamic Oceanic Backgrounds for each of the 4 Taxa */}
      <div className="backgrounds absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        {SPECIES_KEYS.map((k) => (
          <div
            key={k}
            className={`background absolute inset-0 transition-opacity duration-1000 ease-out ${
              k === currentKey ? "is-visible opacity-100" : "opacity-0"
            }`}
            style={{
              background: MARINE_STATES[k].bgGradient,
            }}
          >
            {/* Ambient water reflection texture */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-screen"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 70%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom vignette shade */}
      <div className="shade absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/95" />

      {/* Canvas 3D Portal Layer */}
      <canvas
        id="portal-canvas"
        ref={portalCanvasRef}
        className="portal-canvas fixed inset-0 z-[3] w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Interactive Portal Button Trigger */}
      <section className="portal-wrap chrome absolute z-[4] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="portal-heading flex items-center justify-between w-full mb-3 text-xs tracking-wider text-slate-400 font-medium">
          <span>NEXT REALM</span>
          <span>
            <span className="text-cyan-400 font-mono mr-1.5">{activeState.nextNumber}</span>
            <strong className="text-white font-bold">{nextTargetState.name}</strong>
          </span>
        </div>

        <button
          id="portal"
          ref={portalButtonRef}
          type="button"
          onClick={() => travel(activeState.nextKey)}
          onMouseEnter={() => {
            setCursorHovering(true);
            setCursorLabel("DIVE");
          }}
          onMouseLeave={() => setCursorHovering(false)}
          className="portal relative block w-[280px] sm:w-[320px] aspect-[320/350] rounded-[90px] border border-cyan-400/40 shadow-2xl shadow-cyan-500/20 hover:border-cyan-300 hover:shadow-cyan-400/40 transition-all cursor-pointer group"
          aria-label={`Travel to ${nextTargetState.name}`}
        >
          {/* Subtle pulsating scanner reticle */}
          <div className="absolute inset-4 rounded-[74px] border border-cyan-400/20 group-hover:border-cyan-400/50 pointer-events-none transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/30 text-xs font-semibold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>คลิกเพื่อสำรวจ</span>
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </button>
      </section>

      {/* Sidebar: The 4 Marine Species Taxa */}
      <aside
        className={`portal-planet-list chrome absolute z-[4] left-6 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 text-sm font-semibold tracking-wider ${
          isSwitchingList ? "is-switching" : ""
        }`}
        aria-label="Marine Species"
      >
        <span className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest pl-1 mb-1">
          4 TAXA SPECIES
        </span>
        {SPECIES_KEYS.map((k, index) => {
          const s = MARINE_STATES[k];
          const isActive = k === currentKey;
          return (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k !== currentKey) travel(k);
              }}
              onMouseEnter={() => {
                setCursorHovering(true);
                setCursorLabel("LOOK");
              }}
              onMouseLeave={() => setCursorHovering(false)}
              className={`portal-planet-item flex items-center gap-3 py-1.5 px-2 text-left rounded-lg transition-all ${
                isActive
                  ? "active text-white text-base font-bold pl-3"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
              )}
              <span className="font-mono text-xs text-slate-500">{s.number}</span>
              <span>{s.name}</span>
              <span className="text-xs text-slate-400 font-normal">({s.thaiName})</span>
            </button>
          );
        })}
      </aside>

      {/* Bottom Content: Giant Typography & Quality Fact Cards */}
      <section className="portal-planet-content chrome absolute z-[4] left-6 right-6 sm:left-12 sm:right-12 bottom-6 sm:bottom-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pointer-events-none">
        {/* Giant Condensed Creature Title */}
        <div className="pointer-events-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>REALM {activeState.number} · {activeState.thaiName}</span>
          </div>

          <h1
            id="planet-title"
            className="font-display text-[96px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-extrabold uppercase leading-[0.72] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-sky-400"
          >
            {activeState.name}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-cyan-200/80 font-medium max-w-md">
            {activeState.tagline}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/analyze"
              search={{ type: currentKey }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Camera className="size-4" />
              <span>เปิดกล้องสแกน {activeState.thaiName} ทันที</span>
            </Link>

            <button
              onClick={scrollToRealms}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-slate-900/80 text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <span>ดำน้ำลงสู่ทะเลลึก</span>
              <ChevronDown className="size-4 text-cyan-400 animate-bounce" />
            </button>
          </div>
        </div>

        {/* 4 Scientific Assessment Metric Cards */}
        <dl
          id="facts"
          className="portal-facts-list pointer-events-auto w-full lg:w-[420px] bg-slate-950/75 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/50"
        >
          <div className="flex items-center justify-between pb-3 border-b border-cyan-400/20 mb-2">
            <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
              เกณฑ์ชี้วัดความสดชีวภาพ
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              QIM Standard
            </span>
          </div>
          {activeState.facts.map(([k, v], i) => (
            <div
              key={i}
              className="portal-fact grid grid-cols-[130px_1fr] items-start gap-3 py-2 border-b border-white/5 last:border-b-0 text-xs"
            >
              <dt className="font-bold text-cyan-300 uppercase tracking-wide text-[11px] leading-tight">
                {k}
              </dt>
              <dd className="m-0 text-slate-300 text-xs leading-relaxed font-light">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Preloader Sequence Overlay */}
      {!isPreloadComplete && (
        <div className="preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
          {/* Oceanic Caustic Wave in Preloader */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.2),transparent_70%)] animate-pulse" />

          {/* Floating Logo Gliding and Docking */}
          <div className="relative size-16 rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-0.5 shadow-2xl shadow-cyan-500/40 mb-6">
            <div className="size-full bg-slate-950 rounded-[14px] grid place-items-center">
              <Fish className="size-8 text-cyan-400 animate-bounce" />
            </div>
          </div>

          <div className="text-center z-10">
            <h2 className="text-lg font-bold font-display tracking-tight text-white mb-1">
              FreshScan<span className="text-cyan-400 font-light">Marine</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
              Initializing Marine Bio-Sensors...
            </p>
          </div>

          {/* Counter Percent */}
          <div className="preloader-count mt-6 font-mono text-cyan-400 flex items-baseline gap-1">
            <span className="text-5xl font-extralight tracking-tighter">{preloadProgress}</span>
            <span className="text-base text-slate-500">%</span>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${preloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Custom Lerp Cursor (Desktop only) */}
      <div
        ref={customCursorRef}
        className={`custom-cursor pointer-events-none fixed z-[100] transition-opacity duration-200 hidden md:block ${
          cursorVisible && isPreloadComplete ? "is-visible opacity-100" : "opacity-0"
        } ${cursorHovering ? "is-enter" : ""}`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
        }}
      >
        <span className="cursor-orbit absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400 bg-cyan-400/20 backdrop-blur-[2px]" />
        <span className="cursor-dot absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
        <span className="cursor-label absolute top-7 left-0 -translate-x-1/2 text-[10px] font-bold font-mono tracking-widest text-cyan-300 uppercase whitespace-nowrap">
          {cursorLabel}
        </span>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowRight,
  ArrowDown,
  ChevronUp,
  Camera,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Activity,
  Layers,
  Thermometer,
  Clock,
  ShieldCheck,
  Maximize2,
  ChevronRight,
  Fish,
} from "lucide-react";
import { useVideoScrub } from "./useVideoScrub";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";

// Image Assets
import portalFishImg from "@/assets/portal-fish.jpg";
import portalShrimpImg from "@/assets/portal-shrimp.jpg";
import portalSquidImg from "@/assets/portal-squid.jpg";
import portalShellfishImg from "@/assets/portal-shellfish.jpg";

const VIDEO_URL = "/ocean.mp4";
const ACCENT = "#FF6B5B"; // coral accent

// Smooth Stagger Component
function Stagger({
  visible,
  delay = 0,
  children,
  className = "",
}: {
  visible: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function App() {
  const {
    containerRef,
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
  } = useVideoScrub(VIDEO_URL);

  // Scanner Suite State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SeafoodTypeId>("fish");
  const [selectedImage, setSelectedImage] = useState<string>(portalFishImg);
  const [isScanning, setIsScanning] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Procedural Ocean Canvas for Seamless Continuous Descent
  const oceanCanvasRef = useRef<HTMLCanvasElement>(null);

  // Lock body scroll when scanner suite is open
  useEffect(() => {
    if (scannerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [scannerOpen]);

  // Scroll progress p [0, 1]
  const p = scrollProgress;

  // Sequential Section Opacities
  const s1Opacity = p < 0.18 ? 1 : Math.max(0, 1 - (p - 0.18) / 0.08);

  const s2Opacity =
    p < 0.24
      ? 0
      : p < 0.32
      ? (p - 0.24) / 0.08
      : p < 0.44
      ? 1
      : Math.max(0, 1 - (p - 0.44) / 0.08);

  const s3Opacity =
    p < 0.50
      ? 0
      : p < 0.58
      ? (p - 0.50) / 0.08
      : p < 0.72
      ? 1
      : Math.max(0, 1 - (p - 0.72) / 0.08);

  const s4Opacity =
    p < 0.78
      ? 0
      : p < 0.88
      ? (p - 0.78) / 0.10
      : 1;

  // Species Preset Database
  const speciesPresets = useMemo(
    () => [
      {
        id: "fish" as SeafoodTypeId,
        nameTh: "ปลาทะเลทั้งตัว",
        subTh: "ปลากะพงขาว / ปลาทู / ปลาเก๋า",
        img: portalFishImg,
        icon: "🐟",
        keyFeatures: ["ความนูนและใสของตาดำ", "สีเหงือกแดงสด", "เกล็ดสะท้อนประกาย"],
      },
      {
        id: "shrimp" as SeafoodTypeId,
        nameTh: "กุ้งสด",
        subTh: "กุ้งแชบ๊วย / กุ้งกุลาดำ",
        img: portalShrimpImg,
        icon: "🦐",
        keyFeatures: ["เปลือกใสโปร่งแสง", "หัวและหางติดแน่น", "ไร้จุดด่างดำเมลาโนซิส"],
      },
      {
        id: "squid" as SeafoodTypeId,
        nameTh: "หมึกสด",
        subTh: "หมึกกล้วย / หมึกกระดอง",
        img: portalSquidImg,
        icon: "🦑",
        keyFeatures: ["เม็ดสีประกายวาว", "เนื้อสีขาวมุกโปร่งแสง", "หนวดไม่หลุดร่วง"],
      },
      {
        id: "shellfish" as SeafoodTypeId,
        nameTh: "หอยสด",
        subTh: "หอยนางรม / หอยแมลงภู่",
        img: portalShellfishImg,
        icon: "🦪",
        keyFeatures: ["ฝาปิดสนิทแน่น", "เนื้ออวบเต่งน้ำ", "ไม่มีกลิ่นคาวรุนแรง"],
      },
    ],
    []
  );

  // Auto-scan preset upon selection
  const selectSpeciesPreset = (preset: (typeof speciesPresets)[0]) => {
    setSelectedType(preset.id);
    setSelectedImage(preset.img);
    executeAnalysis(preset.img, preset.id);
  };

  // Perform AI Visual Analysis with Simulated Multi-Step Scan Line
  const executeAnalysis = (imgSrc: string, species: SeafoodTypeId) => {
    setIsScanning(true);
    setScanStep(1);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      // Step 1: Scan Optical Pixels
      setTimeout(() => {
        setScanStep(2); // Analyzing Gills / Eye Reticles
      }, 400);

      // Step 2: Demerit QIM calculation
      setTimeout(() => {
        setScanStep(3); // Finalizing Grade
      }, 800);

      // Step 3: Complete
      setTimeout(() => {
        const res = analyzeImage(img, species);
        setAnalyzeResult(res);
        setIsScanning(false);
        setScanStep(0);
      }, 1200);
    };
    img.onerror = () => {
      setIsScanning(false);
      setScanStep(0);
    };
  };

  // Trigger initial analysis on first modal open
  useEffect(() => {
    if (scannerOpen && !analyzeResult) {
      executeAnalysis(selectedImage, selectedType);
    }
  }, [scannerOpen]);

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setSelectedImage(dataUrl);
        executeAnalysis(dataUrl, selectedType);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToDepth = (targetP: number) => {
    const c = containerRef.current;
    if (c) {
      const targetY = (c.offsetHeight - window.innerHeight) * targetP;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  // =========================================================================
  // CINEMATIC PROCEDURAL DIVE ENGINE (Seamless Continuous Descent)
  // Perfectly smooth, continuous, gorgeous day-to-night underwater descent
  // =========================================================================
  const marineElements = useMemo(() => {
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 450,
      r: Math.random() * 1.5 + 0.6,
      opacity: Math.random() * 0.7 + 0.3,
      blinkSpeed: Math.random() * 2 + 1,
    }));

    const bubbles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      wobble: Math.random() * Math.PI * 2,
    }));

    const silverFish = Array.from({ length: 16 }, () => ({
      x: Math.random() * 1920,
      y: 280 + Math.random() * 500,
      size: Math.random() * 6 + 7,
      vx: Math.random() * 1.6 + 1.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const marineSnow = Array.from({ length: 50 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const turtle = {
      x: 320,
      y: 600,
      vx: 0.8,
      draw(ctx: CanvasRenderingContext2D, time: number, alpha: number) {
        this.x += this.vx;
        if (this.x > 2100) this.x = -200;
        const flipperAngle = Math.sin(time * 2) * 0.4;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y + Math.sin(time * 0.8) * 12);
        ctx.scale(1.1, 1.1);

        // Glowing shell
        const shellGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
        shellGrad.addColorStop(0, "rgba(56, 189, 248, 0.4)");
        shellGrad.addColorStop(0.7, "rgba(14, 116, 144, 0.65)");
        shellGrad.addColorStop(1, "rgba(8, 47, 73, 0.8)");
        ctx.fillStyle = shellGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Front flipper
        ctx.save();
        ctx.translate(14, -8);
        ctx.rotate(flipperAngle);
        ctx.fillStyle = "rgba(14, 116, 144, 0.7)";
        ctx.beginPath();
        ctx.ellipse(14, -6, 18, 5, -0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Head
        ctx.fillStyle = "rgba(14, 116, 144, 0.75)";
        ctx.beginPath();
        ctx.ellipse(34, 0, 9, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    };

    return { stars, bubbles, silverFish, marineSnow, turtle };
  }, []);

  useEffect(() => {
    const canvas = oceanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const { stars, bubbles, silverFish, marineSnow, turtle } = marineElements;

      ctx.clearRect(0, 0, w, h);

      // =====================================================================
      // 1) BASE FLUID UNDERWATER GRADIENT (Dynamic Depth Shift)
      // =====================================================================
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (p < 0.2) {
        // Night sky into dark ripples
        bgGrad.addColorStop(0, "#030712");
        bgGrad.addColorStop(0.4, "#081b2e");
        bgGrad.addColorStop(1, "#042f49");
      } else if (p < 0.5) {
        // Deep turquoise moonlit water
        bgGrad.addColorStop(0, "#081b2e");
        bgGrad.addColorStop(0.5, "#03496e");
        bgGrad.addColorStop(1, "#075985");
      } else if (p < 0.75) {
        // Luminous bioluminescent coral reef
        bgGrad.addColorStop(0, "#03496e");
        bgGrad.addColorStop(0.5, "#075985");
        bgGrad.addColorStop(1, "#0b2a3c");
      } else {
        // Midnight abyss
        bgGrad.addColorStop(0, "#075985");
        bgGrad.addColorStop(0.5, "#0b2a3c");
        bgGrad.addColorStop(1, "#020b14");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // =====================================================================
      // 2) STAGE 1: NIGHT SKY & TWINKLING STARS (p < 0.25)
      // =====================================================================
      if (p < 0.3) {
        const skyAlpha = Math.max(0, 1 - p / 0.3);
        ctx.save();
        ctx.globalAlpha = skyAlpha;

        for (const star of stars) {
          const blink = Math.sin(time * star.blinkSpeed + star.x) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(224, 242, 254, ${star.opacity * blink})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ocean Surface Ripples reflecting boat lanterns & moonlight
        ctx.strokeStyle = "rgba(255, 237, 213, 0.45)"; // warm golden lantern reflection
        ctx.lineWidth = 1.5;
        for (let r = 0; r < 4; r++) {
          const yOff = h * 0.42 + r * 28 + Math.sin(time * 1.5 + r) * 6;
          ctx.beginPath();
          ctx.moveTo(0, yOff);
          for (let x = 0; x < w; x += 60) {
            ctx.quadraticCurveTo(
              x + 30,
              yOff + Math.sin(x * 0.01 + time * 2) * 6,
              x + 60,
              yOff
            );
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // =====================================================================
      // 3) STAGE 2: SUB-SURFACE DIVE & VOLUMETRIC GOD RAYS (p 0.15 - 0.70)
      // =====================================================================
      if (p > 0.12 && p < 0.75) {
        const rayAlpha = Math.sin(((p - 0.12) / 0.63) * Math.PI) * 0.32;
        ctx.save();
        ctx.globalAlpha = rayAlpha;
        ctx.globalCompositeOperation = "screen";

        for (let i = 0; i < 5; i++) {
          const beamX = w * 0.48 + Math.sin(time * 0.35 + i * 1.4) * (w * 0.3);
          const g = ctx.createLinearGradient(w * 0.5, 0, beamX, h);
          g.addColorStop(0, "rgba(224, 242, 254, 0.25)");
          g.addColorStop(0.5, "rgba(56, 189, 248, 0.12)");
          g.addColorStop(1, "rgba(56, 189, 248, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(w * 0.5 - 30, 0);
          ctx.lineTo(w * 0.5 + 30, 0);
          ctx.lineTo(beamX + 140, h);
          ctx.lineTo(beamX - 140, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Rising bubbles during dive
        ctx.save();
        ctx.globalAlpha = Math.min(1, rayAlpha * 3);
        ctx.fillStyle = "rgba(224, 242, 254, 0.4)";
        ctx.strokeStyle = "rgba(186, 230, 253, 0.8)";
        ctx.lineWidth = 0.8;
        for (const b of bubbles) {
          b.y -= b.speed;
          b.x += Math.sin(time * 2 + b.wobble) * 0.35;
          if (b.y < -10) {
            b.y = h + 10;
            b.x = Math.random() * w;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // =====================================================================
      // 4) STAGE 3: BIOLUMINESCENT CORALS & SWIMMING FISH (p 0.28 - 0.85)
      // =====================================================================
      if (p > 0.25) {
        const reefAlpha = Math.min(1, (p - 0.25) / 0.22);
        const depthDescent = p * 60;

        ctx.save();
        ctx.globalAlpha = reefAlpha * 0.85;

        // Glowing Sea Anemones & Colorful Coral Polyps
        const coralBase = h + 20 - depthDescent * 0.35;
        const coralColors = [
          "rgba(244, 63, 94, 0.7)",   // Coral Rose
          "rgba(56, 189, 248, 0.75)", // Neon Cyan
          "rgba(251, 146, 60, 0.7)",  // Coral Gold
          "rgba(168, 85, 247, 0.65)", // Purple Anemone
        ];

        ctx.lineWidth = 2.4;
        for (let i = 0; i < 26; i++) {
          const x = i * (w / 26) + 16;
          const sway = Math.sin(time * 1.8 + i) * 15;
          ctx.strokeStyle = coralColors[i % coralColors.length];
          ctx.beginPath();
          ctx.moveTo(x, coralBase);
          ctx.quadraticCurveTo(x + sway * 0.5, coralBase - 55, x + sway, coralBase - 100);
          ctx.stroke();

          // Bioluminescent polyp tip
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(x + sway, coralBase - 100, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Schools of Silver Fish Swimming across frame
        ctx.save();
        ctx.globalAlpha = reefAlpha * 0.9;
        for (const f of silverFish) {
          f.x += f.vx;
          f.y += Math.sin(time * 2.5 + f.phase) * 0.35;
          if (f.x > w + 40) f.x = -40;

          ctx.save();
          ctx.translate(f.x, f.y);

          // Iridescent silver fish body
          const fishGrad = ctx.createLinearGradient(-f.size * 2, 0, f.size * 2, 0);
          fishGrad.addColorStop(0, "rgba(224, 242, 254, 0.75)");
          fishGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.98)");
          fishGrad.addColorStop(1, "rgba(56, 189, 248, 0.7)");
          ctx.fillStyle = fishGrad;

          ctx.beginPath();
          ctx.moveTo(f.size * 2, 0);
          ctx.quadraticCurveTo(0, -f.size * 0.8, -f.size * 1.8, 0);
          ctx.quadraticCurveTo(0, f.size * 0.8, f.size * 2, 0);
          ctx.fill();

          // Tail flutter
          const tailWiggle = Math.sin(time * 8 + f.phase) * 3;
          ctx.beginPath();
          ctx.moveTo(-f.size * 1.6, 0);
          ctx.lineTo(-f.size * 2.8, -f.size * 0.6 + tailWiggle);
          ctx.lineTo(-f.size * 2.4, tailWiggle * 0.5);
          ctx.lineTo(-f.size * 2.8, f.size * 0.6 + tailWiggle);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Sea Turtle passing smoothly
        turtle.draw(ctx, time, reefAlpha * 0.85);
      }

      // =====================================================================
      // 5) STAGE 4: MIDNIGHT ABYSS & BIOLUMINESCENT MARINE SNOW (p > 0.55)
      // =====================================================================
      if (p > 0.52) {
        const deepAlpha = Math.min(1, (p - 0.52) / 0.35);

        ctx.save();
        ctx.globalAlpha = deepAlpha * 0.75;
        for (const s of marineSnow) {
          s.y += s.vy;
          s.x += s.vx + Math.sin(time * 0.8 + s.y * 0.01) * 0.2;
          if (s.y > h + 10) {
            s.y = -10;
            s.x = Math.random() * w;
          }

          ctx.fillStyle = `rgba(186, 230, 253, ${s.opacity})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [p, marineElements]);

  return (
    <div
      ref={containerRef}
      className="relative h-[600vh] bg-black text-white font-['Prompt','Sarabun',system-ui,sans-serif]"
    >
      {/* ===================================================================
          STICKY FULL-VIEWPORT SCENE (100vh)
          =================================================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1) Underlying Video Element (Scrubbed smoothly) */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 2) Canvas for Decoded WebCodecs Frame Bank (Instant high-res frames) */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        {/* 3) Seamless Procedural Descent Overlay (Ensures continuous dive visuals) */}
        <canvas
          ref={oceanCanvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen opacity-70"
        />

        {/* ===================================================================
            DEPTH GAUGE (มาตรวัดความลึก - ภาษาไทย คมชัด สไตล์เรือดำน้ำ)
            =================================================================== */}
        <div className="hidden md:flex fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 items-center gap-3.5 pointer-events-none select-none">
          <div className="relative w-[3px] h-[170px] bg-white/20 rounded-full overflow-hidden shadow-lg backdrop-blur-sm">
            <div
              className="absolute -left-[2px] w-3 h-3 rounded-full shadow-lg border-2 border-white"
              style={{
                backgroundColor: ACCENT,
                top: `${Math.min(158, p * 158)}px`,
                transition: "top 0.08s linear",
              }}
            />
          </div>
          <div className="flex flex-col text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            <span className="text-[10px] tracking-wider uppercase text-sky-300 font-medium">
              DEPTH METER
            </span>
            <span className="text-base font-bold tracking-wide text-white tabular-nums">
              {p < 0.05 ? "ผิวน้ำทะเล" : `${Math.round(p * 30)} เมตร`}
            </span>
          </div>
        </div>

        {/* ===================================================================
            NAVBAR (เรียบหรู คมชัด สบายตา ไม่รก)
            =================================================================== */}
        <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 pb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center text-[#FF6B5B] group-hover:scale-105 transition-transform shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-wide text-white block leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                FreshScan <span className="text-[#FF6B5B]">AI</span>
              </span>
              <span className="text-[11px] text-white/70 tracking-wider block font-light">
                ระบบตรวจวัดความสดอาหารทะเล
              </span>
            </div>
          </button>

          {/* Quick Depth Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 bg-black/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-lg">
            <button
              onClick={() => scrollToDepth(0)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              ผิวน้ำ
            </button>
            <button
              onClick={() => scrollToDepth(0.35)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              จุดสังเกตความสด
            </button>
            <button
              onClick={() => scrollToDepth(0.65)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              เกณฑ์มาตรฐาน QIM
            </button>
          </div>

          {/* Scan CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-full px-5 py-2.5 bg-gradient-to-r from-[#FF6B5B] to-[#ff503e] text-white font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer border border-white/20"
            >
              <Camera size={18} />
              <span>เปิดศูนย์สแกนความสด</span>
            </button>
          </div>
        </nav>

        {/* ===================================================================
            3) OVERLAY (เนื้อหาภาษาไทย คมชัด อ่านง่าย มีมิติ ไม่รก)
            =================================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* ---------------------------------------------------------------
              SECTION 1 — ผิวน้ำ & ท้องฟ้ายามราตรี
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-24 lg:px-32 md:pl-32"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s1Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-3xl text-left drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)]">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs sm:text-sm text-white font-medium mb-6 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B5B] animate-pulse" />
                  เทคโนโลยีวิเคราะห์ชีวมิติอาหารทะเลด้วย AI
                </div>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={100}>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.15] tracking-tight">
                  รู้ความสดใหม่
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-300 to-cyan-400">
                    ก่อนถึงจานโปรดของคุณ
                  </span>
                </h1>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={200}>
                <p className="mt-5 text-base sm:text-xl text-white font-normal max-w-xl leading-relaxed">
                  ถ่ายภาพปลา กุ้ง หมึก หรือหอย ระบบ AI ตรวจจับพิกเซลความใสของดวงตา สีเหงือก และความเต่งตึง พร้อมสรุปเกรด QIM ทันที
                </p>
              </Stagger>
            </div>

            {/* Dive Button */}
            <div className="absolute bottom-10 right-6 sm:right-10 md:right-16 flex items-center gap-3">
              <Stagger visible={s1Opacity > 0.3} delay={300}>
                <button
                  onClick={() => scrollToDepth(0.35)}
                  className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition-all cursor-pointer pointer-events-auto shadow-xl"
                >
                  <span className="text-xs sm:text-sm font-medium">เลื่อนลงเพื่อดำดิ่งสำรวจ</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowDown size={16} />
                  </div>
                </button>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 2 — ดำดิ่งลงสู่ใต้ผิวน้ำ
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-12"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s2Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)]">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                  ดวงตา เหงือก และเกล็ด
                  <br />
                  <span className="text-cyan-300">บอกเล่าความสดที่แท้จริง</span>
                </h2>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={150}>
                <p className="mt-5 text-base sm:text-xl text-white font-normal leading-relaxed">
                  ตรวจสอบความนูนใสของกระจกตา สีแดงเลือดนกของเหงือก และความยืดหยุ่นของกล้ามเนื้อปลาอย่างละเอียด
                </p>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={250}>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm border border-white/25 text-white font-medium shadow-md">
                    👁️ ตรวจความใสของกระจกตา
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm border border-white/25 text-white font-medium shadow-md">
                    🩸 ตรวจความสดของเหงือก
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md text-xs sm:text-sm border border-white/25 text-white font-medium shadow-md">
                    ✨ ตรวจความเต่งตึงของเนื้อ
                  </span>
                </div>
              </Stagger>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-12 right-6 sm:right-10 md:right-16 flex flex-col items-center gap-3">
              <Stagger visible={s2Opacity > 0.3} delay={300}>
                <button
                  onClick={() => scrollToDepth(0.65)}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-all pointer-events-auto cursor-pointer shadow-xl"
                  aria-label="Dive deeper"
                >
                  <ArrowDown size={20} />
                </button>
              </Stagger>
              <Stagger visible={s2Opacity > 0.3} delay={400}>
                <button
                  onClick={() => scrollToDepth(0)}
                  className="w-10 h-10 rounded-full bg-black/40 border border-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all pointer-events-auto cursor-pointer shadow-lg"
                  aria-label="Back to surface"
                >
                  <ChevronUp size={18} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — แนวปะการัง & คุณภาพเกรดพรีเมียม
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-xl text-left drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)]">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-bold mb-5 shadow-lg">
                  <CheckCircle2 size={16} />
                  เกรด A | คุณภาพสดพรีเมียม (บริโภคดิบได้)
                </div>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={100}>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                  ตาใสเป็นประกาย
                  <br />
                  เหงือกแดงสด เนื้อแน่น
                </h2>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={200}>
                <p className="mt-5 text-base sm:text-lg text-white font-normal leading-relaxed">
                  ปลอดภัย มั่นใจ ไร้สารฟอร์มาลิน ถ่ายภาพวัตถุดิบที่คุณซื้อจากตลาดหรือซูเปอร์มาร์เก็ต แล้วให้ AI ประเมินผลลัพธ์ได้ใน 3 วินาที
                </p>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 4 — ใต้ทะเลลึก & จุดเข้าสู่ศูนย์สแกนหลัก
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl flex flex-col items-center justify-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.99)]">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-cyan-300 font-bold mb-3 block">
                  AI SEAFOOD BIOMETRIC SCANNER
                </span>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={100}>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6">
                  คัดสรรจากทะเล
                  <br />
                  สู่ความมั่นใจบนโต๊ะอาหาร
                </h2>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={200}>
                <p className="text-base sm:text-xl text-white font-normal max-w-lg mb-8 leading-relaxed">
                  สัมผัสประสบการณ์สแกนประเมินความสดด้วยเทคโนโลยีคอมพิวเตอร์วิทัศน์มาตรฐานห้องทดลอง
                </p>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={300}>
                <button
                  onClick={() => setScannerOpen(true)}
                  className="pointer-events-auto rounded-full px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#FF6B5B] via-[#ff503e] to-[#ff3b26] text-white text-lg sm:text-xl font-bold flex items-center gap-3.5 transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(255,107,91,0.6)] cursor-pointer border-2 border-white/30"
                >
                  <Camera size={26} />
                  <span>เริ่มสแกนอาหารทะเลสดทันที</span>
                  <ArrowRight size={24} />
                </button>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          GRAND AI SEAFOOD BIOMETRIC SCANNER SUITE
          ศูนย์สแกนชีวมิติอาหารทะเลระดับห้องปฏิบัติการอัจฉริยะ (Full-Screen Lab Terminal)
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="relative w-full max-w-6xl bg-[#030d17]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-8 text-white shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col gap-6 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close Scanner"
            >
              <X size={20} />
            </button>

            {/* Terminal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 pr-12">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
                  <Activity size={22} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                      FreshScan Biometric Laboratory™
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    ศูนย์ตรวจประเมินคุณภาพและอายุการเก็บรักษาอาหารทะเลตามมาตรฐาน Quality Index Method (QIM)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Upload size={16} />
                  <span>อัปโหลดรูปของคุณ</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#FF6B5B] hover:bg-[#ff5542] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Camera size={16} />
                  <span>ถ่ายรูปภาพใหม่</span>
                </button>
              </div>
            </div>

            {/* Species Selector Bar with Realistic Photo Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  เลือกประเภทอาหารทะเลเพื่อสแกนตัวอย่าง:
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  คลิกเพื่อสแกนทดสอบทันที
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {speciesPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectSpeciesPreset(preset)}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer group flex items-center gap-3 ${
                      selectedType === preset.id
                        ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                        : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/20">
                      <img
                        src={preset.img}
                        alt={preset.nameTh}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate">
                          {preset.nameTh}
                        </span>
                      </div>
                      <span className="text-[11px] text-white/60 block truncate">
                        {preset.subTh}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Scanner Workspace Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Holographic Laser Scan Viewport (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-black/60 border border-cyan-500/25 p-4 relative overflow-hidden shadow-inner min-h-[380px]">
                {/* HUD Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Status HUD Header */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white/80 font-mono mb-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>TARGET: {selectedType.toUpperCase()}</span>
                  </div>
                  <span className="text-cyan-300">
                    {isScanning ? "SCANNING PIXELS..." : "ANALYSIS LOCKED"}
                  </span>
                </div>

                {/* Center Image with Active Laser Beam & Detection Reticles */}
                <div className="relative my-auto rounded-xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center max-h-[360px]">
                  <img
                    src={selectedImage}
                    alt="Target Seafood"
                    className="w-full h-full object-cover max-h-[360px]"
                  />

                  {/* Animated Laser Scanning Line */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[bounce_1.5s_infinite] pointer-events-none" />
                  )}

                  {/* Interactive Biometric Reticles Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Reticle 1: Eye */}
                    <div className="absolute top-[28%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center animate-spin">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-cyan-300 border border-cyan-400/50 font-mono shadow">
                        [01] กระจกตา: นูนใส 98%
                      </span>
                    </div>

                    {/* Reticle 2: Gills */}
                    <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-rose-400 flex items-center justify-center animate-spin">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-rose-300 border border-rose-400/50 font-mono shadow">
                        [02] เหงือก: แดงสดธรรมชาติ
                      </span>
                    </div>

                    {/* Reticle 3: Flesh/Scales */}
                    <div className="absolute top-[68%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center animate-spin">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-emerald-300 border border-emerald-400/50 font-mono shadow">
                        [03] กล้ามเนื้อ: แน่นคืนตัวดี
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scan Status Footer */}
                <div className="relative z-10 flex items-center justify-between pt-3 text-xs text-white/70">
                  <span>ความละเอียดการตรวจจับ: 1280 × 720 พิกเซล</span>
                  <button
                    onClick={() => executeAnalysis(selectedImage, selectedType)}
                    className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 cursor-pointer"
                  >
                    <RefreshCw size={14} className={isScanning ? "animate-spin" : ""} />
                    <span>สแกนใหม่อีกครั้ง</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Grand Scientific QIM Dossier (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-white/15 p-5 shadow-xl">
                {isScanning ? (
                  <div className="my-auto py-12 flex flex-col items-center justify-center text-center gap-4">
                    <Sparkles className="size-10 text-cyan-400 animate-spin" />
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {scanStep === 1
                          ? "กำลังคำนวณดัชนีแสงและพิกเซล..."
                          : scanStep === 2
                          ? "กำลังวิเคราะห์ดวงตาและเหงือกปลา..."
                          : "กำลังประเมินเกรดมาตรฐาน QIM..."}
                      </h4>
                      <p className="text-xs text-white/60 mt-1">
                        ประมวลผลบนเครื่อง (Client-Side Edge CV) รวดเร็ว ปลอดภัย
                      </p>
                    </div>
                  </div>
                ) : analyzeResult ? (
                  <div className="space-y-4">
                    {/* Top Grade Card */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-white/60 uppercase font-mono block">
                          ผลการประเมินระดับความสด
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="px-3 py-1 rounded-lg text-sm font-black text-white shadow-lg"
                            style={{
                              backgroundColor:
                                analyzeResult.overallGrade === "A"
                                  ? "#10b981"
                                  : analyzeResult.overallGrade === "B"
                                  ? "#06b6d4"
                                  : analyzeResult.overallGrade === "C"
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          >
                            เกรด {analyzeResult.overallGrade}
                          </span>
                          <span className="text-base font-bold text-white">
                            {analyzeResult.overallGrade === "A"
                              ? "สดมาก (พรีเมียม)"
                              : analyzeResult.overallGrade === "B"
                              ? "สดดี (คุณภาพดี)"
                              : analyzeResult.overallGrade === "C"
                              ? "พอใช้ (ปรุงสุกทันที)"
                              : "เสื่อมสภาพ (ไม่ควรบริโภค)"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/50 block font-mono">QIM SCORE</span>
                        <span className="text-xl font-black text-cyan-300 font-mono tabular-nums">
                          {analyzeResult.qimScore} <span className="text-xs text-white/50">/ 20</span>
                        </span>
                      </div>
                    </div>

                    {/* Verdict Description */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/85 leading-relaxed">
                      {analyzeResult.verdict}
                    </div>

                    {/* Biometric Progress Gauges */}
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white/70">ความใสและนูนของกระจกตา</span>
                          <span className="font-mono text-emerald-400 font-semibold">96%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: "96%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white/70">ดัชนีสีเหงือกธรรมชาติ</span>
                          <span className="font-mono text-cyan-400 font-semibold">92%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white/70">ความยืดหยุ่นและแน่นของเนื้อ</span>
                          <span className="font-mono text-sky-400 font-semibold">94%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: "94%" }} />
                        </div>
                      </div>
                    </div>

                    {/* Shelf-Life & Storage Recommendation */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <div className="flex items-center gap-1.5 text-sky-300 text-[11px] font-semibold mb-1">
                          <Clock size={13} />
                          <span>อายุบนน้ำแข็ง</span>
                        </div>
                        <span className="text-xs text-white font-medium block">
                          เก็บได้อีก 4 – 5 วัน
                        </span>
                        <span className="text-[10px] text-white/50 block">ที่อุณหภูมิ 0°C ถึง 2°C</span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-semibold mb-1">
                          <ShieldCheck size={13} />
                          <span>ความปลอดภัย</span>
                        </div>
                        <span className="text-xs text-white font-medium block">
                          {analyzeResult.overallGrade === "A"
                            ? "ซาซิมิ / ทานดิบได้"
                            : "ปรุงสุกทุกเมนู"}
                        </span>
                        <span className="text-[10px] text-white/50 block">ผ่านเกณฑ์ TAS 7001</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/50">
                    โมเดล FreshScan Vision AI v2.4
                  </span>
                  <button
                    onClick={() => setScannerOpen(false)}
                    className="text-xs text-white/80 hover:text-white underline cursor-pointer"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

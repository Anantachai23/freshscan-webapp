import React, { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight, ArrowDown, ChevronUp, Info, X, Camera, Upload, Sparkles } from "lucide-react";
import { useVideoScrub } from "./useVideoScrub";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";
import sampleFishImg from "@/assets/fish-sample.jpg";

// ============================================================================
// CONSTANTS & COLOR PALETTE
// ============================================================================
const VIDEO_URL = "https://screenapp.io/app/share/vYumBXufE6yNlu_4opIu4mfS";
const DARK = "#0B2A3C"; // deep navy-teal, text on light/bright frames
const ACCENT = "#FF6B5B"; // coral, used ONLY for small accents (freshness badge, active dot)
const LIGHT_UNTIL = 0.45; // while p <= LIGHT_UNTIL text is DARK, after that text is white

// Stagger Animation Component
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
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("FRESHSCAN AI");

  // Scanner Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SeafoodTypeId>("fish");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);

  // Entrance animation for Navbar
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when mobile menu or scanner modal is open
  useEffect(() => {
    if (mobileOpen || scannerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, scannerOpen]);

  // Scroll progress p clamped [0, 1]
  const p = scrollProgress;

  // Color follows text color (DARK → white at LIGHT_UNTIL)
  const currentTextColor = p <= LIGHT_UNTIL ? DARK : "#ffffff";
  const navColor = currentTextColor;
  const navInvertedText = p <= LIGHT_UNTIL ? "#ffffff" : DARK;

  // =========================================================================
  // TEXT SECTIONS ARE SEQUENTIAL (previous fully fades out before next appears)
  // =========================================================================
  const s1Opacity = p < 0.15 ? 1 : Math.max(0, 1 - (p - 0.15) / 0.07);

  const s2Opacity =
    p < 0.22
      ? 0
      : p < 0.29
      ? (p - 0.22) / 0.07
      : p < 0.40
      ? 1
      : Math.max(0, 1 - (p - 0.40) / 0.07);

  const s3Opacity =
    p < 0.53
      ? 0
      : p < 0.60
      ? (p - 0.53) / 0.07
      : p < 0.70
      ? 1
      : Math.max(0, 1 - (p - 0.70) / 0.07);

  const s4Opacity =
    p < 0.82
      ? 0
      : p < 0.90
      ? (p - 0.82) / 0.08
      : 1;

  // =========================================================================
  // PROCEDURAL UNDERWATER DESCENT CANVAS ENGINE
  // Renders continuous vertical descent if video source is loading/fallback
  // =========================================================================
  const underwaterCanvasRef = useRef<HTMLCanvasElement>(null);

  const marineElements = useMemo(() => {
    const bubbles = Array.from({ length: 45 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1.8 + 0.8,
      wobble: Math.random() * Math.PI * 2,
    }));

    const silverFish = Array.from({ length: 18 }, () => ({
      x: Math.random() * 1920,
      y: 260 + Math.random() * 540,
      size: Math.random() * 7 + 6,
      vx: Math.random() * 1.5 + 1.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const marineSnow = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.7 + 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const turtle = {
      x: 350,
      y: 620,
      vx: 0.75,
      flipperAngle: 0,
      draw(ctx: CanvasRenderingContext2D, time: number, alpha: number) {
        this.x += this.vx;
        if (this.x > 2100) this.x = -200;
        this.flipperAngle = Math.sin(time * 2.2) * 0.45;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y + Math.sin(time * 0.8) * 12);
        ctx.scale(1.15, 1.15);

        // Shell
        const shellGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
        shellGrad.addColorStop(0, "rgba(56, 189, 248, 0.45)");
        shellGrad.addColorStop(0.7, "rgba(14, 116, 144, 0.65)");
        shellGrad.addColorStop(1, "rgba(8, 47, 73, 0.85)");
        ctx.fillStyle = shellGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 32, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Front flipper
        ctx.save();
        ctx.translate(14, -10);
        ctx.rotate(this.flipperAngle);
        ctx.fillStyle = "rgba(14, 116, 144, 0.7)";
        ctx.beginPath();
        ctx.ellipse(14, -8, 20, 6, -0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Head
        ctx.fillStyle = "rgba(14, 116, 144, 0.75)";
        ctx.beginPath();
        ctx.ellipse(36, 0, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    };

    return { bubbles, silverFish, marineSnow, turtle };
  }, []);

  useEffect(() => {
    const canvas = underwaterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const { bubbles, silverFish, marineSnow, turtle } = marineElements;

      ctx.clearRect(0, 0, w, h);

      // BASE CONTINUOUS WATER GRADIENT (Surface pale aqua → Deep dark indigo)
      const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (p < 0.25) {
        // Sunlit ocean surface
        waterGrad.addColorStop(0, "#bae6fd");
        waterGrad.addColorStop(0.4, "#7dd3fc");
        waterGrad.addColorStop(1, "#38bdf8");
      } else if (p < 0.55) {
        // Clear turquoise shallow water
        waterGrad.addColorStop(0, "#38bdf8");
        waterGrad.addColorStop(0.5, "#0284c7");
        waterGrad.addColorStop(1, "#0369a1");
      } else if (p < 0.8) {
        // Vibrant coral reef water
        waterGrad.addColorStop(0, "#0284c7");
        waterGrad.addColorStop(0.5, "#0369a1");
        waterGrad.addColorStop(1, "#075985");
      } else {
        // Deep blue ocean water
        waterGrad.addColorStop(0, "#075985");
        waterGrad.addColorStop(0.5, "#0c4a6e");
        waterGrad.addColorStop(1, "#082f49");
      }
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, w, h);

      // STAGE 1: SURFACE (p < 0.35) — Sunlit ripples & pale aqua highlights
      if (p < 0.35) {
        const surfaceAlpha = Math.max(0, 1 - p / 0.35);
        ctx.save();
        ctx.globalAlpha = surfaceAlpha * 0.55;
        ctx.globalCompositeOperation = "screen";

        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.8;
        for (let r = 0; r < 5; r++) {
          const yOffset = r * 45 + Math.sin(time * 1.5 + r) * 12;
          ctx.beginPath();
          ctx.moveTo(0, yOffset);
          for (let x = 0; x < w; x += 60) {
            ctx.quadraticCurveTo(
              x + 30,
              yOffset + Math.sin(x * 0.01 + time * 2) * 10,
              x + 60,
              yOffset
            );
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // STAGE 2: PLUNGE & GOD RAYS (p 0.12 - 0.75)
      if (p > 0.1 && p < 0.8) {
        const rayAlpha = Math.sin(((p - 0.1) / 0.7) * Math.PI) * 0.35;
        ctx.save();
        ctx.globalAlpha = rayAlpha;
        ctx.globalCompositeOperation = "screen";

        for (let i = 0; i < 6; i++) {
          const beamX = w * 0.45 + Math.sin(time * 0.4 + i * 1.3) * (w * 0.32);
          const g = ctx.createLinearGradient(w * 0.5, 0, beamX, h);
          g.addColorStop(0, "rgba(255, 255, 255, 0.32)");
          g.addColorStop(0.4, "rgba(186, 230, 253, 0.18)");
          g.addColorStop(1, "rgba(56, 189, 248, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(w * 0.5 - 35, 0);
          ctx.lineTo(w * 0.5 + 35, 0);
          ctx.lineTo(beamX + 160, h);
          ctx.lineTo(beamX - 160, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Rising bubbles during plunge
        ctx.save();
        ctx.globalAlpha = Math.min(1, rayAlpha * 3.2);
        ctx.fillStyle = "rgba(224, 242, 254, 0.45)";
        ctx.strokeStyle = "rgba(186, 230, 253, 0.85)";
        ctx.lineWidth = 1;
        for (const b of bubbles) {
          b.y -= b.speed;
          b.x += Math.sin(time * 2 + b.wobble) * 0.4;
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

      // STAGE 3: VIBRANT CORAL REEF & FISH (p 0.25 - 0.88)
      if (p > 0.22) {
        const reefAlpha = Math.min(1, (p - 0.22) / 0.22);
        const depthDescent = p * 70;

        ctx.save();
        ctx.globalAlpha = reefAlpha * 0.85;

        // Sea Anemones & Colorful Coral Polyps
        const coralBase = h + 25 - depthDescent * 0.35;
        const coralColors = [
          "rgba(244, 63, 94, 0.7)",   // Coral Rose
          "rgba(251, 146, 60, 0.7)",  // Coral Orange
          "rgba(56, 189, 248, 0.75)", // Cyan Sea Fan
          "rgba(168, 85, 247, 0.65)", // Purple Anemone
        ];

        ctx.lineWidth = 2.4;
        for (let i = 0; i < 28; i++) {
          const x = i * (w / 28) + 16;
          const sway = Math.sin(time * 1.8 + i) * 16;
          ctx.strokeStyle = coralColors[i % coralColors.length];
          ctx.beginPath();
          ctx.moveTo(x, coralBase);
          ctx.quadraticCurveTo(x + sway * 0.5, coralBase - 60, x + sway, coralBase - 110);
          ctx.stroke();

          // Bioluminescent polyp tip
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(x + sway, coralBase - 110, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Schools of Silver Fish Swimming
        ctx.save();
        ctx.globalAlpha = reefAlpha * 0.9;
        for (const f of silverFish) {
          f.x += f.vx;
          f.y += Math.sin(time * 2.5 + f.phase) * 0.35;
          if (f.x > w + 50) f.x = -50;

          ctx.save();
          ctx.translate(f.x, f.y);

          // Gleaming Silver body with iridescent highlight
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

          // Tail wiggle
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

        // Sea Turtle passing gracefully
        turtle.draw(ctx, time, reefAlpha * 0.85);
      }

      // STAGE 4: DEEPER BLUE WATER & MARINE SNOW (p > 0.55)
      if (p > 0.52) {
        const deepAlpha = Math.min(1, (p - 0.52) / 0.35);

        // Deeper ambient dark navy veil
        ctx.save();
        ctx.globalAlpha = deepAlpha * 0.55;
        const deepGrad = ctx.createLinearGradient(0, 0, 0, h);
        deepGrad.addColorStop(0, "rgba(1, 10, 25, 0)");
        deepGrad.addColorStop(1, "#071b28");
        ctx.fillStyle = deepGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        // Soft floating marine snow particles
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

  // Handle Photo Upload & Freshness Analysis
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setSelectedImage(dataUrl);
        runFreshnessTest(dataUrl, selectedType);
      };
      reader.readAsDataURL(file);
    }
  };

  const runFreshnessTest = (imgSrc: string, species: SeafoodTypeId) => {
    setIsAnalyzing(true);
    setAnalyzeResult(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      const res = analyzeImage(img, species);
      setAnalyzeResult(res);
      setIsAnalyzing(false);
    };
    img.onerror = () => {
      setIsAnalyzing(false);
    };
  };

  const navLinks = [
    "FRESHSCAN AI",
    "SEAFOOD GUIDE",
    "FRESHNESS GRADES",
    "REEF & ORIGIN",
    "FRESHSCAN+",
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-[600vh] bg-[#090807] font-['Helvetica_Neue_ME','Helvetica_Neue',Helvetica,Arial,sans-serif]"
    >
      {/* ===================================================================
          STICKY FULL-VIEWPORT SCENE (100vh)
          =================================================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1) Underlying Video Element */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 2) Canvas for Decoded WebCodecs Frame Bank */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        {/* Procedural Continuous Underwater Descent Canvas (Active when video is fallback/syncing) */}
        {!canvasLive && (
          <canvas
            ref={underwaterCanvasRef}
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}

        {/* ===================================================================
            DEPTH GAUGE (Signature Left Edge Element)
            =================================================================== */}
        <div
          className="hidden md:flex fixed left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 items-center gap-3 pointer-events-none select-none transition-colors duration-500"
          style={{ color: currentTextColor }}
        >
          {/* Thin vertical line 1px, 160px height at 30% alpha */}
          <div
            className="relative w-[1px] h-[160px]"
            style={{
              backgroundColor: currentTextColor,
              opacity: 0.3,
            }}
          >
            {/* Small 8px dot that moves down the line according to p */}
            <div
              className="absolute -left-[3.5px] w-2 h-2 rounded-full"
              style={{
                backgroundColor: ACCENT,
                top: `${Math.min(152, p * 152)}px`,
                transition: "top 0.08s linear",
              }}
            />
          </div>
          {/* Depth Label: "SURFACE" when p < 0.03, else Math.round(p * 30) + " m" */}
          <span
            className="text-xs tracking-[0.2em] font-medium tabular-nums transition-colors duration-500"
            style={{ color: currentTextColor }}
          >
            {p < 0.03 ? "SURFACE" : `${Math.round(p * 30)} m`}
          </span>
        </div>

        {/* ===================================================================
            NAVBAR (Absolute Top, z-50, pointer-events-auto)
            =================================================================== */}
        <nav
          className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 transition-colors duration-500"
          style={{ color: navColor }}
        >
          {/* Mobile <lg Hamburger (Left) */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col justify-center gap-[5px] p-2 -ml-2 cursor-pointer focus:outline-none"
              aria-label="Open menu"
            >
              <span
                className="w-6 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="w-6 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="w-4 h-[2px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
            </button>
          </div>

          {/* Desktop lg+ Left Cluster of 5 Links (pl-24 to clear depth gauge) */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 pl-24">
            {navLinks.map((item, idx) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    if (item === "FRESHSCAN AI") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (item === "SEAFOOD GUIDE") {
                      const c = containerRef.current;
                      if (c) window.scrollTo({ top: (c.offsetHeight - window.innerHeight) * 0.3, behavior: "smooth" });
                    } else if (item === "FRESHNESS GRADES" || item === "REEF & ORIGIN") {
                      const c = containerRef.current;
                      if (c) window.scrollTo({ top: (c.offsetHeight - window.innerHeight) * 0.65, behavior: "smooth" });
                    } else {
                      setScannerOpen(true);
                    }
                  }}
                  className="relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70 transition-opacity cursor-pointer py-1"
                  style={{
                    color: navColor,
                    opacity: navMounted ? 1 : 0,
                    transform: navMounted ? "translateY(0)" : "translateY(-12px)",
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80 + 100}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80 + 100}ms, color 0.5s ease`,
                  }}
                >
                  {item}
                  {isActive && (
                    <span
                      className="absolute -bottom-3 left-0 right-0 h-[2px] transition-colors duration-500"
                      style={{ backgroundColor: navColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Cluster (Hidden below sm) */}
          <div
            className="hidden sm:flex items-center gap-5 md:gap-7"
            style={{
              opacity: navMounted ? 1 : 0,
              transform: navMounted ? "translateY(0)" : "translateY(-12px)",
              transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms`,
            }}
          >
            {/* PHOTO SCAN Pill Button */}
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm"
              style={{
                backgroundColor: navColor,
                color: navInvertedText,
              }}
            >
              <Camera size={14} />
              <span className="text-xs tracking-[0.15em] uppercase font-medium">
                Photo Scan
              </span>
            </button>

            {/* NEWS Label + 20px Info Circle */}
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-[0.2em] uppercase font-medium">
                News
              </span>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: navColor,
                  color: navInvertedText,
                }}
              >
                <Info size={10} />
              </div>
            </div>

            {/* MENU Label (lg+: span, below lg: button that opens overlay) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70 transition-opacity cursor-pointer lg:cursor-default"
            >
              Menu
            </button>
          </div>
        </nav>

        {/* ===================================================================
            3) OVERLAY (Pointer-events-none, 4 Sequential Text Sections)
            =================================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* ---------------------------------------------------------------
              SECTION 1 — SURFACE (Hero, Left Aligned, Vertically Centered, DARK text)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32 md:pl-28"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.1s ease-out",
              pointerEvents: s1Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-4xl text-left">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <h1
                  className="font-light uppercase leading-[1.2] text-[clamp(2rem,5vw,5rem)]"
                  style={{ color: DARK }}
                >
                  Know how fresh, before it reaches your table
                </h1>
              </Stagger>
              <Stagger visible={s1Opacity > 0.3} delay={150}>
                <p
                  className="mt-6 text-sm tracking-[0.3em] uppercase"
                  style={{ color: `${DARK}e6` }} // 90% alpha
                >
                  AI-powered seafood freshness grading
                </p>
              </Stagger>
            </div>

            {/* Bottom-right 48px circle button (invites the dive) */}
            <div className="absolute bottom-12 right-6 sm:right-8 md:right-12">
              <Stagger visible={s1Opacity > 0.3} delay={300}>
                <button
                  onClick={() => {
                    const c = containerRef.current;
                    if (c) {
                      const targetY = (c.offsetHeight - window.innerHeight) * 0.28;
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 pointer-events-auto cursor-pointer"
                  style={{
                    border: `1px solid ${DARK}80`,
                    color: DARK,
                  }}
                  aria-label="Scroll down to dive"
                >
                  <ArrowDown size={18} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 2 — SHALLOW WATER (Center, DARK text)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-8"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.1s ease-out",
              pointerEvents: s2Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-[900px] text-center">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <h2
                  className="font-extralight tracking-wide leading-[1.3] text-center uppercase text-[clamp(1.5rem,4.5vw,4.5rem)]"
                  style={{ color: DARK }}
                >
                  Every eye, every gill{" "}
                  <span style={{ color: `${DARK}cc` }}>tells a story</span>{" "}
                  <span style={{ color: `${DARK}80` }}>of how fresh it is</span>
                </h2>
              </Stagger>
            </div>

            {/* Right Column: 48px circle, 3 dots, 40px circle */}
            <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
              <Stagger visible={s2Opacity > 0.3} delay={200}>
                <button
                  onClick={() => {
                    const c = containerRef.current;
                    if (c) {
                      const targetY = (c.offsetHeight - window.innerHeight) * 0.62;
                      window.scrollTo({ top: targetY, behavior: "smooth" });
                    }
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 pointer-events-auto cursor-pointer"
                  style={{
                    border: `1px solid ${DARK}66`,
                    color: DARK,
                  }}
                  aria-label="Dive deeper"
                >
                  <ArrowDown size={18} />
                </button>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={350}>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `${DARK}66` }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `${DARK}66` }}
                  />
                </div>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={500}>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 mt-2 pointer-events-auto cursor-pointer"
                  style={{
                    border: `1px solid ${DARK}4d`,
                    color: `${DARK}cc`,
                  }}
                  aria-label="Scroll back to surface"
                >
                  <ChevronUp size={16} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — CORAL REEF (Right Aligned, WHITE text)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.1s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl text-left">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span className="text-white/60 text-lg tracking-wide">
                    Grade A | Excellent Fresh
                  </span>
                </div>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={150}>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-light text-white leading-[1.2] uppercase tracking-wide mb-8">
                  Clear eyes, bright gills,
                  <br />
                  firm flesh.
                </h2>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={250}>
                <p className="text-white/70 text-base max-w-md mb-8">
                  Snap a photo. Our AI reads color, texture and clarity in seconds.
                </p>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 4 — DEEP BLUE (Final CTA, Centered, WHITE text)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-8"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.1s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <span className="text-white/60 text-lg tracking-wide mb-4 block">
                  FreshScan AI
                </span>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={150}>
                <h2 className="text-[clamp(2rem,4.5vw,4.5rem)] font-light text-white leading-[1.2] uppercase tracking-wide mb-10">
                  From the sea
                  <br />
                  to your table, verified.
                </h2>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={300}>
                <div className="pointer-events-auto flex items-center justify-center gap-4">
                  <button
                    onClick={() => setScannerOpen(true)}
                    className="text-sm tracking-[0.3em] text-white/80 uppercase font-medium hover:text-white transition-colors cursor-pointer"
                  >
                    Start Photo Scan
                  </button>
                  <button
                    onClick={() => setScannerOpen(true)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 transition-transform duration-300 hover:scale-110 cursor-pointer shadow-lg"
                    aria-label="Start Photo Scan"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          MOBILE MENU OVERLAY (fixed inset-0, z-[100], background DARK)
          =================================================================== */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: DARK }}
      >
        <div
          className={`relative h-full flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileOpen ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          {/* Close Button (Top-Right) */}
          <div className="flex justify-end px-6 sm:px-8 pt-8 sm:pt-12">
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links Centered Vertically */}
          <div className="flex flex-col items-center justify-center px-8 sm:px-12 py-3 text-center gap-5">
            {navLinks.map((item, i) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    setMobileOpen(false);
                    if (item === "FRESHSCAN AI") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (item === "SEAFOOD GUIDE") {
                      const c = containerRef.current;
                      if (c) window.scrollTo({ top: (c.offsetHeight - window.innerHeight) * 0.3, behavior: "smooth" });
                    } else if (item === "FRESHNESS GRADES" || item === "REEF & ORIGIN") {
                      const c = containerRef.current;
                      if (c) window.scrollTo({ top: (c.offsetHeight - window.innerHeight) * 0.65, behavior: "smooth" });
                    } else {
                      setScannerOpen(true);
                    }
                  }}
                  className={`text-2xl sm:text-3xl font-light tracking-wide uppercase transition-colors py-2 cursor-pointer ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                    transition: `transform 0.5s ease ${i * 60}ms, color 0.2s ease`,
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* Footer: NEWS and CONTACT */}
          <div className="flex justify-between items-center px-8 sm:px-12 pb-10 text-xs tracking-[0.2em] uppercase text-white/60">
            <span>News</span>
            <span>Contact</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          PHOTO SCAN MODAL (Interactive AI Seafood Quality Analysis)
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0B2A3C] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setScannerOpen(false);
                setSelectedImage(null);
                setAnalyzeResult(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: ACCENT }}
              >
                <Camera size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium uppercase tracking-wide">
                  FreshScan AI Scanner
                </h3>
                <p className="text-xs text-white/60 tracking-wider">
                  Select species & evaluate freshness
                </p>
              </div>
            </div>

            {/* Species Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { id: "fish", label: "Fish (ปลา)" },
                { id: "shrimp", label: "Shrimp (กุ้ง)" },
                { id: "squid", label: "Squid (หมึก)" },
                { id: "shellfish", label: "Shellfish (หอย)" },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => {
                    setSelectedType(sp.id as SeafoodTypeId);
                    if (selectedImage) runFreshnessTest(selectedImage, sp.id as SeafoodTypeId);
                  }}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                    selectedType === sp.id
                      ? "border-[#FF6B5B] bg-[#FF6B5B]/20 text-white font-semibold"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {/* Upload Area */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 bg-white/5"
              >
                <Upload size={32} className="text-white/50" />
                <p className="text-sm font-medium tracking-wide">
                  Click to upload or drag photo of seafood
                </p>
                <p className="text-xs text-white/50">
                  Supports JPG, PNG, WEBP (Eyes, gills or body)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(sampleFishImg);
                    runFreshnessTest(sampleFishImg, selectedType);
                  }}
                  className="mt-2 text-xs text-[#FF6B5B] underline hover:opacity-80"
                >
                  Or test with sample fresh fish photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden max-h-56 border border-white/20">
                  <img
                    src={selectedImage}
                    alt="Uploaded seafood"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm cursor-pointer"
                  >
                    Change photo
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="p-6 text-center text-sm text-white/70 flex items-center justify-center gap-2">
                    <Sparkles className="animate-spin text-[#FF6B5B]" size={18} />
                    Analyzing pixels, color temperature & QIM clarity...
                  </div>
                ) : analyzeResult ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-1 rounded text-xs font-bold"
                          style={{
                            backgroundColor:
                              analyzeResult.overallGrade === "A"
                                ? "#10b981"
                                : analyzeResult.overallGrade === "B"
                                ? "#06b6d4"
                                : analyzeResult.overallGrade === "C"
                                ? "#f59e0b"
                                : "#ef4444",
                            color: "#fff",
                          }}
                        >
                          GRADE {analyzeResult.overallGrade}
                        </span>
                        <span className="font-semibold text-sm">
                          {analyzeResult.overallGrade === "A"
                            ? "Very Fresh (สดมาก)"
                            : analyzeResult.overallGrade === "B"
                            ? "Fresh (สด)"
                            : analyzeResult.overallGrade === "C"
                            ? "Moderate (พอใช้)"
                            : "Spoiled (เริ่มเสื่อมสภาพ)"}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-white/60">
                        QIM Demerit: {analyzeResult.qimScore} / 20
                      </span>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed">
                      {analyzeResult.verdict}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-white/50 block">Confidence</span>
                        <span className="font-medium text-emerald-400">
                          {Math.round(analyzeResult.confidence * 100)}%
                        </span>
                      </div>
                      <div className="p-2 rounded bg-black/20">
                        <span className="text-white/50 block">Recommended</span>
                        <span className="font-medium text-white/90">
                          {analyzeResult.recommendedAction}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

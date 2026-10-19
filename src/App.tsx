import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowDown, ChevronUp, Info, X, Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { useVideoScrub } from "./useVideoScrub";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";
import sampleFishImg from "@/assets/fish-sample.jpg";
import heroSeafoodImg from "@/assets/hero-seafood.jpg";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4";

const DARK = "#1D3045";

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
    isLight,
  } = useVideoScrub(VIDEO_URL);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [navMounted, setNavMounted] = useState(false);

  // Theme toggle: Seafood FreshScan (user requested) vs Exact Vectrus Spec
  const [themeMode, setThemeMode] = useState<"seafood" | "vectrus">("seafood");

  // Scanner Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SeafoodTypeId>("fish");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenImgRef = useRef<HTMLImageElement>(null);

  // Coral Canvas Ref for Living Marine Reef Effect
  const coralCanvasRef = useRef<HTMLCanvasElement>(null);

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

  // Section Opacities derived from scrollProgress p
  const p = scrollProgress;

  const s1Opacity = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08);

  const s2Opacity =
    p < 0.32
      ? 0
      : p < 0.4
      ? (p - 0.32) / 0.08
      : p < 0.55
      ? 1
      : Math.max(0, 1 - (p - 0.55) / 0.08);

  const s3Opacity = p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1;

  const navColor = isLight ? DARK : "#ffffff";

  // Coral & Marine Life Background Simulation (Active when themeMode === 'seafood')
  useEffect(() => {
    const canvas = coralCanvasRef.current;
    if (!canvas || themeMode !== "seafood") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Schooling fish
    const fishes: { x: number; y: number; vx: number; size: number; phase: number; color: string }[] = [];
    for (let i = 0; i < 18; i++) {
      fishes.push({
        x: Math.random() * w,
        y: h * 0.3 + Math.random() * (h * 0.45),
        vx: 0.8 + Math.random() * 0.8,
        size: 3 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(251, 191, 36, 0.45)",
      });
    }

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Swaying Corals at bottom (subtle translucent silhouette)
      const base = h;
      ctx.save();
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        const x = i * (w / 20) + 20;
        const sway = Math.sin(time * 1.5 + i) * 12;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(14, 116, 144, 0.28)" : "rgba(244, 63, 94, 0.22)";
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.quadraticCurveTo(x + sway * 0.5, base - 45, x + sway, base - 80);
        ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(x + sway, base - 80, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Fish swimming
      for (const f of fishes) {
        f.x += f.vx;
        f.y += Math.sin(time * 2 + f.phase) * 0.3;
        if (f.x > w + 30) f.x = -30;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.moveTo(f.size * 2, 0);
        ctx.quadraticCurveTo(0, -f.size, -f.size * 1.8, 0);
        ctx.quadraticCurveTo(0, f.size, f.size * 2, 0);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, [themeMode]);

  // Image Analysis Handler
  const handleAnalyzeFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
    setIsAnalyzing(true);
    setAnalyzeResult(null);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setTimeout(() => {
        try {
          const res = analyzeImage(img, selectedType);
          setAnalyzeResult(res);
        } catch (e) {
          console.error(e);
        } finally {
          setIsAnalyzing(false);
        }
      }, 500);
    };
  };

  const handleSampleAnalyze = (sampleSrc: string) => {
    setSelectedImage(sampleSrc);
    setIsAnalyzing(true);
    setAnalyzeResult(null);

    const img = new Image();
    img.src = sampleSrc;
    img.onload = () => {
      setTimeout(() => {
        try {
          const res = analyzeImage(img, selectedType);
          setAnalyzeResult(res);
        } catch (e) {
          console.error(e);
        } finally {
          setIsAnalyzing(false);
        }
      }, 500);
    };
  };

  // Nav links based on theme
  const navLinks =
    themeMode === "seafood"
      ? [
          { name: "FRESHSCAN AI", active: true },
          { name: "SEAFOOD LABS", active: false },
          { name: "CORAL REEF ATLAS", active: false },
          { name: "QIM METRICS", active: false },
          { name: "FRESHSCAN+", active: false },
        ]
      : [
          { name: "VECTRUS ENERGY", active: true },
          { name: "VECTRUS UPSTREAM", active: false },
          { name: "VECTRUS MARKETS", active: false },
          { name: "VECTRUS SYSTEMS", active: false },
          { name: "VECTRUS+", active: false },
        ];

  return (
    <div
      ref={containerRef}
      className="relative h-[500vh] w-full font-helvetica select-none"
    >
      {/* Hidden Image for Analysis Reference */}
      <img ref={hiddenImgRef} className="hidden" alt="analysis-ref" />

      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1) Looping/Scrub Video full cover */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* 2) Canvas 1920x1080 for smooth decoded frame scrubbing */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        {/* Living Coral Reef & Marine Canvas Layer (Seafood Mode) */}
        {themeMode === "seafood" && (
          <canvas
            ref={coralCanvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[5]"
          />
        )}

        {/* 3) Text & UI Overlay sits directly on video */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* ===================================================================
              NAVBAR (absolute top, z-50, pointer-events-auto)
              =================================================================== */}
          <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 flex items-center justify-between">
            {/* Left Cluster Desktop lg+ (5 links) */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={`#${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70 transition-colors duration-500"
                  style={{
                    color: navColor,
                    opacity: navMounted ? 1 : 0,
                    transform: navMounted ? "translateY(0)" : "translateY(-12px)",
                    transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                      idx * 80 + 100
                    }ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${
                      idx * 80 + 100
                    }ms, color 0.5s ease`,
                  }}
                >
                  {link.name}
                  {link.active && (
                    <span
                      className="absolute left-0 -bottom-3 w-full h-[2px] transition-colors duration-500"
                      style={{ backgroundColor: navColor }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Mobile <lg Hamburger (Left side) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col justify-center items-start gap-[5px] p-2 focus:outline-none"
              aria-label="Open menu"
            >
              <span
                className="h-[2px] w-[24px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="h-[2px] w-[24px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
              <span
                className="h-[2px] w-[16px] transition-colors duration-500"
                style={{ backgroundColor: navColor }}
              />
            </button>

            {/* Right Cluster */}
            <div
              className="flex items-center gap-6"
              style={{
                opacity: navMounted ? 1 : 0,
                transform: navMounted ? "translateY(0)" : "translateY(-12px)",
                transition:
                  "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 500ms",
              }}
            >
              {/* Theme Switcher Pill (Switch between Seafood FreshScan and Exact Benchmark Spec) */}
              <button
                type="button"
                onClick={() =>
                  setThemeMode((prev) => (prev === "seafood" ? "vectrus" : "seafood"))
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] tracking-[0.1em] font-medium uppercase border transition-all duration-300 hover:scale-105"
                style={{
                  color: navColor,
                  borderColor: isLight ? "rgba(29, 48, 69, 0.3)" : "rgba(255, 255, 255, 0.3)",
                  backgroundColor: isLight ? "rgba(29, 48, 69, 0.06)" : "rgba(255, 255, 255, 0.1)",
                }}
                title="Switch Theme"
              >
                <span>{themeMode === "seafood" ? "🌊 SEAFOOD REEF" : "⚡ VECTRUS SPEC"}</span>
              </button>

              {/* Instant Photo Scanner Launcher Button */}
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] font-bold uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                style={{
                  backgroundColor: isLight ? DARK : "#ffffff",
                  color: isLight ? "#ffffff" : DARK,
                }}
              >
                <Camera className="size-3.5" />
                <span className="hidden sm:inline">PHOTO SCAN</span>
              </button>

              {/* Right Cluster elements: NEWS + Info circle + MENU */}
              <div className="hidden sm:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500"
                    style={{ color: navColor }}
                  >
                    NEWS
                  </span>
                  <div
                    className="size-5 rounded-full flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: navColor }}
                  >
                    <Info
                      size={10}
                      className="transition-colors duration-500"
                      style={{ color: isLight ? "#ffffff" : DARK }}
                    />
                  </div>
                </div>

                {/* MENU label: span on lg+, button below lg */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden text-xs tracking-[0.2em] uppercase font-medium focus:outline-none transition-colors duration-500"
                  style={{ color: navColor }}
                >
                  MENU
                </button>
                <span
                  className="hidden lg:inline text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-500"
                  style={{ color: navColor }}
                >
                  MENU
                </span>
              </div>
            </div>
          </nav>

          {/* ===================================================================
              SECTION 1 (Hero, left aligned, vertically centered)
              =================================================================== */}
          <section
            className="absolute inset-0 px-6 sm:px-8 md:px-20 lg:px-32 flex flex-col justify-center pointer-events-none"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.1s ease-out",
            }}
          >
            <div className="max-w-4xl">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <h1
                  className="text-[clamp(2rem,5vw,5rem)] font-light uppercase leading-[1.2] tracking-tight"
                  style={{ color: DARK }}
                >
                  {themeMode === "seafood"
                    ? "ADVANCING SEAFOOD PURITY FOR A HEALTHIER FUTURE"
                    : "ADVANCING RESOURCES FOR A CLEANER FUTURE"}
                </h1>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={150}>
                <p
                  className="mt-6 text-sm tracking-[0.3em] uppercase font-medium"
                  style={{ color: `${DARK}E6` }} // 90% alpha
                >
                  {themeMode === "seafood"
                    ? "AI-POWERED FRESHNESS GRADING WITH OPTICAL PRECISION"
                    : "SUSTAINABLE POWER WITH PURPOSE"}
                </p>
              </Stagger>
            </div>

            {/* Bottom-right 48px circle button */}
            <div className="absolute bottom-12 right-6 sm:right-8 md:right-12 pointer-events-auto">
              <Stagger visible={s1Opacity > 0.3} delay={300}>
                <button
                  type="button"
                  onClick={() => {
                    if (themeMode === "seafood") setScannerOpen(true);
                    else window.scrollTo({ top: window.innerHeight * 1.5, behavior: "smooth" });
                  }}
                  className="size-12 rounded-full flex items-center justify-center border transition-all duration-300 hover:opacity-70 hover:scale-105 active:scale-95"
                  style={{ borderColor: `${DARK}80`, color: DARK }}
                  aria-label="Next or Scan"
                >
                  <ArrowRight size={18} />
                </button>
              </Stagger>
            </div>
          </section>

          {/* ===================================================================
              SECTION 2 (Center, max-w-[900px])
              =================================================================== */}
          <section
            className="absolute inset-0 px-6 sm:px-8 flex items-center justify-center pointer-events-none"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.1s ease-out",
            }}
          >
            <div className="max-w-[900px] text-center">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <h2
                  className="text-[clamp(1.5rem,4.5vw,4.5rem)] font-extralight tracking-wide leading-[1.3] uppercase"
                  style={{ color: DARK }}
                >
                  {themeMode === "seafood" ? (
                    <>
                      We inspect marine harvests with vision{" "}
                      <span style={{ color: `${DARK}CC` }}>and precision</span>{" "}
                      <span style={{ color: `${DARK}80` }}>across every species</span>
                    </>
                  ) : (
                    <>
                      We build lasting partnerships with vision{" "}
                      <span style={{ color: `${DARK}CC` }}>and precision</span>{" "}
                      <span style={{ color: `${DARK}80` }}>across every frontier</span>
                    </>
                  )}
                </h2>
              </Stagger>
            </div>

            {/* Right column absolute bottom-16 right-6 sm:right-8 md:right-12 */}
            <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4 pointer-events-auto">
              {/* 48px circle with ArrowDown 18 */}
              <Stagger visible={s2Opacity > 0.3} delay={200}>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: window.innerHeight * 3.5, behavior: "smooth" })}
                  className="size-12 rounded-full flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: `${DARK}66`, color: DARK }}
                  aria-label="Scroll down"
                >
                  <ArrowDown size={18} />
                </button>
              </Stagger>

              {/* Three dots: 8px solid DARK (active), 6px DARK 40%, 6px DARK 40% */}
              <Stagger visible={s2Opacity > 0.3} delay={350}>
                <div className="flex flex-col items-center gap-2 mt-4">
                  <span className="size-2 rounded-full" style={{ backgroundColor: DARK }} />
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                </div>
              </Stagger>

              {/* 40px circle with ChevronUp 16 */}
              <Stagger visible={s2Opacity > 0.3} delay={500}>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="size-10 rounded-full flex items-center justify-center border mt-2 transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: `${DARK}4D`, color: `${DARK}CC` }}
                  aria-label="Scroll top"
                >
                  <ChevronUp size={16} />
                </button>
              </Stagger>
            </div>
          </section>

          {/* ===================================================================
              SECTION 3 (Right aligned, white type — video is dark here)
              =================================================================== */}
          <section
            className="absolute inset-0 px-6 sm:px-8 md:px-20 lg:px-32 flex items-center justify-end pointer-events-none"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.1s ease-out",
            }}
          >
            <div className="max-w-2xl text-left pointer-events-auto">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <p className="text-white/60 text-lg tracking-wide mb-4 uppercase">
                  {themeMode === "seafood" ? "FreshScan Marine | QIM Certified" : "Halder | Nordvik"}
                </p>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={150}>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-light text-white leading-[1.2] uppercase tracking-wide mb-8">
                  {themeMode === "seafood" ? (
                    <>
                      Empowering consumers,<br />
                      protecting freshness.
                    </>
                  ) : (
                    <>
                      Fueling ambition,<br />
                      shaping tomorrow.
                    </>
                  )}
                </h2>
              </Stagger>

              {/* CTA Row */}
              <Stagger visible={s3Opacity > 0.3} delay={300}>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    className="text-sm tracking-[0.3em] text-white/80 uppercase font-medium hover:text-white transition-colors"
                  >
                    {themeMode === "seafood" ? "Inspect Seafood Now" : "Contact Nordvik"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    className="size-10 rounded-full bg-white flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    aria-label="Open Scanner CTA"
                  >
                    <ArrowRight size={16} className="text-gray-800" />
                  </button>
                </div>
              </Stagger>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================================
          MOBILE MENU OVERLAY
          ===================================================================== */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ backgroundColor: DARK }}
      >
        {/* Inner Panel */}
        <div
          className={`flex h-full flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileOpen ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          {/* Close Button top-right */}
          <div className="flex justify-end px-6 sm:px-8 pt-8 sm:pt-12">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="size-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links Centered Vertically */}
          <div className="flex flex-col justify-center px-8 sm:px-12 py-3 space-y-4">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl sm:text-3xl font-light tracking-wide uppercase transition-all duration-300 ${
                  link.active ? "text-white" : "text-white/60 hover:text-white"
                }`}
                style={{
                  transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `transform 0.5s ease ${idx * 60}ms, color 0.3s ease`,
                }}
              >
                {link.name}
              </a>
            ))}

            {/* Quick action button inside mobile menu */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setScannerOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#1D3045] hover:scale-105 active:scale-95 transition-transform"
              >
                <Camera size={14} />
                <span>Launch Photo Scanner</span>
              </button>
            </div>
          </div>

          {/* Footer: NEWS and CONTACT */}
          <div className="flex items-center justify-between px-8 sm:px-12 pb-10 text-xs tracking-[0.2em] uppercase text-white/60">
            <span>NEWS</span>
            <span
              onClick={() => {
                setMobileOpen(false);
                setScannerOpen(true);
              }}
              className="cursor-pointer hover:text-white"
            >
              CONTACT & SCAN
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          AI SEAFOOD FRESHNESS SCANNER MODAL
          Allows consumers to inspect seafood freshness from photos (Grade A-D)
          ===================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-slide-up">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-gradient-to-tr from-sky-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">AI Seafood Freshness Scanner</h3>
                  <p className="text-xs text-sky-300">European QIM Standard · Real-time Optical Analysis</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScannerOpen(false)}
                className="size-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Step 1: Species Selection */}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Select Seafood Type (เลือกชนิดสัตว์น้ำ)
              </label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { id: "fish", name: "ปลา (Fish)" },
                  { id: "shrimp", name: "กุ้ง (Shrimp)" },
                  { id: "squid", name: "หมึก (Squid)" },
                  { id: "shellfish", name: "หอย (Shellfish)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(item.id as SeafoodTypeId);
                      if (selectedImage) handleSampleAnalyze(selectedImage);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedType === item.id
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md"
                        : "bg-slate-800/60 border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Upload or Select Sample */}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                2. Upload Photo (อัปโหลดรูปภาพเพื่อประเมิน)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAnalyzeFile(file);
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 border-2 border-dashed border-sky-500/30 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40"
              >
                {selectedImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedImage}
                      alt="Uploaded seafood"
                      className="h-40 max-w-full rounded-xl object-contain border border-white/20"
                    />
                    <span className="mt-3 text-xs text-cyan-300 underline">คลิกเพื่อเปลี่ยนรูปภาพใหม่</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="size-8 text-cyan-400 mb-2" />
                    <p className="text-sm font-semibold">ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อถ่ายรูป/เลือกไฟล์</p>
                    <p className="text-xs text-slate-400 mt-1">รองรับ JPEG, PNG, WebP (ประมวลผลทันทีในเครื่อง ปลอดภัย 100%)</p>
                  </div>
                )}
              </div>

              {/* Sample Photo Shortcuts */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>หรือคลิกภาพตัวอย่าง:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSampleAnalyze(sampleFishImg)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    ตัวอย่างปลาสด (Sample Fish)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleAnalyze(heroSeafoodImg)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    รวมอาหารทะเล (Seafood Platter)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Analysis Result */}
            {isAnalyzing && (
              <div className="mt-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-white/10">
                <RefreshCw className="size-8 text-cyan-400 animate-spin mb-3" />
                <p className="text-sm font-semibold">AI กำลังวิเคราะห์พิกเซลทางชีวภาพและระดับความสด...</p>
              </div>
            )}

            {analyzeResult && !isAnalyzing && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-950/70 border border-sky-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">QIM Quality Index</span>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>{analyzeResult.gradeTh}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          analyzeResult.grade === "A"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                            : analyzeResult.grade === "B"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/40"
                            : "bg-amber-500/20 text-amber-400 border border-amber-400/40"
                        }`}
                      >
                        GRADE {analyzeResult.grade}
                      </span>
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Freshness Index</span>
                    <div className="text-2xl font-mono font-black text-cyan-300">
                      {analyzeResult.freshnessIndex}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">คะแนนจุดด้อย (Demerit):</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {analyzeResult.totalDemerit} / {analyzeResult.maxDemerit} คะแนน
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400">ความเชื่อมั่นทางสถิติ:</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {(analyzeResult.confidence * 100).toFixed(1)}% Confirmed
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
                  <span className="font-bold text-cyan-300">คำแนะนำการบริโภคและการปรุง:</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">{analyzeResult.recommendationTh}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

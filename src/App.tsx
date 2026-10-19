import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowDown, ChevronUp, Camera, Upload, Sparkles, X, CheckCircle2 } from "lucide-react";
import { useVideoScrub } from "./useVideoScrub";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";
import sampleFishImg from "@/assets/fish-sample.jpg";

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

  const [mobileOpen, setMobileOpen] = useState(false);

  // Scanner Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SeafoodTypeId>("fish");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const scrollToDepth = (targetP: number) => {
    const c = containerRef.current;
    if (c) {
      const targetY = (c.offsetHeight - window.innerHeight) * targetP;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[600vh] bg-black text-white font-['Prompt','Sarabun',system-ui,sans-serif]"
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
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
        />

        {/* ===================================================================
            DEPTH GAUGE (มาตรวัดความลึก - ภาษาไทยชัดเจน)
            =================================================================== */}
        <div className="hidden md:flex fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 items-center gap-3 pointer-events-none select-none">
          {/* เส้นแนวตั้ง */}
          <div className="relative w-[2px] h-[160px] bg-white/30 rounded-full overflow-hidden shadow-sm">
            {/* จุดวัดความลึก */}
            <div
              className="absolute -left-[3px] w-2.5 h-2.5 rounded-full shadow-lg"
              style={{
                backgroundColor: ACCENT,
                top: `${Math.min(150, p * 150)}px`,
                transition: "top 0.08s linear",
              }}
            />
          </div>
          {/* ป้ายกำกับความลึก */}
          <div className="flex flex-col text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <span className="text-[10px] tracking-wider uppercase text-white/70 font-light">
              ระดับความลึก
            </span>
            <span className="text-sm font-semibold tracking-wide text-white tabular-nums">
              {p < 0.05 ? "ผิวน้ำทะเล" : `${Math.round(p * 30)} เมตร`}
            </span>
          </div>
        </div>

        {/* ===================================================================
            NAVBAR (เรียบหรู คมชัด ไม่รก)
            =================================================================== */}
        <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 pb-4">
          {/* Logo & Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF6B5B] group-hover:scale-105 transition-transform shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-wide text-white block leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                FreshScan <span className="text-[#FF6B5B]">AI</span>
              </span>
              <span className="text-[10px] text-white/70 tracking-wider block font-light">
                ตรวจความสดอาหารทะเล
              </span>
            </div>
          </button>

          {/* Desktop Links (สั้น กระชับ ตรงจุด) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollToDepth(0)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-md"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => scrollToDepth(0.35)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-md"
            >
              จุดสังเกตความสด
            </button>
            <button
              onClick={() => scrollToDepth(0.65)}
              className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-md"
            >
              เกณฑ์มาตรฐาน QIM
            </button>
          </div>

          {/* ปุ่มสแกนความสด (เด่นชัด กดใช้งานได้ทันที) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-full px-5 py-2.5 bg-[#FF6B5B] hover:bg-[#ff5542] text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
            >
              <Camera size={16} />
              <span>ถ่ายภาพตรวจความสด</span>
            </button>
          </div>
        </nav>

        {/* ===================================================================
            3) OVERLAY (เนื้อหาภาษาไทย คมชัด อ่านง่าย ตัวหนังสือขาวมีมิติ)
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
            <div className="max-w-3xl text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm text-white/90 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B5B] animate-pulse" />
                  เทคโนโลยี AI คุณภาพอาหารทะเล 2026
                </div>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={100}>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.2] tracking-tight">
                  รู้ความสดใหม่
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400">
                    ก่อนถึงจานโปรดของคุณ
                  </span>
                </h1>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={200}>
                <p className="mt-5 text-base sm:text-xl text-white/90 font-light max-w-xl leading-relaxed">
                  ถ่ายภาพดวงตา เหงือก หรือผิวสัมผัส ระบบจะประเมินเกรดความสดด้วยโมเดลวิเคราะห์ภาพมาตรฐาน QIM ในไม่กี่วินาที
                </p>
              </Stagger>
            </div>

            {/* ปุ่มเลื่อนดำดิ่ง (ขวาล่าง) */}
            <div className="absolute bottom-10 right-6 sm:right-10 md:right-16 flex items-center gap-3">
              <Stagger visible={s1Opacity > 0.3} delay={300}>
                <button
                  onClick={() => scrollToDepth(0.35)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all cursor-pointer pointer-events-auto"
                >
                  <span className="text-xs sm:text-sm font-light">เลื่อนลงเพื่อดำดิ่ง</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowDown size={14} />
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
            <div className="max-w-2xl text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  ดวงตา เหงือก และเกล็ด
                  <br />
                  <span className="text-sky-300">บอกเล่าความสดที่แท้จริง</span>
                </h2>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={150}>
                <p className="mt-4 text-sm sm:text-lg text-white/85 font-light leading-relaxed">
                  ระบบตรวจจับความนูนใสของตาดำ สีแดงเลือดนกของเหงือก และความตึงของเนื้อปลาอย่างละเอียด แม่นยำทุกมุมมอง
                </p>
              </Stagger>

              <Stagger visible={s2Opacity > 0.3} delay={250}>
                <div className="mt-6 flex justify-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-md text-xs border border-white/20 text-white/90">
                    👁️ ความใสของกระจกตา
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-md text-xs border border-white/20 text-white/90">
                    🩸 สีสันของเหงือกปลา
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-md text-xs border border-white/20 text-white/90">
                    ✨ ความแวววาวของผิว
                  </span>
                </div>
              </Stagger>
            </div>

            {/* ปุ่มนำทางขวาล่าง */}
            <div className="absolute bottom-12 right-6 sm:right-10 md:right-16 flex flex-col items-center gap-3">
              <Stagger visible={s2Opacity > 0.3} delay={300}>
                <button
                  onClick={() => scrollToDepth(0.65)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all pointer-events-auto cursor-pointer"
                  aria-label="Dive deeper"
                >
                  <ArrowDown size={18} />
                </button>
              </Stagger>
              <Stagger visible={s2Opacity > 0.3} delay={400}>
                <button
                  onClick={() => scrollToDepth(0)}
                  className="w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all pointer-events-auto cursor-pointer"
                  aria-label="Back to surface"
                >
                  <ChevronUp size={16} />
                </button>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — แนวปะการัง & ความสดเกรดพรีเมียม
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-xl text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-4">
                  <CheckCircle2 size={14} />
                  เกรด A | ความสดระดับพรีเมียม
                </div>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={100}>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  ตาใสเป็นประกาย
                  <br />
                  เหงือกแดงสด เนื้อแน่น
                </h2>
              </Stagger>

              <Stagger visible={s3Opacity > 0.3} delay={200}>
                <p className="mt-4 text-sm sm:text-base text-white/85 font-light leading-relaxed">
                  ปลอดภัย มั่นใจ ไร้สารฟอร์มาลิน ถ่ายภาพวัตถุดิบที่คุณซื้อจากตลาดหรือซูเปอร์มาร์เก็ต แล้วให้ AI ตรวจสอบได้ทันที
                </p>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 4 — ใต้ทะเลลึก & จุดเริ่มสแกนหลัก
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl flex flex-col items-center justify-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)]">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <span className="text-xs sm:text-sm tracking-[0.25em] uppercase text-sky-300 font-semibold mb-3 block">
                  FRESHSCAN AI ASSESSMENT
                </span>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={100}>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                  คัดสรรจากทะเล
                  <br />
                  สู่ความมั่นใจบนโต๊ะอาหาร
                </h2>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={200}>
                <p className="text-sm sm:text-lg text-white/85 font-light max-w-lg mb-8 leading-relaxed">
                  เริ่มต้นตรวจสอบอาหารทะเลของคุณได้เลยวันนี้ ฟรี ไม่ต้องติดตั้งแอปพลิเคชัน
                </p>
              </Stagger>

              <Stagger visible={s4Opacity > 0.3} delay={300}>
                <button
                  onClick={() => setScannerOpen(true)}
                  className="pointer-events-auto rounded-full px-8 py-4 bg-[#FF6B5B] hover:bg-[#ff5542] text-white text-base sm:text-lg font-semibold flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-2xl cursor-pointer"
                >
                  <Camera size={22} />
                  <span>เริ่มสแกนความสดอาหารทะเล</span>
                  <ArrowRight size={20} />
                </button>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          PHOTO SCAN MODAL (ระบบสแกนความสด - ภาษาไทย 100% ใช้งานง่าย)
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#07131D] border border-white/20 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setScannerOpen(false);
                setSelectedImage(null);
                setAnalyzeResult(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FF6B5B] flex items-center justify-center text-white shadow-md">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  สแกนประเมินความสด (FreshScan)
                </h3>
                <p className="text-xs text-white/60">
                  เลือกประเภทอาหารทะเล แล้วถ่ายภาพเพื่อตรวจผล
                </p>
              </div>
            </div>

            {/* Species Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { id: "fish", label: "🐟 ปลาทั้งตัว" },
                { id: "shrimp", label: "🦐 กุ้งสด" },
                { id: "squid", label: "🦑 หมึกสด" },
                { id: "shellfish", label: "🦪 หอยสด" },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => {
                    setSelectedType(sp.id as SeafoodTypeId);
                    if (selectedImage) runFreshnessTest(selectedImage, sp.id as SeafoodTypeId);
                  }}
                  className={`py-2.5 px-2 text-xs font-medium rounded-xl border transition-all text-center cursor-pointer ${
                    selectedType === sp.id
                      ? "border-[#FF6B5B] bg-[#FF6B5B]/20 text-white font-semibold shadow-sm"
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
                className="border-2 border-dashed border-white/25 hover:border-white/50 rounded-2xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 bg-white/5"
              >
                <Upload size={32} className="text-white/60" />
                <p className="text-sm font-medium text-white">
                  กดเพื่อถ่ายภาพ หรือ อัปโหลดรูปภาพ
                </p>
                <p className="text-xs text-white/50">
                  ถ่ายเน้นบริเวณดวงตา เหงือก หรือผิวสัมผัส (JPG, PNG, WEBP)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(sampleFishImg);
                    runFreshnessTest(sampleFishImg, selectedType);
                  }}
                  className="mt-3 text-xs text-[#FF6B5B] underline hover:opacity-80 cursor-pointer"
                >
                  หรือทดสอบด้วยภาพปลาสดตัวอย่าง
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden max-h-56 border border-white/20 shadow-md">
                  <img
                    src={selectedImage}
                    alt="Seafood"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-black/80 hover:bg-black text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm cursor-pointer border border-white/20"
                  >
                    เปลี่ยนภาพถ่าย
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="p-6 text-center text-sm text-white/80 flex items-center justify-center gap-2">
                    <Sparkles className="animate-spin text-[#FF6B5B]" size={20} />
                    AI กำลังวิเคราะห์สี ความโปร่งใส และเกณฑ์ QIM...
                  </div>
                ) : analyzeResult ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-md text-xs font-bold text-white shadow"
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
                        <span className="font-semibold text-sm text-white">
                          {analyzeResult.overallGrade === "A"
                            ? "สดมาก (พรีเมียม)"
                            : analyzeResult.overallGrade === "B"
                            ? "สดดี (คุณภาพดี)"
                            : analyzeResult.overallGrade === "C"
                            ? "พอใช้ (ควรปรุงสุกทันที)"
                            : "เริ่มเสื่อมสภาพ (ไม่ควรบริโภค)"}
                        </span>
                      </div>
                      <span className="text-xs text-white/60 font-mono">
                        QIM: {analyzeResult.qimScore} / 20
                      </span>
                    </div>

                    <p className="text-xs text-white/85 leading-relaxed">
                      {analyzeResult.verdict}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                      <div className="p-2.5 rounded-lg bg-black/30">
                        <span className="text-white/50 block text-[11px]">ความมั่นใจของ AI</span>
                        <span className="font-semibold text-emerald-400">
                          {Math.round(analyzeResult.confidence * 100)}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/30">
                        <span className="text-white/50 block text-[11px]">คำแนะนำ</span>
                        <span className="font-semibold text-white/90">
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

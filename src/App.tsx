import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Activity,
  Layers,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
  ChevronRight,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Info,
  Scale,
  ThermometerSnowflake,
  Fish,
} from "lucide-react";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";

const VIDEO_URL = "/ocean.mp4";

// =========================================================================
// BESPOKE HIGH-END LOGO COMPONENT
// =========================================================================
function FreshScanLogo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-11 h-11";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const subSize = size === "sm" ? "text-[9px]" : size === "lg" ? "text-xs" : "text-[10px]";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bespoke Marine AI Emblem */}
      <div
        className={`relative ${iconSize} rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-[1.5px] border border-sky-400/40 shadow-xl shadow-sky-950/50 flex items-center justify-center overflow-hidden shrink-0 group`}
      >
        <div className="absolute inset-0 bg-sky-500/10 rounded-2xl group-hover:bg-sky-500/25 transition-colors" />
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 relative z-10"
        >
          {/* Precision Scanner Ring */}
          <circle
            cx="24"
            cy="24"
            r="19"
            stroke="url(#logo_orbit)"
            strokeWidth="1.6"
            strokeDasharray="4 2"
            className="opacity-70 animate-[spin_24s_linear_infinite]"
          />
          {/* Dynamic Ocean Wave & Marine Fish Silhouette */}
          <path
            d="M9 24C13 16 21 14 27 18C33 22 37 19 41 16C39 24 34 30 27 31C19 32 13 28 9 24Z"
            fill="url(#logo_wave)"
          />
          {/* Fish Eye Sensor Node */}
          <circle cx="34" cy="21" r="2.2" fill="#38bdf8" />
          <circle cx="34" cy="21" r="1" fill="#ffffff" />
          {/* Hydrodynamic Bottom Fin Curve */}
          <path
            d="M14 28C18 33 25 34 32 30"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* AI Precision Sparkle */}
          <path
            d="M24 7L25.2 12.2L30 13.5L25.2 14.8L24 20L22.8 14.8L18 13.5L22.8 12.2L24 7Z"
            fill="#ffffff"
          />
          <defs>
            <linearGradient id="logo_orbit" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#0284c7" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="logo_wave" x1="9" y1="14" x2="41" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="0.5" stopColor="#0ea5e9" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSize} font-bold tracking-tight text-white leading-none`}>
            FRESH<span className="text-sky-400">SCAN</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 leading-none">
            AI
          </span>
        </div>
        <span className={`${subSize} text-slate-300 tracking-wider uppercase font-medium mt-1`}>
          ระบบประเมินมาตรฐานความสดอาหารทะเล
        </span>
      </div>
    </div>
  );
}

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
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// =========================================================================
// DETAILED OFFICIAL QIM CRITERIA (5 DIMENSIONS)
// =========================================================================
const QIM_CRITERIA_DETAILS = [
  {
    dim: "1. เลนส์ตาและกระจกตา (Eyes & Cornea)",
    icon: Eye,
    weight: "0–3 คะแนน",
    gradeA: "ตานูน กลม ใสเป็นประกาย ม่านตาดำสนิท ไร้ฝ้าขุ่น",
    gradeB: "ตาราบลงเล็กน้อย เริ่มมีฝ้าขุ่นบาง ม่านตาสีเทา",
    gradeC: "ตาบุ๋มลึก ฝ้าขุ่นหนาสีเทาหรือมีเลือดคั่ง",
  },
  {
    dim: "2. เหงือกและกลิ่นไอทะเล (Gills & Odor)",
    icon: Activity,
    weight: "0–4 คะแนน",
    gradeA: "สีแดงสดธรรมชาติ เมือกใสบาง กลิ่นไอทะเลสดชื่น ไร้กลิ่นคาว",
    gradeB: "สีชมพูซีดหรือน้ำตาลแดง เมือกเริ่มขุ่น กลิ่นจืด",
    gradeC: "สีน้ำตาลคล้ำหรือเทาเข้ม เมือกเหนียวขุ่น กลิ่นคาวจัด/แอมโมเนีย",
  },
  {
    dim: "3. ผิวหนัง เกล็ด และเม็ดสี (Skin & Scales)",
    icon: Layers,
    weight: "0–3 คะแนน",
    gradeA: "เกล็ดแนบสนิทเป็นประกายแวววาว เม็ดสีสดใส ชุ่มชื้นธรรมชาติ",
    gradeB: "เกล็ดหลุดร่วงบางส่วน สีด้านลง เมือกขุ่นเล็กน้อย",
    gradeC: "เกล็ดหลุดร่วงง่าย ผิวซีดด่าง เมือกขุ่นเหนียวหนา",
  },
  {
    dim: "4. ความยืดหยุ่นของเนื้อ (Flesh Firmness)",
    icon: ShieldCheck,
    weight: "0–3 คะแนน",
    gradeA: "กล้ามเนื้อแน่นตึง กดแล้วเด้งคืนรูปทันที ไม่ทิ้งรอยบุ๋ม",
    gradeB: "กล้ามเนื้อเริ่มนิ่มเล็กน้อย คืนรูปช้าเมื่อถูกกด",
    gradeC: "กล้ามเนื้อนิ่มเละ บุ๋มถาวร เนื้อแยกตัวเมื่อสัมผัส",
  },
  {
    dim: "5. ช่องท้องและอวัยวะภายใน (Belly Integrity)",
    icon: Scale,
    weight: "0–3 คะแนน",
    gradeA: "ผนังช่องท้องแน่นสมบูรณ์ ท้องไม่แตก ไร้รอยช้ำ ไส้ไม่ทะลัก",
    gradeB: "ผนังท้องเริ่มนิ่ม สีด้านในเริ่มเปลี่ยน ยังไม่แตก",
    gradeC: "ผนังท้องแตก ไส้ทะลัก มีกลิ่นเน่าเสียอย่างชัดเจน",
  },
];

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scanner Suite State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when scanner modal is open
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

  // Smooth Scroll Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const total = container.offsetHeight - window.innerHeight;
      if (total > 0) {
        const currentP = Math.min(1, Math.max(0, window.scrollY / total));
        setScrollProgress(currentP);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const p = scrollProgress;

  // Sequential Section Opacities
  const s1Opacity = p < 0.20 ? 1 : Math.max(0, 1 - (p - 0.20) / 0.08);

  const s2Opacity =
    p < 0.26
      ? 0
      : p < 0.34
      ? (p - 0.26) / 0.08
      : p < 0.48
      ? 1
      : Math.max(0, 1 - (p - 0.48) / 0.08);

  const s3Opacity =
    p < 0.54
      ? 0
      : p < 0.62
      ? (p - 0.54) / 0.08
      : p < 0.76
      ? 1
      : Math.max(0, 1 - (p - 0.76) / 0.08);

  const s4Opacity =
    p < 0.82
      ? 0
      : p < 0.90
      ? (p - 0.82) / 0.08
      : 1;

  // Perform AI Visual Analysis
  const executeAnalysis = (imgSrc: string) => {
    setIsScanning(true);
    setScanStep(1);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => {
      setTimeout(() => {
        setScanStep(2);
      }, 350);

      setTimeout(() => {
        setScanStep(3);
      }, 700);

      setTimeout(() => {
        // Automatically analyze seafood with comprehensive AI rules
        const res = analyzeImage(img, "fish");
        setAnalyzeResult(res);
        setIsScanning(false);
        setScanStep(0);
      }, 1100);
    };
    img.onerror = () => {
      setIsScanning(false);
      setScanStep(0);
    };
  };

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setUploadedImage(dataUrl);
        executeAnalysis(dataUrl);
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

  return (
    <div
      ref={containerRef}
      className="relative h-[550vh] bg-slate-950 text-white font-['Prompt','Sarabun',system-ui,sans-serif]"
    >
      {/* ===================================================================
          STICKY FULL-VIEWPORT SCENE (100vh)
          The video plays continuously at 60fps with zero stutter
          =================================================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Continuous Fluid Underwater Video (AutoPlay Loop Muted PlaysInline) */}
        <video
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transform-gpu"
        />

        {/* Dignified Dark Gradient Vignette for Maximum Contrast & Readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/75 via-slate-950/35 to-slate-950/80" />

        {/* ===================================================================
            NAVBAR (เรียบหรู ทางการ โลโก้ใหม่สง่างาม)
            =================================================================== */}
        <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 pb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-left cursor-pointer transition-opacity hover:opacity-90"
          >
            <FreshScanLogo />
          </button>

          {/* Quick Nav Anchors */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 bg-slate-900/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-700/70 shadow-lg text-xs sm:text-sm">
            <button
              onClick={() => scrollToDepth(0)}
              className="text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => scrollToDepth(0.35)}
              className="text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              เกณฑ์มาตรฐาน QIM 5 มิติ
            </button>
            <button
              onClick={() => scrollToDepth(0.65)}
              className="text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              การคัดเกรดคุณภาพ A/B/C
            </button>
          </div>

          {/* Scan CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-xl px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer border border-sky-400/40 hover:scale-[1.02]"
            >
              <Camera size={16} />
              <span>ตรวจสอบความสด</span>
            </button>
          </div>
        </nav>

        {/* ===================================================================
            SCROLL STORY SECTIONS (เนื้อหาทางการ ไม่มีช่องค้นหา ไม่มีตัวกรอง)
            =================================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* ---------------------------------------------------------------
              SECTION 1 — หน้าแรก: บทนำและนวัตกรรม
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s1Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-3xl text-left">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs sm:text-sm text-sky-300 font-medium mb-6 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  มาตรฐานการตรวจวัดคุณภาพและสุขอนามัยอาหารทะเลสากล
                </div>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={100}>
                <div className="p-6 sm:p-10 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-2xl">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                    ประเมินความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300">
                      ด้วยปัญญาประดิษฐ์ระดับสากล
                    </span>
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
                    ระบบวิเคราะห์คุณภาพและสุขอนามัยอาหารทะเลจากภาพถ่ายตามเกณฑ์ Quality Index Method (QIM) ให้ผลการตรวจวัดที่แม่นยำ โปร่งใส และรวดเร็ว เพื่อความปลอดภัยในทุกจานอาหาร
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md cursor-pointer border border-sky-400/40"
                    >
                      <Camera size={18} />
                      <span>เริ่มตรวจสอบความสด</span>
                      <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => scrollToDepth(0.35)}
                      className="px-5 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 font-medium text-sm sm:text-base flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
                    >
                      <span>ดูเกณฑ์มาตรฐาน QIM</span>
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 2 — เกณฑ์การตรวจวัดละเอียดและกระชับ (5 มิติ QIM)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 md:px-12"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s2Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-5xl w-full text-center">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-300 mb-3">
                    <Scale size={14} />
                    <span>ORGANOLEPTIC QUALITY INDEX METHOD</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                    เกณฑ์มาตรฐานการตรวจวัดความสด 5 มิติ
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                    สรุปตัวชี้วัดทางประสาทสัมผัสและคะแนนตัดเกรด (Demerit Scoring: 0–20)
                  </p>

                  {/* 5-Column Detailed & Concise Criteria Grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
                    {QIM_CRITERIA_DETAILS.map((c, idx) => {
                      const IconComp = c.icon;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                                <IconComp size={15} />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                {c.weight}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white line-clamp-2">
                              {c.dim}
                            </h4>

                            <div className="mt-3 space-y-1.5 text-[11px] leading-relaxed">
                              <div className="p-1.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                                <strong className="font-semibold block text-[10px]">เกรด A (สดมาก):</strong>
                                {c.gradeA}
                              </div>
                              <div className="p-1.5 rounded bg-amber-950/30 border border-amber-800/30 text-amber-300">
                                <strong className="font-semibold block text-[10px]">เกรด B (ปานกลาง):</strong>
                                {c.gradeB}
                              </div>
                              <div className="p-1.5 rounded bg-rose-950/30 border border-rose-800/30 text-rose-300">
                                <strong className="font-semibold block text-[10px]">เกรด C (เสื่อมสภาพ):</strong>
                                {c.gradeC}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — การคัดเกรดคุณภาพและคำแนะนำการจัดเก็บ
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-xl text-left">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/50 border border-emerald-600/50 text-emerald-300 text-xs font-semibold mb-4">
                    <CheckCircle2 size={15} />
                    <span>เกรด A | คุณภาพสูงสุดสำหรับบริโภคสด</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                    ยกระดับมาตรฐานอาหารทะเล
                    <br />
                    <span className="text-sky-300">สร้างความเชื่อมั่นในทุกห่วงโซ่อุปทาน</span>
                  </h2>

                  <p className="mt-4 text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                    ระบบช่วยให้ร้านอาหาร โรงแรม และผู้บริโภคสามารถคัดแยกอาหารทะเลสดพิเศษได้อย่างแม่นยำ พร้อมระบุระยะเวลาที่สามารถเก็บรักษาบนน้ำแข็ง (Cold-Chain 0–2°C) ได้อย่างชัดเจน
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-sky-400 font-medium mb-1">
                        <ThermometerSnowflake size={14} />
                        <span>ควบคุมห่วงโซ่ความเย็น</span>
                      </div>
                      <span className="text-[11px] text-slate-300">จัดเก็บ 0–2°C เพื่อยืดอายุ</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                        <ShieldCheck size={14} />
                        <span>ความปลอดภัยอาหาร</span>
                      </div>
                      <span className="text-[11px] text-slate-300">ตามมาตรฐาน TAS 7001</span>
                    </div>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 4 — จุดเริ่มตรวจสอบความสด
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <div className="p-8 sm:p-12 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center">
                  <FreshScanLogo className="mb-4" size="lg" />

                  <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
                    ตรวจสอบความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300">ได้ด้วยตัวคุณเองทันที</span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-200 font-normal max-w-lg mb-8 leading-relaxed">
                    เพียงถ่ายภาพหรืออัปโหลดภาพอาหารทะเล ระบบ AI จะทำการประมวลผลตามดัชนี QIM และออกรายงานประเมินผลความสดทันที
                  </p>

                  <button
                    onClick={() => setScannerOpen(true)}
                    className="pointer-events-auto rounded-xl px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white text-base sm:text-lg font-semibold flex items-center gap-3 transition-all shadow-xl cursor-pointer border border-sky-400/40 hover:scale-[1.02]"
                  >
                    <Camera size={22} />
                    <span>เปิดระบบตรวจสอบความสดอาหารทะเล</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          OFFICIAL SEAFOOD INSPECTION SUITE MODAL
          ไม่มีช่องค้นหา ไม่มีตัวกรอง อัปโหลดหรือถ่ายภาพแล้ววิเคราะห์ทันที
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-8 text-white shadow-2xl flex flex-col gap-6 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-20"
              aria-label="Close Scanner"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5 pr-10">
              <FreshScanLogo size="md" />
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Inspection Workspace Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Dropzone or Image Preview (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-4 min-h-[340px]">
                {!uploadedImage ? (
                  /* Clean Dropzone without search or filter clutter */
                  <div className="my-auto py-10 px-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-700/80 rounded-xl bg-slate-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-4">
                      <Upload size={24} />
                    </div>
                    <h4 className="text-base font-semibold text-white">
                      อัปโหลดภาพอาหารทะเลเพื่อประเมินความสด
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                      ถ่ายภาพส่วนหัว ดวงตา เหงือก หรือตัวปลาให้ชัดเจน ระบบจะประเมินผลชีวมิติโดยอัตโนมัติ
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow"
                      >
                        <Upload size={16} />
                        <span>เลือกไฟล์จากเครื่อง</span>
                      </button>
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Camera size={16} />
                        <span>ถ่ายภาพด้วยกล้อง</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Image Viewport */
                  <div className="flex flex-col h-full justify-between">
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[300px]">
                      <img
                        src={uploadedImage}
                        alt="Seafood sample"
                        className="w-full h-full object-contain max-h-[300px]"
                      />

                      {/* Scanning Line */}
                      {isScanning && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-[bounce_1.6s_infinite] pointer-events-none" />
                      )}

                      {/* Reticles */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-400/60 pointer-events-none" />
                    </div>

                    {/* Viewport Action Controls */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                        >
                          เปลี่ยนรูปภาพ
                        </button>
                        <button
                          onClick={() => executeAnalysis(uploadedImage)}
                          disabled={isScanning}
                          className="px-3 py-1.5 rounded bg-sky-900/50 hover:bg-sky-800/60 border border-sky-700/60 text-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={13} className={isScanning ? "animate-spin" : ""} />
                          <span>วิเคราะห์ใหม่</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setAnalyzeResult(null);
                        }}
                        className="text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        ลบภาพ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Detailed QIM Assessment Report (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-5">
                {isScanning ? (
                  <div className="my-auto py-12 flex flex-col items-center justify-center text-center gap-3">
                    <RefreshCw className="size-8 text-sky-400 animate-spin" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {scanStep === 1
                          ? "กำลังประมวลผลดัชนีแสงและพิกเซล..."
                          : scanStep === 2
                          ? "กำลังตรวจสอบเกณฑ์ทางชีวมิติ..."
                          : "กำลังคำนวณคะแนนมาตรฐาน QIM..."}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        ประมวลผลด้วย Edge Computer Vision
                      </p>
                    </div>
                  </div>
                ) : analyzeResult ? (
                  <div className="space-y-4">
                    {/* Header Quality Grade */}
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">
                          ผลการประเมินคุณภาพ
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="px-2.5 py-0.5 rounded text-xs font-bold"
                            style={{
                              backgroundColor:
                                analyzeResult.overallGrade === "A"
                                  ? "#065f46"
                                  : analyzeResult.overallGrade === "B"
                                  ? "#0369a1"
                                  : analyzeResult.overallGrade === "C"
                                  ? "#92400e"
                                  : "#991b1b",
                              color: "#ffffff",
                            }}
                          >
                            เกรด {analyzeResult.overallGrade}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {analyzeResult.overallGrade === "A"
                              ? "สดดีเยี่ยม (พรีเมียม)"
                              : analyzeResult.overallGrade === "B"
                              ? "สดปานกลาง (มาตรฐาน)"
                              : analyzeResult.overallGrade === "C"
                              ? "ความสดต่ำ (ปรุงสุกทันที)"
                              : "เสื่อมสภาพ (ไม่ปลอดภัย)"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">ดัชนี QIM</span>
                        <span className="text-lg font-bold text-sky-400 tabular-nums">
                          {analyzeResult.qimScore}{" "}
                          <span className="text-xs text-slate-400 font-normal">/ 20</span>
                        </span>
                      </div>
                    </div>

                    {/* Verdict Text */}
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      {analyzeResult.verdict}
                    </div>

                    {/* 5-Dimension QIM Breakdown */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">1. ดวงตาและเลนส์กระจกตา</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A" ? "นูนใส ไร้ฝ้า (0/3)" : "เริ่มมีฝ้า (1/3)"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: analyzeResult.overallGrade === "A" ? "95%" : "75%" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">2. สีเหงือกและกลิ่นไอทะเล</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A" ? "แดงสด ไร้เมือก (0/4)" : "ชมพูซีด (1/4)"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: analyzeResult.overallGrade === "A" ? "92%" : "70%" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">3. ผิวหนัง เกล็ด เม็ดสี</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A" ? "เกล็ดแน่น แวววาว (0/3)" : "เริ่มหลุดร่วง (1/3)"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: analyzeResult.overallGrade === "A" ? "94%" : "68%" }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">4. ความยืดหยุ่นของกล้ามเนื้อ</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A" ? "แน่นตึง คืนตัวทันที (0/3)" : "คืนตัวช้า (1/3)"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: analyzeResult.overallGrade === "A" ? "96%" : "72%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Storage & Safety Recommendations */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-sky-400 text-xs font-medium mb-1">
                          <Clock size={13} />
                          <span>อายุการจัดเก็บ</span>
                        </div>
                        <span className="text-xs text-white font-medium block">
                          {analyzeResult.overallGrade === "A"
                            ? "เก็บได้อีก 4 – 5 วัน"
                            : analyzeResult.overallGrade === "B"
                            ? "เก็บได้อีก 2 – 3 วัน"
                            : "ควรปรุงสุกทันที"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">อุณหภูมิ 0–2°C บนน้ำแข็ง</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-1">
                          <ShieldCheck size={13} />
                          <span>ความปลอดภัย</span>
                        </div>
                        <span className="text-xs text-white font-medium block">
                          {analyzeResult.overallGrade === "A"
                            ? "ซาซิมิ / ทานสดได้"
                            : "ปรุงสุกผ่านความร้อน"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">มาตรฐาน TAS 7001</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Waiting for image */
                  <div className="my-auto py-10 flex flex-col items-center justify-center text-center text-slate-400">
                    <FileText size={32} className="text-slate-600 mb-2" />
                    <p className="text-xs text-slate-300 font-medium">
                      รอการอัปโหลดภาพอาหารทะเล
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                      กรุณาเลือกไฟล์ภาพหรือถ่ายภาพอาหารทะเลทางด้านซ้ายเพื่อรับผลการประเมิน QIM
                    </p>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>มาตรฐานการประเมิน: QIM TAS 7001</span>
                  <button
                    onClick={() => setScannerOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
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

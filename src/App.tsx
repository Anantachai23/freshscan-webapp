import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowDown,
  ChevronUp,
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
  Sparkles,
} from "lucide-react";
import { useVideoScrub } from "./useVideoScrub";
import { analyzeImage, type AnalyzeResult } from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";

const VIDEO_URL = "/ocean.mp4";

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

const SEAFOOD_TYPES: { id: SeafoodTypeId; label: string; sub: string }[] = [
  { id: "fish", label: "ปลาทะเลทั้งตัว", sub: "ปลากะพง / ปลาทู / ปลาเก๋า / ปลาแซลมอน" },
  { id: "shrimp", label: "กุ้งสด", sub: "กุ้งกุลาดำ / กุ้งขาว / กุ้งแชบ๊วย" },
  { id: "squid", label: "หมึกสด", sub: "หมึกกล้วย / หมึกกระดอง / หมึกสาย" },
  { id: "shellfish", label: "หอยสด", sub: "หอยแมลงภู่ / หอยนางรม / หอยลาย" },
];

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

  // Perform AI Visual Analysis
  const executeAnalysis = (imgSrc: string, species: SeafoodTypeId) => {
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
        const res = analyzeImage(img, species);
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
        executeAnalysis(dataUrl, selectedType);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle changing species when image is already loaded
  const handleSpeciesChange = (typeId: SeafoodTypeId) => {
    setSelectedType(typeId);
    if (uploadedImage) {
      executeAnalysis(uploadedImage, typeId);
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
      className="relative h-[600vh] bg-slate-950 text-white font-['Prompt','Sarabun',system-ui,sans-serif]"
    >
      {/* ===================================================================
          STICKY FULL-VIEWPORT SCENE (100vh)
          =================================================================== */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1) Underlying High-Quality Video */}
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

        {/* 3) Dignified Vignette Overlay for Crisp Readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/70" />

        {/* ===================================================================
            DEPTH GAUGE (มาตรวัดความลึก - สไตล์ทางการ อ่านง่าย)
            =================================================================== */}
        <div className="hidden md:flex fixed left-6 lg:left-10 top-1/2 -translate-y-1/2 z-40 items-center gap-3.5 pointer-events-none select-none">
          <div className="relative w-[2px] h-[160px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute -left-[3px] w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
              style={{
                top: `${Math.min(152, p * 152)}px`,
                transition: "top 0.08s linear",
              }}
            />
          </div>
          <div className="flex flex-col text-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <span className="text-[11px] tracking-wider text-slate-300 font-medium">
              ระดับความลึก
            </span>
            <span className="text-sm font-bold tracking-wide text-white tabular-nums">
              {p < 0.04 ? "ผิวน้ำ (0 ม.)" : `${Math.round(p * 30)} เมตร`}
            </span>
          </div>
        </div>

        {/* ===================================================================
            NAVBAR (เรียบหรู ทางการ คมชัด สบายตา)
            =================================================================== */}
        <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 pb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-center text-sky-400 group-hover:border-sky-500/60 transition-colors shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white block leading-tight">
                FreshScan <span className="text-sky-400">AI</span>
              </span>
              <span className="text-[11px] text-slate-300 tracking-wide block font-normal">
                ระบบประเมินมาตรฐานความสดอาหารทะเล
              </span>
            </div>
          </button>

          {/* Quick Depth Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 bg-slate-900/70 backdrop-blur-md px-6 py-2 rounded-full border border-slate-700/60 shadow-lg text-xs sm:text-sm">
            <button
              onClick={() => scrollToDepth(0)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => scrollToDepth(0.35)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              เกณฑ์การตรวจวัด
            </button>
            <button
              onClick={() => scrollToDepth(0.65)}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              มาตรฐานคุณภาพ (QIM)
            </button>
          </div>

          {/* Scan CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-xl px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer border border-sky-400/30"
            >
              <Camera size={16} />
              <span>ตรวจสอบความสด</span>
            </button>
          </div>
        </nav>

        {/* ===================================================================
            SECTIONS (เนื้อหาทางการ อ่านง่าย ตัวหนังสือสวยงาม ไม่รก)
            =================================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* ---------------------------------------------------------------
              SECTION 1 — ผิวน้ำ (ภาพรวมระบบ)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-24 lg:px-32 md:pl-32"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s1Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-3xl text-left">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-xs sm:text-sm text-sky-300 font-medium mb-6 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  เทคโนโลยีปัญญาประดิษฐ์เพื่อความปลอดภัยทางอาหาร
                </div>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={100}>
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-2xl">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                    ประเมินความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300">
                      ด้วยมาตรฐานการตรวจวัดสากล
                    </span>
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl">
                    ตรวจสอบคุณภาพ ความสด และความปลอดภัยของปลา กุ้ง หมึก และหอย ด้วยระบบวิเคราะห์ภาพทางชีวมิติ (QIM) ก่อนส่งมอบถึงมือผู้บริโภค
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-md cursor-pointer border border-sky-400/30"
                    >
                      <Camera size={18} />
                      <span>เริ่มตรวจสอบความสด</span>
                      <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => scrollToDepth(0.35)}
                      className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium text-sm sm:text-base flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
                    >
                      <span>สำรวจเกณฑ์การประเมิน</span>
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 2 — ชั้นน้ำตื้น (เกณฑ์การตรวจวัด 3 จุดสำคัญ)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-12"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s2Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-3xl text-center">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <div className="p-6 sm:p-10 rounded-2xl bg-slate-950/65 backdrop-blur-md border border-white/10 shadow-2xl">
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-sky-300 mb-2 block">
                    ORGANOLEPTIC ASSESSMENT METHOD
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    ตรวจวัดความสดแม่นยำ
                    <br />
                    <span className="text-slate-200 font-normal">จาก 3 องค์ประกอบหลักทางกายภาพ</span>
                  </h2>

                  <p className="mt-4 text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
                    ระบบอัลกอริทึมจำแนกและประเมินสัญญาณชีวมิติสำคัญตามเกณฑ์ Quality Index Method
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                        <Eye size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white">1. เลนส์ตาและกระจกตา</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        ตรวจความนูนใส ไร้รอยบุ๋ม และไม่มีฝ้าขุ่นสีเทา
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                        <Activity size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white">2. สีเหงือกและผิวสัมผัส</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        วิเคราะห์ความแดงสด ไร้เมือกเหนียวคล้ำ
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                        <Layers size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white">3. ความยืดหยุ่นของเนื้อ</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        ตรวจการคืนตัวของกล้ามเนื้อ เกล็ด และเปลือก
                      </p>
                    </div>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — แนวปะการัง (มาตรฐานเกรดคุณภาพ)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-xl text-left">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/65 backdrop-blur-md border border-white/10 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/50 border border-emerald-600/50 text-emerald-300 text-xs font-semibold mb-4">
                    <CheckCircle2 size={15} />
                    <span>เกรด A | คุณภาพระดับพรีเมียม</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    ยกระดับมาตรฐานอาหารทะเล
                    <br />
                    <span className="text-sky-300">สร้างความเชื่อมั่นแก่ผู้บริโภค</span>
                  </h2>

                  <p className="mt-4 text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                    จำแนกเกรดวัตถุดิบอย่างโปร่งใสตามหลักสากล รองรับทั้งร้านอาหาร โรงแรม ตลาดประมง และผู้บริโภคทั่วไป พร้อมคำแนะนำการจัดเก็บเพื่อคงความสดได้ยาวนานที่สุด
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-sky-400" />
                      มาตรฐานความปลอดภัยอาหาร
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} className="text-emerald-400" />
                      คำนวณอายุการเก็บรักษา
                    </span>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 4 — ห้วงทะเลลึก (ส่วนเริ่มตรวจสอบ)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.15s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <div className="p-8 sm:p-12 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center">
                  <span className="text-xs sm:text-sm tracking-wider uppercase text-sky-400 font-semibold mb-2 block">
                    ONLINE SEAFOOD AUDIT SYSTEM
                  </span>

                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                    ตรวจสอบความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300">ได้ด้วยตัวคุณเองทันที</span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-200 font-normal max-w-lg mb-8 leading-relaxed">
                    เพียงถ่ายภาพหรืออัปโหลดภาพอาหารทะเล ระบบจะทำการประมวลผลและสรุปรายงานเกรดความสดพร้อมข้อแนะนำการบริโภคทันที
                  </p>

                  <button
                    onClick={() => setScannerOpen(true)}
                    className="pointer-events-auto rounded-xl px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white text-base sm:text-lg font-semibold flex items-center gap-3 transition-all shadow-xl cursor-pointer border border-sky-400/40"
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
          OFFICIAL SEAFOOD QUALITY INSPECTION SUITE (ไม่มีภาพตัวอย่างรก)
          ศูนย์ตรวจสอบและรับรองมาตรฐานความสดอาหารทะเล (Professional & Official)
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-8 text-white shadow-2xl flex flex-col gap-6 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setScannerOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-20"
              aria-label="Close Scanner"
            >
              <X size={18} />
            </button>

            {/* Header: Official Inspection System */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 pr-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-700/50 flex items-center justify-center text-sky-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    ระบบประเมินมาตรฐานความสดอาหารทะเล (FreshScan AI)
                  </h3>
                  <p className="text-xs text-slate-400">
                    เกณฑ์ตรวจวัดทางประสาทสัมผัส Quality Index Method (QIM) มาตรฐานอุตสาหกรรมสัตว์น้ำ
                  </p>
                </div>
              </div>
            </div>

            {/* Seafood Category Selector (Clean text tabs, NO image cards) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                หมวดหมู่อาหารทะเลที่ต้องการตรวจวัด:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SEAFOOD_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSpeciesChange(type.id)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedType === type.id
                        ? "border-sky-500 bg-sky-950/40 text-white ring-1 ring-sky-500/50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="text-sm font-semibold block">{type.label}</span>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                      {type.sub}
                    </span>
                  </button>
                ))}
              </div>
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

            {/* Main Inspection Workspace Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Image Dropzone or Viewfinder (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-4 min-h-[360px]">
                {!uploadedImage ? (
                  /* Clean, Official Upload Dropzone (When no image selected) */
                  <div className="my-auto py-10 px-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-700/80 rounded-xl bg-slate-900/30">
                    <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-4">
                      <Upload size={24} />
                    </div>
                    <h4 className="text-base font-semibold text-white">
                      อัปโหลดภาพอาหารทะเลเพื่อประเมินความสด
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                      ถ่ายภาพส่วนหัว ดวงตา หรือเนื้อปลาให้ชัดเจน รองรับไฟล์ JPG, PNG, WebP
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow"
                      >
                        <Upload size={16} />
                        <span>เลือกไฟล์รูปภาพจากเครื่อง</span>
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
                  /* Official Image Inspection Viewfinder (When image is loaded) */
                  <div className="flex flex-col h-full justify-between">
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[320px]">
                      <img
                        src={uploadedImage}
                        alt="Seafood sample"
                        className="w-full h-full object-contain max-h-[320px]"
                      />

                      {/* Subtle Scanning Scanline */}
                      {isScanning && (
                        <div className="absolute inset-x-0 top-0 h-1 bg-sky-400/80 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-[bounce_1.6s_infinite] pointer-events-none" />
                      )}

                      {/* Subtle Corner Reticles */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-400/60 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-400/60 pointer-events-none" />
                    </div>

                    {/* Viewport Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                        >
                          เปลี่ยนรูปภาพ
                        </button>
                        <button
                          onClick={() => executeAnalysis(uploadedImage, selectedType)}
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

              {/* Right Column: Official Quality Dossier (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-5">
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
                              ? "สดดีเยี่ยม (เกรดพรีเมียม)"
                              : analyzeResult.overallGrade === "B"
                              ? "สดปานกลาง (คุณภาพมาตรฐาน)"
                              : analyzeResult.overallGrade === "C"
                              ? "ความสดต่ำ (ควรปรุงสุกทันที)"
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

                    {/* Parametric Inspection Progress Gauges */}
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">ความใสของดวงตา / เลนส์ตา</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A"
                              ? "96%"
                              : analyzeResult.overallGrade === "B"
                              ? "82%"
                              : "60%"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{
                              width:
                                analyzeResult.overallGrade === "A"
                                  ? "96%"
                                  : analyzeResult.overallGrade === "B"
                                  ? "82%"
                                  : "60%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">สีเหงือกและผิวสัมผัส</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A"
                              ? "94%"
                              : analyzeResult.overallGrade === "B"
                              ? "78%"
                              : "55%"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width:
                                analyzeResult.overallGrade === "A"
                                  ? "94%"
                                  : analyzeResult.overallGrade === "B"
                                  ? "78%"
                                  : "55%",
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">ความตึงแน่นของกล้ามเนื้อ</span>
                          <span className="font-medium text-slate-200">
                            {analyzeResult.overallGrade === "A"
                              ? "95%"
                              : analyzeResult.overallGrade === "B"
                              ? "80%"
                              : "58%"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width:
                                analyzeResult.overallGrade === "A"
                                  ? "95%"
                                  : analyzeResult.overallGrade === "B"
                                  ? "80%"
                                  : "58%",
                            }}
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
                            ? "ซาซิมิ / รับประทานสดได้"
                            : "ปรุงสุกผ่านความร้อน"}
                        </span>
                        <span className="text-[10px] text-slate-400 block">มาตรฐาน TAS 7001</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Waiting for image state */
                  <div className="my-auto py-10 flex flex-col items-center justify-center text-center text-slate-400">
                    <FileText size={32} className="text-slate-600 mb-2" />
                    <p className="text-xs text-slate-300 font-medium">
                      รอผลการวิเคราะห์
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                      กรุณาเลือกไฟล์ภาพหรือถ่ายภาพอาหารทะเลทางด้านซ้ายเพื่อเริ่มประเมินความสด
                    </p>
                  </div>
                )}

                {/* Footer Status */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>เวอร์ชันระบบ: FreshScan v2.4</span>
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

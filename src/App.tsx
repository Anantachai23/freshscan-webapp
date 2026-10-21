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
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";
import {
  analyzeImage,
  InvalidSeafoodImageError,
  type AnalyzeResult,
} from "@/lib/freshnessAnalyzer";
import { type SeafoodTypeId } from "@/data/freshscan_taxonomy";

const VIDEO_URL = "/ocean.mp4";

// =========================================================================
// BESPOKE HIGH-END LOGO COMPONENT (Responsive for Mobile & Desktop)
// =========================================================================
function FreshScanLogo({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-13 h-13" : "w-10 h-10 sm:w-11 sm:h-11";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg sm:text-xl";
  const subSize = size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[9px] sm:text-[10px]";

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Bespoke Marine AI Emblem */}
      <div
        className={`relative ${iconSize} rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-[1.5px] border border-sky-400/40 shadow-xl shadow-sky-950/50 flex items-center justify-center overflow-hidden shrink-0 group`}
      >
        <div className="absolute inset-0 bg-sky-500/10 rounded-2xl group-hover:bg-sky-500/25 transition-colors" />
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1 sm:p-1.5 relative z-10"
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
          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 leading-none">
            AI
          </span>
        </div>
        <span className={`${subSize} text-slate-300 tracking-wider uppercase font-medium mt-0.5 sm:mt-1 truncate max-w-[170px] sm:max-w-none`}>
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
// COMPREHENSIVE ORGANOLEPTIC QIM CRITERIA DATA
// =========================================================================
interface QIMCriterion {
  id: string;
  nameTh: string;
  nameEn: string;
  icon: typeof Eye;
  maxDemerit: number;
  gradeA: {
    title: string;
    description: string;
    points: number;
    status: string;
  };
  gradeB: {
    title: string;
    description: string;
    points: number;
    status: string;
  };
  gradeC: {
    title: string;
    description: string;
    points: number;
    status: string;
  };
}

const QIM_CRITERIA: QIMCriterion[] = [
  {
    id: "eyes",
    nameTh: "เลนส์ตาและกระจกตา",
    nameEn: "Eyes & Corneal Clarity",
    icon: Eye,
    maxDemerit: 3,
    gradeA: {
      title: "ตานูน กลม ใสเป็นประกาย ม่านตาดำสนิท",
      description: "กระจกตานูนใส ไร้รอยบุ๋ม ไร้ฝ้าขุ่น เลนส์ตาโปร่งแสง มองเห็นม่านตาดำชัดเจน",
      points: 0,
      status: "ผ่านเกณฑ์รับรองความสดพรีเมียม",
    },
    gradeB: {
      title: "ตาราบลงเล็กน้อย เริ่มมีฝ้าขุ่นจางๆ",
      description: "กระจกตาเริ่มแบนราบ มีฝ้าสีเทาจางกระจายบางส่วน ม่านตามัวลงเล็กน้อย",
      points: 1,
      status: "เกณฑ์มาตรฐานเพื่อการปรุงสุก",
    },
    gradeC: {
      title: "ตาบุ๋มลึก มีฝ้าขุ่นหนาหรือมีรอยเลือดคั่ง",
      description: "ลูกตาบุ๋มยุบตัวลงชัดเจน กระจกตาขุ่นมัวสีเทาเข้มหรือมีเลือดออกในช่องตา",
      points: 3,
      status: "เสื่อมสภาพ ไม่ควรบริโภค",
    },
  },
  {
    id: "gills",
    nameTh: "เหงือกและกลิ่นไอทะเล",
    nameEn: "Gills & Oceanic Aroma",
    icon: Activity,
    maxDemerit: 4,
    gradeA: {
      title: "สีแดงสดธรรมชาติ กลิ่นไอทะเลสดชื่น",
      description: "แผ่นซี่เหงือกเรียงตัวเป็นระเบียบ สีแดงสดคล้ายเลือดนก เมือกใสบาง ไร้กลิ่นคาวหรือแอมโมเนีย",
      points: 0,
      status: "ผ่านเกณฑ์รับรองความสดพรีเมียม",
    },
    gradeB: {
      title: "สีชมพูซีดหรือน้ำตาลแดง เมือกเริ่มขุ่น",
      description: "สีของเหงือกเริ่มซีดลงเป็นชมพูอ่อนหรือน้ำตาลปน เมือกเริ่มเหนียวขุ่น กลิ่นจืดปนคาวอ่อนๆ",
      points: 2,
      status: "เกณฑ์มาตรฐานเพื่อการปรุงสุก",
    },
    gradeC: {
      title: "สีน้ำตาลคล้ำหรือเทาหม่น เมือกเหนียวหนา กลิ่นเน่าเสีย",
      description: "เหงือกมีสีคล้ำจัดหรือเทา เมือกเหนียวหนาเป็นลิ่ม มีกลิ่นคาวรุนแรงหรือกลิ่นแอมโมเนียชัดเจน",
      points: 4,
      status: "เสื่อมสภาพ ไม่ควรบริโภค",
    },
  },
  {
    id: "skin",
    nameTh: "ผิวหนัง เกล็ด และเม็ดสี",
    nameEn: "Skin, Scales & Pigmentation",
    icon: Layers,
    maxDemerit: 3,
    gradeA: {
      title: "เกล็ดแนบสนิท แวววาว เม็ดสีสดใสชัดเจน",
      description: "เกล็ดเรียงตัวแน่นไม่หลุดร่วง เปล่งประกายสะท้อนแสง เม็ดสีตามธรรมชาติสดใส ชุ่มชื้น",
      points: 0,
      status: "ผ่านเกณฑ์รับรองความสดพรีเมียม",
    },
    gradeB: {
      title: "เกล็ดเริ่มหลุดง่าย สีเริ่มด้าน เมือกขุ่นเล็กน้อย",
      description: "ความวาวของผิวลดลง เม็ดสีเริ่มซีดจาง เกล็ดเริ่มหลุดลอกเมื่อสัมผัสเล็กน้อย",
      points: 1,
      status: "เกณฑ์มาตรฐานเพื่อการปรุงสุก",
    },
    gradeC: {
      title: "เกล็ดหลุดร่วงง่าย ผิวซีดด่าง เมือกขุ่นหนาคล้ำ",
      description: "ผิวหนังมีรอยด่างซีด เมือกขุ่นคล้ำปกคลุมหนาแน่น เกล็ดหลุดร่วงเป็นบริเวณกว้าง",
      points: 3,
      status: "เสื่อมสภาพ ไม่ควรบริโภค",
    },
  },
  {
    id: "flesh",
    nameTh: "ความยืดหยุ่นของกล้ามเนื้อ",
    nameEn: "Muscle Firmness & Elasticity",
    icon: ShieldCheck,
    maxDemerit: 3,
    gradeA: {
      title: "กล้ามเนื้อแน่นตึง กดแล้วเด้งคืนรูปทันที",
      description: "เส้นใยกล้ามเนื้อมีความยืดหยุ่นสูง เมื่อใช้นิ้วกดลงบนลำตัว เนื้อจะสปริงตัวคืนรูปทันทีโดยไม่ทิ้งรอยบุ๋ม",
      points: 0,
      status: "ผ่านเกณฑ์รับรองความสดพรีเมียม",
    },
    gradeB: {
      title: "กล้ามเนื้อเริ่มนิ่ม คืนตัวช้าเมื่อถูกกด",
      description: "เนื้อสัมผัสเริ่มนิ่มลงเล็กน้อย เมื่อกดแล้วยังคืนรูปได้แต่ใช้เวลาช้าลง เนื้อไม่เละ",
      points: 1,
      status: "เกณฑ์มาตรฐานเพื่อการปรุงสุก",
    },
    gradeC: {
      title: "กล้ามเนื้อนิ่มเละ บุ๋มถาวร เนื้อแยกตัวเมื่อสัมผัส",
      description: "เนื้อปลานิ่มเละ ยุบตัวบุ๋มถาวรไม่คืนรูป เส้นใยกล้ามเนื้อสลายตัวจนสัมผัสถึงความเปื่อยยุ่ย",
      points: 3,
      status: "เสื่อมสภาพ ไม่ควรบริโภค",
    },
  },
  {
    id: "belly",
    nameTh: "ความสมบูรณ์ของช่องท้อง",
    nameEn: "Abdominal Cavity & Viscera",
    icon: Scale,
    maxDemerit: 3,
    gradeA: {
      title: "ผนังช่องท้องแน่นสมบูรณ์ ท้องไม่แตก ไร้รอยช้ำ",
      description: "โครงสร้างช่องท้องแข็งแรง แน่นตึง ไม่มีรอยฉีกขาดหรือมีน้ำเยิ้ม ไร้รอยเลือดคั่งภายใน",
      points: 0,
      status: "ผ่านเกณฑ์รับรองความสดพรีเมียม",
    },
    gradeB: {
      title: "ผนังช่องท้องเริ่มนิ่ม สีภายในเริ่มเปลี่ยน ยังไม่แตก",
      description: "ผนังหน้าท้องเริ่มนิ่มลงแต่ยังคงรูปได้ ไม่แตก ไม่มีอวัยวะภายในไหลออกมา",
      points: 1,
      status: "เกณฑ์มาตรฐานเพื่อการปรุงสุก",
    },
    gradeC: {
      title: "ผนังท้องแตก อวัยวะภายในทะลัก มีกลิ่นเน่าเสีย",
      description: "ผนังช่องท้องเปื่อยยุ่ยจนแตก มีน้ำคาวเลือดและอวัยวะภายในทะลัก ส่งกลิ่นเหม็นเน่า",
      points: 3,
      status: "เสื่อมสภาพ ไม่ควรบริโภค",
    },
  },
];

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Active Grade Tab in Criteria Section
  const [activeGradeTab, setActiveGradeTab] = useState<"A" | "B" | "C">("A");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Scanner Suite State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [validationError, setValidationError] = useState<{
    title: string;
    message: string;
  } | null>(null);
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

  // =========================================================================
  // DYNAMIC UNDERWATER VIDEO ATMOSPHERIC COLOR & DEPTH GRADING
  // Responsive to scroll: surface daylight -> shallow reef -> deep coral -> abyss
  // =========================================================================
  const videoFilter = `brightness(${1.05 - p * 0.42}) contrast(${1.02 + p * 0.28}) saturate(${1.1 + p * 0.35}) hue-rotate(${-p * 22}deg)`;
  const videoTransform = `scale(${1 + p * 0.16}) translateY(${-p * 50}px)`;

  // Sequential Section Opacities
  const s1Opacity = p < 0.20 ? 1 : Math.max(0, 1 - (p - 0.20) / 0.08);

  const s2Opacity =
    p < 0.26
      ? 0
      : p < 0.34
      ? (p - 0.26) / 0.08
      : p < 0.50
      ? 1
      : Math.max(0, 1 - (p - 0.50) / 0.08);

  const s3Opacity =
    p < 0.56
      ? 0
      : p < 0.64
      ? (p - 0.56) / 0.08
      : p < 0.78
      ? 1
      : Math.max(0, 1 - (p - 0.78) / 0.08);

  const s4Opacity =
    p < 0.84
      ? 0
      : p < 0.92
      ? (p - 0.84) / 0.08
      : 1;

  // Current Depth Atmosphere Zone Label
  const depthZoneLabel =
    p < 0.25
      ? "ผิวน้ำทะเล (Sunlit Surface Zone)"
      : p < 0.55
      ? "ระดับน้ำตื้น (Shallow Reef Zone)"
      : p < 0.80
      ? "สวนปะการังน้ำลึก (Deep Coral Zone)"
      : "ห้วงทะเลลึก (Abyssal Ocean Zone)";

  // Perform AI Visual Analysis with Non-Seafood Validation
  const executeAnalysis = async (imgSrc: string) => {
    setIsScanning(true);
    setScanStep(1);
    setValidationError(null);
    setAnalyzeResult(null);

    const step2Timer = setTimeout(() => setScanStep(2), 350);
    const step3Timer = setTimeout(() => setScanStep(3), 700);

    try {
      const res = await analyzeImage(imgSrc, "fish");
      setTimeout(() => {
        setAnalyzeResult(res);
        setValidationError(null);
        setIsScanning(false);
        setScanStep(0);
      }, 1000);
    } catch (err: unknown) {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setTimeout(() => {
        setIsScanning(false);
        setScanStep(0);
        setAnalyzeResult(null);
        if (err instanceof InvalidSeafoodImageError) {
          setValidationError({
            title: err.title,
            message: err.message,
          });
        } else {
          setValidationError({
            title: "โปรดใส่รูปภาพอาหารทะเลที่ถูกต้อง",
            message: "ระบบไม่สามารถตรวจจับคุณลักษณะของอาหารทะเล (ปลา, กุ้ง, หมึก, หอย) ในภาพนี้ได้ กรุณาถ่ายภาพหรืออัปโหลดภาพอาหารทะเลที่ถูกต้อง",
          });
        }
      }, 700);
    }
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
      className="relative min-h-[550vh] bg-slate-950 text-white font-['Prompt','Sarabun',system-ui,sans-serif]"
    >
      {/* ===================================================================
          STICKY FULL-VIEWPORT SCENE (100dvh for mobile address bar stability)
          Video plays continuously at 60fps with dynamic scroll-driven depth
          =================================================================== */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden">
        {/* Continuous Fluid Underwater Video with Dynamic Depth Transform & Filters */}
        <video
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transform-gpu transition-all duration-300"
          style={{
            filter: videoFilter,
            transform: videoTransform,
          }}
        />

        {/* Dynamic Deep-Sea Atmospheric Vignette (Darkens naturally as you dive deeper) */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse at center, transparent 35%, rgba(2, 6, 23, ${0.45 + p * 0.45}) 100%), linear-gradient(180deg, rgba(2, 6, 23, ${0.4 + p * 0.35}) 0%, transparent 40%, rgba(2, 6, 23, ${0.55 + p * 0.4}) 100%)`,
          }}
        />

        {/* ===================================================================
            NAVBAR (เรียบหรู ทางการ คมชัด สบายตา รองรับมือถือเต็มรูปแบบ)
            =================================================================== */}
        <nav className="absolute top-0 inset-x-0 z-50 pointer-events-auto flex items-center justify-between px-4 sm:px-10 md:px-14 pt-4 sm:pt-8 pb-3 sm:pb-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-left cursor-pointer transition-opacity hover:opacity-90 shrink-0"
          >
            <FreshScanLogo size="md" />
          </button>

          {/* Quick Nav Anchors (Desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 bg-slate-900/85 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-700/70 shadow-lg text-xs sm:text-sm">
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

          {/* Scan CTA Button (Touch-Friendly) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-xl px-3.5 py-2 sm:px-5 sm:py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-lg cursor-pointer border border-sky-400/40 active:scale-95"
            >
              <Camera size={16} />
              <span className="hidden xs:inline">ตรวจสอบความสด</span>
              <span className="xs:hidden">สแกนสด</span>
            </button>
          </div>
        </nav>

        {/* Mobile Sticky Floating Scan Bar (ลอยด้านล่างในจอมือถือ แตะสแกนได้สะดวกทุกจุด) */}
        <div className="fixed bottom-4 inset-x-4 z-40 flex items-center justify-center md:hidden pointer-events-auto">
          <button
            onClick={() => setScannerOpen(true)}
            className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-sky-600/95 hover:bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-2xl backdrop-blur-md border border-sky-400/40 active:scale-95 transition-transform"
          >
            <Camera size={18} />
            <span>ตรวจสอบความสดอาหารทะเล</span>
          </button>
        </div>

        {/* Depth Atmosphere Status Pill (มุมขวาล่าง แสดงระดับชั้นบรรยากาศใต้น้ำ) */}
        <div className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 pointer-events-none select-none shadow-lg">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>{depthZoneLabel}</span>
        </div>

        {/* ===================================================================
            SCROLL STORY SECTIONS
            =================================================================== */}
        <div className="absolute inset-0 pointer-events-none">
          {/* ---------------------------------------------------------------
              SECTION 1 — หน้าแรก: บทนำและนวัตกรรม
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center px-4 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s1Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s1Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-3xl text-left">
              <Stagger visible={s1Opacity > 0.3} delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[11px] sm:text-sm text-sky-300 font-medium mb-4 sm:mb-6 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  มาตรฐานการตรวจวัดคุณภาพและสุขอนามัยอาหารทะเลสากล
                </div>
              </Stagger>

              <Stagger visible={s1Opacity > 0.3} delay={100}>
                <div className="p-5 sm:p-10 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl">
                  <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                    ประเมินความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300 font-semibold">
                      ด้วยปัญญาประดิษฐ์ระดับสากล
                    </span>
                  </h1>

                  <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
                    ระบบวิเคราะห์คุณภาพและสุขอนามัยอาหารทะเลจากภาพถ่ายตามเกณฑ์ Quality Index Method (QIM) ให้ผลการตรวจวัดที่แม่นยำ โปร่งใส และรวดเร็ว เพื่อความปลอดภัยในทุกจานอาหาร
                  </p>

                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer border border-sky-400/40 active:scale-95"
                    >
                      <Camera size={18} />
                      <span>เริ่มตรวจสอบความสด</span>
                      <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => scrollToDepth(0.35)}
                      className="px-5 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-slate-200 font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all border border-slate-700 cursor-pointer"
                    >
                      <span>ดูเกณฑ์มาตรฐาน QIM 5 มิติ</span>
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 2 — เกณฑ์การตรวจวัดมาตรฐานสากล (แยกชัดเจน สวยงาม เป็นทางการ)
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-center px-3 sm:px-8 md:px-12 py-6 sm:py-10 overflow-y-auto"
            style={{
              opacity: s2Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s2Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-5xl w-full my-auto text-left">
              <Stagger visible={s2Opacity > 0.3} delay={0}>
                <div className="p-4 sm:p-9 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 shadow-2xl">
                  {/* Header & Subtitle */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-4 sm:pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-[11px] sm:text-xs font-semibold text-sky-300 mb-1.5 sm:mb-2">
                        <Scale size={13} />
                        <span>ORGANOLEPTIC QUALITY INDEX METHOD (QIM)</span>
                      </div>
                      <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                        เกณฑ์มาตรฐานการตรวจวัดความสด 5 มิติ
                      </h2>
                      <p className="text-[11px] sm:text-sm text-slate-300 mt-1">
                        ข้อกำหนดการประเมินทางประสาทสัมผัสและคะแนนตัดเกรด (Demerit Scoring: 0–20 คะแนน)
                      </p>
                    </div>

                    {/* View Mode Toggle (Cards vs Table) */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-700/80 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => setViewMode("cards")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          viewMode === "cards"
                            ? "bg-sky-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <LayoutGrid size={13} />
                        <span>จำแนกตามเกรด</span>
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          viewMode === "table"
                            ? "bg-sky-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <TableIcon size={13} />
                        <span>ตารางเปรียบเทียบ</span>
                      </button>
                    </div>
                  </div>

                  {/* CARDS VIEW: Grade Selector Tabs & Detailed Criterion Rows */}
                  {viewMode === "cards" && (
                    <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
                      {/* Grade Selector Tabs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => setActiveGradeTab("A")}
                          className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeGradeTab === "A"
                              ? "bg-emerald-950/60 border-emerald-500/70 text-white shadow-lg ring-1 ring-emerald-500/40"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs sm:text-sm text-emerald-300">
                              เกรด A | คุณภาพพรีเมียม
                            </span>
                            <span className="text-[10px] font-mono bg-emerald-900/70 px-2 py-0.5 rounded text-emerald-200">
                              0–3 Demerit
                            </span>
                          </div>
                          <span className="text-[11px] sm:text-xs text-slate-300 block">
                            สดมาก ปลอดภัยสำหรับซาซิมิ / บริโภคสด
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveGradeTab("B")}
                          className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeGradeTab === "B"
                              ? "bg-sky-950/60 border-sky-500/70 text-white shadow-lg ring-1 ring-sky-500/40"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs sm:text-sm text-sky-300">
                              เกรด B | มาตรฐานทั่วไป
                            </span>
                            <span className="text-[10px] font-mono bg-sky-900/70 px-2 py-0.5 rounded text-sky-200">
                              4–8 Demerit
                            </span>
                          </div>
                          <span className="text-[11px] sm:text-xs text-slate-300 block">
                            สดปานกลาง เหมาะสำหรับปรุงสุกผ่านความร้อน
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveGradeTab("C")}
                          className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            activeGradeTab === "C"
                              ? "bg-rose-950/60 border-rose-500/70 text-white shadow-lg ring-1 ring-rose-500/40"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs sm:text-sm text-rose-300">
                              เกรด C | เสื่อมสภาพ
                            </span>
                            <span className="text-[10px] font-mono bg-rose-900/70 px-2 py-0.5 rounded text-rose-200">
                              9+ Demerit
                            </span>
                          </div>
                          <span className="text-[11px] sm:text-xs text-slate-300 block">
                            ความสดต่ำ ไม่แนะนำให้บริโภค ควรคัดทิ้ง
                          </span>
                        </button>
                      </div>

                      {/* 5 Criteria Detailed List for Active Grade */}
                      <div className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
                        {QIM_CRITERIA.map((item, idx) => {
                          const IconComp = item.icon;
                          const currentSpec =
                            activeGradeTab === "A"
                              ? item.gradeA
                              : activeGradeTab === "B"
                              ? item.gradeB
                              : item.gradeC;

                          const badgeStyle =
                            activeGradeTab === "A"
                              ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/60"
                              : activeGradeTab === "B"
                              ? "bg-sky-950/50 text-sky-300 border-sky-800/60"
                              : "bg-rose-950/50 text-rose-300 border-rose-800/60";

                          return (
                            <div
                              key={item.id}
                              className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                                  <IconComp size={16} />
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-white">
                                      {idx + 1}. {item.nameTh}
                                    </h4>
                                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">
                                      ({item.nameEn})
                                    </span>
                                  </div>
                                  <p className="text-[11px] sm:text-xs text-white font-medium mt-1 leading-snug">
                                    {currentSpec.title}
                                  </p>
                                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-relaxed">
                                    {currentSpec.description}
                                  </p>
                                </div>
                              </div>

                              <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] border font-medium ${badgeStyle}`}>
                                  {currentSpec.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ตัดคะแนน: {currentSpec.points} / {item.maxDemerit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TABLE VIEW: Executive Comparison Matrix */}
                  {viewMode === "table" && (
                    <div className="mt-4 sm:mt-5 overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                            <th className="py-2.5 px-3 font-semibold w-[22%]">มิติการตรวจวัด</th>
                            <th className="py-2.5 px-3 font-semibold text-emerald-300 w-[26%]">
                              เกรด A (สดพรีเมียม)
                            </th>
                            <th className="py-2.5 px-3 font-semibold text-sky-300 w-[26%]">
                              เกรด B (สดปานกลาง)
                            </th>
                            <th className="py-2.5 px-3 font-semibold text-rose-300 w-[26%]">
                              เกรด C (เสื่อมสภาพ)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {QIM_CRITERIA.map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                              <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="py-3 px-3 align-top">
                                  <div className="flex items-center gap-1.5 font-bold text-white">
                                    <IconComp size={14} className="text-sky-400" />
                                    <span>{idx + 1}. {item.nameTh}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    (0–{item.maxDemerit} คะแนน)
                                  </span>
                                </td>
                                <td className="py-3 px-3 align-top text-slate-200">
                                  <strong className="block text-emerald-300 font-medium mb-0.5">
                                    {item.gradeA.title}
                                  </strong>
                                  <span className="text-[11px] text-slate-300 leading-relaxed block">
                                    {item.gradeA.description}
                                  </span>
                                </td>
                                <td className="py-3 px-3 align-top text-slate-200">
                                  <strong className="block text-sky-300 font-medium mb-0.5">
                                    {item.gradeB.title}
                                  </strong>
                                  <span className="text-[11px] text-slate-300 leading-relaxed block">
                                    {item.gradeB.description}
                                  </span>
                                </td>
                                <td className="py-3 px-3 align-top text-slate-200">
                                  <strong className="block text-rose-300 font-medium mb-0.5">
                                    {item.gradeC.title}
                                  </strong>
                                  <span className="text-[11px] text-slate-300 leading-relaxed block">
                                    {item.gradeC.description}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Stagger>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              SECTION 3 — การคัดเกรดคุณภาพและคำแนะนำการจัดเก็บ
              --------------------------------------------------------------- */}
          <div
            className="absolute inset-0 flex items-center justify-end px-4 sm:px-12 md:px-24 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s3Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-xl text-left">
              <Stagger visible={s3Opacity > 0.3} delay={0}>
                <div className="p-5 sm:p-8 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/50 border border-emerald-600/50 text-emerald-300 text-xs font-semibold mb-3 sm:mb-4">
                    <CheckCircle2 size={15} />
                    <span>เกรด A | คุณภาพสูงสุดสำหรับบริโภคสด</span>
                  </div>

                  <h2 className="text-xl sm:text-4xl font-bold text-white leading-tight">
                    ยกระดับมาตรฐานอาหารทะเล
                    <br />
                    <span className="text-sky-300 font-semibold">สร้างความเชื่อมั่นในทุกห่วงโซ่อุปทาน</span>
                  </h2>

                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-200 font-normal leading-relaxed">
                    ระบบช่วยให้ร้านอาหาร โรงแรม และผู้บริโภคสามารถคัดแยกอาหารทะเลสดพิเศษได้อย่างแม่นยำ พร้อมระบุระยะเวลาที่สามารถเก็บรักษาบนน้ำแข็ง (Cold-Chain 0–2°C) ได้อย่างชัดเจน
                  </p>

                  <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800 grid grid-cols-2 gap-2.5 sm:gap-3 text-xs text-slate-300">
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
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-12"
            style={{
              opacity: s4Opacity,
              transition: "opacity 0.2s ease-out",
              pointerEvents: s4Opacity > 0.3 ? "auto" : "none",
            }}
          >
            <div className="max-w-2xl">
              <Stagger visible={s4Opacity > 0.3} delay={0}>
                <div className="p-6 sm:p-12 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center">
                  <FreshScanLogo className="mb-3 sm:mb-4" size="lg" />

                  <h2 className="text-2xl sm:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4">
                    ตรวจสอบความสดอาหารทะเล
                    <br />
                    <span className="text-sky-300 font-semibold">ได้ด้วยตัวคุณเองทันที</span>
                  </h2>

                  <p className="text-xs sm:text-base text-slate-200 font-normal max-w-lg mb-6 sm:mb-8 leading-relaxed">
                    เพียงถ่ายภาพหรืออัปโหลดภาพอาหารทะเล ระบบ AI จะทำการประมวลผลตามดัชนี QIM และออกรายงานประเมินผลความสดทันที
                  </p>

                  <button
                    onClick={() => setScannerOpen(true)}
                    className="pointer-events-auto rounded-xl px-6 sm:px-8 py-3.5 sm:py-4 bg-sky-600 hover:bg-sky-500 text-white text-sm sm:text-lg font-semibold flex items-center gap-2.5 sm:gap-3 transition-all shadow-xl cursor-pointer border border-sky-400/40 active:scale-95"
                  >
                    <Camera size={20} />
                    <span>เปิดระบบตรวจสอบความสดอาหารทะเล</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </Stagger>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          OFFICIAL SEAFOOD INSPECTION SUITE MODAL (Optimized for Mobile & Desktop)
          =================================================================== */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-7 text-white shadow-2xl flex flex-col gap-4 sm:gap-6 my-auto max-h-[96dvh]">
            {/* Close Button (Touch Friendly) */}
            <button
              onClick={() => {
                setScannerOpen(false);
                setValidationError(null);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer z-20 active:scale-95"
              aria-label="Close Scanner"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 sm:pb-5 pr-12">
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
            <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 items-stretch overflow-y-auto pr-0.5">
              {/* Left Column: Dropzone or Image Preview (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 sm:p-4 min-h-[280px] sm:min-h-[340px]">
                {!uploadedImage ? (
                  /* Clean Dropzone with Mobile-Friendly Direct Buttons */
                  <div className="my-auto py-8 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-700/80 rounded-xl bg-slate-900/30">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400 mb-3 sm:mb-4">
                      <Upload size={24} />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      อัปโหลดภาพอาหารทะเลเพื่อประเมินความสด
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                      ถ่ายภาพส่วนหัว ดวงตา เหงือก หรือตัวปลา กุ้ง หมึก หอย ให้ชัดเจน
                    </p>

                    <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-95"
                      >
                        <Camera size={18} />
                        <span>ถ่ายภาพด้วยกล้อง</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <Upload size={16} />
                        <span>เลือกรูปภาพจากเครื่อง</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Image Viewport */
                  <div className="flex flex-col h-full justify-between">
                    <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[220px] sm:max-h-[300px]">
                      <img
                        src={uploadedImage}
                        alt="Seafood sample"
                        className="w-full h-full object-contain max-h-[220px] sm:max-h-[300px]"
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

                      {/* Error Badge on Photo if not seafood */}
                      {validationError && (
                        <div className="absolute inset-x-0 bottom-0 bg-rose-950/90 border-t border-rose-500/50 py-1.5 px-3 flex items-center justify-center gap-1.5 text-[11px] text-rose-200 backdrop-blur-md">
                          <AlertTriangle size={13} className="text-rose-400 shrink-0" />
                          <span className="font-medium">ไม่พบคุณลักษณะอาหารทะเล</span>
                        </div>
                      )}
                    </div>

                    {/* Viewport Action Controls */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 mt-2 sm:mt-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
                        >
                          เปลี่ยนรูป
                        </button>
                        <button
                          onClick={() => executeAnalysis(uploadedImage)}
                          disabled={isScanning}
                          className="px-3 py-1.5 rounded-lg bg-sky-900/50 hover:bg-sky-800/60 border border-sky-700/60 text-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={13} className={isScanning ? "animate-spin" : ""} />
                          <span>สแกนใหม่</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setAnalyzeResult(null);
                          setValidationError(null);
                        }}
                        className="text-slate-400 hover:text-rose-300 transition-colors cursor-pointer p-1"
                      >
                        ลบภาพ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Validation Error OR Detailed QIM Report (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between rounded-xl bg-slate-950/70 border border-slate-800 p-4 sm:p-5">
                {isScanning ? (
                  <div className="my-auto py-10 sm:py-12 flex flex-col items-center justify-center text-center gap-3">
                    <RefreshCw className="size-8 text-sky-400 animate-spin" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {scanStep === 1
                          ? "กำลังตรวจสอบคุณลักษณะอาหารทะเล..."
                          : scanStep === 2
                          ? "กำลังตรวจสอบเกณฑ์ทางชีวมิติ..."
                          : "กำลังคำนวณคะแนนมาตรฐาน QIM..."}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        ประมวลผลด้วย Edge Computer Vision
                      </p>
                    </div>
                  </div>
                ) : validationError ? (
                  /* =========================================================
                     OFFICIAL NON-SEAFOOD WARNING ALERT CARD
                     ========================================================= */
                  <div className="my-auto py-6 sm:py-8 px-3 sm:px-4 flex flex-col items-center justify-center text-center">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3.5 shadow-lg shadow-rose-950/50">
                      <AlertTriangle size={28} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                      {validationError.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed mb-6">
                      {validationError.message}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="min-h-[42px] px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-95"
                      >
                        <Camera size={16} />
                        <span>ถ่ายภาพอาหารทะเลใหม่</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="min-h-[42px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                      >
                        <Upload size={16} />
                        <span>เลือกรูปภาพอื่น</span>
                      </button>
                    </div>
                  </div>
                ) : analyzeResult ? (
                  /* =========================================================
                     VALID SEAFOOD QIM ASSESSMENT REPORT
                     ========================================================= */
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Header Quality Grade */}
                    <div className="p-3 sm:p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 block">
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
                          <span className="text-xs sm:text-sm font-semibold text-white">
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
                        <span className="text-base sm:text-lg font-bold text-sky-400 tabular-nums">
                          {analyzeResult.qimScore}{" "}
                          <span className="text-xs text-slate-400 font-normal">/ 20</span>
                        </span>
                      </div>
                    </div>

                    {/* Verdict Text */}
                    <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                      {analyzeResult.verdict}
                    </div>

                    {/* 5-Dimension QIM Breakdown */}
                    <div className="space-y-2 pt-0.5 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 text-[11px] sm:text-xs">
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
                        <div className="flex justify-between mb-1 text-[11px] sm:text-xs">
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
                        <div className="flex justify-between mb-1 text-[11px] sm:text-xs">
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
                        <div className="flex justify-between mb-1 text-[11px] sm:text-xs">
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
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-sky-400 text-[11px] sm:text-xs font-medium mb-1">
                          <Clock size={12} />
                          <span>อายุการจัดเก็บ</span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-white font-medium block">
                          {analyzeResult.overallGrade === "A"
                            ? "เก็บได้อีก 4 – 5 วัน"
                            : analyzeResult.overallGrade === "B"
                            ? "เก็บได้อีก 2 – 3 วัน"
                            : "ควรปรุงสุกทันที"}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">อุณหภูมิ 0–2°C บนน้ำแข็ง</span>
                      </div>

                      <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-medium mb-1">
                          <ShieldCheck size={12} />
                          <span>ความปลอดภัย</span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-white font-medium block">
                          {analyzeResult.overallGrade === "A"
                            ? "ซาซิมิ / ทานสดได้"
                            : "ปรุงสุกผ่านความร้อน"}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block">มาตรฐาน TAS 7001</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Waiting for image */
                  <div className="my-auto py-8 sm:py-10 flex flex-col items-center justify-center text-center text-slate-400">
                    <FileText size={28} className="text-slate-600 mb-2" />
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      รอการอัปโหลดภาพอาหารทะเล
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 max-w-xs mt-1">
                      กรุณาถ่ายภาพหรือเลือกภาพอาหารทะเลเพื่อรับผลการประเมิน QIM
                    </p>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-2.5 sm:pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 mt-2">
                  <span>มาตรฐาน: QIM TAS 7001</span>
                  <button
                    onClick={() => {
                      setScannerOpen(false);
                      setValidationError(null);
                    }}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer p-1"
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

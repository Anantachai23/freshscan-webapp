import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  ArrowLeft,
  Loader2,
  Sparkles,
  RefreshCw,
  ImageIcon,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Fish,
  Shell,
  CircleDot,
  Camera,
  VideoOff,
  Printer,
  Info,
  ThermometerSnowflake,
  Clock,
  Award,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { SEAFOOD_TYPES, FRESHNESS_GRADES, type SeafoodTypeId } from "@/data/freshscan_taxonomy";
import {
  analyzeImage,
  LOW_CONFIDENCE_THRESHOLD,
  type AnalyzeResult,
} from "@/lib/freshnessAnalyzer";
import { prepareImageForAnalysis, formatBytes } from "@/lib/imageResize";
import sampleFishImg from "@/assets/fish-sample.jpg";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>): { type?: SeafoodTypeId } => {
    const valid: SeafoodTypeId[] = ["fish", "shrimp", "shellfish", "squid"];
    const t = search.type as SeafoodTypeId;
    return {
      type: valid.includes(t) ? t : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "ระบบตรวจวัดความสดอาหารทะเลระดับสากล · FreshScan Marine™" },
      {
        name: "description",
        content:
          "วิเคราะห์ความสดอาหารทะเลตามมาตรฐาน Quality Index Method (QIM) และ TAS 7001-2550 รองรับกล้องมือถือและการอัปโหลดภาพ ประมวลผลแบบ Edge ทันที",
      },
    ],
  }),
  component: AnalyzePage,
});

const TYPE_ICONS: Record<SeafoodTypeId, React.ReactNode> = {
  fish: <Fish className="size-5" />,
  shrimp: <CircleDot className="size-5" />,
  shellfish: <Shell className="size-5" />,
  squid: <Sparkles className="size-5" />,
};

const gradeColor = (id: string) =>
  FRESHNESS_GRADES.find((g) => g.id === id)?.colorHex ?? "#0ea5e9";

function AnalyzePage() {
  const search = Route.useSearch();
  const [type, setType] = useState<SeafoodTypeId>(search.type || "fish");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "compressing" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "camera">("upload");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [resizeInfo, setResizeInfo] = useState<{
    wasResized: boolean;
    originalSize: number;
    finalSize: number;
    originalDimensions: { width: number; height: number };
    finalDimensions: { width: number; height: number };
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ไม่สามารถเข้าถึงกล้องได้";
      setCameraError(msg + " — กรุณาอนุญาตการเข้าถึงกล้องในเบราว์เซอร์");
      setCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `scan-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        stopCamera();
        setInputMode("upload");
        await handleFile(capturedFile);
      },
      "image/jpeg",
      0.92,
    );
  };

  const handleFile = async (f?: File) => {
    if (!f || !type) return;
    setStatus("compressing");
    setResult(null);
    setResizeInfo(null);
    try {
      const prepared = await prepareImageForAnalysis(f);
      setFile(prepared.file);
      setImage(prepared.dataUrl);
      setResizeInfo({
        wasResized: prepared.wasResized,
        originalSize: prepared.originalSize,
        finalSize: prepared.finalSize,
        originalDimensions: prepared.originalDimensions,
        finalDimensions: prepared.finalDimensions,
      });
      setStatus("analyzing");
      const analyzed = await analyzeImage(type, prepared.file, {
        imageWasResized: prepared.wasResized,
      });
      setResult(analyzed);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      // eslint-disable-next-line no-console
      console.error("เตรียมภาพไม่สำเร็จ", err);
    }
  };

  const loadSample = async () => {
    try {
      setStatus("compressing");
      const resp = await fetch(sampleFishImg);
      const blob = await resp.blob();
      const sampleFile = new File([blob], "sample-mackerel.jpg", { type: "image/jpeg" });
      setType("fish");
      await handleFile(sampleFile);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("โหลดภาพตัวอย่างไม่สำเร็จ", err);
      setStatus("idle");
    }
  };

  const reset = () => {
    stopCamera();
    setImage(null);
    setFile(null);
    setResult(null);
    setResizeInfo(null);
    setStatus("idle");
  };

  const selectedType = SEAFOOD_TYPES.find((t) => t.id === type)!;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="px-4 py-5 border-b border-sky-500/15 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="size-4 text-cyan-400" /> กลับหน้าหลัก FreshScan
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/species"
              className="text-xs text-sky-400 hover:text-sky-300 font-medium transition"
            >
              คู่มือสายพันธุ์ (Species Hub) →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-8">
        {/* Title & Status */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <Sparkles className="size-3.5 text-cyan-400" />
            QIM 2.0 SCIENTIFIC SEAFOOD ANALYZER
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            สแกนตรวจสอบความสด <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              มาตรฐานสากล Quality Index Method
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ประเมินคะแนนจุดด้อยทางกายภาพ (Demerit Points 0–20) และดัชนีความสด (0–100%)
            ประมวลผลทันทีบนเบราว์เซอร์ด้วยคอมพิวเตอร์วิทัศน์ ปลอดภัย ไม่ส่งภาพออกนอกเครื่อง
          </p>
        </div>

        {/* Step 1: Category Picker */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="size-6 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold grid place-items-center">
                1
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white font-display">
                เลือกประเภทสัตว์น้ำ (Taxonomic Class)
              </h2>
            </div>
            <button
              onClick={loadSample}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition"
            >
              <Sparkles className="size-3.5 text-amber-400" />
              ทดสอบด้วยภาพตัวอย่าง
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SEAFOOD_TYPES.map((t) => {
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setType(t.id);
                    if (file) handleFile(file);
                  }}
                  className={`group relative overflow-hidden text-left rounded-2xl border p-4 transition-all ${
                    active
                      ? "border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/50"
                      : "border-sky-500/20 bg-slate-900/40 hover:border-sky-500/40 hover:bg-slate-900/70"
                  }`}
                >
                  <div
                    className={`size-10 rounded-xl grid place-items-center transition ${
                      active
                        ? "bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 font-bold"
                        : "bg-sky-500/10 text-cyan-300 border border-sky-500/20"
                    }`}
                  >
                    {TYPE_ICONS[t.id]}
                  </div>
                  <div className="mt-3 font-display font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {t.labelTh}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {t.supportedSpecies.map((s) => s.commonTh).join(" · ")}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 + Step 3: Input & Results */}
        <section className="mt-8 grid lg:grid-cols-[1.1fr_1.3fr] gap-6 items-start">
          {/* Input Panel */}
          <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold grid place-items-center">
                  2
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  ป้อนภาพถ่าย (Optical Input)
                </h3>
              </div>

              {/* Mode switch */}
              <div className="flex p-0.5 rounded-xl bg-slate-950 border border-sky-500/20">
                <button
                  onClick={() => {
                    stopCamera();
                    setInputMode("upload");
                  }}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    inputMode === "upload"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  อัปโหลดไฟล์
                </button>
                <button
                  onClick={() => {
                    setInputMode("camera");
                    startCamera();
                  }}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
                    inputMode === "camera"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Camera className="size-3" /> เปิดกล้องสด
                </button>
              </div>
            </div>

            {/* Viewfinder / Upload Area */}
            {inputMode === "camera" ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border-2 border-sky-500/30 grid place-items-center">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="size-full object-cover"
                />

                {/* Reticle */}
                <div className="absolute inset-8 border border-cyan-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300/80">
                    <span>QIM ALIGNMENT TARGET</span>
                    <span>HD 1080P</span>
                  </div>
                  <div className="self-center size-12 border border-cyan-400/50 rounded-full grid place-items-center">
                    <div className="size-2 bg-cyan-400 rounded-full animate-ping" />
                  </div>
                  <div className="text-center text-[10px] text-slate-400 bg-slate-950/70 py-0.5 rounded backdrop-blur-sm">
                    เล็งให้เห็น ตา / เหงือก / เปลือก ในระยะ 15–30 ซม.
                  </div>
                </div>

                {cameraError && (
                  <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center">
                    <VideoOff className="size-10 text-amber-400 mb-2" />
                    <div className="text-sm font-bold text-amber-200">{cameraError}</div>
                    <button
                      onClick={startCamera}
                      className="mt-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 font-medium"
                    >
                      ลองใหม่อีกครั้ง
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      className="size-16 rounded-full bg-white text-slate-950 border-4 border-cyan-400 shadow-lg shadow-cyan-500/50 grid place-items-center active:scale-95 transition"
                      aria-label="Capture photo"
                    >
                      <div className="size-11 rounded-full bg-cyan-400/40" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                onClick={() => inputRef.current?.click()}
                className="relative aspect-square rounded-2xl border-2 border-dashed border-sky-500/30 bg-slate-950/60 overflow-hidden grid place-items-center hover:border-cyan-400/60 hover:bg-slate-950 cursor-pointer transition-all"
              >
                {image ? (
                  <img src={image} alt="uploaded seafood" className="size-full object-cover" />
                ) : (
                  <div className="text-center px-6">
                    <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-sky-500/10 border border-cyan-400/30 grid place-items-center shadow-lg">
                      <Upload className="size-7 text-cyan-300" />
                    </div>
                    <div className="mt-4 font-display font-bold text-base sm:text-lg text-white">
                      ลากไฟล์ภาพมาวาง หรือคลิกเพื่อเลือก
                    </div>
                    <div className="mt-2 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      รองรับ JPEG / PNG / WebP ระบบปรับขนาดและบีบอัดอัตโนมัติ เพื่อการประมวลผลที่รวดเร็ว
                    </div>
                  </div>
                )}

                {(status === "compressing" || status === "analyzing") && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm grid place-items-center">
                    <div className="text-center text-white px-4">
                      <Loader2 className="size-10 mx-auto animate-spin text-cyan-400" />
                      <div className="mt-4 font-display font-bold text-base text-cyan-200">
                        {status === "compressing" ? "กำลังปรับขนาดและชดเชยแสง..." : "กำลังวิเคราะห์เกณฑ์ QIM..."}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        คำนวณคะแนนจุดด้อยทางกายภาพตามมาตรฐาน {selectedType.labelTh}
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-lg shadow-sky-950/50 hover:brightness-110 transition active:scale-[0.98]"
              >
                <ImageIcon className="size-4" /> เลือกรูปภาพจากเครื่อง
              </button>
              {image && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-sky-500/30 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
                >
                  <RefreshCw className="size-4 text-cyan-400" /> ล้างค่า
                </button>
              )}
            </div>

            {/* Criteria checklist hint */}
            <div className="mt-4 rounded-xl bg-slate-950/70 border border-sky-500/15 p-3.5 text-xs">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <Info className="size-3.5" /> จุดตรวจกายภาพสำคัญ ({selectedType.labelTh}):
              </div>
              <div className="text-slate-400 leading-relaxed">
                {selectedType.qimCriteria.map((c) => c.labelTh).join(" · ")}
              </div>
            </div>

            {resizeInfo && resizeInfo.wasResized && (
              <div className="mt-3 text-[11px] text-slate-500 font-mono">
                ✓ Auto-optimized: {resizeInfo.originalDimensions.width}×{resizeInfo.originalDimensions.height}px (
                {formatBytes(resizeInfo.originalSize)}) → {resizeInfo.finalDimensions.width}×
                {resizeInfo.finalDimensions.height}px ({formatBytes(resizeInfo.finalSize)})
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-6 sm:p-7 shadow-xl backdrop-blur-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="size-6 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold grid place-items-center">
                  3
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  ผลการประเมิน QIM (Inspection Verdict)
                </h3>
              </div>
              {result && (
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg transition"
                >
                  <Printer className="size-3.5" /> พิมพ์ใบตรวจ
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[380px] flex flex-col items-center justify-center text-center p-6"
                >
                  <div className="size-16 rounded-2xl bg-slate-950 border border-sky-500/20 grid place-items-center text-sky-400 shadow-inner">
                    <Sparkles className="size-8" />
                  </div>
                  <div className="mt-4 font-display font-bold text-lg text-white">
                    พร้อมสำหรับการประเมิน
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                    เลือกประเภทสัตว์น้ำ และอัปโหลดภาพถ่าย หรือเปิดกล้องสด
                    ระบบจะคำนวณคะแนนจุดด้อย (Demerit) ระดับความสด และคำแนะนำความปลอดภัย
                  </p>
                </motion.div>
              )}

              {(status === "compressing" || status === "analyzing") && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 py-12"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-1/3 rounded-full bg-slate-800 animate-pulse" />
                      <div className="h-2.5 rounded-full bg-slate-800/60 animate-pulse" />
                    </div>
                  ))}
                </motion.div>
              )}

              {status === "done" && result && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <QIMResultView result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}

function QIMResultView({ result }: { result: AnalyzeResult }) {
  const color = gradeColor(result.grade);
  const lowConf = result.confidence < LOW_CONFIDENCE_THRESHOLD;

  const radarData = [
    { metric: "ดัชนีความสด", v: result.freshnessIndex },
    { metric: "ความเชื่อมั่นชีวภาพ", v: Math.round(result.confidence * 100) },
    { metric: "ความชัดของสายตา", v: Math.max(10, 100 - result.totalDemerit * 4.5) },
    { metric: "ความสดสีเหงือก/ผิว", v: Math.max(15, 95 - result.totalDemerit * 4) },
    { metric: "ดัชนีความปลอดภัย", v: result.grade === "A" ? 98 : result.grade === "B" ? 75 : 25 },
  ];

  const probData = result.gradeProbabilities.map((p) => ({
    name: `Grade ${p.grade}`,
    score: Math.round(p.prob * 100),
    grade: p.grade,
  }));

  const remainingDaysOnIce = Math.max(0, Math.round((20 - result.totalDemerit) * 0.7));

  return (
    <div className="space-y-6">
      {/* Top Badge & Score Card */}
      <div className="rounded-2xl border border-sky-500/25 bg-slate-950/80 p-5 shadow-inner">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{result.seafoodTypeTh}</span>
              <span>·</span>
              <span className="text-cyan-300">
                สายพันธุ์คาดการณ์: {result.speciesGuess.commonTh} ({result.speciesGuess.scientific})
              </span>
              {result.usedCalibration && (
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px]">
                  ✓ ปรับเทียบฐานข้อมูลจริง
                </span>
              )}
            </div>

            <div className="mt-2 text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2">
              <span style={{ color }}>{result.gradeTh}</span>
            </div>

            <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-300 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Award className="size-3.5 text-cyan-400" />
                <span>จุดด้อย: </span>
                <span className="font-mono font-bold text-white">
                  {result.totalDemerit} / {result.maxDemerit} Demerits
                </span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <ThermometerSnowflake className="size-3.5 text-sky-400" />
                <span>ดัชนีความสด: </span>
                <span className="font-mono font-bold text-white">{result.freshnessIndex}%</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-emerald-400" />
                <span>อายุบนน้ำแข็ง: </span>
                <span className="font-mono font-bold text-emerald-300">~{remainingDaysOnIce} วัน</span>
              </div>
            </div>
          </div>

          {/* Grade Big Seal */}
          <div
            className="size-20 rounded-2xl text-slate-950 font-display font-black text-4xl grid place-items-center shrink-0 shadow-lg"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 25px ${color}44`,
            }}
          >
            {result.grade}
          </div>
        </div>

        {/* Safety Warning */}
        {result.safetyWarning && (
          <div className="mt-4 rounded-xl bg-red-950/40 border border-red-500/40 p-3.5 flex gap-3 text-xs text-red-200">
            <AlertTriangle className="size-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{result.safetyWarning}</div>
          </div>
        )}

        {lowConf && (
          <div className="mt-3 rounded-xl bg-amber-950/40 border border-amber-500/40 p-3 flex gap-3 text-xs text-amber-200">
            <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Confidence ต่ำกว่า 70% ควรถ่ายภาพใหม่ในระยะใกล้ แสงธรรมชาติ และดมกลิ่นตรวจสอบร่วมด้วย
            </div>
          </div>
        )}
      </div>

      {/* 20-Point QIM Demerit Breakdown */}
      <div className="rounded-2xl border border-sky-500/20 bg-slate-950/50 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-mono uppercase tracking-wider text-slate-400">
            คะแนนจุดด้อยทางกายภาพ (QIM Rubric)
          </span>
          <span className="font-mono font-bold text-cyan-300">
            รวม {result.totalDemerit} / {result.maxDemerit} แต้ม
          </span>
        </div>

        <div className="space-y-3.5">
          {result.criteriaScores.map((c) => {
            const demeritRatio = (c.demeritPoints / c.maxDemerit) * 100;
            return (
              <div key={c.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200">{c.labelTh}</span>
                  <span className="font-mono text-slate-400">
                    {c.demeritPoints} / {c.maxDemerit} จุดด้อย
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${demeritRatio}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        c.demeritPoints === 0
                          ? "#10b981"
                          : c.demeritPoints === c.maxDemerit
                            ? "#ef4444"
                            : "#06b6d4",
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{c.noteTh}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Cues */}
      <div className="rounded-2xl border border-sky-500/20 bg-slate-950/50 p-4 sm:p-5">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          ข้อสังเกตชีวภาพที่ตรวจพบ (Explainable Biomarkers)
        </div>
        <ul className="space-y-2.5">
          {result.biologicalCues.map((c, i: number) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed"
            >
              <CheckCircle2
                className={`size-4 shrink-0 mt-0.5 ${
                  c.category === "critical"
                    ? "text-red-400"
                    : c.category === "warning"
                      ? "text-amber-400"
                      : "text-cyan-400"
                }`}
              />
              <span>
                <b className="text-white">{c.titleTh}:</b> {c.descriptionTh}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Culinary & Consumption Recommendation */}
      <div
        className="rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border"
        style={{
          backgroundColor: `${color}15`,
          borderColor: `${color}40`,
        }}
      >
        <div className="font-bold mb-1 flex items-center gap-1.5" style={{ color }}>
          <ShieldCheck className="size-4" /> คำแนะนำการนำไปบริโภค / ปรุงอาหาร:
        </div>
        <p className="text-slate-200">{result.recommendationTh}</p>
        <div className="mt-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">เมนูแนะนำ: </span>
          {result.culinaryUseTh}
        </div>
      </div>

      {/* Charts */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Radar */}
        <div className="rounded-2xl border border-sky-500/20 bg-slate-950/50 p-3 sm:p-4">
          <div className="text-xs text-slate-400 mb-2 font-mono">โปรไฟล์คุณภาพชีวภาพ (Radar)</div>
          <div className="h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(56, 189, 248, 0.2)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="v" stroke={color} fill={color} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Probability */}
        <div className="rounded-2xl border border-sky-500/20 bg-slate-950/50 p-3 sm:p-4">
          <div className="text-xs text-slate-400 mb-2 font-mono">การกระจายความน่าจะเป็น (Bayesian Probability)</div>
          <div className="h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={probData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} width={60} />
                <Tooltip
                  contentStyle={{
                    background: "#090d16",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {probData.map((p, i: number) => (
                    <Cell key={i} fill={gradeColor(p.grade)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

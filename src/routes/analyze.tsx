import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
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

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "วิเคราะห์ความสด · FreshScan" },
      {
        name: "description",
        content:
          "เลือกประเภทอาหารทะเล อัปโหลดภาพ แล้วระบบจะวิเคราะห์ระดับความสด พร้อมเหตุผลและคำแนะนำ",
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

const gradeColor = (id: string) => FRESHNESS_GRADES.find((g) => g.id === id)?.ui_color ?? "#0ea5e9";

function AnalyzePage() {
  const [type, setType] = useState<SeafoodTypeId | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "compressing" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [resizeInfo, setResizeInfo] = useState<{
    wasResized: boolean;
    originalSize: number;
    finalSize: number;
    originalDimensions: { width: number; height: number };
    finalDimensions: { width: number; height: number };
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const reset = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setResizeInfo(null);
    setStatus("idle");
  };

  const selectedType = type ? SEAFOOD_TYPES.find((t) => t.id === type)! : null;

  return (
    <div className="min-h-screen bg-hero">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> กลับหน้าแรก
          </Link>
          <Link
            to="/species"
            className="text-xs font-medium text-ocean-deep hover:text-ocean transition"
          >
            ดูคู่มืออาหารทะเล →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-ocean-deep">
            <Sparkles className="size-3.5 text-coral" />
            AI Freshness Analyzer · v1.0
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            เลือกประเภท · อัปโหลดภาพ · <span className="text-gradient-ocean">ดูผลลัพธ์</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            รองรับอาหารทะเลสด 4 ประเภทในระยะแรก เลือกประเภทก่อนเพื่อให้ระบบใช้
            cue/หลักเกณฑ์ที่ถูกต้องในการวิเคราะห์
          </p>
        </div>

        {/* Step 1: pick seafood type */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge n={1} active />
            <div className="font-display font-bold text-lg">เลือกประเภทอาหารทะเล</div>
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
                      ? "border-ocean bg-white shadow-glow ring-2 ring-ocean/30"
                      : "border-border bg-card hover:border-ocean/40 hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    className={`size-10 rounded-xl grid place-items-center transition ${
                      active ? "bg-ocean-gradient text-white" : "bg-secondary text-ocean-deep"
                    }`}
                  >
                    {TYPE_ICONS[t.id]}
                  </div>
                  <div className="mt-3 font-display font-bold">{t.labelTh}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {t.supportedSpeciesTh.join(" · ")}
                  </div>
                  {active && (
                    <motion.div
                      layoutId="type-glow"
                      className="absolute inset-0 -z-10 bg-ocean/5"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 + 3 */}
        <section className="mt-10 grid lg:grid-cols-2 gap-5">
          {/* Upload */}
          <motion.div
            layout
            className="rounded-3xl border border-border bg-card p-5 shadow-card-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <StepBadge n={2} active={!!type} />
              <div className="font-display font-bold">อัปโหลดภาพ</div>
            </div>

            <div
              onDragOver={(e) => {
                if (!type) return;
                e.preventDefault();
              }}
              onDrop={(e) => {
                if (!type) return;
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => type && inputRef.current?.click()}
              className={`relative aspect-square rounded-2xl border-2 border-dashed bg-secondary/40 overflow-hidden grid place-items-center transition-all ${
                type
                  ? "border-border hover:border-ocean/50 hover:bg-secondary cursor-pointer"
                  : "border-border opacity-60 cursor-not-allowed"
              }`}
            >
              {image ? (
                <img src={image} alt="uploaded" className="size-full object-cover" />
              ) : (
                <div className="text-center px-6">
                  <div className="mx-auto size-16 rounded-2xl bg-ocean-gradient grid place-items-center shadow-card-soft">
                    <Upload className="size-7 text-white" />
                  </div>
                  <div className="mt-5 font-display font-bold text-lg">
                    {type ? "ลากไฟล์มาวาง หรือคลิกเพื่อเลือก" : "กรุณาเลือกประเภทก่อน"}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    รองรับ JPG / PNG / WEBP · ไฟล์ใหญ่แค่ไหนก็ได้
                    ระบบจะบีบอัด/ย่อภาพให้อัตโนมัติก่อนวิเคราะห์
                  </div>
                </div>
              )}
              {(status === "compressing" || status === "analyzing") && (
                <div className="absolute inset-0 bg-ocean-deep/60 backdrop-blur-sm grid place-items-center">
                  <div className="text-center text-white">
                    <Loader2 className="size-10 mx-auto animate-spin" />
                    <div className="mt-4 font-display font-bold">
                      {status === "compressing" ? "กำลังปรับขนาดภาพ..." : "กำลังวิเคราะห์..."}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {status === "compressing"
                        ? "บีบอัดภาพให้เหมาะสมก่อนส่งให้ AI ประมวลผล"
                        : `ใช้หลักเกณฑ์ของ${selectedType?.labelTh}`}
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

            <div className="mt-4 flex gap-2">
              <button
                disabled={!type}
                onClick={() => inputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ocean-gradient text-white px-4 py-3 rounded-xl font-medium shadow-card-soft hover:shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImageIcon className="size-4" /> เลือกภาพ
              </button>
              {image && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-secondary transition text-sm font-medium"
                >
                  <RefreshCw className="size-4" /> รีเซ็ต
                </button>
              )}
            </div>

            {selectedType && (
              <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed">
                <div className="font-bold text-foreground mb-1">
                  เกณฑ์ตรวจ ({selectedType.labelTh})
                </div>
                <div className="text-muted-foreground">{selectedType.criteriaTh.join(" · ")}</div>
              </div>
            )}

            {resizeInfo && (
              <div className="mt-3 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground leading-relaxed">
                {resizeInfo.wasResized ? (
                  <>
                    <span className="font-medium text-foreground">บีบอัดภาพอัตโนมัติแล้ว</span> —{" "}
                    {resizeInfo.originalDimensions.width}×{resizeInfo.originalDimensions.height}px (
                    {formatBytes(resizeInfo.originalSize)}) → {resizeInfo.finalDimensions.width}×
                    {resizeInfo.finalDimensions.height}px ({formatBytes(resizeInfo.finalSize)})
                    เพื่อให้ AI ประมวลผลได้ครบทุกส่วนของภาพโดยไม่เสียรายละเอียดสำคัญ
                  </>
                ) : (
                  <>
                    ขนาดภาพเหมาะสมอยู่แล้ว ({formatBytes(resizeInfo.finalSize)}) ไม่ต้องบีบอัดเพิ่ม
                  </>
                )}
              </div>
            )}
          </motion.div>

          {/* Result */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card-soft min-h-[460px]">
            <div className="flex items-center gap-3 mb-4">
              <StepBadge n={3} active={status === "done"} />
              <div className="font-display font-bold">ผลการวิเคราะห์</div>
            </div>

            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[360px] flex flex-col items-center justify-center text-center"
                >
                  <div className="size-16 rounded-2xl bg-secondary grid place-items-center text-muted-foreground">
                    <Sparkles className="size-7" />
                  </div>
                  <div className="mt-5 font-display font-bold text-lg">ผลลัพธ์จะปรากฏที่นี่</div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    หลังเลือกประเภทและอัปโหลดภาพ ระบบจะแสดง grade · confidence · cues · คำแนะนำ
                  </p>
                </motion.div>
              )}

              {(status === "compressing" || status === "analyzing") && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 py-6"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-1/3 rounded-full bg-secondary animate-pulse" />
                      <div className="h-2 rounded-full bg-secondary/70 animate-pulse" />
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
                  <ResultView result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Safety note */}
        <div className="mt-6 rounded-2xl border border-dashed border-ocean/30 bg-ocean/5 p-4 text-xs leading-relaxed text-ocean-deep">
          <div className="flex items-start gap-2">
            <ShieldCheck className="size-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">คำแนะนำการใช้งาน:</span> เพื่อผลลัพธ์ที่แม่นยำที่สุด
              ควรถ่ายภาพในแสงธรรมชาติ ระยะใกล้ ให้เห็น ตา/เหงือก/ผิว/เนื้อชัดเจน
              และตรวจสอบกลิ่น–เนื้อสัมผัสร่วมด้วยเสมอ ก่อนตัดสินใจบริโภคอาหารทะเลที่มีความเสี่ยงสูง
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepBadge({ n, active }: { n: number; active?: boolean }) {
  return (
    <div
      className={`size-7 rounded-full grid place-items-center text-xs font-bold transition-all ${
        active ? "bg-ocean-gradient text-white shadow-glow" : "bg-secondary text-muted-foreground"
      }`}
    >
      {n}
    </div>
  );
}

function ResultView({ result }: { result: AnalyzeResult }) {
  const color = gradeColor(result.grade);
  const lowConf = result.confidence < LOW_CONFIDENCE_THRESHOLD;

  const radarData = [
    { metric: "ความสด", v: result.freshnessScore },
    { metric: "ความเชื่อมั่น", v: Math.round(result.confidence * 100) },
    { metric: "คุณภาพภาพ", v: 75 + Math.round(result.confidence * 20) },
    { metric: "ความตรง cue", v: 60 + Math.round(result.confidence * 35) },
    { metric: "ความปลอดภัย", v: result.grade === "A" ? 95 : result.grade === "B" ? 70 : 25 },
  ];

  const probData = result.perGrade.map((p) => ({
    name: `Grade ${p.grade}`,
    score: Math.round(p.prob * 100),
    grade: p.grade,
  }));

  return (
    <div
      className="rounded-2xl p-4 -m-4 transition-shadow"
      style={{ boxShadow: `0 0 0 1px ${color}22, 0 20px 45px -30px ${color}55` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>
              {result.seafoodTypeTh} · คาดเดาชนิด: {result.speciesGuess}
            </span>
            {result.usedCalibration && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ocean/10 text-ocean-deep px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal">
                ปรับเทียบด้วยภาพอ้างอิงจริง
              </span>
            )}
          </div>
          <div className="mt-1 font-display font-bold text-2xl" style={{ color }}>
            {result.gradeTh}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            คะแนนความสด {result.score20}/{result.score20Max} คะแนน · เกรด {result.grade} ·
            confidence {(result.confidence * 100).toFixed(1)}%
          </div>
          {result.imageWasResized && (
            <div className="text-[11px] text-ocean-deep/70 mt-0.5">
              * ภาพนี้ถูกบีบอัด/ย่อขนาดก่อนวิเคราะห์เพื่อประสิทธิภาพที่ดีขึ้น
            </div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="size-20 rounded-3xl text-white grid place-items-center font-display font-bold text-4xl shadow-card-soft"
          style={{ background: color, boxShadow: `0 0 0 8px ${color}22` }}
        >
          {result.grade}
        </motion.div>
      </div>

      {/* Safety / low confidence */}
      {result.safetyWarning && (
        <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-4 flex gap-3">
          <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 leading-relaxed">{result.safetyWarning}</div>
        </div>
      )}
      {lowConf && (
        <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700 leading-relaxed">
            ผลลัพธ์ยังไม่มั่นใจ (confidence ต่ำกว่า 70%) กรุณาถ่ายภาพใหม่ในแสงชัดเจน
            และตรวจสอบด้วยกลิ่น/เนื้อสัมผัสร่วมด้วย
          </div>
        </div>
      )}

      {/* Score breakdown: 20-point rubric */}
      <div className="mt-5 rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            คะแนนความสดแบบละเอียด (เต็ม {result.score20Max} คะแนน)
          </div>
          <div className="font-display font-bold text-sm" style={{ color }}>
            {result.score20}/{result.score20Max}
          </div>
        </div>
        <div className="space-y-3">
          {result.criteriaScores.map((c) => {
            const pct = (c.score / c.max) * 100;
            return (
              <div key={c.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-foreground/85">{c.labelTh}</span>
                  <span className="text-muted-foreground">
                    {c.score}/{c.max}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{c.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cues */}
      <div className="mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          เหตุผลที่ดูจากภาพ (cues)
        </div>
        <ul className="space-y-2">
          {result.cues.map((c, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex gap-2 text-sm leading-relaxed"
            >
              <CheckCircle2 className="size-4 mt-0.5 shrink-0" style={{ color }} />
              <span className="text-foreground/85">{c}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div
        className="mt-5 rounded-2xl p-4 text-sm leading-relaxed"
        style={{ background: `${color}14`, color }}
      >
        <span className="font-bold">คำแนะนำ: </span>
        <span className="text-foreground/85">{result.recommendation}</span>
      </div>

      {/* Charts */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border p-3">
          <div className="text-xs text-muted-foreground mb-1 px-1">โปรไฟล์คุณภาพ</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="v" stroke={color} fill={color} fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border p-3">
          <div className="text-xs text-muted-foreground mb-1 px-1">ความน่าจะเป็นแต่ละ Grade</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={probData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {probData.map((p, i) => (
                  <Cell key={i} fill={gradeColor(p.grade)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        บริเวณที่ XAI ใช้พิจารณา: {result.xaiRegions.join(" · ")}
      </div>
    </div>
  );
}

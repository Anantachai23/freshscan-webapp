import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, ArrowLeft, Loader2, Sparkles, RefreshCw, ImageIcon, Filter } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { PRODUCT_TYPES, GRADE_META, type SeafoodResult } from "@/data/dataset";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "ทดลองสแกน · FreshScan" },
      { name: "description", content: "อัปโหลดภาพอาหารทะเลเพื่อทดลองการวิเคราะห์ความสดด้วย AI" },
    ],
  }),
  component: ScanPage,
});

const gradeStyles: Record<SeafoodResult["grade"], { bg: string; text: string; ring: string }> = {
  A: { bg: "bg-grade-a", text: "text-grade-a", ring: "ring-grade-a/30" },
  B: { bg: "bg-grade-b", text: "text-grade-b", ring: "ring-grade-b/30" },
  C: { bg: "bg-grade-c", text: "text-grade-c", ring: "ring-grade-c/30" },
};

function ScanPage() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<(SeafoodResult & { type: string }) | null>(null);
  const [productId, setProductId] = useState<string>("auto");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
    runAnalysis();
  };

  const runAnalysis = () => {
    setStatus("analyzing");
    setResult(null);
    setTimeout(() => {
      const product =
        productId === "auto"
          ? PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)]
          : PRODUCT_TYPES.find((p) => p.id === productId) ?? PRODUCT_TYPES[0];
      const r = product.results[Math.floor(Math.random() * product.results.length)];
      setResult({ ...r, type: product.name });
      setStatus("done");
    }, 2200);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStatus("idle");
  };

  const radarData = useMemo(() => {
    if (!result) return [];
    const c = result.composition;
    return [
      { metric: "ความสด", value: c.freshness },
      { metric: "เนื้อสัมผัส", value: c.texture },
      { metric: "สี/ผิว", value: c.color },
      { metric: "กลิ่น", value: c.odor },
      { metric: "ความชุ่มชื้น", value: c.moisture },
    ];
  }, [result]);

  const barColor = result ? GRADE_META[result.grade].color : "#0ea5e9";

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
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">DEMO</span> · ผลลัพธ์เป็นข้อมูลจำลอง
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-ocean-deep">
            <Sparkles className="size-3.5 text-coral" />
            ทดลองการวิเคราะห์
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            อัปโหลดภาพ <span className="text-gradient-ocean">ดูผลทันที</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            เลือกประเภทสินค้า อัปโหลดภาพ ระบบจะวิเคราะห์และแสดงผลแบบละเอียดพร้อมกราฟ
          </p>
        </div>

        {/* Filter */}
        <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-card-soft">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Filter className="size-4 text-ocean-deep" />
            <span className="font-medium">ตัวกรองประเภทสินค้า</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={productId === "auto"}
              onClick={() => setProductId("auto")}
              label="ตรวจจับอัตโนมัติ"
            />
            {PRODUCT_TYPES.map((p) => (
              <FilterChip
                key={p.id}
                active={productId === p.id}
                onClick={() => setProductId(p.id)}
                label={p.name}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-5">
          {/* Upload */}
          <motion.div layout className="rounded-3xl border border-border bg-card p-5 shadow-card-soft">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className="relative aspect-square rounded-2xl border-2 border-dashed border-border bg-secondary/40 hover:border-ocean/50 hover:bg-secondary transition-all cursor-pointer overflow-hidden grid place-items-center"
            >
              {image ? (
                <img src={image} alt="uploaded" className="size-full object-cover" />
              ) : (
                <div className="text-center px-6">
                  <div className="mx-auto size-16 rounded-2xl bg-ocean-gradient grid place-items-center shadow-card-soft">
                    <Upload className="size-7 text-white" />
                  </div>
                  <div className="mt-5 font-display font-bold text-lg">ลากไฟล์มาวาง หรือคลิกเพื่อเลือก</div>
                  <div className="mt-2 text-sm text-muted-foreground">รองรับ JPG, PNG ขนาดไม่เกิน 10MB</div>
                </div>
              )}
              {status === "analyzing" && (
                <div className="absolute inset-0 bg-ocean-deep/60 backdrop-blur-sm grid place-items-center">
                  <div className="text-center text-white">
                    <Loader2 className="size-10 mx-auto animate-spin" />
                    <div className="mt-4 font-display font-bold">กำลังวิเคราะห์...</div>
                    <div className="text-sm text-white/70 mt-1">โมเดล AI กำลังประมวลผลภาพ</div>
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
                onClick={() => inputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-ocean-gradient text-white px-4 py-3 rounded-xl font-medium shadow-card-soft hover:shadow-glow transition"
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
          </motion.div>

          {/* Result */}
          <div className="rounded-3xl border border-border bg-card p-7 shadow-card-soft min-h-[400px]">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="size-16 rounded-2xl bg-secondary grid place-items-center text-muted-foreground">
                    <Sparkles className="size-7" />
                  </div>
                  <div className="mt-5 font-display font-bold text-lg">ผลการวิเคราะห์จะแสดงที่นี่</div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    เลือกประเภทสินค้าและอัปโหลดภาพเพื่อเริ่มต้น
                  </p>
                </motion.div>
              )}

              {status === "analyzing" && (
                <motion.div
                  key="analyzing"
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
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        ตรวจพบ
                      </div>
                      <div className="mt-1 font-display font-bold text-2xl">{result.type}</div>
                      <div className={`mt-1 font-medium ${gradeStyles[result.grade].text}`}>
                        {result.label}
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14 }}
                      className={`size-20 rounded-3xl ${gradeStyles[result.grade].bg} text-white grid place-items-center font-display font-bold text-4xl shadow-card-soft ring-8 ${gradeStyles[result.grade].ring}`}
                    >
                      {result.grade}
                    </motion.div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold">{result.confidence}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className={`h-full ${gradeStyles[result.grade].bg}`}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      ลักษณะที่ตรวจพบ
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {result.features.map((f, i) => (
                        <motion.div
                          key={f.name}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className="rounded-xl bg-secondary/60 px-3 py-2.5"
                        >
                          <div className="text-xs text-muted-foreground">{f.name}</div>
                          <div className="font-display font-bold">{f.score}%</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-secondary/50 p-4 text-sm leading-relaxed">
                    <span className="font-bold">คำอธิบาย: </span>
                    {result.reason}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Charts */}
        {status === "done" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 grid lg:grid-cols-2 gap-5"
          >
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card-soft">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    การวิเคราะห์เชิงลึก
                  </div>
                  <h3 className="font-display font-bold text-lg mt-0.5">โปรไฟล์คุณภาพ (Radar)</h3>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${barColor}22`, color: barColor }}
                >
                  {GRADE_META[result.grade].label}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="คะแนน"
                    dataKey="value"
                    stroke={barColor}
                    fill={barColor}
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card-soft">
              <div className="mb-2">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  คะแนนรายลักษณะ
                </div>
                <h3 className="font-display font-bold text-lg mt-0.5">Feature Scores</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={result.features} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    width={110}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {result.features.map((f, i) => (
                      <Cell
                        key={i}
                        fill={
                          f.score >= 75
                            ? GRADE_META.A.color
                            : f.score >= 50
                              ? GRADE_META.B.color
                              : GRADE_META.C.color
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <LegendDot color={GRADE_META.A.color} label="≥ 75 ดีมาก" />
                <LegendDot color={GRADE_META.B.color} label="50–74 พอใช้" />
                <LegendDot color={GRADE_META.C.color} label="< 50 ต่ำ" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Editor hint */}
        <div className="mt-8 rounded-2xl border border-dashed border-ocean/30 bg-ocean/5 p-4 text-sm text-ocean-deep">
          <span className="font-bold">หมายเหตุสำหรับผู้พัฒนา:</span> แก้ไขข้อมูล Dataset
          (ประเภทสินค้า, คะแนน, คำอธิบาย) ได้ที่ไฟล์{" "}
          <code className="font-mono bg-white/70 px-1.5 py-0.5 rounded">src/data/dataset.ts</code>
        </div>
      </main>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-ocean-gradient text-white shadow-card-soft"
          : "bg-secondary/60 text-foreground/70 hover:bg-secondary hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

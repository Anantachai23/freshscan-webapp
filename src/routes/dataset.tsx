import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Database,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  Target,
  ShieldCheck,
  Upload,
  Download,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  SEAFOOD_TYPES,
  FRESHNESS_GRADES,
  type SeafoodTypeId,
  type FreshnessGrade,
} from "@/data/freshscan_taxonomy";
import {
  MANIFEST,
  TARGETS,
  QUALITY_RULES,
  validateManifest,
  parseManifestCSV,
  type Split,
  type ManifestRow,
} from "@/lib/datasetManifest";

export const Route = createFileRoute("/dataset")({
  head: () => ({
    meta: [
      { title: "สถานะ Dataset & Manifest · FreshScan Marine™" },
      {
        name: "description",
        content: "ภาพรวมจำนวนภาพต่อประเภทอาหารทะเล เกรด และ split พร้อมผลตรวจคุณภาพข้อมูลตามมาตรฐาน QIM",
      },
    ],
  }),
  component: DatasetPage,
});

const splitLabel: Record<Split, string> = {
  train: "Train (ฝึกสอน)",
  val: "Validation (ตรวจสอบ)",
  test: "Test (ทดสอบ)",
};

function DatasetPage() {
  const [typeFilter, setTypeFilter] = useState<SeafoodTypeId | "all">("all");
  const [manifest, setManifest] = useState<ManifestRow[]>(MANIFEST);
  const [importedName, setImportedName] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<{
    rows: ManifestRow[];
    fileName: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const issues = useMemo(() => validateManifest(manifest), [manifest]);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  const infos = issues.filter((i) => i.level === "info");

  const rows =
    typeFilter === "all" ? manifest : manifest.filter((r) => r.seafood_type_id === typeFilter);

  // Aggregations
  const byTypeGrade = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      const k = `${r.seafood_type_id}|${r.grade}`;
      map[k] = (map[k] ?? 0) + 1;
    });
    return map;
  }, [rows]);

  const targetMap = useMemo(() => {
    const m: Record<string, number> = {};
    TARGETS.forEach((t) => (m[`${t.seafood_type_id}|${t.grade}`] = t.original_target));
    return m;
  }, []);

  const typesToShow =
    typeFilter === "all" ? SEAFOOD_TYPES : SEAFOOD_TYPES.filter((t) => t.id === typeFilter);

  const splitData: { name: string; value: number; color: string }[] = (
    ["train", "val", "test"] as Split[]
  ).map((s, i) => ({
    name: splitLabel[s],
    value: rows.filter((r) => r.split === s).length,
    color: ["#0284c7", "#06b6d4", "#10b981"][i],
  }));

  const typeChartData = SEAFOOD_TYPES.map((t) => {
    const present = manifest.filter((r) => r.seafood_type_id === t.id).length;
    const target = TARGETS.filter((x) => x.seafood_type_id === t.id).reduce(
      (a, b) => a + b.original_target,
      0,
    );
    return { name: t.labelTh, present, target };
  });

  const totalPresent = manifest.length;
  const totalTarget = TARGETS.reduce((a, b) => a + b.original_target, 0);

  const minOriginals = QUALITY_RULES.min_original_images_before_augmentation;
  const minDataset = QUALITY_RULES.target_open_dataset_images_minimum;
  const afterAug = QUALITY_RULES.target_after_augmentation_minimum;

  const downloadFile = (filename: string, mime: string, content: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const text = await file.text();
      const parsed = parseManifestCSV(text);
      if (!parsed.length) throw new Error("ไม่พบข้อมูลใน CSV (ต้องมี header + อย่างน้อย 1 แถว)");
      const required = ["image_id", "split", "seafood_type_id", "grade", "freshness_score"];
      const missing = required.filter(
        (k) => !(k in parsed[0]) && !(parsed[0] as never)[k as never],
      );
      if (parsed.some((r) => !r.image_id)) missing.push("image_id (บางแถวว่าง)");
      if (missing.length) throw new Error(`ไม่ครบคอลัมน์จำเป็น: ${missing.join(", ")}`);
      setPendingImport({ rows: parsed, fileName: file.name });
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "อ่านไฟล์ไม่สำเร็จ");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const resetManifest = () => {
    setManifest(MANIFEST);
    setImportedName(null);
    setImportError(null);
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    setManifest(pendingImport.rows);
    setImportedName(pendingImport.fileName);
    setPendingImport(null);
  };

  const cancelImport = () => {
    setPendingImport(null);
    setImportError(null);
  };

  const buildSummary = () => {
    const perType = SEAFOOD_TYPES.map((t) => {
      const present = manifest.filter((r) => r.seafood_type_id === t.id).length;
      const target = TARGETS.filter((x) => x.seafood_type_id === t.id).reduce(
        (a, b) => a + b.original_target,
        0,
      );
      return { type_id: t.id, type_th: t.labelTh, present, target };
    });
    const perCell = SEAFOOD_TYPES.flatMap((t) =>
      (["A", "B", "C"] as FreshnessGrade[]).map((g) => {
        const rowsG = manifest.filter((r) => r.seafood_type_id === t.id && r.grade === g);
        const tr = TARGETS.find((x) => x.seafood_type_id === t.id && x.grade === g);
        return {
          type_id: t.id,
          type_th: t.labelTh,
          grade: g,
          present: rowsG.length,
          train: rowsG.filter((r) => r.split === "train").length,
          val: rowsG.filter((r) => r.split === "val").length,
          test: rowsG.filter((r) => r.split === "test").length,
          target_original: tr?.original_target ?? 0,
          target_train: tr?.train ?? 0,
          target_val: tr?.val ?? 0,
          target_test: tr?.test ?? 0,
        };
      }),
    );
    const perSplit = (["train", "val", "test"] as Split[]).map((s) => ({
      split: s,
      count: manifest.filter((r) => r.split === s).length,
    }));
    return {
      generated_at: new Date().toISOString(),
      source: importedName ?? "sample_manifest.csv (default)",
      totals: {
        present: manifest.length,
        target_original: totalTarget,
        min_original_required: minOriginals,
        min_open_dataset: minDataset,
        after_augmentation_target: afterAug,
      },
      quality: {
        errors: errors.length,
        warnings: warnings.length,
        infos: infos.length,
        issues,
      },
      per_type: perType,
      per_split: perSplit,
      per_type_grade: perCell,
    };
  };

  const exportJSON = () => {
    const summary = buildSummary();
    downloadFile(
      `freshscan_dataset_summary_${Date.now()}.json`,
      "application/json",
      JSON.stringify(summary, null, 2),
    );
  };

  const exportCSV = () => {
    const s = buildSummary();
    const esc = (v: unknown) => {
      const str = String(v ?? "");
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const lines: string[] = [];
    lines.push(`# FreshScan Dataset Summary`);
    lines.push(`# generated_at,${s.generated_at}`);
    lines.push(`# source,${s.source}`);
    lines.push("");
    lines.push("section,key,value");
    lines.push(`totals,present,${s.totals.present}`);
    lines.push(`totals,target_original,${s.totals.target_original}`);
    lines.push(`totals,min_original_required,${s.totals.min_original_required}`);
    lines.push(`totals,min_open_dataset,${s.totals.min_open_dataset}`);
    lines.push(`totals,after_augmentation_target,${s.totals.after_augmentation_target}`);
    lines.push(`quality,errors,${s.quality.errors}`);
    lines.push(`quality,warnings,${s.quality.warnings}`);
    lines.push(`quality,infos,${s.quality.infos}`);
    lines.push("");
    lines.push("per_type,type_id,type_th,present,target");
    s.per_type.forEach((r) =>
      lines.push(`per_type,${esc(r.type_id)},${esc(r.type_th)},${r.present},${r.target}`),
    );
    lines.push("");
    lines.push("per_split,split,count");
    s.per_split.forEach((r) => lines.push(`per_split,${r.split},${r.count}`));
    lines.push("");
    lines.push(
      "per_type_grade,type_id,type_th,grade,present,train,val,test,target_original,target_train,target_val,target_test",
    );
    s.per_type_grade.forEach((r) =>
      lines.push(
        `per_type_grade,${esc(r.type_id)},${esc(r.type_th)},${r.grade},${r.present},${r.train},${r.val},${r.test},${r.target_original},${r.target_train},${r.target_val},${r.target_test}`,
      ),
    );
    lines.push("");
    lines.push("issues,level,message");
    s.quality.issues.forEach((i) => lines.push(`issues,${i.level},${esc(i.message)}`));
    downloadFile(
      `freshscan_dataset_summary_${Date.now()}.csv`,
      "text/csv;charset=utf-8",
      "\uFEFF" + lines.join("\n"),
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Header */}
      <header className="px-4 py-5 border-b border-sky-500/15 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="size-4 text-cyan-400" /> กลับหน้าหลัก FreshScan
          </Link>
          <Link
            to="/analyze"
            className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-xl transition"
          >
            ไปหน้าวิเคราะห์สด →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <Database className="size-3.5 text-cyan-400" />
            SCIENTIFIC DATASET & CALIBRATION MATRIX
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            ฐานข้อมูลการปรับเทียบ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              และสถิติภาพอ้างอิงจริง
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ตรวจสอบจำนวนภาพต่อประเภท เกรด และ split เทียบกับเป้าหมายมาตรฐานสากล
            พร้อมระบบตรวจสอบความสมบูรณ์ของข้อมูลตามเกณฑ์ QIM Validation
          </p>
        </div>

        {/* Toolbar */}
        <div className="mt-10 rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 shadow-xl flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-bold px-4 py-2 text-xs shadow-md hover:brightness-110 transition"
          >
            <Upload className="size-3.5" /> นำเข้า Manifest (CSV)
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            <FileSpreadsheet className="size-3.5 text-cyan-400" /> ส่งออก Summary (CSV)
          </button>
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-slate-950 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            <FileJson className="size-3.5 text-sky-400" /> ส่งออก Summary (JSON)
          </button>
          {importedName && (
            <button
              onClick={resetManifest}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-sky-500/30 px-3 py-2 text-xs text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="size-3.5" /> คืนค่าเริ่มต้น
            </button>
          )}

          <div className="ml-auto text-xs text-slate-400 flex items-center gap-2 font-mono">
            <Download className="size-3.5 text-cyan-400" />
            <span>แหล่งข้อมูล: </span>
            <span className="text-cyan-300 font-semibold">{importedName ?? "sample_manifest.csv"}</span>
            <span className="opacity-40">·</span>
            <span>{manifest.length.toLocaleString()} แถว</span>
          </div>

          {importError && (
            <div className="w-full text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-xl px-3.5 py-2">
              นำเข้าไม่สำเร็จ: {importError}
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<Layers className="size-5" />}
            label="ภาพต้นฉบับใน Manifest"
            value={totalPresent.toLocaleString()}
            sub={`เป้าหมาย ≥ ${minOriginals.toLocaleString()} ภาพ`}
            progress={Math.min(1, totalPresent / minOriginals)}
          />
          <KpiCard
            icon={<Target className="size-5" />}
            label="เป้ารวมก่อน Augmentation"
            value={totalTarget.toLocaleString()}
            sub={`Open Dataset ≥ ${minDataset.toLocaleString()}`}
          />
          <KpiCard
            icon={<Database className="size-5" />}
            label="หลัง Augmentation (คาดการณ์)"
            value={`≥ ${afterAug.toLocaleString()}`}
            sub="ภาพรวมหลังเพิ่มข้อมูลสังเคราะห์"
          />
          <KpiCard
            icon={<ShieldCheck className="size-5" />}
            label="ผลตรวจความสมบูรณ์"
            value={`${errors.length} error · ${warnings.length} warn`}
            sub={`${infos.length} info notes`}
            tone={errors.length ? "danger" : warnings.length ? "warn" : "ok"}
          />
        </div>

        {/* Filter Chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Chip
            active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
            label="ทุกประเภทสัตว์น้ำ (All Taxa)"
          />
          {SEAFOOD_TYPES.map((t) => (
            <Chip
              key={t.id}
              active={typeFilter === t.id}
              onClick={() => setTypeFilter(t.id)}
              label={t.labelTh}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              จำนวนภาพปัจจุบัน vs เป้าหมาย
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1">Per Seafood Taxonomic Class</h3>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeChartData} margin={{ top: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      background: "#090d16",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="present" name="ปัจจุบัน" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="เป้าหมาย" fill="#334155" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              สัดส่วนการแบ่งข้อมูล
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1">Train / Val / Test Split</h3>
            <div className="h-56 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={splitData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {splitData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#090d16",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-center font-mono mt-1">
              เป้าหมาย: Train {QUALITY_RULES.required_splits.train * 100}% / Val{" "}
              {QUALITY_RULES.required_splits.validation * 100}% / Test{" "}
              {QUALITY_RULES.required_splits.test * 100}%
            </div>
          </div>
        </div>

        {/* Detailed Matrix Table */}
        <div className="mt-8 rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl overflow-x-auto">
          <div className="mb-4">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              เมทริกซ์การกระจายตัวของข้อมูล
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-0.5">
              ตาราง: ประเภท × เกรดความสด × การจัดสรรชุดข้อมูล
            </h3>
          </div>

          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-sky-500/20">
                <th className="py-2.5 pr-3 font-semibold">ประเภทสัตว์น้ำ</th>
                <th className="py-2.5 pr-3 font-semibold">เกรดความสด</th>
                <th className="py-2.5 pr-3 font-semibold text-center">Train</th>
                <th className="py-2.5 pr-3 font-semibold text-center">Val</th>
                <th className="py-2.5 pr-3 font-semibold text-center">Test</th>
                <th className="py-2.5 pr-3 font-semibold text-right">ปัจจุบัน</th>
                <th className="py-2.5 pr-3 font-semibold text-right">เป้าหมาย</th>
                <th className="py-2.5 pl-3 font-semibold w-36">สัดส่วนความคืบหน้า</th>
              </tr>
            </thead>
            <tbody>
              {typesToShow.flatMap((t) =>
                (["A", "B", "C"] as FreshnessGrade[]).map((g) => {
                  const present = byTypeGrade[`${t.id}|${g}`] ?? 0;
                  const target = targetMap[`${t.id}|${g}`] ?? 0;
                  const tr = TARGETS.find((x) => x.seafood_type_id === t.id && x.grade === g);
                  const ratio = target ? Math.min(1, present / target) : 0;
                  const meta = FRESHNESS_GRADES.find((x) => x.id === g)!;
                  return (
                    <tr key={`${t.id}-${g}`} className="border-b border-sky-500/10 hover:bg-slate-800/40 transition">
                      <td className="py-3 pr-3 font-medium text-slate-200">{t.labelTh}</td>
                      <td className="py-3 pr-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold"
                          style={{ background: `${meta.colorHex}1f`, color: meta.colorHex }}
                        >
                          Grade {g} · {meta.labelTh}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-center text-slate-400 font-mono">
                        {tr?.train ?? "-"}
                      </td>
                      <td className="py-3 pr-3 text-center text-slate-400 font-mono">
                        {tr?.val ?? "-"}
                      </td>
                      <td className="py-3 pr-3 text-center text-slate-400 font-mono">
                        {tr?.test ?? "-"}
                      </td>
                      <td className="py-3 pr-3 text-right font-mono font-bold text-white">{present}</td>
                      <td className="py-3 pr-3 text-right font-mono text-slate-400">{target}</td>
                      <td className="py-3 pl-3">
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ratio * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: meta.colorHex }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>

        {/* Validation & Rules */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              ผลตรวจความสมบูรณ์ของ Manifest
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1 mb-3">
              Quality Validation Report
            </h3>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="size-4" /> ข้อมูลผ่านการตรวจสอบครบทุกเกณฑ์
              </div>
            ) : (
              <ul className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {issues.map((it, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-xs rounded-xl p-3 border ${
                      it.level === "error"
                        ? "bg-red-950/40 text-red-200 border-red-500/30"
                        : it.level === "warning"
                          ? "bg-amber-950/40 text-amber-200 border-amber-500/30"
                          : "bg-sky-950/40 text-sky-200 border-sky-500/30"
                    }`}
                  >
                    {it.level === "error" || it.level === "warning" ? (
                      <AlertTriangle className="size-4 mt-0.5 shrink-0 text-amber-400" />
                    ) : (
                      <Info className="size-4 mt-0.5 shrink-0 text-cyan-400" />
                    )}
                    <span>{it.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              ข้อกำหนดคุณภาพข้อมูล (Data Integrity Protocol)
            </div>
            <h3 className="font-display font-bold text-lg text-white mt-1 mb-3">
              Standard Quality Rules
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <RuleRow
                text={`สัดส่วนชุดข้อมูล Train / Val / Test = ${QUALITY_RULES.required_splits.train} / ${QUALITY_RULES.required_splits.validation} / ${QUALITY_RULES.required_splits.test}`}
              />
              <RuleRow
                text={`จำนวนภาพต้นฉบับขั้นต่ำ ${minOriginals.toLocaleString()} ภาพ ก่อนการทำ Data Augmentation`}
              />
              <RuleRow text={`Open Biological Dataset เป้าหมาย ≥ ${minDataset.toLocaleString()} ภาพ`} />
              <RuleRow text="ผ่านการตรวจทานและรับรองโดยผู้เชี่ยวชาญด้านอาหารทะเลอย่างน้อย 2 ท่าน" />
              <RuleRow text="สัตว์น้ำที่มีสัญญาณการเน่าเสียชัดเจน จะถูกจัดเป็นเกรดปฏิเสธ (Reject/Grade C) ทันที" />
              <RuleRow text="ห้ามนำภาพสังเคราะห์ (AI-generated) มาใช้ปะปนในชุดทดสอบจริง" />
            </ul>
          </div>
        </div>
      </main>

      {pendingImport && (
        <ImportPreviewDialog
          fileName={pendingImport.fileName}
          rows={pendingImport.rows}
          onConfirm={confirmImport}
          onCancel={cancelImport}
        />
      )}
    </div>
  );
}

function ImportPreviewDialog({
  fileName,
  rows,
  onConfirm,
  onCancel,
}: {
  fileName: string;
  rows: ManifestRow[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const total = rows.length;
  const previewIssues = validateManifest(rows);
  const errs = previewIssues.filter((i) => i.level === "error").length;
  const warns = previewIssues.filter((i) => i.level === "warning").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCancel}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-slate-900 border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col text-slate-100"
      >
        <div className="p-6 border-b border-sky-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-0.5 text-xs text-sky-300">
                <Upload className="size-3.5" /> ตรวจสอบก่อนยืนยันนำเข้า
              </div>
              <h3 className="mt-2.5 font-display font-bold text-xl text-white">
                พรีวิวข้อมูล Manifest CSV
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ไฟล์: <span className="font-mono text-cyan-300">{fileName}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">จำนวนแถวทั้งหมด</div>
              <div className="font-mono font-bold text-2xl text-cyan-300">{total.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-300">
            ตรวจพบ: <span className="text-red-400 font-bold">{errs} errors</span> ·{" "}
            <span className="text-amber-400 font-bold">{warns} warnings</span>
          </div>
        </div>

        <div className="p-4 border-t border-sky-500/20 flex justify-end gap-2 bg-slate-950/50">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 hover:brightness-110 transition"
          >
            ยืนยันและนำเข้าข้อมูล
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  progress,
  tone = "ocean",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  tone?: "ocean" | "ok" | "warn" | "danger";
}) {
  const toneBg = {
    ocean: "border-sky-500/20 text-cyan-300",
    ok: "border-emerald-500/20 text-emerald-400",
    warn: "border-amber-500/20 text-amber-400",
    danger: "border-red-500/20 text-red-400",
  }[tone];

  return (
    <div className={`relative rounded-2xl border ${toneBg} bg-slate-900/60 p-5 shadow-lg overflow-hidden`}>
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl grid place-items-center bg-sky-500/10 border border-sky-500/20">
          {icon}
        </div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
      <div className="mt-3 font-display font-bold text-2xl text-white">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
          />
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
        active
          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-950/40"
          : "bg-slate-900/60 text-slate-400 border border-sky-500/15 hover:border-sky-500/40 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

function RuleRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-cyan-400" />
      <span>{text}</span>
    </li>
  );
}

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
  Lock,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
import { SEAFOOD_TYPES, FRESHNESS_GRADES, type SeafoodTypeId, type FreshnessGrade } from "@/data/freshscan_taxonomy";
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
      { title: "สถานะ Dataset · FreshScan" },
      {
        name: "description",
        content:
          "ภาพรวมจำนวนภาพต่อประเภทอาหารทะเล เกรด และ split พร้อมผลตรวจคุณภาพข้อมูล",
      },
    ],
  }),
  component: DatasetPage,
});

const splitLabel: Record<Split, string> = {
  train: "Train",
  val: "Validation",
  test: "Test",
};

function DatasetPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
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

  const rows = typeFilter === "all" ? manifest : manifest.filter((r) => r.seafood_type_id === typeFilter);

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

  const typesToShow = typeFilter === "all" ? SEAFOOD_TYPES : SEAFOOD_TYPES.filter((t) => t.id === typeFilter);

  const splitData: { name: string; value: number; color: string }[] = (
    ["train", "val", "test"] as Split[]
  ).map((s, i) => ({
    name: splitLabel[s],
    value: rows.filter((r) => r.split === s).length,
    color: ["#0ea5e9", "#f59e0b", "#dc2626"][i],
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
      const missing = required.filter((k) => !(k in parsed[0]) && !(parsed[0] as never)[k as never]);
      // rudimentary sanity check
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
            to="/analyze"
            className="text-xs font-medium text-ocean-deep hover:text-ocean transition"
          >
            ไปหน้าวิเคราะห์ →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-ocean-deep">
            <Database className="size-3.5" />
            Dataset Summary
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            ความคืบหน้า <span className="text-gradient-ocean">ข้อมูลภาพจริง</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            ตรวจสอบจำนวนภาพต่อประเภท เกรด และ split เทียบกับเป้าหมายในรูปเล่มโครงการ
            พร้อมผลตรวจคุณภาพอัตโนมัติตาม quality_rules.json
          </p>
        </div>

        {/* Import / Export toolbar — admin only */}
        {isAdmin ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-4 shadow-card-soft flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
              <ShieldCheck className="size-3" /> โหมดผู้ดูแล
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-ocean-gradient text-white px-4 py-2 text-sm font-medium shadow-card-soft hover:opacity-95 transition"
            >
              <Upload className="size-4" /> นำเข้า Manifest (CSV)
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-secondary transition"
            >
              <FileSpreadsheet className="size-4" /> ส่งออก Summary (CSV)
            </button>
            <button
              onClick={exportJSON}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-secondary transition"
            >
              <FileJson className="size-4" /> ส่งออก Summary (JSON)
            </button>
            {importedName && (
              <button
                onClick={resetManifest}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary transition"
              >
                <RotateCcw className="size-3.5" /> คืนค่าเริ่มต้น
              </button>
            )}
            <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
              <Download className="size-3.5" />
              แหล่งข้อมูล: <span className="font-medium text-foreground/80">{importedName ?? "sample_manifest.csv"}</span>
              <span className="mx-1 opacity-40">·</span>
              {manifest.length.toLocaleString()} แถว
            </div>
            {importError && (
              <div className="w-full text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                นำเข้าไม่สำเร็จ: {importError}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-card/60 p-5 shadow-card-soft flex flex-wrap items-center gap-3">
            <div className="size-10 rounded-xl bg-secondary grid place-items-center text-foreground/60">
              <Lock className="size-5" />
            </div>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm font-semibold text-foreground">
                การนำเข้า / ส่งออก / รี-validate จำกัดเฉพาะทีมงาน
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {authLoading
                  ? "กำลังตรวจสอบสิทธิ์..."
                  : user
                    ? `บัญชี ${user.email} มีสิทธิ์ระดับ member — ต้องได้รับอนุมัติเป็น admin จากผู้ดูแลระบบก่อน`
                    : "กรุณาเข้าสู่ระบบเพื่อจัดการ Dataset"}
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Download className="size-3.5" />
              แหล่งข้อมูล: <span className="font-medium text-foreground/80">{importedName ?? "sample_manifest.csv"}</span>
              <span className="mx-1 opacity-40">·</span>
              {manifest.length.toLocaleString()} แถว
            </div>
            {!user && (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-ocean-gradient text-white px-4 py-2 text-sm font-medium shadow-card-soft hover:opacity-95 transition"
              >
                <LogIn className="size-4" /> เข้าสู่ระบบทีมงาน
              </Link>
            )}
          </div>
        )}



        {/* KPI cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<Layers className="size-5" />}
            label="ภาพต้นฉบับใน manifest"
            value={totalPresent.toLocaleString()}
            sub={`เป้า ≥ ${minOriginals.toLocaleString()} ภาพ`}
            progress={Math.min(1, totalPresent / minOriginals)}
          />
          <KpiCard
            icon={<Target className="size-5" />}
            label="เป้ารวมก่อน Augment"
            value={totalTarget.toLocaleString()}
            sub={`Open Dataset ≥ ${minDataset.toLocaleString()}`}
          />
          <KpiCard
            icon={<Database className="size-5" />}
            label="หลัง Augmentation (คาด)"
            value={`≥ ${afterAug.toLocaleString()}`}
            sub="ภาพรวมหลังเพิ่มข้อมูล"
          />
          <KpiCard
            icon={<ShieldCheck className="size-5" />}
            label="ผลตรวจคุณภาพ"
            value={`${errors.length} error · ${warnings.length} warn`}
            sub={`${infos.length} info`}
            tone={errors.length ? "danger" : warnings.length ? "warn" : "ok"}
          />
        </div>

        {/* Filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          <Chip
            active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
            label="ทุกประเภท"
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
        <div className="mt-5 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-card-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              จำนวนภาพ vs เป้าหมาย ต่อประเภท
            </div>
            <h3 className="font-display font-bold text-lg mt-0.5">Per Seafood Type</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={typeChartData} margin={{ top: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="ปัจจุบัน" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" name="เป้าหมาย" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              สัดส่วน Split
            </div>
            <h3 className="font-display font-bold text-lg mt-0.5">Train / Val / Test</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={splitData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {splitData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-xs text-muted-foreground text-center">
              เป้า {QUALITY_RULES.required_splits.train * 100}% /{" "}
              {QUALITY_RULES.required_splits.validation * 100}% /{" "}
              {QUALITY_RULES.required_splits.test * 100}%
            </div>
          </div>
        </div>

        {/* Detailed matrix */}
        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card-soft overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                จำนวนภาพรายเซลล์
              </div>
              <h3 className="font-display font-bold text-lg mt-0.5">
                ตาราง: ประเภท × เกรด × Split
              </h3>
            </div>
          </div>

          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-3 font-medium">ประเภท</th>
                <th className="py-2 pr-3 font-medium">เกรด</th>
                <th className="py-2 pr-3 font-medium text-center">Train</th>
                <th className="py-2 pr-3 font-medium text-center">Val</th>
                <th className="py-2 pr-3 font-medium text-center">Test</th>
                <th className="py-2 pr-3 font-medium text-right">ปัจจุบัน</th>
                <th className="py-2 pr-3 font-medium text-right">เป้าหมาย</th>
                <th className="py-2 pl-3 font-medium w-32">ความคืบหน้า</th>
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
                    <tr key={`${t.id}-${g}`} className="border-b border-border/60">
                      <td className="py-3 pr-3 font-medium">{t.labelTh}</td>
                      <td className="py-3 pr-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold"
                          style={{ background: `${meta.ui_color}1f`, color: meta.ui_color }}
                        >
                          {g} · {meta.label_th}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-center text-muted-foreground">{tr?.train ?? "-"}</td>
                      <td className="py-3 pr-3 text-center text-muted-foreground">{tr?.val ?? "-"}</td>
                      <td className="py-3 pr-3 text-center text-muted-foreground">{tr?.test ?? "-"}</td>
                      <td className="py-3 pr-3 text-right font-display font-bold">{present}</td>
                      <td className="py-3 pr-3 text-right text-muted-foreground">{target}</td>
                      <td className="py-3 pl-3">
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ratio * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full"
                            style={{ background: meta.ui_color }}
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

        {/* Validation */}
        <div className="mt-5 grid lg:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              ผลตรวจ Manifest
            </div>
            <h3 className="font-display font-bold text-lg mt-0.5 mb-3">Quality Check</h3>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 className="size-4" /> ผ่านทุกข้อ
              </div>
            ) : (
              <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {issues.map((it, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
                      it.level === "error"
                        ? "bg-red-50 text-red-700"
                        : it.level === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    {it.level === "error" ? (
                      <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                    ) : it.level === "warning" ? (
                      <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                    ) : (
                      <Info className="size-4 mt-0.5 shrink-0" />
                    )}
                    <span>{it.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              กติกาคุณภาพข้อมูล
            </div>
            <h3 className="font-display font-bold text-lg mt-0.5 mb-3">Rules (จากเอกสาร)</h3>
            <ul className="space-y-2 text-sm">
              <RuleRow text={`Train / Val / Test = ${QUALITY_RULES.required_splits.train} / ${QUALITY_RULES.required_splits.validation} / ${QUALITY_RULES.required_splits.test}`} />
              <RuleRow text={`ภาพต้นฉบับขั้นต่ำ ${minOriginals.toLocaleString()} ภาพ ก่อน augmentation`} />
              <RuleRow text={`Open Dataset เป้าหมาย ≥ ${minDataset.toLocaleString()} ภาพ`} />
              <RuleRow text="ต้องมีผู้เชี่ยวชาญ 2 คน label ตรงกัน หากไม่ตรง ส่งคนที่ 3 หรือคัดออก" />
              <RuleRow text="Grade C: ถ้ามีสัญญาณเน่าชัดเจน → จัดเป็น C ทันที" />
              <RuleRow text="ห้ามใช้ภาพ AI-generated เป็นภาพ train/test จริง" />
              <RuleRow text="Augmentation ทำหลัง split เท่านั้น เพื่อกัน data leakage" />
            </ul>
          </div>
        </div>

        {/* Sample manifest */}
        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-card-soft overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                ตัวอย่าง Manifest
              </div>
              <h3 className="font-display font-bold text-lg mt-0.5">
                แสดง {rows.length} แถว ({typeFilter === "all" ? "ทั้งหมด" : "ตามตัวกรอง"})
              </h3>
            </div>
            <code className="text-xs font-mono bg-secondary px-2 py-1 rounded">
              src/data/dataset/sample_manifest.csv
            </code>
          </div>
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-3 font-medium">image_id</th>
                <th className="py-2 pr-3 font-medium">split</th>
                <th className="py-2 pr-3 font-medium">type</th>
                <th className="py-2 pr-3 font-medium">species</th>
                <th className="py-2 pr-3 font-medium">grade</th>
                <th className="py-2 pr-3 font-medium text-right">score</th>
                <th className="py-2 pr-3 font-medium">lighting</th>
                <th className="py-2 pr-3 font-medium">expert1/2</th>
                <th className="py-2 pr-3 font-medium">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 24).map((r) => {
                const meta = FRESHNESS_GRADES.find((g) => g.id === r.grade)!;
                return (
                  <tr key={r.image_id} className="border-b border-border/60">
                    <td className="py-2 pr-3 font-mono">{r.image_id}</td>
                    <td className="py-2 pr-3">{r.split}</td>
                    <td className="py-2 pr-3">{r.seafood_type_id}</td>
                    <td className="py-2 pr-3">{r.species_th}</td>
                    <td className="py-2 pr-3">
                      <span
                        className="px-1.5 py-0.5 rounded font-semibold"
                        style={{ background: `${meta.ui_color}1f`, color: meta.ui_color }}
                      >
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-right">{r.freshness_score}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.lighting}</td>
                    <td className="py-2 pr-3">
                      {r.expert_1_grade}/{r.expert_2_grade}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          r.label_status === "accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : r.label_status === "needs_review"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.label_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length > 24 && (
            <div className="text-xs text-muted-foreground mt-3">
              … แสดง 24 แถวแรก จากทั้งหมด {rows.length} แถว
            </div>
          )}
        </div>

        {/* Editor hint */}
        <div className="mt-6 rounded-2xl border border-dashed border-ocean/30 bg-ocean/5 p-4 text-sm text-ocean-deep">
          <span className="font-bold">สำหรับผู้พัฒนา:</span> แก้ไข dataset/manifest ได้ที่ไฟล์ใน{" "}
          <code className="font-mono bg-white/70 px-1.5 py-0.5 rounded">src/data/dataset/</code>{" "}
          (sample_manifest.csv, target_counts.csv, quality_rules.json, annotation_schema.json)
          ระบบจะ re-validate และอัปเดตหน้านี้ให้อัตโนมัติ
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

  const byType = SEAFOOD_TYPES.map((t) => ({
    type: t.labelTh,
    count: rows.filter((r) => r.seafood_type_id === t.id).length,
  }));
  const byGrade = (["A", "B", "C"] as FreshnessGrade[]).map((g) => ({
    grade: g,
    count: rows.filter((r) => r.grade === g).length,
    meta: FRESHNESS_GRADES.find((x) => x.id === g)!,
  }));
  const bySplit = (["train", "val", "test"] as Split[]).map((s) => ({
    split: s,
    count: rows.filter((r) => r.split === s).length,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCancel}
        className="absolute inset-0 bg-ocean-deep/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-card shadow-2xl border border-border overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-ocean/10 px-3 py-1 text-xs font-medium text-ocean-deep">
                <Upload className="size-3.5" /> พรีวิวก่อนนำเข้า
              </div>
              <h3 className="mt-3 font-display font-bold text-2xl tracking-tight">
                ตรวจสอบข้อมูลก่อนยืนยัน
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ไฟล์: <span className="font-mono">{fileName}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">จำนวนภาพรวม</div>
              <div className="font-display font-bold text-3xl text-gradient-ocean">
                {total.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {byType.map((t) => (
              <div key={t.type} className="rounded-xl bg-secondary/60 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">{t.type}</div>
                <div className="font-display font-bold text-lg">{t.count}</div>
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            {byGrade.map((g) => (
              <div
                key={g.grade}
                className="rounded-xl px-3 py-2"
                style={{ background: `${g.meta.ui_color}14` }}
              >
                <div className="text-[11px]" style={{ color: g.meta.ui_color }}>
                  Grade {g.grade} · {g.meta.label_th}
                </div>
                <div className="font-display font-bold text-lg" style={{ color: g.meta.ui_color }}>
                  {g.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {bySplit.map((s) => (
              <span
                key={s.split}
                className="rounded-full bg-white border border-border px-2.5 py-1"
              >
                {splitLabel[s.split]}: <b>{s.count}</b>
              </span>
            ))}
            <span
              className={`rounded-full px-2.5 py-1 border ${errs ? "bg-red-50 border-red-200 text-red-700" : warns ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
            >
              ตรวจล่วงหน้า: {errs} error · {warns} warning
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            รายการ (แสดง {Math.min(rows.length, 50)} จาก {total.toLocaleString()})
          </div>
          <table className="w-full text-xs min-w-[640px]">
            <thead className="sticky top-0 bg-card">
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-3 font-medium">image_id</th>
                <th className="py-2 pr-3 font-medium">split</th>
                <th className="py-2 pr-3 font-medium">type</th>
                <th className="py-2 pr-3 font-medium">species</th>
                <th className="py-2 pr-3 font-medium">grade</th>
                <th className="py-2 pr-3 font-medium text-right">score</th>
                <th className="py-2 pr-3 font-medium">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r) => {
                const meta = FRESHNESS_GRADES.find((g) => g.id === r.grade);
                return (
                  <tr key={r.image_id} className="border-b border-border/60">
                    <td className="py-1.5 pr-3 font-mono">{r.image_id}</td>
                    <td className="py-1.5 pr-3">{r.split}</td>
                    <td className="py-1.5 pr-3">{r.seafood_type_id}</td>
                    <td className="py-1.5 pr-3">{r.species_th}</td>
                    <td className="py-1.5 pr-3">
                      <span
                        className="px-1.5 py-0.5 rounded font-semibold"
                        style={{
                          background: `${meta?.ui_color ?? "#64748b"}1f`,
                          color: meta?.ui_color ?? "#64748b",
                        }}
                      >
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-1.5 pr-3 text-right">{r.freshness_score}</td>
                    <td className="py-1.5 pr-3 text-muted-foreground">{r.label_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-4 flex items-center justify-between gap-3 bg-secondary/30">
          <div className="text-xs text-muted-foreground">
            เมื่อยืนยัน ระบบจะแทนที่ manifest ปัจจุบันและตรวจสอบคุณภาพใหม่ทั้งหมด
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-secondary transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-2 rounded-xl bg-ocean-gradient text-white px-4 py-2 text-sm font-medium shadow-card-soft hover:opacity-95 transition"
            >
              <CheckCircle2 className="size-4" /> ยืนยันและนำเข้า
            </button>
          </div>
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
  const toneClass = {
    ocean: "from-ocean to-ocean-deep",
    ok: "from-emerald-500 to-emerald-700",
    warn: "from-amber-500 to-amber-600",
    danger: "from-red-500 to-red-700",
  }[tone];
  return (
    <div className="relative rounded-3xl border border-border bg-card p-5 shadow-card-soft overflow-hidden">
      <div
        className={`absolute -top-10 -right-10 size-28 rounded-full bg-gradient-to-br ${toneClass} opacity-10`}
      />
      <div className="flex items-center gap-3">
        <div
          className={`size-10 rounded-xl grid place-items-center text-white bg-gradient-to-br ${toneClass} shadow-card-soft`}
        >
          {icon}
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="mt-3 font-display font-bold text-2xl tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${toneClass}`}
          />
        </div>
      )}
    </div>
  );
}

function Chip({
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
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? "bg-ocean-gradient text-white shadow-card-soft"
          : "bg-secondary/60 text-foreground/70 hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}

function RuleRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-ocean-deep" />
      <span className="text-foreground/85">{text}</span>
    </li>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Fish,
  ThermometerSnowflake,
  Calendar,
  Sparkles,
  Database,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  SPECIES_CATALOG,
  DATASET_SPECIFICATIONS,
  type SpeciesQualityProfile,
} from "@/data/species_knowledge";

export const Route = createFileRoute("/species")({
  head: () => ({
    meta: [
      { title: "ฐานความรู้ชีวภาพสัตว์น้ำและเกณฑ์ QIM · FreshScan Marine™" },
      {
        name: "description",
        content:
          "รวบรวมชนิดปลาและสัตว์น้ำเศรษฐกิจ 16 สายพันธุ์ พร้อมเกณฑ์ QIM Demerit จุดสังเกตความสด อุณหภูมิ Cold-Chain และแหล่งอ้างอิง Dataset สากล",
      },
    ],
  }),
  component: SpeciesPage,
});

const TYPE_META = {
  fish: { label: "ปลา (Fish)", color: "bg-sky-500/10 text-sky-300 border-sky-500/30" },
  shrimp: { label: "กุ้ง (Shrimp)", color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" },
  shellfish: { label: "หอย (Shellfish)", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  squid: { label: "ปลาหมึก (Squid)", color: "bg-teal-500/10 text-teal-300 border-teal-500/30" },
} as const;

function SpeciesPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof TYPE_META>("all");
  const [search, setSearch] = useState("");

  const filtered = SPECIES_CATALOG.filter((s: SpeciesQualityProfile) => {
    const matchesType = filter === "all" || s.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      s.nameTh.toLowerCase().includes(search.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      s.scientific.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

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
            เริ่มการสแกนความสด →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <Sparkles className="size-3.5 text-cyan-400" />
            MARINE TAXONOMY & COLD-CHAIN HUB
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            ฐานข้อมูลชนิดสัตว์น้ำและ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              เกณฑ์ประเมินทางชีวภาพ (QIM)
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            รวบรวมสายพันธุ์สัตว์น้ำเศรษฐกิจในน่านน้ำไทยและเอเชียแปซิฟิก พร้อมอุณหภูมิควบคุมห่วงโซ่ความเย็น (0–2°C)
            จุดตรวจวัดทางกายภาพ และอายุการเก็บรักษาบนน้ำแข็ง
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "fish", "shrimp", "shellfish", "squid"] as const).map((t) => {
              const active = filter === t;
              const label = t === "all" ? "ทั้งหมด" : TYPE_META[t].label;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-950/40"
                      : "bg-slate-900/60 text-slate-400 border border-sky-500/15 hover:border-sky-500/40 hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อไทย วิทยาศาสตร์..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-sky-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Species grid */}
        <section className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s: SpeciesQualityProfile, i: number) => {
            const meta = TYPE_META[s.category];
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-sky-500/20 bg-slate-900/50 p-5 shadow-xl hover:border-cyan-400/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${meta.color}`}
                    >
                      <Fish className="size-3" /> {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono italic">
                      {s.scientific}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display font-bold text-lg text-white leading-tight">
                    {s.nameTh}
                  </h3>
                  <div className="text-xs text-cyan-300 font-mono mt-0.5">{s.nameEn}</div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-slate-300">
                      <ThermometerSnowflake className="size-3.5 mt-0.5 text-cyan-400 shrink-0" />
                      <span>
                        <b className="text-white">{s.optimalTempC}</b> · {s.shelfLifeIcedDays}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <Calendar className="size-3.5 mt-0.5 text-sky-400 shrink-0" />
                      <span>
                        ฤดูกาล: {s.peakSeasonTh} · {s.habitat}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sky-500/15">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-2">
                      จุดสังเกตตามเกณฑ์ QIM:
                    </div>
                    <ul className="space-y-1.5">
                      {s.qimAnatomyGuide.slice(0, 2).map((item, idx) => (
                        <li
                          key={idx}
                          className="text-[11px] text-slate-300 leading-tight"
                        >
                          <span className="text-cyan-300 font-medium">✓ {item.region}: </span>
                          <span>{item.freshIndicatorTh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 text-[11px] text-slate-400 border-t border-sky-500/10 italic">
                  ลักษณะการบริโภค: {s.culinaryProfileTh}
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* Dataset references */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-11 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-sky-500/10 border border-cyan-400/30 grid place-items-center shadow-lg">
              <Database className="size-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                ฐานข้อมูลงานวิจัยและมาตรฐานอ้างอิง
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                รวบรวมจากสถาบันการประมงระดับโลก มาตรฐานอาหารแห่งชาติ มกษ. และ Open Biological Datasets
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {DATASET_SPECIFICATIONS.map((d, i: number) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-sky-500/20 bg-slate-900/50 p-5 hover:border-cyan-400/40 hover:bg-slate-900/80 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-display font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                    {d.title}
                  </div>
                  <ExternalLink className="size-4 text-slate-400 group-hover:text-cyan-300 shrink-0 mt-0.5" />
                </div>
                <div className="mt-1 text-xs font-mono text-cyan-300">{d.reference}</div>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{d.scope}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

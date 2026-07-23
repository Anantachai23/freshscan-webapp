import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Fish, Thermometer, Calendar, Sparkles, Database } from "lucide-react";
import { useState } from "react";
import { SPECIES, DATASET_REFERENCES } from "@/data/species_knowledge";

export const Route = createFileRoute("/species")({
  head: () => ({
    meta: [
      { title: "ฐานความรู้ชนิดอาหารทะเล · FreshScan" },
      {
        name: "description",
        content:
          "รวบรวมชนิดปลาและอาหารทะเลไทยที่ FreshScan รองรับ พร้อมเกณฑ์ความสด อุณหภูมิเก็บรักษา และแหล่งอ้างอิง Dataset",
      },
    ],
  }),
  component: SpeciesPage,
});

const TYPE_META = {
  fish: { label: "ปลา", color: "bg-ocean/10 text-ocean-deep border-ocean/30" },
  shrimp: { label: "กุ้ง", color: "bg-coral/10 text-coral border-coral/30" },
  shellfish: { label: "หอย", color: "bg-amber-100 text-amber-800 border-amber-300" },
  squid: { label: "ปลาหมึก", color: "bg-purple-100 text-purple-800 border-purple-300" },
} as const;

function SpeciesPage() {
  const [filter, setFilter] = useState<"all" | keyof typeof TYPE_META>("all");
  const filtered = filter === "all" ? SPECIES : SPECIES.filter((s) => s.type === filter);

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
            เริ่มวิเคราะห์ →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-ocean-deep">
            <Sparkles className="size-3.5 text-coral" />
            Species Knowledge Base
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            ฐานความรู้<span className="text-gradient-ocean">อาหารทะเลไทย</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            รวบรวมชนิดที่ระบบรองรับ พร้อมเกณฑ์คุณภาพ อุณหภูมิเก็บรักษา ฤดูกาล
            และแหล่งอ้างอิง Dataset สาธารณะที่ใช้ในการออกแบบ taxonomy
          </p>
        </div>

        {/* Filter */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {(["all", "fish", "shrimp", "shellfish", "squid"] as const).map((t) => {
            const active = filter === t;
            const label = t === "all" ? "ทั้งหมด" : TYPE_META[t].label;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-ocean-gradient text-white shadow-card-soft"
                    : "bg-white/70 border border-border hover:border-ocean/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Species grid */}
        <section className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const meta = TYPE_META[s.type];
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card-soft hover:shadow-glow transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${meta.color}`}
                  >
                    <Fish className="size-3" /> {meta.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {s.scientific}
                  </span>
                </div>
                <h3 className="mt-3 font-display font-bold text-lg leading-tight">
                  {s.nameTh}
                </h3>
                <div className="text-xs text-muted-foreground">{s.nameEn}</div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Thermometer className="size-3.5 mt-0.5 text-ocean shrink-0" />
                    <span>
                      <b>{s.storageTempC}</b> · {s.shelfLifeDays}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="size-3.5 mt-0.5 text-coral shrink-0" />
                    <span>ฤดูกาล: {s.peakSeasonTh} · {s.habitat}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    จุดสังเกตเมื่อสด
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {s.keyIndicators.map((k) => (
                      <li
                        key={k}
                        className="text-[11px] bg-secondary/70 rounded-full px-2 py-0.5"
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 text-[11px] text-muted-foreground italic">
                  {s.nutrition}
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* Dataset references */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="size-10 rounded-xl bg-ocean-gradient grid place-items-center shadow-card-soft">
              <Database className="size-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl">แหล่งอ้างอิง Dataset</h2>
              <p className="text-sm text-muted-foreground">
                รวบรวมจากงานวิจัยและ open dataset ที่ใช้ตรวจสอบ taxonomy และเกณฑ์ cue
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {DATASET_REFERENCES.map((d, i) => (
              <motion.a
                key={d.name}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-4 hover:border-ocean/40 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-display font-bold text-sm leading-snug">
                    {d.name}
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-ocean shrink-0 mt-1" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {d.desc}
                </p>
                <div className="mt-2 inline-block text-[10px] font-medium text-ocean-deep bg-ocean/5 rounded-full px-2 py-0.5">
                  {d.usage}
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Fish, CircleDot, Sparkles, Shell, ArrowRight, Waves } from "lucide-react";

interface MarineRealm {
  id: "fish" | "shrimp" | "squid" | "shellfish";
  titleTh: string;
  titleEn: string;
  depthLabel: string;
  color: string;
  glowColor: string;
  icon: typeof Fish;
  tagline: string;
  cues: string[];
}

const REALMS: MarineRealm[] = [
  {
    id: "fish",
    titleTh: "ปลาทะเล (Fish)",
    titleEn: "Teleostei / Marine Finfish",
    depthLabel: "DEPTH: 50 – 200 M",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.25)",
    icon: Fish,
    tagline: "ดวงตานูนใส กระจกตาสะท้อนประกาย ซี่เหงือกแดงสด กลิ่นไอทะเล",
    cues: [
      "นัยน์ตานูนใสเต่งตึง ไม่ยุบตัวเป็นหลุม",
      "เหงือกสีแดงสดหรือชมพูเข้ม เมือกใสบาง",
      "เกล็ดสีเงินสะท้อนแสง แนบสนิทกับลำตัว",
      "เนื้อแน่นเด้ง เมื่อกดนิ้วลงไปจะคืนตัวทันที",
    ],
  },
  {
    id: "shrimp",
    titleTh: "กุ้งทะเล (Shrimp)",
    titleEn: "Crustacea / Penaeidae",
    depthLabel: "DEPTH: 80 – 300 M",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.25)",
    icon: CircleDot,
    tagline: "เปลือกแก้วใสติดเนื้อ หัวแน่นไม่หลุดคลอน ไร้รอยคล้ำเมลาโนซิส",
    cues: [
      "เปลือกใสโปร่งแสง เนื้อแน่นติดเปลือก",
      "ส่วนหัว (Carapace) ยึดแน่น ไม่หลุดคลอน",
      "ไร้จุดดำจากเอนไซม์ PPO (Melanosis 0)",
      "หางสีใสเป็นธรรมชาติ ปราศจากกลิ่นคาวแอมโมเนีย",
    ],
  },
  {
    id: "squid",
    titleTh: "ปลาหมึก (Squid)",
    titleEn: "Cephalopoda / Loliginidae",
    depthLabel: "DEPTH: 200 – 600 M",
    color: "#818cf8",
    glowColor: "rgba(129, 140, 248, 0.25)",
    icon: Sparkles,
    tagline: "ลำตัวใสอมชมพู เม็ดสี Chromatophores สดใส หนวดดูดเกาะแน่น",
    cues: [
      "ลำตัวขาวใส หนังไม่เปื่อยหรือลอกร่อน",
      "เม็ดสี Chromatophores เรียงตัวกระจายสมบูรณ์",
      "นัยน์ตาดำใสประกาย ไม่ขุ่นมัว",
      "ถ้วยดูดที่หนวดสมบูรณ์ เหนียวเกาะผิวสัมผัส",
    ],
  },
  {
    id: "shellfish",
    titleTh: "หอยทะเล (Shellfish)",
    titleEn: "Bivalvia / Mollusca",
    depthLabel: "DEPTH: 10 – 150 M",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.25)",
    icon: Shell,
    tagline: "สองฝาปิดสนิท ตอบสนองทันทีเมื่อเคาะ น้ำในฝาใสบริสุทธิ์",
    cues: [
      "ฝาปิดสนิท หรือหุบปิดทันทีเมื่อสัมผัส (ยังมีชีวิต)",
      "เนื้อหอยสีส้มหรือครีมสดใส เต่งตึงอวบอิ่ม",
      "น้ำในฝาใสสะอาด กลิ่นหอมไอทะเลธรรมชาติ",
      "ปราศจากกลิ่นแก๊สไข่เน่าและเมือกขุ่นเหนียว",
    ],
  },
];

export function OceanRealms() {
  return (
    <section id="realms" className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Background bioluminescent ambient lighting */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
            <Waves className="size-3.5 text-cyan-400" />
            DEPTH: 100M – 600M · 4 OCEANIC REALMS
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            4 ขุมทรัพย์แห่งท้องทะเล <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              สิ่งมหัศจรรย์และเกณฑ์ความสด
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            คัดสรรเฉพาะ 4 ชนิดสัตว์น้ำเศรษฐกิจหลัก ตรวจวัดด้วยเกณฑ์ทางประสาทสัมผัสและพิกเซลสีที่แม่นยำที่สุด
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REALMS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl border border-sky-500/20 bg-slate-900/60 p-6 flex flex-col justify-between shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{
                boxShadow: `0 10px 30px -10px ${r.glowColor}`,
              }}
            >
              {/* Hover Glow Background */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${r.glowColor}, transparent 70%)`,
                }}
              />

              <div className="relative">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div
                    className="size-12 rounded-2xl grid place-items-center border transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${r.color}15`,
                      borderColor: `${r.color}40`,
                      color: r.color,
                    }}
                  >
                    <r.icon className="size-6" strokeWidth={2.2} />
                  </div>
                  <span
                    className="font-mono text-[10px] rounded-full px-2.5 py-0.5 border"
                    style={{
                      backgroundColor: `${r.color}10`,
                      borderColor: `${r.color}30`,
                      color: r.color,
                    }}
                  >
                    {r.depthLabel}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 font-display font-bold text-xl text-white group-hover:text-cyan-200 transition-colors">
                  {r.titleTh}
                </h3>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">{r.titleEn}</div>

                {/* Tagline */}
                <p className="mt-3 text-xs text-slate-300 leading-relaxed font-medium">
                  {r.tagline}
                </p>

                {/* Checklist */}
                <div className="mt-5 pt-4 border-t border-sky-500/15 space-y-2 text-xs">
                  {r.cues.map((cue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="font-bold shrink-0 mt-0.5" style={{ color: r.color }}>
                        ✓
                      </span>
                      <span className="leading-tight text-[11px]">{cue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative mt-6 pt-4 border-t border-sky-500/15">
                <Link
                  to="/analyze"
                  search={{ type: r.id }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border group-hover:brightness-110"
                  style={{
                    backgroundColor: `${r.color}20`,
                    borderColor: `${r.color}50`,
                    color: r.color,
                  }}
                >
                  <span>สแกน{r.titleTh.split(" ")[0]}</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

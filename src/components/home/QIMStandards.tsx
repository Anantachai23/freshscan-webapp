import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEAFOOD_TYPES, type SeafoodTypeId } from "@/data/freshscan_taxonomy";
import { CheckCircle2, AlertTriangle, ShieldCheck, Microscope, Info, ArrowUpRight } from "lucide-react";

export function QIMStandards() {
  const [activeType, setActiveType] = useState<SeafoodTypeId>("fish");
  const currentCategory = SEAFOOD_TYPES.find((t) => t.id === activeType) ?? SEAFOOD_TYPES[0];

  return (
    <section id="qim-standards" className="relative py-24 md:py-32 bg-slate-900 text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <Microscope className="size-3.5" />
            <span>Scientific Sensory Protocol</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">
            มาตรฐานการตรวจวัด
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Quality Index Method (QIM)
            </span>
          </h2>

          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            QIM คือระบบประเมินคุณภาพประสาทสัมผัส (Sensory Evaluation) ที่ได้รับการยอมรับในระดับสากล
            โดยสถาบันวิจัยการประมงยุโรป (European Fisheries) และองค์การอาหารและการเกษตรแห่งสหประชาชาติ (FAO)
            ใช้การนับแต้มข้อบกพร่อง (Demerit Points 0–20) แยกตามตำแหน่งกายวิภาคเฉพาะของสัตว์น้ำแต่ละชนิด
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-10 flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 w-fit">
          {SEAFOOD_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeType === type.id
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{type.labelTh}</span>
              <span className="text-[10px] opacity-75 font-normal">({type.labelEn})</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="mt-8 grid lg:grid-cols-[1fr_1.3fr] gap-8 items-start"
          >
            {/* Left Card: Category Overview & Economic Species */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-mono">
                    {currentCategory.scientificFamily}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white mt-1">
                    {currentCategory.labelTh}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
                  {currentCategory.standardDoc}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  ชนิดพันธุ์เศรษฐกิจที่ครอบคลุม
                </h4>
                <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                  {currentCategory.supportedSpecies.map((sp) => (
                    <div
                      key={sp.scientific}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
                    >
                      <div className="font-semibold text-white">{sp.commonTh}</div>
                      <div className="text-[11px] text-slate-400 italic font-serif">
                        {sp.scientific}
                      </div>
                      <div className="mt-1 text-[10px] text-sky-400/80">{sp.habitat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Safety Limits */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3">
                  <AlertTriangle className="size-4" />
                  <span>เกณฑ์อันตรายทางชีววิทยา (Critical Safety Thresholds)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentCategory.criticalSafetyThresholds.map((crit) => (
                    <li key={crit.metric} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{crit.hazardDescription}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: QIM Anatomical Checkpoints Breakdown */}
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>เกณฑ์คะแนนข้อบกพร่อง (Demerit Points Grid: 0–20)</span>
                <span className="text-sky-400 font-mono">Weight Sum: 100%</span>
              </div>

              {currentCategory.qimCriteria.map((criterion, idx) => (
                <div
                  key={criterion.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-md p-5 hover:border-sky-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="size-6 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-bold grid place-items-center font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="font-display font-bold text-base text-white group-hover:text-sky-300 transition-colors">
                          {criterion.labelTh}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-8 font-mono">
                        Biomarker: {criterion.biomarker}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        Max: {criterion.maxDemerit} Pts
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        น้ำหนัก {(criterion.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Level Scales */}
                  <div className="mt-4 pl-8 grid sm:grid-cols-3 gap-2">
                    {criterion.levels.map((lvl) => (
                      <div
                        key={lvl.labelTh}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px]"
                      >
                        <div className="font-semibold text-slate-200">{lvl.labelTh}</div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                          {lvl.descTh}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

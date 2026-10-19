import { motion } from "motion/react";
import { ThermometerSnowflake, ShieldCheck, Scale, Zap, Waves, Award } from "lucide-react";

const metrics = [
  {
    icon: ThermometerSnowflake,
    value: "0 – 2 °C",
    label: "อุณหภูมิควบคุมห่วงโซ่ความเย็น",
    sub: "เกณฑ์น้ำแข็งเกล็ดรักษาความสดตามมาตรฐานสากล",
    color: "#38bdf8",
  },
  {
    icon: Zap,
    value: "< 0.8 วิ",
    label: "ความเร็ววิเคราะห์พิกเซล",
    sub: "สแกนและประมวลผลทันทีในเบราว์เซอร์ ลื่นไหล",
    color: "#06b6d4",
  },
  {
    icon: Scale,
    value: "0 – 20",
    label: "Demerit QIM Rubric",
    sub: "เกณฑ์ประเมินจุดด้อยมาตรฐานยุโรป & มกษ. 7001",
    color: "#818cf8",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "ความเป็นส่วนตัวสมบูรณ์",
    sub: "รูปถ่ายไม่ถูกส่งออกนอกเครื่อง ปลอดภัยไร้กังวล",
    color: "#10b981",
  },
];

export function ColdChainVault() {
  return (
    <section className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Abyssal Emerald Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <ThermometerSnowflake className="size-3.5 text-emerald-400" />
            DEPTH: 2,000M – 2,800M · COLD-CHAIN VAULT
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            มาตรฐานความปลอดภัย <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              และการควบคุมห่วงโซ่ความเย็น
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            ออกแบบเพื่อยกระดับความเชื่อมั่นให้ผู้บริโภค ตลาดสด และร้านอาหาร
            คัดกรองวัตถุดิบคุณภาพสูงและลดการสูญเสียอาหาร (Food Waste)
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-cyan-400/40 transition-all"
            >
              <div>
                <div
                  className="size-12 rounded-2xl grid place-items-center border"
                  style={{
                    backgroundColor: `${m.color}15`,
                    borderColor: `${m.color}40`,
                    color: m.color,
                  }}
                >
                  <m.icon className="size-6" strokeWidth={2.2} />
                </div>
                <div
                  className="mt-6 font-display font-extrabold text-3xl sm:text-4xl tracking-tight"
                  style={{ color: m.color }}
                >
                  {m.value}
                </div>
                <div className="mt-2 text-sm font-bold text-white">{m.label}</div>
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed pt-3 border-t border-sky-500/15">
                {m.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

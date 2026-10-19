import { motion } from "motion/react";
import { Camera, Cpu, Award, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const steps = [
  {
    n: "01",
    icon: Camera,
    titleTh: "เล็งถ่ายจุดสำคัญ",
    desc: "เปิดกล้องส่องระยะใกล้ 15–30 ซม. ให้เห็นตา เหงือก หรือเปลือกชัดเจน ระบบมี Reticle นำทางอัตโนมัติ",
    tag: "High-Res Optical Input",
    color: "#38bdf8",
  },
  {
    n: "02",
    icon: Cpu,
    titleTh: "วิเคราะห์พิกเซลใน 0.8 วิ",
    desc: "คอมพิวเตอร์วิทัศน์คำนวณความขุ่นของตา รอยคล้ำเมลาโนซิส และความสดของเหงือก ทำงานบนเครื่อง 100%",
    tag: "Sub-Second In-Browser CV",
    color: "#06b6d4",
  },
  {
    n: "03",
    icon: Award,
    titleTh: "รับเกรด & อายุบนน้ำแข็ง",
    desc: "แสดงเกรด Extra/A/B/Reject ตามมาตรฐาน QIM พร้อมคำนวณวันเก็บรักษาบนน้ำแข็งที่เหลืออยู่",
    tag: "QIM Standard 0–20",
    color: "#10b981",
  },
];

export function AbyssalScanner() {
  return (
    <section className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Deep Midnight Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="size-3.5 text-cyan-400" />
            DEPTH: 800M – 1,500M · THE ABYSSAL SCANNER
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            สแกนแม่นยำใน 3 ขั้นตอน <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              ง่ายเหมือนกดถ่ายรูป
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            ออกแบบให้ใช้งานได้ทันทีบนสมาร์ทโฟนทุกเครื่องในตลาดสด หน้าแพปลา หรือห้องครัว
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative rounded-3xl border border-sky-500/20 bg-slate-900/60 p-7 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-cyan-400/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className="size-14 rounded-2xl grid place-items-center border group-hover:scale-105 transition-all"
                    style={{
                      backgroundColor: `${s.color}15`,
                      borderColor: `${s.color}40`,
                      color: s.color,
                    }}
                  >
                    <s.icon className="size-7" strokeWidth={2} />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-cyan-400/40 transition-colors">
                    {s.n}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-white">
                    {s.titleTh}
                  </h3>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-500/15 flex items-center justify-between">
                <span
                  className="font-mono text-[10px] rounded-full px-2.5 py-0.5 border"
                  style={{
                    backgroundColor: `${s.color}10`,
                    borderColor: `${s.color}30`,
                    color: s.color,
                  }}
                >
                  {s.tag}
                </span>
                <Zap className="size-3.5 text-cyan-400/60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Launch CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all text-sm sm:text-base"
          >
            <Camera className="size-5" />
            <span>ทดลองสแกนความสดเดี๋ยวนี้</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

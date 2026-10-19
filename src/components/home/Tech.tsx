import { motion } from "motion/react";
import { Shield, Eye, Sparkles, Smartphone, Sliders, CheckCircle2, Waves, Microscope, Activity } from "lucide-react";

const capabilities = [
  {
    icon: Shield,
    tag: "Client-Side Privacy",
    title: "100% Edge Privacy",
    desc: "ประมวลผลพิกเซลทั้งหมดบนเว็บเบราว์เซอร์ของอุปกรณ์คุณโดยตรง ไม่มีการส่งภาพขึ้น Cloud หรือเก็บบันทึกข้อมูลภายนอก",
  },
  {
    icon: Sliders,
    tag: "Scientific Rubric",
    title: "Quality Index Method (QIM)",
    desc: "คำนวณคะแนนจุดด้อย 0–20 Demerit Points ตามมาตรฐานการตรวจปลาและสัตว์น้ำสากล (European QIM Foundation & FAO TP 348)",
  },
  {
    icon: Microscope,
    tag: "Chromatic Calibration",
    title: "Color Constancy & Lab Normalization",
    desc: "ปรับชดเชยอุณหภูมิสีและสภาพแสงอัตโนมัติ (White Balancing) แปลงค่าสีเข้าสู่ปริภูมิ L*a*b* เพื่อความแม่นยำสูงสุดในทุกตลาด",
  },
  {
    icon: Activity,
    tag: "Biological Biomarkers",
    title: "Melanosis & Spoilage Index",
    desc: "ตรวจจับการสร้างเอนไซม์ Polyphenol Oxidase (รอยดำในกุ้ง), เมือกขุ่นบนเหงือกปลา และการกระจายตัวของเม็ดสีในหมึก",
  },
  {
    icon: Waves,
    tag: "Taxonomic Coverage",
    title: "4 Taxa Bio-Profiles",
    desc: "แยกโมเดลการประเมินอิสระ 4 หมวดชีวภาพ (ปลา, กุ้ง, หอยสองฝา, ปลาหมึก) พร้อมฐานข้อมูลอ้างอิงเฉพาะสายพันธุ์ไทยและเอเชีย",
  },
  {
    icon: Smartphone,
    tag: "Smart Downsampling",
    title: "High-Res Auto-Optimization",
    desc: "มีระบบปรับขนาดภาพความละเอียดสูง (48MP–108MP) ให้อยู่ในขนาดที่เหมาะสมทันทีก่อนวิเคราะห์ ลื่นไหล ไม่กินแรมมือถือ",
  },
];

export function Tech() {
  return (
    <section id="tech" className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <Sparkles className="size-3.5 text-cyan-400" />
            ENGINEERING & MARINE SCIENCE
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            สถาปัตยกรรมชีวภาพและคอมพิวเตอร์วิทัศน์ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
              เพื่อความแม่นยำระดับห้องปฏิบัติการ
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            FreshScan ผสานหลักการตรวจวัดทางประสาทสัมผัส (Sensory Evaluation) ร่วมกับการประมวลผลพิกเซลแบบ Real-Time
            ให้ผลลัพธ์ที่อธิบายเหตุผลได้จริง (Explainable Cues) และสอดคล้องกับมาตรฐานความปลอดภัยอาหาร
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-sky-500/15 bg-slate-900/40 p-6 hover:border-cyan-400/40 hover:bg-slate-900/80 transition-all shadow-md hover:shadow-cyan-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/10 border border-sky-500/30 grid place-items-center group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <c.icon className="size-6 text-cyan-300" strokeWidth={2} />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-sky-400 bg-sky-500/10 rounded-full px-2.5 py-0.5 border border-sky-500/20">
                  {c.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display font-bold text-lg text-white group-hover:text-cyan-200 transition-colors">
                {c.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

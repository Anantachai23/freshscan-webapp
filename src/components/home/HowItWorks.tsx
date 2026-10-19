import { motion } from "motion/react";
import { Camera, Cpu, Award, CheckCircle2, ScanLine, Sparkles, ShieldCheck } from "lucide-react";
import fishImg from "@/assets/fish-sample.jpg";

const steps = [
  {
    n: "01",
    icon: Camera,
    title: "Optical Capture & Alignment",
    titleTh: "จัดวางและถ่ายภาพจุดตรวจ",
    desc: "เปิดกล้องสมาร์ทโฟนหรืออัปโหลดภาพระยะใกล้ เน้นจุดชีวภาพสำคัญ เช่น นัยน์ตา เหงือก เปลือก หรือเยื่อหุ้ม ระบบมี Grid นำทางอัตโนมัติ",
    tag: "High-Res Optical Input",
  },
  {
    n: "02",
    icon: Cpu,
    title: "Edge QIM Spectral Analysis",
    titleTh: "สกัดคุณลักษณะชีวภาพด้วย Edge CV",
    desc: "ประมวลผลบนเบราว์เซอร์ 100% คำนวณค่าสี Lab/HSV, ความขุ่นของเลนส์ตา (Corneal Opacity), ดัชนีเมลาโนซิส (Melanosis Index) และความคมชัดของเกล็ด",
    tag: "Sub-Second In-Browser CV",
  },
  {
    n: "03",
    icon: Award,
    title: "QIM Demerit Score & Certificate",
    titleTh: "ออกผลการประเมินและอายุการเก็บรักษา",
    desc: "สรุปคะแนนจุดด้อย (Demerits 0–20), ระดับความสด Extra/A/B/Reject ตามมาตรฐาน TAS/FAO พร้อมคำนวณวันเก็บรักษาบนน้ำแข็งที่เหลืออยู่",
    tag: "TAS 7001 / FAO TP 348",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
              <ScanLine className="size-3.5 text-cyan-400" />
              INSPECTION WORKFLOW
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              กระบวนการตรวจสอบ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
                แม่นยำทางวิทยาศาสตร์ใน 3 ขั้นตอน
              </span>
            </h2>
          </div>
          <p className="md:max-w-md text-sm sm:text-base text-slate-400 leading-relaxed">
            ออกแบบสำหรับการใช้งานจริงหน้าแพปลา ตลาดสด โรงงานแปรรูป และครัวเรือน
            ทำงานได้ทันทีผ่านเว็บเบราว์เซอร์โดยไม่ต้องติดตั้งโปรแกรมหรือส่งข้อมูลส่วนบุคคลออกนอกเครื่อง
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-[1.1fr_1.3fr] gap-10 lg:gap-14 items-center">
          {/* Sample HUD Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl p-1 bg-gradient-to-br from-sky-500/30 via-slate-800 to-slate-900 shadow-2xl shadow-sky-950/60"
          >
            <div className="relative rounded-[22px] overflow-hidden bg-slate-900 border border-sky-500/20 aspect-square sm:aspect-[4/3] lg:aspect-square">
              <img
                src={fishImg}
                alt="การตรวจสอบคุณภาพปลาด้วย FreshScan"
                className="size-full object-cover brightness-90 contrast-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              
              {/* Sonar Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              {/* Top status bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-sky-500/30 px-3 py-1.5 text-xs text-sky-200">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  SPECTRAL CALIBRATION OK
                </div>
                <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-sky-500/30 px-3 py-1.5 text-xs font-mono text-cyan-300">
                  ISO/IEC 17025
                </div>
              </div>

              {/* Biological Focal Points */}
              <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <div className="relative size-7 rounded-full border-2 border-cyan-400 bg-cyan-400/20 grid place-items-center animate-ping" />
                <div className="absolute -top-7 left-8 whitespace-nowrap rounded-lg bg-slate-950/90 border border-cyan-400/40 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                  CORNEA: CLARITY 98.4%
                </div>
              </div>

              {/* Bottom HUD metrics */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 pointer-events-none">
                {[
                  { label: "ความสดสายตา", val: "Demerit 0", sub: "ใส นูน ไม่ขุ่น" },
                  { label: "สีเหงือกชีวภาพ", val: "Demerit 0", sub: "แดงสด เลือดเข้ม" },
                  { label: "ความแน่นของเนื้อ", val: "Demerit 1", sub: "ยืดหยุ่นสูง" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-950/85 backdrop-blur-md border border-sky-500/25 p-2.5 text-center"
                  >
                    <div className="text-[10px] text-slate-400">{item.label}</div>
                    <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{item.val}</div>
                    <div className="text-[9px] text-slate-500 truncate mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative flex gap-5 rounded-2xl border border-sky-500/15 bg-slate-900/50 p-5 sm:p-6 hover:border-sky-400/40 hover:bg-slate-900/80 transition-all shadow-lg"
              >
                <div className="relative shrink-0">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-teal-500/20 border border-sky-500/30 grid place-items-center group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                    <s.icon className="size-6 text-cyan-300" strokeWidth={2} />
                  </div>
                  <div className="mt-2 text-center text-[10px] font-mono font-bold tracking-widest text-sky-400">
                    {s.n}
                  </div>
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-base sm:text-lg font-bold text-white font-display">
                      {s.titleTh}
                    </div>
                    <span className="text-[10px] font-mono rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-sky-300">
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>
                รองรับการทำงานแบบ Offline หลังโหลดหน้าเว็บครั้งแรก ปลอดภัย ไม่มีการจัดเก็บข้อมูลภาพ
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

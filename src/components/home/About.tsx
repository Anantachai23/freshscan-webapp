import { motion } from "motion/react";
import { ShieldCheck, Anchor, Fish, Sparkles, Scale, HeartHandshake, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "ยกระดับความปลอดภัยอาหาร",
    desc: "ลดความเสี่ยงภาวะอาหารเป็นพิษจากสารฮีสตามีน (Scombroid Poisoning) และแบคทีเรีย Vibrio ด้วยเกณฑ์วิเคราะห์ทางชีวภาพที่ตรวจสอบได้",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    icon: Scale,
    title: "มาตรฐานโปร่งใส ตรวจสอบได้",
    desc: "ยึดโยงเกณฑ์การประเมินตาม Quality Index Method (QIM) สากล อธิบายเหตุผลเป็นข้อๆ (Explainable AI) ไม่ตัดสินแบบกล่องดำ",
    accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  },
  {
    icon: Fish,
    title: "ลดการสูญเสียในห่วงโซ่อุปทาน",
    desc: "ประเมินอายุการเก็บรักษาบนน้ำแข็ง (Shelf-Life on Ice) ช่วยให้ร้านค้าและผู้บริโภคจัดสรรการบริโภคได้ตรงตามเวลา ลดขยะอาหาร (Food Waste)",
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    icon: HeartHandshake,
    title: "เข้าถึงง่าย ปราศจากอุปสรรค",
    desc: "เปิดให้ทุกคนในอุตสาหกรรม ทั้งชาวประมง แพปลา ตลาดสด ร้านอาหาร และประชาชน ใช้งานได้ฟรีทันทีโดยไม่ต้องลงทะเบียน",
    accent: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
              <Anchor className="size-3.5 text-cyan-400" />
              OUR COMMITMENT
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              พันธกิจเพื่ออาหารทะเล <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
                ที่สด ใหม่ และปลอดภัยที่สุด
              </span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed">
              FreshScan มุ่งมั่นนำเทคโนโลยีคอมพิวเตอร์วิทัศน์ระดับสูงมาประยุกต์ใช้เพื่อแก้ปัญหาความไม่แน่นอนของคุณภาพอาหารทะเล
              ช่วยสร้างมาตรฐานความโปร่งใสตั้งแต่อ่าวไทยจรดโต๊ะอาหาร
            </p>

            <div className="mt-8 space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                <span>รองรับมาตรฐานอาหาร มกษ. 7001-2550 และ FAO TP 348</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span>ประมวลผล Local บนเครื่องผู้ใช้ 100% ไม่ดึงรูปภาพเก็บไว้</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-sky-400 shrink-0" />
                <span>คำนวณคะแนน Demerits จุดด้อยอย่างแม่นยำ พร้อมคำแนะนำการนำไปปรุงอาหาร</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group rounded-2xl border border-sky-500/15 bg-slate-900/40 p-6 hover:border-cyan-400/40 hover:bg-slate-900/80 transition-all shadow-md"
              >
                <div className={`size-12 rounded-xl border grid place-items-center ${p.accent}`}>
                  <p.icon className="size-6" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display font-bold text-base sm:text-lg text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { About as Team };

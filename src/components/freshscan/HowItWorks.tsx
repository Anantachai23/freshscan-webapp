import { motion } from "motion/react";
import { Camera, Brain, FileBarChart } from "lucide-react";
import fishImg from "@/assets/fish-sample.jpg";

const steps = [
  {
    n: "01",
    icon: Camera,
    title: "ถ่ายภาพอาหารทะเล",
    desc: "เปิดกล้องสมาร์ทโฟนหรืออัปโหลดภาพจากแกลเลอรี รองรับปลา กุ้ง หมึก หอย",
  },
  {
    n: "02",
    icon: Brain,
    title: "วิเคราะห์ภาพภายใน 3 วินาที",
    desc: "ประมวลผลคุณลักษณะสีและพิกเซลจริง ทั้งความใสของตา สีเหงือก/เปลือก รอยช้ำ และความสดของผิวสัมผัส",
  },
  {
    n: "03",
    icon: FileBarChart,
    title: "แสดงผลและคำอธิบาย",
    desc: "บอกเกรดความสด (A/B/C) พร้อม Confidence Score และเหตุผลที่เข้าใจง่าย สำหรับการตัดสินใจ",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32 bg-gradient-to-b from-secondary/40 to-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
              วิธีการทำงาน
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              3 ขั้นตอน ง่ายเหมือนถ่ายรูป
            </h2>
          </div>
          <p className="md:max-w-sm text-muted-foreground">
            ออกแบบให้ใช้งานได้ทั้งบนสมาร์ทโฟนและคอมพิวเตอร์ ไม่ต้องติดตั้งแอป เปิดผ่านเว็บได้ทันที
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-coral/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant aspect-square">
              <img
                src={fishImg}
                alt="ตัวอย่างปลาสด"
                className="size-full object-cover"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute top-4 left-4 glass rounded-xl px-3 py-1.5 text-xs font-medium">
                📷 Sample input
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                {[
                  { label: "ตาใส", val: 96 },
                  { label: "เหงือกแดง", val: 88 },
                  { label: "เนื้อยืดหยุ่น", val: 91 },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="glass rounded-lg px-2.5 py-1.5 text-[10px] font-medium"
                  >
                    <div className="text-muted-foreground">{f.label}</div>
                    <div className="text-grade-a font-bold">{f.val}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-7 top-7 bottom-7 w-px bg-gradient-to-b from-ocean/40 via-ocean/20 to-transparent" />
            <div className="space-y-5">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative flex gap-5 group"
                >
                  <div className="relative shrink-0">
                    <div className="size-14 rounded-2xl bg-ocean-gradient grid place-items-center shadow-card-soft group-hover:shadow-glow transition-shadow">
                      <s.icon className="size-6 text-white" strokeWidth={2.2} />
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="text-xs font-mono text-coral font-bold tracking-widest">
                      STEP {s.n}
                    </div>
                    <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

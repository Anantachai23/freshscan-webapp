import { motion } from "motion/react";
import { Heart, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const commitments = [
  {
    icon: ShieldCheck,
    title: "ยกระดับความปลอดภัย",
    desc: "ลดความเสี่ยงจากอาหารเป็นพิษด้วยการประเมินลักษณะกายภาพเบื้องต้นอย่างแม่นยำและรวดเร็ว",
    color: "bg-ocean-gradient text-white",
  },
  {
    icon: Sparkles,
    title: "เทคโนโลยีที่โปร่งใส",
    desc: "อธิบายเหตุผลและเกณฑ์การประเมินอย่างเปิดเผย (Explainable Cues) เข้าใจง่ายสำหรับทุกคน",
    color: "bg-coral-gradient text-white",
  },
  {
    icon: Heart,
    title: "ลดการสูญเสียอาหาร",
    desc: "ช่วยให้ผู้บริโภคและร้านอาหารวางแผนการปรุงและจัดเก็บวัตถุดิบได้อย่างเหมาะสม ไม่ทิ้งโดยเปล่าประโยชน์",
    color: "bg-seafoam text-ocean-deep",
  },
  {
    icon: CheckCircle2,
    title: "เข้าถึงง่าย ไร้ข้อจำกัด",
    desc: "เปิดใช้งานได้ทันทีบนสมาร์ทโฟนทุกเครื่อง ไม่ต้องดาวน์โหลดแอปและไม่มีระบบล็อกอินกวนใจ",
    color: "bg-ocean-deep text-white",
  },
];

export function Team() {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
              เกี่ยวกับ FreshScan
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              อาหารทะเลสดใหม่
              <br />
              ปลอดภัยสำหรับทุกคน
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              FreshScan ถือกำเนิดขึ้นด้วยความมุ่งมั่นที่จะนำเทคโนโลยีการประมวลผลภาพถ่าย
              มาแก้ไขปัญหาในชีวิตจริง ช่วยให้แม่บ้าน พ่อค้าแม่ค้า และผู้บริโภคทั่วไป
              เลือกซื้อวัตถุดิบคุณภาพได้อย่างมั่นใจ รวดเร็ว และปลอดภัยในทุกมื้ออาหาร
            </p>
            <div className="mt-6 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-ocean" />
                ประเมินเกณฑ์ 20 คะแนนมาตรฐานสากล
              </div>
              <div className="flex items-center gap-2">
                <Heart className="size-4 text-coral" />
                ประมวลผลบนเครื่องของคุณ ไม่เก็บภาพส่วนตัว
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {commitments.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl p-6 border border-border bg-card shadow-card-soft hover:shadow-glow transition-all"
              >
                <div className={`size-12 rounded-2xl grid place-items-center ${c.color}`}>
                  <c.icon className="size-6" />
                </div>
                <div className="mt-4 font-bold text-lg">{c.title}</div>
                <div className="text-sm mt-2 text-muted-foreground leading-relaxed">{c.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

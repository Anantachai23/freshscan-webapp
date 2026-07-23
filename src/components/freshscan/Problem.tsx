import { motion } from "motion/react";
import { HeartPulse, Trash2, Scale } from "lucide-react";

const items = [
  {
    icon: HeartPulse,
    tone: "text-coral",
    bg: "bg-coral/10",
    title: "สุขภาพสาธารณะ",
    stat: "100,000+",
    statLabel: "ผู้ป่วยอาหารเป็นพิษ/ปี",
    desc: "ผู้บริโภคไม่สามารถแยกแยะอาหารทะเลที่เสื่อมคุณภาพด้วยตาเปล่า ส่งผลให้เกิดความเสี่ยงต่อโรคอาหารเป็นพิษอย่างต่อเนื่อง",
  },
  {
    icon: Trash2,
    tone: "text-ocean",
    bg: "bg-ocean/10",
    title: "Food Waste & เศรษฐกิจ",
    stat: "200,000+",
    statLabel: "ล้านบาท มูลค่าตลาดประมง",
    desc: "อาหารทะเลที่เริ่มเสื่อมคุณภาพมักถูกทิ้งโดยไม่ได้ใช้ประโยชน์ สร้างความสูญเสียทั้งระดับครัวเรือนและร้านอาหาร",
  },
  {
    icon: Scale,
    tone: "text-ocean-deep",
    bg: "bg-seafoam/30",
    title: "มาตรฐานการค้า",
    stat: "100,000+",
    statLabel: "ตลาดสดทั่วประเทศ",
    desc: "พ่อค้าแม่ค้าและชาวประมงยังขาดเครื่องมือเป็นกลางในการสื่อสารคุณภาพสินค้า ทำให้เกิดข้อพิพาทเรื่องคุณภาพบ่อยครั้ง",
  },
];

export function Problem() {
  return (
    <section id="problem" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
            ที่มาของปัญหา
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            ความสดเปลี่ยนเร็ว <br className="hidden md:inline" />
            <span className="text-muted-foreground">ความเสี่ยงตามมาทันที</span>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            จากการสำรวจตลาดสดในจังหวัดสมุทรปราการและพื้นที่ใกล้เคียง พบว่า
            ห่วงโซ่อาหารทะเลของไทยยังขาดเครื่องมือมาตรฐานในการประเมินความสด
            ปัญหาแบ่งออกเป็น 3 ด้านที่เชื่อมโยงกัน
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-3xl bg-card border border-border p-7 shadow-card-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`size-12 rounded-2xl ${it.bg} ${it.tone} grid place-items-center`}>
                <it.icon className="size-6" strokeWidth={2.2} />
              </div>
              <h3 className="mt-5 text-xl font-bold">{it.title}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-ocean-deep">{it.stat}</span>
                <span className="text-xs text-muted-foreground">{it.statLabel}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

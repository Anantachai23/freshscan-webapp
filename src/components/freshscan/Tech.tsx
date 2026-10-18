import { motion } from "motion/react";
import { Shield, Eye, Sparkles, Smartphone, Sliders, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    name: "Privacy First",
    title: "ประมวลผลบนเครื่อง ปลอดภัย",
    desc: "วิเคราะห์ภาพถ่ายบนเบราว์เซอร์ของคุณโดยตรง ไม่ส่งภาพส่วนตัวไปเก็บยังเซิร์ฟเวอร์ภายนอก",
  },
  {
    icon: Eye,
    name: "Explainable",
    title: "คำอธิบายโปร่งใส เข้าใจง่าย",
    desc: "บอกเหตุผลและจุดสังเกต (Visual Cues) ชัดเจนว่าทำไมถึงได้เกรดนั้น พร้อมคำแนะนำในการบริโภค",
  },
  {
    icon: Sliders,
    name: "20-Point Rubric",
    title: "เกณฑ์ประเมินละเอียด 20 คะแนน",
    desc: "แยกประเมินคุณลักษณะสำคัญ เช่น ความใสของตา สีเหงือก สีเปลือก และความแน่นของเนื้อ",
  },
  {
    icon: Smartphone,
    name: "Auto Compression",
    title: "รองรับมือถือทุกรุ่น",
    desc: "มีระบบปรับขนาดและบีบอัดภาพถ่ายความละเอียดสูงให้อัตโนมัติ สแกนได้ลื่นไหล ไม่เปลืองเน็ต",
  },
  {
    icon: Sparkles,
    name: "Taxonomy",
    title: "แยกเกณฑ์ 4 หมวดสัตว์น้ำ",
    desc: "วิเคราะห์โดยใช้เกณฑ์เฉพาะทางสำหรับปลา กุ้ง หอย และปลาหมึก เพื่อความแม่นยำสูงสุด",
  },
  {
    icon: CheckCircle,
    name: "Calibration",
    title: "ปรับเทียบด้วยข้อมูลจริง",
    desc: "รองรับการ Calibrate ค่าเฉลี่ยพิกเซลด้วยชุดภาพอ้างอิงจริง เพื่อความเที่ยงตรงในทุกสภาพแสง",
  },
];

export function Tech() {
  return (
    <section id="tech" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
            จุดเด่นและเทคโนโลยี
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            ออกแบบเพื่อความแม่นยำ
            <br />
            และเป็นส่วนตัว
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            ผสานเทคโนโลยีการวิเคราะห์ภาพถ่ายเข้ากับหลักเกณฑ์การตรวจสอบอาหารทะเลระดับสากล
            เพื่อให้ทุกคนตรวจสอบความสดได้ง่ายดายและมั่นใจ
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group rounded-2xl p-6 border border-border bg-card hover:border-ocean/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl bg-secondary text-ocean-deep grid place-items-center group-hover:bg-ocean-gradient group-hover:text-white transition-colors">
                  <s.icon className="size-5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.name}
                </span>
              </div>
              <div className="mt-5 font-display font-bold text-lg">{s.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

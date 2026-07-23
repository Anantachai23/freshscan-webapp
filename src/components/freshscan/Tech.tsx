import { motion } from "motion/react";
import { Code2, Cpu, Database, Container, Globe, Layers } from "lucide-react";

const stack = [
  { icon: Globe, name: "Frontend", tech: "React + TypeScript", reason: "Component-based, type safety, ecosystem ใหญ่" },
  { icon: Code2, name: "Backend", tech: "FastAPI (Python)", reason: "ทำงานร่วมกับ ML libraries ได้ดี รวดเร็ว" },
  { icon: Cpu, name: "ML Framework", tech: "PyTorch + EfficientNet-B0", reason: "ขนาดเล็ก แม่นยำ ใช้กับ Transfer Learning" },
  { icon: Database, name: "Database", tech: "SQLite + SQLAlchemy", reason: "ไม่ต้อง setup server เพียงพอสำหรับ MVP" },
  { icon: Container, name: "Deployment", tech: "Docker + Compose", reason: "รันได้ทุกเครื่อง ง่ายต่อการ deploy" },
  { icon: Layers, name: "Image Processing", tech: "OpenCV + Pillow", reason: "จัดการภาพ ทำ augmentation และ preprocessing" },
];

export function Tech() {
  return (
    <section id="tech" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
            สถาปัตยกรรมระบบ
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
            เทคโนโลยีที่เลือกใช้
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            เลือกเครื่องมือที่เหมาะกับขอบเขต MVP — เสถียร พัฒนาเร็ว และพร้อมต่อยอดในอนาคต
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stack.map((s, i) => (
            <motion.div
              key={s.name}
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
              <div className="mt-5 font-display font-bold text-lg">{s.tech}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

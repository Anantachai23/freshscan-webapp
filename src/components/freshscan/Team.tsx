import { motion } from "motion/react";
import { GraduationCap, MapPin } from "lucide-react";

const members = [
  { name: "นาย อนันตชัย สายสิญจน์", role: "ผู้พัฒนา · ML Engineer" },
  { name: "นาย วิชญ์ วิโนทัย", role: "ผู้พัฒนา · Frontend" },
  { name: "นาย รัฐภูมิ ศุภกิจอำนวย", role: "ผู้พัฒนา · Backend" },
  { name: "นาย ธนพล เจริญเนตร", role: "อาจารย์ที่ปรึกษาโครงการ", advisor: true },
];

function avatarColor(i: number) {
  return ["bg-ocean-gradient", "bg-coral-gradient", "bg-seafoam", "bg-ocean-deep"][i % 4];
}

export function Team() {
  return (
    <section id="team" className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-coral font-semibold">
              ทีมพัฒนา
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              นักเรียน<br />ผู้สร้างสรรค์
            </h2>
            <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-ocean" />
                โรงเรียนเทพศิรินทร์ สมุทรปราการ
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-ocean" />
                จังหวัดสมุทรปราการ
              </div>
            </div>
            <div className="mt-8 inline-block rounded-2xl border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">รหัสโครงการ</div>
              <div className="font-mono font-bold text-lg mt-1">28P23W01274</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {members.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`rounded-2xl p-6 border ${
                  m.advisor ? "bg-ocean-deep text-white border-ocean-deep" : "bg-card border-border"
                }`}
              >
                <div
                  className={`size-12 rounded-2xl grid place-items-center font-display font-bold text-white ${avatarColor(
                    i,
                  )}`}
                >
                  {m.name.split(" ").slice(-1)[0]?.[0]}
                </div>
                <div className="mt-4 font-bold">{m.name}</div>
                <div className={`text-sm mt-1 ${m.advisor ? "text-white/70" : "text-muted-foreground"}`}>
                  {m.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

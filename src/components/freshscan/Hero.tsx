import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Camera } from "lucide-react";
import hero from "@/assets/hero-seafood.jpg";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-hero overflow-hidden">
      {/* decorative grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,oklch(0.28_0.08_240)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.28_0.08_240)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-ocean/20 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-ocean-deep"
          >
            <Sparkles className="size-3.5 text-coral" />
            นวัตกรรม AI ช่วยตรวจประเมินคุณภาพอาหารทะเล
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight"
          >
            ประเมิน<span className="text-gradient-ocean">ความสด</span>
            <br />
            อาหารทะเล
            <br />
            <span className="relative inline-block">
              ใน 3 วินาที
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 8 Q 80 2, 150 7 T 298 5"
                  stroke="var(--coral)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            ถ่ายภาพจากสมาร์ทโฟน แล้วให้ระบบวิเคราะห์ระดับความสด เกรด A / B / C
            พร้อมเหตุผลและคำแนะนำทันที ช่วยเลือกซื้อวัตถุดิบคุณภาพ คุ้มราคา และปลอดภัยต่อสุขภาพ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 bg-ocean-gradient text-white px-6 py-3.5 rounded-xl font-medium shadow-elegant hover:shadow-glow transition-all"
            >
              <Camera className="size-4.5" />
              เริ่มวิเคราะห์ทันที
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-border bg-white/70 hover:bg-white transition"
            >
              ดูวิธีการทำงาน
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-5"
          >
            {[
              { k: "4 หมวด", v: "ปลา · กุ้ง · หอย · หมึก" },
              { k: "< 3s", v: "วิเคราะห์ผลทันใจ" },
              { k: "20 คะแนน", v: "เกณฑ์ประเมินละเอียด" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl font-bold font-display text-ocean-deep">{s.k}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-ocean-gradient opacity-20 blur-3xl rounded-full" />
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant border border-white/40">
            <img
              src={hero}
              alt="อาหารทะเลสดบนน้ำแข็ง"
              className="size-full object-cover"
              width={1600}
              height={1200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/40 via-transparent to-transparent" />

            {/* floating result card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute left-5 right-5 bottom-5 glass rounded-2xl p-4 shadow-card-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    ผลการวิเคราะห์
                  </div>
                  <div className="font-display font-bold text-lg mt-0.5">
                    ปลาทู · เกรด A · สดมาก
                  </div>
                </div>
                <div className="size-12 rounded-2xl grid place-items-center bg-grade-a text-white font-display font-bold text-xl shadow-card-soft">
                  A
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="h-full bg-grade-a"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>Confidence</span>
                <span className="font-semibold text-foreground">92%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

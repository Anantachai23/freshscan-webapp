import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import heroImg from "@/assets/hero-seafood.jpg";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-slate-950 overflow-hidden text-white">
      {/* Oceanic Ambient Light & Hydrodynamic Gradients */}
      <div
        aria-hidden
        className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-transparent blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-blue-700/15 via-teal-500/10 to-transparent blur-[140px] pointer-events-none"
      />

      {/* Nautical Grid Lines */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] [background-size:64px_64px] pointer-events-none"
      />

      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
        {/* Left Column: Headlines & CTA */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-sky-500/30 bg-sky-950/40 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-sky-300 shadow-inner shadow-sky-500/20"
          >
            <span className="flex size-2 rounded-full bg-sky-400 animate-ping" />
            <Sparkles className="size-3.5 text-cyan-300" />
            <span>เทคโนโลยีตรวจประเมินคุณภาพอาหารทะเลด้วย QIM & Computer Vision</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight font-display text-white"
          >
            มาตรฐานตรวจวัด
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              ความสดอาหารทะเล
            </span>
            <br />
            ระดับห้องปฏิบัติการ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal"
          >
            วิเคราะห์ความสดจากภาพถ่ายด้วยเกณฑ์มาตรฐานสากล{" "}
            <strong className="text-white font-semibold">Quality Index Method (QIM)</strong> และ{" "}
            <strong className="text-white font-semibold">มกษ. 7001-2550</strong> ประเมินความใสของดวงตา
            สีเหงือก การกระจายของเม็ดสี และดัชนีการเกิดจุดดำ (Melanosis) ภายใน 2 วินาทีบนเบราว์เซอร์
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4 items-center"
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:via-cyan-400 hover:to-blue-500 text-white px-7 py-4 rounded-2xl font-semibold text-sm shadow-xl shadow-cyan-900/40 hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="size-4.5" />
              <span>เริ่มตรวจวัดวัตถุดิบทันที</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#qim-standards"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-medium text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all backdrop-blur-md"
            >
              <span>ศึกษาเกณฑ์มาตรฐาน QIM</span>
              <ChevronRight className="size-4 text-slate-400" />
            </a>
          </motion.div>

          {/* Trust Metric Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6"
          >
            <div>
              <div className="font-display font-extrabold text-2xl lg:text-3xl text-sky-400">
                4 หมวด
              </div>
              <div className="text-xs text-slate-400 mt-1">ปลา · กุ้ง · หมึก · หอย</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl lg:text-3xl text-cyan-400">
                &lt; 2.0s
              </div>
              <div className="text-xs text-slate-400 mt-1">ประมวลผลทันใจบนเครื่อง</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl lg:text-3xl text-teal-400">
                0–20 Pt
              </div>
              <div className="text-xs text-slate-400 mt-1">สเกล Demerit สากล</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: High-Tech Seafood HUD Simulator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Subtle glowing halo behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-70" />

          <div className="relative rounded-3xl border border-sky-500/30 bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl shadow-sky-950/60 overflow-hidden">
            {/* Header of HUD */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 text-sky-400 font-semibold tracking-wide uppercase">
                <Activity className="size-4 animate-pulse" />
                <span>QIM Spectrum Sensor Live</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Sample: Rastrelliger brachysoma</span>
            </div>

            {/* Photo with Overlay Cues */}
            <div className="relative mt-4 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group">
              <img
                src={heroImg}
                alt="อาหารทะเลสดคุณภาพสูงบนเกล็ดน้ำแข็ง"
                className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                width={800}
                height={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Sonar Crosshairs HUD */}
              <div className="absolute top-4 left-4 p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-sky-300 font-mono flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>EYE_CORNEA: OPTIMAL (0 Demerit)</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Sashimi Grade Compatible
                  </span>
                  <div className="mt-1 font-display font-bold text-lg text-white">
                    ปลาทูอ่าวไทยคัดพิเศษ
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    Freshness Index
                  </div>
                  <div className="font-display font-extrabold text-2xl text-sky-400">96.5%</div>
                </div>
              </div>
            </div>

            {/* QIM Diagnostic Breakdown Bar */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>ความใสของกระจกตา</span>
                  <span className="text-emerald-400 font-semibold">ใสสมบูรณ์</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[96%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>สีเหงือก (Oxyhemoglobin)</span>
                  <span className="text-emerald-400 font-semibold">แดงสด</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>ความแวววาวของเกล็ด</span>
                  <span className="text-sky-400 font-semibold">ประกายสีเงิน</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full w-[98%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>ดัชนี QIM Demerit</span>
                  <span className="text-sky-300 font-bold">1.0 / 20</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[95%]" />
                </div>
              </div>
            </div>

            {/* Bottom Recommendation Banner */}
            <div className="mt-4 p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                <span>เกรด A: เหมาะสำหรับประกอบอาหารทุกประเภท</span>
              </div>
              <Link to="/analyze" className="text-sky-400 hover:text-sky-300 font-medium">
                ลองสแกนรูปของคุณ &rarr;
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Camera, ArrowDown, Sparkles, ShieldCheck, Zap, Fish, CircleDot, Shell } from "lucide-react";
import heroImg from "@/assets/hero-seafood.jpg";

export function Hero() {
  const scrollToRealms = () => {
    const el = document.getElementById("realms");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-slate-950 text-slate-100">
      {/* Surface Sunlight Caustic Shimmer */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-sky-400/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Radial Sonar Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-[1.1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Punchy, High-Impact Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40"
            >
              <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SURFACE 0M · FRESHSCAN MARINE™</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]"
            >
              สแกนความสดจากทะเลลึก <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
                สู่จานอาหารใน 1 วินาที
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl"
            >
              ระบบ AI ตรวจวัดคุณภาพชีวภาพและระดับความสดมาตรฐานสากล สำหรับ{" "}
              <b className="text-cyan-300 font-semibold">ปลา · กุ้ง · หมึก · หอย</b>{" "}
              ประมวลผลทันทีบนอุปกรณ์ของคุณ ปลอดภัย 100% ไม่ต้องติดตั้งแอป
            </motion.p>

            {/* Quick action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 px-7 py-4 text-base font-bold text-slate-950 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Camera className="size-5" />
                <span>เปิดกล้องสแกนความสด</span>
              </Link>

              <button
                onClick={scrollToRealms}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-500/30 bg-slate-900/80 px-6 py-4 text-sm font-semibold text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-slate-900 transition-all"
              >
                <span>ดำดิ่งสู่โลกใต้ทะเล</span>
                <ArrowDown className="size-4 text-cyan-400 animate-bounce" />
              </button>
            </motion.div>

            {/* 3 Value Pillars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 pt-6 border-t border-sky-500/15 grid grid-cols-3 gap-3 text-xs text-slate-400"
            >
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-cyan-400 shrink-0" />
                <span>ประมวลผล &lt; 0.8 วินาที</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
                <span>100% ปลอดภัย ไม่เก็บภาพ</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-sky-400 shrink-0" />
                <span>มาตรฐาน QIM ยุโรป</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Seafood Showcase with Scanning HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Outer Oceanic Glow Ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-teal-500/30 rounded-3xl blur-2xl opacity-60" />

            <div className="relative rounded-3xl overflow-hidden border-2 border-sky-500/30 bg-slate-900 shadow-2xl shadow-sky-950/80 aspect-[16/10]">
              <img
                src={heroImg}
                alt="อาหารทะเลสด ปลา กุ้ง หมึก หอย คุณภาพสูง"
                className="size-full object-cover brightness-95 contrast-105"
                width={1280}
                height={800}
              />

              {/* Sonar Scan Line Animation Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none animate-pulse" />

              {/* Top Glass Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 px-3 py-1.5 text-xs text-cyan-300 font-mono flex items-center gap-2 shadow-lg">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>QIM 2.0 BIOMARKER MATRIX</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 backdrop-blur-md border border-sky-500/30 px-3 py-1.5 text-xs text-slate-300 font-mono">
                  GRADE A · EXTRA FRESH
                </div>
              </div>

              {/* 4 Real-time Biomarker Overlay Badges */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 pointer-events-none">
                {[
                  { name: "ปลา", note: "ตาใสนูน 98%", color: "#38bdf8" },
                  { name: "กุ้ง", note: "ไร้จุดดำ 100%", color: "#06b6d4" },
                  { name: "หมึก", note: "เม็ดสีสด 96%", color: "#818cf8" },
                  { name: "หอย", note: "ฝาปิดแน่น 99%", color: "#10b981" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-slate-950/85 backdrop-blur-md border border-sky-500/25 p-2 text-center"
                  >
                    <div className="text-[10px] text-slate-400 font-medium">{item.name}</div>
                    <div
                      className="text-[11px] font-bold font-mono truncate mt-0.5"
                      style={{ color: item.color }}
                    >
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

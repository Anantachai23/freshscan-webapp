import { Link } from "@tanstack/react-router";
import { Camera, Sparkles, ArrowRight, Anchor } from "lucide-react";

export function OceanAbyssCTA() {
  return (
    <section className="relative py-28 md:py-36 bg-slate-950 text-slate-100 overflow-hidden border-t border-sky-500/10">
      {/* Bioluminescent Deep Trench Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/15 via-sky-500/10 to-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
          <Anchor className="size-3.5 text-teal-400" />
          DEPTH: 3,000M · HADAL OCEAN FLOOR
        </div>

        <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
          พร้อมสัมผัสความสดระดับพรีเมียม <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
            ด้วยตัวคุณเองแล้วหรือยัง?
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
          ตรวจสอบความสดของปลา กุ้ง หมึก หอย ได้ทันทีผ่านเบราว์เซอร์
          รับผลประเมินจุดด้อย QIM เกรดความสด และคำแนะนำการปรุงอาหารในเสี้ยววินาที
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 px-8 py-4 font-extrabold text-slate-950 text-base shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Camera className="size-5" />
            <span>เปิดกล้องสแกนอาหารทะเลทันที</span>
          </Link>
          <Link
            to="/species"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-500/30 bg-slate-900/80 px-6 py-4 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-900 transition-all"
          >
            <span>ดูคู่มือ 4 สัตว์น้ำเศรษฐกิจ</span>
            <ArrowRight className="size-4 text-cyan-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}

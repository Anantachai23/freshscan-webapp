import { Link } from "@tanstack/react-router";
import { Fish, Camera, ShieldCheck, Compass, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { href: "/analyze", label: "วิเคราะห์ความสด", isRoute: true },
  { href: "/species", label: "ฐานข้อมูลสายพันธุ์", isRoute: true },
  { href: "/dataset", label: "เกณฑ์มาตรฐาน QIM", isRoute: true },
  { href: "/#qim-standards", label: "หลักการตรวจวัด", isRoute: false },
  { href: "/#tech-architecture", label: "สถาปัตยกรรมระบบ", isRoute: false },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
    >
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-cyan-950/20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative size-10 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/25 group-hover:shadow-sky-400/40 transition-shadow">
              <div className="size-full bg-slate-950 rounded-[10px] grid place-items-center">
                <Fish className="size-5 text-sky-400 group-hover:scale-110 transition-transform" strokeWidth={2.2} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">
                  FreshScan<span className="text-sky-400 font-light">Marine</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  QIM 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ระบบตรวจประเมินคุณภาพอาหารทะเลมาตรฐานสากล
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all [&.active]:bg-sky-500/20 [&.active]:text-sky-300 [&.active]:border [&.active]:border-sky-500/30"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/analyze"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:via-cyan-400 hover:to-blue-500 shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Camera className="size-3.5" />
              <span>เริ่มตรวจวัดความสด</span>
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

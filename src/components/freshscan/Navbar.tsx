import { Link } from "@tanstack/react-router";
import { Fish, Camera } from "lucide-react";
import { motion } from "motion/react";

const links = [
  { href: "#problem", label: "ประโยชน์" },
  { href: "#how", label: "วิธีใช้งาน" },
  { href: "#tech", label: "เทคโนโลยี" },
  { href: "#standards", label: "เกณฑ์ประเมิน" },
  { href: "#about", label: "เกี่ยวกับเรา" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-card-soft">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-ocean-gradient grid place-items-center shadow-glow">
              <Fish className="size-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight">FreshScan</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Seafood AI</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-foreground/70 hover:text-foreground transition-colors relative group"
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-ocean transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/species"
              className="hidden sm:inline-flex text-sm font-medium px-3.5 py-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-secondary transition"
            >
              คู่มือเลือกอาหารทะเล
            </Link>

            <Link
              to="/analyze"
              className="inline-flex items-center gap-1.5 bg-ocean-gradient text-white text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-card-soft"
            >
              <Camera className="size-3.5" />
              วิเคราะห์ความสดฟรี
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

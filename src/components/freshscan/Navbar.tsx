import { Link } from "@tanstack/react-router";
import { Fish, LogIn, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "#problem", label: "ปัญหา" },
  { href: "#how", label: "วิธีการทำงาน" },
  { href: "#tech", label: "เทคโนโลยี" },
  { href: "#stats", label: "ผลลัพธ์" },
  { href: "#team", label: "ทีมงาน" },
];

export function Navbar() {
  const { user, isAdmin, signOut, loading } = useAuth();

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
              <div className="text-[10px] text-muted-foreground -mt-0.5">NSC2026</div>
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

          <div className="flex items-center gap-2">
            <Link
              to="/species"
              className="hidden sm:inline-flex text-sm font-medium px-3 py-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-secondary transition"
            >
              ชนิดปลา
            </Link>
            <Link
              to="/dataset"
              className="hidden sm:inline-flex text-sm font-medium px-3 py-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-secondary transition"
            >
              Dataset
            </Link>

            {!loading && user ? (
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-white/70 px-2.5 py-1.5">
                <div className="size-6 rounded-lg bg-ocean-gradient grid place-items-center text-white text-[10px] font-bold">
                  {(user.email ?? "?").charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-foreground/80 max-w-[110px] truncate">
                  {user.email}
                </span>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-md px-1.5 py-0.5">
                    <ShieldCheck className="size-3" /> admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground/60 bg-secondary rounded-md px-1.5 py-0.5">
                    <UserIcon className="size-3" /> member
                  </span>
                )}
                <button
                  onClick={() => signOut()}
                  className="ml-1 text-foreground/60 hover:text-foreground transition"
                  aria-label="ออกจากระบบ"
                  title="ออกจากระบบ"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              !loading && (
                <Link
                  to="/auth"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border border-border text-foreground/80 hover:bg-secondary transition"
                >
                  <LogIn className="size-3.5" /> เข้าสู่ระบบ
                </Link>
              )
            )}

            <Link
              to="/analyze"
              className="bg-ocean-gradient text-white text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-card-soft"
            >
              วิเคราะห์ทันที
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

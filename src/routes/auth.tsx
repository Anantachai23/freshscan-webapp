import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Fish, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "เข้าสู่ระบบ / สมัครสมาชิก · FreshScan" },
      {
        name: "description",
        content: "เข้าสู่ระบบหรือสมัครสมาชิก FreshScan สำหรับผู้ใช้งานทั่วไป",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        setNotice("สมัครสำเร็จ — เราได้ส่งอีเมลยืนยันไปที่ " + email + " กรุณาเช็กกล่องจดหมายเพื่อยืนยันบัญชี");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setNotice("ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ " + email + " แล้ว กรุณาเช็กกล่องจดหมาย");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth" },
    });
    if (error) {
      setError(error.message ?? "Google sign-in ไม่สำเร็จ");
      setBusy(false);
    }
    // On success Supabase redirects the browser to Google, then back to
    // redirectTo above — no further action needed here.
  };

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> กลับหน้าแรก
          </Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card-soft"
        >
          <div className="flex flex-col items-center text-center">
            <div className="size-12 rounded-2xl bg-ocean-gradient grid place-items-center shadow-glow">
              <Fish className="size-6 text-white" strokeWidth={2.4} />
            </div>
            <h1 className="mt-4 font-display font-bold text-2xl tracking-tight">
              เข้าสู่ระบบผู้ใช้งาน
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              สมัครหรือเข้าสู่ระบบเพื่อวิเคราะห์ความสดและดูข้อมูลชนิดสัตว์น้ำ
            </p>
          </div>

          <button
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium hover:bg-secondary transition disabled:opacity-60"
          >
            <GoogleIcon /> ดำเนินการต่อด้วย Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> หรือ <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={onEmailSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล"
                className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ocean/30"
              />
            </div>
            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ocean/30"
                />
              </div>
            )}

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-xs text-ocean-deep hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
            )}
            {notice && (
              <div className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-gradient text-white px-4 py-2.5 text-sm font-medium shadow-card-soft hover:opacity-95 transition disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin"
                ? "เข้าสู่ระบบ"
                : mode === "signup"
                  ? "สมัครสมาชิก"
                  : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "forgot" ? (
              <button
                onClick={() => {
                  setMode("signin");
                  setError(null);
                  setNotice(null);
                }}
                className="text-ocean-deep font-medium hover:underline"
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            ) : (
              <>
                {mode === "signin" ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
                <button
                  onClick={() => {
                    setMode(mode === "signin" ? "signup" : "signin");
                    setError(null);
                    setNotice(null);
                  }}
                  className="text-ocean-deep font-medium hover:underline"
                >
                  {mode === "signin" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
                </button>
              </>
            )}
          </div>


          <p className="mt-5 text-[11px] text-muted-foreground text-center leading-relaxed">
            การเข้าสู่ระบบของคุณปลอดภัยด้วยการเข้ารหัสมาตรฐานอุตสาหกรรม
          </p>
        </motion.div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12A6.98 6.98 0 0 1 5.47 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.96l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

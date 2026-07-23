import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Fish, ArrowLeft, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "ตั้งรหัสผ่านใหม่ · FreshScan" },
      { name: "description", content: "ตั้งรหัสผ่านใหม่สำหรับบัญชี FreshScan" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase recovery link sets a session via detectSessionInUrl.
    // Also listen for the PASSWORD_RECOVERY event.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (password !== confirm) return setError("รหัสผ่านไม่ตรงกัน");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => navigate({ to: "/auth" }), 2000);
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
              ตั้งรหัสผ่านใหม่
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              กรุณากรอกรหัสผ่านใหม่ของคุณ
            </p>
          </div>

          {done ? (
            <div className="mt-6 flex flex-col items-center text-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-6">
              <CheckCircle2 className="size-8" />
              <div className="text-sm font-medium">เปลี่ยนรหัสผ่านสำเร็จ</div>
              <div className="text-xs">กำลังพาไปหน้าเข้าสู่ระบบ…</div>
            </div>
          ) : !ready ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Loader2 className="mx-auto size-5 animate-spin mb-2" />
              กำลังตรวจสอบลิงก์รีเซ็ตรหัสผ่าน…
              <div className="mt-3 text-xs">
                หากเปิดหน้านี้โดยไม่มีลิงก์จากอีเมล กรุณา
                <Link to="/auth" className="text-ocean-deep font-medium hover:underline ml-1">
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                  className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ocean/30"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ocean/30"
                />
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-gradient text-white px-4 py-2.5 text-sm font-medium shadow-card-soft hover:opacity-95 transition disabled:opacity-60"
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                ยืนยันรหัสผ่านใหม่
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}

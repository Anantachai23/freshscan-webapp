import { useMemo } from "react";

export function OceanAmbience() {
  // Generate random bubbles with varying sizes, speeds, and positions
  const bubbles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 14) + 6, // 6px to 20px
      left: Math.floor(Math.random() * 96) + 2, // 2% to 98%
      delay: (Math.random() * 12).toFixed(2),
      duration: (Math.random() * 10 + 10).toFixed(2), // 10s to 20s
      opacity: (Math.random() * 0.4 + 0.2).toFixed(2),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sunlight Caustic Shimmer in Upper Sunlight Zone */}
      <div className="absolute -top-32 left-0 right-0 h-[480px] bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl animate-caustic pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-3/4 h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Deep Ocean Ambient Gradients */}
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[1600px] -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[2400px] left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Animated Bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full border border-cyan-300/40 bg-gradient-to-tr from-cyan-400/20 to-white/40 shadow-sm backdrop-blur-[1px]"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${b.delay}s infinite`,
          }}
        >
          {/* Bubble highlight reflection */}
          <div className="absolute top-1 left-1 size-1 rounded-full bg-white/70" />
        </div>
      ))}
    </div>
  );
}

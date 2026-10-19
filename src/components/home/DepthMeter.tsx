import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Waves, ArrowDown, ChevronDown } from "lucide-react";

interface OceanZone {
  nameTh: string;
  nameEn: string;
  depthRange: string;
  color: string;
}

const ZONES: { minDepth: number; maxDepth: number; zone: OceanZone }[] = [
  {
    minDepth: 0,
    maxDepth: 100,
    zone: {
      nameTh: "เขตแสงแดดส่องถึง (Sunlight Zone)",
      nameEn: "Epipelagic Zone",
      depthRange: "0 – 100 m",
      color: "#38bdf8", // Sky blue
    },
  },
  {
    minDepth: 100,
    maxDepth: 400,
    zone: {
      nameTh: "เขตสนธยา (Twilight Zone)",
      nameEn: "Mesopelagic Zone",
      depthRange: "100 – 400 m",
      color: "#06b6d4", // Cyan
    },
  },
  {
    minDepth: 400,
    maxDepth: 1200,
    zone: {
      nameTh: "เขตเที่ยงคืน (Midnight Zone)",
      nameEn: "Bathypelagic Zone",
      depthRange: "400 – 1,200 m",
      color: "#818cf8", // Indigo/Electric
    },
  },
  {
    minDepth: 1200,
    maxDepth: 3500,
    zone: {
      nameTh: "ห้วงสมุทรลึก (Abyssal Zone)",
      nameEn: "Abyssopelagic Zone",
      depthRange: "1,200 – 3,000+ m",
      color: "#10b981", // Bioluminescent emerald
    },
  },
];

export function DepthMeter() {
  const [depth, setDepth] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      setMaxScroll(totalHeight);
      
      // Calculate depth from 0m to 3,000m based on scroll progress
      const calculatedDepth = Math.round(progress * 3000);
      setDepth(calculatedDepth);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentZone =
    ZONES.find((z) => depth >= z.minDepth && depth <= z.maxDepth)?.zone ?? ZONES[ZONES.length - 1].zone;

  const scrollToZone = (targetPercent: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: totalHeight * targetPercent,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Floating HUD Widget on Desktop (Right Side) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3 pointer-events-auto">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="rounded-2xl border border-sky-500/25 bg-slate-950/80 backdrop-blur-xl p-3 shadow-2xl shadow-sky-950/80 transition-all cursor-pointer group"
          style={{
            borderColor: `${currentZone.color}40`,
            boxShadow: `0 0 25px ${currentZone.color}20`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                DEPTH GAUGE
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className="font-mono font-bold text-2xl transition-colors duration-300"
                  style={{ color: currentZone.color }}
                >
                  {depth.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-400">M</span>
              </div>
            </div>

            <div
              className="size-10 rounded-xl grid place-items-center transition-all duration-300 border"
              style={{
                backgroundColor: `${currentZone.color}15`,
                borderColor: `${currentZone.color}40`,
              }}
            >
              <Compass
                className="size-5 transition-transform duration-500"
                style={{
                  color: currentZone.color,
                  transform: `rotate(${Math.min(360, (depth / 3000) * 360)}deg)`,
                }}
              />
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-sky-500/15 flex items-center justify-between text-[11px] gap-2">
            <span className="text-slate-300 font-medium truncate max-w-[140px]">
              {currentZone.nameTh.split(" ")[0]}
            </span>
            <span
              className="font-mono text-[10px] rounded px-1.5 py-0.5"
              style={{
                backgroundColor: `${currentZone.color}20`,
                color: currentZone.color,
              }}
            >
              {currentZone.depthRange}
            </span>
          </div>

          {/* Expanded quick-dive elevator on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-sky-500/20 space-y-1.5"
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Quick Dive Zones:
                </div>
                {[
                  { label: "0m · ผิวน้ำ (Surface)", pct: 0 },
                  { label: "300m · 4 สัตว์น้ำ (Realms)", pct: 0.25 },
                  { label: "1,000m · ห้องสแกน (Scanner)", pct: 0.55 },
                  { label: "2,500m · ห้วงสมุทร (Vault)", pct: 0.85 },
                ].map((z, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToZone(z.pct)}
                    className="w-full text-left px-2 py-1 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-sky-500/20 transition flex items-center justify-between"
                  >
                    <span>{z.label}</span>
                    <ArrowDown className="size-3 text-cyan-400 opacity-60" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Compact Mobile Depth Pill (Fixed at bottom right) */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden pointer-events-auto">
        <div
          className="rounded-full border border-sky-500/30 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 shadow-xl flex items-center gap-2"
          style={{ borderColor: `${currentZone.color}50` }}
        >
          <Waves className="size-3.5" style={{ color: currentZone.color }} />
          <span className="font-mono font-bold text-xs" style={{ color: currentZone.color }}>
            {depth} m
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
            {currentZone.nameTh.split(" ")[0]}
          </span>
        </div>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/layout";
import {
  DepthMeter,
  OceanAmbience,
  OceanicPortalExperience,
  OceanRealms,
  AbyssalScanner,
  ColdChainVault,
  OceanAbyssCTA,
} from "@/components/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan Marine™ — ดำดิ่งสู่มาตรฐานตรวจวัดความสดอาหารทะเลระดับสากลด้วย AI" },
      {
        name: "description",
        content:
          "สัมผัสประสบการณ์ดำดิ่งใต้สมุทรและระบบตรวจวัดความสดอาหารทะเลระดับสากลสำหรับ ปลา กุ้ง หมึก หอย ด้วย AI & QIM ประมวลผลรวดเร็ว แม่นยำใน 1 วินาที",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Underwater Atmosphere: Floating bubbles & sunlight rays */}
      <OceanAmbience />

      {/* Interactive Depth Gauge HUD (Tracks scroll from 0m to 3000m) */}
      <DepthMeter />

      {/* Navigation Header */}
      <Navbar />

      <main className="relative z-10">
        {/* Depth 0m: The 3D Oceanic Portal Landing Experience */}
        <OceanicPortalExperience />

        {/* Depth 100m – 600m: The 4 Oceanic Realms (ปลา, กุ้ง, หมึก, หอย) */}
        <OceanRealms />


        {/* Depth 800m – 1,500m: The Abyssal Edge Scanning Chamber */}
        <AbyssalScanner />

        {/* Depth 2,000m – 2,800m: The Cold-Chain & Safety Vault */}
        <ColdChainVault />

        {/* Depth 3,000m: The Hadal Trench Launch Portal */}
        <OceanAbyssCTA />
      </main>

      <Footer />
    </div>
  );
}

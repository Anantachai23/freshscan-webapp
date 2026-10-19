import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/layout";
import {
  DepthMeter,
  OceanAmbience,
  Hero,
  OceanRealms,
  AbyssalScanner,
  ColdChainVault,
  OceanAbyssCTA,
} from "@/components/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan Marine™ — AI Seafood Freshness Scanner" },
      {
        name: "description",
        content:
          "ระบบ AI ตรวจวัดคุณภาพชีวภาพและระดับความสดอาหารทะเล ปลา กุ้ง หมึก หอย ตามมาตรฐานสากล QIM และ TAS 7001 ประมวลผลทันทีในเบราว์เซอร์ ปลอดภัย 100%",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* 2. Floating Interactive Oceanic Depth Meter */}
      <DepthMeter />

      {/* 3. Deep Sea Ambient Canvas & Floating Particles */}
      <OceanAmbience />

      {/* 4. Surface Hero Section with AI Seafood Scan HUD */}
      <Hero />

      {/* 5. 4 Oceanic Species Realms (Fish, Shrimp, Squid, Shellfish) */}
      <OceanRealms />

      {/* 6. 3-Step Abyssal Scanner Process */}
      <AbyssalScanner />

      {/* 7. Cold-Chain & QIM Standards Vault */}
      <ColdChainVault />

      {/* 8. Deep Sea Hadal CTA Section */}
      <OceanAbyssCTA />

      {/* 9. Comprehensive Oceanic Footer */}
      <Footer />
    </div>
  );
}

export default Index;

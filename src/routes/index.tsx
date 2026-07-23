import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/freshscan/Navbar";
import { Hero } from "@/components/freshscan/Hero";
import { Problem } from "@/components/freshscan/Problem";
import { HowItWorks } from "@/components/freshscan/HowItWorks";
import { Tech } from "@/components/freshscan/Tech";
import { Stats } from "@/components/freshscan/Stats";
import { Team } from "@/components/freshscan/Team";
import { Footer } from "@/components/freshscan/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan — ประเมินความสดอาหารทะเลด้วย AI" },
      {
        name: "description",
        content:
          "ระบบ AI วิเคราะห์ความสดของอาหารทะเลจากภาพถ่ายสมาร์ทโฟน ภายใน 3 วินาที ช่วยลด Food Waste และปกป้องสุขภาพผู้บริโภค",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Tech />
        <Stats />
        <Team />
      </main>
      <Footer />
    </div>
  );
}

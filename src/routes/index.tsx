import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/layout";
import { Hero, QIMStandards, HowItWorks, Tech, Stats, About } from "@/components/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan Marine™ — มาตรฐานตรวจวัดความสดอาหารทะเลระดับสากลด้วย AI & QIM" },
      {
        name: "description",
        content:
          "ระบบประเมินความสดอาหารทะเลระดับมืออาชีพตามมาตรฐาน Quality Index Method (QIM) และ TAS 7001-2550 ประมวลผลภาพถ่ายแบบ Edge Computer Vision ภายในเสี้ยววินาที",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main>
        <Hero />
        <QIMStandards />
        <HowItWorks />
        <Tech />
        <Stats />
        <About />
      </main>
      <Footer />
    </div>
  );
}

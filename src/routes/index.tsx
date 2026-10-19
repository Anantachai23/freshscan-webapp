import { createFileRoute } from "@tanstack/react-router";
import { NeuralOceanHero } from "@/components/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan Marine™ — AI Seafood Freshness Scanner" },
      {
        name: "description",
        content:
          "Professional-grade AI seafood freshness assessment. Analyze fish, shrimp, squid, and shellfish quality instantly using QIM standards. Processed on-device, 100% private.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#02060f] text-white select-none">
      <NeuralOceanHero />
    </div>
  );
}

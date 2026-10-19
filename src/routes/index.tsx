import { createFileRoute } from "@tanstack/react-router";
import { NeuralOceanHero } from "@/components/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neural — World-Class Marine Sanctuaries & Living Coral Reefs" },
      {
        name: "description",
        content:
          "Exploring Earth's most breathtaking coral reefs and majestic marine kingdoms. Deep wonders, beyond the surface.",
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

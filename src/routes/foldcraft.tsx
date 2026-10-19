import { createFileRoute } from "@tanstack/react-router";
import { FoldcraftHero } from "@/components/home";

export const Route = createFileRoute("/foldcraft")({
  head: () => ({
    meta: [
      { title: "Foldcraft — Creative Studio" },
      {
        name: "description",
        content:
          "Shaping visual narratives, one pixel at a time. Independent creative studio crafting digital experiences and visual storytelling.",
      },
    ],
  }),
  component: FoldcraftRoute,
});

function FoldcraftRoute() {
  return <FoldcraftHero />;
}

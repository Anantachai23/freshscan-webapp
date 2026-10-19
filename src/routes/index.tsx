import { createFileRoute } from "@tanstack/react-router";
import { App } from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scroll Tied Video Section — FreshScan Marine" },
      {
        name: "description",
        content:
          "Cinematic scroll-tied video experience for AI seafood freshness evaluation with living coral reef and optical computer vision.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}

export default Index;

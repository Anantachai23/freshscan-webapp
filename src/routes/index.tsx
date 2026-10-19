import { createFileRoute } from "@tanstack/react-router";
import { App } from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FreshScan AI — Seafood Freshness Assessment" },
      {
        name: "description",
        content:
          "FreshScan AI — Seafood Freshness Assessment. Know how fresh, before it reaches your table.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}

export default Index;

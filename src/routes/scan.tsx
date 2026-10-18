import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/scan")({
  beforeLoad: () => {
    throw redirect({ to: "/analyze" });
  },
  component: () => null,
});

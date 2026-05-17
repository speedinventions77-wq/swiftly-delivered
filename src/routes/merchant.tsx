import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/merchant")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("shofast.session");
      if (!s) throw redirect({ to: "/auth", search: { role: "merchant", mode: "signin" } });
    }
  },
  component: () => (
    <MobileShell>
      <Outlet />
      <BottomNav role="merchant" />
    </MobileShell>
  ),
});

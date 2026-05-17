import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const s = localStorage.getItem("shofast.session");
      if (!s) throw redirect({ to: "/auth", search: { mode: "signin" } });
    }
  },
  component: () => (
    <MobileShell>
      <Outlet />
      <BottomNav />
    </MobileShell>
  ),
});

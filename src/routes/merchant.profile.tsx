import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getSession, setSession } from "@/lib/store";
import { ChevronRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/merchant/profile")({ component: Profile });

function Profile() {
  const s = getSession();
  const nav = useNavigate();
  const items = ["Store details", "Operating hours", "Delivery zones", "Notifications", "Help center"];
  return (
    <div className="px-5 pt-6 safe-top">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{(s?.name?.[0] || "M").toUpperCase()}</div>
        <div>
          <p className="font-semibold">{s?.name || "Merchant"}</p>
          <p className="text-xs text-muted-foreground">{s?.email}</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((i) => (
          <li key={i} className="flex items-center justify-between px-4 py-4 text-sm font-medium">{i}<ChevronRight className="h-4 w-4 text-muted-foreground"/></li>
        ))}
      </ul>
      <button onClick={() => { setSession(null); nav({ to: "/" }); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-destructive">
        <LogOut className="h-4 w-4"/> Sign out
      </button>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, LogOut } from "lucide-react";

export const Route = createFileRoute("/app/profile")({ component: Profile });

function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) setUser({ email: u.email, name: (u.user_metadata?.full_name as string) || u.email?.split("@")[0] });
    });
  }, []);
  const items = ["Addresses", "Payment methods", "Notifications", "Help center", "About Shofast"];
  return (
    <div className="px-5 pt-6 safe-top">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{(user?.name?.[0] || "U").toUpperCase()}</div>
        <div>
          <p className="font-semibold">{user?.name || "Guest"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {items.map((i) => (
          <li key={i} className="flex items-center justify-between px-4 py-4 text-sm font-medium">{i}<ChevronRight className="h-4 w-4 text-muted-foreground"/></li>
        ))}
      </ul>
      <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-semibold text-destructive">
        <LogOut className="h-4 w-4"/> Sign out
      </button>
    </div>
  );
}

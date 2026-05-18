import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth", search: { mode: "signin" } });
    });
    setReady(true);
    return () => sub.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return (
    <MobileShell>
      <Outlet />
      <BottomNav />
    </MobileShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

export const Route = createFileRoute("/app/stores")({ component: Stores });

type Store = { id: string; name: string; category?: string | null; rating?: number | null; logo_url?: string | null };

function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("stores")
      .select("id,name,category,rating,logo_url,is_verified,is_open")
      .eq("is_verified", true)
      .order("rating", { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setStores((data ?? []) as Store[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Stores near you</h1>
      <p className="text-sm text-muted-foreground">Buy directly from local merchants.</p>
      {loading && <p className="mt-4 text-xs text-muted-foreground">Loading…</p>}
      {err && <p className="mt-4 text-xs text-destructive">{err}</p>}
      {!loading && stores.length === 0 && !err && (
        <p className="mt-6 text-sm text-muted-foreground">No stores available yet.</p>
      )}
      <ul className="mt-5 grid grid-cols-2 gap-3">
        {stores.map((st) => (
          <li key={st.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="grid aspect-square w-full place-items-center overflow-hidden rounded-xl bg-secondary text-3xl">
              {st.logo_url ? <img src={st.logo_url} alt={st.name} className="h-full w-full object-cover" /> : "🏪"}
            </div>
            <p className="mt-2 truncate font-semibold">{st.name}</p>
            <p className="text-[11px] text-muted-foreground">{st.category ?? "Store"}</p>
            {st.rating != null && (
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold"><Star className="h-3 w-3 fill-current"/>{Number(st.rating).toFixed(1)}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

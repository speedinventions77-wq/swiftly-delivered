import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES, formatGhs } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MapPin, Search, Star } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Home });

type Store = {
  id: string;
  name: string;
  category?: string | null;
  rating?: number | null;
  logo_url?: string | null;
  cover_url?: string | null;
};

function Home() {
  const [name, setName] = useState<string>("");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      setName(((u?.user_metadata?.full_name as string) || u?.email?.split("@")[0]) ?? "");
    });
    supabase
      .from("stores")
      .select("id,name,category,rating,logo_url,cover_url,is_verified,is_open")
      .eq("is_verified", true)
      .eq("is_open", true)
      .limit(6)
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setStores((data ?? []) as Store[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-5 pt-4 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Deliver to</p>
          <p className="flex items-center gap-1 text-sm font-semibold"><MapPin className="h-4 w-4"/> Home · Accra</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold">{(name?.[0] || "U").toUpperCase()}</div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search stores, products, services" className="w-full bg-transparent text-sm outline-none" />
      </div>

      <h2 className="mt-7 text-lg font-bold">What do you need?</h2>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {SERVICES.map((sv) => (
          <Link key={sv.id} to="/app/service/$type" params={{ type: sv.id }} className="rounded-2xl border border-border bg-card p-3 transition active:scale-[0.97]">
            <div className="text-2xl">{sv.emoji}</div>
            <div className="mt-2 text-sm font-semibold">{sv.label}</div>
            <div className="text-[11px] text-muted-foreground">{sv.desc}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-end justify-between">
        <h2 className="text-lg font-bold">Stores near you</h2>
        <Link to="/app/stores" className="text-xs font-semibold text-muted-foreground">See all</Link>
      </div>
      {loading && <p className="mt-3 text-xs text-muted-foreground">Loading stores…</p>}
      {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
      {!loading && !err && stores.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">No stores live yet. Check back soon.</p>
      )}
      <ul className="mt-3 space-y-3">
        {stores.map((st) => (
          <li key={st.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-secondary text-2xl">
              {st.logo_url ? <img src={st.logo_url} alt={st.name} className="h-full w-full object-cover" /> : "🏪"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{st.name}</p>
              <p className="text-xs text-muted-foreground">{st.category ?? "Store"}</p>
            </div>
            {st.rating != null && (
              <div className="flex items-center gap-1 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-current"/>{Number(st.rating).toFixed(1)}</div>
            )}
            <span className="text-[10px] text-muted-foreground">{formatGhs(0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

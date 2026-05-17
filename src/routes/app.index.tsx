import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES, STORES, getSession } from "@/lib/store";
import { MapPin, Search, Star } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Home,
});

function Home() {
  const s = getSession();
  return (
    <div className="px-5 pt-4 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Deliver to</p>
          <p className="flex items-center gap-1 text-sm font-semibold"><MapPin className="h-4 w-4"/> Home · Lagos</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold">{(s?.name?.[0] || "U").toUpperCase()}</div>
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
      <ul className="mt-3 space-y-3">
        {STORES.map((st) => (
          <li key={st.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-secondary text-2xl">🏪</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{st.name}</p>
              <p className="text-xs text-muted-foreground">{st.tag} · {st.eta}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold"><Star className="h-3.5 w-3.5 fill-current"/>{st.rating}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

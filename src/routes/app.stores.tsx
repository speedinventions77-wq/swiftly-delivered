import { createFileRoute } from "@tanstack/react-router";
import { STORES } from "@/lib/store";
import { Star } from "lucide-react";

export const Route = createFileRoute("/app/stores")({ component: Stores });

function Stores() {
  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Stores near you</h1>
      <p className="text-sm text-muted-foreground">Buy directly from local merchants.</p>
      <ul className="mt-5 grid grid-cols-2 gap-3">
        {STORES.concat(STORES).map((st, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-3">
            <div className="grid aspect-square w-full place-items-center rounded-xl bg-secondary text-3xl">🏪</div>
            <p className="mt-2 truncate font-semibold">{st.name}</p>
            <p className="text-[11px] text-muted-foreground">{st.tag}</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold"><Star className="h-3 w-3 fill-current"/>{st.rating} · {st.eta}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

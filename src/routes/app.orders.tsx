import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatGhs } from "@/lib/store";
import { Package } from "lucide-react";

export const Route = createFileRoute("/app/orders")({ component: Orders });

type Order = {
  id: string;
  code?: string | null;
  service_type?: string | null;
  status: string;
  total?: number | null;
  created_at?: string;
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id;
      if (!uid) return setLoading(false);
      const { data: rows, error } = await supabase
        .from("orders")
        .select("id,code,service_type,status,total,created_at")
        .eq("customer_id", uid)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) setErr(error.message);
      else setOrders((rows ?? []) as Order[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Your orders</h1>
      {loading && <p className="mt-4 text-xs text-muted-foreground">Loading…</p>}
      {err && <p className="mt-4 text-xs text-destructive">{err}</p>}
      {!loading && orders.length === 0 && !err && (
        <p className="mt-6 text-sm text-muted-foreground">You haven't placed an order yet.</p>
      )}
      <ul className="mt-5 space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to="/app/track/$id" params={{ id: o.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary"><Package className="h-5 w-5"/></div>
              <div className="flex-1">
                <p className="font-semibold capitalize">{o.service_type ?? "Order"}</p>
                <p className="text-xs text-muted-foreground">{(o.code ?? o.id.slice(0, 8))} · {o.status}</p>
              </div>
              <p className="text-sm font-semibold">{formatGhs(o.total ?? 0)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

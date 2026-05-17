import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/lib/store";
import { ArrowUpRight, Plus, ShoppingBag, Wallet } from "lucide-react";

export const Route = createFileRoute("/merchant/")({ component: Dashboard });

function Dashboard() {
  const s = getSession();
  return (
    <div className="px-5 pt-6 safe-top">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold">{s?.name || "Merchant"}</h1>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-semibold">{(s?.name?.[0] || "M").toUpperCase()}</div>
      </div>

      <div className="mt-6 rounded-3xl bg-primary p-5 text-primary-foreground">
        <p className="text-xs opacity-70">Today's earnings (80% share)</p>
        <p className="mt-1 text-3xl font-bold">₦48,200</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <Stat label="Orders" value="12"/>
          <Stat label="Pending" value="3"/>
          <Stat label="Rating" value="4.8"/>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link to="/merchant/products" className="rounded-2xl border border-border bg-card p-4">
          <Plus className="h-5 w-5"/>
          <p className="mt-3 font-semibold">Add product</p>
          <p className="text-xs text-muted-foreground">Upload items to sell</p>
        </Link>
        <Link to="/merchant/orders" className="rounded-2xl border border-border bg-card p-4">
          <ShoppingBag className="h-5 w-5"/>
          <p className="mt-3 font-semibold">Orders</p>
          <p className="text-xs text-muted-foreground">3 awaiting action</p>
        </Link>
        <Link to="/merchant/bank" className="col-span-2 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5"/>
            <div>
              <p className="font-semibold">Link bank account</p>
              <p className="text-xs text-muted-foreground">Receive your 80% via Paystack sub-account</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5"/>
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-bold">Recent orders</h2>
      <ul className="mt-3 space-y-3">
        {[
          { id: "SF-2087", item: "Jollof rice x2", status: "New", price: "₦4,500" },
          { id: "SF-2086", item: "Burger combo", status: "Preparing", price: "₦6,800" },
        ].map((o) => (
          <li key={o.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-lg">🍱</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{o.item}</p>
              <p className="text-[11px] text-muted-foreground">{o.id} · {o.status}</p>
            </div>
            <p className="text-sm font-semibold">{o.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <p className="opacity-70">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

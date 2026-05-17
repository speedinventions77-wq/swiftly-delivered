import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";

export const Route = createFileRoute("/app/orders")({ component: Orders });

function Orders() {
  const orders = [
    { id: "SF-1042", service: "Food", status: "In transit", price: "₦4,500" },
    { id: "SF-1031", service: "Pharmacy", status: "Delivered", price: "₦2,100" },
  ];
  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Your orders</h1>
      <ul className="mt-5 space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to="/app/track" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary"><Package className="h-5 w-5"/></div>
              <div className="flex-1">
                <p className="font-semibold">{o.service}</p>
                <p className="text-xs text-muted-foreground">{o.id} · {o.status}</p>
              </div>
              <p className="text-sm font-semibold">{o.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

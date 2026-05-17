import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

type Status = "New" | "Preparing" | "Ready" | "Completed";

export const Route = createFileRoute("/merchant/orders")({ component: Orders });

function Orders() {
  const [tab, setTab] = useState<Status>("New");
  const orders: { id: string; item: string; price: string; status: Status; customer: string }[] = [
    { id: "SF-2087", item: "Jollof rice x2", price: "₦4,500", status: "New", customer: "Ada O." },
    { id: "SF-2086", item: "Burger combo", price: "₦6,800", status: "Preparing", customer: "Tope K." },
    { id: "SF-2080", item: "Suya wrap x3", price: "₦9,600", status: "Completed", customer: "Chika E." },
  ];
  const tabs: Status[] = ["New", "Preparing", "Ready", "Completed"];
  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{t}</button>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {orders.filter((o) => o.status === tab).map((o) => (
          <li key={o.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{o.item}</p>
              <p className="font-semibold">{o.price}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{o.id} · {o.customer}</p>
            {tab !== "Completed" && (
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-full border border-border py-2 text-xs font-semibold">Decline</button>
                <button className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground">Accept</button>
              </div>
            )}
          </li>
        ))}
        {orders.filter((o) => o.status === tab).length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">No {tab.toLowerCase()} orders</p>
        )}
      </ul>
    </div>
  );
}

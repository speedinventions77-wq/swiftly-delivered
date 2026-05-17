import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";

type Product = { id: string; name: string; price: string; desc: string };

export const Route = createFileRoute("/merchant/products")({ component: Products });

function Products() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([
    { id: "1", name: "Jollof Rice", price: "₦2,500", desc: "Classic party jollof" },
    { id: "2", name: "Suya Wrap", price: "₦3,200", desc: "Spicy beef wrap" },
  ]);
  const [form, setForm] = useState({ name: "", price: "", desc: "" });

  return (
    <div className="px-5 pt-6 safe-top">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-4 w-4"/> New
        </button>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3">
        {items.map((p) => (
          <li key={p.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="grid aspect-square w-full place-items-center rounded-xl bg-secondary text-3xl">🍽️</div>
            <p className="mt-2 truncate font-semibold">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.price}</p>
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <div className="w-full rounded-t-3xl bg-background p-5 safe-bottom">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Upload product</h2>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-secondary"><X className="h-4 w-4"/></button>
            </div>
            <div className="mt-4 grid place-items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary py-8 text-xs text-muted-foreground">
              <Upload className="h-5 w-5"/> Tap to upload photo
            </div>
            <div className="mt-3 space-y-2">
              <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none"/>
              <input placeholder="Price (₦)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none"/>
              <textarea placeholder="Description" rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none"/>
            </div>
            <button onClick={() => { if (form.name) { setItems([{ id: Date.now().toString(), ...form, price: form.price || "₦0" }, ...items]); setForm({ name: "", price: "", desc: "" }); setOpen(false); } }} className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Publish product</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/merchant/bank")({ component: Bank });

function Bank() {
  const [linked, setLinked] = useState(false);
  const [form, setForm] = useState({ bank: "", account: "", name: "" });
  return (
    <div className="px-5 pt-6 safe-top">
      <h1 className="text-2xl font-bold">Payouts</h1>
      <p className="mt-1 text-sm text-muted-foreground">Link your bank to receive 80% of every order through a Paystack sub-account. Shofast keeps 20%.</p>

      <div className="mt-5 rounded-3xl bg-primary p-5 text-primary-foreground">
        <p className="text-xs opacity-70">Available for payout</p>
        <p className="mt-1 text-3xl font-bold">₦126,400</p>
        <button disabled={!linked} className="mt-4 w-full rounded-full bg-white py-3 text-sm font-semibold text-black disabled:opacity-50">{linked ? "Withdraw now" : "Link bank to withdraw"}</button>
      </div>

      {linked ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <CheckCircle2 className="h-6 w-6 text-success"/>
          <div>
            <p className="font-semibold">{form.bank}</p>
            <p className="text-xs text-muted-foreground">{form.account} · {form.name}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setLinked(true); }} className="mt-6 space-y-3">
          <select required value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm outline-none">
            <option value="">Select bank</option>
            {["GTBank", "Access Bank", "Zenith Bank", "UBA", "First Bank", "Kuda", "OPay"].map((b) => <option key={b}>{b}</option>)}
          </select>
          <input required placeholder="Account number" value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm outline-none"/>
          <input required placeholder="Account name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm outline-none"/>
          <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Create Paystack sub-account</button>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground"><ShieldCheck className="h-3 w-3"/> Secured by Paystack</p>
        </form>
      )}
    </div>
  );
}

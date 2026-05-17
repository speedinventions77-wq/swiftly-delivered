import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SERVICES } from "@/lib/store";
import { ArrowLeft, MapPin } from "lucide-react";

export const Route = createFileRoute("/app/service/$type")({ component: ServiceForm });

function ServiceForm() {
  const { type } = Route.useParams();
  const svc = SERVICES.find((s) => s.id === type) || SERVICES[0];
  const nav = useNavigate();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [details, setDetails] = useState("");

  return (
    <div className="min-h-screen px-5 pt-4 safe-top">
      <div className="flex items-center gap-3">
        <Link to="/app" className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"><ArrowLeft className="h-5 w-5"/></Link>
        <div>
          <p className="text-xs text-muted-foreground">Service</p>
          <p className="text-lg font-bold">{svc.emoji} {svc.label}</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/app/track" }); }} className="mt-6 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex flex-col items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
              <span className="my-1 h-8 w-px bg-border" />
              <span className="h-2.5 w-2.5 rounded-sm bg-foreground" />
            </div>
            <div className="flex-1 space-y-3">
              <Input value={pickup} onChange={setPickup} placeholder="Pickup address" required />
              <div className="h-px bg-border" />
              <Input value={drop} onChange={setDrop} placeholder="Drop-off address" required />
            </div>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Order details</span>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder={`What should the rider pick up? e.g. ${svc.label.toLowerCase()} from...`} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none ring-ring focus:ring-2" />
        </label>

        <div className="rounded-2xl bg-secondary p-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Estimated fare</span><span className="font-semibold">₦2,500</span></div>
          <div className="mt-1 flex justify-between"><span className="text-muted-foreground">ETA</span><span className="font-semibold">15–25 min</span></div>
        </div>

        <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/> Find rider</span>
        </button>
      </form>
    </div>
  );
}

function Input({ value, onChange, placeholder, required }: { value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full bg-transparent text-sm outline-none" />;
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bike, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/track")({ component: Track });

type Phase = "matching" | "enroute" | "arrived" | "completed" | "paid";

function Track() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<Phase>("matching");
  const [showPay, setShowPay] = useState(false);

  useEffect(() => {
    if (phase === "matching") {
      const t = setTimeout(() => setPhase("enroute"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "enroute") {
      const t = setTimeout(() => setPhase("arrived"), 6000);
      return () => clearTimeout(t);
    }
    if (phase === "completed") {
      setShowPay(true);
    }
  }, [phase]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Map */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.gray.100),theme(colors.gray.200))]">
        <svg className="absolute inset-0 h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path d="M40 80 Q 180 40, 260 220 T 360 520" stroke="black" strokeWidth="3" fill="none" strokeDasharray="6 6"/>
        </svg>

        {/* Customer pin */}
        <div className="absolute" style={{ left: "12%", top: "18%" }}>
          <div className="relative">
            <span className="absolute inset-0 -m-2 rounded-full bg-foreground/20 animate-pulse-ring" />
            <span className="relative grid h-8 w-8 place-items-center rounded-full bg-foreground text-background text-[10px] font-bold">YOU</span>
          </div>
        </div>

        {/* Drop pin */}
        <div className="absolute" style={{ right: "12%", bottom: "30%" }}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-foreground text-background text-[10px] font-bold">DROP</span>
        </div>

        {/* Rider */}
        {phase !== "matching" && (
          <div className="absolute left-[10%] top-[16%]">
            <div className="animate-rider">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-background shadow-pop ring-2 ring-foreground">
                <Bike className="h-5 w-5"/>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 safe-top">
        <button onClick={() => nav({ to: "/app" })} className="grid h-10 w-10 place-items-center rounded-full bg-background shadow-card">
          <ArrowLeft className="h-5 w-5"/>
        </button>
        <div className="rounded-full bg-background px-4 py-2 text-xs font-semibold shadow-card">
          {phase === "matching" ? "Finding rider…" : phase === "enroute" ? "Rider on the way" : phase === "arrived" ? "Rider arrived" : "Delivered"}
        </div>
        <span className="w-10" />
      </div>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-background p-5 shadow-pop safe-bottom">
        {phase === "matching" && (
          <div className="py-6 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-foreground" />
            <p className="mt-4 font-semibold">Matching you with a nearby rider</p>
            <p className="mt-1 text-sm text-muted-foreground">Usually takes under 30 seconds.</p>
          </div>
        )}
        {(phase === "enroute" || phase === "arrived") && (
          <>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-lg font-bold">T</div>
              <div className="flex-1">
                <p className="font-semibold">Tunde A. · ⭐ 4.9</p>
                <p className="text-xs text-muted-foreground">Honda CB · ABC 234 XY</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-border"><Phone className="h-4 w-4"/></button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-border"><MessageSquare className="h-4 w-4"/></button>
            </div>
            <button onClick={() => setPhase("completed")} className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
              {phase === "arrived" ? "Rider has arrived — Complete delivery" : "Simulate rider complete"}
            </button>
          </>
        )}
        {phase === "completed" && !showPay && (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success"/>
            <p className="mt-3 font-semibold">Delivery completed</p>
          </div>
        )}
      </div>

      {/* Pay modal */}
      {showPay && (
        <div className="absolute inset-0 z-20 flex items-end bg-black/40 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-background p-6 safe-bottom">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border"/>
            <h2 className="text-xl font-bold">Pay for your order</h2>
            <p className="mt-1 text-sm text-muted-foreground">The rider marked your delivery as completed.</p>
            <div className="mt-5 rounded-2xl bg-secondary p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₦2,200</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₦800</span></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>₦3,000</span></div>
            </div>
            <button onClick={() => { setPhase("paid"); setShowPay(false); setTimeout(() => nav({ to: "/app/orders" }), 600); }} className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground">
              Pay ₦3,000 with Paystack
            </button>
            <button onClick={() => setShowPay(false)} className="mt-3 w-full py-2 text-sm text-muted-foreground">Pay later</button>
          </div>
        </div>
      )}
    </div>
  );
}

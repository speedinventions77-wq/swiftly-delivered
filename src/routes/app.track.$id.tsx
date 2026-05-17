import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeFn } from "@/lib/api";
import { formatGhs, loadPaystack, PAYSTACK_PUBLIC_KEY } from "@/lib/store";
import { ArrowLeft, Bike, Phone, MessageSquare, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/track/$id")({ component: Track });

type Order = {
  id: string;
  status: string;
  total: number | null;
  subtotal: number | null;
  delivery_fee: number | null;
  payment_status?: string | null;
  payment_method?: string | null;
  rider_id?: string | null;
  customer_id?: string | null;
};

type Rider = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  vehicle_type?: string | null;
  rating?: number | null;
  photo_url?: string | null;
};

function Track() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [rider, setRider] = useState<Rider | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase
        .from("orders")
        .select("id,status,total,subtotal,delivery_fee,payment_status,payment_method,rider_id,customer_id")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (error) { setErr(error.message); return; }
      setOrder(data as Order);
      if (data?.rider_id) {
        const { data: r } = await supabase
          .from("riders")
          .select("id,full_name,phone,vehicle_type,rating,photo_url")
          .eq("id", data.rider_id)
          .maybeSingle();
        if (active) setRider(r as Rider);
      }
    }
    load();
    const ch = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, (payload) => {
        setOrder(payload.new as Order);
      })
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, [id]);

  const phase: "matching" | "enroute" | "arrived" | "completed" | "paid" = (() => {
    if (!order) return "matching";
    if (order.payment_status === "paid") return "paid";
    if (order.status === "delivered" || order.status === "completed") return "completed";
    if (order.status === "arrived") return "arrived";
    if (order.status === "picked_up" || order.status === "in_transit" || order.status === "accepted") return "enroute";
    return "matching";
  })();

  const showPay = phase === "completed" && (order?.payment_method === "paystack") && order?.payment_status !== "paid";

  async function payWithPaystack() {
    if (!order) return;
    setPaying(true);
    setErr(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Sign in required");

      // Preferred: server-initialized transaction so the reference + split are authoritative.
      let reference: string | null = null;
      try {
        const res = await invokeFn<{ reference: string }>("paystack-init", { order_id: order.id });
        reference = res?.reference ?? null;
      } catch {
        // Fall back to inline popup with a client-side reference (backend must still
        // reconcile via webhook).
        reference = `SF-${order.id.slice(0, 8)}-${Date.now()}`;
      }

      const PaystackPop = await loadPaystack();
      const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: Math.round((order.total ?? 0) * 100),
        currency: "GHS",
        ref: reference,
        metadata: { order_id: order.id },
        callback: () => {
          // Webhook updates payment_status; UI updates via realtime.
          setPaying(false);
        },
        onClose: () => setPaying(false),
      });
      handler.openIframe();
    } catch (e: any) {
      setErr(e?.message ?? "Payment failed to start");
      setPaying(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
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

        <div className="absolute" style={{ left: "12%", top: "18%" }}>
          <div className="relative">
            <span className="absolute inset-0 -m-2 rounded-full bg-foreground/20 animate-pulse-ring" />
            <span className="relative grid h-8 w-8 place-items-center rounded-full bg-foreground text-background text-[10px] font-bold">YOU</span>
          </div>
        </div>
        <div className="absolute" style={{ right: "12%", bottom: "30%" }}>
          <span className="grid h-8 w-8 place-items-center rounded-md bg-foreground text-background text-[10px] font-bold">DROP</span>
        </div>
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

      <div className="relative z-10 flex items-center justify-between px-5 pt-4 safe-top">
        <button onClick={() => nav({ to: "/app" })} className="grid h-10 w-10 place-items-center rounded-full bg-background shadow-card">
          <ArrowLeft className="h-5 w-5"/>
        </button>
        <div className="rounded-full bg-background px-4 py-2 text-xs font-semibold shadow-card">
          {phase === "matching" ? "Finding rider…" : phase === "enroute" ? "Rider on the way" : phase === "arrived" ? "Rider arrived" : phase === "paid" ? "Paid" : "Delivered"}
        </div>
        <span className="w-10" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl bg-background p-5 shadow-pop safe-bottom">
        {err && <p className="mb-3 text-xs text-destructive">{err}</p>}
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
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-secondary text-lg font-bold">
                {rider?.photo_url ? <img src={rider.photo_url} alt="" className="h-full w-full object-cover"/> : (rider?.full_name?.[0] ?? "R")}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{rider?.full_name ?? "Your rider"}{rider?.rating != null && <> · ⭐ {Number(rider.rating).toFixed(1)}</>}</p>
                <p className="text-xs text-muted-foreground">{rider?.vehicle_type ?? "Bike"}</p>
              </div>
              {rider?.phone && (
                <a href={`tel:${rider.phone}`} className="grid h-10 w-10 place-items-center rounded-full border border-border"><Phone className="h-4 w-4"/></a>
              )}
              <button className="grid h-10 w-10 place-items-center rounded-full border border-border"><MessageSquare className="h-4 w-4"/></button>
            </div>
          </>
        )}
        {phase === "completed" && !showPay && (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success"/>
            <p className="mt-3 font-semibold">Delivery completed</p>
          </div>
        )}
        {phase === "paid" && (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success"/>
            <p className="mt-3 font-semibold">Paid — thank you!</p>
            <button onClick={() => nav({ to: "/app/orders" })} className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Back to orders</button>
          </div>
        )}
      </div>

      {showPay && (
        <div className="absolute inset-0 z-20 flex items-end bg-black/40 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl bg-background p-6 safe-bottom">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border"/>
            <h2 className="text-xl font-bold">Pay for your order</h2>
            <p className="mt-1 text-sm text-muted-foreground">The rider marked your delivery as completed.</p>
            <div className="mt-5 rounded-2xl bg-secondary p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatGhs(order?.subtotal ?? 0)}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatGhs(order?.delivery_fee ?? 0)}</span></div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>{formatGhs(order?.total ?? 0)}</span></div>
            </div>
            <button disabled={paying} onClick={payWithPaystack} className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {paying ? "Opening Paystack…" : `Pay ${formatGhs(order?.total ?? 0)} with Paystack`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

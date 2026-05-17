import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, Store, ShieldCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import services from "@/assets/services.jpg";
import store from "@/assets/store.jpg";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shofast — Deliver anything, fast" },
      { name: "description", content: "On-demand delivery for food, groceries, pharmacy and errands. Sell on Shofast or order from anywhere near you." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="mx-auto w-full max-w-md bg-background">
      {/* Header */}
      <header className="safe-top sticky top-0 z-30 flex items-center justify-between bg-background/90 px-5 py-3 backdrop-blur">
        <Logo />
        <Link to="/auth" search={{ role: "customer", mode: "signin" } as never} className="text-sm font-semibold">Sign in</Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Shofast rider in the city" width={1024} height={1280} className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-background" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white">
            Deliver anything.<br/>Right now.
          </h1>
          <p className="mt-3 text-sm text-white/85">Food, groceries, pharmacy, errands. Or shop from stores near you — all in one app.</p>
          <div className="mt-5 flex gap-2">
            <Link to="/auth" search={{ role: "customer", mode: "signup" } as never} className="flex-1 rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-black">
              Order as customer
            </Link>
            <Link to="/auth" search={{ role: "merchant", mode: "signup" } as never} className="flex-1 rounded-full border border-white/40 bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white backdrop-blur">
              Sell on Shofast
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-5 py-10">
        <h2 className="text-2xl font-bold">One app. Every errand.</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick a service, drop the details, we match a rider in seconds.</p>
        <img src={services} alt="Services" width={1024} height={768} loading="lazy" className="mt-5 w-full rounded-2xl object-cover" />
        <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
          {["Food", "Groceries", "Pharmacy", "Errands", "Package", "Anything"].map((s) => (
            <li key={s} className="rounded-xl border border-border bg-card px-3 py-3 font-medium">{s}</li>
          ))}
        </ul>
      </section>

      {/* For merchants */}
      <section className="bg-primary px-5 py-12 text-primary-foreground">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest opacity-70"><Store className="h-3.5 w-3.5"/> For merchants</div>
        <h2 className="mt-2 text-2xl font-bold">Open a store. Get paid daily.</h2>
        <p className="mt-2 text-sm opacity-80">Upload products, receive orders and manage payouts. We split securely via Paystack sub-accounts — you keep 80%.</p>
        <img src={store} alt="Storefront" width={1024} height={768} loading="lazy" className="mt-5 w-full rounded-2xl object-cover opacity-90" />
        <Link to="/auth" search={{ role: "merchant", mode: "signup" } as never} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">
          Become a merchant <ArrowRight className="h-4 w-4"/>
        </Link>
      </section>

      {/* Trust */}
      <section className="px-5 py-12">
        <ul className="space-y-4">
          {[
            { icon: Bike, t: "Riders in minutes", d: "Live tracking from pickup to drop-off." },
            { icon: ShieldCheck, t: "Secure payments", d: "Paystack-powered. Split automatically." },
            { icon: Store, t: "Local stores", d: "Discover merchants near you and buy direct." },
          ].map(({ icon: I, t, d }) => (
            <li key={t} className="flex gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary"><I className="h-5 w-5"/></span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shofast. All rights reserved.
      </footer>
    </div>
  );
}

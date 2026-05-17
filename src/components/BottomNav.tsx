import { Link, useLocation } from "@tanstack/react-router";
import { Home, Package, Store, User } from "lucide-react";

const items = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/stores", label: "Stores", icon: Store },
  { to: "/app/orders", label: "Orders", icon: Package },
  { to: "/app/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur safe-bottom">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 pt-2">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link to={it.to} className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition ${active ? "text-foreground" : "text-muted-foreground"}`}>
                <Icon className={`h-5 w-5 ${active ? "" : "opacity-70"}`} />
                <span>{it.label}</span>
                {active && <span className="mt-0.5 h-0.5 w-6 rounded-full bg-foreground" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

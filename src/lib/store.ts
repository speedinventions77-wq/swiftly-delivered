// Mock client-side state. Replace with Supabase later.
export type Role = "customer" | "merchant";

export type Session = { email: string; name: string; role: Role } | null;

const KEY = "shofast.session";

export function getSession(): Session {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setSession(s: Session) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
}

export const SERVICES = [
  { id: "food", label: "Food", emoji: "🍔", desc: "Restaurants & meals" },
  { id: "groceries", label: "Groceries", emoji: "🛒", desc: "Daily essentials" },
  { id: "pharmacy", label: "Pharmacy", emoji: "💊", desc: "Meds & care" },
  { id: "errands", label: "Errands", emoji: "🧾", desc: "Anything for you" },
  { id: "package", label: "Package", emoji: "📦", desc: "Send anywhere" },
  { id: "anything", label: "Anything", emoji: "✨", desc: "Custom request" },
];

export const STORES = [
  { id: "1", name: "Mama's Kitchen", tag: "Local Food", rating: 4.8, eta: "15-25 min", img: "/store1.jpg" },
  { id: "2", name: "FreshMart", tag: "Groceries", rating: 4.6, eta: "20-30 min" },
  { id: "3", name: "CarePlus Pharmacy", tag: "Pharmacy", rating: 4.9, eta: "10-20 min" },
  { id: "4", name: "BurgerLab", tag: "Fast Food", rating: 4.7, eta: "15-25 min" },
];

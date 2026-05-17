export const SERVICES = [
  { id: "food", label: "Food", emoji: "🍔", desc: "Restaurants & meals" },
  { id: "groceries", label: "Groceries", emoji: "🛒", desc: "Daily essentials" },
  { id: "pharmacy", label: "Pharmacy", emoji: "💊", desc: "Meds & care" },
  { id: "errands", label: "Errands", emoji: "🧾", desc: "Anything for you" },
  { id: "package", label: "Package", emoji: "📦", desc: "Send anywhere" },
  { id: "anything", label: "Anything", emoji: "✨", desc: "Custom request" },
];

export function formatGhs(n: number | null | undefined): string {
  return `₵${(Number(n) || 0).toFixed(2)}`;
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function estimateFare(km: number): { delivery: number; eta: string } {
  const delivery = Math.round((2 + 1.5 * Math.max(0, km)) * 100) / 100;
  const min = Math.max(10, Math.round(km * 3 + 8));
  return { delivery, eta: `${min}–${min + 10} min` };
}

// Lazy-load Paystack inline script
let paystackPromise: Promise<any> | null = null;
export function loadPaystack(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).PaystackPop) return Promise.resolve((window as any).PaystackPop);
  if (paystackPromise) return paystackPromise;
  paystackPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve((window as any).PaystackPop);
    s.onerror = () => reject(new Error("Paystack script failed to load"));
    document.head.appendChild(s);
  });
  return paystackPromise;
}

export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string;

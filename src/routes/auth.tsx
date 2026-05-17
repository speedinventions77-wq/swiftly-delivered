import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).catch("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/app" });
    } catch (err: any) {
      setError(err?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 safe-top">
      <div className="flex items-center justify-between py-4">
        <Link to="/" className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"><ArrowLeft className="h-5 w-5"/></Link>
        <Logo />
        <span className="w-9" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{mode === "signup" ? "Create account" : "Welcome back"}</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          {mode === "signup" ? "Get anything delivered" : "Sign in to Shofast"}
        </h1>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-3">
        {mode === "signup" && (
          <Field label="Full name" value={name} onChange={setName} placeholder="Ada Lovelace" />
        )}
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.99] disabled:opacity-60">
          {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? "Already on Shofast?" : "New to Shofast?"}{" "}
        <Link to="/auth" search={{ mode: mode === "signup" ? "signin" : "signup" }} className="font-semibold text-foreground underline-offset-4 hover:underline">
          {mode === "signup" ? "Sign in" : "Create account"}
        </Link>
      </p>

      <p className="mt-auto pb-6 pt-10 text-center text-[11px] text-muted-foreground">By continuing you agree to our Terms & Privacy.</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm outline-none ring-ring focus:ring-2"
      />
    </label>
  );
}

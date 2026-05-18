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

  function friendlyError(err: any): string {
    const msg = String(err?.message ?? err ?? "");
    const code = err?.code || err?.error_code;
    if (code === "weak_password" || /pwned|known to be weak|easy to guess/i.test(msg))
      return "That password has been seen in a data breach. Please choose a stronger one (try mixing letters, numbers and symbols).";
    if (code === "user_already_exists" || /already registered|already exists/i.test(msg))
      return "An account with that email already exists. Try signing in instead.";
    if (/invalid login credentials/i.test(msg)) return "Wrong email or password.";
    if (/email not confirmed/i.test(msg)) return "Please confirm your email first — check your inbox.";
    if (/password should be at least/i.test(msg)) return msg;
    if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a moment and try again.";
    return msg || "Authentication failed";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup") {
      if (!name.trim()) return setError("Please enter your full name.");
      if (password.length < 8) return setError("Password must be at least 8 characters.");
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
      navigate({ to: "/app" });
    } catch (err: any) {
      setError(friendlyError(err));
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
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {mode === "signup" && !error && (
          <p className="text-[11px] text-muted-foreground">Use 8+ characters with a mix of letters, numbers & symbols. Common passwords are blocked.</p>
        )}
        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
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

function Field({ label, value, onChange, type = "text", placeholder, required, autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete ?? (type === "password" ? "current-password" : "on")}
        autoCorrect="off"
        autoCapitalize={type === "email" ? "none" : "words"}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-base outline-none ring-ring focus:ring-2"
      />
    </label>
  );
}

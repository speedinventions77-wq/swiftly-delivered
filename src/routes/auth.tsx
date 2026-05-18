import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Wrench } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).catch("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.312 0-9.624-3.417-11.285-8.137l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  );
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setGoogleError(null);
    setGoogleLoading(true);
    try {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/app`
        : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: any) {
      setGoogleError(err?.message || "Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 safe-top">
      <div className="flex items-center justify-between py-4">
        <Link to="/" className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Logo />
        <span className="w-9" />
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {mode === "signup" ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          {mode === "signup" ? "Get anything delivered" : "Sign in to Shofast"}
        </h1>
      </div>

      <div className="mt-8 space-y-4">
        {googleError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{googleError}</p>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3.5 text-sm font-semibold shadow-sm active:scale-[0.99] disabled:opacity-60"
        >
          <GoogleIcon />
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 px-4 py-5">
          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
            <Wrench className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest">Under Maintenance</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Email &amp; password sign-in is temporarily unavailable. Please use Google to sign in for now.
          </p>

          <div className="mt-4 space-y-3 opacity-40 pointer-events-none select-none">
            {mode === "signup" && (
              <div>
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Full name</span>
                <input disabled placeholder="Ada Lovelace" className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-base outline-none cursor-not-allowed" />
              </div>
            )}
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
              <input disabled type="email" placeholder="you@example.com" className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-base outline-none cursor-not-allowed" />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</span>
              <input disabled type="password" placeholder="At least 8 characters" className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-base outline-none cursor-not-allowed" />
            </div>
            <button disabled className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground opacity-60 cursor-not-allowed">
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? "Already on Shofast?" : "New to Shofast?"}{" "}
        <Link
          to="/auth"
          search={{ mode: mode === "signup" ? "signin" : "signup" }}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {mode === "signup" ? "Sign in" : "Create account"}
        </Link>
      </p>

      <p className="mt-auto pb-6 pt-10 text-center text-[11px] text-muted-foreground">
        By continuing you agree to our Terms &amp; Privacy.
      </p>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).catch("signin"),
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

const signUpSchema = z.object({
  name: z.string().min(1, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function friendlyError(err: any): string {
  const msg = String(err?.message ?? err ?? "");
  const code = err?.code || err?.error_code;
  if (code === "weak_password" || /pwned|known to be weak|easy to guess/i.test(msg))
    return "That password has been seen in a data breach. Please choose a stronger one.";
  if (code === "user_already_exists" || /already registered|already exists/i.test(msg))
    return "An account with that email already exists. Try signing in instead.";
  if (/invalid login credentials/i.test(msg)) return "Wrong email or password.";
  if (/email not confirmed/i.test(msg)) return "Please confirm your email first — check your inbox.";
  if (/password should be at least/i.test(msg)) return msg;
  if (/rate limit|too many/i.test(msg)) return "Too many attempts. Please wait a moment and try again.";
  return msg || "Authentication failed";
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSignIn(values: SignInValues) {
    setServerError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) throw error;
      navigate({ to: "/app" });
    } catch (err: any) {
      setServerError(friendlyError(err));
    }
  }

  async function onSignUp(values: SignUpValues) {
    setServerError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: { data: { full_name: values.name.trim() } },
      });
      if (error) throw error;
      navigate({ to: "/app" });
    } catch (err: any) {
      setServerError(friendlyError(err));
    }
  }

  const isSignIn = mode === "signin";

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
          {isSignIn ? "Welcome back" : "Create account"}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          {isSignIn ? "Sign in to Shofast" : "Get anything delivered"}
        </h1>
      </div>

      {isSignIn ? (
        <form onSubmit={signInForm.handleSubmit(onSignIn)} className="mt-8 space-y-3" noValidate>
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            registration={signInForm.register("email")}
            error={signInForm.formState.errors.email?.message}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            registration={signInForm.register("password")}
            error={signInForm.formState.errors.password?.message}
          />
          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
          )}
          <button
            type="submit"
            disabled={signInForm.formState.isSubmitting}
            className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.99] disabled:opacity-60"
          >
            {signInForm.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="mt-8 space-y-3" noValidate>
          <FormField
            label="Full name"
            type="text"
            placeholder="Ada Lovelace"
            autoComplete="name"
            autoCapitalize="words"
            registration={signUpForm.register("name")}
            error={signUpForm.formState.errors.name?.message}
          />
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            registration={signUpForm.register("email")}
            error={signUpForm.formState.errors.email?.message}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            registration={signUpForm.register("password")}
            error={signUpForm.formState.errors.password?.message}
          />
          <p className="text-[11px] text-muted-foreground">
            Use 8+ characters with a mix of letters, numbers &amp; symbols.
          </p>
          {serverError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
          )}
          <button
            type="submit"
            disabled={signUpForm.formState.isSubmitting}
            className="mt-4 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.99] disabled:opacity-60"
          >
            {signUpForm.formState.isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignIn ? "New to Shofast?" : "Already on Shofast?"}{" "}
        <Link
          to="/auth"
          search={{ mode: isSignIn ? "signup" : "signin" }}
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          {isSignIn ? "Create account" : "Sign in"}
        </Link>
      </p>

      <p className="mt-auto pb-6 pt-10 text-center text-[11px] text-muted-foreground">
        By continuing you agree to our Terms &amp; Privacy.
      </p>
    </div>
  );
}

function FormField({
  label,
  type,
  placeholder,
  autoComplete,
  autoCapitalize,
  inputMode,
  registration,
  error,
}: {
  label: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  autoCapitalize?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...registration}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize ?? "off"}
        autoCorrect="off"
        spellCheck={false}
        inputMode={inputMode}
        className={`w-full rounded-xl border px-4 py-3.5 text-base outline-none ring-ring focus:ring-2 ${
          error ? "border-destructive bg-destructive/5" : "border-input bg-card"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </label>
  );
}

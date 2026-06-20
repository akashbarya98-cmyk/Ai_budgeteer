"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function LoginScreen() {
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const name = email.split("@")[0].replace(/[._-]/g, " ");
      const pretty =
        name.charAt(0).toUpperCase() + name.slice(1) || "Team Lead";
      login(email, pretty);
      toast.success("Welcome back to AI Budgeteer!");
      setLoading(false);
    }, 900);
  };

  const handleSocial = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      login(`demo@${provider.toLowerCase()}.com`, "Team Lead");
      toast.success(`Signed in with ${provider}`);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--fire), transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-32 size-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--ember), transparent 70%)" }}
        aria-hidden
      />

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="flex-col gap-3" />
          <p className="mt-5 text-sm text-muted-foreground">
            Take control of your AI spend
          </p>
        </div>

        <div className="glass rounded-2xl border border-border/60 p-6 shadow-2xl shadow-fire/5 sm:p-8">
          <div className="mb-6 flex rounded-lg bg-muted/50 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group h-11 w-full bg-gradient-to-r from-fire to-ember text-white shadow-lg shadow-fire/30 transition-all hover:shadow-fire/50 hover:brightness-110"
            >
              {loading ? (
                <Sparkles className="size-4 animate-pulse" />
              ) : (
                <>
                  {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-border/60 bg-background/40 hover:border-fire/40 hover:bg-fire/5"
              onClick={() => handleSocial("Google")}
              disabled={loading}
            >
              <GoogleIcon /> Sign in with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-border/60 bg-background/40 hover:border-fire/40 hover:bg-fire/5"
              onClick={() => handleSocial("Microsoft")}
              disabled={loading}
            >
              <MicrosoftIcon /> Sign in with Microsoft
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <span className="cursor-pointer text-fire hover:underline">Terms</span> and{" "}
          <span className="cursor-pointer text-fire hover:underline">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="size-4" viewBox="0 0 23 23" aria-hidden>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

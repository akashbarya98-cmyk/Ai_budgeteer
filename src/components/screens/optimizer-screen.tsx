"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Coins,
  Cpu,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OptimizeResult {
  original: string;
  optimized: string;
  beforeWordCount: number;
  afterWordCount: number;
  beforeTokens: number;
  afterTokens: number;
  tokensSaved: number;
  beforeCost: number;
  afterCost: number;
  savingsPercent: number;
  beforeModel: string;
  afterModel: string;
  routedTo: string;
  reason: string;
}

const SAMPLE_PROMPT = `Please write a professional email to the client regarding the project delay considering various factors like weather conditions, team availability, and alternative timeline with resource reallocation and updated milestones.`;

export function OptimizerScreen() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<OptimizeResult | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      toast.error("Please paste a prompt to optimize");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Optimization failed");
      }
      const data: OptimizeResult = await res.json();
      setResult(data);
      if (data.savingsPercent >= 50) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1300);
      }
      toast.success(`Saved ${data.savingsPercent}% on this prompt!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const colors = ["var(--fire)", "var(--ember)", "var(--emerald-bud)", "var(--sky-info)"];
              const left = Math.random() * 100;
              const delay = Math.random() * 0.3;
              const color = colors[i % colors.length];
              return (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${left}%`,
                    top: "-10px",
                    background: color,
                    animationDelay: `${delay}s`,
                    borderRadius: i % 2 === 0 ? "50%" : "2px",
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Zap className="size-7 text-ember" />
          Prompt Optimizer
        </h1>
        <p className="text-sm text-muted-foreground">
          Compress prompts, route to cheaper models, and save tokens instantly.
        </p>
      </div>

      {/* Input */}
      <Card className="glass border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>Paste your prompt</CardTitle>
            <CardDescription>We&apos;ll compress it and pick the cheapest model that keeps quality.</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setPrompt(SAMPLE_PROMPT)}
          >
            Try sample
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your prompt here…"
            className="min-h-[140px] resize-y bg-background/40 text-sm leading-relaxed"
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Word count: <span className="font-medium text-foreground">{wordCount}</span>
            </span>
            <Button
              onClick={handleOptimize}
              disabled={loading || !prompt.trim()}
              className="group bg-gradient-to-r from-fire to-ember text-white shadow-lg shadow-fire/30 transition-all hover:shadow-fire/50 hover:brightness-110"
            >
              {loading ? (
                <>
                  <Sparkles className="size-4 animate-pulse" /> Optimizing…
                </>
              ) : (
                <>
                  <Zap className="size-4 transition-transform group-hover:scale-110" /> Optimize & Save Tokens
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="uppercase tracking-wide">After optimization</span>
              <ArrowDown className="size-4 text-emerald-bud" />
              <div className="h-px flex-1 bg-border" />
            </div>

            <Card className="glass border-emerald-bud/40">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-bud">
                    <CheckCircle2 className="size-4" /> Optimized prompt
                  </span>
                  <Badge className="bg-emerald-bud/15 text-emerald-bud hover:bg-emerald-bud/20">
                    {Math.round(
                      ((result.beforeWordCount - result.afterWordCount) /
                        Math.max(1, result.beforeWordCount)) *
                        100
                    )}
                    % less words
                  </Badge>
                </div>
                <p className="rounded-lg bg-background/40 p-4 font-mono text-sm leading-relaxed">
                  &ldquo;{result.optimized}&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Word count: {result.afterWordCount}</span>
                  <span>Tokens: {result.afterTokens}</span>
                </div>
              </CardContent>
            </Card>

            {/* Savings Breakdown */}
            <Card className="glass animate-glow-green overflow-hidden border-emerald-bud/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="size-5 text-emerald-bud" /> Savings Breakdown
                </CardTitle>
                <CardDescription>What changed and why</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Before / After cost */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Before</p>
                    <p className="mt-1 text-lg font-semibold">{result.beforeModel}</p>
                    <p className="mt-2 text-2xl font-bold text-fire">${result.beforeCost.toFixed(4)}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-bud/40 bg-emerald-bud/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-emerald-bud">After</p>
                    <p className="mt-1 text-lg font-semibold">{result.afterModel}</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-bud">${result.afterCost.toFixed(4)}</p>
                  </div>
                </div>

                {/* Big savings number */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-bud/15 to-transparent py-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">You saved</p>
                  <p className="text-5xl font-bold text-emerald-bud">
                    <AnimatedPercent value={result.savingsPercent} />%
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Sparkles className="size-3.5 text-ember" />
                    {result.tokensSaved} tokens saved
                  </p>
                </div>

                {/* Routing reason */}
                <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-ember" />
                  <div className="text-sm">
                    <p className="font-medium">Model routed: {result.routedTo}</p>
                    <p className="text-muted-foreground">{result.reason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty hint */}
      {!result && !loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Compress", desc: "Remove filler words automatically" },
            { icon: Cpu, title: "Route", desc: "Pick the cheapest fitting model" },
            { icon: Coins, title: "Save", desc: "See exact cost reduction" },
          ].map((f) => (
            <Card key={f.title} className="glass border-border/40">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid size-9 place-items-center rounded-lg bg-fire/10 text-fire">
                  <f.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Flame,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Cpu,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BurnRateChart } from "@/components/charts/burn-rate-chart";
import { ModelUsageChart } from "@/components/charts/model-usage-chart";
import { cn } from "@/lib/utils";

interface Kpis {
  spent: number;
  monthlyBudget: number;
  usagePercent: number;
  burnRatePerHour: number;
  daysLeft: number;
  trendVsYesterday: number;
}
interface BurnPoint {
  day: string;
  actual: number;
  optimized: number;
}
interface ModelSlice {
  name: string;
  value: number;
  color: string;
}
interface EfficiencyRow {
  team: string;
  score: number;
  saved: number;
  tokens: number;
  trend: string;
}
interface DashboardData {
  kpis: Kpis;
  burnRateSeries: BurnPoint[];
  modelUsage: ModelSlice[];
  efficiencyMini: EfficiencyRow[];
  alert: { level: string; message: string; suggestion: string };
}

function useDashboard() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then((d) => {
        if (active) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function DashboardScreen({ onNavigate }: { onNavigate: (s: "optimizer" | "leaderboard" | "settings") => void }) {
  const { data, loading, error } = useDashboard();

  if (error) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <AlertTriangle className="size-8 text-fire" />
        <p className="mt-3 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, <span className="text-gradient-fire">Team Lead</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your team&apos;s AI spend at a glance.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading || !data ? (
          <>
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
          </>
        ) : (
          <>
            <KpiCard
              icon={<DollarSign className="size-5" />}
              iconColor="text-emerald-bud"
              ring="ring-emerald-bud/20"
              label="Spent"
              big={
                <AnimatedNumber value={data.kpis.spent} prefix="$" />
              }
              sub={
                <span className="text-emerald-bud">
                  {data.kpis.usagePercent}% of ${data.kpis.monthlyBudget.toLocaleString()}
                </span>
              }
              index={0}
            />
            <KpiCard
              icon={<Flame className="size-5" />}
              iconColor="text-fire"
              ring="ring-fire/20"
              label="Burn Rate"
              big={
                <>
                  <AnimatedNumber value={data.kpis.burnRatePerHour} prefix="$" />
                  <span className="text-base font-normal text-muted-foreground">/hr</span>
                </>
              }
              sub={
                <span className="flex items-center gap-1 text-fire">
                  <TrendingUp className="size-3.5" />
                  +{data.kpis.trendVsYesterday}% vs yesterday
                </span>
              }
              index={1}
            />
            <KpiCard
              icon={<Clock className="size-5" />}
              iconColor="text-ember"
              ring="ring-ember/20"
              label="Days Left"
              big={<AnimatedNumber value={data.kpis.daysLeft} suffix=" days" />}
              sub={<span className="text-ember">Warning — pace slowing</span>}
              index={2}
            />
          </>
        )}
      </div>

      {/* Alert Banner */}
      {!loading && data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="animate-pulse-red flex flex-col gap-3 rounded-xl border border-fire/40 bg-fire/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-fire/20 text-fire">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                WARNING: {data.alert.message}
              </p>
              <p className="text-sm text-muted-foreground">{data.alert.suggestion}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onNavigate("settings")}
              className="bg-gradient-to-r from-fire to-ember text-white shadow-md shadow-fire/30 hover:brightness-110"
            >
              Switch models
            </Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("settings")}>
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* Burn Rate Chart */}
      <Card className="glass overflow-hidden border-border/60">
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-4 text-fire" /> Burn Rate
            </CardTitle>
            <CardDescription>Actual vs. optimized spend over 30 days</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-fire" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-bud" /> With AI Budgeteer
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loading || !data ? (
            <Skeleton className="h-[260px] w-full" />
          ) : (
            <BurnRateChart data={data.burnRateSeries} />
          )}
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Model Usage */}
        <Card className="glass border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="size-4 text-sky-info" /> Model Usage
            </CardTitle>
            <CardDescription>Distribution across models this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <div className="space-y-3">
                <Skeleton className="mx-auto size-[200px] rounded-full" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <ModelUsageChart data={data.modelUsage} />
                <div className="w-full flex-1 space-y-2">
                  {data.modelUsage.map((m) => (
                    <div key={m.name} className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                      <span className="flex items-center gap-2 text-sm">
                        <span className="size-2.5 rounded-full" style={{ background: m.color }} />
                        {m.name}
                      </span>
                      <span className="font-semibold">{m.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Efficiency Mini Leaderboard */}
        <Card className="glass border-border/60">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 text-ember" /> Efficiency
              </CardTitle>
              <CardDescription>Top teams this week</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-fire" onClick={() => onNavigate("leaderboard")}>
              View all <ArrowRight className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || !data
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              : data.efficiencyMini.map((row, i) => (
                  <div
                    key={row.team}
                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-3 transition-colors hover:border-fire/40"
                  >
                    <div
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold",
                        i === 0 && "bg-ember/20 text-ember",
                        i === 1 && "bg-muted-foreground/20 text-muted-foreground",
                        i === 2 && "bg-fire/20 text-fire"
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium">{row.team}</p>
                        <span className="font-bold">{row.score}/100</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fire to-ember"
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>${row.saved.toLocaleString()} saved</span>
                        <span className="flex items-center gap-1">
                          {row.trend === "up" ? (
                            <TrendingUp className="size-3 text-emerald-bud" />
                          ) : row.trend === "down" ? (
                            <TrendingDown className="size-3 text-fire" />
                          ) : (
                            <span className="text-muted-foreground">→</span>
                          )}
                          {(row.tokens / 1000).toFixed(0)}K tokens
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  iconColor,
  ring,
  label,
  big,
  sub,
  index,
}: {
  icon: React.ReactNode;
  iconColor: string;
  ring: string;
  label: string;
  big: React.ReactNode;
  sub: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card className={cn("glass group relative overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-1", ring)}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <div className={cn("grid size-9 place-items-center rounded-lg bg-muted/50", iconColor)}>
              {icon}
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {big}
          </div>
          <div className="mt-1.5 text-xs font-medium">{sub}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkeletonKpi() {
  return (
    <Card className="glass border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-9 w-32" />
        <Skeleton className="mt-2 h-3 w-24" />
      </CardContent>
    </Card>
  );
}

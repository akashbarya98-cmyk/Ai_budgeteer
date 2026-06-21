"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Team {
  rank: number;
  team: string;
  score: number;
  saved: number;
  tokens: number;
  trend: string;
  trendDelta: string;
  tasksCompleted: number;
}
interface Criterion {
  label: string;
  description: string;
  weight: number;
}
interface LeaderboardData {
  weekLabel: string;
  headline: string;
  teams: Team[];
  scoringCriteria: Criterion[];
}

function useLeaderboard() {
  const [data, setData] = React.useState<LeaderboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  return { data, loading };
}

const medalColor = (rank: number) => {
  if (rank === 1) return "from-ember to-yellow-500";
  if (rank === 2) return "from-slate-300 to-slate-500";
  if (rank === 3) return "from-orange-400 to-amber-700";
  return "from-muted-foreground/40 to-muted-foreground/20";
};

const rankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

export function LeaderboardScreen() {
  const { data, loading } = useLeaderboard();
  const top3 = data?.teams.slice(0, 3) ?? [];
  const rest = data?.teams.slice(3) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Trophy className="size-7 text-ember" /> Efficiency Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          {data?.weekLabel ?? "This week"}:{" "}
          <span className="font-medium text-foreground">{data?.headline ?? "Engineering leads!"}</span>
        </p>
      </div>

      {/* Top 3 podium cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)
          : top3.map((team, i) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={cn(
                    "glass relative overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl",
                    team.rank === 1 && "border-ember/50 ring-1 ring-ember/30"
                  )}
                >
                  {team.rank === 1 && (
                    <div className="absolute right-3 top-3 text-ember">
                      <Crown className="size-5" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "grid size-12 place-items-center rounded-xl bg-gradient-to-br text-2xl shadow-lg",
                          medalColor(team.rank)
                        )}
                      >
                        {rankEmoji(team.rank) ?? `#${team.rank}`}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          #{team.rank}
                        </p>
                        <p className="text-lg font-bold">{team.team}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-bold">{team.score}/100</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${team.score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            team.rank === 1
                              ? "bg-gradient-to-r from-ember to-fire"
                              : team.rank === 2
                                ? "bg-gradient-to-r from-slate-400 to-slate-300"
                                : "bg-gradient-to-r from-amber-600 to-orange-400"
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-emerald-bud">
                        ${team.saved.toLocaleString()} saved
                      </span>
                      <span className="text-muted-foreground">
                        {(team.tokens / 1000).toFixed(0)}K tokens
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <TrendIcon trend={team.trend} />
                      <span
                        className={cn(
                          team.trend === "up" && "text-emerald-bud",
                          team.trend === "down" && "text-fire",
                          team.trend === "stable" && "text-muted-foreground"
                        )}
                      >
                        {team.trend === "up"
                          ? "Trending up"
                          : team.trend === "down"
                            ? "Trending down"
                            : "Stable"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Rest of the rankings */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>All teams ranked by efficiency score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)
            : rest.map((team, i) => (
                <motion.div
                  key={team.team}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-fire/40 hover:bg-muted/40"
                >
                  <span className="w-8 text-center text-sm font-bold text-muted-foreground">
                    #{team.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium">{team.team}</p>
                      <span className="font-bold">{team.score}/100</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fire to-ember"
                        style={{ width: `${team.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    <p className="text-emerald-bud">${team.saved.toLocaleString()}</p>
                    <p>{(team.tokens / 1000).toFixed(0)}K tokens</p>
                  </div>
                  <div className="flex w-16 items-center justify-end gap-1 text-xs">
                    <TrendIcon trend={team.trend} />
                    <span
                      className={cn(
                        team.trend === "up" && "text-emerald-bud",
                        team.trend === "down" && "text-fire",
                        team.trend === "stable" && "text-muted-foreground"
                      )}
                    >
                      {team.trendDelta}
                    </span>
                  </div>
                </motion.div>
              ))}
        </CardContent>
      </Card>

      {/* How scoring works */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="size-4 text-sky-info" /> How Scoring Works
          </CardTitle>
          <CardDescription>Transparent, no black-box algorithm</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(data?.scoringCriteria ?? []).map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3"
            >
              <Badge variant="secondary" className="mt-0.5 shrink-0">
                {c.weight}%
              </Badge>
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="size-3.5 text-emerald-bud" />;
  if (trend === "down") return <TrendingDown className="size-3.5 text-fire" />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

import { NextResponse } from "next/server";

// Mock dashboard data — in production this would come from a database
export async function GET() {
  const monthlyBudget = 50000;
  const spent = 42300;
  const burnRatePerHour = 2115;
  const daysLeft = 18;

  const usagePercent = (spent / monthlyBudget) * 100;

  // 30-day burn rate series — actual vs optimized
  const burnRateSeries = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const base = 800 + i * 45;
    const noise = Math.sin(i / 2) * 180 + Math.cos(i / 3) * 90;
    const actual = Math.max(400, Math.round(base + noise));
    const optimized = Math.round(actual * (0.55 + (i / 30) * 0.12));
    return {
      day: `D${day}`,
      actual,
      optimized,
    };
  });

  const modelUsage = [
    { name: "llama-3.1-8b", value: 45, color: "var(--fire)" },
    { name: "mixtral-8x7b", value: 30, color: "var(--ember)" },
    { name: "llama-3.1-70b", value: 25, color: "var(--sky-info)" },
  ];

  const efficiencyMini = [
    { team: "Engineering", score: 94, saved: 45200, tokens: 125000, trend: "up" },
    { team: "HR", score: 91, saved: 18700, tokens: 42000, trend: "up" },
    { team: "Marketing", score: 87, saved: 38100, tokens: 98000, trend: "stable" },
  ];

  return NextResponse.json({
    kpis: {
      spent,
      monthlyBudget,
      usagePercent: Number(usagePercent.toFixed(1)),
      burnRatePerHour,
      daysLeft,
      trendVsYesterday: 12,
    },
    burnRateSeries,
    modelUsage,
    efficiencyMini,
    alert: {
      level: "warning",
      message: `Budget ${usagePercent.toFixed(1)}% used.`,
      suggestion: "Switch to cheaper models?",
    },
  });
}

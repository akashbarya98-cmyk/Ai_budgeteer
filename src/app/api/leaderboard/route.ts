import { NextResponse } from "next/server";

export async function GET() {
  const teams = [
    {
      rank: 1,
      team: "Engineering",
      score: 94,
      saved: 45200,
      tokens: 125000,
      trend: "up",
      trendDelta: "+8",
      tasksCompleted: 1240,
    },
    {
      rank: 2,
      team: "HR",
      score: 91,
      saved: 18700,
      tokens: 42000,
      trend: "up",
      trendDelta: "+5",
      tasksCompleted: 540,
    },
    {
      rank: 3,
      team: "Marketing",
      score: 87,
      saved: 38100,
      tokens: 98000,
      trend: "stable",
      trendDelta: "0",
      tasksCompleted: 870,
    },
    {
      rank: 4,
      team: "Finance",
      score: 85,
      saved: 22400,
      tokens: 61000,
      trend: "down",
      trendDelta: "-3",
      tasksCompleted: 690,
    },
    {
      rank: 5,
      team: "Sales",
      score: 72,
      saved: 9800,
      tokens: 28000,
      trend: "down",
      trendDelta: "-6",
      tasksCompleted: 410,
    },
    {
      rank: 6,
      team: "Operations",
      score: 68,
      saved: 7200,
      tokens: 22000,
      trend: "up",
      trendDelta: "+2",
      tasksCompleted: 330,
    },
    {
      rank: 7,
      team: "Design",
      score: 64,
      saved: 5400,
      tokens: 19000,
      trend: "stable",
      trendDelta: "0",
      tasksCompleted: 280,
    },
  ];

  const scoringCriteria = [
    {
      label: "Tokens per task",
      description: "Lower is better — efficient prompt usage",
      weight: 35,
    },
    {
      label: "Cost per quality score",
      description: "Bang for the buck — spending vs. output quality",
      weight: 30,
    },
    {
      label: "Prompt optimization adoption",
      description: "% of prompts run through the optimizer",
      weight: 20,
    },
    {
      label: "Consistent daily habits",
      description: "Steady usage patterns, no spikes",
      weight: 15,
    },
  ];

  return NextResponse.json({
    weekLabel: "This week",
    headline: "Engineering leads!",
    teams,
    scoringCriteria,
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  // Recent alert activity feed
  const alerts = [
    {
      id: "a1",
      level: "critical" as const,
      title: "Budget 84.6% used",
      action: "Auto-switched to mini models",
      time: "2 hours ago",
    },
    {
      id: "a2",
      level: "warning" as const,
      title: "Burn rate +12% vs yesterday",
      action: "Team notification sent",
      time: "5 hours ago",
    },
    {
      id: "a3",
      level: "info" as const,
      title: "Weekly efficiency report ready",
      action: "Engineering leads this week",
      time: "1 day ago",
    },
    {
      id: "a4",
      level: "warning" as const,
      title: "Marketing team hit 78% of budget",
      action: "Lead notified via email",
      time: "2 days ago",
    },
  ];

  return NextResponse.json({ alerts });
}

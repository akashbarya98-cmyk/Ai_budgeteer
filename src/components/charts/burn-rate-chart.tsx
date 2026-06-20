"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface DataPoint {
  day: string;
  actual: number;
  optimized: number;
}

const config = {
  actual: { label: "Actual", color: "var(--fire)" },
  optimized: { label: "With AI Budgeteer", color: "var(--emerald-bud)" },
} satisfies ChartConfig;

export function BurnRateChart({ data }: { data: DataPoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
      <AreaChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--fire)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--fire)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillOptimized" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--emerald-bud)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--emerald-bud)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={4}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          width={44}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickFormatter={(v) => `$${v}`}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => `Day ${payload?.[0]?.payload?.day?.replace("D", "")}`}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="actual"
          stroke="var(--fire)"
          strokeWidth={2}
          fill="url(#fillActual)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--fire)" }}
        />
        <Area
          type="monotone"
          dataKey="optimized"
          stroke="var(--emerald-bud)"
          strokeWidth={2}
          fill="url(#fillOptimized)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--emerald-bud)" }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

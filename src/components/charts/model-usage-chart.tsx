"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, type TooltipProps } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface ModelSlice {
  name: string;
  value: number;
  color: string;
}

const config = {
  usage: { label: "Usage" },
} satisfies ChartConfig;

export function ModelUsageChart({ data }: { data: ModelSlice[] }) {
  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[200px]">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="name" formatter={(value) => `${value}%`} />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

"use client";

import { Flame, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { box: "size-8", flame: "size-4", text: "text-base" },
    md: { box: "size-10", flame: "size-5", text: "text-lg" },
    lg: { box: "size-16", flame: "size-8", text: "text-3xl" },
  }[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-xl bg-gradient-to-br from-fire to-ember shadow-lg shadow-fire/30",
          dims.box
        )}
      >
        <Flame className={cn("text-white", dims.flame)} strokeWidth={2.5} />
        <ShieldCheck
          className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-background p-[1px] text-emerald-bud"
          strokeWidth={3}
        />
      </div>
      {size !== "sm" && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight", dims.text)}>
            AI <span className="text-gradient-fire">BUDGETEER</span>
          </span>
          {size === "lg" && (
            <span className="text-xs text-muted-foreground mt-1">
              Take control of your AI spend
            </span>
          )}
        </div>
      )}
    </div>
  );
}

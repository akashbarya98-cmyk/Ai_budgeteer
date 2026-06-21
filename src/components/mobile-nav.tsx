"use client";

import { motion } from "framer-motion";
import { Home, Zap, Trophy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScreenId } from "@/lib/store";

interface MobileNavProps {
  active: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

const items = [
  { id: "dashboard" as const, label: "Home", icon: Home },
  { id: "optimizer" as const, label: "Optimize", icon: Zap },
  { id: "leaderboard" as const, label: "Leader", icon: Trophy },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

export function MobileNav({ active, onNavigate }: MobileNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 glass-strong md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-fire"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  className="pointer-events-none absolute inset-x-2 inset-y-1 -z-10 rounded-lg bg-fire/10 ring-1 ring-fire/25"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn("size-5 transition-transform", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

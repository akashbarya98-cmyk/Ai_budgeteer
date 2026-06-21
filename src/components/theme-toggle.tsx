"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative size-9 rounded-full border border-border/60 hover:border-fire/50 hover:bg-fire/10 transition-colors ${className ?? ""}`}
    >
      {mounted ? (
        isDark ? (
          <Moon className="size-4 text-fire" />
        ) : (
          <Sun className="size-4 text-ember" />
        )
      ) : (
        <div className="size-4" />
      )}
    </Button>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type NavId = "dashboard" | "optimizer" | "leaderboard" | "settings";

interface AppHeaderProps {
  onNavigate: (screen: NavId) => void;
}

const NAV_ITEMS: { id: NavId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "optimizer", label: "Optimizer" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "settings", label: "Settings" },
];

export function AppHeader({ onNavigate }: AppHeaderProps) {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const activeScreen = useAppStore((s) => s.activeScreen);

  // Determine the active nav tab. activeScreen isn't persisted, so on reload
  // it may be "login" even though the user is authenticated — default to dashboard.
  const activeNav: NavId = NAV_ITEMS.some((n) => n.id === activeScreen)
    ? (activeScreen as NavId)
    : "dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          onClick={() => onNavigate("dashboard")}
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="Go to dashboard"
        >
          <Logo size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:flex" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-fire"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {/* Sliding pill background */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-fire/10 ring-1 ring-fire/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {/* Glowing bottom indicator */}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="pointer-events-none absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-fire to-ember shadow-[0_0_10px_2px_var(--fire)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 rounded-full border border-border/60 hover:border-fire/50"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-fire text-[10px] font-bold text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex w-full items-center gap-2">
                    <span className="size-2 rounded-full bg-fire" />
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <p className="text-sm font-medium">Budget 84.6% used</p>
                  <p className="text-xs text-muted-foreground">Auto-switched to mini models</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex w-full items-center gap-2">
                    <span className="size-2 rounded-full bg-ember" />
                    <span className="text-xs text-muted-foreground">5h ago</span>
                  </div>
                  <p className="text-sm font-medium">Burn rate +12% vs yesterday</p>
                  <p className="text-xs text-muted-foreground">Team notification sent</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex w-full items-center gap-2">
                    <span className="size-2 rounded-full bg-sky-info" />
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <p className="text-sm font-medium">Weekly efficiency report</p>
                  <p className="text-xs text-muted-foreground">Engineering leads this week</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 rounded-full border border-border/60 px-2 pr-3 hover:border-fire/50">
                <div className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-fire to-ember text-xs font-bold text-white">
                  {user?.name?.[0] ?? "U"}
                </div>
                <span className="hidden text-sm font-medium sm:inline">{user?.name ?? "User"}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onNavigate("settings")}
                className="cursor-pointer"
              >
                <UserIcon className="size-4" /> Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-fire focus:text-fire"
              >
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

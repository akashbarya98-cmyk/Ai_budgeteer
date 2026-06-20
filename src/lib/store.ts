"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ScreenId =
  | "login"
  | "dashboard"
  | "optimizer"
  | "leaderboard"
  | "settings";

export type UserRole = "CFO" | "Team Lead" | "Engineer";

export interface BudgetThreshold {
  percent: number;
  level: "info" | "warning" | "critical" | "block";
  action: string;
  enabled: boolean;
}

export interface ModelPolicy {
  id: string;
  name: string;
  status: "default" | "medium" | "approval" | "disabled";
  description: string;
  costPer1k: number;
}

export interface AlertItem {
  id: string;
  level: "info" | "warning" | "critical";
  title: string;
  action: string;
  time: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole; team: string } | null;

  // Navigation
  activeScreen: ScreenId;

  // Settings (persisted)
  monthlyBudget: number;
  teamName: string;
  thresholds: BudgetThreshold[];
  modelPolicy: ModelPolicy[];
  alerts: AlertItem[];

  // Actions
  login: (email: string, name?: string) => void;
  logout: () => void;
  setScreen: (screen: ScreenId) => void;
  setMonthlyBudget: (amount: number) => void;
  setTeamName: (team: string) => void;
  toggleThreshold: (percent: number) => void;
  setModelStatus: (id: string, status: ModelPolicy["status"]) => void;
  saveSettings: () => void;
}

const defaultThresholds: BudgetThreshold[] = [
  {
    percent: 50,
    level: "info",
    action: "Info notification",
    enabled: true,
  },
  {
    percent: 75,
    level: "warning",
    action: "Warning email to lead",
    enabled: true,
  },
  {
    percent: 90,
    level: "critical",
    action: "Auto-switch to cheapest models",
    enabled: true,
  },
  {
    percent: 100,
    level: "block",
    action: "Block all non-essential requests",
    enabled: true,
  },
];

const defaultModelPolicy: ModelPolicy[] = [
  {
    id: "llama-8b",
    name: "llama-3.1-8b",
    status: "default",
    description: "Default model — low complexity tasks",
    costPer1k: 0.0002,
  },
  {
    id: "mixtral",
    name: "mixtral-8x7b",
    status: "medium",
    description: "Medium tasks — balanced quality",
    costPer1k: 0.0009,
  },
  {
    id: "llama-70b",
    name: "llama-3.1-70b",
    status: "approval",
    description: "High complexity — approval required",
    costPer1k: 0.0048,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    status: "disabled",
    description: "Disabled — too expensive",
    costPer1k: 0.012,
  },
];

const defaultAlerts: AlertItem[] = [
  {
    id: "a1",
    level: "critical",
    title: "Budget 84.6% used",
    action: "Auto-switched to mini models",
    time: "2 hours ago",
  },
  {
    id: "a2",
    level: "warning",
    title: "Burn rate +12% vs yesterday",
    action: "Team notification sent",
    time: "5 hours ago",
  },
  {
    id: "a3",
    level: "info",
    title: "Weekly efficiency report ready",
    action: "Engineering leads this week",
    time: "1 day ago",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      activeScreen: "login",
      monthlyBudget: 50000,
      teamName: "Engineering",
      thresholds: defaultThresholds,
      modelPolicy: defaultModelPolicy,
      alerts: defaultAlerts,

      login: (email, name) =>
        set({
          isAuthenticated: true,
          activeScreen: "dashboard",
          user: {
            email,
            name: name ?? "Team Lead",
            role: "Team Lead",
            team: "Engineering",
          },
        }),
      logout: () =>
        set({ isAuthenticated: false, user: null, activeScreen: "login" }),
      setScreen: (screen) => set({ activeScreen: screen }),
      setMonthlyBudget: (amount) => set({ monthlyBudget: amount }),
      setTeamName: (team) => set({ teamName: team }),
      toggleThreshold: (percent) =>
        set((s) => ({
          thresholds: s.thresholds.map((t) =>
            t.percent === percent ? { ...t, enabled: !t.enabled } : t
          ),
        })),
      setModelStatus: (id, status) =>
        set((s) => ({
          modelPolicy: s.modelPolicy.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        })),
      saveSettings: () => {
        /* no-op — settings persist automatically */
      },
    }),
    {
      name: "ai-budgeteer-store",
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        monthlyBudget: s.monthlyBudget,
        teamName: s.teamName,
        thresholds: s.thresholds,
        modelPolicy: s.modelPolicy,
      }),
    }
  )
);

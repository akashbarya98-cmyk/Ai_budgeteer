"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/app-header";
import { MobileNav } from "@/components/mobile-nav";
import { LoginScreen } from "@/components/screens/login-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { OptimizerScreen } from "@/components/screens/optimizer-screen";
import { LeaderboardScreen } from "@/components/screens/leaderboard-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import { useAppStore, type ScreenId } from "@/lib/store";

export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const activeScreen = useAppStore((s) => s.activeScreen);
  const setScreen = useAppStore((s) => s.setScreen);

  // Hydration-safe: render after mount to avoid mismatch with persisted store
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="size-8 animate-pulse rounded-full bg-fire/30" />
      </div>
    );
  }

  // Not authenticated → login screen (full bleed)
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const navigate = (s: ScreenId) => setScreen(s);
  const screenKey = activeScreen;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader onNavigate={navigate} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeScreen === "dashboard" && (
              <DashboardScreen onNavigate={navigate} />
            )}
            {activeScreen === "optimizer" && <OptimizerScreen />}
            {activeScreen === "leaderboard" && <LeaderboardScreen />}
            {activeScreen === "settings" && <SettingsScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <MobileNav active={activeScreen} onNavigate={navigate} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} AI Budgeteer — Take control of your AI spend.</p>
        <div className="flex items-center gap-4">
          <span className="cursor-pointer transition-colors hover:text-foreground">Privacy</span>
          <span className="cursor-pointer transition-colors hover:text-foreground">Terms</span>
          <span className="cursor-pointer transition-colors hover:text-foreground">Docs</span>
        </div>
      </div>
    </footer>
  );
}

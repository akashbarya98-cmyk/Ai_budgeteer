"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Save,
  AlertTriangle,
  Bell,
  History,
  Cpu,
  Check,
  X,
  AlertOctagon,
  Info,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, type BudgetThreshold, type ModelPolicy } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const levelMeta: Record<
  BudgetThreshold["level"],
  { color: string; bg: string; border: string; icon: React.ElementType; label: string; dot: string }
> = {
  info: {
    color: "text-sky-info",
    bg: "bg-sky-info/10",
    border: "border-sky-info/40",
    icon: Info,
    label: "Info",
    dot: "bg-sky-info",
  },
  warning: {
    color: "text-ember",
    bg: "bg-ember/10",
    border: "border-ember/40",
    icon: AlertTriangle,
    label: "Warning",
    dot: "bg-ember",
  },
  critical: {
    color: "text-fire",
    bg: "bg-fire/10",
    border: "border-fire/40",
    icon: ShieldAlert,
    label: "Critical",
    dot: "bg-fire",
  },
  block: {
    color: "text-fire",
    bg: "bg-fire/15",
    border: "border-fire/60",
    icon: AlertOctagon,
    label: "Block",
    dot: "bg-fire",
  },
};

const statusMeta: Record<
  ModelPolicy["status"],
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  default: { label: "Default", icon: Check, color: "text-emerald-bud", bg: "bg-emerald-bud/10" },
  medium: { label: "Medium tasks", icon: Check, color: "text-sky-info", bg: "bg-sky-info/10" },
  approval: { label: "Approval req.", icon: AlertTriangle, color: "text-ember", bg: "bg-ember/10" },
  disabled: { label: "Disabled", icon: X, color: "text-fire", bg: "bg-fire/10" },
};

export function SettingsScreen() {
  const {
    teamName,
    monthlyBudget,
    thresholds,
    modelPolicy,
    alerts,
    setTeamName,
    setMonthlyBudget,
    toggleThreshold,
    setModelStatus,
  } = useAppStore();

  const [localBudget, setLocalBudget] = React.useState(String(monthlyBudget));
  const [localTeam, setLocalTeam] = React.useState(teamName);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setLocalBudget(String(monthlyBudget));
    setLocalTeam(teamName);
  }, [monthlyBudget, teamName]);

  const handleSave = () => {
    setSaving(true);
    const amount = Number(localBudget);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid budget amount");
      setSaving(false);
      return;
    }
    setTimeout(() => {
      setMonthlyBudget(amount);
      setTeamName(localTeam.trim() || "Engineering");
      setSaving(false);
      toast.success("Settings saved");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <SettingsIcon className="size-7 text-fire" /> Budget Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure thresholds, model access, and review alert history.
        </p>
      </div>

      {/* Team & Budget */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle>Team & Monthly Budget</CardTitle>
          <CardDescription>Set the team name and budget cap for this cycle.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              value={localTeam}
              onChange={(e) => setLocalTeam(e.target.value)}
              className="bg-background/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget (USD)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="budget"
                type="number"
                min={0}
                value={localBudget}
                onChange={(e) => setLocalBudget(e.target.value)}
                className="bg-background/40 pl-7"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-4 text-ember" /> Alert Thresholds
          </CardTitle>
          <CardDescription>What happens when budget is reached.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {thresholds.map((t) => {
            const meta = levelMeta[t.level];
            const Icon = meta.icon;
            return (
              <motion.div
                key={t.percent}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                  meta.border,
                  meta.bg,
                  !t.enabled && "opacity-50"
                )}
              >
                <div className={cn("grid size-9 shrink-0 place-items-center rounded-lg", meta.bg, meta.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.percent}%</span>
                    <Badge variant="outline" className={cn("border-current", meta.color)}>
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{t.action}</p>
                </div>
                <Switch
                  checked={t.enabled}
                  onCheckedChange={() => toggleThreshold(t.percent)}
                  aria-label={`Toggle ${t.percent}% threshold`}
                />
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Model Access Policy */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="size-4 text-sky-info" /> Model Access Policy
          </CardTitle>
          <CardDescription>Control which models your team can use.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {modelPolicy.map((m) => {
            const meta = statusMeta[m.status];
            const Icon = meta.icon;
            return (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-3 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className={cn("grid size-9 shrink-0 place-items-center rounded-lg", meta.bg, meta.color)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    ${m.costPer1k.toFixed(4)}/1K
                  </span>
                  <Select
                    value={m.status}
                    onValueChange={(v) => setModelStatus(m.id, v as ModelPolicy["status"])}
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="medium">Medium tasks</SelectItem>
                      <SelectItem value="approval">Approval req.</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-fire to-ember text-white shadow-lg shadow-fire/30 hover:brightness-110"
        >
          {saving ? (
            <>
              <SettingsIcon className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Active Alerts / History */}
      <Card className="glass border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-4 text-ember" /> Active Alerts
          </CardTitle>
          <CardDescription>Recent alert activity and actions taken.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.map((a) => {
            const meta = levelMeta[a.level];
            const Icon = meta.icon;
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  meta.border,
                  meta.bg
                )}
              >
                <div className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", meta.bg, meta.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-xs font-bold uppercase", meta.color)}>
                      {meta.label}
                    </span>
                    <span className="text-sm font-medium">{a.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Action: {a.action}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Time: {a.time}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

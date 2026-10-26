"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  Bot,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: "dashboard" | "directory" | "playbooks" | "copilot";
  onSelectView: (view: "dashboard" | "directory" | "playbooks" | "copilot") => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenQuickCopilot: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  onToggleTheme,
  onOpenQuickCopilot,
}) => {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Executive Intelligence",
      icon: LayoutDashboard,
      badge: "Real-time",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "directory" as const,
      label: "At-Risk Directory",
      icon: Users,
      badge: "84 at risk",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      id: "playbooks" as const,
      label: "Retention Playbooks",
      icon: BookOpenCheck,
      badge: "6 playbooks",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "copilot" as const,
      label: "AI Retention Copilot",
      icon: Bot,
      badge: "GPT-4o",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col justify-between border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 z-30 select-none",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 min-w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
              <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">RetainPulse</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Customer Retention Intel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 text-white border border-indigo-500/30 shadow-md shadow-indigo-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 group-hover:text-white group-hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{item.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        item.badgeColor
                      )}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Telemetry Summary & Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        {!isCollapsed && (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/20 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingDown className="w-16 h-16 text-rose-400" />
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                At-Risk Telemetry
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold text-white tracking-tight">$153.5k <span className="text-xs text-slate-400 font-normal">MRR at stake</span></div>
              <p className="text-[11px] text-slate-400 leading-snug">
                84 accounts flagged • 18 critical urgency
              </p>
            </div>

            <button
              onClick={onOpenQuickCopilot}
              className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              Simulate Retention ROI
            </button>
          </div>
        )}

        {/* User & Mode Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
              JD
            </div>
            {!isCollapsed && (
              <div className="truncate text-left leading-tight">
                <div className="text-xs font-semibold text-white truncate">Jessica Davis</div>
                <div className="text-[10px] text-slate-400 truncate">VP Customer Retention</div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { liveAlertsData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface HeaderProps {
  currentView: "dashboard" | "directory" | "playbooks" | "copilot";
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (tf: string) => void;
  onOpenQuickCopilot: () => void;
  onSelectCustomerById?: (customerId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  selectedTimeframe,
  onTimeframeChange,
  onOpenQuickCopilot,
  onSelectCustomerById,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scanToast, setScanToast] = useState(false);

  const viewTitles = {
    dashboard: {
      title: "Executive Intelligence Dashboard",
      subtitle: "Enterprise telemetry analysis, ARR churn exposure & predictive attrition forecast",
    },
    directory: {
      title: "At-Risk Customers Directory",
      subtitle: "Multi-dimensional behavioral health scores, telemetry triggers & account diagnostics",
    },
    playbooks: {
      title: "Retention Strategies & Campaign Playbooks",
      subtitle: "Targeted commercial incentives, success war rooms, and automated outreach engines",
    },
    copilot: {
      title: "AI Retention Copilot",
      subtitle: "Conversational subscriber diagnostics, what-if revenue simulations & dynamic email drafting",
    },
  };

  const handleRunScan = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setScanToast(true);
      setTimeout(() => setScanToast(false), 4000);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title area */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {viewTitles[currentView].title}
            </h1>
            <Badge variant="healthy" className="hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry Sync
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{viewTitles[currentView].subtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search accounts, tags, CSM..."
              className="w-full bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Timeframe Selector */}
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="30d">Last 30 Days</option>
            <option value="quarter">Q4 2026 (Quarterly)</option>
            <option value="ytd">Year-to-Date</option>
            <option value="forecast90">Next 90 Days Forecast</option>
          </select>

          {/* Live Alerts Notification Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="View behavioral trigger alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {liveAlertsData.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-white">Critical Telemetry Alerts</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{liveAlertsData.length} unhandled</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {liveAlertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
                      onClick={() => {
                        setShowNotifications(false);
                        if (onSelectCustomerById) {
                          if (alert.company === "Acme Cloud Systems") onSelectCustomerById("cust-1");
                          else if (alert.company === "Synthetix AI") onSelectCustomerById("cust-2");
                          else if (alert.company === "OmniStream Media") onSelectCustomerById("cust-3");
                          else if (alert.company === "FinEdge Capital") onSelectCustomerById("cust-4");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {alert.company}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{alert.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-400">
                          {formatCurrency(alert.mrr)} MRR
                        </span>
                        <span className="text-[10px] text-indigo-400 group-hover:underline flex items-center gap-1 font-medium">
                          {alert.action} <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Scan Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunScan}
            isLoading={isRefreshing}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Run Telemetry Scan
          </Button>

          {/* Copilot Launcher */}
          <Button
            variant="cyan"
            size="sm"
            onClick={onOpenQuickCopilot}
            className="text-xs shadow-cyan-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            AI Copilot
          </Button>
        </div>
      </div>

      {/* Floating Feedback Notification */}
      {scanToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white">Telemetry Pipeline Synced</div>
            <div className="text-[11px] text-slate-300">
              Evaluated 1,240 subscriber logs. 18 critical alerts updated.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

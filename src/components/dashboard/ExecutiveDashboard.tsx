"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  DollarSign,
  Users,
  Zap,
  ArrowUpRight,
  Filter,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  initialExecutiveMetrics,
  riskDistributionData,
  rootCausesData,
  mrrAttritionForecast,
  liveAlertsData,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface ExecutiveDashboardProps {
  onNavigateToDirectory: (filterTier?: string) => void;
  onNavigateToPlaybooks: (category?: string) => void;
  onOpenCustomerProfile: (customerId: string) => void;
  onOpenCopilotWithPrompt: (prompt: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onNavigateToDirectory,
  onNavigateToPlaybooks,
  onOpenCustomerProfile,
  onOpenCopilotWithPrompt,
}) => {
  const [forecastMode, setForecastMode] = useState<"both" | "without" | "with">("both");
  const [selectedRiskTier, setSelectedRiskTier] = useState<string | null>(null);

  const filteredRiskData = selectedRiskTier
    ? riskDistributionData.filter((item) => item.tier === selectedRiskTier)
    : riskDistributionData;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* SECTION 1: Top Metric Cards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Churn Rate */}
        <Card className="hover:border-slate-700/80 transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Churn Rate
              </span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {initialExecutiveMetrics.churnRate}%
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                {Math.abs(initialExecutiveMetrics.churnRateChange)}% MoM
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Benchmark target: &lt; 4.0%</span>
              <span className="text-emerald-400 font-medium">Trending Down</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: At-Risk MRR / ARR */}
        <Card className="hover:border-slate-700/80 transition-all glow-rose">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                At-Risk MRR / ARR
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-400 tracking-tight">
                {formatCurrency(initialExecutiveMetrics.atRiskMRR)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({formatCurrency(initialExecutiveMetrics.atRiskARR)} ARR)
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Revenue at stake</span>
              <span className="text-rose-400 font-medium">10.7% of total MRR</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: High-Risk Accounts Count */}
        <Card
          className="hover:border-slate-700/80 transition-all cursor-pointer group"
          onClick={() => onNavigateToDirectory("critical")}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                High-Risk Accounts
              </span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {initialExecutiveMetrics.atRiskAccountsCount}
              </span>
              <span className="text-xs text-slate-400">
                / {initialExecutiveMetrics.totalAccounts} total
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-rose-400 font-medium">18 Critical (&gt;80% risk)</span>
              <span className="text-indigo-400 group-hover:underline flex items-center gap-0.5">
                View Directory <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: NRR & Retention ROI */}
        <Card className="hover:border-slate-700/80 transition-all glow-emerald">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Net Retention (NRR)
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {initialExecutiveMetrics.nrr}%
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {formatPercent(initialExecutiveMetrics.nrrChange, true)} YoY
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Saved YTD: <strong className="text-slate-200">{formatCurrency(initialExecutiveMetrics.savedArrYTD)}</strong></span>
              <span className="text-emerald-400 font-semibold">{initialExecutiveMetrics.retentionRoi} Campaign ROI</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Risk Breakdown Donut Chart (5 Cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Risk Partitioning</CardTitle>
                <CardDescription>
                  Dynamic subscriber distribution across AI risk tiers
                </CardDescription>
              </div>
              {selectedRiskTier && (
                <button
                  onClick={() => setSelectedRiskTier(null)}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Filter className="w-3 h-3" /> Reset Filter
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    onClick={(entry: any) => {
                      if (entry && entry.tier) {
                        setSelectedRiskTier(entry.tier);
                      }
                    }}
                    cursor="pointer"
                  >
                    {filteredRiskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              {data.name}
                            </div>
                            <div className="text-slate-300">
                              Accounts: <strong className="text-white">{data.value}</strong>
                            </div>
                            <div className="text-slate-300">
                              MRR at stake:{" "}
                              <strong className="text-emerald-400">
                                {formatCurrency(data.mrr)}
                              </strong>
                            </div>
                            <div className="text-[10px] text-indigo-300 pt-1">
                              Click to drill down into directory
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-slate-300 mr-2">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick interactive tier pills */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
              {riskDistributionData.map((item) => (
                <div
                  key={item.tier}
                  onClick={() => onNavigateToDirectory(item.tier)}
                  className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                      {item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{item.value}</div>
                    <div className="text-[10px] text-slate-400">{formatCurrency(item.mrr)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Primary Root Causes Distribution (7 Cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Root Cause Attrition Analysis</CardTitle>
                <CardDescription>
                  Telemetry triggers driving current at-risk pipeline with recommended mitigation
                </CardDescription>
              </div>
              <Badge variant="indigo">AI Behavioral Telemetry</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {rootCausesData.map((cause) => (
              <div
                key={cause.cause}
                className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cause.color }}
                    />
                    <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {cause.cause}
                    </span>
                    <span className="text-slate-400">
                      ({cause.accountsCount} accounts • {formatCurrency(cause.atRiskMRR)} MRR)
                    </span>
                  </div>
                  <span className="font-bold text-white">{cause.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cause.percentage}%`,
                      backgroundColor: cause.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5 truncate">
                    <span className="text-slate-500 font-semibold">Recommended Fix:</span>{" "}
                    <span className="text-slate-300 truncate">{cause.primaryMitigation}</span>
                  </span>
                  <button
                    onClick={() => onNavigateToPlaybooks(cause.cause)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
                  >
                    Deploy Playbook <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Cohort & MRR Attrition Forecast (30/60/90 Days) */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>MRR Attrition & Retention Simulation Forecast</CardTitle>
                <Badge variant="cyan">30 / 60 / 90 Days</Badge>
              </div>
              <CardDescription>
                Projected cumulative revenue loss if unaddressed vs. projected recovery with AI Playbooks
              </CardDescription>
            </div>

            {/* Toggle selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setForecastMode("both")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  forecastMode === "both"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Compare Scenarios
              </button>
              <button
                onClick={() => setForecastMode("without")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  forecastMode === "without"
                    ? "bg-rose-600/30 text-rose-300 border border-rose-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                No Intervention
              </button>
              <button
                onClick={() => setForecastMode("with")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  forecastMode === "with"
                    ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                With Playbooks
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mrrAttritionForecast}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorLossWithout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLossWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-1.5">
                          <div className="font-bold text-white border-b border-slate-800 pb-1">
                            Timeline: {label}
                          </div>
                          {payload.map((entry, idx) => (
                            <div key={`item-${idx}`} className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-1.5 text-slate-300">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                {entry.name}:
                              </span>
                              <strong className="text-white">
                                {formatCurrency(Number(entry.value))}
                              </strong>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(forecastMode === "both" || forecastMode === "without") && (
                  <Area
                    type="monotone"
                    name="Projected Loss (No Action)"
                    dataKey="projectedLossWithoutIntervention"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLossWithout)"
                  />
                )}
                {(forecastMode === "both" || forecastMode === "with") && (
                  <Area
                    type="monotone"
                    name="Residual Loss (With Playbook)"
                    dataKey="projectedLossWithPlaybook"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLossWith)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Simulation Insights Bar */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/30 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Targeted Retention Impact:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    $114,700 MRR Saved at 90 Days
                  </span>
                  <Badge variant="healthy">74.7% Loss Reduction</Badge>
                </div>
                <div className="text-[11px] text-slate-400">
                  Calculated across proactive billing rescue, VIP executive war rooms, and annual renewal incentives.
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                onOpenCopilotWithPrompt(
                  "Simulate churn reduction if we offer a 15% annual renewal discount to billing-sensitive users."
                )
              }
              className="text-xs shrink-0"
            >
              Simulate &quot;What-If&quot; Scenario in Copilot
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: Live Telemetry Alerts Stream */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <CardTitle>Real-Time Telemetry Escalation Stream</CardTitle>
            </div>
            <span className="text-xs text-slate-400">Latest subscriber events flagged by AI</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {liveAlertsData.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0 group-hover:bg-indigo-600 transition-colors">
                  {alert.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{alert.company}</span>
                    <Badge variant={alert.severity === "critical" ? "critical" : "high"}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{alert.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xs font-bold text-rose-400">
                  {formatCurrency(alert.mrr)} / mo
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (alert.company === "Acme Cloud Systems") onOpenCustomerProfile("cust-1");
                    else if (alert.company === "Synthetix AI") onOpenCustomerProfile("cust-2");
                    else if (alert.company === "OmniStream Media") onOpenCustomerProfile("cust-3");
                    else if (alert.company === "FinEdge Capital") onOpenCustomerProfile("cust-4");
                  }}
                  className="text-xs"
                >
                  Triage Account
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

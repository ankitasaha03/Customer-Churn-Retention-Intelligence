"use client";

import React, { useState } from "react";
import {
  X,
  TrendingDown,
  AlertTriangle,
  CreditCard,
  LifeBuoy,
  Users,
  Sparkles,
  Calendar,
  Mail,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Customer } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface CustomerDrawerProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateStrategy: (customer: Customer) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  customer,
  isOpen,
  onClose,
  onGenerateStrategy,
}) => {
  const [activeTab, setActiveTab] = useState<"telemetry" | "billing" | "support" | "contacts">("telemetry");

  if (!isOpen || !customer) return null;

  const riskTierColors = {
    critical: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    high: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    moderate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    healthy: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-600/30">
                  {customer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">{customer.company}</h2>
                    <Badge variant={customer.tier === "Enterprise" ? "indigo" : "cyan"}>
                      {customer.tier} Tier
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{customer.industry}</span>
                    <span>•</span>
                    <span>CSM: <strong className="text-slate-200">{customer.csm}</strong></span>
                    <span>•</span>
                    <span className="text-indigo-400 font-semibold">{formatCurrency(customer.mrr)} / mo</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Churn Risk</div>
                <div className="text-base font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                  {customer.churnRiskScore}%
                  <Badge variant={customer.riskTier} className="text-[9px] px-1.5 py-0">
                    {customer.riskTier}
                  </Badge>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Health Score</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {customer.healthScore} <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Renewal In</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {customer.daysToRenewal} <span className="text-xs text-slate-400">days</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Seat Utilization</div>
                <div className="text-base font-bold text-indigo-400 mt-0.5">
                  {customer.seatUtilization}% <span className="text-xs text-slate-400">({customer.activeUsers}/{customer.totalUsers})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Body with Navigation Tabs */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Root Cause Diagnostic Report */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-rose-950/30 border border-indigo-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    AI Diagnostic Root Cause Report
                  </span>
                </div>
                <Badge variant={customer.aiDiagnosis.urgency === "Immediate" ? "critical" : "high"}>
                  {customer.aiDiagnosis.urgency} Urgency
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {customer.aiDiagnosis.summary}
              </p>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-400">Key Risk Signals:</div>
                {customer.aiDiagnosis.riskFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-indigo-300">
                  <strong className="text-white">Recommended Strategy:</strong>{" "}
                  {customer.aiDiagnosis.recommendedAction}
                </div>
              </div>
            </div>

            {/* Telemetry Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "telemetry"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                30-Day Activity
              </button>
              <button
                onClick={() => setActiveTab("billing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "billing"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Billing History ({customer.billing.invoices.length})
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "support"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Support Tickets ({customer.support.tickets.length})
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "contacts"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                Stakeholders ({customer.contacts.length})
              </button>
            </div>

            {/* TAB 1: 30-Day Activity Graph */}
            {activeTab === "telemetry" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Daily Active Logins & API Queries
                  </span>
                  <Badge variant={customer.telemetry.usageDropPercent > 30 ? "critical" : "high"}>
                    -{customer.telemetry.usageDropPercent}% Drop in last 30d
                  </Badge>
                </div>

                <div className="h-52 w-full bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customer.telemetry.activity30Days}>
                      <defs>
                        <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="logins"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorLogins)"
                        name="Active Logins"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">Last Active:</span>
                    <div className="font-semibold text-white mt-0.5">
                      {customer.telemetry.lastActiveDaysAgo === 0
                        ? "Active Today"
                        : `${customer.telemetry.lastActiveDaysAgo} days ago`}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">Unresolved P1s:</span>
                    <div className="font-semibold text-rose-400 mt-0.5">
                      {customer.telemetry.openP1Tickets} incidents
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Billing & Invoices */}
            {activeTab === "billing" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Payment Method</div>
                      <div className="text-[11px] text-slate-400">
                        Status: <strong className={customer.billing.status === "failing" ? "text-rose-400" : "text-emerald-400"}>
                          {customer.billing.status.toUpperCase()}
                        </strong> • Expiry: {customer.billing.cardExpiry}
                      </div>
                    </div>
                  </div>
                  <Badge variant={customer.billing.status === "failing" ? "critical" : "healthy"}>
                    {customer.billing.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Past Invoices:</div>
                  {customer.billing.invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono text-slate-300 font-semibold">{inv.id}</span>
                        <div className="text-[10px] text-slate-400">{inv.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{formatCurrency(inv.amount)}</span>
                        <Badge
                          variant={
                            inv.status === "paid"
                              ? "healthy"
                              : inv.status === "retrying"
                              ? "high"
                              : "critical"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Support Tickets & Sentiment */}
            {activeTab === "support" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Support Health Score</div>
                    <div className="text-[11px] text-slate-400">
                      CSAT: <strong className="text-white">{customer.support.csat} / 5.0</strong>
                    </div>
                  </div>
                  <Badge
                    variant={
                      customer.support.sentiment === "Negative"
                        ? "critical"
                        : customer.support.sentiment === "Neutral"
                        ? "high"
                        : "healthy"
                    }
                  >
                    {customer.support.sentiment} Sentiment
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Recent Support Cases:</div>
                  {customer.support.tickets.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                      No open or recent support escalation tickets.
                    </div>
                  ) : (
                    customer.support.tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{t.title}</span>
                          <Badge variant={t.priority === "P1" ? "critical" : "high"}>
                            {t.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Case ID: {t.id}</span>
                          <span>Logged: {t.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Stakeholders / Contacts */}
            {activeTab === "contacts" && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400">Key Decision Makers & Champion:</div>
                {customer.contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                        {contact.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{contact.name}</span>
                          {contact.isChampion && (
                            <Badge variant="cyan" className="text-[10px] py-0">
                              Internal Champion
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{contact.role}</div>
                        <div className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close Profile
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onGenerateStrategy(customer);
              }}
              className="text-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Retention Strategy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

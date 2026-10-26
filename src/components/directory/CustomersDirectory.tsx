"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  SlidersHorizontal,
  Download,
  Users,
} from "lucide-react";
import { Customer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CustomerDrawer } from "./CustomerDrawer";
import { formatCurrency } from "@/lib/utils";

interface CustomersDirectoryProps {
  customers: Customer[];
  initialTierFilter?: string;
  onGenerateStrategy: (customer: Customer) => void;
  onOpenCustomerProfile?: (customerId: string) => void;
}

export const CustomersDirectory: React.FC<CustomersDirectoryProps> = ({
  customers,
  initialTierFilter,
  onGenerateStrategy,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>(initialTierFilter || "all");
  const [selectedCause, setSelectedCause] = useState<string>("all");
  const [selectedPlanTier, setSelectedPlanTier] = useState<string>("all");
  const [healthScoreMax, setHealthScoreMax] = useState<number>(100);
  const [sortBy, setSortBy] = useState<"risk_desc" | "mrr_desc" | "health_asc" | "renewal_asc">("risk_desc");

  // Selection state for bulk actions
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [activeCustomerForDrawer, setActiveCustomerForDrawer] = useState<Customer | null>(null);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.company.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
          const matchCsm = c.csm.toLowerCase().includes(q);
          const matchIndustry = c.industry.toLowerCase().includes(q);
          if (!matchName && !matchCsm && !matchIndustry) return false;
        }

        // Risk tier filter
        if (selectedRiskTier !== "all" && c.riskTier !== selectedRiskTier) {
          return false;
        }

        // Cause filter
        if (selectedCause !== "all" && c.primaryCause !== selectedCause) {
          return false;
        }

        // Plan tier filter
        if (selectedPlanTier !== "all" && c.tier !== selectedPlanTier) {
          return false;
        }

        // Health score slider
        if (c.healthScore > healthScoreMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "risk_desc") return b.churnRiskScore - a.churnRiskScore;
        if (sortBy === "mrr_desc") return b.mrr - a.mrr;
        if (sortBy === "health_asc") return a.healthScore - b.healthScore;
        if (sortBy === "renewal_asc") return a.daysToRenewal - b.daysToRenewal;
        return 0;
      });
  }, [customers, searchQuery, selectedRiskTier, selectedCause, selectedPlanTier, healthScoreMax, sortBy]);

  const totalFilteredMRR = filteredCustomers.reduce((acc, c) => acc + c.mrr, 0);

  const toggleSelectAll = () => {
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map((c) => c.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomerIds.includes(id)) {
      setSelectedCustomerIds(selectedCustomerIds.filter((cid) => cid !== id));
    } else {
      setSelectedCustomerIds([...selectedCustomerIds, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Filters Control Panel */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name, CSM, or industry..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Risk Tier */}
              <select
                value={selectedRiskTier}
                onChange={(e) => setSelectedRiskTier(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Risk Tiers</option>
                <option value="critical">Critical (&gt;80%)</option>
                <option value="high">High (60-80%)</option>
                <option value="moderate">Moderate (40-60%)</option>
                <option value="healthy">Healthy (&lt;40%)</option>
              </select>

              {/* Primary Churn Cause */}
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Root Causes</option>
                <option value="Low Product Adoption">Low Product Adoption</option>
                <option value="Billing Friction">Billing Friction</option>
                <option value="Support Escalations">Support Escalations</option>
                <option value="Pricing Sensitivity">Pricing Sensitivity</option>
              </select>

              {/* Subscription Tier */}
              <select
                value={selectedPlanTier}
                onChange={(e) => setSelectedPlanTier(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Plan Tiers</option>
                <option value="Enterprise">Enterprise Tier</option>
                <option value="Pro">Pro Tier</option>
                <option value="Starter">Starter Tier</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-indigo-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="risk_desc">Sort: Churn Risk (High to Low)</option>
                <option value="mrr_desc">Sort: MRR (High to Low)</option>
                <option value="health_asc">Sort: Health Score (Lowest)</option>
                <option value="renewal_asc">Sort: Renewal Urgency (Soonest)</option>
              </select>
            </div>
          </div>

          {/* Health Score Slider & Filter Status Row */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium whitespace-nowrap">
                Max Health Score Filter: <strong className="text-white">{healthScoreMax}</strong>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={healthScoreMax}
                onChange={(e) => setHealthScoreMax(Number(e.target.value))}
                className="w-36 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              {healthScoreMax < 100 && (
                <button
                  onClick={() => setHealthScoreMax(100)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span>
                Showing <strong className="text-white">{filteredCustomers.length}</strong> of{" "}
                {customers.length} accounts
              </span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">
                {formatCurrency(totalFilteredMRR)} MRR Filtered
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomerIds.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Customer &amp; Company</th>
                <th className="py-3.5 px-4">Plan &amp; MRR</th>
                <th className="py-3.5 px-4">Health Score</th>
                <th className="py-3.5 px-4">Churn Risk (%)</th>
                <th className="py-3.5 px-4">Top Behavioral Trigger</th>
                <th className="py-3.5 px-4">Renewal Window</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No customers match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const isSelected = selectedCustomerIds.includes(customer.id);
                  const isCritical = customer.riskTier === "critical";
                  const isHigh = customer.riskTier === "high";

                  return (
                    <tr
                      key={customer.id}
                      className={`hover:bg-slate-800/40 transition-colors group ${
                        isSelected ? "bg-indigo-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCustomer(customer.id)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Customer Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md ${
                              isCritical
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : isHigh
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-slate-800 text-slate-200 border border-slate-700"
                            }`}
                          >
                            {customer.avatar}
                          </div>
                          <div>
                            <div
                              onClick={() => setActiveCustomerForDrawer(customer)}
                              className="font-semibold text-white group-hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{customer.company}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {customer.industry} • CSM: {customer.csm}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan & MRR */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{formatCurrency(customer.mrr)}</div>
                        <Badge
                          variant={customer.tier === "Enterprise" ? "indigo" : "cyan"}
                          className="text-[10px] py-0 px-2 mt-0.5"
                        >
                          {customer.tier}
                        </Badge>
                      </td>

                      {/* Health Score */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              customer.healthScore < 35
                                ? "text-rose-400"
                                : customer.healthScore < 60
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {customer.healthScore}
                          </span>
                          <span className="text-slate-500">/100</span>
                        </div>
                        {/* Mini bar */}
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              customer.healthScore < 35
                                ? "bg-rose-500"
                                : customer.healthScore < 60
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${customer.healthScore}%` }}
                          />
                        </div>
                      </td>

                      {/* Churn Risk */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">
                            {customer.churnRiskScore}%
                          </span>
                          <Badge variant={customer.riskTier} className="text-[10px] py-0">
                            {customer.riskTier}
                          </Badge>
                        </div>
                        <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? "bg-rose-500" : isHigh ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${customer.churnRiskScore}%` }}
                          />
                        </div>
                      </td>

                      {/* Top Trigger */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-slate-200 line-clamp-2 leading-relaxed">
                          {customer.topTrigger}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Cause: <span className="text-indigo-400">{customer.primaryCause}</span>
                        </div>
                      </td>

                      {/* Days to Renewal */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              customer.daysToRenewal <= 20
                                ? "text-rose-400"
                                : customer.daysToRenewal <= 45
                                ? "text-amber-400"
                                : "text-slate-300"
                            }`}
                          >
                            {customer.daysToRenewal} days
                          </span>
                        </div>
                        {customer.daysToRenewal <= 20 && (
                          <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider block">
                            Urgent Window
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveCustomerForDrawer(customer)}
                            className="text-xs"
                          >
                            Profile
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onGenerateStrategy(customer)}
                            className="text-xs flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-cyan-300" />
                            Strategy
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Floating Bulk Action Bar */}
      {selectedCustomerIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 border border-indigo-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold">
              {selectedCustomerIds.length} accounts selected
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <Button
            variant="cyan"
            size="sm"
            onClick={() => {
              const target = customers.find((c) => c.id === selectedCustomerIds[0]) || customers[0];
              onGenerateStrategy(target);
            }}
            className="text-xs shadow-md"
          >
            Deploy Bulk Retention Campaign
          </Button>

          <button
            onClick={() => setSelectedCustomerIds([])}
            className="text-xs text-slate-400 hover:text-white hover:underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Detailed Customer Slide-over Drawer */}
      <CustomerDrawer
        customer={activeCustomerForDrawer}
        isOpen={!!activeCustomerForDrawer}
        onClose={() => setActiveCustomerForDrawer(null)}
        onGenerateStrategy={(cust) => {
          setActiveCustomerForDrawer(null);
          onGenerateStrategy(cust);
        }}
      />
    </div>
  );
};

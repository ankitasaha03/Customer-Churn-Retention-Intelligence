"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShieldAlert,
  Sparkles,
  Percent,
  UserCheck,
  Users,
  Send,
  Mail,
  CheckCircle2,
  Copy,
  Edit3,
  Sliders,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Customer, Playbook, ActiveCampaign } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockPlaybooks, mockActiveCampaigns, mockCustomers } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface PlaybooksViewProps {
  initialCustomer?: Customer | null;
  onClearSelectedCustomer?: () => void;
  onOpenCustomerProfile?: (customerId: string) => void;
}

export const PlaybooksView: React.FC<PlaybooksViewProps> = ({
  initialCustomer,
  onClearSelectedCustomer,
  onOpenCustomerProfile,
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook>(mockPlaybooks[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(
    initialCustomer || mockCustomers[0]
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Email generator state
  const [emailTone, setEmailTone] = useState<"executive" | "empathetic" | "urgent">("executive");
  const [discountPercent, setDiscountPercent] = useState<number>(selectedPlaybook.defaultDiscount || 15);
  const [graceDays, setGraceDays] = useState<number>(14);
  const [customSubject, setCustomSubject] = useState<string>("");
  const [customBody, setCustomBody] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [campaignsList, setCampaignsList] = useState<ActiveCampaign[]>(mockActiveCampaigns);

  // Sync with selected playbook and customer
  React.useEffect(() => {
    if (initialCustomer) {
      setSelectedCustomer(initialCustomer);
      const matching = mockPlaybooks.find((p) => p.id === initialCustomer.recommendedPlaybookId);
      if (matching) setSelectedPlaybook(matching);
    }
  }, [initialCustomer]);

  // Compute interpolated email
  const interpolatedSubject = React.useMemo(() => {
    if (customSubject) return customSubject;
    return selectedPlaybook.emailTemplate.subject
      .replace(/{{company}}/g, selectedCustomer.company)
      .replace(/{{contact_name}}/g, selectedCustomer.contacts[0]?.name || "Team");
  }, [customSubject, selectedPlaybook, selectedCustomer]);

  const interpolatedBody = React.useMemo(() => {
    if (customBody) return customBody;
    const contact = selectedCustomer.contacts[0]?.name || "Team";
    return selectedPlaybook.emailTemplate.body
      .replace(/{{contact_name}}/g, contact)
      .replace(/{{company}}/g, selectedCustomer.company)
      .replace(/{{tier}}/g, selectedCustomer.tier)
      .replace(/{{industry}}/g, selectedCustomer.industry)
      .replace(/{{csm}}/g, selectedCustomer.csm)
      .replace(/{{renewal_date}}/g, `in ${selectedCustomer.daysToRenewal} days`)
      .replace(/{{unused_seats}}/g, `${selectedCustomer.totalUsers - selectedCustomer.activeUsers}`)
      .replace(/{{discount_percent}}/g, `${discountPercent}%`)
      .replace(/{{meeting_link}}/g, `https://calendar.app/csm-${selectedCustomer.csm.toLowerCase().replace(" ", "-")}`)
      .replace(/{{update_payment_link}}/g, `https://app.saas.com/billing/update-token?ref=${selectedCustomer.id}`)
      .replace(/{{renewal_link}}/g, `https://app.saas.com/renew/exclusive-terms?code=SAVE${discountPercent}`)
      .replace(/{{audit_link}}/g, `https://app.saas.com/admin/seat-audit?account=${selectedCustomer.id}`);
  }, [customBody, selectedPlaybook, selectedCustomer, discountPercent]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${interpolatedSubject}\n\n${interpolatedBody}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendCampaign = () => {
    setIsSent(true);

    // Trigger visual confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Add to active campaigns
    const newCamp: ActiveCampaign = {
      id: `camp-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.contacts[0]?.name || selectedCustomer.name,
      company: selectedCustomer.company,
      playbookName: selectedPlaybook.name,
      category: selectedPlaybook.category,
      status: "Active",
      mrrProtected: selectedCustomer.mrr,
      date: "Just now",
      tone: emailTone.charAt(0).toUpperCase() + emailTone.slice(1),
    };

    setCampaignsList([newCamp, ...campaignsList]);

    setTimeout(() => {
      setIsSent(false);
    }, 4000);
  };

  const getPlaybookIcon = (iconName: string) => {
    switch (iconName) {
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-rose-400" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case "Percent":
        return <Percent className="w-5 h-5 text-emerald-400" />;
      case "UserCheck":
        return <UserCheck className="w-5 h-5 text-indigo-400" />;
      case "Users":
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredPlaybooks = mockPlaybooks.filter((p) => {
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Target Customer Selection Bar */}
      <Card className="border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {selectedCustomer.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Target Account:
                </span>
                <span className="text-sm font-bold text-white">{selectedCustomer.company}</span>
                <Badge variant={selectedCustomer.riskTier}>
                  {selectedCustomer.churnRiskScore}% Churn Risk
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedCustomer.tier} Tier • {formatCurrency(selectedCustomer.mrr)} MRR • Trigger:{" "}
                <span className="text-indigo-300">{selectedCustomer.topTrigger}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = mockCustomers.find((c) => c.id === e.target.value);
                if (found) {
                  setSelectedCustomer(found);
                  setCustomSubject("");
                  setCustomBody("");
                }
              }}
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {mockCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({formatCurrency(c.mrr)}/mo - {c.riskTier})
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Playbook Catalog (Left) + Interactive Outreach Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Playbooks Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Select Playbook Blueprint</h2>
            {/* Category pills */}
            <div className="flex items-center gap-1 text-[11px] bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-2 py-1 rounded ${
                  categoryFilter === "all" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter("Commercial")}
                className={`px-2 py-1 rounded ${
                  categoryFilter === "Commercial" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Commercial
              </button>
              <button
                onClick={() => setCategoryFilter("Success & Onboarding")}
                className={`px-2 py-1 rounded ${
                  categoryFilter === "Success & Onboarding" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setCategoryFilter("Product Adoption")}
                className={`px-2 py-1 rounded ${
                  categoryFilter === "Product Adoption" ? "bg-indigo-600 text-white" : "text-slate-400"
                }`}
              >
                Product
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPlaybooks.map((playbook) => {
              const isSelected = selectedPlaybook.id === playbook.id;
              const isRecommended = selectedCustomer.recommendedPlaybookId === playbook.id;

              return (
                <div
                  key={playbook.id}
                  onClick={() => {
                    setSelectedPlaybook(playbook);
                    setCustomSubject("");
                    setCustomBody("");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-gradient-to-br from-indigo-950/50 to-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/50"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                        {getPlaybookIcon(playbook.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {playbook.name}
                          </h3>
                          {isRecommended && (
                            <Badge variant="cyan" className="text-[9px] py-0">
                              AI Pick
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-[10px] py-0 mt-1">
                          {playbook.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {playbook.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{playbook.winRate}% Win Rate</span>
                    </div>
                    <span className="text-slate-400">
                      Protected: <strong className="text-white">{formatCurrency(playbook.savedARR)} ARR</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Outreach Engine & Campaign Customizer (7 Cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <CardTitle>AI Retention Outreach Engine</CardTitle>
                </div>
                <CardDescription>
                  Customized outreach copy with live dynamic variable interpolation
                </CardDescription>
              </div>

              <Badge variant="indigo">{selectedPlaybook.category}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tone & Incentive Sliders */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">Outreach Tone:</span>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setEmailTone("executive")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      emailTone === "executive"
                        ? "bg-indigo-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Executive &amp; Strategic
                  </button>
                  <button
                    onClick={() => setEmailTone("empathetic")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      emailTone === "empathetic"
                        ? "bg-indigo-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Empathetic &amp; Helpful
                  </button>
                  <button
                    onClick={() => setEmailTone("urgent")}
                    className={`px-3 py-1 rounded-md transition-all ${
                      emailTone === "urgent"
                        ? "bg-rose-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Urgent &amp; Incentivized
                  </button>
                </div>
              </div>

              {/* Discount / Grace Period Customizer if Commercial */}
              {selectedPlaybook.category === "Commercial" && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-emerald-400" /> Renewal Discount Incentive:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-24 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="font-bold text-emerald-400">{discountPercent}% OFF</span>
                  </div>
                </div>
              )}
            </div>

            {/* Editable Subject Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Email Subject:</span>
                <span className="text-[10px] text-slate-400">Click to edit inline</span>
              </label>
              <input
                type="text"
                value={interpolatedSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Editable Email Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Message Body:</span>
                <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Live Dynamic Template
                </span>
              </label>
              <textarea
                rows={9}
                value={interpolatedBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-3 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Campaign Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyEmail} className="text-xs">
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Email Content
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Protects: <strong className="text-rose-400">{formatCurrency(selectedCustomer.mrr)}/mo</strong>
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendCampaign}
                  isLoading={isSent}
                  className="text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSent ? "Deploying Campaign..." : "Send Campaign Now"}
                </Button>
              </div>
            </div>

            {isSent && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Retention campaign delivered to {selectedCustomer.contacts[0]?.email || "contact"}!
                Telemetry tracking enabled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Active Campaigns Execution Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Playbook Campaigns</CardTitle>
              <CardDescription>
                Live delivery status and protected MRR across deployed retention playbooks
              </CardDescription>
            </div>
            <Badge variant="healthy">{campaignsList.length} Active Workflows</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Account &amp; Contact</th>
                  <th className="py-3 px-4">Playbook Used</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Protected MRR</th>
                  <th className="py-3 px-4">Tone &amp; Strategy</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {campaignsList.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{camp.company}</div>
                      <div className="text-[11px] text-slate-400">{camp.customerName}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-indigo-300">{camp.playbookName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">
                        {camp.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {formatCurrency(camp.mrrProtected)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{camp.tone}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          camp.status === "Saved"
                            ? "healthy"
                            : camp.status === "Engaged"
                            ? "indigo"
                            : camp.status === "Delivered"
                            ? "cyan"
                            : "default"
                        }
                      >
                        {camp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {camp.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

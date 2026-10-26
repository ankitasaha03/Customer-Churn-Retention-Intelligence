"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Users,
  TrendingDown,
  Mail,
  Copy,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Customer, ChatMessage, ChatWidgetData } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockCustomers, initialExecutiveMetrics } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface CopilotViewProps {
  onOpenCustomerProfile?: (customerId: string) => void;
  onDeployPlaybookForCustomer?: (customer: Customer) => void;
  initialPrompt?: string;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  onOpenCustomerProfile,
  onDeployPlaybookForCustomer,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Hello Jessica! I am your AI Retention Copilot. I analyze live telemetry, ticket escalations, and billing signals across your 1,240 subscriber accounts. How can I assist with your retention strategy today?",
      timestamp: "Just now",
      widget: {
        type: "stats",
        stats: {
          "At-Risk MRR": "$153.5k",
          "Critical Accounts": "18 accounts",
          "Projected 90d Savings": "$114.7k",
        },
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Which enterprise accounts with MRR > $5k are at critical risk?",
    "Simulate churn reduction if we offer a 15% annual renewal discount to billing-sensitive users.",
    "Draft a high-priority retention email for Acme Corp based on their low platform engagement.",
    "What is our projected churn loss for Q4 and which accounts are most vulnerable?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsTyping(true);

    // Simulate smart dynamic assistant reasoning
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let assistantResponse: ChatMessage;

      if (lower.includes("enterprise") || lower.includes("mrr >") || lower.includes("critical risk")) {
        // Query critical enterprise accounts
        const criticalEnterprise = mockCustomers.filter(
          (c) => c.tier === "Enterprise" && (c.riskTier === "critical" || c.mrr >= 5000)
        );
        const totalMrr = criticalEnterprise.reduce((acc, c) => acc + c.mrr, 0);

        assistantResponse = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: `I scanned your customer database and identified **${criticalEnterprise.length} Enterprise accounts** with elevated churn risks representing **${formatCurrency(totalMrr)} in monthly recurring revenue**. Here are the highest-urgency accounts flagged for immediate intervention:`,
          timestamp: "Just now",
          widget: {
            type: "accounts_list",
            accounts: criticalEnterprise.slice(0, 4),
          },
        };
      } else if (lower.includes("simulate") || lower.includes("15%") || lower.includes("discount") || lower.includes("what-if")) {
        // What-if simulation
        assistantResponse = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "I simulated an automated **15% Annual Renewal Discount Incentive** applied to all accounts experiencing billing friction and contract renewals within 60 days.\n\nOur predictive telemetry model estimates this intervention will rescue **72% of at-risk revenue** in this cohort, shifting customer LTV significantly higher than the discount cost.",
          timestamp: "Just now",
          widget: {
            type: "simulation_result",
            simulation: {
              intervention: "15% Annual Renewal Discount (Billing-Sensitive)",
              baselineChurnMRR: 62935,
              mitigatedChurnMRR: 17620,
              mrrSaved: 45315,
              pctReduction: 72,
            },
          },
        };
      } else if (lower.includes("acme") || lower.includes("draft") || lower.includes("email")) {
        // Draft email for Acme Corp
        const acme = mockCustomers.find((c) => c.company.includes("Acme")) || mockCustomers[0];
        assistantResponse = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: `I drafted an executive outreach message tailored for **${acme.company}**. The copy addresses their recent 42% login drop, resolves their 3 open P1 tickets with SLA credits, and schedules an executive check-in.`,
          timestamp: "Just now",
          widget: {
            type: "email_draft",
            emailDraft: {
              recipient: acme.contacts[0]?.name || "David Sterling",
              company: acme.company,
              subject: `Priority Escalation & Personal Commitment for ${acme.company}`,
              body: `Hi ${acme.contacts[0]?.name || "David"},\n\nI am reaching out directly from our executive team. I've reviewed your recent support telemetry and realize our response times on critical incidents have not met the high standard ${acme.company} deserves.\n\nHere are the immediate steps we have taken:\n1. Assigned our Lead Principal Architect to directly resolve your 3 open P1 tickets.\n2. Applied an immediate 15% SLA service credit to your current billing cycle.\n3. Scheduled a direct 20-minute executive alignment check-in: https://calendar.app/csm-sarah-jenkins\n\nYour partnership is extremely valuable to us, and we are committed to earning your trust every single day.\n\nWarm regards,\nVP of Customer Success & Engineering`,
            },
          },
        };
      } else if (lower.includes("q4") || lower.includes("projected") || lower.includes("vulnerable")) {
        // Q4 forecast
        assistantResponse = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: `For **Q4 2026**, our baseline churn projection without intervention stands at **$153,500 MRR** ($1.84M ARR). However, active playbook execution reduces that exposure to **$38,800 MRR**, protecting **$114,700 MRR**.\n\nThe 3 most vulnerable accounts right now are **OmniStream Media** ($11k MRR, 91% risk), **Acme Cloud Systems** ($12.5k MRR, 88% risk), and **Synthetix AI** ($9.2k MRR, 84% risk).`,
          timestamp: "Just now",
          widget: {
            type: "accounts_list",
            accounts: mockCustomers.filter((c) => ["cust-3", "cust-1", "cust-2"].includes(c.id)),
          },
        };
      } else {
        // General intelligent response
        assistantResponse = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: `I analyzed your query against our live telemetry dataset. Currently, **${initialExecutiveMetrics.atRiskAccountsCount} accounts** are flagged, with the primary driver being **Low Product Adoption (38%)**, followed by **Billing Friction (24%)**.\n\nWould you like me to run an automated simulation for a specific account, or generate a tailored playbook?`,
          timestamp: "Just now",
          widget: {
            type: "stats",
            stats: {
              "Total Churn Rate": "4.2%",
              "At-Risk MRR": "$153.5k",
              "Net Retention": "106.8%",
            },
          },
        };
      }

      setMessages((prev) => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            AI Retention Intelligence Copilot
          </h2>
          <p className="text-xs text-slate-400">
            Ask complex queries, simulate retention economics, and draft personalized outreach campaigns.
          </p>
        </div>

        <Badge variant="cyan" className="self-start sm:self-auto">
          <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
          GPT-4o Telemetry Model Active
        </Badge>
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(prompt)}
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 text-left text-xs text-slate-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="group-hover:text-white transition-colors">{prompt}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card className="min-h-[500px] flex flex-col justify-between overflow-hidden">
        <div className="p-5 space-y-5 overflow-y-auto max-h-[550px]">
          {messages.map((msg) => {
            const isBot = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isBot ? "items-start" : "items-start flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isBot
                      ? "bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4 text-white" /> : "JD"}
                </div>

                {/* Message Bubble & Embedded Widgets */}
                <div className={`space-y-3 max-w-2xl ${isBot ? "text-left" : "text-right"}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed inline-block ${
                      isBot
                        ? "bg-slate-950/80 border border-slate-800 text-slate-200"
                        : "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* Widget 1: Accounts List Mini Cards */}
                  {msg.widget?.type === "accounts_list" && msg.widget.accounts && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-left">
                      {msg.widget.accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                                {acc.avatar}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">
                                  {acc.company}
                                </span>
                                <span className="text-[10px] text-slate-400">{acc.tier} Plan</span>
                              </div>
                            </div>
                            <Badge variant={acc.riskTier} className="text-[9px] py-0">
                              {acc.churnRiskScore}% Risk
                            </Badge>
                          </div>

                          <div className="text-[11px] text-slate-300">
                            MRR: <strong className="text-emerald-400">{formatCurrency(acc.mrr)}</strong> •{" "}
                            Renewal in {acc.daysToRenewal}d
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            {onOpenCustomerProfile && (
                              <button
                                onClick={() => onOpenCustomerProfile(acc.id)}
                                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                              >
                                View Profile <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                            {onDeployPlaybookForCustomer && (
                              <button
                                onClick={() => onDeployPlaybookForCustomer(acc)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                              >
                                Deploy Playbook <Sparkles className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Widget 2: What-If Simulation Result Card */}
                  {msg.widget?.type === "simulation_result" && msg.widget.simulation && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-emerald-950/40 border border-indigo-500/30 text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Simulation Impact Matrix
                        </span>
                        <Badge variant="healthy">
                          +{msg.widget.simulation.pctReduction}% Protected
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400">Baseline Churn</div>
                          <div className="text-sm font-bold text-rose-400 mt-0.5">
                            {formatCurrency(msg.widget.simulation.baselineChurnMRR)}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-[10px] text-slate-400">Mitigated Churn</div>
                          <div className="text-sm font-bold text-amber-400 mt-0.5">
                            {formatCurrency(msg.widget.simulation.mitigatedChurnMRR)}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                          <div className="text-[10px] text-emerald-300 font-semibold">Net MRR Saved</div>
                          <div className="text-sm font-bold text-emerald-400 mt-0.5">
                            +{formatCurrency(msg.widget.simulation.mrrSaved)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Widget 3: Email Draft Card */}
                  {msg.widget?.type === "email_draft" && msg.widget.emailDraft && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-xs font-bold text-white">
                            Generated Outreach Draft
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (msg.widget?.emailDraft) {
                              navigator.clipboard.writeText(
                                `Subject: ${msg.widget.emailDraft.subject}\n\n${msg.widget.emailDraft.body}`
                              );
                            }
                          }}
                          className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Copy className="w-3 h-3" /> Copy Draft
                        </button>
                      </div>

                      <div className="text-xs text-slate-300">
                        <strong className="text-white">Subject:</strong> {msg.widget.emailDraft.subject}
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {msg.widget.emailDraft.body}
                      </div>
                    </div>
                  )}

                  {/* Widget 4: Stats Mini Bar */}
                  {msg.widget?.type === "stats" && msg.widget.stats && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {Object.entries(msg.widget.stats).map(([k, v]) => (
                        <div
                          key={k}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px]"
                        >
                          <span className="text-slate-400">{k}:</span>{" "}
                          <strong className="text-white">{v}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Querying telemetry index and running simulations...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Copilot about any subscriber, simulate retention scenarios, or request campaigns..."
              className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputPrompt.trim() || isTyping}
              className="rounded-xl px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

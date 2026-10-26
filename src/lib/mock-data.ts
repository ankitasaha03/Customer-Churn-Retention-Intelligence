import { Customer, Playbook, ActiveCampaign, ExecutiveMetrics } from "@/types";

export const initialExecutiveMetrics: ExecutiveMetrics = {
  churnRate: 4.2,
  churnRateChange: -0.6,
  atRiskARR: 1842000,
  atRiskMRR: 153500,
  atRiskAccountsCount: 84,
  totalAccounts: 1240,
  nrr: 106.8,
  nrrChange: 2.1,
  retentionRoi: "5.2x",
  savedArrYTD: 820000,
};

export const riskDistributionData = [
  { name: "Critical (>80%)", value: 18, mrr: 48200, color: "#f43f5e", tier: "critical" as const },
  { name: "High (60-80%)", value: 28, mrr: 54900, color: "#f59e0b", tier: "high" as const },
  { name: "Moderate (40-60%)", value: 38, mrr: 50400, color: "#eab308", tier: "moderate" as const },
  { name: "Healthy (<40%)", value: 1156, mrr: 1280000, color: "#10b981", tier: "healthy" as const },
];

export const rootCausesData = [
  {
    cause: "Low Product Adoption",
    percentage: 38,
    accountsCount: 32,
    atRiskMRR: 58330,
    primaryMitigation: "Trigger Feature Activation Tour & CSM Check-in",
    color: "#6366f1",
  },
  {
    cause: "Billing Friction",
    percentage: 24,
    accountsCount: 20,
    atRiskMRR: 36840,
    primaryMitigation: "Automated Smart Retries & Card Update Incentive",
    color: "#f43f5e",
  },
  {
    cause: "Support Escalations",
    percentage: 21,
    accountsCount: 18,
    atRiskMRR: 32235,
    primaryMitigation: "VIP Engineering Escalation & SLA Credit",
    color: "#f59e0b",
  },
  {
    cause: "Pricing Sensitivity",
    percentage: 17,
    accountsCount: 14,
    atRiskMRR: 26095,
    primaryMitigation: "Annual Lock-in 15% Discount or Plan Resize",
    color: "#06b6d4",
  },
];

export const mrrAttritionForecast = [
  { day: "Current", baselineMRR: 153500, projectedLossWithoutIntervention: 0, projectedLossWithPlaybook: 0, savedMRR: 0 },
  { day: "+15 Days", baselineMRR: 153500, projectedLossWithoutIntervention: 28400, projectedLossWithPlaybook: 8200, savedMRR: 20200 },
  { day: "+30 Days", baselineMRR: 153500, projectedLossWithoutIntervention: 58900, projectedLossWithPlaybook: 16400, savedMRR: 42500 },
  { day: "+45 Days", baselineMRR: 153500, projectedLossWithoutIntervention: 89300, projectedLossWithPlaybook: 24100, savedMRR: 65200 },
  { day: "+60 Days", baselineMRR: 153500, projectedLossWithoutIntervention: 119800, projectedLossWithPlaybook: 31200, savedMRR: 88600 },
  { day: "+90 Days", baselineMRR: 153500, projectedLossWithoutIntervention: 153500, projectedLossWithPlaybook: 38800, savedMRR: 114700 },
];

export const liveAlertsData = [
  {
    id: "alt-1",
    company: "OmniStream Media",
    severity: "critical",
    message: "64% drop in Weekly Active Users (WAU) over 14 days",
    mrr: 11000,
    timestamp: "12m ago",
    action: "Launch Activation Playbook",
  },
  {
    id: "alt-2",
    company: "Synthetix AI",
    severity: "critical",
    message: "Stripe Payment Failed (Attempt 3/3) - Card ending 4092 expired",
    mrr: 9200,
    timestamp: "34m ago",
    action: "Deploy Smart Invoicing Flow",
  },
  {
    id: "alt-3",
    company: "Acme Cloud Systems",
    severity: "critical",
    message: "3rd unresolved P1 incident open for > 48 hours",
    mrr: 12500,
    timestamp: "1h ago",
    action: "Alert VP of Customer Success",
  },
  {
    id: "alt-4",
    company: "FinEdge Capital",
    severity: "high",
    message: "Contract renewal in 18 days; procurement team visited cancellation FAQ",
    mrr: 14800,
    timestamp: "2h ago",
    action: "Generate 15% Renewal Offer",
  },
];

const generateTelemetry = (trend: "drop" | "steady" | "volatile" | "growing") => {
  const days = ["D-30", "D-25", "D-20", "D-15", "D-10", "D-5", "Today"];
  return days.map((day, idx) => {
    let logins = 120;
    let apiCalls = 5400;
    if (trend === "drop") {
      logins = Math.max(12, Math.round(140 - idx * 19 + (Math.random() * 8 - 4)));
      apiCalls = Math.max(800, Math.round(6200 - idx * 850 + (Math.random() * 200)));
    } else if (trend === "steady") {
      logins = Math.round(110 + (Math.random() * 20 - 10));
      apiCalls = Math.round(5000 + (Math.random() * 400 - 200));
    } else if (trend === "volatile") {
      logins = Math.round(80 + (Math.sin(idx) * 45));
      apiCalls = Math.round(4000 + (Math.sin(idx) * 1800));
    } else {
      logins = Math.round(100 + idx * 15);
      apiCalls = Math.round(4500 + idx * 600);
    }
    return { day, logins, apiCalls };
  });
};

export const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Acme Cloud Systems",
    company: "Acme Cloud Systems",
    avatar: "AC",
    tier: "Enterprise",
    mrr: 12500,
    arr: 150000,
    healthScore: 28,
    churnRiskScore: 88,
    riskTier: "critical",
    primaryCause: "Support Escalations",
    topTrigger: "3 unresolved P1 incidents > 48h & -42% admin logins",
    daysToRenewal: 22,
    csm: "Sarah Jenkins",
    industry: "DevOps & Cloud Infrastructure",
    seatUtilization: 44,
    activeUsers: 31,
    totalUsers: 70,
    telemetry: {
      activity30Days: generateTelemetry("drop"),
      usageDropPercent: 42,
      openP1Tickets: 3,
      billingFailures: 0,
      lastActiveDaysAgo: 4,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-01",
      cardExpiry: "11/27",
      invoices: [
        { id: "inv-901", date: "2026-10-01", amount: 12500, status: "paid" },
        { id: "inv-852", date: "2026-09-01", amount: 12500, status: "paid" },
        { id: "inv-801", date: "2026-08-01", amount: 12500, status: "paid" },
      ],
    },
    support: {
      csat: 1.9,
      sentiment: "Negative",
      tickets: [
        { id: "TIC-4891", title: "API Gateway rate limiting causing production outage", priority: "P1", status: "open", date: "2 days ago" },
        { id: "TIC-4874", title: "Single Sign-On (SAML) redirect loop for EU cluster", priority: "P1", status: "open", date: "3 days ago" },
        { id: "TIC-4830", title: "Data export pipeline job timed out after 4 hours", priority: "P1", status: "open", date: "5 days ago" },
      ],
    },
    contacts: [
      { name: "David Sterling", role: "VP of Infrastructure", email: "dsterling@acmecloud.io", isChampion: false },
      { name: "Elena Rostova", role: "Lead Site Reliability Engineer", email: "erostova@acmecloud.io", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "High churn velocity driven by clustered infrastructure outages and unresponsive critical support tickets right before an annual renewal window.",
      riskFactors: [
        "Unresolved P1 ticket duration exceeds SLA by 210%",
        "Active seat utilization dropped from 82% to 44% in 30 days",
        "Executive buyer has not logged into console in 3 weeks",
      ],
      recommendedAction: "Escalate P1 tickets immediately to Engineering Director and schedule an emergency Executive QBR with SLA credits.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-2",
  },
  {
    id: "cust-2",
    name: "Synthetix AI",
    company: "Synthetix AI",
    avatar: "SX",
    tier: "Enterprise",
    mrr: 9200,
    arr: 110400,
    healthScore: 32,
    churnRiskScore: 84,
    riskTier: "critical",
    primaryCause: "Billing Friction",
    topTrigger: "Failed Stripe charge x3 • Expired corporate Amex",
    daysToRenewal: 11,
    csm: "Marcus Vance",
    industry: "Generative AI Platforms",
    seatUtilization: 78,
    activeUsers: 39,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 8,
      openP1Tickets: 0,
      billingFailures: 3,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "failing",
      lastPaymentDate: "2026-09-15",
      cardExpiry: "09/26",
      invoices: [
        { id: "inv-944", date: "2026-10-15", amount: 9200, status: "failed" },
        { id: "inv-943", date: "2026-10-12", amount: 9200, status: "retrying" },
        { id: "inv-942", date: "2026-10-09", amount: 9200, status: "failed" },
      ],
    },
    support: {
      csat: 4.2,
      sentiment: "Neutral",
      tickets: [
        { id: "TIC-4902", title: "Need updated invoice address for tax filing", priority: "P3", status: "resolved", date: "1 week ago" },
      ],
    },
    contacts: [
      { name: "Claire Dupont", role: "Head of Finance & Operations", email: "claire@synthetix.ai", isChampion: false },
      { name: "Arjun Mehta", role: "Chief Technology Officer", email: "arjun@synthetix.ai", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Involuntary churn hazard: High product telemetry and satisfaction, but automated dunning is failing due to expired payment method.",
      riskFactors: [
        "Card expired in September 2026",
        "Stripe automated retries exhausted; account nearing automated lock suspension",
        "No response to automated dunning notification emails",
      ],
      recommendedAction: "Send personalized high-touch payment update link with a 14-day billing grace period before lock.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-1",
  },
  {
    id: "cust-3",
    name: "OmniStream Media",
    company: "OmniStream Media",
    avatar: "OM",
    tier: "Enterprise",
    mrr: 11000,
    arr: 132000,
    healthScore: 24,
    churnRiskScore: 91,
    riskTier: "critical",
    primaryCause: "Low Product Adoption",
    topTrigger: "-64% active users & key champion departed",
    daysToRenewal: 35,
    csm: "Sarah Jenkins",
    industry: "Digital Media & Streaming",
    seatUtilization: 28,
    activeUsers: 14,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("drop"),
      usageDropPercent: 64,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 9,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-05",
      cardExpiry: "04/28",
      invoices: [
        { id: "inv-912", date: "2026-10-05", amount: 11000, status: "paid" },
      ],
    },
    support: {
      csat: 3.1,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Rachel Adams", role: "VP Content Operations (Departed)", email: "rachel@omnistream.com", isChampion: false },
      { name: "Jason Vance", role: "Director of Production", email: "jvance@omnistream.com", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Silent churn risk caused by champion departure. New team has not completed onboarding and usage has collapsed by 64%.",
      riskFactors: [
        "Primary champion Rachel Adams email bounced (Departed Company)",
        "Zero logins to advanced analytics dashboard in 28 days",
        "Renewal approaching with unutilized allocated capacity",
      ],
      recommendedAction: "Identify new department head and deploy tailored VIP onboarding & training sprint.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-3",
  },
  {
    id: "cust-4",
    name: "FinEdge Capital",
    company: "FinEdge Capital",
    avatar: "FE",
    tier: "Enterprise",
    mrr: 14800,
    arr: 177600,
    healthScore: 41,
    churnRiskScore: 76,
    riskTier: "high",
    primaryCause: "Pricing Sensitivity",
    topTrigger: "Procurement visited cancellation portal • Renewal in 18d",
    daysToRenewal: 18,
    csm: "Michael Chang",
    industry: "Fintech & Quantitative Trading",
    seatUtilization: 68,
    activeUsers: 34,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("volatile"),
      usageDropPercent: 18,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-09-28",
      cardExpiry: "08/27",
      invoices: [
        { id: "inv-889", date: "2026-09-28", amount: 14800, status: "paid" },
      ],
    },
    support: {
      csat: 3.8,
      sentiment: "Neutral",
      tickets: [
        { id: "TIC-4762", title: "Requesting breakdown of seat license allocation for budget review", priority: "P2", status: "resolved", date: "12 days ago" },
      ],
    },
    contacts: [
      { name: "Robert Hayes", role: "Chief Operating Officer", email: "rhayes@finedge.com", isChampion: false },
      { name: "Melissa Thorne", role: "Lead Quantitative Analyst", email: "mthorne@finedge.com", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Contract renegotiation pressure. Heavy daily usage but finance department seeking 20% budget cuts across SaaS stack.",
      riskFactors: [
        "Procurement officer downloaded master service agreement and cancellation terms",
        "Contract expires in 18 days without signed amendment",
        "Competitor evaluation mentioned in support notes",
      ],
      recommendedAction: "Offer 15% discount tied to a 2-year multi-year commitment with flexible tier add-ons.",
      urgency: "Within 7 Days",
    },
    recommendedPlaybookId: "pb-4",
  },
  {
    id: "cust-5",
    name: "CyberShield Global",
    company: "CyberShield Global",
    avatar: "CS",
    tier: "Enterprise",
    mrr: 8500,
    arr: 102000,
    healthScore: 46,
    churnRiskScore: 68,
    riskTier: "high",
    primaryCause: "Support Escalations",
    topTrigger: "CSAT score 1.8/5 on recent security audit integration",
    daysToRenewal: 44,
    csm: "Michael Chang",
    industry: "Cybersecurity & Compliance",
    seatUtilization: 62,
    activeUsers: 31,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 12,
      openP1Tickets: 1,
      billingFailures: 0,
      lastActiveDaysAgo: 2,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-02",
      cardExpiry: "12/28",
      invoices: [{ id: "inv-899", date: "2026-10-02", amount: 8500, status: "paid" }],
    },
    support: {
      csat: 1.8,
      sentiment: "Negative",
      tickets: [
        { id: "TIC-4821", title: "SOC2 compliance audit logs incomplete for September", priority: "P1", status: "pending", date: "4 days ago" },
      ],
    },
    contacts: [
      { name: "Nathan Wright", role: "CISO", email: "nwright@cybershield.org", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Security audit blocker causing severe friction with CISO. Core product utilization remains intact.",
      riskFactors: [
        "SOC2 compliance deliverable pending",
        "CISO CSAT feedback was 1/5 citing delays",
      ],
      recommendedAction: "Schedule priority technical review with Head of Security Compliance.",
      urgency: "Within 7 Days",
    },
    recommendedPlaybookId: "pb-5",
  },
  {
    id: "cust-6",
    name: "Datablox Labs",
    company: "Datablox Labs",
    avatar: "DB",
    tier: "Pro",
    mrr: 3400,
    arr: 40800,
    healthScore: 38,
    churnRiskScore: 72,
    riskTier: "high",
    primaryCause: "Billing Friction",
    topTrigger: "2 consecutive invoice rejections • Limit reached",
    daysToRenewal: 8,
    csm: "Marcus Vance",
    industry: "Data Engineering",
    seatUtilization: 55,
    activeUsers: 11,
    totalUsers: 20,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 5,
      openP1Tickets: 0,
      billingFailures: 2,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "failing",
      lastPaymentDate: "2026-09-18",
      cardExpiry: "10/26",
      invoices: [
        { id: "inv-931", date: "2026-10-18", amount: 3400, status: "failed" },
        { id: "inv-930", date: "2026-10-15", amount: 3400, status: "retrying" },
      ],
    },
    support: {
      csat: 4.5,
      sentiment: "Positive",
      tickets: [],
    },
    contacts: [
      { name: "Samira Khan", role: "Lead Data Architect", email: "samira@datablox.io", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "High user engagement with critical data workflows, blocked only by payment card limit threshold.",
      riskFactors: [
        "Payment gateway error: 'Card limit exceeded'",
        "Renewal cutoff in 8 days",
      ],
      recommendedAction: "Deploy frictionless Wire / ACH invoice option with temporary account hold waiver.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-1",
  },
  {
    id: "cust-7",
    name: "NovaPay Technologies",
    company: "NovaPay Technologies",
    avatar: "NP",
    tier: "Pro",
    mrr: 4100,
    arr: 49200,
    healthScore: 29,
    churnRiskScore: 82,
    riskTier: "critical",
    primaryCause: "Low Product Adoption",
    topTrigger: "-52% API call volume • 18% seat utilization",
    daysToRenewal: 29,
    csm: "Sarah Jenkins",
    industry: "Payments & Merchant Services",
    seatUtilization: 18,
    activeUsers: 4,
    totalUsers: 22,
    telemetry: {
      activity30Days: generateTelemetry("drop"),
      usageDropPercent: 52,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 6,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-09-25",
      cardExpiry: "03/29",
      invoices: [{ id: "inv-872", date: "2026-09-25", amount: 4100, status: "paid" }],
    },
    support: {
      csat: 3.0,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Brian O'Connor", role: "Head of Product", email: "brian@novapay.tech", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Underutilization risk: Subscribed to 22 Pro seats but only 4 members are active. API usage declining steadily.",
      riskFactors: [
        "18 empty seats with zero activity in 60 days",
        "Main engineer handling integration moved to another project",
      ],
      recommendedAction: "Deliver tailored Product Activation session and offer license optimization.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-6",
  },
  {
    id: "cust-8",
    name: "CloudScale IO",
    company: "CloudScale IO",
    avatar: "CS",
    tier: "Pro",
    mrr: 2800,
    arr: 33600,
    healthScore: 52,
    churnRiskScore: 55,
    riskTier: "moderate",
    primaryCause: "Pricing Sensitivity",
    topTrigger: "Downgrade quote generated in billing settings",
    daysToRenewal: 60,
    csm: "Michael Chang",
    industry: "Cloud Infrastructure",
    seatUtilization: 65,
    activeUsers: 13,
    totalUsers: 20,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 10,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 2,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-10",
      cardExpiry: "07/28",
      invoices: [{ id: "inv-920", date: "2026-10-10", amount: 2800, status: "paid" }],
    },
    support: {
      csat: 3.9,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Lucas Vance", role: "DevOps Manager", email: "lucas@cloudscale.io", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Evaluating lower plan tier. Customer values the tool but feels features above base tier are unneeded.",
      riskFactors: [
        "Viewed Starter plan comparison 4 times this month",
        "Renewal within 60 days",
      ],
      recommendedAction: "Highlight Pro-tier exclusive automation features with a demo of ROI savings.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-3",
  },
  {
    id: "cust-9",
    name: "PulseHealth Solutions",
    company: "PulseHealth Solutions",
    avatar: "PH",
    tier: "Enterprise",
    mrr: 16500,
    arr: 198000,
    healthScore: 44,
    churnRiskScore: 64,
    riskTier: "high",
    primaryCause: "Support Escalations",
    topTrigger: "4 open tickets awaiting resolution • CSAT 2.3",
    daysToRenewal: 52,
    csm: "Sarah Jenkins",
    industry: "Healthcare & MedTech",
    seatUtilization: 72,
    activeUsers: 54,
    totalUsers: 75,
    telemetry: {
      activity30Days: generateTelemetry("volatile"),
      usageDropPercent: 15,
      openP1Tickets: 2,
      billingFailures: 0,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-09-30",
      cardExpiry: "05/27",
      invoices: [{ id: "inv-891", date: "2026-09-30", amount: 16500, status: "paid" }],
    },
    support: {
      csat: 2.3,
      sentiment: "Negative",
      tickets: [
        { id: "TIC-4790", title: "HIPAA audit log export format mismatch", priority: "P1", status: "open", date: "3 days ago" },
        { id: "TIC-4791", title: "Latency spikes on HL7 FHIR parser endpoint", priority: "P1", status: "open", date: "4 days ago" },
      ],
    },
    contacts: [
      { name: "Dr. Evelyn Reed", role: "Chief Medical Information Officer", email: "ereed@pulsehealth.org", isChampion: true },
      { name: "Tom Higgins", role: "Head of Infrastructure", email: "thiggins@pulsehealth.org", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "High ARR account experiencing compliance reporting blockers. Critical to protect before upcoming hospital fiscal year renewal.",
      riskFactors: [
        "2 pending P1 HIPAA related support requests",
        "CSAT trend down from 4.8 to 2.3 over 60 days",
      ],
      recommendedAction: "Assign dedicated technical architect for weekly war room until tickets are cleared.",
      urgency: "Within 7 Days",
    },
    recommendedPlaybookId: "pb-5",
  },
  {
    id: "cust-10",
    name: "QuantumCore Robotics",
    company: "QuantumCore Robotics",
    avatar: "QC",
    tier: "Pro",
    mrr: 3900,
    arr: 46800,
    healthScore: 56,
    churnRiskScore: 48,
    riskTier: "moderate",
    primaryCause: "Low Product Adoption",
    topTrigger: "Core simulation features untouched in 45 days",
    daysToRenewal: 72,
    csm: "Marcus Vance",
    industry: "Robotics & Hardware",
    seatUtilization: 50,
    activeUsers: 8,
    totalUsers: 16,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 14,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 3,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-08",
      cardExpiry: "01/28",
      invoices: [{ id: "inv-915", date: "2026-10-08", amount: 3900, status: "paid" }],
    },
    support: {
      csat: 4.0,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Koji Tanaka", role: "Robotics Lead", email: "tanaka@quantumcore.com", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Stable account with moderate engagement drop. Simulation feature module not activated.",
      riskFactors: ["Simulation workload inactive", "Seat growth stalled"],
      recommendedAction: "Send automated feature spotlight and workshop invitation.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-3",
  },
  {
    id: "cust-11",
    name: "NexaTech Automations",
    company: "NexaTech Automations",
    avatar: "NT",
    tier: "Starter",
    mrr: 850,
    arr: 10200,
    healthScore: 19,
    churnRiskScore: 86,
    riskTier: "critical",
    primaryCause: "Billing Friction",
    topTrigger: "Payment bounced twice • 0 logins past 12 days",
    daysToRenewal: 5,
    csm: "Marcus Vance",
    industry: "Workflow Automation",
    seatUtilization: 20,
    activeUsers: 1,
    totalUsers: 5,
    telemetry: {
      activity30Days: generateTelemetry("drop"),
      usageDropPercent: 70,
      openP1Tickets: 0,
      billingFailures: 2,
      lastActiveDaysAgo: 12,
    },
    billing: {
      status: "failing",
      lastPaymentDate: "2026-09-20",
      cardExpiry: "10/26",
      invoices: [
        { id: "inv-935", date: "2026-10-20", amount: 850, status: "failed" },
      ],
    },
    support: {
      csat: 3.0,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Danielle Cox", role: "Operations Lead", email: "dcox@nexatech.io", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Dual failure: Inactive user base compounded by expired payment method.",
      riskFactors: ["12 days since last session", "Invoice past due"],
      recommendedAction: "Automated billing grace email with self-service update token.",
      urgency: "Immediate",
    },
    recommendedPlaybookId: "pb-1",
  },
  {
    id: "cust-12",
    name: "Hyperion Analytics",
    company: "Hyperion Analytics",
    avatar: "HA",
    tier: "Pro",
    mrr: 4500,
    arr: 54000,
    healthScore: 58,
    churnRiskScore: 42,
    riskTier: "moderate",
    primaryCause: "Pricing Sensitivity",
    topTrigger: "CFO requested cost justification report",
    daysToRenewal: 85,
    csm: "Michael Chang",
    industry: "Business Intelligence",
    seatUtilization: 75,
    activeUsers: 15,
    totalUsers: 20,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 8,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-04",
      cardExpiry: "06/28",
      invoices: [{ id: "inv-908", date: "2026-10-04", amount: 4500, status: "paid" }],
    },
    support: {
      csat: 4.1,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Angela Rossi", role: "Head of BI", email: "angela@hyperion.ai", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Healthy telemetry, but budgeting cycle could trigger consolidation unless ROI is presented clearly.",
      riskFactors: ["Approaching annual budget review"],
      recommendedAction: "Send automated quarterly ROI Executive Summary PDF.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-4",
  },
  {
    id: "cust-13",
    name: "LogixGrid Systems",
    company: "LogixGrid Systems",
    avatar: "LG",
    tier: "Enterprise",
    mrr: 7800,
    arr: 93600,
    healthScore: 36,
    churnRiskScore: 74,
    riskTier: "high",
    primaryCause: "Support Escalations",
    topTrigger: "2 unresolved P1 tickets • CSAT drop",
    daysToRenewal: 31,
    csm: "Sarah Jenkins",
    industry: "Supply Chain & Logistics",
    seatUtilization: 58,
    activeUsers: 29,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("volatile"),
      usageDropPercent: 24,
      openP1Tickets: 2,
      billingFailures: 0,
      lastActiveDaysAgo: 2,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-09-29",
      cardExpiry: "02/27",
      invoices: [{ id: "inv-888", date: "2026-09-29", amount: 7800, status: "paid" }],
    },
    support: {
      csat: 2.1,
      sentiment: "Negative",
      tickets: [
        { id: "TIC-4815", title: "Warehouse barcode scanner sync failure", priority: "P1", status: "open", date: "3 days ago" },
      ],
    },
    contacts: [
      { name: "Patrick Moore", role: "VP Supply Chain Tech", email: "pmoore@logixgrid.com", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Critical warehouse integration bug is driving customer dissatisfaction. High risk of non-renewal.",
      riskFactors: ["Pending warehouse API sync ticket", "CSAT below 2.5"],
      recommendedAction: "Deploy Senior Solutions Architect to resolve integration sync in under 24 hours.",
      urgency: "Within 7 Days",
    },
    recommendedPlaybookId: "pb-5",
  },
  {
    id: "cust-14",
    name: "Lumina Studio",
    company: "Lumina Studio",
    avatar: "LS",
    tier: "Starter",
    mrr: 650,
    arr: 7800,
    healthScore: 88,
    churnRiskScore: 22,
    riskTier: "healthy",
    primaryCause: "Low Product Adoption",
    topTrigger: "Daily logins steady • High engagement",
    daysToRenewal: 110,
    csm: "Marcus Vance",
    industry: "Creative Studio",
    seatUtilization: 95,
    activeUsers: 5,
    totalUsers: 5,
    telemetry: {
      activity30Days: generateTelemetry("growing"),
      usageDropPercent: 0,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 0,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-12",
      cardExpiry: "08/29",
      invoices: [{ id: "inv-922", date: "2026-10-12", amount: 650, status: "paid" }],
    },
    support: {
      csat: 4.9,
      sentiment: "Positive",
      tickets: [],
    },
    contacts: [
      { name: "Chloe Martin", role: "Creative Director", email: "chloe@luminastudio.com", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Exemplary customer health. Maximized seat capacity and growing session count.",
      riskFactors: ["At maximum seat capacity"],
      recommendedAction: "Candidate for upsell to Pro tier.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-6",
  },
  {
    id: "cust-15",
    name: "Stratos Cloud",
    company: "Stratos Cloud",
    avatar: "SC",
    tier: "Pro",
    mrr: 3200,
    arr: 38400,
    healthScore: 82,
    churnRiskScore: 28,
    riskTier: "healthy",
    primaryCause: "Low Product Adoption",
    topTrigger: "Active usage across all team members",
    daysToRenewal: 140,
    csm: "Michael Chang",
    industry: "Dev Tools",
    seatUtilization: 80,
    activeUsers: 16,
    totalUsers: 20,
    telemetry: {
      activity30Days: generateTelemetry("growing"),
      usageDropPercent: 0,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-14",
      cardExpiry: "04/28",
      invoices: [{ id: "inv-929", date: "2026-10-14", amount: 3200, status: "paid" }],
    },
    support: {
      csat: 4.8,
      sentiment: "Positive",
      tickets: [],
    },
    contacts: [
      { name: "Eric Miller", role: "Engineering Lead", email: "eric@stratoscloud.io", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Healthy account with solid retention fundamentals.",
      riskFactors: [],
      recommendedAction: "Maintain standard cadence.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-6",
  },
  {
    id: "cust-16",
    name: "Apex Ledger",
    company: "Apex Ledger",
    avatar: "AL",
    tier: "Starter",
    mrr: 720,
    arr: 8640,
    healthScore: 42,
    churnRiskScore: 66,
    riskTier: "high",
    primaryCause: "Billing Friction",
    topTrigger: "Card expiring next month • 1 past payment retry",
    daysToRenewal: 19,
    csm: "Marcus Vance",
    industry: "Accounting SaaS",
    seatUtilization: 60,
    activeUsers: 3,
    totalUsers: 5,
    telemetry: {
      activity30Days: generateTelemetry("steady"),
      usageDropPercent: 8,
      openP1Tickets: 0,
      billingFailures: 1,
      lastActiveDaysAgo: 2,
    },
    billing: {
      status: "failing",
      lastPaymentDate: "2026-09-22",
      cardExpiry: "11/26",
      invoices: [
        { id: "inv-877", date: "2026-09-22", amount: 720, status: "paid" },
      ],
    },
    support: {
      csat: 4.0,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Walter Scott", role: "Founder", email: "walter@apexledger.co", isChampion: false },
    ],
    aiDiagnosis: {
      summary: "Payment card expiring in November 2026 with prior failed retry.",
      riskFactors: ["Card near expiration", "Single admin contact"],
      recommendedAction: "Trigger automated Card Expiry Reminder sequence.",
      urgency: "Within 7 Days",
    },
    recommendedPlaybookId: "pb-1",
  },
  {
    id: "cust-17",
    name: "Velocity CRM",
    company: "Velocity CRM",
    avatar: "VC",
    tier: "Enterprise",
    mrr: 10400,
    arr: 124800,
    healthScore: 50,
    churnRiskScore: 52,
    riskTier: "moderate",
    primaryCause: "Low Product Adoption",
    topTrigger: "22 unused enterprise user licenses",
    daysToRenewal: 77,
    csm: "Sarah Jenkins",
    industry: "Sales Tech",
    seatUtilization: 56,
    activeUsers: 28,
    totalUsers: 50,
    telemetry: {
      activity30Days: generateTelemetry("volatile"),
      usageDropPercent: 19,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 1,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-06",
      cardExpiry: "09/27",
      invoices: [{ id: "inv-913", date: "2026-10-06", amount: 10400, status: "paid" }],
    },
    support: {
      csat: 3.9,
      sentiment: "Neutral",
      tickets: [],
    },
    contacts: [
      { name: "Diana Prince", role: "VP Revenue Operations", email: "diana@velocitycrm.io", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Moderate renewal hazard: Half of licensed seats are dormant. Risk of downsizing on renewal.",
      riskFactors: ["22 dormant licenses", "Under-indexing on workflow triggers"],
      recommendedAction: "Run an automated License Reallocation & Seat Clean-up Review.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-6",
  },
  {
    id: "cust-18",
    name: "Zenith Commerce",
    company: "Zenith Commerce",
    avatar: "ZC",
    tier: "Pro",
    mrr: 2950,
    arr: 35400,
    healthScore: 85,
    churnRiskScore: 26,
    riskTier: "healthy",
    primaryCause: "Low Product Adoption",
    topTrigger: "Consistent daily traffic • High NPS",
    daysToRenewal: 160,
    csm: "Michael Chang",
    industry: "E-commerce Infrastructure",
    seatUtilization: 85,
    activeUsers: 17,
    totalUsers: 20,
    telemetry: {
      activity30Days: generateTelemetry("growing"),
      usageDropPercent: 0,
      openP1Tickets: 0,
      billingFailures: 0,
      lastActiveDaysAgo: 0,
    },
    billing: {
      status: "active",
      lastPaymentDate: "2026-10-15",
      cardExpiry: "12/28",
      invoices: [{ id: "inv-933", date: "2026-10-15", amount: 2950, status: "paid" }],
    },
    support: {
      csat: 4.7,
      sentiment: "Positive",
      tickets: [],
    },
    contacts: [
      { name: "Liam Vance", role: "CTO", email: "liam@zenithcommerce.com", isChampion: true },
    ],
    aiDiagnosis: {
      summary: "Strong customer health with zero churn indicators.",
      riskFactors: [],
      recommendedAction: "Invite to Customer Advisory Board and review case study opportunity.",
      urgency: "Monitor",
    },
    recommendedPlaybookId: "pb-6",
  },
];

export const mockPlaybooks: Playbook[] = [
  {
    id: "pb-1",
    name: "Billing Rescue Auto-pilot",
    category: "Commercial",
    icon: "CreditCard",
    description: "Instant smart dunning workflow offering 14-day grace extension, 1-click payment method update link, and ACH/Wire fallback.",
    targetSegment: "Accounts with 1+ failed payment or card expiring within 30 days",
    winRate: 86,
    savedARR: 480000,
    actionType: "Automated Payment Grace & Direct Link",
    defaultDiscount: 0,
    emailTemplate: {
      subject: "Action Required: Retain uninterrupted access for {{company}}",
      body: `Hi {{contact_name}},

We noticed an issue processing the latest subscription invoice for {{company}}. To ensure your team experiences zero interruption to critical platform workflows, we've extended an immediate 14-day billing grace period.

You can securely update your payment method or select direct ACH/Wire invoicing using your verified single-sign-on portal:
{{update_payment_link}}

If you need an updated invoice addressed to your procurement department, simply reply to this email and our finance desk will assist immediately.

Best regards,
The Customer Success & Finance Desk`,
    },
  },
  {
    id: "pb-2",
    name: "Executive VIP War Room & SLA Credit",
    category: "Success & Onboarding",
    icon: "ShieldAlert",
    description: "Direct executive outreach offering emergency ticket escalation, engineering lead assignment, and proactive SLA credits.",
    targetSegment: "Enterprise accounts with unresolved P1 tickets or CSAT < 2.5",
    winRate: 74,
    savedARR: 620000,
    actionType: "VIP Escalation & SLA Credit Offer",
    defaultDiscount: 10,
    emailTemplate: {
      subject: "Priority Escalation & Personal Commitment for {{company}}",
      body: `Hi {{contact_name}},

I am reaching out directly from our executive team. I've reviewed your recent support telemetry and realize our response times on critical incidents have not met the high standard {{company}} deserves.

Here are the immediate steps we have taken:
1. Assigned our Lead Principal Architect to directly resolve your open P1 ticket.
2. Applied an immediate 15% SLA service credit to your current billing cycle.
3. Scheduled a direct 20-minute executive alignment check-in: {{meeting_link}}

Your partnership is extremely valuable to us, and we are committed to earning your trust every single day.

Warm regards,
VP of Customer Success & Engineering`,
    },
  },
  {
    id: "pb-3",
    name: "Feature Onboarding & Activation Sprint",
    category: "Product Adoption",
    icon: "Sparkles",
    description: "Personalized activation playbook targeting unused high-value modules with 1-on-1 solutions architecture session.",
    targetSegment: "Accounts with >30% drop in active users or dormant core features",
    winRate: 69,
    savedARR: 390000,
    actionType: "Solutions Architect Training Session",
    defaultDiscount: 0,
    emailTemplate: {
      subject: "Unlocking advanced value for {{company}}'s team",
      body: `Hi {{contact_name}},

We noticed your team hasn't yet activated several new automation and reporting workflows included with your {{tier}} subscription. 

Companies in {{industry}} typically see a 3.4x efficiency gain once these workflows are activated. To help your team hit the ground running, our Senior Solutions Architect would love to run a customized 30-minute training session for your team:
{{meeting_link}}

Let us know a time that works best for your team this week!

Best regards,
Customer Success Team`,
    },
  },
  {
    id: "pb-4",
    name: "Annual Renewal Lock-in (15% Off)",
    category: "Commercial",
    icon: "Percent",
    description: "Strategic commercial offer offering 15% discount or 2 free months on multi-year renewal to preempt pricing churn.",
    targetSegment: "Accounts with contract expiring in <60 days with pricing sensitivity",
    winRate: 82,
    savedARR: 540000,
    actionType: "Discounted Multi-Year Amendment",
    defaultDiscount: 15,
    emailTemplate: {
      subject: "Exclusive annual renewal terms & budget lock for {{company}}",
      body: `Hi {{contact_name}},

As {{company}}'s renewal date approaches on {{renewal_date}}, we want to ensure you have the best possible economics for your upcoming fiscal planning.

We have approved an exclusive 15% annual incentive discount when extending your {{tier}} commitment for the next 12 months. This locks in your legacy pricing tier and protects your team against planned upcoming rate adjustments:
{{renewal_link}}

We can also structure flexible quarterly invoicing if preferred by your finance team.

Looking forward to your thoughts!

Best regards,
Commercial Operations Desk`,
    },
  },
  {
    id: "pb-5",
    name: "Dedicated CSM & Priority SLA Escalation",
    category: "Success & Onboarding",
    icon: "UserCheck",
    description: "Pairs struggling accounts with a dedicated Technical Account Manager and establishes bi-weekly status syncs.",
    targetSegment: "Accounts with complex integration hurdles or frequent escalations",
    winRate: 77,
    savedARR: 410000,
    actionType: "Dedicated TAM & SLA Guarantee",
    defaultDiscount: 0,
    emailTemplate: {
      subject: "Introducing your dedicated Technical Account Manager for {{company}}",
      body: `Hi {{contact_name}},

To ensure {{company}} gets optimal throughput and immediate technical response, we are assigning a dedicated Technical Account Manager to your account: {{csm}}.

{{csm}} will conduct a deep architectural review of your setup and establish a private Slack/Teams channel for priority assistance.

You can schedule your introductory roadmap review here:
{{meeting_link}}

Best regards,
Director of Technical Operations`,
    },
  },
  {
    id: "pb-6",
    name: "Unused License Optimizer & Team Expansion",
    category: "Product Adoption",
    icon: "Users",
    description: "Helps customers audit inactive seats, reallocate licenses to active teams, and prevent downsell surprises.",
    targetSegment: "Accounts with <50% seat utilization",
    winRate: 71,
    savedARR: 310000,
    actionType: "License Audit & Seat Optimization",
    defaultDiscount: 0,
    emailTemplate: {
      subject: "Maximizing {{company}}'s seat utilization and team impact",
      body: `Hi {{contact_name}},

During our routine account health audit, we noticed {{company}} has {{unused_seats}} unallocated seats in your current {{tier}} plan.

Rather than letting those licenses sit idle, we can help you either:
1. Reallocate seats to other departments (e.g. Data, Marketing, or Product)
2. Right-size your licensing at your upcoming renewal to optimize spend

Click here to view your team's live seat allocation audit:
{{audit_link}}

Best regards,
Account Management Team`,
    },
  },
];

export const mockActiveCampaigns: ActiveCampaign[] = [
  {
    id: "camp-101",
    customerId: "cust-1",
    customerName: "David Sterling",
    company: "Acme Cloud Systems",
    playbookName: "Executive VIP War Room & SLA Credit",
    category: "Success & Onboarding",
    status: "Active",
    mrrProtected: 12500,
    date: "Today at 09:14 AM",
    tone: "Executive & Strategic",
  },
  {
    id: "camp-102",
    customerId: "cust-2",
    customerName: "Claire Dupont",
    company: "Synthetix AI",
    playbookName: "Billing Rescue Auto-pilot",
    category: "Commercial",
    status: "Delivered",
    mrrProtected: 9200,
    date: "Yesterday",
    tone: "Empathetic & Urgent",
  },
  {
    id: "camp-103",
    customerId: "cust-4",
    customerName: "Robert Hayes",
    company: "FinEdge Capital",
    playbookName: "Annual Renewal Lock-in (15% Off)",
    category: "Commercial",
    status: "Engaged",
    mrrProtected: 14800,
    date: "2 days ago",
    tone: "Strategic Incentive",
  },
  {
    id: "camp-104",
    customerId: "cust-7",
    customerName: "Brian O'Connor",
    company: "NovaPay Technologies",
    playbookName: "Unused License Optimizer & Team Expansion",
    category: "Product Adoption",
    status: "Saved",
    mrrProtected: 4100,
    date: "4 days ago",
    tone: "Consultative",
  },
];

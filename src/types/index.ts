export type RiskTier = 'critical' | 'high' | 'moderate' | 'healthy';

export type PlanTier = 'Enterprise' | 'Pro' | 'Starter';

export type PrimaryCause = 
  | 'Low Product Adoption' 
  | 'Billing Friction' 
  | 'Support Escalations' 
  | 'Pricing Sensitivity';

export interface Customer {
  id: string;
  name: string;
  company: string;
  avatar: string;
  tier: PlanTier;
  mrr: number;
  arr: number;
  healthScore: number; // 0 - 100
  churnRiskScore: number; // 0 - 100
  riskTier: RiskTier;
  primaryCause: PrimaryCause;
  topTrigger: string;
  daysToRenewal: number;
  csm: string;
  industry: string;
  seatUtilization: number; // e.g. 35%
  activeUsers: number;
  totalUsers: number;
  telemetry: {
    activity30Days: Array<{ day: string; logins: number; apiCalls: number }>;
    usageDropPercent: number;
    openP1Tickets: number;
    billingFailures: number;
    lastActiveDaysAgo: number;
  };
  billing: {
    status: 'active' | 'failing' | 'overdue' | 'disputed';
    lastPaymentDate: string;
    cardExpiry: string;
    invoices: Array<{ id: string; date: string; amount: number; status: 'paid' | 'failed' | 'retrying' }>;
  };
  support: {
    csat: number; // out of 5
    sentiment: 'Negative' | 'Neutral' | 'Positive';
    tickets: Array<{ id: string; title: string; priority: 'P1' | 'P2' | 'P3'; status: 'open' | 'pending' | 'resolved'; date: string }>;
  };
  contacts: Array<{ name: string; role: string; email: string; phone?: string; isChampion?: boolean }>;
  aiDiagnosis: {
    summary: string;
    riskFactors: string[];
    recommendedAction: string;
    urgency: 'Immediate' | 'Within 7 Days' | 'Monitor';
  };
  recommendedPlaybookId: string;
}

export interface Playbook {
  id: string;
  name: string;
  category: 'Commercial' | 'Success & Onboarding' | 'Product Adoption';
  icon: string;
  description: string;
  targetSegment: string;
  winRate: number; // e.g. 74%
  savedARR: number;
  actionType: string;
  defaultDiscount?: number;
  emailTemplate: {
    subject: string;
    body: string;
  };
}

export interface ActiveCampaign {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  playbookName: string;
  category: string;
  status: 'Active' | 'Delivered' | 'Engaged' | 'Saved' | 'At Risk';
  mrrProtected: number;
  date: string;
  tone: string;
}

export interface ExecutiveMetrics {
  churnRate: number;
  churnRateChange: number;
  atRiskARR: number;
  atRiskMRR: number;
  atRiskAccountsCount: number;
  totalAccounts: number;
  nrr: number;
  nrrChange: number;
  retentionRoi: string;
  savedArrYTD: number;
}

export interface ChatWidgetData {
  type: 'accounts_list' | 'simulation_result' | 'email_draft' | 'root_cause_summary' | 'stats';
  accounts?: Customer[];
  simulation?: {
    intervention: string;
    baselineChurnMRR: number;
    mitigatedChurnMRR: number;
    mrrSaved: number;
    pctReduction: number;
  };
  emailDraft?: {
    recipient: string;
    company: string;
    subject: string;
    body: string;
  };
  stats?: Record<string, string | number>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  widget?: ChatWidgetData;
}

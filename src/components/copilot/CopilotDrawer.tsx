"use client";

import React from "react";
import { X, Sparkles, Bot } from "lucide-react";
import { CopilotView } from "./CopilotView";
import { Customer } from "@/types";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerProfile?: (customerId: string) => void;
  onDeployPlaybookForCustomer?: (customer: Customer) => void;
  initialPrompt?: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCustomerProfile,
  onDeployPlaybookForCustomer,
  initialPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">AI Retention Copilot Drawer</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <CopilotView
              onOpenCustomerProfile={(id) => {
                onClose();
                onOpenCustomerProfile?.(id);
              }}
              onDeployPlaybookForCustomer={(cust) => {
                onClose();
                onDeployPlaybookForCustomer?.(cust);
              }}
              initialPrompt={initialPrompt}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";
import { CustomersDirectory } from "@/components/directory/CustomersDirectory";
import { CustomerDrawer } from "@/components/directory/CustomerDrawer";
import { PlaybooksView } from "@/components/playbooks/PlaybooksView";
import { CopilotView } from "@/components/copilot/CopilotView";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";
import { mockCustomers } from "@/lib/mock-data";
import { Customer } from "@/types";

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "directory" | "playbooks" | "copilot">("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  // Selected customer for modal/drawer or playbooks
  const [selectedCustomerIdForDrawer, setSelectedCustomerIdForDrawer] = useState<string | null>(null);
  const [selectedCustomerForPlaybook, setSelectedCustomerForPlaybook] = useState<Customer | null>(null);
  const [directoryInitialTier, setDirectoryInitialTier] = useState<string | undefined>(undefined);

  // Quick copilot drawer
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  const activeDrawerCustomer = mockCustomers.find((c) => c.id === selectedCustomerIdForDrawer) || null;

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      }
      return next;
    });
  };

  const handleNavigateToDirectory = (tier?: string) => {
    setDirectoryInitialTier(tier);
    setCurrentView("directory");
  };

  const handleNavigateToPlaybooks = (category?: string) => {
    setCurrentView("playbooks");
  };

  const handleOpenCustomerProfile = (customerId: string) => {
    setSelectedCustomerIdForDrawer(customerId);
  };

  const handleGenerateStrategy = (customer: Customer) => {
    setSelectedCustomerForPlaybook(customer);
    setCurrentView("playbooks");
  };

  const handleOpenCopilotWithPrompt = (prompt: string) => {
    setCopilotInitialPrompt(prompt);
    setIsCopilotDrawerOpen(true);
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? "dark bg-[#0a0f1d]" : "light bg-[#f8fafc]"} text-slate-100`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenQuickCopilot={() => {
          setCopilotInitialPrompt("Simulate churn reduction if we offer a 15% annual renewal discount to billing-sensitive users.");
          setIsCopilotDrawerOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          onOpenQuickCopilot={() => setIsCopilotDrawerOpen(true)}
          onSelectCustomerById={handleOpenCustomerProfile}
        />

        {/* View Router */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === "dashboard" && (
            <ExecutiveDashboard
              onNavigateToDirectory={handleNavigateToDirectory}
              onNavigateToPlaybooks={handleNavigateToPlaybooks}
              onOpenCustomerProfile={handleOpenCustomerProfile}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}

          {currentView === "directory" && (
            <CustomersDirectory
              customers={mockCustomers}
              initialTierFilter={directoryInitialTier}
              onGenerateStrategy={handleGenerateStrategy}
              onOpenCustomerProfile={handleOpenCustomerProfile}
            />
          )}

          {currentView === "playbooks" && (
            <PlaybooksView
              initialCustomer={selectedCustomerForPlaybook}
              onClearSelectedCustomer={() => setSelectedCustomerForPlaybook(null)}
              onOpenCustomerProfile={handleOpenCustomerProfile}
            />
          )}

          {currentView === "copilot" && (
            <CopilotView
              onOpenCustomerProfile={handleOpenCustomerProfile}
              onDeployPlaybookForCustomer={handleGenerateStrategy}
              initialPrompt={copilotInitialPrompt}
            />
          )}
        </main>
      </div>

      {/* Slide-over Customer Profile Drawer */}
      <CustomerDrawer
        customer={activeDrawerCustomer}
        isOpen={!!activeDrawerCustomer}
        onClose={() => setSelectedCustomerIdForDrawer(null)}
        onGenerateStrategy={handleGenerateStrategy}
      />

      {/* Ubiquitous AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotDrawerOpen}
        onClose={() => setIsCopilotDrawerOpen(false)}
        onOpenCustomerProfile={handleOpenCustomerProfile}
        onDeployPlaybookForCustomer={handleGenerateStrategy}
        initialPrompt={copilotInitialPrompt}
      />
    </div>
  );
}

import { useState } from "react";
import { LayoutDashboard, MessageSquareText, GitCompare, ListChecks, FolderDown, ShieldAlert } from "lucide-react";
import OverviewSection from "@/components/OverviewSection";
import OpenQuestionsSection from "@/components/OpenQuestionsSection";
import ModelComparisonSection from "@/components/ModelComparisonSection";
import MCCurationSection from "@/components/MCCurationSection";
import FilesSection from "@/components/FilesSection";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "open", label: "Open Questions", icon: MessageSquareText },
  { id: "comparison", label: "Model Comparison", icon: GitCompare },
  { id: "mc", label: "Multiple Choice", icon: ListChecks },
  { id: "files", label: "Files / Reports", icon: FolderDown },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-serif tracking-tight">
            Medical LLM Evaluation Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Academic benchmark analysis — Comparing LLM performance on curated medical questions
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-1 -mb-px scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="disclaimer-bar flex items-center justify-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Academic visualization only · Not for clinical decision-making · LLM outputs require human supervision</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "open" && <OpenQuestionsSection />}
        {activeTab === "comparison" && <ModelComparisonSection />}
        {activeTab === "mc" && <MCCurationSection />}
        {activeTab === "files" && <FilesSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 Gilson Inácio da Silva — Medical LLM Evaluation Project</p>
          <div className="flex gap-4">
            <span>Repository: <em>placeholder</em></span>
            <span>Report: <em>placeholder</em></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

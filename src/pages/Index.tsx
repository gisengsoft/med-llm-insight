import { useState } from "react";
import { LayoutDashboard, MessageSquareText, GitCompare, ListChecks, FolderDown, ShieldAlert, Activity, AlertTriangle } from "lucide-react";
import OverviewSection from "@/components/OverviewSection";
import NotableCasesSection from "@/components/NotableCasesSection";
import OpenQuestionsSection from "@/components/OpenQuestionsSection";
import ModelComparisonSection from "@/components/ModelComparisonSection";
import MCCurationSection from "@/components/MCCurationSection";
import FilesSection from "@/components/FilesSection";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "open", label: "Open Questions", icon: MessageSquareText },
  { id: "notable", label: "Notable Cases", icon: AlertTriangle },
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
      <header className="premium-header text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
              Medical LLM Evaluation Explorer
            </h1>
          </div>
          <p className="text-sm text-white/70 ml-[52px]">
            Academic benchmark analysis — Comparing LLM performance on curated medical questions
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 -mb-px scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 w-full">
        <div className="disclaimer-bar flex items-center justify-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          <span>Academic visualization only · Not for clinical decision-making · LLM outputs require human supervision</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "open" && <OpenQuestionsSection />}
        {activeTab === "notable" && <NotableCasesSection />}
        {activeTab === "comparison" && <ModelComparisonSection />}
        {activeTab === "mc" && <MCCurationSection />}
        {activeTab === "files" && <FilesSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="font-medium">© 2025 Gilson Inácio da Silva — Medical LLM Evaluation Project</p>
          <div className="flex gap-6">
            <span>Repository: <em className="text-foreground/50">placeholder</em></span>
            <span>Report: <em className="text-foreground/50">placeholder</em></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

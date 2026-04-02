import { useState } from "react";
import {
  ClipboardList,
  Flag,
  BarChart2,
  ListChecks,
  FolderOpen,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

import OverviewSection from "@/components/OverviewSection";
import NotableCasesSection from "@/components/NotableCasesSection";
import OpenQuestionsSection from "@/components/OpenQuestionsSection";
import ModelComparisonSection from "@/components/ModelComparisonSection";
import MCCurationSection from "@/components/MCCurationSection";
import FilesSection from "@/components/FilesSection";

const tabs = [
  { id: "overview", label: "Dashboard", icon: BarChart2 },
  { id: "open", label: "Open Questions", icon: ClipboardList },
  { id: "notable", label: "Notable Cases", icon: Flag },
  { id: "comparison", label: "Model Comparison", icon: BarChart2 },
  { id: "mc", label: "Multiple Choice", icon: ListChecks },
  { id: "files", label: "Files & Reports", icon: FolderOpen },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="premium-header text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/12 backdrop-blur-sm ring-1 ring-white/10 overflow-hidden">
              <img
                src="/med_llm_insights_logo.png"
                alt="Med LLM Insights logo"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight leading-tight">
                Med LLM Insights
              </h1>
              <p className="text-xs sm:text-sm text-white/70 mt-0.5 font-light tracking-wide">
                Medical LLM Evaluation Explorer
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav
        className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-30"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0.5 overflow-x-auto py-1.5 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 w-full">
        <div className="disclaimer-bar flex items-center justify-center gap-2.5">
          <ShieldCheck
            className="h-3.5 w-3.5 shrink-0 text-primary/60"
            strokeWidth={1.8}
          />
          <span className="tracking-wide">
            Academic visualization only · Not for clinical decision-making · LLM
            outputs require expert review
          </span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "open" && <OpenQuestionsSection />}
        {activeTab === "notable" && <NotableCasesSection />}
        {activeTab === "comparison" && <ModelComparisonSection />}
        {activeTab === "mc" && <MCCurationSection />}
        {activeTab === "files" && <FilesSection />}
      </main>

      <footer className="border-t border-border bg-card/60 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5" strokeWidth={1.8} />
            <p className="font-medium">
              © 2025 Gilson Inácio da Silva — Med LLM Insights
            </p>
          </div>

          <div className="flex gap-5 text-[11px] uppercase tracking-wider">
            <a
              href="https://github.com/gis45ufs/Top-Avanc-EngSoft-SI-I-26-1-Gilson-Inacio-Silva-Med-Ativ1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Repository ↗
            </a>

            <a
              href="https://github.com/gis45ufs/Top-Avanc-EngSoft-SI-I-26-1-Gilson-Inacio-Silva-Med-Ativ1/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Report ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
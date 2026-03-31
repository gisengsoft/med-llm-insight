import { FileDown, FileText, Table2, FileSpreadsheet, ExternalLink, FolderOpen, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const REPO_BASE = "https://github.com/gis45ufs/Top-Avanc-EngSoft-SI-I-26-1-Gilson-Inacio-Silva-Med-Ativ1";

const files = [
  {
    name: "Evaluation Workbook (XLSX)",
    icon: FileSpreadsheet,
    desc: "Complete evaluation workbook with all data sheets",
    href: `${REPO_BASE}/blob/main/outputs/Workbook_Equipe2_Medicina_Atividade1_Gilson_Inacio_da_Silva.xlsx`,
  },
  {
    name: "Final Report (PDF)",
    icon: FileText,
    desc: "Final academic report in PDF format",
    href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.pdf`,
  },
  {
    name: "Editable Report (DOCX)",
    icon: FileDown,
    desc: "Editable report in Word format",
    href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.docx`,
  },
  {
    name: "LLM Evaluation Scores (CSV)",
    icon: Table2,
    desc: "Evaluation scores and reviewer comments for each model",
    href: `${REPO_BASE}/blob/main/outputs/avaliacao_llms.csv`,
  },
  {
    name: "Open Questions Curation (CSV)",
    icon: Table2,
    desc: "Curated open-ended questions with gold-standard answers",
    href: `${REPO_BASE}/blob/main/outputs/curadoria_abertas.csv`,
  },
  {
    name: "Multiple Choice Curation (CSV)",
    icon: Table2,
    desc: "Curated multiple-choice questions and correct options",
    href: `${REPO_BASE}/blob/main/outputs/curadoria_mc.csv`,
  },
  {
    name: "LLM Responses (CSV)",
    icon: Table2,
    desc: "Raw model responses to open-ended questions",
    href: `${REPO_BASE}/blob/main/outputs/respostas_llms.csv`,
  },
];

const externalLinks = [
  { label: "View Repository", href: REPO_BASE },
  { label: "Open Final Report", href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.pdf` },
  { label: "Open Editable Report", href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.docx` },
  { label: "Open Workbook", href: `${REPO_BASE}/blob/main/outputs/Workbook_Equipe2_Medicina_Atividade1_Gilson_Inacio_da_Silva.xlsx` },
];

export default function FilesSection() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <FolderOpen className="h-5 w-5 text-primary/70" strokeWidth={1.7} />
          <h2 className="section-title text-xl">Files & Reports</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Access the main data files, workbook, reports, and presentation materials generated in this evaluation project.
        </p>
      </div>

      {/* Presentation Video */}
      <div className="chart-container border-primary/20 bg-gradient-to-br from-card to-primary/[0.03]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Video className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground tracking-tight font-serif">Presentation Video</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Watch the short presentation of this project.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            disabled
          >
            <Play className="h-3.5 w-3.5" strokeWidth={2} />
            Video link coming soon
          </Button>
        </div>
      </div>

      {/* File cards */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Project Files</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {files.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.name} className="chart-container flex items-start gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.06] text-primary group-hover:bg-primary/[0.12] transition-colors">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground tracking-tight leading-snug">{f.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" strokeWidth={2} />
                    Open on GitHub
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* External Links */}
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">External Links</p>
        <div className="flex flex-wrap gap-3">
          {externalLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2 font-semibold text-xs border-border hover:border-primary/40 hover:text-primary transition-all">
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                {link.label}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

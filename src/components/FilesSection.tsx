import { FileDown, FileText, Table2, FileSpreadsheet, ExternalLink, FolderOpen } from "lucide-react";

const REPO_BASE = "https://github.com/gis45ufs/Top-Avanc-EngSoft-SI-I-26-1-Gilson-Inacio-Silva-Med-Ativ1";

const files = [
  {
    name: "Workbook (.xlsx)",
    icon: FileSpreadsheet,
    desc: "Complete evaluation workbook with all data sheets",
    href: `${REPO_BASE}/blob/main/outputs/Workbook_Equipe2_Medicina_Atividade1_Gilson_Inacio_da_Silva.xlsx`,
  },
  {
    name: "Report (.pdf)",
    icon: FileText,
    desc: "Final academic report in PDF format",
    href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.pdf`,
  },
  {
    name: "Report (.docx)",
    icon: FileDown,
    desc: "Editable report in Word format",
    href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.docx`,
  },
  {
    name: "avaliacao_llms.csv",
    icon: Table2,
    desc: "LLM evaluation scores and reviewer comments",
    href: `${REPO_BASE}/blob/main/outputs/avaliacao_llms.csv`,
  },
  {
    name: "curadoria_abertas.csv",
    icon: Table2,
    desc: "Curated open-ended questions with gold answers",
    href: `${REPO_BASE}/blob/main/outputs/curadoria_abertas.csv`,
  },
  {
    name: "curadoria_mc.csv",
    icon: Table2,
    desc: "Curated multiple-choice questions",
    href: `${REPO_BASE}/blob/main/outputs/curadoria_mc.csv`,
  },
  {
    name: "respostas_llms.csv",
    icon: Table2,
    desc: "LLM responses to open questions",
    href: `${REPO_BASE}/blob/main/outputs/respostas_llms.csv`,
  },
];

const externalLinks = [
  { label: "Repository", href: REPO_BASE },
  { label: "Full Report (PDF)", href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.pdf` },
  { label: "Editable Report (DOCX)", href: `${REPO_BASE}/blob/main/relatorio/Relatorio_Individual_Gilson_Inacio_Silva_Atividade1.docx` },
  { label: "Workbook (XLSX)", href: `${REPO_BASE}/blob/main/outputs/Workbook_Equipe2_Medicina_Atividade1_Gilson_Inacio_da_Silva.xlsx` },
];

export default function FilesSection() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <FolderOpen className="h-5 w-5 text-primary/70" strokeWidth={1.7} />
        <h2 className="section-title text-xl">Files & Reports</h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">Download data files and reports generated during this evaluation project.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="chart-container flex items-start gap-4 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.06] text-primary group-hover:bg-primary/[0.12] transition-colors">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground tracking-tight">{f.name}</p>
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

      <div className="chart-container">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">External Links</p>
        <div className="space-y-2.5 text-sm">
          {externalLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.7} />
              <span className="font-medium">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

import { FileDown, FileText, Table2, FileSpreadsheet, ExternalLink, FolderOpen } from "lucide-react";

const files = [
  { name: "Workbook (.xlsx)", icon: FileSpreadsheet, desc: "Complete evaluation workbook with all data sheets", placeholder: true },
  { name: "Report (.pdf)", icon: FileText, desc: "Final academic report in PDF format", placeholder: true },
  { name: "Report (.docx)", icon: FileDown, desc: "Editable report in Word format", placeholder: true },
  { name: "avaliacao_llms.csv", icon: Table2, desc: "LLM evaluation scores and reviewer comments", href: "/data/avaliacao_llms.csv" },
  { name: "curadoria_abertas.csv", icon: Table2, desc: "Curated open-ended questions with gold answers", href: "/data/curadoria_abertas.csv" },
  { name: "curadoria_mc.csv", icon: Table2, desc: "Curated multiple-choice questions", href: "/data/curadoria_mc.csv" },
  { name: "respostas_llms.csv", icon: Table2, desc: "LLM responses to open questions", href: "/data/respostas_llms.csv" },
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/6 text-primary group-hover:bg-primary/12 transition-colors">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.7} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground tracking-tight">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                {f.placeholder ? (
                  <span className="inline-block mt-2.5 text-[11px] text-muted-foreground/50 italic uppercase tracking-wider">Coming soon</span>
                ) : (
                  <a href={f.href} download className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    <FileDown className="h-3 w-3" strokeWidth={2} />
                    Download
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-container">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">External Links</p>
        <div className="space-y-2.5 text-sm">
          <a href="#" className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span>Repository — <em className="text-foreground/35 not-italic text-xs">link placeholder</em></span>
          </a>
          <a href="#" className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span>Full Report — <em className="text-foreground/35 not-italic text-xs">link placeholder</em></span>
          </a>
        </div>
      </div>
    </div>
  );
}

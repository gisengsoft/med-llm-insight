import { FileDown, FileText, Table, FileSpreadsheet } from "lucide-react";

const files = [
  { name: "Workbook (.xlsx)", icon: FileSpreadsheet, desc: "Complete evaluation workbook with all data sheets", placeholder: true },
  { name: "Report (.pdf)", icon: FileText, desc: "Final academic report in PDF format", placeholder: true },
  { name: "Report (.docx)", icon: FileDown, desc: "Editable report in Word format", placeholder: true },
  { name: "avaliacao_llms.csv", icon: Table, desc: "LLM evaluation scores and comments", href: "/data/avaliacao_llms.csv" },
  { name: "curadoria_abertas.csv", icon: Table, desc: "Curated open-ended questions with gold answers", href: "/data/curadoria_abertas.csv" },
  { name: "curadoria_mc.csv", icon: Table, desc: "Curated multiple-choice questions", href: "/data/curadoria_mc.csv" },
  { name: "respostas_llms.csv", icon: Table, desc: "LLM responses to open questions", href: "/data/respostas_llms.csv" },
];

export default function FilesSection() {
  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-sm text-muted-foreground">Download data files and reports generated during this evaluation project.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="chart-container flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                {f.placeholder ? (
                  <span className="inline-block mt-2 text-xs text-muted-foreground italic">Coming soon</span>
                ) : (
                  <a href={f.href} download className="inline-block mt-2 text-xs font-medium text-primary hover:underline">
                    Download ↓
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-container">
        <h3 className="text-sm font-semibold text-foreground mb-2">External Links</h3>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">📁 Repository: <span className="italic">Link placeholder</span></p>
          <p className="text-muted-foreground">📄 Full Report: <span className="italic">Link placeholder</span></p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen, CheckCircle, ListChecks } from "lucide-react";
import { useCuradoriaMC } from "@/hooks/useData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MCCurationSection() {
  const { data: mcData, isLoading } = useCuradoriaMC();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const difficulties = [...new Set(mcData?.map(q => q.difficulty).filter(Boolean) || [])];

  const filtered = mcData?.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.specialty.toLowerCase().includes(search.toLowerCase()) ||
      String(q.official_id).includes(search);
    const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  }) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2.5 mb-2">
        <ListChecks className="h-5 w-5 text-primary/70" strokeWidth={1.7} />
        <h2 className="section-title text-xl">Multiple Choice Curation</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID, question, or specialty..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 bg-card" />
        </div>
        <select
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
          className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground transition-colors hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{filtered.length} question{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-25" strokeWidth={1.5} />
          <p className="text-sm">No questions match your filters.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(q => {
          const isOpen = expandedId === q.official_id;
          const options = [
            { letter: "A", text: q.option_A },
            { letter: "B", text: q.option_B },
            { letter: "C", text: q.option_C },
            { letter: "D", text: q.option_D },
            { letter: "E", text: q.option_E },
            { letter: "F", text: q.option_F },
            { letter: "G", text: q.option_G },
            { letter: "H", text: q.option_H },
            { letter: "I", text: q.option_I },
          ].filter(o => o.text);

          const correctAnswer = q.correct_answer_usmle || q.correct_answer_dataset;

          return (
            <div key={q.official_id} className="chart-container overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : q.official_id)}
                className="w-full flex items-start justify-between gap-4 text-left group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-bold text-primary tabular-nums">#{q.official_id}</span>
                    <Badge variant="secondary" className="text-[11px] font-medium">{q.specialty || "N/A"}</Badge>
                    <Badge variant="outline" className="text-[11px]">{q.difficulty || "N/A"}</Badge>
                    <Badge className="text-[11px] bg-success/12 text-success border-success/25 font-semibold">
                      <CheckCircle className="h-3 w-3 mr-1" strokeWidth={2} />
                      {correctAnswer}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">{q.question}</p>
                </div>
                <div className="shrink-0 mt-1 p-1 rounded-md group-hover:bg-muted transition-colors">
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 space-y-5 border-t border-border pt-5">
                  <div>
                    <FieldLabel text="Full Question" />
                    <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{q.question}</p>
                  </div>

                  <div>
                    <FieldLabel text="Answer Options" />
                    <div className="space-y-1.5">
                      {options.map(o => (
                        <div key={o.letter} className={`flex gap-3 text-sm rounded-lg px-4 py-2.5 transition-colors ${o.letter === correctAnswer ? "bg-success/6 border border-success/20" : "bg-muted/20 border border-transparent"}`}>
                          <span className={`font-bold shrink-0 tabular-nums ${o.letter === correctAnswer ? "text-success" : "text-muted-foreground"}`}>{o.letter}.</span>
                          <span className="text-foreground/85">{o.text}</span>
                          {o.letter === correctAnswer && <CheckCircle className="h-4 w-4 text-success shrink-0 ml-auto self-center" strokeWidth={1.8} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {q.explanation && <div><FieldLabel text="Explanation" /><p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{q.explanation}</p></div>}
                  {q.reference_used && <div><FieldLabel text="Reference" /><p className="text-sm text-foreground/85">{q.reference_used}</p></div>}
                  {q.curator_notes && <div><FieldLabel text="Curator Notes" /><p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{q.curator_notes}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ text }: { text: string }) {
  return <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{text}</p>;
}

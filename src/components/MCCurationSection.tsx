import { useState } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useCuradoriaMC } from "@/hooks/useData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MCCurationSection() {
  const { data: mcData, isLoading } = useCuradoriaMC();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID, question, or specialty..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} question{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No questions match your filters.</p>
        </div>
      )}

      <div className="space-y-2">
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
                className="w-full flex items-start justify-between gap-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-primary">#{q.official_id}</span>
                    <Badge variant="secondary" className="text-xs">{q.specialty || "N/A"}</Badge>
                    <Badge variant="outline" className="text-xs">{q.difficulty || "N/A"}</Badge>
                    <Badge className="text-xs bg-success text-success-foreground">Answer: {correctAnswer}</Badge>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{q.question}</p>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />}
              </button>

              {isOpen && (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Full Question</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{q.question}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Options</p>
                    <div className="space-y-1.5">
                      {options.map(o => (
                        <div key={o.letter} className={`flex gap-2 text-sm rounded-md px-3 py-2 ${o.letter === correctAnswer ? "bg-success/10 border border-success/30" : "bg-muted/30"}`}>
                          <span className={`font-semibold shrink-0 ${o.letter === correctAnswer ? "text-success" : "text-muted-foreground"}`}>{o.letter}.</span>
                          <span className="text-foreground">{o.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {q.explanation && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Explanation</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{q.explanation}</p>
                    </div>
                  )}
                  {q.reference_used && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Reference</p>
                      <p className="text-sm text-foreground">{q.reference_used}</p>
                    </div>
                  )}
                  {q.curator_notes && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Curator Notes</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{q.curator_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

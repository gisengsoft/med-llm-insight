import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Stethoscope } from "lucide-react";
import { useCuradoriaAbertas, useRespostasLLMs, useAvaliacaoLLMs } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS } from "@/lib/dataUtils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function OpenQuestionsSection() {
  const { data: abertas, isLoading: l1 } = useCuradoriaAbertas();
  const { data: respostas, isLoading: l2 } = useRespostasLLMs();
  const { data: avaliacoes, isLoading: l3 } = useAvaliacaoLLMs();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (l1 || l2 || l3) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const filtered = abertas?.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.specialty.toLowerCase().includes(search.toLowerCase()) ||
    String(q.official_id).includes(search)
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, question, or specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 bg-card"
          />
        </div>
        <span className="text-sm text-muted-foreground hidden sm:block">{filtered.length} questions</span>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No questions found.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(q => {
          const isOpen = expandedId === q.official_id;
          const resposta = respostas?.find(r => r.official_id === q.official_id);
          const evals = avaliacoes?.filter(a => a.official_id === q.official_id) || [];

          return (
            <div key={q.official_id} className="chart-container overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : q.official_id)}
                className="w-full flex items-start justify-between gap-4 text-left group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-bold text-primary">#{q.official_id}</span>
                    <Badge variant="secondary" className="text-xs font-medium">{q.specialty || "N/A"}</Badge>
                    <Badge variant="outline" className="text-xs">{q.difficulty || "N/A"}</Badge>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">{q.question}</p>
                </div>
                <div className="shrink-0 mt-1 p-1 rounded-md group-hover:bg-muted transition-colors">
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-6 space-y-6 border-t border-border pt-6">
                  <div className="space-y-4">
                    <DetailBlock label="Gold Answer" text={q.gold_answer} />
                    <DetailBlock label="Must Have" text={q.must_have} />
                    <DetailBlock label="Nice to Have" text={q.nice_to_have} />
                    <DetailBlock label="Sources" text={q.sources} />
                    <DetailBlock label="Reference" text={q.reference_used} />
                    <DetailBlock label="Curator Notes" text={q.curator_notes} />
                  </div>

                  {resposta && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Model Answers</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {[
                          { name: resposta.model_1_name, answer: resposta.model_1_answer },
                          { name: resposta.model_2_name, answer: resposta.model_2_answer },
                          { name: resposta.model_3_name, answer: resposta.model_3_answer },
                        ].map((m, i) => (
                          <div key={i} className="rounded-xl border border-border p-4 bg-muted/20">
                            <p className="text-xs font-bold mb-2" style={{ color: MODEL_COLORS[m.name] || "#6b7280" }}>{m.name}</p>
                            <p className="text-xs text-foreground/80 whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed">{m.answer}</p>
                          </div>
                        ))}
                      </div>
                      {resposta.observations && <div className="mt-3"><DetailBlock label="Observations" text={resposta.observations} /></div>}
                    </div>
                  )}

                  {evals.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Evaluations</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {evals.map((ev, i) => (
                          <div key={i} className="rounded-xl border border-border p-4 bg-muted/20">
                            <p className="text-xs font-bold mb-3" style={{ color: MODEL_COLORS[ev.model_name] || "#6b7280" }}>{ev.model_name}</p>
                            <div className="space-y-1.5">
                              {DIMENSIONS.map(d => (
                                <div key={d.key} className="flex justify-between text-xs py-0.5">
                                  <span className="text-muted-foreground">{d.short}</span>
                                  <span className="font-semibold tabular-nums">{ev[d.key as keyof typeof ev]}/2</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between text-sm font-bold border-t border-border mt-3 pt-3">
                              <span>Total</span>
                              <span className={ev.total_score_0_10 <= 8 ? "text-warning" : "text-success"}>{ev.total_score_0_10}/10</span>
                            </div>
                            {ev.comments && <p className="text-xs text-muted-foreground mt-3 italic leading-relaxed">{ev.comments}</p>}
                          </div>
                        ))}
                      </div>
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

function DetailBlock({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}

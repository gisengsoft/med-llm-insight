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
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const filtered = abertas?.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    q.specialty.toLowerCase().includes(search.toLowerCase()) ||
    String(q.official_id).includes(search)
  ) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, question, or specialty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Stethoscope className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No questions found.</p>
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
                className="w-full flex items-start justify-between gap-3 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-primary">#{q.official_id}</span>
                    <Badge variant="secondary" className="text-xs">{q.specialty || "N/A"}</Badge>
                    <Badge variant="outline" className="text-xs">{q.difficulty || "N/A"}</Badge>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{q.question}</p>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />}
              </button>

              {isOpen && (
                <div className="mt-5 space-y-5 border-t border-border pt-5">
                  {/* Gold answer info */}
                  <div className="space-y-3">
                    <DetailBlock label="Gold Answer" text={q.gold_answer} />
                    <DetailBlock label="Must Have" text={q.must_have} />
                    <DetailBlock label="Nice to Have" text={q.nice_to_have} />
                    <DetailBlock label="Sources" text={q.sources} />
                    <DetailBlock label="Reference" text={q.reference_used} />
                    <DetailBlock label="Curator Notes" text={q.curator_notes} />
                  </div>

                  {/* Model Answers */}
                  {resposta && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Model Answers</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {[
                          { name: resposta.model_1_name, answer: resposta.model_1_answer },
                          { name: resposta.model_2_name, answer: resposta.model_2_answer },
                          { name: resposta.model_3_name, answer: resposta.model_3_answer },
                        ].map((m, i) => (
                          <div key={i} className="rounded-lg border border-border p-3 bg-muted/30">
                            <p className="text-xs font-semibold mb-1" style={{ color: MODEL_COLORS[m.name] || "#6b7280" }}>{m.name}</p>
                            <p className="text-xs text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">{m.answer}</p>
                          </div>
                        ))}
                      </div>
                      {resposta.observations && <DetailBlock label="Observations" text={resposta.observations} />}
                    </div>
                  )}

                  {/* Evaluations side by side */}
                  {evals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3">Evaluations</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {evals.map((ev, i) => (
                          <div key={i} className="rounded-lg border border-border p-3 bg-muted/30">
                            <p className="text-xs font-semibold mb-2" style={{ color: MODEL_COLORS[ev.model_name] || "#6b7280" }}>{ev.model_name}</p>
                            {DIMENSIONS.map(d => (
                              <div key={d.key} className="flex justify-between text-xs py-0.5">
                                <span className="text-muted-foreground">{d.short}</span>
                                <span className="font-medium">{ev[d.key as keyof typeof ev]}/2</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold border-t border-border mt-2 pt-2">
                              <span>Total</span>
                              <span className={ev.total_score_0_10 <= 8 ? "text-warning" : "text-success"}>{ev.total_score_0_10}/10</span>
                            </div>
                            {ev.comments && <p className="text-xs text-muted-foreground mt-2 italic">{ev.comments}</p>}
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
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{text}</p>
    </div>
  );
}

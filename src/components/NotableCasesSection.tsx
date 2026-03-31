import { Flag, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useAvaliacaoLLMs, useCuradoriaAbertas, useRespostasLLMs } from "@/hooks/useData";
import { MODEL_COLORS, DIMENSIONS, type AvaliacaoLLM } from "@/lib/dataUtils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function NotableCasesSection() {
  const { data: avaliacoes, isLoading: l1 } = useAvaliacaoLLMs();
  const { data: abertas, isLoading: l2 } = useCuradoriaAbertas();
  const { data: respostas, isLoading: l3 } = useRespostasLLMs();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (l1 || l2 || l3) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const flaggedIds = new Set<number>();
  avaliacoes?.forEach(ev => {
    if (ev.total_score_0_10 <= 8) flaggedIds.add(ev.official_id);
  });

  const flaggedQuestions = abertas?.filter(q => flaggedIds.has(q.official_id)) || [];

  const sorted = [...flaggedQuestions].sort((a, b) => {
    const worstA = Math.min(...(avaliacoes?.filter(e => e.official_id === a.official_id).map(e => e.total_score_0_10) || [10]));
    const worstB = Math.min(...(avaliacoes?.filter(e => e.official_id === b.official_id).map(e => e.total_score_0_10) || [10]));
    return worstA - worstB;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section header */}
      <div className="chart-container flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 shrink-0">
          <Flag className="h-5 w-5 text-warning" strokeWidth={1.7} />
        </div>
        <div className="flex-1">
          <h2 className="section-title text-xl">Notable Cases</h2>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            Questions where at least one model scored ≤ 8/10 — flagged for further analysis or discussion.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm tabular-nums shrink-0 font-mono">
          {sorted.length} flagged
        </Badge>
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">All models scored above 8 on every question.</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(q => {
          const qEvals = avaliacoes?.filter(e => e.official_id === q.official_id) || [];
          const resposta = respostas?.find(r => r.official_id === q.official_id);
          const isOpen = expandedId === q.official_id;
          const worstScore = Math.min(...qEvals.map(e => e.total_score_0_10));

          return (
            <div key={q.official_id} className="chart-container overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : q.official_id)}
                className="w-full flex items-start justify-between gap-4 text-left group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-bold text-primary tabular-nums">#{q.official_id}</span>
                    <Badge variant="secondary" className="text-[11px]">{q.specialty || "N/A"}</Badge>
                    <Badge className="text-[11px] bg-warning/12 text-warning border-warning/25 hover:bg-warning/15">
                      Lowest: {worstScore}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">{q.question}</p>

                  {/* Score pills */}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    {qEvals.map(ev => (
                      <span
                        key={ev.model_name}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                          ev.total_score_0_10 <= 8 ? "bg-warning/8 text-warning" : "bg-success/8 text-success"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: MODEL_COLORS[ev.model_name] }} />
                        {ev.model_name}: {ev.total_score_0_10}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 mt-1 p-1 rounded-md group-hover:bg-muted transition-colors">
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-5 border-t border-border pt-5 space-y-5">
                  {q.gold_answer && (
                    <div className="rounded-lg bg-muted/20 border border-border p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.7} />
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Gold Answer</p>
                      </div>
                      <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{q.gold_answer}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {qEvals.map(ev => {
                      const model = resposta ? [
                        { name: resposta.model_1_name, answer: resposta.model_1_answer },
                        { name: resposta.model_2_name, answer: resposta.model_2_answer },
                        { name: resposta.model_3_name, answer: resposta.model_3_answer },
                      ].find(m => m.name === ev.model_name) : null;
                      const color = MODEL_COLORS[ev.model_name] || "hsl(var(--muted-foreground))";
                      const isFlagged = ev.total_score_0_10 <= 8;

                      return (
                        <div key={ev.model_name} className={`rounded-xl border overflow-hidden bg-card flex flex-col ${isFlagged ? "border-warning/30" : "border-border"}`}>
                          <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ borderTopWidth: 3, borderTopColor: color }}>
                            <span className="text-sm font-bold" style={{ color }}>{ev.model_name}</span>
                            <span className={`text-sm font-bold tabular-nums px-2 py-0.5 rounded-md ${isFlagged ? "bg-warning/12 text-warning" : "bg-success/12 text-success"}`}>
                              {ev.total_score_0_10}/10
                            </span>
                          </div>

                          {model?.answer && (
                            <div className="px-4 py-3 border-b border-border">
                              <p className="text-xs text-foreground/80 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed scrollbar-hide">{model.answer}</p>
                            </div>
                          )}

                          <div className="px-4 py-3 bg-muted/15 space-y-2">
                            {DIMENSIONS.map(d => {
                              const val = Number(ev[d.key as keyof AvaliacaoLLM]) || 0;
                              const isBad = val < 2;
                              return (
                                <div key={d.key} className="flex items-center gap-3 text-xs">
                                  <span className={`w-24 shrink-0 truncate ${isBad ? "text-warning font-medium" : "text-muted-foreground"}`}>{d.short}</span>
                                  <Progress value={val * 50} className="h-1.5 flex-1" />
                                  <span className={`font-semibold tabular-nums w-8 text-right ${isBad ? "text-warning" : "text-foreground/70"}`}>{val}/2</span>
                                </div>
                              );
                            })}
                          </div>

                          {ev.comments && (
                            <div className="px-4 py-3 border-t border-border">
                              <p className="text-xs text-muted-foreground italic leading-relaxed">{ev.comments}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

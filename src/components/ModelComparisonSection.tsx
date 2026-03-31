import { useAvaliacaoLLMs } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, AvaliacaoLLM } from "@/lib/dataUtils";
import { ArrowUp, ArrowDown, Flag, BarChart2, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ModelComparisonSection() {
  const { data: avaliacoes, isLoading } = useAvaliacaoLLMs();

  if (isLoading) {
    return <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  const models = [...new Set(avaliacoes?.map(a => a.model_name) || [])];

  const modelStats = models.map(m => {
    const evals = avaliacoes!.filter(a => a.model_name === m);
    const avgTotal = evals.reduce((s, e) => s + e.total_score_0_10, 0) / evals.length;
    const dimAvgs = DIMENSIONS.map(d => {
      const avg = evals.reduce((s, e) => s + (e[d.key as keyof AvaliacaoLLM] as number), 0) / evals.length;
      return { ...d, avg: Math.round(avg * 100) / 100 };
    });
    const strongest = [...dimAvgs].sort((a, b) => b.avg - a.avg)[0];
    const weakest = [...dimAvgs].sort((a, b) => a.avg - b.avg)[0];
    const lowScoreQuestions = evals.filter(e => e.total_score_0_10 <= 8);
    return { model: m, avgTotal: Math.round(avgTotal * 100) / 100, dimAvgs, strongest, weakest, lowScoreQuestions, count: evals.length };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <BarChart2 className="h-5 w-5 text-primary/70" strokeWidth={1.7} />
        <h2 className="section-title text-xl">Model-by-Model Comparison</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {modelStats.map(ms => {
          const color = MODEL_COLORS[ms.model] || "#6b7280";
          return (
            <div key={ms.model} className="chart-container space-y-5 overflow-hidden" style={{ borderTopWidth: 3, borderTopColor: color }}>
              {/* Model header */}
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4" style={{ color }} strokeWidth={1.7} />
                <h3 className="font-bold text-foreground text-base tracking-tight">{ms.model}</h3>
              </div>

              {/* Score highlight */}
              <div className="text-center py-5 rounded-xl bg-muted/30">
                <p className="text-4xl font-bold text-foreground tabular-nums">{ms.avgTotal}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-widest font-medium">Avg. Score / 10</p>
                <p className="text-[11px] text-muted-foreground">{ms.count} evaluations</p>
              </div>

              {/* Dimension bars */}
              <div className="space-y-3">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">Rubric Dimensions</p>
                {ms.dimAvgs.map(d => (
                  <div key={d.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{d.label}</span>
                      <span className="font-semibold tabular-nums text-foreground">{d.avg}/2</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(d.avg / 2) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strongest / Weakest */}
              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Performance Summary</p>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10">
                    <ArrowUp className="h-3.5 w-3.5 text-success" strokeWidth={2} />
                  </div>
                  <span className="text-muted-foreground text-xs">Strongest:</span>
                  <span className="font-semibold text-foreground text-xs">{ms.strongest.label} ({ms.strongest.avg})</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                    <ArrowDown className="h-3.5 w-3.5 text-warning" strokeWidth={2} />
                  </div>
                  <span className="text-muted-foreground text-xs">Weakest:</span>
                  <span className="font-semibold text-foreground text-xs">{ms.weakest.label} ({ms.weakest.avg})</span>
                </div>
              </div>

              {/* Low scoring */}
              {ms.lowScoreQuestions.length > 0 && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs mb-3">
                    <Flag className="h-3.5 w-3.5 text-warning" strokeWidth={1.8} />
                    <span className="font-semibold text-foreground uppercase tracking-wider">Flagged ≤ 8 ({ms.lowScoreQuestions.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ms.lowScoreQuestions.map(q => (
                      <Badge key={q.official_id} variant="outline" className="text-xs tabular-nums font-mono">
                        #{q.official_id} ({q.total_score_0_10})
                      </Badge>
                    ))}
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

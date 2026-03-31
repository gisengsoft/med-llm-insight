import { useAvaliacaoLLMs } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, AvaliacaoLLM } from "@/lib/dataUtils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modelStats.map(ms => (
          <div key={ms.model} className="chart-container space-y-5">
            {/* Model header */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: MODEL_COLORS[ms.model] || "#6b7280" }} />
              <h3 className="font-bold text-foreground text-lg">{ms.model}</h3>
            </div>

            {/* Score highlight */}
            <div className="text-center py-4 rounded-xl bg-muted/40">
              <p className="text-5xl font-bold text-foreground tabular-nums">{ms.avgTotal}</p>
              <p className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider font-medium">Average Score / 10</p>
              <p className="text-xs text-muted-foreground mt-0.5">{ms.count} evaluations</p>
            </div>

            {/* Dimension bars */}
            <div className="space-y-3">
              {ms.dimAvgs.map(d => (
                <div key={d.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">{d.short}</span>
                    <span className="font-bold tabular-nums text-foreground">{d.avg}/2</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(d.avg / 2) * 100}%`, backgroundColor: MODEL_COLORS[ms.model] || "#6b7280" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strongest / Weakest */}
            <div className="space-y-2.5 border-t border-border pt-4">
              <div className="flex items-center gap-2.5 text-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                </div>
                <span className="text-muted-foreground">Strongest:</span>
                <span className="font-semibold text-foreground">{ms.strongest.short} ({ms.strongest.avg})</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                  <TrendingDown className="h-3.5 w-3.5 text-warning" />
                </div>
                <span className="text-muted-foreground">Weakest:</span>
                <span className="font-semibold text-foreground">{ms.weakest.short} ({ms.weakest.avg})</span>
              </div>
            </div>

            {/* Low scoring */}
            {ms.lowScoreQuestions.length > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-semibold text-foreground">Questions ≤ 8 ({ms.lowScoreQuestions.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ms.lowScoreQuestions.map(q => (
                    <Badge key={q.official_id} variant="outline" className="text-xs tabular-nums">
                      #{q.official_id} ({q.total_score_0_10})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

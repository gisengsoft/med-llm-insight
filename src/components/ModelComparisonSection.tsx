import { useAvaliacaoLLMs } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, AvaliacaoLLM } from "@/lib/dataUtils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ModelComparisonSection() {
  const { data: avaliacoes, isLoading } = useAvaliacaoLLMs();

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
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
          <div key={ms.model} className="chart-container space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: MODEL_COLORS[ms.model] || "#6b7280" }} />
              <h3 className="font-semibold text-foreground">{ms.model}</h3>
            </div>

            <div className="text-center py-3">
              <p className="text-4xl font-bold text-foreground">{ms.avgTotal}</p>
              <p className="text-sm text-muted-foreground">Average Score / 10</p>
              <p className="text-xs text-muted-foreground mt-1">{ms.count} evaluations</p>
            </div>

            {/* Dimension scores */}
            <div className="space-y-2">
              {ms.dimAvgs.map(d => (
                <div key={d.key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{d.short}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.avg / 2) * 100}%`, backgroundColor: MODEL_COLORS[ms.model] || "#6b7280" }} />
                    </div>
                    <span className="font-medium w-8 text-right">{d.avg}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strongest / Weakest */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-muted-foreground">Strongest:</span>
                <span className="font-medium text-foreground">{ms.strongest.short} ({ms.strongest.avg})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">Weakest:</span>
                <span className="font-medium text-foreground">{ms.weakest.short} ({ms.weakest.avg})</span>
              </div>
            </div>

            {/* Low scoring questions */}
            {ms.lowScoreQuestions.length > 0 && (
              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium text-foreground">Questions ≤ 8 ({ms.lowScoreQuestions.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ms.lowScoreQuestions.map(q => (
                    <Badge key={q.official_id} variant="outline" className="text-xs">
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

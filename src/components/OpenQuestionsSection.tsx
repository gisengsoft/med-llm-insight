import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Stethoscope, BookOpen, CheckCircle2, Star } from "lucide-react";
import { useCuradoriaAbertas, useRespostasLLMs, useAvaliacaoLLMs } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, type AvaliacaoLLM } from "@/lib/dataUtils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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

          const models = resposta ? [
            { name: resposta.model_1_name, answer: resposta.model_1_answer },
            { name: resposta.model_2_name, answer: resposta.model_2_answer },
            { name: resposta.model_3_name, answer: resposta.model_3_answer },
          ] : [];

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
                <div className="mt-6 border-t border-border pt-6 space-y-8">
                  {/* Reference section - compact two-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4">
                      <DetailBlock label="Gold Answer" text={q.gold_answer} icon={<BookOpen className="h-3.5 w-3.5" />} />
                      <DetailBlock label="Sources" text={q.sources} />
                      <DetailBlock label="Reference" text={q.reference_used} />
                    </div>
                    <div className="space-y-4">
                      <DetailBlock label="Must Have" text={q.must_have} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
                      <DetailBlock label="Nice to Have" text={q.nice_to_have} icon={<Star className="h-3.5 w-3.5" />} />
                      <DetailBlock label="Curator Notes" text={q.curator_notes} />
                    </div>
                  </div>

                  {/* Combined model answers + scores side by side */}
                  {models.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Model Responses & Scores</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {models.map((m, i) => {
                          const ev = evals.find(e => e.model_name === m.name);
                          return (
                            <ModelColumn key={i} name={m.name} answer={m.answer} evaluation={ev} />
                          );
                        })}
                      </div>
                      {resposta?.observations && (
                        <div className="mt-4 rounded-lg bg-muted/30 border border-border p-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Observations</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{resposta.observations}</p>
                        </div>
                      )}
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

function ModelColumn({ name, answer, evaluation }: { name: string; answer: string; evaluation?: AvaliacaoLLM }) {
  const color = MODEL_COLORS[name] || "hsl(var(--muted-foreground))";
  const score = evaluation?.total_score_0_10 ?? 0;

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card flex flex-col">
      {/* Model header with colored accent */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ borderTopWidth: 3, borderTopColor: color }}>
        <span className="text-sm font-bold" style={{ color }}>{name}</span>
        {evaluation && (
          <span
            className={`text-sm font-bold tabular-nums px-2 py-0.5 rounded-md ${
              score <= 8 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
            }`}
          >
            {score}/10
          </span>
        )}
      </div>

      {/* Answer */}
      <div className="px-4 py-3 flex-1">
        <p className="text-xs text-foreground/80 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed scrollbar-hide">{answer}</p>
      </div>

      {/* Rubric scores */}
      {evaluation && (
        <div className="px-4 py-3 border-t border-border bg-muted/20 space-y-2">
          {DIMENSIONS.map(d => {
            const val = Number(evaluation[d.key as keyof AvaliacaoLLM]) || 0;
            return (
              <div key={d.key} className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground w-24 shrink-0 truncate">{d.short}</span>
                <Progress value={val * 50} className="h-1.5 flex-1" />
                <span className="font-semibold tabular-nums w-8 text-right text-foreground/80">{val}/2</span>
              </div>
            );
          })}
          {evaluation.comments && (
            <>
              <Separator className="my-2" />
              <p className="text-xs text-muted-foreground italic leading-relaxed">{evaluation.comments}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DetailBlock({ label, text, icon }: { label: string; text: string; icon?: React.ReactNode }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}

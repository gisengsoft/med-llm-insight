import { Activity, FileText, Users, Award, BarChart3 } from "lucide-react";
import { useAvaliacaoLLMs, useCuradoriaAbertas, useCuradoriaMC } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, AvaliacaoLLM } from "@/lib/dataUtils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell,
} from "recharts";

function KPICard({ icon: Icon, label, value, accent = false }: {
  icon: React.ElementType; label: string; value: string | number; accent?: boolean;
}) {
  return (
    <div className={`kpi-card flex items-center gap-4 ${accent ? "border-primary/30" : ""}`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function OverviewSection() {
  const { data: avaliacoes, isLoading: loadingAval } = useAvaliacaoLLMs();
  const { data: abertas, isLoading: loadingAbertas } = useCuradoriaAbertas();
  const { data: mc, isLoading: loadingMC } = useCuradoriaMC();

  if (loadingAval || loadingAbertas || loadingMC) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const openQuestions = abertas?.length || 0;
  const mcQuestions = mc?.length || 0;
  const models = [...new Set(avaliacoes?.map(a => a.model_name) || [])];
  const totalEvals = avaliacoes?.length || 0;

  // Best avg by model
  const modelAvgs = models.map(m => {
    const evals = avaliacoes!.filter(a => a.model_name === m);
    const avg = evals.reduce((s, e) => s + e.total_score_0_10, 0) / evals.length;
    return { model: m, avg: Math.round(avg * 100) / 100 };
  });
  const bestModel = modelAvgs.sort((a, b) => b.avg - a.avg)[0];

  // Bar chart data
  const barData = modelAvgs.map(m => ({
    name: m.model,
    score: m.avg,
    fill: MODEL_COLORS[m.model] || "#6b7280",
  }));

  // Radar data
  const radarData = DIMENSIONS.map(dim => {
    const entry: Record<string, string | number> = { dimension: dim.short };
    models.forEach(m => {
      const evals = avaliacoes!.filter(a => a.model_name === m);
      entry[m] = Math.round((evals.reduce((s, e) => s + (e[dim.key as keyof AvaliacaoLLM] as number), 0) / evals.length) * 100) / 100;
    });
    return entry;
  });

  // Score distribution
  const scoreCounts = [
    { name: "Score 10", value: avaliacoes!.filter(a => a.total_score_0_10 === 10).length },
    { name: "Score 9", value: avaliacoes!.filter(a => a.total_score_0_10 === 9).length },
    { name: "Score ≤ 8", value: avaliacoes!.filter(a => a.total_score_0_10 <= 8).length },
  ];
  const pieColors = ["#2563eb", "#0891b2", "#f59e0b"];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard icon={FileText} label="Open Questions" value={openQuestions} />
        <KPICard icon={Activity} label="MC Questions" value={mcQuestions} />
        <KPICard icon={Users} label="Models Evaluated" value={models.length} />
        <KPICard icon={BarChart3} label="Total Evaluations" value={totalEvals} />
        <KPICard icon={Award} label="Best Model Avg" value={`${bestModel?.avg} — ${bestModel?.model?.split(" ")[0]}`} accent />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="chart-container">
          <h3 className="section-title text-lg mb-4">Average Total Score by Model</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(210 20% 90%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="chart-container">
          <h3 className="section-title text-lg mb-4">Rubric Dimensions Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(210 20% 90%)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 2]} tick={{ fontSize: 10 }} />
              {models.map(m => (
                <Radar
                  key={m}
                  name={m}
                  dataKey={m}
                  stroke={MODEL_COLORS[m] || "#6b7280"}
                  fill={MODEL_COLORS[m] || "#6b7280"}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="chart-container max-w-md mx-auto">
        <h3 className="section-title text-lg mb-4 text-center">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={scoreCounts} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine>
              {scoreCounts.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { Stethoscope, ClipboardList, Brain, BarChart3, Award } from "lucide-react";
import { useAvaliacaoLLMs, useCuradoriaAbertas, useCuradoriaMC } from "@/hooks/useData";
import { DIMENSIONS, MODEL_COLORS, AvaliacaoLLM } from "@/lib/dataUtils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell,
} from "recharts";

function KPICard({ icon: Icon, label, value, sublabel, accent = false }: {
  icon: React.ElementType; label: string; value: string | number; sublabel?: string; accent?: boolean;
}) {
  return (
    <div className={`kpi-card flex items-center gap-4 ${accent ? "border-primary/30 ring-1 ring-primary/8" : ""}`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-primary/6 text-primary"}`}>
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </div>
      <div>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5 tabular-nums">{value}</p>
        {sublabel && <p className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

const chartTooltipStyle = {
  borderRadius: 10,
  border: "1px solid hsl(216 18% 91%)",
  boxShadow: "0 8px 25px -5px rgba(0,0,0,0.06)",
  fontSize: 12,
  padding: "8px 14px",
  fontFamily: "Inter, system-ui, sans-serif",
};

export default function OverviewSection() {
  const { data: avaliacoes, isLoading: loadingAval } = useAvaliacaoLLMs();
  const { data: abertas, isLoading: loadingAbertas } = useCuradoriaAbertas();
  const { data: mc, isLoading: loadingMC } = useCuradoriaMC();

  if (loadingAval || loadingAbertas || loadingMC) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const openQuestions = abertas?.length || 0;
  const mcQuestions = mc?.length || 0;
  const models = [...new Set(avaliacoes?.map(a => a.model_name) || [])];
  const totalEvals = avaliacoes?.length || 0;

  const modelAvgs = models.map(m => {
    const evals = avaliacoes!.filter(a => a.model_name === m);
    const avg = evals.reduce((s, e) => s + e.total_score_0_10, 0) / evals.length;
    return { model: m, avg: Math.round(avg * 100) / 100 };
  });
  const bestModel = modelAvgs.sort((a, b) => b.avg - a.avg)[0];

  const barData = modelAvgs.map(m => ({
    name: m.model,
    score: m.avg,
    fill: MODEL_COLORS[m.model] || "#6b7280",
  }));

  const radarData = DIMENSIONS.map(dim => {
    const entry: Record<string, string | number> = { dimension: dim.short };
    models.forEach(m => {
      const evals = avaliacoes!.filter(a => a.model_name === m);
      entry[m] = Math.round((evals.reduce((s, e) => s + (e[dim.key as keyof AvaliacaoLLM] as number), 0) / evals.length) * 100) / 100;
    });
    return entry;
  });

  const scoreCounts = [
    { name: "Score 10", value: avaliacoes!.filter(a => a.total_score_0_10 === 10).length },
    { name: "Score 9", value: avaliacoes!.filter(a => a.total_score_0_10 === 9).length },
    { name: "Score ≤ 8", value: avaliacoes!.filter(a => a.total_score_0_10 <= 8).length },
  ];
  const pieColors = ["hsl(215, 75%, 48%)", "hsl(200, 65%, 48%)", "hsl(38, 92%, 50%)"];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section label */}
      <div className="flex items-center gap-2.5">
        <Stethoscope className="h-5 w-5 text-primary/70" strokeWidth={1.7} />
        <h2 className="section-title text-xl">Evaluation Overview</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard icon={ClipboardList} label="Open Questions" value={openQuestions} sublabel="IDs 86–100" />
        <KPICard icon={Stethoscope} label="MC Questions" value={mcQuestions} sublabel="IDs 136–162" />
        <KPICard icon={Brain} label="LLM Models" value={models.length} sublabel="evaluated" />
        <KPICard icon={BarChart3} label="Evaluations" value={totalEvals} sublabel="total scored" />
        <KPICard icon={Award} label="Best Average" value={bestModel?.avg} sublabel={bestModel?.model} accent />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <SectionLabel icon={BarChart3} text="Average Total Score by Model" />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 18%, 91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 12%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(220, 12%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "hsl(216, 25%, 94%, 0.5)" }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={44}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <SectionLabel icon={Brain} text="Rubric Dimensions — Radar Comparison" />
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(216, 18%, 91%)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: "hsl(220, 12%, 46%)" }} />
              <PolarRadiusAxis domain={[0, 2]} tick={{ fontSize: 10, fill: "hsl(220, 12%, 46%)" }} />
              {models.map(m => (
                <Radar
                  key={m}
                  name={m}
                  dataKey={m}
                  stroke={MODEL_COLORS[m] || "#6b7280"}
                  fill={MODEL_COLORS[m] || "#6b7280"}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="chart-container max-w-lg mx-auto">
        <SectionLabel icon={BarChart3} text="Score Distribution" className="justify-center" />
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={scoreCounts}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={{ stroke: "hsl(220, 12%, 46%)", strokeWidth: 1 }}
              strokeWidth={2}
              stroke="hsl(0, 0%, 100%)"
            >
              {scoreCounts.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={chartTooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, text, className = "" }: { icon: React.ElementType; text: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 mb-5 ${className}`}>
      <Icon className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.7} />
      <h3 className="text-sm font-semibold text-foreground tracking-tight">{text}</h3>
    </div>
  );
}

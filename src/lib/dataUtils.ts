// CSV parsing utilities for semicolon-delimited files

export interface AvaliacaoLLM {
  official_id: number;
  student: string;
  team: string;
  model_name: string;
  clinical_correctness_0_2: number;
  completeness_0_2: number;
  alignment_with_gold_0_2: number;
  safety_0_2: number;
  clarity_0_2: number;
  total_score_0_10: number;
  comments: string;
}

export interface CuradoriaAberta {
  official_id: number;
  student: string;
  team: string;
  kqa_source_index: string;
  question: string;
  gold_answer: string;
  must_have: string;
  nice_to_have: string;
  sources: string;
  icd_10_diag: string;
  difficulty: string;
  specialty: string;
  reference_used: string;
  curator_notes: string;
}

export interface CuradoriaMC {
  official_id: number;
  student: string;
  team: string;
  dataset_source_index: string;
  usmle_source_index: string;
  question: string;
  option_A: string;
  option_B: string;
  option_C: string;
  option_D: string;
  option_E: string;
  option_F: string;
  option_G: string;
  option_H: string;
  option_I: string;
  correct_answer_dataset: string;
  correct_answer_usmle: string;
  difficulty: string;
  specialty: string;
  reference_used: string;
  explanation: string;
  curator_notes: string;
}

export interface RespostaLLM {
  official_id: number;
  student: string;
  team: string;
  question: string;
  gold_answer: string;
  must_have: string;
  nice_to_have: string;
  sources: string;
  model_1_name: string;
  model_1_answer: string;
  model_2_name: string;
  model_2_answer: string;
  model_3_name: string;
  model_3_answer: string;
  observations: string;
}

function parseCSVLine(line: string, delimiter = ";"): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV<T>(text: string, mapper: (headers: string[], values: string[]) => T): T[] {
  // Handle multiline fields by joining lines that are inside quotes
  const rawLines = text.split("\n");
  const lines: string[] = [];
  let buffer = "";
  let openQuotes = false;

  for (const rawLine of rawLines) {
    if (openQuotes) {
      buffer += "\n" + rawLine;
    } else {
      buffer = rawLine;
    }
    const quoteCount = (buffer.match(/"/g) || []).length;
    openQuotes = quoteCount % 2 !== 0;
    if (!openQuotes) {
      lines.push(buffer);
      buffer = "";
    }
  }
  if (buffer) lines.push(buffer);

  const filtered = lines.filter(l => l.trim().length > 0);
  if (filtered.length === 0) return [];

  const headers = parseCSVLine(filtered[0]);
  return filtered.slice(1).map(line => mapper(headers, parseCSVLine(line)));
}

async function fetchLatin1(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new TextDecoder("iso-8859-1").decode(buffer);
}

export async function loadAvaliacaoLLMs(): Promise<AvaliacaoLLM[]> {
  const text = await fetchLatin1("/data/avaliacao_llms.csv");
  return parseCSV(text, (_, v) => ({
    official_id: parseInt(v[0]) || 0,
    student: v[1] || "",
    team: v[2] || "",
    model_name: (v[3] || "").trim(),
    clinical_correctness_0_2: parseFloat(v[4]) || 0,
    completeness_0_2: parseFloat(v[5]) || 0,
    alignment_with_gold_0_2: parseFloat(v[6]) || 0,
    safety_0_2: parseFloat(v[7]) || 0,
    clarity_0_2: parseFloat(v[8]) || 0,
    total_score_0_10: parseFloat(v[9]) || 0,
    comments: v[10] || "",
  }));
}

export async function loadCuradoriaAbertas(): Promise<CuradoriaAberta[]> {
  const text = await fetch("/data/curadoria_abertas.csv").then(r => r.text());
  return parseCSV(text, (_, v) => ({
    official_id: parseInt(v[0]) || 0,
    student: v[1] || "",
    team: v[2] || "",
    kqa_source_index: v[3] || "",
    question: v[4] || "",
    gold_answer: v[5] || "",
    must_have: v[6] || "",
    nice_to_have: v[7] || "",
    sources: v[8] || "",
    icd_10_diag: v[9] || "",
    difficulty: v[10] || "",
    specialty: v[11] || "",
    reference_used: v[12] || "",
    curator_notes: v[13] || "",
  }));
}

export async function loadCuradoriaMC(): Promise<CuradoriaMC[]> {
  const text = await fetch("/data/curadoria_mc.csv").then(r => r.text());
  return parseCSV(text, (_, v) => ({
    official_id: parseInt(v[0]) || 0,
    student: v[1] || "",
    team: v[2] || "",
    dataset_source_index: v[3] || "",
    usmle_source_index: v[4] || "",
    question: v[5] || "",
    option_A: v[6] || "",
    option_B: v[7] || "",
    option_C: v[8] || "",
    option_D: v[9] || "",
    option_E: v[10] || "",
    option_F: v[11] || "",
    option_G: v[12] || "",
    option_H: v[13] || "",
    option_I: v[14] || "",
    correct_answer_dataset: v[15] || "",
    correct_answer_usmle: v[16] || "",
    difficulty: v[17] || "",
    specialty: v[18] || "",
    reference_used: v[19] || "",
    explanation: v[20] || "",
    curator_notes: v[21] || "",
  }));
}

export async function loadRespostasLLMs(): Promise<RespostaLLM[]> {
  const text = await fetch("/data/respostas_llms.csv").then(r => r.text());
  return parseCSV(text, (_, v) => ({
    official_id: parseInt(v[0]) || 0,
    student: v[1] || "",
    team: v[2] || "",
    question: v[3] || "",
    gold_answer: v[4] || "",
    must_have: v[5] || "",
    nice_to_have: v[6] || "",
    sources: v[7] || "",
    model_1_name: (v[8] || "").trim(),
    model_1_answer: v[9] || "",
    model_2_name: (v[10] || "").trim(),
    model_2_answer: v[11] || "",
    model_3_name: (v[12] || "").trim(),
    model_3_answer: v[13] || "",
    observations: v[14] || "",
  }));
}

export const MODEL_COLORS: Record<string, string> = {
  "GPT-5.4 Thinking": "#2563eb",
  "Claude 4.6 Sonnet": "#0891b2",
  "Gemini 3.0": "#059669",
};

export const DIMENSIONS = [
  { key: "clinical_correctness_0_2", label: "Clinical Correctness", short: "Correctness" },
  { key: "completeness_0_2", label: "Completeness", short: "Completeness" },
  { key: "alignment_with_gold_0_2", label: "Alignment with Gold", short: "Alignment" },
  { key: "safety_0_2", label: "Safety", short: "Safety" },
  { key: "clarity_0_2", label: "Clarity", short: "Clarity" },
] as const;

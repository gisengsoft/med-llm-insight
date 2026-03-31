import { useQuery } from "@tanstack/react-query";
import {
  loadAvaliacaoLLMs,
  loadCuradoriaAbertas,
  loadCuradoriaMC,
  loadRespostasLLMs,
} from "@/lib/dataUtils";

export function useAvaliacaoLLMs() {
  return useQuery({ queryKey: ["avaliacao_llms"], queryFn: loadAvaliacaoLLMs, staleTime: Infinity });
}

export function useCuradoriaAbertas() {
  return useQuery({ queryKey: ["curadoria_abertas"], queryFn: loadCuradoriaAbertas, staleTime: Infinity });
}

export function useCuradoriaMC() {
  return useQuery({ queryKey: ["curadoria_mc"], queryFn: loadCuradoriaMC, staleTime: Infinity });
}

export function useRespostasLLMs() {
  return useQuery({ queryKey: ["respostas_llms"], queryFn: loadRespostasLLMs, staleTime: Infinity });
}

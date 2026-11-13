import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ChaveAlternativa, Questao } from "@/dados/tipos";

/** Busca todas as questões de um livro no banco de dados (paginando de 1000 em 1000). */
export async function buscarQuestoesPorLivro(livroId: string): Promise<Questao[]> {
  const resultado: Questao[] = [];
  for (let inicio = 0; ; inicio += 1000) {
    const { data, error: erro } = await supabase
      .from("questoes")
      .select("id,livro_id,enunciado,opcao_a,opcao_b,opcao_c,opcao_d,resposta_correta,referencia")
      .eq("livro_id", livroId)
      .order("criado_em")
      .range(inicio, inicio + 999);
    if (erro) throw erro;
    for (const r of data) {
      resultado.push({
        id: r.id,
        livroId: r.livro_id,
        enunciado: r.enunciado,
        alternativas: { A: r.opcao_a, B: r.opcao_b, C: r.opcao_c, D: r.opcao_d },
        respostaCorreta: r.resposta_correta as ChaveAlternativa,
        referencia: r.referencia ?? undefined,
      });
    }
    if (data.length < 1000) break;
  }
  return resultado;
}

/** Busca questões específicas pelos ids (usado ao reabrir uma prova do histórico). */
export async function buscarQuestoesPorIds(ids: string[]): Promise<Questao[]> {
  if (ids.length === 0) return [];
  const porId = new Map<string, Questao>();
  for (let inicio = 0; ; inicio += 1000) {
    const trecho = ids.slice(inicio, inicio + 1000);
    if (trecho.length === 0) break;
    const { data, error: erro } = await supabase
      .from("questoes")
      .select("id,livro_id,enunciado,opcao_a,opcao_b,opcao_c,opcao_d,resposta_correta,referencia")
      .in("id", trecho);
    if (erro) throw erro;
    for (const r of data) {
      porId.set(r.id, {
        id: r.id,
        livroId: r.livro_id,
        enunciado: r.enunciado,
        alternativas: { A: r.opcao_a, B: r.opcao_b, C: r.opcao_c, D: r.opcao_d },
        respostaCorreta: r.resposta_correta as ChaveAlternativa,
        referencia: r.referencia ?? undefined,
      });
    }
  }
  return ids.map((id) => porId.get(id)).filter((q): q is Questao => q !== undefined);
}

/** Quantidade de questões por livro. */
export async function buscarQuantidadesDeQuestoes(): Promise<Record<string, number>> {
  const quantidades: Record<string, number> = {};
  for (let inicio = 0; ; inicio += 1000) {
    const { data, error: erro } = await supabase.from("questoes").select("livro_id").range(inicio, inicio + 999);
    if (erro) throw erro;
    for (const r of data) quantidades[r.livro_id] = (quantidades[r.livro_id] ?? 0) + 1;
    if (data.length < 1000) break;
  }
  return quantidades;
}

export interface RegistroProvaUsuario {
  id: string;
  livro_id: string;
  criado_em: string;
  questoes_ids: string[];
}

/** Provas do usuário autenticado (RLS limita às linhas do próprio usuário). */
export async function buscarProvasDoUsuario(): Promise<RegistroProvaUsuario[]> {
  const { data, error: erro } = await supabase
    .from("provas")
    .select("id,livro_id,criado_em,questoes_ids")
    .order("criado_em", { ascending: false });
  if (erro) throw erro;
  return data;
}

export function useProvasDoUsuario() {
  return useQuery({ queryKey: ["user-exams"], queryFn: buscarProvasDoUsuario, staleTime: 30_000 });
}

export function useQuantidadesDeQuestoes() {
  return useQuery({ queryKey: ["question-counts"], queryFn: buscarQuantidadesDeQuestoes, staleTime: 60_000 });
}

export function useQuestoesDoLivro(livroId: string) {
  return useQuery({
    queryKey: ["questions", livroId],
    queryFn: () => buscarQuestoesPorLivro(livroId),
    enabled: !!livroId,
    staleTime: 60_000,
  });
}

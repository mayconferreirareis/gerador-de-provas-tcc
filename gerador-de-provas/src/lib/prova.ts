import { useSyncExternalStore } from "react";
import type { Prova, Questao } from "@/dados/tipos";
import { TAMANHO_PROVA } from "@/dados/tipos";

/** Sorteia `quantidade` questões distintas (Fisher-Yates). Retorna null se não houver questões suficientes. */
export function sortearQuestoes(conjunto: Questao[], quantidade = TAMANHO_PROVA, aleatorio = Math.random): Questao[] | null {
  if (conjunto.length < quantidade) return null;
  const copia = [...conjunto];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    const temporario = copia[i];
    const selecionada = copia[j];
    if (!temporario || !selecionada) continue;
    copia[i] = selecionada;
    copia[j] = temporario;
  }
  return copia.slice(0, quantidade);
}

// Prova atual mantida apenas em memória (sem armazenamento permanente).
let provaAtual: Prova | null = null;
const ouvintes = new Set<() => void>();

export function criarProva(livroId: string, conjunto: Questao[]): Prova | null {
  const selecionadas = sortearQuestoes(conjunto);
  if (!selecionadas) return null;
  provaAtual = {
    id: `PRV-${Date.now().toString(36).toUpperCase()}`,
    livroId,
    criadaEm: new Date().toISOString(),
    questoes: selecionadas,
  };
  ouvintes.forEach((l) => l());
  return provaAtual;
}

export function useProvaAtual() {
  return useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    () => provaAtual,
    () => null,
  );
}

/** Define a prova atual (usada ao reabrir uma prova do histórico). */
export function abrirProva(prova: Prova) {
  provaAtual = prova;
  ouvintes.forEach((l) => l());
}

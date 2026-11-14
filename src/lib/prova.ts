import { useSyncExternalStore } from "react";
import type { Prova, Questao } from "@/dados/tipos";
import { TAMANHO_PROVA } from "@/dados/tipos";

// Embaralha as questões e pega as primeiras.
// Se o livro não tiver questões suficientes, retorna null.
export function sortearQuestoes(listaQuestoes: Questao[], quantidade = TAMANHO_PROVA, gerarNumero = Math.random): Questao[] | null {
  if (listaQuestoes.length < quantidade) {
    return null;
  }

  const embaralhadas = [...listaQuestoes];

  // percorre a lista de trás pra frente trocando cada item com uma posição sorteada
  for (let i = embaralhadas.length - 1; i > 0; i--) {
    const posicaoSorteada = Math.floor(gerarNumero() * (i + 1));
    const auxiliar = embaralhadas[i]!;
    embaralhadas[i] = embaralhadas[posicaoSorteada]!;
    embaralhadas[posicaoSorteada] = auxiliar;
  }

  return embaralhadas.slice(0, quantidade);
}

// prova que está aberta no momento (fica só na memória)
let provaAtual: Prova | null = null;

// funções que precisam ser avisadas quando a prova mudar
let telasAguardando: Array<() => void> = [];

function avisarTelas() {
  for (const avisar of telasAguardando) {
    avisar();
  }
}

export function criarProva(livroId: string, listaQuestoes: Questao[]): Prova | null {
  const questoesEscolhidas = sortearQuestoes(listaQuestoes);
  if (questoesEscolhidas === null) {
    return null;
  }

  const codigo = "PRV-" + Date.now().toString(36).toUpperCase();

  provaAtual = {
    id: codigo,
    livroId: livroId,
    criadaEm: new Date().toISOString(),
    questoes: questoesEscolhidas,
  };

  avisarTelas();
  return provaAtual;
}

// usado nas telas da prova e do gabarito para ler a prova atual
export function useProvaAtual() {
  return useSyncExternalStore(
    (funcao) => {
      telasAguardando.push(funcao);
      return () => {
        telasAguardando = telasAguardando.filter((item) => item !== funcao);
      };
    },
    () => provaAtual,
    () => null,
  );
}

// abre de novo uma prova que veio do histórico
export function abrirProva(prova: Prova) {
  provaAtual = prova;
  avisarTelas();
}

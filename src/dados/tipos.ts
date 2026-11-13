export type Testamento = "AT" | "NT";
export type ChaveAlternativa = "A" | "B" | "C" | "D";

export interface Livro {
  id: string;
  nome: string;
  testamento: Testamento;
  categoria: string;
  descricao: string;
}

export interface Questao {
  id: string; // código local, ex.: "JOA-001"
  livroId: string;
  enunciado: string;
  alternativas: Record<ChaveAlternativa, string>;
  respostaCorreta: ChaveAlternativa;
  referencia?: string | undefined;
}

export interface Prova {
  id: string;
  livroId: string;
  criadaEm: string;
  questoes: Questao[];
}

export const ROTULO_TESTAMENTO: Record<Testamento, string> = {
  AT: "Antigo Testamento",
  NT: "Novo Testamento",
};

export const TAMANHO_PROVA = 20;

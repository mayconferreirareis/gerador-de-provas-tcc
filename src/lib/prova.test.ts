import { describe, expect, it } from "vitest";
import { sortearQuestoes } from "./prova";
import { obterQuestoesDemonstracaoPorLivro } from "@/dados/questoes";

describe("sortearQuestoes", () => {
  it("retorna exatamente 20 questões distintas", () => {
    const resultado = sortearQuestoes(obterQuestoesDemonstracaoPorLivro("joao"));
    if (!resultado) throw new Error("Era esperado um sorteio completo.");
    expect(resultado).toHaveLength(20);
    expect(new Set(resultado.map((q) => q.id)).size).toBe(20);
  });
  it("recusa prova incompleta com menos de 20 questões", () => {
    expect(sortearQuestoes(obterQuestoesDemonstracaoPorLivro("salmos"))).toBeNull();
  });
});

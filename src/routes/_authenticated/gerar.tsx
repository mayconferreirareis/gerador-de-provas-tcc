import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Shuffle } from "lucide-react";
import { Pagina, CabecalhoPagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { livros, buscarLivro } from "@/dados/livros";
import { useQuestoesDoLivro, useQuantidadesDeQuestoes } from "@/lib/banco-questoes";
import { TAMANHO_PROVA, ROTULO_TESTAMENTO } from "@/dados/tipos";
import { criarProva } from "@/lib/prova";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/gerar")({
  validateSearch: (s: Record<string, unknown>): { livro?: string | undefined } => ({ livro: typeof s["livro"] === "string" ? s["livro"] : undefined }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Gerar prova — Gerador de Provas" },
      { name: "description", content: "Selecione um livro bíblico e gere uma prova com 20 questões aleatórias." },
      { property: "og:title", content: "Gerar prova — Gerador de Provas" },
      { property: "og:description", content: "Gere uma prova bíblica com 20 questões distintas." },
    ],
  }),
  component: GerarProva,
});

function GerarProva() {
  const { livro: livroSelecionado } = Route.useSearch();
  const navigate = useNavigate();
  const [livroId, definirLivroId] = useState(livroSelecionado && buscarLivro(livroSelecionado) ? livroSelecionado : "");
  const [carregando, definirCarregando] = useState(false);
  const { data: conjunto = [], isLoading: carregandoQuestoes } = useQuestoesDoLivro(livroId);
  const { data: quantidades } = useQuantidadesDeQuestoes();
  const questoesSuficientes = conjunto.length >= TAMANHO_PROVA;
  const livro = buscarLivro(livroId);

  async function gerarProva() {
    definirCarregando(true);
    try {
      const prova = criarProva(livroId, conjunto);
      if (prova) {
        // Registra a prova no histórico do usuário autenticado (RLS cuida do vínculo).
        try {
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            await supabase.from("provas").insert({
              usuario_id: data.user.id,
              livro_id: livroId,
              questoes_ids: prova.questoes.map((q) => q.id),
            });
          }
        } catch (err) {
          console.error("Falha ao registrar a prova no histórico:", err);
        }
        navigate({ to: "/prova" });
      }
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <Pagina className="max-w-3xl">
      <CabecalhoPagina titulo="Gerar prova" descricao={`Selecione um livro bíblico. O sistema sorteará ${TAMANHO_PROVA} questões distintas.`} />
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <label htmlFor="livro" className="text-sm font-semibold">1. Livro bíblico</label>
        <select
          id="livro"
          value={livroId}
          onChange={(e) => definirLivroId(e.target.value)}
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione um livro…</option>
          {(["AT", "NT"] as const).map((t) => (
            <optgroup key={t} label={ROTULO_TESTAMENTO[t]}>
              {livros.filter((b) => b.testamento === t).map((b) => {
                const n = quantidades?.[b.id] ?? 0;
                return <option key={b.id} value={b.id}>{b.nome}{n ? ` (${n} questões)` : " (em breve)"}</option>;
              })}
            </optgroup>
          ))}
        </select>

        <p className="mt-6 text-sm font-semibold">2. Verificação</p>
        <div role="status" className="mt-2 flex gap-3 rounded-lg border bg-background p-4 text-sm">
          {!livro ? (
            <p className="text-muted-foreground">Selecione um livro bíblico antes de continuar.</p>
          ) : carregandoQuestoes ? (
            <p className="text-muted-foreground">Carregando questões…</p>
          ) : questoesSuficientes ? (
            <>
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
              <p>
                {livro.nome} possui {conjunto.length} questões cadastradas. Prova pronta para ser gerada.
                {conjunto.length < TAMANHO_PROVA * 2 && " Como o conjunto é pequeno, algumas questões poderão se repetir em provas diferentes."}
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="size-5 shrink-0 text-destructive" />
              <p>
                Questões insuficientes: {livro.nome} possui {conjunto.length}. São necessárias pelo menos {TAMANHO_PROVA} para a geração completa.
              </p>
            </>
          )}
        </div>

        <Button size="lg" className="mt-6 w-full" disabled={!questoesSuficientes || carregando} onClick={gerarProva}>
          {carregando ? <Loader2 className="animate-spin" /> : <Shuffle />} {carregando ? "Gerando…" : "Gerar prova"}
        </Button>
      </div>
    </Pagina>
  );
}

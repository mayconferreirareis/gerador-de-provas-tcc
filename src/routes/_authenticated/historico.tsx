import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Archive, Loader2 } from "lucide-react";
import { Pagina, CabecalhoPagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { buscarLivro } from "@/dados/livros";
import { buscarQuestoesPorIds, useProvasDoUsuario, type RegistroProvaUsuario } from "@/lib/banco-questoes";
import { abrirProva } from "@/lib/prova";

export const Route = createFileRoute("/_authenticated/historico")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Histórico de provas — Gerador de Provas" },
      { name: "description", content: "Consulte as provas que você já gerou." },
      { property: "og:title", content: "Histórico de provas — Gerador de Provas" },
      { property: "og:description", content: "Consulte as provas que você já gerou." },
    ],
  }),
  component: HistoricoProvas,
});

function HistoricoProvas() {
  const navigate = useNavigate();
  const { data: provas, isLoading } = useProvasDoUsuario();
  const [abrindo, definirAbrindo] = useState<string | null>(null);
  const [erro, definirErro] = useState<string | null>(null);

  async function reabrirProva(registro: RegistroProvaUsuario) {
    definirAbrindo(registro.id);
    definirErro(null);
    try {
      const questoes = await buscarQuestoesPorIds(registro.questoes_ids);
      if (questoes.length === 0) {
        definirErro("As questões desta prova não foram encontradas no banco de dados.");
        return;
      }
      abrirProva({ id: registro.id, livroId: registro.livro_id, criadaEm: registro.criado_em, questoes });
      navigate({ to: "/prova" });
    } catch {
      definirErro("Não foi possível reabrir esta prova. Tente novamente.");
    } finally {
      definirAbrindo(null);
    }
  }

  return (
    <Pagina className="max-w-4xl">
      <CabecalhoPagina titulo="Histórico de provas" descricao="Todas as provas que você gerou, mais recentes primeiro." />

      {isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando suas provas…</p>
      )}

      {erro && <p role="alert" className="rounded-lg border bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}

      {!isLoading && provas && provas.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Archive className="mx-auto size-14 text-primary/40" />
          <h2 className="mt-4 text-2xl font-semibold">Você ainda não gerou provas.</h2>
          <p className="mt-2 text-muted-foreground">Gere sua primeira prova e ela aparecerá aqui automaticamente.</p>
          <Button asChild variant="highlight" className="mt-6"><Link to="/gerar">Gerar primeira prova</Link></Button>
        </div>
      )}

      {!isLoading && provas && provas.length > 0 && (
        <div className="grid gap-3">
          {provas.map((e) => {
            const b = buscarLivro(e.livro_id);
            const dataProva = new Date(e.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
            return (
              <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-soft">
                <div>
                  <p className="font-semibold">{b?.nome ?? e.livro_id}</p>
                  <p className="text-sm text-muted-foreground">{dataProva} · {e.questoes_ids.length} questões</p>
                </div>
                <Button variant="outline" size="sm" disabled={abrindo === e.id} onClick={() => reabrirProva(e)}>
                  {abrindo === e.id ? <Loader2 className="animate-spin" /> : null} Reabrir prova
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Pagina>
  );
}

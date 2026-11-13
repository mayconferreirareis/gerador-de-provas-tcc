import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FilePlus2, Info } from "lucide-react";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { CartaoQuestao } from "@/components/prova/CartaoQuestao";
import { buscarLivro } from "@/dados/livros";
import { useQuestoesDoLivro } from "@/lib/banco-questoes";
import { TAMANHO_PROVA, ROTULO_TESTAMENTO } from "@/dados/tipos";

export const Route = createFileRoute("/livros/$bookId/")({
  loader: ({ params }) => {
    const livro = buscarLivro(params.bookId);
    if (!livro) throw notFound();
    return { livro };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${loaderData?.livro.nome ?? "Livro"} — Gerador de Provas` },
      { name: "description", content: loaderData?.livro.descricao ?? "Detalhes do livro bíblico." },
      { property: "og:title", content: `${loaderData?.livro.nome ?? "Livro"} — Gerador de Provas` },
      { property: "og:description", content: loaderData?.livro.descricao ?? "Detalhes do livro bíblico." },
    ],
  }),
  component: DetalhesLivro,
});

function DetalhesLivro() {
  const { livro } = Route.useLoaderData();
  const { data: questoesLivro = [], isLoading } = useQuestoesDoLivro(livro.id);
  const questoesSuficientes = questoesLivro.length >= TAMANHO_PROVA;

  return (
    <Pagina>
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link to="/livros"><ArrowLeft /> Voltar ao catálogo</Link>
      </Button>

      <div className="rounded-2xl bg-hero p-8 text-primary-foreground shadow-soft">
        <p className="text-sm text-primary-foreground/75">{ROTULO_TESTAMENTO[livro.testamento]} · {livro.categoria}</p>
        <h1 className="mt-1 text-4xl font-semibold">{livro.nome}</h1>
        <p className="mt-3 max-w-2xl text-primary-foreground/85">{livro.descricao}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {questoesSuficientes ? (
            <Button asChild variant="highlight" size="lg">
              <Link to="/gerar" search={{ livro: livro.id }}><FilePlus2 /> Gerar prova</Link>
            </Button>
          ) : (
            <Button variant="highlight" size="lg" disabled><FilePlus2 /> Gerar prova</Button>
          )}
          <span className="text-sm text-primary-foreground/85">{questoesLivro.length} questões cadastradas</span>
        </div>
      </div>

      {!isLoading && !questoesSuficientes && (
        <div role="status" className="mt-6 flex gap-3 rounded-xl border bg-card p-4 text-sm">
          <Info className="size-5 shrink-0 text-primary" />
          <p>
            {questoesLivro.length === 0
              ? "Este livro ainda não possui questões cadastradas."
              : `Este livro tem ${questoesLivro.length} questões. São necessárias pelo menos ${TAMANHO_PROVA} para gerar uma prova completa.`}
          </p>
        </div>
      )}

      {questoesLivro.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-brand-deep">Questões disponíveis</h2>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/livros/$bookId/questoes" params={{ bookId: livro.id }}>Ver todas as questões</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {questoesLivro.slice(0, 4).map((q) => <CartaoQuestao key={q.id} questao={q} />)}
          </div>
        </section>
      )}
    </Pagina>
  );
}

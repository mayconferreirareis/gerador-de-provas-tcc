import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Pagina, CabecalhoPagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { CartaoQuestao } from "@/components/prova/CartaoQuestao";
import { buscarLivro } from "@/dados/livros";
import { useQuestoesDoLivro } from "@/lib/banco-questoes";

export const Route = createFileRoute("/livros/$bookId/questoes")({
  loader: ({ params }) => {
    const livro = buscarLivro(params.bookId);
    if (!livro) throw notFound();
    return { livro };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `Questões de ${loaderData?.livro.nome ?? "livro"} — Gerador de Provas` },
      { name: "description", content: "Questões do livro bíblico." },
      { property: "og:title", content: `Questões de ${loaderData?.livro.nome ?? "livro"}` },
      { property: "og:description", content: "Questões do livro bíblico." },
    ],
  }),
  component: QuestoesLivro,
});

function QuestoesLivro() {
  const { livro } = Route.useLoaderData();
  const { data: questoesLivro = [], isLoading } = useQuestoesDoLivro(livro.id);
  return (
    <Pagina>
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link to="/livros/$bookId" params={{ bookId: livro.id }}><ArrowLeft /> Voltar a {livro.nome}</Link>
      </Button>
      <CabecalhoPagina titulo={`Questões de ${livro.nome}`} descricao={`${questoesLivro.length} questões cadastradas.`}>
      </CabecalhoPagina>
      {isLoading ? (
        <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Carregando questões…</p>
      ) : questoesLivro.length === 0 ? (
        <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Sem questões cadastradas para este livro.</p>
      ) : (
        <div className="grid gap-4">{questoesLivro.map((q) => <CartaoQuestao key={q.id} questao={q} />)}</div>
      )}
    </Pagina>
  );
}

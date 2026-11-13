import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Pagina, CabecalhoPagina, SeloDemonstracao } from "@/components/layout/EstruturaAplicacao";
import { CartaoLivro } from "@/components/CartaoLivro";
import { livros } from "@/dados/livros";
import { ROTULO_TESTAMENTO, type Testamento } from "@/dados/tipos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/livros/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Livros da Bíblia — Gerador de Provas" },
      { name: "description", content: "Navegue pelos 66 livros da Bíblia e escolha um para preparar sua prova." },
      { property: "og:title", content: "Livros da Bíblia — Gerador de Provas" },
      { property: "og:description", content: "Escolha um livro para visualizar as questões disponíveis." },
    ],
  }),
  component: Catalogo,
});

const normalizar = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Catalogo() {
  const [q, definirBusca] = useState("");
  const [filtro, definirFiltro] = useState<"all" | Testamento>("all");
  const filtrados = useMemo(
    () => livros.filter((b) => (filtro === "all" || b.testamento === filtro) && normalizar(b.nome).includes(normalizar(q))),
    [q, filtro],
  );
  const grupos: Testamento[] = filtro === "all" ? ["AT", "NT"] : [filtro];

  return (
    <Pagina>
      <CabecalhoPagina titulo="Livros da Bíblia" descricao="Escolha um livro para visualizar as questões disponíveis e preparar sua prova.">
        <SeloDemonstracao />
      </CabecalhoPagina>

      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Pesquisar livro</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => definirBusca(e.target.value)}
            placeholder="Pesquisar pelo nome do livro"
            className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div role="group" aria-label="Filtrar por testamento" className="flex rounded-lg border bg-card p-1">
          {(["all", "AT", "NT"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filtro === f}
              onClick={() => definirFiltro(f)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filtro === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "all" ? "Todos" : ROTULO_TESTAMENTO[f]}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 && (
        <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">Nenhum livro encontrado para "{q}".</p>
      )}

      {grupos.map((t) => {
        const lista = filtrados.filter((b) => b.testamento === t);
        if (!lista.length) return null;
        return (
          <section key={t} className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-brand-deep">
              {ROTULO_TESTAMENTO[t]} <span className="text-base font-normal text-muted-foreground">({lista.length})</span>
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {lista.map((b) => <CartaoLivro key={b.id} livro={b} />)}
            </div>
          </section>
        );
      })}
    </Pagina>
  );
}

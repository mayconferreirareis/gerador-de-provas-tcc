import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { Pagina, CabecalhoPagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sobre o sistema — Gerador de Provas" },
      { name: "description", content: "Conheça o Gerador de Provas, sistema de provas bíblicas de múltipla escolha." },
      { property: "og:title", content: "Sobre o Gerador de Provas" },
      { property: "og:description", content: "Conheça o sistema e as próximas etapas." },
    ],
  }),
  component: Sobre,
});

const pronto = ["Catálogo dos 66 livros com pesquisa e filtros", "Questões de demonstração por livro", "Sorteio de 20 questões distintas", "Prova e gabarito correspondentes, com impressão"];
const proximasEtapas = ["Banco de dados com questões reais", "Cadastro e login de usuários", "Histórico de provas salvo", "Exportação em PDF"];

function Sobre() {
  return (
    <Pagina className="max-w-4xl">
      <CabecalhoPagina
        titulo="Sobre o sistema"
        descricao="O Gerador de Provas cria provas bíblicas de múltipla escolha para igrejas, escolas bíblicas, grupos de estudo e classes de ensino religioso."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Disponível nesta versão</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {pronto.map((r) => <li key={r} className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />{r}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-semibold">Próximas etapas</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {proximasEtapas.map((r) => <li key={r} className="flex gap-2"><Clock className="size-4 shrink-0 text-muted-foreground" />{r}</li>)}
          </ul>
        </div>
      </div>
      <Button asChild className="mt-8"><Link to="/livros">Explorar livros bíblicos</Link></Button>
    </Pagina>
  );
}

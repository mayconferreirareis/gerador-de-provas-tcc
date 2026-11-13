import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, ListChecks, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { CartaoLivro } from "@/components/CartaoLivro";
import { livros, idsLivrosEmDestaque } from "@/dados/livros";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Gerador de Provas — Provas bíblicas de múltipla escolha" },
      { name: "description", content: "Crie provas bíblicas de múltipla escolha de maneira prática, escolhendo um livro da Bíblia." },
      { property: "og:title", content: "Gerador de Provas" },
      { property: "og:description", content: "Transforme o estudo bíblico em conhecimento." },
    ],
  }),
  component: Inicio,
});

const recursos = [
  { icon: BookOpenText, titulo: "Questões bíblicas", texto: "Questões organizadas por livro da Bíblia." },
  { icon: ListChecks, titulo: "Provas organizadas", texto: "Proposta de gerar avaliações de múltipla escolha com 20 questões." },
  { icon: Printer, titulo: "Gabarito e PDF", texto: "Proposta de facilitar a correção e a impressão das provas." },
];

function Inicio() {
  const destaques = livros.filter((livro) => idsLivrosEmDestaque.includes(livro.id));
  return (
    <>
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <BookOpenText aria-hidden className="pointer-events-none absolute -right-10 -top-6 size-80 text-primary-foreground/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
          <span className="mb-5 inline-block rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-highlight-foreground">
            Estudo bíblico
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Transforme o estudo bíblico em conhecimento.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85">
            Crie provas bíblicas de múltipla escolha de maneira prática e organizada. Escolha um livro da Bíblia e
            prepare avaliações para seus estudos e atividades de ensino.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="highlight">
              <Link to="/livros">Explorar livros bíblicos <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="heroOutline">
              <Link to="/sobre">Conhecer o sistema</Link>
            </Button>
          </div>
        </div>
      </section>

      <Pagina>
        <div className="grid gap-5 md:grid-cols-3">
          {recursos.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="rounded-xl border bg-card p-6 shadow-soft">
              <span className="grid size-11 place-items-center rounded-lg bg-highlight/25 text-brand-deep">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">{titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 mb-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-brand-deep">Livros em destaque</h2>
          <Button asChild variant="outline">
            <Link to="/livros">Ver todos os livros</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((b) => <CartaoLivro key={b.id} livro={b} />)}
        </div>
      </Pagina>
    </>
  );
}

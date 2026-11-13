import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import { baixarGabaritoPdf } from "@/lib/exportacao-pdf";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { SemProva } from "@/components/prova/SemProva";
import { buscarLivro } from "@/dados/livros";
import { useProvaAtual } from "@/lib/prova";

export const Route = createFileRoute("/_authenticated/gabarito")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Gabarito — Gerador de Provas" },
      { name: "description", content: "Gabarito da prova bíblica gerada." },
      { property: "og:title", content: "Gabarito — Gerador de Provas" },
      { property: "og:description", content: "Gabarito da prova bíblica gerada." },
    ],
  }),
  component: Gabarito,
});

function Gabarito() {
  const prova = useProvaAtual();
  if (!prova) return <SemProva />;
  const livro = buscarLivro(prova.livroId);
  if (!livro) return <SemProva />;
  return (
    <Pagina className="max-w-3xl">
      <div className="no-print mb-6 flex flex-wrap gap-2">
        <Button asChild variant="outline"><Link to="/prova"><ArrowLeft /> Voltar à prova</Link></Button>
        <Button onClick={() => window.print()}><Printer /> Imprimir gabarito</Button>
        <Button variant="highlight" onClick={() => baixarGabaritoPdf({ prova, nomeLivro: livro.nome })}><FileDown /> Baixar gabarito em PDF</Button>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-soft print:shadow-none">
        <h1 className="text-3xl font-semibold text-brand-deep">Gabarito</h1>
        <p className="mt-1">Livro: <strong>{livro.nome}</strong> · Prova <span className="font-mono text-sm">{prova.id}</span></p>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-2 pr-3">Nº</th><th className="py-2 pr-3">Resposta</th><th className="py-2">Alternativa correta</th>
            </tr>
          </thead>
          <tbody>
            {prova.questoes.map((q, i) => (
              <tr key={q.id} className="border-b last:border-0">
                <td className="py-2 pr-3 font-serif font-semibold text-primary">{i + 1}</td>
                <td className="py-2 pr-3"><span className="inline-grid size-7 place-items-center rounded-md bg-highlight font-bold text-highlight-foreground">{q.respostaCorreta}</span></td>
                <td className="py-2">{q.alternativas[q.respostaCorreta]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Pagina>
  );
}

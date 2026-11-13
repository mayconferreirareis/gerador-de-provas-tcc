import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FileDown, KeyRound, Printer, Shuffle } from "lucide-react";
import { baixarProvaPdf } from "@/lib/exportacao-pdf";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";
import { CartaoQuestao } from "@/components/prova/CartaoQuestao";
import { SemProva } from "@/components/prova/SemProva";
import { buscarLivro } from "@/dados/livros";
import { useQuestoesDoLivro } from "@/lib/banco-questoes";
import { criarProva, useProvaAtual } from "@/lib/prova";

export const Route = createFileRoute("/_authenticated/prova")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Prova Bíblica — Gerador de Provas" },
      { name: "description", content: "Visualização da prova bíblica gerada." },
      { property: "og:title", content: "Prova Bíblica — Gerador de Provas" },
      { property: "og:description", content: "Visualização da prova bíblica gerada." },
    ],
  }),
  component: VisualizarProva,
});

function VisualizarProva() {
  const prova = useProvaAtual();
  const { data: conjunto = [] } = useQuestoesDoLivro(prova?.livroId ?? "");
  const [participante, definirParticipante] = useState("");
  const [dataProva, definirData] = useState("");
  if (!prova) return <SemProva />;
  const livro = buscarLivro(prova.livroId);
  if (!livro) return <SemProva />;

  return (
    <Pagina className="max-w-4xl">
      <div className="no-print mb-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => criarProva(livro.id, conjunto)}><Shuffle /> Gerar outra prova</Button>
        <Button asChild><Link to="/gabarito"><KeyRound /> Visualizar gabarito</Link></Button>
        <Button variant="outline" onClick={() => window.print()}><Printer /> Imprimir prova</Button>
        <Button variant="highlight" onClick={() => baixarProvaPdf({ prova, nomeLivro: livro.nome, participante, dataProva })}><FileDown /> Baixar prova em PDF</Button>
        <Button asChild variant="ghost"><Link to="/livros/$bookId" params={{ bookId: livro.id }}><ArrowLeft /> Voltar ao livro</Link></Button>
      </div>
      <p className="no-print mb-4 text-xs text-muted-foreground">Esta prova foi registrada no seu histórico no momento da geração.</p>

      <header className="mb-6 rounded-2xl border bg-card p-6 shadow-soft print:shadow-none">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-3xl font-semibold text-brand-deep">Prova Bíblica</h1>
          <span className="font-mono text-xs text-muted-foreground">{prova.id}</span>
        </div>
        <p className="mt-1 text-lg">Livro: <strong>{livro.nome}</strong></p>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_200px]">
          <label className="text-sm font-medium">Participante
            <input className="mt-1 h-10 w-full rounded-lg border bg-background px-3" placeholder="Nome do participante" value={participante} onChange={(e) => definirParticipante(e.target.value)} />
          </label>
          <label className="text-sm font-medium">Data
            <input type="date" value={dataProva} onChange={(e) => definirData(e.target.value)} className="mt-1 h-10 w-full rounded-lg border bg-background px-3" />
          </label>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Instruções: leia cada questão com atenção e marque apenas uma alternativa (A, B, C ou D).
        </p>
      </header>

      <div className="exam-columns grid gap-4">
        {prova.questoes.map((q, i) => <CartaoQuestao key={q.id} questao={q} numero={i + 1} mostrarDetalhes={false} />)}
      </div>
    </Pagina>
  );
}

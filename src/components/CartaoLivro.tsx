import { Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";
import type { Livro } from "@/dados/tipos";
import { ROTULO_TESTAMENTO } from "@/dados/tipos";
import { useQuantidadesDeQuestoes } from "@/lib/banco-questoes";
import { Button } from "@/components/ui/button";

export function CartaoLivro({ livro }: { livro: Livro }) {
  const { data: quantidades } = useQuantidadesDeQuestoes();
  const quantidade = quantidades?.[livro.id] ?? 0;
  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
          <BookMarked className="size-5" />
        </span>
        <span className="text-xs font-medium text-muted-foreground">{ROTULO_TESTAMENTO[livro.testamento]}</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-foreground">{livro.nome}</h3>
        <p className="text-sm text-muted-foreground">{livro.categoria}</p>
      </div>
      <p className="text-sm">
        {quantidade > 0 ? (
          <span className="font-medium text-primary">{quantidade} questões</span>
        ) : (
          <span className="text-muted-foreground">Em breve · sem questões cadastradas</span>
        )}
      </p>
      <Button asChild variant={quantidade > 0 ? "default" : "outline"} className="mt-auto">
        <Link to="/livros/$bookId" params={{ bookId: livro.id }}>Ver questões</Link>
      </Button>
    </article>
  );
}

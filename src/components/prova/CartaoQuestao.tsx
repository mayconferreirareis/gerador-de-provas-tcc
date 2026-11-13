import type { ChaveAlternativa, Questao } from "@/dados/tipos";

const CHAVES_ALTERNATIVAS: ChaveAlternativa[] = ["A", "B", "C", "D"];

export function CartaoQuestao({ questao, numero, mostrarDetalhes = true }: { questao: Questao; numero?: number; mostrarDetalhes?: boolean }) {
  return (
    <article className="break-inside-avoid rounded-xl border bg-card p-5 shadow-soft print:shadow-none">
      {mostrarDetalhes && (
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{questao.id}</span>
          {questao.referencia && <span>{questao.referencia}</span>}
        </div>
      )}
      <p className="font-medium text-foreground">
        {numero !== undefined && <span className="mr-2 font-serif text-primary">{numero}.</span>}
        {questao.enunciado}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {CHAVES_ALTERNATIVAS.map((k) => (
          <li key={k} className="flex gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <span className="font-semibold text-primary">{k})</span>
            {questao.alternativas[k]}
          </li>
        ))}
      </ul>
    </article>
  );
}

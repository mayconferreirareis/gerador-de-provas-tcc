import { Link } from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { Button } from "@/components/ui/button";

export function SemProva() {
  return (
    <Pagina className="max-w-xl text-center">
      <FileQuestion className="mx-auto size-14 text-primary/40" />
      <h1 className="mt-4 text-2xl font-semibold text-brand-deep">Nenhuma prova gerada</h1>
      <p className="mt-2 text-muted-foreground">Gere uma prova para visualizá-la aqui. Provas não são salvas ao recarregar a página.</p>
      <Button asChild className="mt-6"><Link to="/gerar">Gerar prova</Link></Button>
    </Pagina>
  );
}

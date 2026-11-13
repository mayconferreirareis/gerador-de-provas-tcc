import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { definirSenhaRecuperacao } from "@/lib/autenticacao";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Redefinir senha — Gerador de Provas" },
      { name: "description", content: "Crie uma nova senha para sua conta." },
      { property: "og:title", content: "Redefinir senha — Gerador de Provas" },
      { property: "og:description", content: "Crie uma nova senha para sua conta." },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  // null = ainda verificando; false = sem sessão de recuperação; true = pode redefinir.
  const [pronto, definirPronto] = useState<boolean | null>(null);
  const [senha, definirSenha] = useState("");
  const [confirmacao, definirConfirmacao] = useState("");
  const [erro, definirErro] = useState<string | null>(null);
  const [concluido, definirConcluido] = useState(false);
  const [ocupado, definirOcupado] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => definirPronto(!!data.user));
  }, []);

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    definirErro(null);
    if (senha.length < 6) {
      definirErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      definirErro("As senhas não coincidem.");
      return;
    }
    definirOcupado(true);
    const resultado = await definirSenhaRecuperacao(senha);
    definirOcupado(false);
    if (resultado.erro) definirErro(resultado.erro);
    else definirConcluido(true);
  }

  return (
    <Pagina className="max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-brand-deep">Redefinir senha</h1>
        {pronto === null && <p className="mt-4 text-sm text-muted-foreground">Verificando o link…</p>}
        {pronto === false && (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Este link é inválido ou já expirou. Solicite um novo link na página de login.
            </p>
            <Button asChild className="mt-6"><Link to="/entrar">Ir para o login</Link></Button>
          </>
        )}
        {pronto === true && concluido && (
          <>
            <p className="mt-4 text-sm text-primary">Senha alterada com sucesso!</p>
            <Button asChild className="mt-6"><Link to="/entrar">Entrar com a nova senha</Link></Button>
          </>
        )}
        {pronto === true && !concluido && (
          <>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Crie uma nova senha para sua conta.</p>
            <form noValidate onSubmit={aoEnviar} className="grid gap-4">
              <div>
                <label htmlFor="new-password" className="text-sm font-medium">Nova senha</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => definirSenha(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="new-password-confirm" className="text-sm font-medium">Confirmar nova senha</label>
                <input
                  id="new-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmacao}
                  onChange={(e) => definirConfirmacao(e.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </div>
              {erro && <p className="text-sm text-destructive">⚠ {erro}</p>}
              <Button type="submit" size="lg" disabled={ocupado}>
                {ocupado ? "Aguarde…" : "Salvar nova senha"}
              </Button>
            </form>
          </>
        )}
      </div>
    </Pagina>
  );
}

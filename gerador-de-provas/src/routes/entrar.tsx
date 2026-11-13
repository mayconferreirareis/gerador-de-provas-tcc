import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { FormularioAutenticacao } from "@/components/FormularioAutenticacao";
import { Button } from "@/components/ui/button";
import { solicitarRedefinicaoSenha, entrarUsuario } from "@/lib/autenticacao";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/entrar")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Entrar — Gerador de Provas" },
      { name: "description", content: "Acesse sua conta no Gerador de Provas." },
      { property: "og:title", content: "Entrar — Gerador de Provas" },
      { property: "og:description", content: "Acesse sua conta no Gerador de Provas." },
    ],
  }),
  component: Entrada,
});

function Entrada() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [recuperandoSenha, definirRecuperandoSenha] = useState(false);
  const [emailRecuperacao, definirEmailRecuperacao] = useState("");
  const [avisoRecuperacao, definirAvisoRecuperacao] = useState<string | null>(null);
  const [enviandoRecuperacao, definirEnviandoRecuperacao] = useState(false);

  // Já autenticado? Vai direto para o início em vez de mostrar o formulário.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  async function enviarFormulario(valores: Record<string, string>) {
    const resultado = await entrarUsuario(valores["email"] ?? "", valores["senha"] ?? "");
    if (!resultado.erro) {
      const destino = redirect && redirect.startsWith("/") ? redirect : "/";
      await navigate({ to: destino });
    }
    return resultado;
  }

  async function recuperarSenha() {
    if (!/^\S+@\S+\.\S+$/.test(emailRecuperacao.trim())) {
      definirAvisoRecuperacao("Informe um e-mail válido para recuperar a senha.");
      return;
    }
    definirEnviandoRecuperacao(true);
    const resultado = await solicitarRedefinicaoSenha(emailRecuperacao.trim());
    definirEnviandoRecuperacao(false);
    definirAvisoRecuperacao(resultado.erro ?? resultado.sucesso ?? null);
  }

  return (
    <Pagina className="max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-brand-deep">Entrar</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Entre para gerar provas e consultá-las no seu histórico.
        </p>
        <FormularioAutenticacao
          rotuloEnviar="Entrar"
          campos={[
            { nome: "email", rotulo: "E-mail", tipo: "email", preenchimentoAutomatico: "email" },
            { nome: "senha", rotulo: "Senha", tipo: "password", preenchimentoAutomatico: "current-password" },
          ]}
          aoEnviar={enviarFormulario}
        />
        {!recuperandoSenha ? (
          <button type="button" onClick={() => definirRecuperandoSenha(true)} className="mt-4 text-sm text-primary hover:underline">
            Esqueci minha senha
          </button>
        ) : (
          <div className="mt-4 rounded-lg border bg-background p-4">
            <p className="text-sm font-medium">Recuperar senha</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Informe seu e-mail e enviaremos um link para criar uma nova senha.
            </p>
            <input
              type="email"
              value={emailRecuperacao}
              onChange={(e) => definirEmailRecuperacao(e.target.value)}
              placeholder="seu@email.com"
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={recuperarSenha} disabled={enviandoRecuperacao}>
                {enviandoRecuperacao ? <Loader2 className="animate-spin" /> : null} Enviar link
              </Button>
              <Button size="sm" variant="outline" onClick={() => { definirRecuperandoSenha(false); definirAvisoRecuperacao(null); }}>
                Cancelar
              </Button>
            </div>
            {avisoRecuperacao && <p role="status" className="mt-2 text-sm text-muted-foreground">{avisoRecuperacao}</p>}
          </div>
        )}
        <div className="mt-6 border-t pt-6">
          <Button asChild variant="outline" className="w-full"><Link to="/cadastro">Criar conta</Link></Button>
        </div>
      </div>
    </Pagina>
  );
}

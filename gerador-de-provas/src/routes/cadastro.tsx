import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Pagina } from "@/components/layout/EstruturaAplicacao";
import { FormularioAutenticacao } from "@/components/FormularioAutenticacao";
import { cadastrarUsuario } from "@/lib/autenticacao";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Criar conta — Gerador de Provas" },
      { name: "description", content: "Crie sua conta no Gerador de Provas." },
      { property: "og:title", content: "Criar conta — Gerador de Provas" },
      { property: "og:description", content: "Crie sua conta no Gerador de Provas." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  return (
    <Pagina className="max-w-md">
      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-brand-deep">Criar conta</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">
          Com uma conta você gera provas e acompanha tudo no seu histórico.
        </p>
        <FormularioAutenticacao
          rotuloEnviar="Criar conta"
          campos={[
            { nome: "email", rotulo: "E-mail", tipo: "email", preenchimentoAutomatico: "email" },
            { nome: "senha", rotulo: "Senha", tipo: "password", preenchimentoAutomatico: "new-password" },
            { nome: "confirmacao", rotulo: "Confirmar senha", tipo: "password", preenchimentoAutomatico: "new-password" },
          ]}
          validar={(v) => (v["senha"] !== v["confirmacao"] ? "As senhas não coincidem." : null)}
          aoEnviar={async (valores) => {
            const resultado = await cadastrarUsuario(valores["email"] ?? "", valores["senha"] ?? "");
            if (resultado.sucesso && resultado.sucesso.includes("já está autenticado")) {
              await navigate({ to: "/" });
            }
            return resultado;
          }}
        />
        <p className="mt-6 text-center text-sm">
          Já tem conta? <Link to="/entrar" className="font-medium text-primary hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </Pagina>
  );
}

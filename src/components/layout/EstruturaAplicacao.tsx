import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, Home, Library, FilePlus2, History, Info, LogIn, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const navegacao = [
  { to: "/", rotulo: "Início", icon: Home },
  { to: "/livros", rotulo: "Livros da Bíblia", icon: Library },
  { to: "/gerar", rotulo: "Gerar prova", icon: FilePlus2 },
  { to: "/historico", rotulo: "Histórico de provas", icon: History },
  { to: "/sobre", rotulo: "Sobre o sistema", icon: Info },
] as const;

const classesLink =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight";
const classesLinkAtivo = "bg-primary-foreground/15 text-primary-foreground";

function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-serif text-lg font-semibold text-primary-foreground">
      <span className="grid size-9 place-items-center rounded-lg bg-highlight text-highlight-foreground">
        <BookOpen className="size-5" />
      </span>
      Gerador de Provas
    </Link>
  );
}

// e-mail do usuário autenticado (null quando deslogado), reativo às mudanças de sessão.
function useEmailSessao() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let ativo = true;
    supabase.auth.getUser().then(({ data }) => {
      if (ativo) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      supabase.auth.getUser().then(({ data }) => {
        if (ativo) setEmail(data.user?.email ?? null);
      });
    });
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return email;
}

function LinksNavegacao({ aoNavegar }: { aoNavegar?: () => void }) {
  const email = useEmailSessao();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function sair() {
    // Encerra a sessão e limpa os dados carregados.
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/entrar", replace: true });
  }

  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-1">
      {navegacao.map(({ to, rotulo, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={aoNavegar}
          activeOptions={{ exact: to === "/" }}
          className={classesLink}
          activeProps={{ className: classesLinkAtivo }}
        >
          <Icon className="size-4" />
          {rotulo}
        </Link>
      ))}
      {email ? (
        <>
          <p className="mt-2 truncate px-3 text-xs text-primary-foreground/60">{email}</p>
          <button
            type="button"
            onClick={() => {
              aoNavegar?.();
              void sair();
            }}
            className={cn(classesLink, "text-left")}
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </>
      ) : (
        <Link to="/entrar" onClick={aoNavegar} activeOptions={{ exact: true }} className={classesLink} activeProps={{ className: classesLinkAtivo }}>
          <LogIn className="size-4" />
          Entrar
        </Link>
      )}
    </nav>
  );
}

export function EstruturaAplicacao({ children }: { children: ReactNode }) {
  const [aberto, definirAberto] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      <aside className="no-print hidden w-64 shrink-0 flex-col gap-8 bg-brand-deep p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Marca />
        <LinksNavegacao />
        <p className="mt-auto text-xs text-primary-foreground/60">Gerador de Provas · versão 1.0</p>
      </aside>

      <header className="no-print sticky top-0 z-30 bg-brand-deep lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Marca />
          <button
            type="button"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            onClick={() => definirAberto((v) => !v)}
            className="grid size-10 place-items-center rounded-lg text-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight"
          >
            {aberto ? <X /> : <Menu />}
          </button>
        </div>
        {aberto && (
          <div className="border-t border-primary-foreground/10 px-4 pb-4 pt-2">
            <LinksNavegacao aoNavegar={() => definirAberto(false)} />
          </div>
        )}
      </header>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">{children}</main>
        <footer className="no-print border-t bg-card">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif font-semibold text-foreground">Gerador de Provas</p>
              <p>Provas bíblicas de múltipla escolha para estudo e ensino.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-primary">Início</Link>
              <Link to="/livros" className="hover:text-primary">Livros da Bíblia</Link>
              <Link to="/sobre" className="hover:text-primary">Sobre</Link>
            </div>
            <p>© 2026 Gerador de Provas. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function CabecalhoPagina({ titulo, descricao, children }: { titulo: string; descricao?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-brand-deep md:text-4xl">{titulo}</h1>
        {descricao && <p className="mt-2 max-w-2xl text-muted-foreground">{descricao}</p>}
      </div>
      {children}
    </div>
  );
}

export function Pagina({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12", className)}>{children}</div>;
}

export function SeloDemonstracao() {
  return (
    <span className="inline-flex items-center rounded-full bg-highlight/25 px-2.5 py-0.5 text-xs font-semibold text-highlight-foreground">
      Dados de demonstração
    </span>
  );
}

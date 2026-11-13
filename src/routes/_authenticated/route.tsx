import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Layout sem caminho que protege todas as rotas filhas (/gerar, /prova, /gabarito, /historico).
// O `ssr: false` é obrigatório: a sessão vive no navegador e o servidor não consegue lê-la.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/entrar", search: { redirect: location.pathname } });
    }
  },
  component: () => <Outlet />,
});

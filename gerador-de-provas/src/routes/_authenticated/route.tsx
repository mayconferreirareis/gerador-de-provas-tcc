import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Protege todas as rotas filhas (/gerar, /prova, /gabarito, /historico).
// A verificação do login acontece no navegador.
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

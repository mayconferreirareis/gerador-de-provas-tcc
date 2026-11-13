import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Verifica os endereços sem executar consultas ou renderizar as páginas.
// O ambiente de testes não carrega todas as conexões e folhas de estilo.
describe("Endereços da aplicação", () => {
  it("encontra a página inicial em vez de retornar página não encontrada", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const paginas = router.matchRoutes("/");

    expect(paginas.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

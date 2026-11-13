# Páginas e endereços

O TanStack Start associa arquivos às páginas do sistema. A estrutura principal fica em `__root.tsx`, que deve manter `<Outlet />` para exibir as páginas filhas.

| Arquivo | Endereço |
| --- | --- |
| `index.tsx` | `/` |
| `livros.index.tsx` | `/livros` |
| `livros.$bookId.index.tsx` | `/livros/joao`, por exemplo |
| `livros.$bookId.questoes.tsx` | `/livros/joao/questoes`, por exemplo |
| `cadastro.tsx` | `/cadastro` |
| `entrar.tsx` | `/entrar` |
| `redefinir-senha.tsx` | `/redefinir-senha` |
| `sobre.tsx` | `/sobre` |
| `_authenticated/gerar.tsx` | `/gerar` (exige acesso) |
| `_authenticated/prova.tsx` | `/prova` (exige acesso) |
| `_authenticated/gabarito.tsx` | `/gabarito` (exige acesso) |
| `_authenticated/historico.tsx` | `/historico` (exige acesso) |

`$bookId` é o parâmetro do endereço existente; dentro das entidades, o atributo correspondente se chama `livroId`. `_authenticated` é um agrupamento sem endereço próprio que mantém a proteção de acesso.

Não criar `src/pages/`, `src/routes/_app/index.tsx` ou `app/layout.tsx`: essas estruturas não fazem parte deste projeto.

`routeTree.gen.ts` e os arquivos de integração são gerados pelas ferramentas; não devem ser traduzidos ou editados manualmente.

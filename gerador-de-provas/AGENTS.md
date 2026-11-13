<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Domain types and book/demo data live in src/dados (tipos, livros, questoes), separate from UI; in-memory exam state lives in src/lib/prova.ts to keep data sources replaceable.

- Real questions and user history are read through src/lib/banco-questoes.ts (React Query hooks); src/dados/livros.ts uses the database book IDs, while src/dados/questoes.ts is legacy test data only.

- Auth helpers live in src/lib/autenticacao.ts; protected pages remain in src/routes/_authenticated with a redirect to /entrar. Generation records `provas`, and history reopens them with buscarQuestoesPorIds + abrirProva; preserve the existing auth and ownership behavior.
- Localization keeps external API keys, React hook prefixes, generated integration files and router contracts unchanged; app-owned domain names and modules are translated together to avoid broken imports and library calls.

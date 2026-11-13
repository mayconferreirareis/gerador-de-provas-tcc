# Gerador de Provas

Sistema de provas bíblicas desenvolvido com apoio da plataforma [Lovable](https://lovable.dev), com questões no Lovable Cloud, acesso por e-mail e senha, histórico e exportação de PDF em três colunas.

## Rodar no VS Code

1. Extraia o projeto e abra a pasta que contém `package.json` no VS Code.
2. Abra **Terminal → Novo Terminal**.
3. Execute `npm install` para instalar as dependências.
4. Execute `npm run dev` e abra o endereço informado no terminal.
5. Para encerrar, pressione **Ctrl + C**.

É necessário ter Node.js e npm instalados e a configuração pública de conexão ao Lovable Cloud disponível no ambiente local. Não coloque senhas ou chaves privadas no código.

## Organização do código

- `src/dados/tipos.ts`: entidades `Livro`, `Questao` e `Prova`.
- `src/dados/livros.ts`: catálogo dos 66 livros da Bíblia.
- `src/dados/questoes.ts`: dados antigos de demonstração, usados somente nos testes.
- `src/lib/prova.ts`: sorteio de questões e controle da prova atual em memória.
- `src/lib/banco-questoes.ts`: consultas de questões e histórico no Lovable Cloud.
- `src/lib/autenticacao.ts`: cadastro, entrada e recuperação de senha.
- `src/lib/exportacao-pdf.ts`: geração da prova e do gabarito com jsPDF no navegador.
- `src/components`: elementos reutilizáveis das telas.
- `src/routes`: páginas e proteção de acesso.

Os nomes próprios do sistema estão em português. Palavras como `import`, `interface` e `return`, nomes das bibliotecas, atributos HTML e arquivos gerados permanecem originais porque fazem parte das ferramentas utilizadas.

## Testes

Execute `npm test` para verificar os testes automatizados.

## Tecnologias

TypeScript, React, TanStack Start, Tailwind CSS, jsPDF e Lovable Cloud.

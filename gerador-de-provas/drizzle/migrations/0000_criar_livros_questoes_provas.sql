CREATE TABLE public.livros (
  id text PRIMARY KEY,
  nome text NOT NULL,
  testamento text NOT NULL CHECK (testamento IN ('AT','NT')),
  categoria text NOT NULL,
  descricao text NOT NULL DEFAULT '',
  ordem int NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.livros TO anon, authenticated;
GRANT ALL ON public.livros TO service_role;
ALTER TABLE public.livros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Livros são públicos" ON public.livros FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.questoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  livro_id text NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  enunciado text NOT NULL,
  opcao_a text NOT NULL,
  opcao_b text NOT NULL,
  opcao_c text NOT NULL,
  opcao_d text NOT NULL,
  resposta_correta char(1) NOT NULL CHECK (resposta_correta IN ('A','B','C','D')),
  referencia text,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX questoes_livro_idx ON public.questoes(livro_id);
GRANT SELECT ON public.questoes TO anon, authenticated;
GRANT ALL ON public.questoes TO service_role;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questões são públicas" ON public.questoes FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.provas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  livro_id text NOT NULL REFERENCES public.livros(id),
  questoes_ids uuid[] NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX provas_usuario_idx ON public.provas(usuario_id);
GRANT SELECT, INSERT, DELETE ON public.provas TO authenticated;
GRANT ALL ON public.provas TO service_role;
ALTER TABLE public.provas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver próprias provas" ON public.provas FOR SELECT TO authenticated USING (auth.uid() = usuario_id);
CREATE POLICY "Criar próprias provas" ON public.provas FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Excluir próprias provas" ON public.provas FOR DELETE TO authenticated USING (auth.uid() = usuario_id);

INSERT INTO public.livros (id,nome,testamento,categoria,descricao,ordem) VALUES
('genesis','Gênesis','AT','Pentateuco','O livro das origens: criação, queda, dilúvio e a história dos patriarcas.',1),
('exodo','Êxodo','AT','Pentateuco','Livro do Antigo Testamento (Pentateuco).',2),
('levitico','Levítico','AT','Pentateuco','Livro do Antigo Testamento (Pentateuco).',3),
('numeros','Números','AT','Pentateuco','Livro do Antigo Testamento (Pentateuco).',4),
('deuteronomio','Deuteronômio','AT','Pentateuco','Livro do Antigo Testamento (Pentateuco).',5),
('josue','Josué','AT','Históricos','Livro do Antigo Testamento (Históricos).',6),
('juizes','Juízes','AT','Históricos','Livro do Antigo Testamento (Históricos).',7),
('rute','Rute','AT','Históricos','Livro do Antigo Testamento (Históricos).',8),
('1-samuel','1 Samuel','AT','Históricos','Livro do Antigo Testamento (Históricos).',9),
('2-samuel','2 Samuel','AT','Históricos','Livro do Antigo Testamento (Históricos).',10),
('1-reis','1 Reis','AT','Históricos','Livro do Antigo Testamento (Históricos).',11),
('2-reis','2 Reis','AT','Históricos','Livro do Antigo Testamento (Históricos).',12),
('1-cronicas','1 Crônicas','AT','Históricos','Livro do Antigo Testamento (Históricos).',13),
('2-cronicas','2 Crônicas','AT','Históricos','Livro do Antigo Testamento (Históricos).',14),
('esdras','Esdras','AT','Históricos','Livro do Antigo Testamento (Históricos).',15),
('neemias','Neemias','AT','Históricos','Livro do Antigo Testamento (Históricos).',16),
('ester','Ester','AT','Históricos','Livro do Antigo Testamento (Históricos).',17),
('jo','Jó','AT','Poéticos','Livro do Antigo Testamento (Poéticos).',18),
('salmos','Salmos','AT','Poéticos','Coleção de cânticos e orações de louvor, lamento e confiança em Deus.',19),
('proverbios','Provérbios','AT','Poéticos','Livro do Antigo Testamento (Poéticos).',20),
('eclesiastes','Eclesiastes','AT','Poéticos','Livro do Antigo Testamento (Poéticos).',21),
('canticos','Cânticos','AT','Poéticos','Livro do Antigo Testamento (Poéticos).',22),
('isaias','Isaías','AT','Profetas Maiores','Livro do Antigo Testamento (Profetas Maiores).',23),
('jeremias','Jeremias','AT','Profetas Maiores','Livro do Antigo Testamento (Profetas Maiores).',24),
('lamentacoes','Lamentações','AT','Profetas Maiores','Livro do Antigo Testamento (Profetas Maiores).',25),
('ezequiel','Ezequiel','AT','Profetas Maiores','Livro do Antigo Testamento (Profetas Maiores).',26),
('daniel','Daniel','AT','Profetas Maiores','Livro do Antigo Testamento (Profetas Maiores).',27),
('oseias','Oseias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',28),
('joel','Joel','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',29),
('amos','Amós','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',30),
('obadias','Obadias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',31),
('jonas','Jonas','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',32),
('miqueias','Miqueias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',33),
('naum','Naum','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',34),
('habacuque','Habacuque','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',35),
('sofonias','Sofonias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',36),
('ageu','Ageu','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',37),
('zacarias','Zacarias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',38),
('malaquias','Malaquias','AT','Profetas Menores','Livro do Antigo Testamento (Profetas Menores).',39),
('mateus','Mateus','NT','Evangelhos','Livro do Novo Testamento (Evangelhos).',40),
('marcos','Marcos','NT','Evangelhos','Livro do Novo Testamento (Evangelhos).',41),
('lucas','Lucas','NT','Evangelhos','Livro do Novo Testamento (Evangelhos).',42),
('joao','João','NT','Evangelhos','Evangelho que apresenta Jesus como o Verbo de Deus, por meio de sinais e discursos.',43),
('atos','Atos','NT','Histórico','Livro do Novo Testamento (Histórico).',44),
('romanos','Romanos','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',45),
('1-corintios','1 Coríntios','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',46),
('2-corintios','2 Coríntios','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',47),
('galatas','Gálatas','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',48),
('efesios','Efésios','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',49),
('filipenses','Filipenses','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',50),
('colossenses','Colossenses','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',51),
('1-tessalonicenses','1 Tessalonicenses','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',52),
('2-tessalonicenses','2 Tessalonicenses','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',53),
('1-timoteo','1 Timóteo','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',54),
('2-timoteo','2 Timóteo','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',55),
('tito','Tito','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',56),
('filemom','Filemom','NT','Cartas Paulinas','Livro do Novo Testamento (Cartas Paulinas).',57),
('hebreus','Hebreus','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',58),
('tiago','Tiago','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',59),
('1-pedro','1 Pedro','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',60),
('2-pedro','2 Pedro','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',61),
('1-joao','1 João','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',62),
('2-joao','2 João','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',63),
('3-joao','3 João','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',64),
('judas','Judas','NT','Cartas Gerais','Livro do Novo Testamento (Cartas Gerais).',65),
('apocalipse','Apocalipse','NT','Profético','Livro do Novo Testamento (Profético).',66);
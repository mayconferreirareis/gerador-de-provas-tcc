CREATE OR REPLACE FUNCTION public.tmp_importar_questoes(_dados jsonb, _token text)
RETURNS int LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n int;
BEGIN
  IF _token <> 'imp-7f3c9a2e-41b8-4d6a-9e10-cc52b7d8a6f4' THEN RAISE EXCEPTION 'negado'; END IF;
  INSERT INTO public.questoes (livro_id,enunciado,opcao_a,opcao_b,opcao_c,opcao_d,resposta_correta,referencia)
  SELECT x->>'livro_id', btrim(x->>'enunciado'), btrim(x->>'a'), btrim(x->>'b'), btrim(x->>'c'), btrim(x->>'d'), upper(x->>'r'), nullif(x->>'ref','')
  FROM jsonb_array_elements(_dados) x;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $$;
GRANT EXECUTE ON FUNCTION public.tmp_importar_questoes(jsonb, text) TO anon;
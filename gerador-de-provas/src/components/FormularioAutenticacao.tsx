import { useState, type FormEvent } from "react";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CampoFormulario {
  nome: string;
  rotulo: string;
  tipo: string;
  preenchimentoAutomatico?: string;
}

export interface ResultadoAutenticacao {
  erro?: string;
  sucesso?: string;
}

interface PropriedadesFormularioAutenticacao {
  campos: CampoFormulario[];
  rotuloEnviar: string;
  validar?: (v: Record<string, string>) => string | null;
  aoEnviar: (valores: Record<string, string>) => Promise<ResultadoAutenticacao>;
}

export function FormularioAutenticacao({ campos, rotuloEnviar, validar, aoEnviar }: PropriedadesFormularioAutenticacao) {
  const [erros, definirErros] = useState<Record<string, string>>({});
  const [aviso, definirAviso] = useState<string | null>(null);
  const [enviando, definirEnviando] = useState(false);

  async function aoEnviarFormulario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulario = e.currentTarget;
    const data = Object.fromEntries(new FormData(formulario)) as Record<string, string>;
    const errosCampos: Record<string, string> = {};
    for (const f of campos) {
      const v = (data[f.nome] ?? "").trim();
      if (!v) errosCampos[f.nome] = `Preencha o campo ${f.rotulo.toLowerCase()}.`;
      else if (f.tipo === "email" && !/^\S+@\S+\.\S+$/.test(v)) errosCampos[f.nome] = "Informe um e-mail válido.";
      else if (f.tipo === "password" && v.length < 6) errosCampos[f.nome] = "A senha deve ter pelo menos 6 caracteres.";
    }
    const erroAdicional = Object.keys(errosCampos).length ? null : validar?.(data);
    if (erroAdicional) errosCampos["confirmacao"] = erroAdicional;
    definirErros(errosCampos);
    if (Object.keys(errosCampos).length) {
      definirAviso(null);
      return;
    }

    definirEnviando(true);
    const resultado = await aoEnviar(data);
    definirEnviando(false);
    if (resultado?.erro) {
      definirErros({ confirmacao: resultado.erro });
      definirAviso(null);
    } else if (resultado?.sucesso) {
      definirAviso(resultado.sucesso);
    }
    if (resultado?.erro || resultado?.sucesso) {
      formulario.querySelectorAll<HTMLInputElement>("input[type=password]").forEach((i) => (i.value = ""));
    }
  }

  return (
    <form noValidate onSubmit={aoEnviarFormulario} className="grid gap-4">
      {campos.map((f) => (
        <div key={f.nome}>
          <label htmlFor={f.nome} className="text-sm font-medium">{f.rotulo}</label>
          <input
            id={f.nome}
            name={f.nome}
            type={f.tipo}
            autoComplete={f.preenchimentoAutomatico}
            aria-invalid={!!erros[f.nome]}
            aria-describedby={erros[f.nome] ? `${f.nome}-err` : undefined}
            disabled={enviando}
            className="mt-1 h-11 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
          />
          {erros[f.nome] && <p id={`${f.nome}-err`} className="mt-1 text-sm text-destructive">⚠ {erros[f.nome]}</p>}
        </div>
      ))}
      {/* Erros gerais (ex.: credenciais inválidas) sem campo correspondente. */}
      {erros["confirmacao"] && !campos.some((f) => f.nome === "confirmacao") && (
        <p className="text-sm text-destructive">⚠ {erros["confirmacao"]}</p>
      )}
      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? <><Loader2 className="animate-spin" /> Aguarde…</> : rotuloEnviar}
      </Button>
      {aviso && (
        <p role="status" className="flex gap-2 rounded-lg border bg-secondary p-3 text-sm text-secondary-foreground">
          <Info className="size-4 shrink-0" /> {aviso}
        </p>
      )}
    </form>
  );
}

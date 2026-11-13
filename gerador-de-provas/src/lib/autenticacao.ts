import { supabase } from "@/integrations/supabase/client";

export interface ResultadoAutenticacao {
  erro?: string;
  sucesso?: string;
}

/** Traduz mensagens técnicas do serviço de autenticação para português claro. */
export function traduzirErroAutenticacao(mensagem: string): string {
  if (mensagem.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (mensagem.includes("already registered") || mensagem.includes("already been registered"))
    return "Este e-mail já está cadastrado. Tente entrar.";
  if (mensagem.includes("Email not confirmed"))
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (mensagem.toLowerCase().includes("rate limit"))
    return "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.";
  if (mensagem.includes("weak_password") || mensagem.toLowerCase().includes("weak"))
    return "Esta senha é muito comum ou já apareceu em vazamentos. Escolha uma senha mais forte, com letras, números e símbolos.";
  if (mensagem.toLowerCase().includes("not allowed") && mensagem.toLowerCase().includes("domain"))
    return "Este endereço de e-mail não é aceito. Verifique se o domínio foi digitado corretamente (ex.: @gmail.com, @hotmail.com).";
  if (mensagem.includes("Password should be at least"))
    return "A senha deve ter pelo menos 6 caracteres.";
  return mensagem;
}

/** Cria a conta. Com confirmação de e-mail ativa, a sessão só chega depois do clique no link enviado por e-mail. */
export async function cadastrarUsuario(email: string, senha: string): Promise<ResultadoAutenticacao> {
  const { data, error: erro } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  if (erro) return { erro: traduzirErroAutenticacao(erro.message) };
  if (data.session) return { sucesso: "Conta criada! Você já está autenticado." };
  return {
    sucesso: "Conta criada! Enviamos um link de confirmação para o seu e-mail. Após confirmar, volte aqui e entre.",
  };
}

export async function entrarUsuario(email: string, senha: string): Promise<ResultadoAutenticacao> {
  const { error: erro } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (erro) return { erro: traduzirErroAutenticacao(erro.message) };
  return {};
}

/** Envia o link "Esqueci minha senha". A redefinição acontece na página /redefinir-senha. */
export async function solicitarRedefinicaoSenha(email: string): Promise<ResultadoAutenticacao> {
  const { error: erro } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });
  if (erro) return { erro: traduzirErroAutenticacao(erro.message) };
  return { sucesso: "Se este e-mail estiver cadastrado, enviamos um link para criar uma nova senha." };
}

/** Define uma nova senha durante a recuperação (sem exigir a atual). */
export async function definirSenhaRecuperacao(senha: string): Promise<ResultadoAutenticacao> {
  const { error: erro } = await supabase.auth.updateUser({ password: senha });
  if (erro) return { erro: traduzirErroAutenticacao(erro.message) };
  return { sucesso: "Senha alterada com sucesso!" };
}

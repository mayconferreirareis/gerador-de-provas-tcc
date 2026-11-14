import { supabase } from "@/integrations/supabase/client";

export interface ResultadoAutenticacao {
  erro?: string;
  sucesso?: string;
}

// As mensagens de erro do login vêm em inglês, aqui troco pelo texto em português
export function traduzirErroAutenticacao(mensagem: string): string {
  const texto = mensagem.toLowerCase();

  if (mensagem.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (mensagem.includes("already registered") || mensagem.includes("already been registered")) {
    return "Este e-mail já está cadastrado. Tente entrar.";
  }
  if (mensagem.includes("Email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  }
  if (texto.includes("rate limit")) {
    return "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.";
  }
  if (mensagem.includes("weak_password") || texto.includes("weak")) {
    return "Esta senha é muito comum ou já apareceu em vazamentos. Escolha uma senha mais forte, com letras, números e símbolos.";
  }
  if (texto.includes("not allowed") && texto.includes("domain")) {
    return "Este endereço de e-mail não é aceito. Verifique se o domínio foi digitado corretamente (ex.: @gmail.com, @hotmail.com).";
  }
  if (mensagem.includes("Password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  return mensagem;
}

// cadastro de usuário novo (precisa confirmar o e-mail antes de entrar)
export async function cadastrarUsuario(email: string, senha: string): Promise<ResultadoAutenticacao> {
  const resposta = await supabase.auth.signUp({
    email: email,
    password: senha,
    options: { emailRedirectTo: window.location.origin + "/" },
  });

  if (resposta.error) {
    return { erro: traduzirErroAutenticacao(resposta.error.message) };
  }

  if (resposta.data.session) {
    return { sucesso: "Conta criada! Você já está autenticado." };
  }

  return {
    sucesso: "Conta criada! Enviamos um link de confirmação para o seu e-mail. Após confirmar, volte aqui e entre.",
  };
}

export async function entrarUsuario(email: string, senha: string): Promise<ResultadoAutenticacao> {
  const resposta = await supabase.auth.signInWithPassword({ email: email, password: senha });

  if (resposta.error) {
    return { erro: traduzirErroAutenticacao(resposta.error.message) };
  }
  return {};
}

// envia o e-mail de "esqueci minha senha", o link abre a página /redefinir-senha
export async function solicitarRedefinicaoSenha(email: string): Promise<ResultadoAutenticacao> {
  const resposta = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/redefinir-senha",
  });

  if (resposta.error) {
    return { erro: traduzirErroAutenticacao(resposta.error.message) };
  }
  return { sucesso: "Se este e-mail estiver cadastrado, enviamos um link para criar uma nova senha." };
}

// salva a senha nova depois que o usuário clicou no link do e-mail
export async function definirSenhaRecuperacao(senha: string): Promise<ResultadoAutenticacao> {
  const resposta = await supabase.auth.updateUser({ password: senha });

  if (resposta.error) {
    return { erro: traduzirErroAutenticacao(resposta.error.message) };
  }
  return { sucesso: "Senha alterada com sucesso!" };
}

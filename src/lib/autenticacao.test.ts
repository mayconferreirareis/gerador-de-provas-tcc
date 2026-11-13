import { describe, expect, it } from "vitest";
import { traduzirErroAutenticacao } from "@/lib/autenticacao";

describe("friendlyAuthError", () => {
  it("traduz credenciais inválidas para uma mensagem clara em português", () => {
    expect(traduzirErroAutenticacao("Invalid login credentials")).toBe("E-mail ou senha incorretos.");
  });

  it("traduz e-mail já cadastrado", () => {
    expect(traduzirErroAutenticacao("User already registered")).toBe("Este e-mail já está cadastrado. Tente entrar.");
  });

  it("traduz e-mail não confirmado", () => {
    expect(traduzirErroAutenticacao("Email not confirmed")).toBe(
      "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.",
    );
  });

  it("traduz senha fraca ou vazada", () => {
    expect(
      traduzirErroAutenticacao("Password is known to be weak and easy to guess, please choose a different one."),
    ).toBe("Esta senha é muito comum ou já apareceu em vazamentos. Escolha uma senha mais forte, com letras, números e símbolos.");
  });
});

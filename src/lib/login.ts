/**
 * Regras da tela de login (BASE-05), em funções puras.
 * Por enquanto o login é de mentira: qualquer e-mail entra e escolhe o perfil.
 * O login de verdade fica para a FUT-03.
 */
import type { PerfilAcesso } from "@/types";

export const PERFIS: { valor: PerfilAcesso; rotulo: string; descricao: string }[] = [
  { valor: "dono", rotulo: "Dono", descricao: "Tudo, inclusive financeiro e configurações" },
  { valor: "gestor", rotulo: "Gestor", descricao: "Operação da escola e relatórios" },
  { valor: "instrutor", rotulo: "Instrutor", descricao: "Turmas, chamada e graduações" },
  { valor: "recepcao", rotulo: "Recepção", descricao: "Alunos, cadastro e caixa do dia" },
];

const PERFIS_VALIDOS = new Set<string>(PERFIS.map((p) => p.valor));

export function rotuloDoPerfil(perfil: PerfilAcesso): string {
  return PERFIS.find((p) => p.valor === perfil)?.rotulo ?? perfil;
}

export function perfilValido(valor: string): valor is PerfilAcesso {
  return PERFIS_VALIDOS.has(valor);
}

export interface CamposLogin {
  email: string;
  senha: string;
  perfil: string;
}

export type ErrosLogin = Partial<Record<keyof CamposLogin, string>>;

/** Formato básico de e-mail: algo@algo.algo, sem espaços. */
export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Confere os campos. Objeto vazio = pode entrar. */
export function validarLogin(campos: CamposLogin): ErrosLogin {
  const erros: ErrosLogin = {};
  if (!campos.email.trim()) erros.email = "Informe o e-mail.";
  else if (!emailValido(campos.email)) erros.email = "E-mail inválido. Ex.: nome@escola.com.br";
  if (!campos.senha) erros.senha = "Informe a senha.";
  if (!perfilValido(campos.perfil)) erros.perfil = "Escolha um perfil.";
  return erros;
}

/** "rafael.lima@pakua.com.br" -> "Rafael Lima": nome provisório a partir do e-mail. */
export function nomePeloEmail(email: string): string {
  const usuario = email.trim().split("@")[0] ?? "";
  return usuario
    .split(/[._-]+/)
    .filter(Boolean)
    .map((parte) => parte[0].toUpperCase() + parte.slice(1).toLowerCase())
    .join(" ");
}

export function temErrosLogin(erros: ErrosLogin): boolean {
  return Object.keys(erros).length > 0;
}

/** Resposta da ação de entrar, usada pelo formulário. */
export interface EstadoLogin {
  erros: ErrosLogin;
  /** Erro geral, acima do formulário. */
  mensagem: string | null;
  /** Devolve o que foi digitado, para o formulário não esvaziar depois de um erro. */
  email: string;
  perfil: string;
}

export const ESTADO_LOGIN_INICIAL: EstadoLogin = { erros: {}, mensagem: null, email: "", perfil: "" };

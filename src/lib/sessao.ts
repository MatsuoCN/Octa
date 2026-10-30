/**
 * Sessão de mentira (BASE-05): guarda e-mail, nome e perfil num cookie.
 * Só roda no servidor. Não tem segurança nenhuma: o login de verdade é a FUT-03.
 */
import { cookies } from "next/headers";
import type { PerfilAcesso } from "@/types";
import { perfilValido } from "@/lib/login";

const COOKIE = "octa-sessao";

export interface Sessao {
  email: string;
  nome: string;
  perfil: PerfilAcesso;
}

/** Lê a sessão do cookie. Devolve null sem sessão ou com cookie estragado. */
export async function lerSessao(): Promise<Sessao | null> {
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return null;
  try {
    const dados = JSON.parse(valor) as Partial<Sessao>;
    if (typeof dados.email !== "string" || typeof dados.nome !== "string" || !perfilValido(dados.perfil ?? "")) {
      return null;
    }
    return dados as Sessao;
  } catch {
    return null;
  }
}

/** Só pode ser chamada dentro de uma Server Action. */
export async function gravarSessao(sessao: Sessao): Promise<void> {
  (await cookies()).set(COOKIE, JSON.stringify(sessao), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });
}

/** Só pode ser chamada dentro de uma Server Action. */
export async function apagarSessao(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

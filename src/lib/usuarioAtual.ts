/**
 * Quem está usando o sistema. Só roda no servidor.
 * Vem da sessão do login de mentira (BASE-05); sem sessão, usa o usuário padrão do mock.
 * TODO(FUT-03): trocar pelo usuário do login de verdade.
 */
import { getUsuarioAtual } from "@/lib/api";
import { lerSessao } from "@/lib/sessao";
import type { PerfilAcesso } from "@/types";

export interface UsuarioExibido {
  nome: string;
  perfil: PerfilAcesso;
}

export async function buscarUsuarioExibido(): Promise<UsuarioExibido> {
  const sessao = await lerSessao();
  if (sessao) return { nome: sessao.nome, perfil: sessao.perfil };
  const usuario = await getUsuarioAtual();
  return { nome: usuario.nome, perfil: usuario.perfil };
}

export async function buscarPerfilAtual(): Promise<PerfilAcesso> {
  return (await buscarUsuarioExibido()).perfil;
}

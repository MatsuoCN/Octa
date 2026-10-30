/**
 * Guarda os filtros da lista na aba do navegador (sessionStorage), para o botão
 * "Alunos" do perfil voltar para a lista do jeito que estava.
 */
import { useSyncExternalStore } from "react";

const CHAVE = "octa:alunos:ultima-busca";

export function salvarUltimaBusca(query: string): void {
  try {
    sessionStorage.setItem(CHAVE, query);
  } catch {
    // Armazenamento bloqueado: o botão volta para a lista sem filtros.
  }
}

function lerUltimaBusca(): string {
  try {
    return sessionStorage.getItem(CHAVE) ?? "";
  } catch {
    return "";
  }
}

const nadaParaAssinar = () => () => {};

/** Endereço da lista com os últimos filtros usados. No servidor, sempre "/alunos". */
export function useEnderecoDaLista(): string {
  const query = useSyncExternalStore(nadaParaAssinar, lerUltimaBusca, () => "");
  return `/alunos${query}`;
}

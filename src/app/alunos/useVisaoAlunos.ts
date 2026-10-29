"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { VISAO_PADRAO, aplicarVisao, assinarMudancas, lerVisao, salvarVisao, type Visao } from "./preferenciaVisao";

/** Visão no servidor e na hidratação: sempre a padrão. Depois vale o localStorage. */
function lerVisaoNoServidor(): Visao {
  return VISAO_PADRAO;
}

/**
 * Hook da preferência grade/lista.
 * Devolve a visão atual (para marcar o botão ativo) e a função para trocar.
 */
export function useVisaoAlunos(): [Visao, (visao: Visao) => void] {
  const visao = useSyncExternalStore(assinarMudancas, lerVisao, lerVisaoNoServidor);

  // Navegando pelo menu (sem recarregar) o script inline não roda: aplica aqui, antes de pintar.
  useLayoutEffect(() => {
    aplicarVisao(lerVisao());
  }, []);

  return [visao, salvarVisao];
}

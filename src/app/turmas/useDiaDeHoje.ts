"use client";

import { useSyncExternalStore } from "react";
import type { DiaSemana } from "@/types";
import { diaDaGrade } from "@/lib/turmas";

/*
 * O dia de hoje depende do relógio de quem está vendo a tela. Com Cache Components,
 * ler a hora no prerender do servidor não é permitido; então o servidor devolve null
 * (nenhum dia destacado) e o navegador assume logo na hidratação, sem aviso de diferença.
 * A tela também se atualiza quando a aba volta a ficar visível (ex.: deixada aberta de um dia para o outro).
 */

function assinar(avisar: () => void) {
  document.addEventListener("visibilitychange", avisar);
  return () => document.removeEventListener("visibilitychange", avisar);
}

const lerNoNavegador = (): DiaSemana | null => diaDaGrade(new Date());
const lerNoServidor = (): DiaSemana | null => null;

/** Dia da grade correspondente a hoje (null no domingo e no servidor). */
export function useDiaDeHoje(): DiaSemana | null {
  return useSyncExternalStore(assinar, lerNoNavegador, lerNoServidor);
}

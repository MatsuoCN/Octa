"use client";

import { DIAS_SEMANA } from "@/lib/turmas";
import { useDiaDeHoje } from "./useDiaDeHoje";

/** Linha de cabeçalho da grade, com o dia de hoje destacado. */
export function CabecalhoDias() {
  const hoje = useDiaDeHoje();

  return (
    <tr>
      <th scope="col" className="sticky left-0 z-10 w-14 border-b border-line bg-surface-2 px-2 py-3 sm:w-18 sm:px-3 text-left">
        <span className="sr-only">Horário</span>
      </th>
      {DIAS_SEMANA.map(({ dia, nome, curto }) => {
        const ehHoje = dia === hoje;
        return (
          <th
            key={dia}
            scope="col"
            aria-current={ehHoje ? "date" : undefined}
            className={`border-b border-l border-line px-3 py-3 text-left text-sm font-semibold transition-colors ${
              ehHoje ? "bg-accent text-accent-ink" : "bg-surface-2 text-ink"
            }`}
          >
            <span className="hidden sm:inline">{nome}</span>
            <span className="sm:hidden">{curto}</span>
            {ehHoje && <span className="ml-2 rounded-full bg-accent-ink/15 px-2 py-0.5 text-xs">Hoje</span>}
          </th>
        );
      })}
    </tr>
  );
}

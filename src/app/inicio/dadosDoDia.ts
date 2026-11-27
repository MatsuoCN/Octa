/**
 * Dados do dia usados por mais de um bloco do Início (cabeçalho e aulas de hoje).
 * `cache` faz a busca acontecer uma vez por visita, mesmo com vários blocos pedindo.
 * Só roda no servidor e precisa ficar dentro de um <Suspense>.
 */
import { cache } from "react";
import { connection } from "next/server";
import { getChamadasDoDia, getInstrutores, getModalidades, getTurmas } from "@/lib/api";
import { montarAulasDeHoje, type AulaDoDia } from "@/lib/aulasDeHoje";
import { momentoNaEscola, type MomentoEscola } from "@/lib/horarioEscola";

export interface DadosDoDia {
  agora: MomentoEscola;
  /** null quando a busca falhou. */
  aulas: AulaDoDia[] | null;
}

export const buscarDadosDoDia = cache(async (): Promise<DadosDoDia> => {
  // Depende da hora atual: roda a cada visita, e não no build.
  await connection();
  const agora = momentoNaEscola(new Date());

  try {
    const [turmas, modalidades, instrutores, chamadas] = await Promise.all([
      getTurmas(agora.diaSemana === null ? {} : { diaSemana: agora.diaSemana }),
      getModalidades(),
      getInstrutores(),
      getChamadasDoDia(agora.data),
    ]);
    const aulas = montarAulasDeHoje({ turmas, modalidades, instrutores, chamadas, diaSemana: agora.diaSemana, horaAgora: agora.hora });
    return { agora, aulas };
  } catch {
    return { agora, aulas: null };
  }
});

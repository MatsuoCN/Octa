/**
 * Regras do bloco "Aulas de hoje" do Início (INICIO-03), em funções puras.
 */
import type { DiaSemana, Instrutor, Modalidade, RegistroChamada, Turma } from "@/types";
import { somarMinutos } from "@/lib/turmas";

export type SituacaoAula =
  | { tipo: "feita"; presentes: number }
  | { tipo: "proxima" }
  | { tipo: "por_fazer" };

export interface AulaDoDia {
  turmaId: string;
  horario: string;
  horarioFim: string;
  modalidadeNome: string;
  modalidadeCor: string;
  instrutorNome: string;
  sala: string;
  matriculados: number;
  capacidade: number;
  situacao: SituacaoAula;
}

interface DadosAulasDeHoje {
  turmas: Turma[];
  modalidades: Modalidade[];
  instrutores: Instrutor[];
  chamadas: RegistroChamada[];
  diaSemana: DiaSemana | null;
  /** HH:mm no fuso da escola. */
  horaAgora: string;
}

/**
 * Aulas do dia em ordem de horário. Aula com chamada salva fica "feita".
 * A "próxima" é a primeira sem chamada que ainda não terminou (pode ser a que está
 * acontecendo agora). As demais ficam "por fazer", inclusive as que já passaram sem chamada.
 */
export function montarAulasDeHoje({
  turmas,
  modalidades,
  instrutores,
  chamadas,
  diaSemana,
  horaAgora,
}: DadosAulasDeHoje): AulaDoDia[] {
  if (diaSemana === null) return [];

  const doDia = turmas
    .filter((t) => t.diaSemana === diaSemana)
    .sort((a, b) => a.horario.localeCompare(b.horario));

  let proximaMarcada = false;
  return doDia.map((turma) => {
    const modalidade = modalidades.find((m) => m.id === turma.modalidadeId);
    const chamada = chamadas.find((c) => c.turmaId === turma.id);
    // Na chamada fica quem deu a aula de fato (pode ter sido um substituto).
    const instrutorId = chamada?.instrutorId ?? turma.instrutorId;
    const horarioFim = somarMinutos(turma.horario, turma.duracaoMinutos);

    let situacao: SituacaoAula;
    if (chamada) situacao = { tipo: "feita", presentes: chamada.presentes };
    else if (!proximaMarcada && horarioFim > horaAgora) {
      situacao = { tipo: "proxima" };
      proximaMarcada = true;
    } else situacao = { tipo: "por_fazer" };

    return {
      turmaId: turma.id,
      horario: turma.horario,
      horarioFim,
      modalidadeNome: modalidade?.nome ?? "Modalidade removida",
      modalidadeCor: modalidade?.cor ?? "var(--muted)",
      instrutorNome: instrutores.find((i) => i.id === instrutorId)?.nome ?? "Sem instrutor",
      sala: turma.sala,
      matriculados: turma.ocupacao,
      capacidade: turma.capacidade,
      situacao,
    };
  });
}

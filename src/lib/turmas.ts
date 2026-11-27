/**
 * Regras da tela de turmas, em funções puras (sem React, sem busca de dados).
 * Recebem dados e devolvem dados: fáceis de ler, de reaproveitar e de testar.
 */
import type { DiaSemana, Instrutor, Modalidade, Turma } from "@/types";
import { indexarPorId } from "@/lib/alunos";

/** Dias da grade, na ordem do tipo DiaSemana (0 = segunda ... 5 = sábado). */
export const DIAS_SEMANA: { dia: DiaSemana; nome: string; curto: string }[] = [
  { dia: 0, nome: "Segunda", curto: "Seg" },
  { dia: 1, nome: "Terça", curto: "Ter" },
  { dia: 2, nome: "Quarta", curto: "Qua" },
  { dia: 3, nome: "Quinta", curto: "Qui" },
  { dia: 4, nome: "Sexta", curto: "Sex" },
  { dia: 5, nome: "Sábado", curto: "Sáb" },
];

/** Uma turma pronta para exibir, com modalidade e instrutor já resolvidos. */
export interface CardTurma {
  id: string;
  diaSemana: DiaSemana;
  horario: string;
  horarioFim: string;
  modalidadeNome: string;
  modalidadeCor: string;
  instrutorNome: string;
  sala: string;
  ocupacao: number;
  capacidade: number;
}

/** Uma linha da grade: um horário e as turmas de cada dia nesse horário. */
export interface LinhaGrade {
  horario: string;
  /** Índice = DiaSemana. Cada dia pode ter zero, uma ou mais turmas no mesmo horário. */
  dias: CardTurma[][];
}

/** "19:00" + 90 -> "20:30" */
export function somarMinutos(horario: string, minutos: number): string {
  const [h, m] = horario.split(":").map(Number);
  const total = (h * 60 + m + minutos) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function estaLotada(turma: Pick<CardTurma, "ocupacao" | "capacidade">): boolean {
  return turma.ocupacao >= turma.capacidade;
}

/** Ocupação em %, de 0 a 100 (nunca passa de 100, mesmo com encaixe acima da capacidade). */
export function percentualOcupacao(turma: Pick<CardTurma, "ocupacao" | "capacidade">): number {
  if (turma.capacidade <= 0) return 100;
  return Math.min(100, Math.round((turma.ocupacao / turma.capacidade) * 100));
}

export function montarCardTurma(
  turma: Turma,
  modalidades: Map<string, Modalidade>,
  instrutores: Map<string, Instrutor>,
): CardTurma {
  const modalidade = modalidades.get(turma.modalidadeId);
  const instrutor = instrutores.get(turma.instrutorId);

  return {
    id: turma.id,
    diaSemana: turma.diaSemana,
    horario: turma.horario,
    horarioFim: somarMinutos(turma.horario, turma.duracaoMinutos),
    modalidadeNome: modalidade?.nome ?? "Modalidade removida",
    modalidadeCor: modalidade?.cor ?? "var(--muted)",
    instrutorNome: instrutor?.nome ?? "Sem instrutor",
    sala: turma.sala,
    ocupacao: turma.ocupacao,
    capacidade: turma.capacidade,
  };
}

/**
 * Monta as linhas da grade: uma por horário de início, em ordem, com as turmas
 * de cada dia nas colunas. Turmas no mesmo dia e horário ficam juntas na mesma célula.
 */
export function montarGradeSemanal(turmas: Turma[], modalidades: Modalidade[], instrutores: Instrutor[]): LinhaGrade[] {
  const catalogoModalidades = indexarPorId(modalidades);
  const catalogoInstrutores = indexarPorId(instrutores);
  const porHorario = new Map<string, LinhaGrade>();

  for (const turma of turmas) {
    let linha = porHorario.get(turma.horario);
    if (!linha) {
      linha = { horario: turma.horario, dias: DIAS_SEMANA.map(() => []) };
      porHorario.set(turma.horario, linha);
    }
    linha.dias[turma.diaSemana].push(montarCardTurma(turma, catalogoModalidades, catalogoInstrutores));
  }

  for (const linha of porHorario.values()) {
    for (const celula of linha.dias) celula.sort((a, b) => a.modalidadeNome.localeCompare(b.modalidadeNome, "pt-BR"));
  }

  return [...porHorario.values()].sort((a, b) => a.horario.localeCompare(b.horario));
}

/**
 * Dia da grade correspondente a uma data. Domingo não tem coluna, então devolve null.
 * Date.getDay(): 0 = domingo, 1 = segunda ... 6 = sábado.
 */
export function diaDaGrade(data: Date): DiaSemana | null {
  const dia = data.getDay();
  return dia === 0 ? null : ((dia - 1) as DiaSemana);
}

/** Endereço da chamada da turma (TURMAS-05). */
export function caminhoChamada(turmaId: string): string {
  return `/turmas/${turmaId}/chamada`;
}

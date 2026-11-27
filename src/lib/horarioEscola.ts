/**
 * Data e hora "da escola", independentes do fuso do servidor e do navegador.
 * Todas as escolas da federação hoje estão no mesmo fuso (UTC-3, sem horário de verão).
 * TODO: quando a Escola tiver o próprio fuso no cadastro, receber por parâmetro.
 */
import type { DiaSemana } from "@/types";

export const FUSO_ESCOLA = "America/Fortaleza";

export interface MomentoEscola {
  /** AAAA-MM-DD */
  data: string;
  /** HH:mm, 24 horas */
  hora: string;
  /** null no domingo, que não tem coluna na grade. */
  diaSemana: DiaSemana | null;
}

/** Converte um instante (Date) para data, hora e dia da semana no fuso da escola. */
export function momentoNaEscola(agora: Date, fuso: string = FUSO_ESCOLA): MomentoEscola {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: fuso,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);
  const parte = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((p) => p.type === tipo)?.value ?? "00";

  const data = `${parte("year")}-${parte("month")}-${parte("day")}`;
  return { data, hora: `${parte("hour")}:${parte("minute")}`, diaSemana: diaDaSemanaDaData(data) };
}

/**
 * "2026-11-27" (sexta) -> 4. Domingo -> null.
 * DiaSemana: 0 = segunda ... 5 = sábado. Date.getUTCDay(): 0 = domingo ... 6 = sábado.
 */
export function diaDaSemanaDaData(dataIso: string): DiaSemana | null {
  const [a, m, d] = dataIso.split("-").map(Number);
  const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  return dia === 0 ? null : ((dia - 1) as DiaSemana);
}

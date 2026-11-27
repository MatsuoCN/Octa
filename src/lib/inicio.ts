/**
 * Regras do cabeçalho do Início (INICIO-01), em funções puras.
 */
import type { AulaDoDia } from "@/lib/aulasDeHoje";
import { pluralizar } from "@/lib/formatadores";

const DIAS_EXTENSO = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const MESES_EXTENSO = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-10-08" -> "Quinta-feira, 8 de outubro" */
export function dataPorExtenso(dataIso: string): string {
  const [a, m, d] = dataIso.split("-").map(Number);
  const diaSemana = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  return `${DIAS_EXTENSO[diaSemana]}, ${d} de ${MESES_EXTENSO[m - 1]}`;
}

/** "Bom dia" até 11:59, "Boa tarde" até 17:59, depois "Boa noite". */
export function saudacao(hora: string): string {
  if (hora < "12:00") return "Bom dia";
  if (hora < "18:00") return "Boa tarde";
  return "Boa noite";
}

/** "Rafael Lima" -> "Rafael" */
export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

export function proximaAula(aulas: AulaDoDia[]): AulaDoDia | undefined {
  return aulas.find((a) => a.situacao.tipo === "proxima");
}

/**
 * Frase curta do dia:
 * "Sem aulas hoje" · "4 aulas hoje · a próxima começa às 18:00" ·
 * "4 aulas hoje · a das 18:00 está acontecendo agora" · "4 aulas hoje · as aulas do dia já terminaram"
 */
export function fraseDoDia(aulas: AulaDoDia[], horaAgora: string): string {
  if (aulas.length === 0) return "Sem aulas hoje";
  const total = `${pluralizar(aulas.length, "aula", "aulas")} hoje`;
  const proxima = proximaAula(aulas);
  if (!proxima) return `${total} · as aulas do dia já terminaram`;
  if (proxima.horario <= horaAgora) return `${total} · a das ${proxima.horario} está acontecendo agora`;
  return `${total} · a próxima começa às ${proxima.horario}`;
}

/**
 * Horários (HH:mm) em que o cabeçalho e a lista de aulas mudam: começo e fim de cada aula.
 * O navegador usa para atualizar a tela sozinho na hora certa.
 */
export function horariosDeMudanca(aulas: AulaDoDia[]): string[] {
  const horarios = new Set<string>(["12:00", "18:00"]); // a saudação também muda
  for (const a of aulas) {
    horarios.add(a.horario);
    horarios.add(a.horarioFim);
  }
  return [...horarios].sort();
}

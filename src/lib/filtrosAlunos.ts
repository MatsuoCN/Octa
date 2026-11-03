/**
 * Busca e filtros da lista de alunos (ALUNOS-02), em funções puras.
 * Os filtros moram no endereço da página (?q=&status=&modalidade=&turma=),
 * para dar para voltar, recarregar e compartilhar.
 */
import type { StatusAluno } from "@/types";
import type { LinhaAluno } from "@/lib/alunos";

export interface FiltrosAlunos {
  /** Nome, CPF ou telefone. */
  busca: string;
  status: StatusAluno | "";
  modalidadeId: string;
  turmaId: string;
}

export const FILTROS_VAZIOS: FiltrosAlunos = { busca: "", status: "", modalidadeId: "", turmaId: "" };

/** Pílulas de status, na ordem da tela. "" = Todos. */
export const PILULAS_STATUS: { valor: StatusAluno | ""; rotulo: string }[] = [
  { valor: "", rotulo: "Todos" },
  { valor: "em_dia", rotulo: "Em dia" },
  { valor: "atraso", rotulo: "Em atraso" },
  { valor: "experimental", rotulo: "Experimental" },
  { valor: "trancado", rotulo: "Trancado" },
];

const STATUS_VALIDOS = new Set<string>(PILULAS_STATUS.map((p) => p.valor).filter(Boolean));

/** Nomes curtos no endereço da página. */
const PARAMS = { busca: "q", status: "status", modalidadeId: "modalidade", turmaId: "turma" } as const;

/* ---------- Endereço da página <-> filtros ---------- */

export function lerFiltros(params: URLSearchParams): FiltrosAlunos {
  const status = params.get(PARAMS.status) ?? "";
  return {
    busca: params.get(PARAMS.busca) ?? "",
    status: STATUS_VALIDOS.has(status) ? (status as StatusAluno) : "",
    modalidadeId: params.get(PARAMS.modalidadeId) ?? "",
    turmaId: params.get(PARAMS.turmaId) ?? "",
  };
}

/** Filtros -> "?q=jose&status=atraso" (ou "" sem filtros). Campos vazios ficam de fora. */
export function filtrosParaQuery(filtros: FiltrosAlunos): string {
  const params = new URLSearchParams();
  for (const chave of Object.keys(PARAMS) as (keyof FiltrosAlunos)[]) {
    const valor = filtros[chave].trim();
    if (valor) params.set(PARAMS[chave], valor);
  }
  const texto = params.toString();
  return texto ? `?${texto}` : "";
}

export function temFiltroAtivo(filtros: FiltrosAlunos): boolean {
  return filtrosParaQuery(filtros) !== "";
}

/* ---------- Busca ---------- */

/** "José" -> "jose": sem acento e em minúsculas. */
export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const soDigitos = (texto: string) => texto.replace(/\D/g, "");

/** A partir de 3 números, a busca também procura no telefone e no CPF. */
const MINIMO_DIGITOS = 3;

export function correspondeBusca(aluno: LinhaAluno, busca: string): boolean {
  const termo = normalizarTexto(busca);
  if (!termo) return true;
  if (normalizarTexto(aluno.nome).includes(termo)) return true;

  const digitos = soDigitos(busca);
  if (digitos.length < MINIMO_DIGITOS) return false;
  return soDigitos(aluno.telefone).includes(digitos) || soDigitos(aluno.cpf ?? "").includes(digitos);
}

/* ---------- Filtros ---------- */

/** Tudo menos o status. Usado para a lista e para as contagens das pílulas. */
function passaFiltrosSemStatus(aluno: LinhaAluno, filtros: FiltrosAlunos): boolean {
  return (
    correspondeBusca(aluno, filtros.busca) &&
    (!filtros.modalidadeId || aluno.modalidades.some((m) => m.id === filtros.modalidadeId)) &&
    (!filtros.turmaId || aluno.turmaIds.includes(filtros.turmaId))
  );
}

export function filtrarAlunos(alunos: LinhaAluno[], filtros: FiltrosAlunos): LinhaAluno[] {
  return alunos.filter(
    (aluno) => passaFiltrosSemStatus(aluno, filtros) && (!filtros.status || aluno.status === filtros.status),
  );
}

/**
 * Quantos alunos cada pílula mostraria, respeitando a busca, a modalidade e a turma.
 * Assim o número na pílula é sempre o que aparece ao tocar nela.
 */
export function contarPorStatus(alunos: LinhaAluno[], filtros: FiltrosAlunos): Record<StatusAluno | "", number> {
  const contagem: Record<StatusAluno | "", number> = {
    "": 0,
    em_dia: 0,
    atraso: 0,
    experimental: 0,
    trancado: 0,
    inativo: 0,
  };
  for (const aluno of alunos) {
    if (!passaFiltrosSemStatus(aluno, filtros)) continue;
    contagem[""]++;
    contagem[aluno.status]++;
  }
  return contagem;
}

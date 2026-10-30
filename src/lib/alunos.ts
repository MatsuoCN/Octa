/**
 * Regras da tela de alunos, em funções puras (sem React, sem busca de dados).
 * Recebem dados e devolvem dados: fáceis de ler, de reaproveitar e de testar.
 */
import type { Aluno, Contrato, Modalidade, Plano, StatusAluno } from "@/types";

/** Um aluno pronto para exibir, com os nomes de modalidade e plano já resolvidos. */
export interface LinhaAluno {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  /** Como veio do cadastro (pode estar mascarado). Usado só na busca. */
  cpf: string | null;
  status: StatusAluno;
  verificado: boolean;
  alunoDesde: string;
  valorEmAtraso: number;
  modalidades: ModalidadeResumida[];
  turmaIds: string[];
  planoNome: string | null;
  diaVencimento: number | null;
}

export interface ModalidadeResumida {
  id: string;
  nome: string;
  cor: string;
}

/** Tabelas de consulta rápida (id -> objeto) usadas para montar as linhas. */
export interface Catalogos {
  modalidades: Map<string, Modalidade>;
  contratos: Map<string, Contrato>;
  planos: Map<string, Plano>;
}

/** Status que contam como aluno ativo. Trancado e inativo ficam de fora. */
const STATUS_ATIVOS: StatusAluno[] = ["em_dia", "atraso", "experimental"];

export function estaAtivo(aluno: Pick<Aluno, "status">): boolean {
  return STATUS_ATIVOS.includes(aluno.status);
}

export function contarAlunosAtivos(alunos: Aluno[]): number {
  return alunos.filter(estaAtivo).length;
}

/** Transforma uma lista em um Map indexado pelo id. */
export function indexarPorId<T extends { id: string }>(lista: T[]): Map<string, T> {
  return new Map(lista.map((item) => [item.id, item]));
}

export function montarCatalogos(modalidades: Modalidade[], contratos: Contrato[], planos: Plano[]): Catalogos {
  return {
    modalidades: indexarPorId(modalidades),
    contratos: indexarPorId(contratos),
    planos: indexarPorId(planos),
  };
}

/** Troca os ids de modalidade pelos dados que a tela mostra (nome e cor). Ids desconhecidos são ignorados. */
export function resolverModalidades(ids: string[], modalidades: Map<string, Modalidade>): ModalidadeResumida[] {
  return ids
    .map((id) => modalidades.get(id))
    .filter((m): m is Modalidade => m !== undefined)
    .map(({ id, nome, cor }) => ({ id, nome, cor }));
}

/** Contrato ativo do aluno, se houver. */
export function buscarContratoAtivo(aluno: Aluno, contratos: Map<string, Contrato>): Contrato | undefined {
  return aluno.contratoAtivoId ? contratos.get(aluno.contratoAtivoId) : undefined;
}

export function montarLinhaAluno(aluno: Aluno, catalogos: Catalogos): LinhaAluno {
  const contrato = buscarContratoAtivo(aluno, catalogos.contratos);
  const plano = contrato ? catalogos.planos.get(contrato.planoId) : undefined;

  return {
    id: aluno.id,
    nome: aluno.nome,
    dataNascimento: aluno.dataNascimento,
    telefone: aluno.telefone,
    cpf: aluno.cpf,
    status: aluno.status,
    verificado: aluno.verificado,
    alunoDesde: aluno.alunoDesde,
    valorEmAtraso: aluno.valorEmAtraso,
    modalidades: resolverModalidades(aluno.modalidadeIds, catalogos.modalidades),
    turmaIds: aluno.turmaIds,
    planoNome: plano?.nome ?? null,
    diaVencimento: contrato?.diaVencimento ?? null,
  };
}

export function ordenarPorNome<T extends { nome: string }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Monta e ordena as linhas da tela a partir dos dados brutos. */
export function montarLinhasAlunos(alunos: Aluno[], catalogos: Catalogos): LinhaAluno[] {
  return ordenarPorNome(alunos.map((aluno) => montarLinhaAluno(aluno, catalogos)));
}

/** Endereço do perfil do aluno. */
export function caminhoPerfil(alunoId: string): string {
  return `/alunos/${alunoId}`;
}

/* ---------- Situação financeira (rodapé do card) ---------- */

export type SituacaoFinanceira =
  | { tipo: "atraso"; valor: number }
  | { tipo: "trancado" }
  | { tipo: "vencimento"; dia: number }
  | { tipo: "experimental" }
  | { tipo: "sem_plano" };

/** Decide o que mostrar no rodapé do card. A ordem dos testes é a prioridade. */
export function calcularSituacaoFinanceira(linha: LinhaAluno): SituacaoFinanceira {
  if (linha.valorEmAtraso > 0) return { tipo: "atraso", valor: linha.valorEmAtraso };
  if (linha.status === "trancado") return { tipo: "trancado" };
  if (linha.diaVencimento) return { tipo: "vencimento", dia: linha.diaVencimento };
  if (linha.status === "experimental") return { tipo: "experimental" };
  return { tipo: "sem_plano" };
}

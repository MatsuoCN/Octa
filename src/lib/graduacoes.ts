/**
 * Regras da aba Graduações (ALUNOS-13), em funções puras.
 * Rodam no navegador (aviso na hora) e no servidor (a palavra final).
 */
import type { Graduacao, Instrutor, Modalidade, PerfilAcesso } from "@/types";

/* ======================================================================
 * Quem pode registrar
 * ==================================================================== */

/** "Instrutor e acima": Recepção só consulta. */
const PERFIS_QUE_GRADUAM: PerfilAcesso[] = ["dono", "gestor", "instrutor"];

export function podeRegistrarGraduacao(perfil: PerfilAcesso): boolean {
  return PERFIS_QUE_GRADUAM.includes(perfil);
}

/* ======================================================================
 * Linha do tempo
 * ==================================================================== */

export interface ItemLinhaDoTempo {
  chave: string;
  nivel: number;
  data: string;
  avaliadorNome: string | null;
  atual: boolean;
}

export interface GrupoModalidade {
  modalidadeId: string;
  nome: string;
  cor: string;
  nivelAtual: number;
  /** Mais recente primeiro. O primeiro é o nível atual. */
  itens: ItemLinhaDoTempo[];
}

/** Graduação com a posição em que foi registrada, para desempatar datas iguais. */
type GraduacaoNumerada = Graduacao & { ordem: number };

/** Mais recente primeiro. Na mesma data, a registrada por último vem antes. */
function maisRecentePrimeiro(a: GraduacaoNumerada, b: GraduacaoNumerada): number {
  return b.data.localeCompare(a.data) || b.ordem - a.ordem;
}

function numerar(graduacoes: Graduacao[]): GraduacaoNumerada[] {
  return graduacoes.map((g, ordem) => ({ ...g, ordem }));
}

/** Graduação mais recente da modalidade (o nível atual), ou undefined se não houver. */
export function graduacaoAtual(graduacoes: Graduacao[], modalidadeId: string): Graduacao | undefined {
  return numerar(graduacoes)
    .filter((g) => g.modalidadeId === modalidadeId)
    .sort(maisRecentePrimeiro)[0];
}

export function nivelAtual(graduacoes: Graduacao[], modalidadeId: string): number | null {
  return graduacaoAtual(graduacoes, modalidadeId)?.nivel ?? null;
}

/**
 * Agrupa o histórico por modalidade. Cada grupo vem do mais recente para o mais antigo,
 * e os grupos vêm na ordem da graduação mais recente de cada um: quem acabou de ser
 * registrado aparece no topo da tela.
 */
export function montarLinhaDoTempo(
  graduacoes: Graduacao[],
  modalidades: Modalidade[],
  instrutores: Instrutor[],
): GrupoModalidade[] {
  const ordenadas = numerar(graduacoes).sort(maisRecentePrimeiro);
  const grupos = new Map<string, GrupoModalidade>();

  for (const g of ordenadas) {
    let grupo = grupos.get(g.modalidadeId);
    if (!grupo) {
      const modalidade = modalidades.find((m) => m.id === g.modalidadeId);
      grupo = {
        modalidadeId: g.modalidadeId,
        nome: modalidade?.nome ?? "Modalidade removida",
        cor: modalidade?.cor ?? "var(--muted)",
        nivelAtual: g.nivel,
        itens: [],
      };
      grupos.set(g.modalidadeId, grupo);
    }
    grupo.itens.push({
      chave: `${g.modalidadeId}-${g.ordem}`,
      nivel: g.nivel,
      data: g.data,
      avaliadorNome: instrutores.find((i) => i.id === g.avaliadorId)?.nome ?? null,
      atual: grupo.itens.length === 0,
    });
  }

  // O Map guarda a ordem de inserção, que já é a da graduação mais recente de cada grupo.
  return [...grupos.values()];
}

/* ======================================================================
 * Formulário "Registrar graduação"
 * ==================================================================== */

export const NIVEL_MAXIMO = 99;

/** Campos do formulário, como chegam dos inputs (tudo texto). */
export interface CamposGraduacao {
  modalidadeId: string;
  nivel: string;
  data: string;
  avaliadorId: string;
}

export const CAMPOS_GRADUACAO_VAZIOS: CamposGraduacao = { modalidadeId: "", nivel: "", data: "", avaliadorId: "" };

export type ErrosGraduacao = Partial<Record<keyof CamposGraduacao, string>>;

/** Data de hoje no fuso de quem chama, em AAAA-MM-DD. */
export function hojeIso(agora: Date = new Date()): string {
  const m = String(agora.getMonth() + 1).padStart(2, "0");
  const d = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${m}-${d}`;
}

function dataValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [a, m, d] = data.split("-").map(Number);
  const dt = new Date(a, m - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** Confere os campos. Objeto vazio = pode salvar. `hoje` em AAAA-MM-DD. */
export function validarGraduacao(campos: CamposGraduacao, hoje: string): ErrosGraduacao {
  const erros: ErrosGraduacao = {};
  if (!campos.modalidadeId) erros.modalidadeId = "Escolha a modalidade.";

  const nivel = Number(campos.nivel);
  if (!campos.nivel.trim()) erros.nivel = "Informe o nível.";
  else if (!Number.isInteger(nivel) || nivel < 1 || nivel > NIVEL_MAXIMO) {
    erros.nivel = `O nível é um número inteiro de 1 a ${NIVEL_MAXIMO}.`;
  }

  if (!campos.data) erros.data = "Informe a data do exame.";
  else if (!dataValida(campos.data)) erros.data = "Data inválida.";
  else if (campos.data > hoje) erros.data = "A data do exame não pode estar no futuro.";

  if (!campos.avaliadorId) erros.avaliadorId = "Escolha quem avaliou.";
  return erros;
}

export function temErrosGraduacao(erros: ErrosGraduacao): boolean {
  return Object.keys(erros).length > 0;
}

/**
 * Se o nível novo for menor que o atual da modalidade, devolve o atual (precisa confirmar).
 * Igual ou maior, ou sem nível anterior, devolve null.
 */
export function nivelAtualSeForRebaixamento(graduacoes: Graduacao[], campos: CamposGraduacao): number | null {
  const atual = nivelAtual(graduacoes, campos.modalidadeId);
  return atual !== null && Number(campos.nivel) < atual ? atual : null;
}

export function montarGraduacao(campos: CamposGraduacao): Graduacao {
  return {
    modalidadeId: campos.modalidadeId,
    nivel: Number(campos.nivel),
    data: campos.data,
    avaliadorId: campos.avaliadorId,
  };
}

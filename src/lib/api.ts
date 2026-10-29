/**
 * Camada de acesso a dados do Octa.
 *
 * Toda tela busca dados por aqui. A função `resolver` decide, em um único lugar,
 * se a resposta vem dos dados mockados (`mockData.ts`) ou do backend.
 *
 * Variáveis de ambiente (ver `.env.example`):
 *   NEXT_PUBLIC_DATA_SOURCE   "mock" (padrão) ou "api"
 *   NEXT_PUBLIC_API_URL       URL base do backend, ex.: http://localhost:8080/api
 *   NEXT_PUBLIC_MOCK_DELAY_MS atraso artificial no modo mock, para testar estados de carregamento (padrão 0)
 *
 * Quando um endpoint do backend ficar pronto antes dos outros, dá para ligá-lo sozinho
 * passando `fonte: "api"` na chamada, sem mudar a variável global.
 */
import * as mock from "@/lib/mockData";
import type {
  Aluno,
  AulasPorInstrutor,
  Caixa,
  Contrato,
  DiaSemana,
  Escola,
  EtapaFunil,
  IndicadoresInicio,
  Instrutor,
  Itinerancia,
  Lead,
  Modalidade,
  Parcela,
  Plano,
  PublicacaoFeed,
  SituacaoParcela,
  StatusAluno,
  Turma,
  Usuario,
} from "@/types";

/* ======================================================================
 * Configuração
 * ==================================================================== */

export type FonteDados = "mock" | "api";

export const FONTE_PADRAO: FonteDados =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const MOCK_DELAY_MS = Number(process.env.NEXT_PUBLIC_MOCK_DELAY_MS ?? 0) || 0;

type Primitivo = string | number | boolean;
type Params = Record<string, Primitivo | Primitivo[] | null | undefined>;

export interface ResolverOptions<T> {
  /** Caminho no backend, relativo a NEXT_PUBLIC_API_URL. Ex.: "/alunos" */
  endpoint: string;
  /** Valor devolvido no modo mock. Pode ser uma função, para filtrar ou montar a resposta. */
  mock: T | (() => T);
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Viram query string no modo API (valores nulos ou vazios são ignorados). */
  params?: Params;
  /** Corpo da requisição, enviado como JSON. */
  body?: unknown;
  /** Força a fonte só para esta chamada. Sem isso, vale NEXT_PUBLIC_DATA_SOURCE. */
  fonte?: FonteDados;
  /** Opções extras do fetch (headers, cache, next.revalidate, signal...). */
  init?: RequestInit;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
    public readonly detalhes?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ======================================================================
 * Resolver
 * ==================================================================== */

/**
 * Busca um recurso no mock ou no backend, conforme a fonte configurada.
 *
 * No modo mock, devolve uma cópia profunda do dado, para que nenhuma tela
 * altere o `mockData` por engano entre uma chamada e outra.
 */
export async function resolver<T>(opts: ResolverOptions<T>): Promise<T> {
  const fonte = opts.fonte ?? FONTE_PADRAO;
  return fonte === "mock" ? resolverMock(opts) : resolverApi(opts);
}

async function resolverMock<T>({ mock: valor }: ResolverOptions<T>): Promise<T> {
  if (MOCK_DELAY_MS > 0) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));
  }
  const dado = typeof valor === "function" ? (valor as () => T)() : valor;
  return structuredClone(dado);
}

async function resolverApi<T>({ endpoint, method = "GET", params, body, init }: ResolverOptions<T>): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "NEXT_PUBLIC_API_URL não está definida. Configure o .env.local ou use NEXT_PUBLIC_DATA_SOURCE=mock.",
      0,
      endpoint,
    );
  }

  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}${montarQuery(params)}`;

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      ...init,
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (erro) {
    throw new ApiError(`Não foi possível conectar ao backend em ${API_URL}.`, 0, endpoint, erro);
  }

  if (!resposta.ok) {
    const detalhes = await resposta.json().catch(() => undefined);
    throw new ApiError(`O backend respondeu ${resposta.status} em ${method} ${endpoint}.`, resposta.status, endpoint, detalhes);
  }

  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

function montarQuery(params?: Params): string {
  if (!params) return "";
  const busca = new URLSearchParams();
  for (const [chave, valor] of Object.entries(params)) {
    if (valor === undefined || valor === null || valor === "") continue;
    if (Array.isArray(valor)) valor.forEach((v) => busca.append(chave, String(v)));
    else busca.set(chave, String(valor));
  }
  const texto = busca.toString();
  return texto ? `?${texto}` : "";
}

/* ======================================================================
 * Utilitários do modo mock
 * ==================================================================== */

function porId<T extends { id: string }>(lista: T[], id: string, recurso: string): T {
  const item = lista.find((x) => x.id === id);
  if (!item) throw new ApiError(`${recurso} ${id} não encontrado.`, 404, `/${recurso}/${id}`);
  return item;
}

const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/* ======================================================================
 * Organização
 * ==================================================================== */

export const getEscolaAtual = () =>
  resolver<Escola>({
    endpoint: "/escolas/atual",
    mock: () => porId(mock.escolas, mock.escolaAtualId, "escolas"),
  });

export const getEscolas = () => resolver<Escola[]>({ endpoint: "/escolas", mock: mock.escolas });

export const getUsuarioAtual = () =>
  resolver<Usuario>({
    endpoint: "/usuarios/me",
    mock: () => porId(mock.usuarios, mock.usuarioAtualId, "usuarios"),
  });

/* ======================================================================
 * Cadastros base
 * ==================================================================== */

export const getModalidades = () => resolver<Modalidade[]>({ endpoint: "/modalidades", mock: mock.modalidades });

export const getPlanos = () =>
  resolver<Plano[]>({ endpoint: "/planos", mock: () => mock.planos.filter((p) => p.ativo) });

export const getInstrutores = () => resolver<Instrutor[]>({ endpoint: "/instrutores", mock: mock.instrutores });

export const getMotivosEncerramento = () =>
  resolver<string[]>({ endpoint: "/motivos-encerramento", mock: mock.motivosEncerramento });

/* ======================================================================
 * Alunos
 * ==================================================================== */

export interface FiltroAlunos {
  status?: StatusAluno;
  modalidadeId?: string;
  turmaId?: string;
  /** Nome, CPF ou telefone. */
  busca?: string;
}

export const getAlunos = (filtro: FiltroAlunos = {}) =>
  resolver<Aluno[]>({
    endpoint: "/alunos",
    params: { ...filtro },
    mock: () => {
      const termo = filtro.busca ? normalizar(filtro.busca) : "";
      const digitos = filtro.busca?.replace(/\D/g, "") ?? "";
      return mock.alunos.filter(
        (a) =>
          (!filtro.status || a.status === filtro.status) &&
          (!filtro.modalidadeId || a.modalidadeIds.includes(filtro.modalidadeId)) &&
          (!filtro.turmaId || a.turmaIds.includes(filtro.turmaId)) &&
          (!termo ||
            normalizar(a.nome).includes(termo) ||
            (digitos.length >= 3 && a.telefone.replace(/\D/g, "").includes(digitos))),
      );
    },
  });

export const getAluno = (id: string) =>
  resolver<Aluno>({ endpoint: `/alunos/${id}`, mock: () => porId(mock.alunos, id, "alunos") });

/* ======================================================================
 * Turmas
 * ==================================================================== */

export interface FiltroTurmas {
  modalidadeId?: string;
  diaSemana?: DiaSemana;
  instrutorId?: string;
}

export const getTurmas = (filtro: FiltroTurmas = {}) =>
  resolver<Turma[]>({
    endpoint: "/turmas",
    params: { ...filtro },
    mock: () =>
      mock.turmas
        .filter(
          (t) =>
            (!filtro.modalidadeId || t.modalidadeId === filtro.modalidadeId) &&
            (filtro.diaSemana === undefined || t.diaSemana === filtro.diaSemana) &&
            (!filtro.instrutorId || t.instrutorId === filtro.instrutorId),
        )
        .sort((a, b) => a.diaSemana - b.diaSemana || a.horario.localeCompare(b.horario)),
  });

export const getTurma = (id: string) =>
  resolver<Turma>({ endpoint: `/turmas/${id}`, mock: () => porId(mock.turmas, id, "turmas") });

/* ======================================================================
 * Contratos
 * ==================================================================== */

export const getContratos = (alunoId?: string) =>
  resolver<Contrato[]>({
    endpoint: "/contratos",
    params: { alunoId },
    mock: () => mock.contratos.filter((c) => !alunoId || c.alunoId === alunoId),
  });

export const getContrato = (id: string) =>
  resolver<Contrato>({ endpoint: `/contratos/${id}`, mock: () => porId(mock.contratos, id, "contratos") });

/* ======================================================================
 * Financeiro
 * ==================================================================== */

export interface FiltroParcelas {
  alunoId?: string;
  situacao?: SituacaoParcela;
  /** AAAA-MM-DD */
  de?: string;
  ate?: string;
}

export const getParcelas = (filtro: FiltroParcelas = {}) =>
  resolver<Parcela[]>({
    endpoint: "/parcelas",
    params: { ...filtro },
    mock: () =>
      mock.parcelas
        .filter(
          (p) =>
            (!filtro.alunoId || p.alunoId === filtro.alunoId) &&
            (!filtro.situacao || p.situacao === filtro.situacao) &&
            (!filtro.de || p.vencimento >= filtro.de) &&
            (!filtro.ate || p.vencimento <= filtro.ate),
        )
        .sort((a, b) => a.vencimento.localeCompare(b.vencimento)),
  });

export const getCaixaDoDia = () => resolver<Caixa>({ endpoint: "/caixa/hoje", mock: mock.caixaDoDia });

export const getAulasPorInstrutor = (de?: string, ate?: string) =>
  resolver<AulasPorInstrutor[]>({
    endpoint: "/relatorios/aulas-por-instrutor",
    params: { de, ate },
    mock: mock.aulasPorInstrutor,
  });

/* ======================================================================
 * CRM
 * ==================================================================== */

export const getEtapasFunil = () =>
  resolver<{ id: EtapaFunil; nome: string }[]>({ endpoint: "/crm/etapas", mock: mock.etapasFunil });

export const getMotivosPerda = () => resolver<string[]>({ endpoint: "/crm/motivos-perda", mock: mock.motivosPerda });

export const getLeads = (etapa?: EtapaFunil) =>
  resolver<Lead[]>({
    endpoint: "/crm/leads",
    params: { etapa },
    mock: () => mock.leads.filter((l) => !etapa || l.etapa === etapa),
  });

/* ======================================================================
 * Início, feed e itinerâncias
 * ==================================================================== */

export const getIndicadoresInicio = () =>
  resolver<IndicadoresInicio>({ endpoint: "/inicio/indicadores", mock: mock.indicadoresInicio });

export const getFeed = () =>
  resolver<PublicacaoFeed[]>({
    endpoint: "/feed",
    mock: () => [...mock.feed].sort((a, b) => a.data.localeCompare(b.data)),
  });

export const getItinerancias = () => resolver<Itinerancia[]>({ endpoint: "/itinerancias", mock: mock.itinerancias });

/**
 * Tipos do domínio do Octa.
 * Datas sempre em ISO 8601 (AAAA-MM-DD ou AAAA-MM-DDTHH:mm:ss) e valores em reais (number).
 * O backend deve devolver os mesmos formatos para que a troca mock -> API seja transparente.
 */

export type Id = string;

/* ---------- Organização ---------- */

export interface Escola {
  id: Id;
  nome: string;
  cidade: string;
  uf: string;
  federacaoId: Id;
}

export type PerfilAcesso = "dono" | "gestor" | "instrutor" | "recepcao";

export interface Usuario {
  id: Id;
  nome: string;
  email: string;
  perfil: PerfilAcesso;
  escolaId: Id;
}

/* ---------- Oferta ---------- */

export type ModalidadeNome =
  | "Arte Marcial"
  | "Arqueria"
  | "Acrobacia"
  | "Armas de Corte"
  | "Tai Chi"
  | "Sintonia"
  | "Pa-Kua Ritmo"
  | "Pa-Kua Chi";

export interface Modalidade {
  id: Id;
  nome: ModalidadeNome;
  /** Cor usada em turmas, chips e etiquetas. */
  cor: string;
  usaGraduacao: boolean;
}

export type Vigencia = "mensal" | "semestral" | "anual";

export interface Plano {
  id: Id;
  nome: string;
  valorMensal: number;
  /** Quantidade de modalidades que o plano permite. 8 = livre. */
  quantidadeModalidades: number;
  aulasPorSemana: number | null;
  vigencia: Vigencia;
  ativo: boolean;
}

export interface Instrutor {
  id: Id;
  nome: string;
  titulo: "Mestre" | "Instrutor";
  modalidadeIds: Id[];
}

/** 0 = segunda ... 5 = sábado */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5;

export interface Turma {
  id: Id;
  modalidadeId: Id;
  diaSemana: DiaSemana;
  horario: string; // "19:00"
  duracaoMinutos: number;
  capacidade: number;
  ocupacao: number;
  instrutorId: Id;
  sala: string;
}

/* ---------- Pessoas ---------- */

export type StatusAluno = "em_dia" | "atraso" | "experimental" | "trancado" | "inativo";
export type Genero = "Feminino" | "Masculino" | "Outro" | "Não declarado";

export interface Graduacao {
  modalidadeId: Id;
  nivel: number;
  data: string;
  avaliadorId: Id | null;
}

export interface Aluno {
  id: Id;
  nome: string;
  dataNascimento: string;
  genero: Genero;
  /** CPF do aluno ou, para menores, do responsável. Já mascarado no mock. */
  cpf: string | null;
  telefone: string;
  email: string | null;
  status: StatusAluno;
  verificado: boolean;
  alunoDesde: string;
  escolaIds: Id[];
  modalidadeIds: Id[];
  turmaIds: Id[];
  contratoAtivoId: Id | null;
  valorEmAtraso: number;
  creditos: number;
  graduacoes: Graduacao[];
  observacoes: string;
  responsavel?: { nome: string; telefone: string };
}

/** Dados do cadastro rápido (ALUNOS-03). Só nome e telefone são obrigatórios. */
export interface NovoAluno {
  nome: string;
  telefone: string;
  /** AAAA-MM-DD ou vazio, quando não informado. */
  dataNascimento: string;
  /** Modalidade de interesse, ou vazio. */
  modalidadeId: string;
  /** Só números, ou vazio. */
  cpf: string;
  /** Obrigatório para menores de 18 anos. */
  responsavel?: { nome: string; telefone: string };
}

/* ---------- Acordo ---------- */

export type StatusContrato = "ativo" | "trancado" | "encerrado";
export type FormaPagamento = "cartao_recorrente" | "pix" | "dinheiro" | "maquininha";

export interface VersaoContrato {
  versao: number;
  data: string;
  descricao: string;
  planoId: Id;
  valorMensal: number;
}

export interface Contrato {
  id: Id;
  numero: string;
  alunoId: Id;
  planoId: Id;
  modalidadeIds: Id[];
  /** Valor travado no momento da contratação ou do último aditivo. */
  valorMensal: number;
  diaVencimento: number;
  inicio: string;
  fim: string | null;
  status: StatusContrato;
  formaPagamento: FormaPagamento;
  versoes: VersaoContrato[];
}

/* ---------- Dinheiro ---------- */

export type SituacaoParcela = "paga" | "a_vencer" | "atrasada" | "cancelada";

export interface Parcela {
  id: Id;
  contratoId: Id;
  alunoId: Id;
  descricao: string;
  vencimento: string;
  valor: number;
  situacao: SituacaoParcela;
  formaPagamento: FormaPagamento;
  pagaEm: string | null;
}

export interface LancamentoCaixa {
  formaPagamento: FormaPagamento;
  quantidade: number;
  valor: number;
  baixaAutomatica: boolean;
}

export interface Caixa {
  id: Id;
  data: string;
  abertoEm: string;
  abertoPor: Id;
  status: "aberto" | "fechado";
  lancamentos: LancamentoCaixa[];
  dinheiroContado: number | null;
  justificativaDiferenca: string | null;
  fechadoEm: string | null;
}

export interface AulasPorInstrutor {
  instrutorId: Id;
  previstas: number;
  comoSubstituto: number;
  substituido: number;
}

/* ---------- Captação ---------- */

export type EtapaFunil =
  | "novo"
  | "contato_feito"
  | "aula_experimental"
  | "negociando"
  | "matriculado"
  | "nao_matriculou";

export type OrigemLead = "instagram" | "whatsapp" | "site";

export interface InteracaoLead {
  data: string;
  tipo: "entrada" | "mensagem" | "ligacao" | "experimental" | "nota";
  descricao: string;
  usuarioId: Id | null;
}

export interface Lead {
  id: Id;
  nome: string;
  telefone: string;
  origem: OrigemLead;
  etapa: EtapaFunil;
  modalidadeInteresseId: Id;
  criadoEm: string;
  atualizadoEm: string;
  motivoPerda: string | null;
  interacoes: InteracaoLead[];
}

/* ---------- Comunicação e federação ---------- */

export type TipoPublicacao = "noticia" | "aviso" | "evento" | "feriado" | "itinerancia";

export interface PublicacaoFeed {
  id: Id;
  tipo: TipoPublicacao;
  titulo: string;
  texto: string;
  data: string;
  autorId: Id;
}

export interface Itinerancia {
  id: Id;
  titulo: string;
  ministranteNome: string;
  escolaAnfitriaId: Id;
  modalidadeId: Id;
  data: string;
  valorInscricao: number;
  inscritos: number;
  vagas: number;
  split: { escola: number; ministrante: number; federacao: number };
}

/* ---------- Início ---------- */

export interface IndicadoresInicio {
  matriculasAtivas: number;
  novasMatriculasMes: number;
  trancadas: number;
  presencaHoje: number;
  capacidadeHoje: number;
  recebidoMes: number;
  previstoMes: number;
  valorEmAtraso: number;
  alunosEmAtraso: number;
  leadsNovos: number;
}

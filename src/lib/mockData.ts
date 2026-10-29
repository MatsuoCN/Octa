/**
 * Dados mockados do Octa.
 *
 * Tudo aqui é fictício. Serve para desenvolver as telas enquanto o backend não existe.
 * O formato de cada objeto segue os tipos em `@/types`, que é o mesmo contrato esperado do backend.
 *
 * Não importe este arquivo direto nas telas: use as funções de `@/lib/api`,
 * que decidem entre mock e backend.
 */
import type {
  Aluno,
  AulasPorInstrutor,
  Caixa,
  Contrato,
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
  Turma,
  Usuario,
} from "@/types";

/** Data de referência dos mocks. Mantém os dados coerentes entre si (vencimentos, atrasos). */
export const DATA_REFERENCIA = "2026-10-08";

/* ---------- Organização ---------- */

export const escolas: Escola[] = [
  { id: "esc-montese", nome: "Pa-Kua Montese", cidade: "Fortaleza", uf: "CE", federacaoId: "fed-br" },
  { id: "esc-meireles", nome: "Pa-Kua Meireles", cidade: "Fortaleza", uf: "CE", federacaoId: "fed-br" },
  { id: "esc-aldeota", nome: "Pa-Kua Aldeota", cidade: "Fortaleza", uf: "CE", federacaoId: "fed-br" },
  { id: "esc-fatima", nome: "Pa-Kua Fátima", cidade: "Fortaleza", uf: "CE", federacaoId: "fed-br" },
  { id: "esc-nova-parnamirim", nome: "Pa-Kua Nova Parnamirim", cidade: "Parnamirim", uf: "RN", federacaoId: "fed-br" },
  { id: "esc-jacarey", nome: "Pa-Kua Jacarey", cidade: "Fortaleza", uf: "CE", federacaoId: "fed-br" },
  { id: "esc-joao-pessoa", nome: "Pa-Kua João Pessoa", cidade: "João Pessoa", uf: "PB", federacaoId: "fed-br" },
];

export const escolaAtualId = "esc-montese";

export const usuarios: Usuario[] = [
  { id: "usr-rafael", nome: "Rafael Lima", email: "rafael@pakua-montese.com.br", perfil: "dono", escolaId: "esc-montese" },
  { id: "usr-julia", nome: "Júlia Prado", email: "julia@pakua-montese.com.br", perfil: "instrutor", escolaId: "esc-montese" },
  { id: "usr-recepcao", nome: "Lívia Torres", email: "recepcao@pakua-montese.com.br", perfil: "recepcao", escolaId: "esc-montese" },
];

export const usuarioAtualId = "usr-rafael";

/* ---------- Oferta ---------- */

export const modalidades: Modalidade[] = [
  { id: "mod-arte-marcial", nome: "Arte Marcial", cor: "#A51F24", usaGraduacao: true },
  { id: "mod-arqueria", nome: "Arqueria", cor: "#B9832F", usaGraduacao: true },
  { id: "mod-acrobacia", nome: "Acrobacia", cor: "#C2571A", usaGraduacao: true },
  { id: "mod-armas-de-corte", nome: "Armas de Corte", cor: "#4A4442", usaGraduacao: true },
  { id: "mod-tai-chi", nome: "Tai Chi", cor: "#2E6B4B", usaGraduacao: true },
  { id: "mod-sintonia", nome: "Sintonia", cor: "#6B4FA0", usaGraduacao: true },
  { id: "mod-ritmo", nome: "Pa-Kua Ritmo", cor: "#C23A73", usaGraduacao: true },
  { id: "mod-chi", nome: "Pa-Kua Chi", cor: "#2F6A8F", usaGraduacao: true },
];

export const planos: Plano[] = [
  { id: "pln-1mod", nome: "1 modalidade · 2x por semana", valorMensal: 220, quantidadeModalidades: 1, aulasPorSemana: 2, vigencia: "mensal", ativo: true },
  { id: "pln-2mod", nome: "2 modalidades · 4x por semana", valorMensal: 320, quantidadeModalidades: 2, aulasPorSemana: 4, vigencia: "mensal", ativo: true },
  { id: "pln-livre", nome: "Livre · todas as modalidades", valorMensal: 420, quantidadeModalidades: 8, aulasPorSemana: null, vigencia: "mensal", ativo: true },
  { id: "pln-anual-1mod", nome: "Anual · 1 modalidade (12x)", valorMensal: 198, quantidadeModalidades: 1, aulasPorSemana: 2, vigencia: "anual", ativo: true },
  { id: "pln-anual-2mod", nome: "Anual · 2 modalidades (12x)", valorMensal: 288, quantidadeModalidades: 2, aulasPorSemana: 4, vigencia: "anual", ativo: true },
];

export const instrutores: Instrutor[] = [
  { id: "ins-rafael", nome: "Rafael Lima", titulo: "Instrutor", modalidadeIds: ["mod-arte-marcial", "mod-armas-de-corte"] },
  { id: "ins-julia", nome: "Júlia Prado", titulo: "Instrutor", modalidadeIds: ["mod-acrobacia", "mod-sintonia", "mod-ritmo"] },
  { id: "ins-henrique", nome: "Henrique Sales", titulo: "Mestre", modalidadeIds: ["mod-tai-chi", "mod-chi", "mod-armas-de-corte"] },
  { id: "ins-caio", nome: "Caio Nogueira", titulo: "Instrutor", modalidadeIds: ["mod-arqueria"] },
];

export const turmas: Turma[] = [
  { id: "tur-01", modalidadeId: "mod-arte-marcial", diaSemana: 0, horario: "07:00", duracaoMinutos: 60, capacidade: 20, ocupacao: 14, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-02", modalidadeId: "mod-tai-chi", diaSemana: 0, horario: "08:30", duracaoMinutos: 60, capacidade: 16, ocupacao: 11, instrutorId: "ins-henrique", sala: "Sala 2" },
  { id: "tur-03", modalidadeId: "mod-acrobacia", diaSemana: 0, horario: "18:00", duracaoMinutos: 60, capacidade: 14, ocupacao: 14, instrutorId: "ins-julia", sala: "Tatame 1" },
  { id: "tur-04", modalidadeId: "mod-arte-marcial", diaSemana: 0, horario: "19:00", duracaoMinutos: 60, capacidade: 24, ocupacao: 21, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-05", modalidadeId: "mod-sintonia", diaSemana: 1, horario: "07:00", duracaoMinutos: 60, capacidade: 16, ocupacao: 8, instrutorId: "ins-julia", sala: "Sala 2" },
  { id: "tur-06", modalidadeId: "mod-arqueria", diaSemana: 1, horario: "18:00", duracaoMinutos: 60, capacidade: 10, ocupacao: 9, instrutorId: "ins-caio", sala: "Pátio" },
  { id: "tur-07", modalidadeId: "mod-armas-de-corte", diaSemana: 1, horario: "19:00", duracaoMinutos: 60, capacidade: 16, ocupacao: 12, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-08", modalidadeId: "mod-ritmo", diaSemana: 1, horario: "20:00", duracaoMinutos: 60, capacidade: 18, ocupacao: 10, instrutorId: "ins-julia", sala: "Sala 2" },
  { id: "tur-09", modalidadeId: "mod-arte-marcial", diaSemana: 2, horario: "07:00", duracaoMinutos: 60, capacidade: 20, ocupacao: 13, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-10", modalidadeId: "mod-tai-chi", diaSemana: 2, horario: "08:30", duracaoMinutos: 60, capacidade: 16, ocupacao: 12, instrutorId: "ins-henrique", sala: "Sala 2" },
  { id: "tur-11", modalidadeId: "mod-acrobacia", diaSemana: 2, horario: "18:00", duracaoMinutos: 60, capacidade: 14, ocupacao: 12, instrutorId: "ins-julia", sala: "Tatame 1" },
  { id: "tur-12", modalidadeId: "mod-arte-marcial", diaSemana: 2, horario: "19:00", duracaoMinutos: 60, capacidade: 24, ocupacao: 22, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-13", modalidadeId: "mod-chi", diaSemana: 3, horario: "08:30", duracaoMinutos: 60, capacidade: 12, ocupacao: 7, instrutorId: "ins-henrique", sala: "Sala 2" },
  { id: "tur-14", modalidadeId: "mod-arqueria", diaSemana: 3, horario: "18:00", duracaoMinutos: 60, capacidade: 10, ocupacao: 10, instrutorId: "ins-caio", sala: "Pátio" },
  { id: "tur-15", modalidadeId: "mod-arte-marcial", diaSemana: 3, horario: "19:00", duracaoMinutos: 60, capacidade: 24, ocupacao: 19, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-16", modalidadeId: "mod-sintonia", diaSemana: 3, horario: "20:00", duracaoMinutos: 60, capacidade: 16, ocupacao: 9, instrutorId: "ins-julia", sala: "Sala 2" },
  { id: "tur-17", modalidadeId: "mod-tai-chi", diaSemana: 4, horario: "08:30", duracaoMinutos: 60, capacidade: 16, ocupacao: 10, instrutorId: "ins-henrique", sala: "Sala 2" },
  { id: "tur-18", modalidadeId: "mod-ritmo", diaSemana: 4, horario: "18:00", duracaoMinutos: 60, capacidade: 18, ocupacao: 15, instrutorId: "ins-julia", sala: "Sala 2" },
  { id: "tur-19", modalidadeId: "mod-armas-de-corte", diaSemana: 4, horario: "19:00", duracaoMinutos: 60, capacidade: 16, ocupacao: 13, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-20", modalidadeId: "mod-arte-marcial", diaSemana: 5, horario: "09:00", duracaoMinutos: 90, capacidade: 30, ocupacao: 26, instrutorId: "ins-rafael", sala: "Tatame 1" },
  { id: "tur-21", modalidadeId: "mod-acrobacia", diaSemana: 5, horario: "10:30", duracaoMinutos: 60, capacidade: 14, ocupacao: 9, instrutorId: "ins-julia", sala: "Tatame 1" },
];

/* ---------- Alunos ---------- */

export const alunos: Aluno[] = [
  {
    id: "alu-01", nome: "Ana Beatriz Costa", dataNascimento: "1998-02-14", genero: "Feminino", cpf: "***.482.113-**",
    telefone: "(85) 98812-4471", email: "ana.b@email.com", status: "em_dia", verificado: true, alunoDesde: "2023-03-25",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-arte-marcial", "mod-armas-de-corte"], turmaIds: ["tur-15", "tur-07"],
    contratoAtivoId: "ctr-01", valorEmAtraso: 0, creditos: 40,
    graduacoes: [{ modalidadeId: "mod-arte-marcial", nivel: 4, data: "2026-06-14", avaliadorId: "ins-henrique" }],
    observacoes: "Prefere contato por WhatsApp à noite. Interesse em Arqueria a partir de 2027.",
  },
  {
    id: "alu-02", nome: "Bruno Henrique Alves", dataNascimento: "1992-07-03", genero: "Masculino", cpf: "***.903.557-**",
    telefone: "(85) 99701-2290", email: "bruno.alves@email.com", status: "atraso", verificado: true, alunoDesde: "2024-08-05",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-arte-marcial"], turmaIds: ["tur-15"],
    contratoAtivoId: "ctr-02", valorEmAtraso: 440, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-arte-marcial", nivel: 2, data: "2025-12-10", avaliadorId: "ins-rafael" }],
    observacoes: "",
  },
  {
    id: "alu-03", nome: "Camila Rocha", dataNascimento: "1985-04-22", genero: "Feminino", cpf: "***.118.240-**",
    telefone: "(85) 98120-7765", email: "camila.rocha@email.com", status: "em_dia", verificado: true, alunoDesde: "2022-01-10",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-tai-chi", "mod-sintonia"], turmaIds: ["tur-02", "tur-05"],
    contratoAtivoId: "ctr-03", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-tai-chi", nivel: 5, data: "2026-06-14", avaliadorId: "ins-henrique" }],
    observacoes: "",
  },
  {
    id: "alu-04", nome: "Davi Martins", dataNascimento: "2014-05-30", genero: "Masculino", cpf: "Resp.: ***.661.902-**",
    telefone: "(85) 98444-0193", email: null, status: "em_dia", verificado: false, alunoDesde: "2025-02-15",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-acrobacia", "mod-arte-marcial"], turmaIds: ["tur-03", "tur-20"],
    contratoAtivoId: "ctr-04", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-acrobacia", nivel: 1, data: "2025-12-10", avaliadorId: "ins-julia" }],
    observacoes: "Menor de idade. Autorização de imagem assinada.",
    responsavel: { nome: "Patrícia Martins", telefone: "(85) 98444-0193" },
  },
  {
    id: "alu-05", nome: "Eduarda Lins", dataNascimento: "2007-09-11", genero: "Feminino", cpf: null,
    telefone: "(85) 99233-8810", email: "eduarda.lins@email.com", status: "experimental", verificado: false, alunoDesde: "2026-10-06",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-arqueria"], turmaIds: ["tur-14"],
    contratoAtivoId: null, valorEmAtraso: 0, creditos: 0, graduacoes: [],
    observacoes: "Veio pelo Instagram. Aula experimental na quinta às 18:00.",
  },
  {
    id: "alu-06", nome: "Felipe Sampaio", dataNascimento: "1989-01-17", genero: "Masculino", cpf: "***.370.884-**",
    telefone: "(85) 98765-1002", email: "felipe.sampaio@email.com", status: "em_dia", verificado: true, alunoDesde: "2021-06-20",
    escolaIds: ["esc-montese", "esc-meireles"], modalidadeIds: ["mod-arqueria", "mod-armas-de-corte"], turmaIds: ["tur-14", "tur-19"],
    contratoAtivoId: "ctr-06", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-arqueria", nivel: 6, data: "2026-06-14", avaliadorId: "ins-caio" }],
    observacoes: "Também treina no Meireles aos sábados.",
  },
  {
    id: "alu-07", nome: "Gabriela Teixeira", dataNascimento: "2001-03-08", genero: "Feminino", cpf: "***.215.009-**",
    telefone: "(85) 99112-6634", email: "gabi.teixeira@email.com", status: "atraso", verificado: true, alunoDesde: "2025-04-01",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-ritmo"], turmaIds: ["tur-08"],
    contratoAtivoId: "ctr-07", valorEmAtraso: 220, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-ritmo", nivel: 1, data: "2025-12-10", avaliadorId: "ins-julia" }],
    observacoes: "",
  },
  {
    id: "alu-08", nome: "Heitor Barbosa", dataNascimento: "2017-08-25", genero: "Masculino", cpf: "Resp.: ***.774.120-**",
    telefone: "(85) 98303-5520", email: null, status: "em_dia", verificado: true, alunoDesde: "2026-03-10",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-arte-marcial"], turmaIds: ["tur-20"],
    contratoAtivoId: "ctr-08", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-arte-marcial", nivel: 1, data: "2026-06-14", avaliadorId: "ins-rafael" }],
    observacoes: "",
    responsavel: { nome: "Marcelo Barbosa", telefone: "(85) 98303-5520" },
  },
  {
    id: "alu-09", nome: "Isabela Furtado", dataNascimento: "1974-11-02", genero: "Feminino", cpf: "***.006.431-**",
    telefone: "(85) 98990-4411", email: "isabela.furtado@email.com", status: "em_dia", verificado: true, alunoDesde: "2020-09-05",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-tai-chi", "mod-chi"], turmaIds: ["tur-10", "tur-13"],
    contratoAtivoId: "ctr-09", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-tai-chi", nivel: 7, data: "2026-06-14", avaliadorId: "ins-henrique" }],
    observacoes: "",
  },
  {
    id: "alu-10", nome: "João Pedro Moura", dataNascimento: "2010-06-19", genero: "Masculino", cpf: "***.552.810-**",
    telefone: "(85) 98561-3378", email: "jp.moura@email.com", status: "trancado", verificado: true, alunoDesde: "2024-05-15",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-acrobacia"], turmaIds: [],
    contratoAtivoId: "ctr-10", valorEmAtraso: 0, creditos: 110,
    graduacoes: [{ modalidadeId: "mod-acrobacia", nivel: 2, data: "2025-06-14", avaliadorId: "ins-julia" }],
    observacoes: "Trancado até 30/11/2026 por lesão no punho.",
    responsavel: { nome: "Cláudia Moura", telefone: "(85) 98561-3300" },
  },
  {
    id: "alu-11", nome: "Larissa Queiroz", dataNascimento: "1996-12-01", genero: "Feminino", cpf: "***.839.276-**",
    telefone: "(85) 99654-2207", email: "larissa.q@email.com", status: "em_dia", verificado: true, alunoDesde: "2025-11-20",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-sintonia"], turmaIds: ["tur-16"],
    contratoAtivoId: "ctr-11", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-sintonia", nivel: 1, data: "2026-06-14", avaliadorId: "ins-julia" }],
    observacoes: "",
  },
  {
    id: "alu-12", nome: "Marcos Vinícius Dias", dataNascimento: "1981-02-27", genero: "Masculino", cpf: "***.471.355-**",
    telefone: "(85) 98221-9013", email: "marcos.dias@email.com", status: "atraso", verificado: true, alunoDesde: "2023-02-01",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-armas-de-corte", "mod-arte-marcial"], turmaIds: ["tur-07", "tur-15"],
    contratoAtivoId: "ctr-12", valorEmAtraso: 320, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-armas-de-corte", nivel: 3, data: "2025-12-10", avaliadorId: "ins-henrique" }],
    observacoes: "",
  },
  {
    id: "alu-13", nome: "Natália Freire", dataNascimento: "2003-07-15", genero: "Não declarado", cpf: null,
    telefone: "(85) 99876-5541", email: "natalia.freire@email.com", status: "experimental", verificado: false, alunoDesde: "2026-10-07",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-acrobacia"], turmaIds: ["tur-21"],
    contratoAtivoId: null, valorEmAtraso: 0, creditos: 0, graduacoes: [],
    observacoes: "Aula experimental no sábado às 10:30.",
  },
  {
    id: "alu-14", nome: "Otávio Lacerda", dataNascimento: "1968-03-12", genero: "Masculino", cpf: "***.660.198-**",
    telefone: "(85) 98004-7790", email: "otavio.lacerda@email.com", status: "em_dia", verificado: true, alunoDesde: "2022-07-25",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-chi"], turmaIds: ["tur-13"],
    contratoAtivoId: "ctr-14", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-chi", nivel: 3, data: "2026-06-14", avaliadorId: "ins-henrique" }],
    observacoes: "",
  },
  {
    id: "alu-15", nome: "Paula Regina Sousa", dataNascimento: "1990-10-09", genero: "Feminino", cpf: "***.127.503-**",
    telefone: "(85) 98313-0026", email: "paula.sousa@email.com", status: "em_dia", verificado: true, alunoDesde: "2019-10-15",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-arte-marcial", "mod-arqueria"], turmaIds: ["tur-15", "tur-06"],
    contratoAtivoId: "ctr-15", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-arte-marcial", nivel: 8, data: "2026-06-14", avaliadorId: "ins-henrique" }],
    observacoes: "Auxilia nas aulas infantis de sábado.",
  },
  {
    id: "alu-16", nome: "Rodrigo Viana", dataNascimento: "1999-05-04", genero: "Masculino", cpf: "***.904.718-**",
    telefone: "(85) 99440-1182", email: "rodrigo.viana@email.com", status: "em_dia", verificado: true, alunoDesde: "2026-01-10",
    escolaIds: ["esc-montese"], modalidadeIds: ["mod-ritmo", "mod-acrobacia"], turmaIds: ["tur-08", "tur-11"],
    contratoAtivoId: "ctr-16", valorEmAtraso: 0, creditos: 0,
    graduacoes: [{ modalidadeId: "mod-ritmo", nivel: 1, data: "2026-06-14", avaliadorId: "ins-julia" }],
    observacoes: "",
  },
];

/* ---------- Contratos ---------- */

type BaseContrato = [alunoId: string, planoId: string, diaVencimento: number, inicio: string, forma: Contrato["formaPagamento"]];

const basesContrato: BaseContrato[] = [
  ["alu-01", "pln-2mod", 25, "2023-03-25", "cartao_recorrente"],
  ["alu-02", "pln-1mod", 5, "2024-08-05", "cartao_recorrente"],
  ["alu-03", "pln-anual-2mod", 10, "2026-01-10", "cartao_recorrente"],
  ["alu-04", "pln-2mod", 15, "2025-02-15", "pix"],
  ["alu-06", "pln-2mod", 20, "2021-06-20", "cartao_recorrente"],
  ["alu-07", "pln-1mod", 1, "2025-04-01", "pix"],
  ["alu-08", "pln-anual-1mod", 10, "2026-03-10", "cartao_recorrente"],
  ["alu-09", "pln-2mod", 5, "2020-09-05", "cartao_recorrente"],
  ["alu-10", "pln-1mod", 15, "2024-05-15", "pix"],
  ["alu-11", "pln-1mod", 20, "2025-11-20", "cartao_recorrente"],
  ["alu-12", "pln-2mod", 1, "2023-02-01", "pix"],
  ["alu-14", "pln-1mod", 25, "2022-07-25", "cartao_recorrente"],
  ["alu-15", "pln-livre", 15, "2019-10-15", "cartao_recorrente"],
  ["alu-16", "pln-2mod", 10, "2026-01-10", "cartao_recorrente"],
];

function anoMais(dataIso: string, anos: number): string {
  const [a, m, d] = dataIso.split("-");
  return `${Number(a) + anos}-${m}-${d}`;
}

export const contratos: Contrato[] = basesContrato.map(([alunoId, planoId, diaVencimento, inicio, formaPagamento]) => {
  const plano = planos.find((p) => p.id === planoId)!;
  const aluno = alunos.find((a) => a.id === alunoId)!;
  const numero = alunoId.replace("alu-", "");
  const versoes: Contrato["versoes"] =
    alunoId === "alu-01"
      ? [
          { versao: 2, data: "2026-03-25", descricao: "Inclusão de Armas de Corte (upgrade proporcional R$ 56,67)", planoId: "pln-2mod", valorMensal: 320 },
          { versao: 1, data: "2023-03-25", descricao: "Contrato inicial · 1 modalidade", planoId: "pln-1mod", valorMensal: 220 },
        ]
      : [{ versao: 1, data: inicio, descricao: "Contrato inicial", planoId, valorMensal: plano.valorMensal }];

  return {
    id: `ctr-${numero}`,
    numero: `${inicio.slice(0, 4)}-${numero.padStart(4, "0")}`,
    alunoId,
    planoId,
    modalidadeIds: aluno.modalidadeIds,
    valorMensal: plano.valorMensal,
    diaVencimento,
    inicio,
    fim: plano.vigencia === "anual" ? anoMais(inicio, 1) : null,
    status: aluno.status === "trancado" ? "trancado" : "ativo",
    formaPagamento,
    versoes,
  };
});

/* ---------- Parcelas ---------- */

function dataVencimento(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/**
 * Parcelas de agosto a novembro de 2026 para cada contrato.
 * Regras do mock: alunos com status "atraso" têm a(s) última(s) parcela(s) vencida(s) em aberto,
 * somando o `valorEmAtraso` do aluno. Vencimentos até a data de referência estão pagos.
 */
export const parcelas: Parcela[] = contratos.flatMap((c) => {
  const aluno = alunos.find((a) => a.id === c.alunoId)!;
  const meses = [8, 9, 10, 11];
  let emAtrasoRestante = aluno.valorEmAtraso;
  const venceuAteHoje = (iso: string) => iso <= DATA_REFERENCIA;

  // percorre do mais recente para o mais antigo para marcar as atrasadas
  const lista = [...meses].reverse().map((mes): Parcela => {
    const vencimento = dataVencimento(2026, mes, c.diaVencimento);
    let situacao: Parcela["situacao"] = venceuAteHoje(vencimento) ? "paga" : "a_vencer";
    if (venceuAteHoje(vencimento) && emAtrasoRestante > 0) {
      situacao = "atrasada";
      emAtrasoRestante -= c.valorMensal;
    }
    if (c.status === "trancado" && mes >= 10) situacao = "cancelada";
    return {
      id: `par-${c.id.replace("ctr-", "")}-${mes}`,
      contratoId: c.id,
      alunoId: c.alunoId,
      descricao: `Mensalidade ${["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][mes]}/26`,
      vencimento,
      valor: c.valorMensal,
      situacao,
      formaPagamento: c.formaPagamento,
      pagaEm: situacao === "paga" ? vencimento : null,
    };
  });
  return lista.reverse();
});

/* ---------- Caixa e repasse ---------- */

export const caixaDoDia: Caixa = {
  id: "cx-2026-10-08",
  data: DATA_REFERENCIA,
  abertoEm: `${DATA_REFERENCIA}T07:12:00`,
  abertoPor: "usr-rafael",
  status: "aberto",
  lancamentos: [
    { formaPagamento: "pix", quantidade: 6, valor: 1340, baixaAutomatica: true },
    { formaPagamento: "cartao_recorrente", quantidade: 8, valor: 2180, baixaAutomatica: true },
    { formaPagamento: "maquininha", quantidade: 1, valor: 190, baixaAutomatica: false },
    { formaPagamento: "dinheiro", quantidade: 2, valor: 240, baixaAutomatica: false },
  ],
  dinheiroContado: null,
  justificativaDiferenca: null,
  fechadoEm: null,
};

export const aulasPorInstrutor: AulasPorInstrutor[] = [
  { instrutorId: "ins-rafael", previstas: 34, comoSubstituto: 0, substituido: 2 },
  { instrutorId: "ins-julia", previstas: 24, comoSubstituto: 1, substituido: 0 },
  { instrutorId: "ins-henrique", previstas: 14, comoSubstituto: 0, substituido: 1 },
  { instrutorId: "ins-caio", previstas: 8, comoSubstituto: 2, substituido: 0 },
];

/* ---------- CRM ---------- */

export const etapasFunil: { id: EtapaFunil; nome: string }[] = [
  { id: "novo", nome: "Novo" },
  { id: "contato_feito", nome: "Contato feito" },
  { id: "aula_experimental", nome: "Aula experimental" },
  { id: "negociando", nome: "Negociando" },
  { id: "matriculado", nome: "Matriculado" },
  { id: "nao_matriculou", nome: "Não matriculou" },
];

export const motivosPerda: string[] = [
  "Preço",
  "Horário não atende",
  "Distância",
  "Escolheu outra atividade",
  "Sem retorno",
  "Saúde / liberação médica",
];

export const motivosEncerramento: string[] = [
  "Mudança de cidade",
  "Financeiro",
  "Horário",
  "Lesão ou saúde",
  "Insatisfação",
  "Outro",
];

const lead = (
  id: string, nome: string, telefone: string, origem: Lead["origem"], etapa: EtapaFunil,
  modalidadeInteresseId: string, criadoEm: string, motivoPerda: string | null = null,
): Lead => ({
  id, nome, telefone, origem, etapa, modalidadeInteresseId, criadoEm, atualizadoEm: criadoEm, motivoPerda,
  interacoes: [
    {
      data: criadoEm,
      tipo: "entrada",
      descricao: origem === "instagram" ? "Formulário Meta Lead Ads (Instagram)" : origem === "whatsapp" ? "Mensagem no WhatsApp da escola" : "Formulário do site",
      usuarioId: null,
    },
  ],
});

export const leads: Lead[] = [
  lead("led-01", "Mariana Gurgel", "(85) 99120-3304", "instagram", "novo", "mod-arte-marcial", "2026-10-08T14:10:00"),
  lead("led-02", "Pedro Saraiva", "(85) 98877-6120", "whatsapp", "novo", "mod-arqueria", "2026-10-08T11:02:00"),
  lead("led-03", "Lúcia e filho (8 anos)", "(85) 98402-1199", "site", "novo", "mod-acrobacia", "2026-10-07T19:40:00"),
  lead("led-04", "Thiago Nobre", "(85) 99630-4412", "instagram", "contato_feito", "mod-armas-de-corte", "2026-10-07T09:15:00"),
  lead("led-05", "Renata Pires", "(85) 98150-7008", "whatsapp", "contato_feito", "mod-tai-chi", "2026-10-06T16:20:00"),
  lead("led-06", "Eduarda Lins", "(85) 99233-8810", "instagram", "aula_experimental", "mod-arqueria", "2026-10-04T10:00:00"),
  lead("led-07", "Natália Freire", "(85) 99876-5541", "site", "aula_experimental", "mod-acrobacia", "2026-10-05T21:30:00"),
  lead("led-08", "Gustavo Braga", "(85) 98700-3321", "instagram", "negociando", "mod-arte-marcial", "2026-10-02T18:00:00"),
  lead("led-09", "Sofia Albuquerque", "(85) 99003-2287", "whatsapp", "negociando", "mod-sintonia", "2026-10-01T08:45:00"),
  lead("led-10", "Rodrigo Viana", "(85) 99440-1182", "instagram", "matriculado", "mod-ritmo", "2025-12-28T13:00:00"),
  lead("led-11", "Larissa Queiroz", "(85) 99654-2207", "site", "matriculado", "mod-sintonia", "2025-11-12T20:10:00"),
  lead("led-12", "Fábio Mendes", "(85) 98222-0045", "whatsapp", "nao_matriculou", "mod-arte-marcial", "2026-09-30T17:25:00", "Horário não atende"),
];

/* ---------- Feed, itinerâncias e indicadores ---------- */

export const feed: PublicacaoFeed[] = [
  { id: "pub-01", tipo: "feriado", titulo: "Nossa Senhora Aparecida", texto: "Sem aulas na segunda. A reposição de Arte Marcial fica para sábado às 11:00.", data: "2026-10-12", autorId: "usr-rafael" },
  { id: "pub-02", tipo: "itinerancia", titulo: "Seminário de Armas de Corte com Mestre Henrique", texto: "Sábado, 14:00 às 17:00. 18 de 25 vagas preenchidas.", data: "2026-10-17", autorId: "usr-rafael" },
  { id: "pub-03", tipo: "evento", titulo: "Exame de graduação · Arte Marcial", texto: "Inscrições até 20/10. 11 alunos aptos.", data: "2026-10-24", autorId: "usr-rafael" },
];

export const itinerancias: Itinerancia[] = [
  {
    id: "iti-01", titulo: "Seminário de Armas de Corte", ministranteNome: "Mestre Henrique Sales", escolaAnfitriaId: "esc-montese",
    modalidadeId: "mod-armas-de-corte", data: "2026-10-17T14:00:00", valorInscricao: 150, inscritos: 18, vagas: 25,
    split: { escola: 60, ministrante: 30, federacao: 10 },
  },
  {
    id: "iti-02", titulo: "Intensivo de Arqueria Meditativa", ministranteNome: "Instrutor convidado · Pa-Kua João Pessoa", escolaAnfitriaId: "esc-montese",
    modalidadeId: "mod-arqueria", data: "2026-11-07T09:00:00", valorInscricao: 180, inscritos: 6, vagas: 16,
    split: { escola: 50, ministrante: 40, federacao: 10 },
  },
];

export const indicadoresInicio: IndicadoresInicio = {
  matriculasAtivas: 142,
  novasMatriculasMes: 6,
  trancadas: 3,
  presencaHoje: 7,
  capacidadeHoje: 45,
  recebidoMes: 18430,
  previstoMes: 31260,
  valorEmAtraso: alunos.reduce((soma, a) => soma + a.valorEmAtraso, 0),
  alunosEmAtraso: alunos.filter((a) => a.status === "atraso").length,
  leadsNovos: leads.filter((l) => l.etapa === "novo").length,
};

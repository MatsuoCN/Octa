import type { Metadata } from "next";
import { Suspense } from "react";
import { Send, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getAlunos, getContratos, getModalidades, getPlanos, getTurmas } from "@/lib/api";
import { contarAlunosAtivos, montarCatalogos, montarLinhasAlunos } from "@/lib/alunos";
import type { Modalidade, Turma } from "@/types";
import { NovoAluno } from "./NovoAluno";
import { AlunosComFiltros, type Opcao } from "./AlunosComFiltros";

export const metadata: Metadata = { title: "Alunos" };

export default function AlunosPage() {
  return (
    <>
      <PageHeader
        titulo="Alunos"
        descricao="Cadastro único, vinculado a uma ou mais escolas."
        acoes={<AcoesAlunos />}
      />
      <Suspense fallback={<CarregandoAlunos />}>
        <ConteudoAlunos />
      </Suspense>
    </>
  );
}

/* ---------- Dados ---------- */

/** Busca tudo o que a tela precisa. Devolve null se o backend (ou o mock) falhar. */
async function buscarDadosAlunos() {
  try {
    const [alunos, modalidades, contratos, planos, turmas] = await Promise.all([
      getAlunos(),
      getModalidades(),
      getContratos(),
      getPlanos(),
      getTurmas(),
    ]);
    return {
      alunos,
      catalogos: montarCatalogos(modalidades, contratos, planos),
      opcoesModalidade: opcoesDeModalidade(modalidades),
      opcoesTurma: opcoesDeTurma(turmas, modalidades),
    };
  } catch {
    return null;
  }
}

async function ConteudoAlunos() {
  const dados = await buscarDadosAlunos();
  if (!dados) return <ErroAoCarregar />;
  if (dados.alunos.length === 0) return <SemAlunos />;

  const linhas = montarLinhasAlunos(dados.alunos, dados.catalogos);
  return (
    <>
      <TotalAtivos quantidade={contarAlunosAtivos(dados.alunos)} />
      {/* Os filtros vêm do endereço da página, que só existe no navegador: daí o Suspense. */}
      <Suspense fallback={<CarregandoLista />}>
        <AlunosComFiltros alunos={linhas} modalidades={dados.opcoesModalidade} turmas={dados.opcoesTurma} />
      </Suspense>
    </>
  );
}

/* ---------- Opções dos filtros ---------- */

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function opcoesDeModalidade(modalidades: Modalidade[]): Opcao[] {
  return modalidades.map((m) => ({ valor: m.id, rotulo: m.nome }));
}

/** "Arte Marcial · Seg 19:00", já em ordem de dia e horário (getTurmas devolve ordenado). */
function opcoesDeTurma(turmas: Turma[], modalidades: Modalidade[]): Opcao[] {
  const nomePorId = new Map(modalidades.map((m) => [m.id, m.nome]));
  return turmas.map((t) => ({
    valor: t.id,
    rotulo: `${nomePorId.get(t.modalidadeId) ?? "Turma"} · ${DIAS[t.diaSemana]} ${t.horario}`,
  }));
}

/* ---------- Cabeçalho ---------- */

function AcoesAlunos() {
  return (
    <>
      {/* TODO: convite por link, em tarefa própria. */}
      <button
        type="button"
        disabled
        title="Em breve"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="size-4" aria-hidden />
        Convidar aluno
      </button>
      <Suspense fallback={<BotaoNovoAlunoCarregando />}>
        <BotaoNovoAluno />
      </Suspense>
    </>
  );
}

/** Busca as modalidades para o formulário e entrega o botão já pronto. */
async function BotaoNovoAluno() {
  const modalidades = await getModalidades().catch(() => []);
  return <NovoAluno modalidades={modalidades.map((m) => ({ valor: m.id, rotulo: m.nome }))} />;
}

function BotaoNovoAlunoCarregando() {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink opacity-60">
      <UserPlus className="size-4" aria-hidden />
      Novo aluno
    </span>
  );
}

function TotalAtivos({ quantidade }: { quantidade: number }) {
  return (
    <p className="mt-4 text-sm">
      <span className="font-display text-xl font-bold">{quantidade}</span>{" "}
      <span className="text-muted">{quantidade === 1 ? "aluno ativo" : "alunos ativos"}</span>
    </p>
  );
}

/* ---------- Estados: carregando, erro e vazio ---------- */

function CarregandoAlunos() {
  return (
    <div className="mt-6" aria-busy="true" aria-label="Carregando alunos">
      <div className="h-6 w-32 animate-pulse rounded bg-line" />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

function CarregandoLista() {
  return (
    <div className="mt-6 flex flex-col gap-4" aria-busy="true" aria-label="Carregando filtros">
      <div className="h-11 animate-pulse rounded-lg bg-line" />
      <div className="h-9 w-80 max-w-full animate-pulse rounded-full bg-line" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

function ErroAoCarregar() {
  return (
    <p className="mt-6 rounded-xl border border-line bg-surface p-6 text-sm text-muted">
      Não foi possível carregar os alunos. Verifique o backend ou use os dados mockados.
    </p>
  );
}

function SemAlunos() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <p className="font-semibold">Nenhum aluno cadastrado ainda</p>
      <p className="mt-1 text-sm text-muted">Use “Novo aluno” para cadastrar o primeiro.</p>
    </div>
  );
}

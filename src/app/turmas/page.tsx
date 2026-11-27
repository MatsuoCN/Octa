import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getInstrutores, getModalidades, getTurmas } from "@/lib/api";
import { montarGradeSemanal } from "@/lib/turmas";
import { pluralizar } from "@/lib/formatadores";
import { GradeSemanal } from "./GradeSemanal";

export const metadata: Metadata = { title: "Turmas" };

export default function TurmasPage() {
  return (
    <>
      <PageHeader
        titulo="Turmas"
        descricao="Grade semanal das 8 modalidades. Toque em uma turma para abrir a chamada."
        acoes={<BotaoNovaTurma />}
      />
      <Suspense fallback={<CarregandoGrade />}>
        <ConteudoTurmas />
      </Suspense>
    </>
  );
}

/* ---------- Dados ---------- */

/** Busca tudo o que a grade precisa. Devolve null se o backend (ou o mock) falhar. */
async function buscarDadosTurmas() {
  try {
    const [turmas, modalidades, instrutores] = await Promise.all([getTurmas(), getModalidades(), getInstrutores()]);
    return { turmas, linhas: montarGradeSemanal(turmas, modalidades, instrutores) };
  } catch {
    return null;
  }
}

async function ConteudoTurmas() {
  const dados = await buscarDadosTurmas();
  if (!dados) return <ErroAoCarregar />;
  if (dados.turmas.length === 0) return <SemTurmas />;

  return (
    <>
      <p className="mt-4 text-sm text-muted">{pluralizar(dados.turmas.length, "turma na semana", "turmas na semana")}</p>
      <GradeSemanal linhas={dados.linhas} />
    </>
  );
}

/* ---------- Cabeçalho ---------- */

function BotaoNovaTurma() {
  // TODO(TURMAS-03): abrir o formulário de cadastro de turma.
  return (
    <button
      type="button"
      disabled
      title="Chega com o cadastro de turma (TURMAS-03)"
      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Plus className="size-4" aria-hidden />
      Nova turma
    </button>
  );
}

/* ---------- Estados: carregando, erro e vazio ---------- */

function CarregandoGrade() {
  return (
    <div className="mt-6" aria-busy="true" aria-label="Carregando grade de turmas">
      <div className="h-5 w-40 animate-pulse rounded bg-line" />
      <div className="mt-6 h-[28rem] animate-pulse rounded-xl border border-line bg-surface" />
    </div>
  );
}

function ErroAoCarregar() {
  return (
    <p className="mt-6 rounded-xl border border-line bg-surface p-6 text-sm text-muted">
      Não foi possível carregar as turmas. Verifique o backend ou use os dados mockados.
    </p>
  );
}

function SemTurmas() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <p className="font-semibold">Nenhuma turma cadastrada ainda</p>
      <p className="mt-1 text-sm text-muted">Use “Nova turma” para montar a grade da escola.</p>
    </div>
  );
}

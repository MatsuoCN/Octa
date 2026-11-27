import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, DoorOpen, User } from "lucide-react";
import type { AulaDoDia } from "@/lib/aulasDeHoje";
import { caminhoChamada } from "@/lib/turmas";
import { pluralizar } from "@/lib/formatadores";
import { buscarDadosDoDia } from "./dadosDoDia";

/** Bloco "Aulas de hoje" do Início (INICIO-03). Precisa ficar dentro de um <Suspense>. */
export async function AulasDeHoje() {
  const { aulas } = await buscarDadosDoDia();

  if (!aulas) {
    return (
      <Moldura>
        <p className="p-4 text-sm text-muted">Não foi possível carregar as aulas. Verifique o backend ou use os dados mockados.</p>
      </Moldura>
    );
  }

  return (
    <Moldura quantidade={aulas.length}>
      {aulas.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted">Hoje não tem aula na grade.</p>
      ) : (
        <ul className="divide-y divide-line">
          {aulas.map((aula) => (
            <LinhaAula key={aula.turmaId} aula={aula} />
          ))}
        </ul>
      )}
    </Moldura>
  );
}

function Moldura({ quantidade, children }: { quantidade?: number; children: ReactNode }) {
  return (
    <section aria-labelledby="titulo-aulas-hoje" className="mt-6 rounded-xl border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="titulo-aulas-hoje" className="font-display text-lg font-bold">
          Aulas de hoje
          {quantidade !== undefined && quantidade > 0 && (
            <span className="ml-2 text-sm font-normal text-muted">{pluralizar(quantidade, "aula", "aulas")}</span>
          )}
        </h2>
        <Link href="/turmas" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent hover:underline">
          Ver grade
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      {children}
    </section>
  );
}

function LinhaAula({ aula }: { aula: AulaDoDia }) {
  const proxima = aula.situacao.tipo === "proxima";

  return (
    <li
      className={`flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center ${proxima ? "bg-accent-soft/60" : ""}`}
      aria-current={proxima ? "time" : undefined}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="w-14 shrink-0">
          <p className="font-display font-bold tabular-nums">{aula.horario}</p>
          <p className="text-xs text-muted tabular-nums">{aula.horarioFim}</p>
        </div>
        <span className="mt-1 h-10 w-1 shrink-0 rounded-full" style={{ backgroundColor: aula.modalidadeCor }} aria-hidden />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {aula.modalidadeNome}
            {proxima && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-ink">Próxima</span>}
          </p>
          <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" aria-hidden />
              {aula.instrutorNome}
            </span>
            <span className="inline-flex items-center gap-1">
              <DoorOpen className="size-3.5" aria-hidden />
              {aula.sala}
            </span>
            <span className="tabular-nums">
              {aula.matriculados}/{aula.capacidade} matriculados
            </span>
          </p>
        </div>
      </div>
      <div className="sm:shrink-0 sm:text-right">
        <SituacaoDaAula aula={aula} />
      </div>
    </li>
  );
}

function SituacaoDaAula({ aula }: { aula: AulaDoDia }) {
  if (aula.situacao.tipo === "feita") {
    return (
      <span className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ok">
        <ClipboardCheck className="size-4" aria-hidden />
        {pluralizar(aula.situacao.presentes, "presente", "presentes")}
      </span>
    );
  }

  const destaque = aula.situacao.tipo === "proxima";
  return (
    <Link
      href={caminhoChamada(aula.turmaId)}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold sm:w-auto ${
        destaque ? "bg-accent text-accent-ink hover:brightness-110" : "border border-line bg-surface hover:bg-surface-2"
      }`}
    >
      Fazer chamada
    </Link>
  );
}

export function AulasDeHojeCarregando() {
  return (
    <div className="mt-6 rounded-xl border border-line bg-surface" aria-busy="true" aria-label="Carregando aulas de hoje">
      <div className="border-b border-line px-4 py-4">
        <div className="h-5 w-36 animate-pulse rounded bg-line" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-4 last:border-b-0">
          <div className="h-8 w-12 animate-pulse rounded bg-line" />
          <div className="h-8 flex-1 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

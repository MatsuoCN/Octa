import Link from "next/link";
import { DoorOpen, User } from "lucide-react";
import {
  caminhoChamada,
  estaLotada,
  percentualOcupacao,
  type CardTurma,
  type LinhaGrade,
} from "@/lib/turmas";
import { CabecalhoDias } from "./CabecalhoDias";

/**
 * Grade semanal: uma coluna por dia (segunda a sábado) e uma linha por horário.
 * Sai pronta do servidor; só o destaque do dia de hoje é calculado no navegador (CabecalhoDias).
 */
export function GradeSemanal({ linhas }: { linhas: LinhaGrade[] }) {
  return (
    // A grade rola para o lado dentro do próprio card, sem empurrar a página.
    <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[64rem] table-fixed border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Grade semanal de turmas, de segunda a sábado</caption>
        <thead>
          <CabecalhoDias />
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <LinhaHorario key={linha.horario} linha={linha} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinhaHorario({ linha }: { linha: LinhaGrade }) {
  return (
    <tr>
      {/* A coluna do horário fica presa à esquerda enquanto a grade rola. */}
      <th
        scope="row"
        className="sticky left-0 z-10 border-b border-line bg-surface px-2 py-3 text-left align-top font-display text-sm font-bold tabular-nums sm:px-3"
      >
        {linha.horario}
      </th>
      {linha.dias.map((turmas, dia) => (
        <td key={dia} className="border-b border-l border-line p-2 align-top">
          {turmas.length > 0 && (
            <ul className="flex flex-col gap-2">
              {turmas.map((turma) => (
                <li key={turma.id}>
                  <CardTurmaGrade turma={turma} />
                </li>
              ))}
            </ul>
          )}
        </td>
      ))}
    </tr>
  );
}

function CardTurmaGrade({ turma }: { turma: CardTurma }) {
  const lotada = estaLotada(turma);

  return (
    <Link
      href={caminhoChamada(turma.id)}
      aria-label={`${turma.modalidadeNome}, ${turma.horario} às ${turma.horarioFim}, ${turma.instrutorNome}, ${turma.sala}, ${turma.ocupacao} de ${turma.capacidade} vagas ocupadas${lotada ? ", lotada" : ""}. Abrir chamada.`}
      className="flex min-h-11 flex-col gap-1.5 rounded-lg border border-l-4 p-2.5 transition-colors hover:bg-surface-2"
      style={{
        borderColor: `color-mix(in srgb, ${turma.modalidadeCor} 35%, transparent)`,
        borderLeftColor: turma.modalidadeCor,
        backgroundColor: `color-mix(in srgb, ${turma.modalidadeCor} 7%, transparent)`,
      }}
    >
      <div>
        <p className="leading-snug font-semibold">{turma.modalidadeNome}</p>
        <p className="text-xs text-muted tabular-nums">
          {turma.horario}–{turma.horarioFim}
        </p>
      </div>

      <p className="flex items-center gap-1.5 truncate text-xs text-muted">
        <User className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{turma.instrutorNome}</span>
      </p>
      <p className="flex items-center gap-1.5 truncate text-xs text-muted">
        <DoorOpen className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{turma.sala}</span>
      </p>

      <Ocupacao turma={turma} lotada={lotada} />
    </Link>
  );
}

function Ocupacao({ turma, lotada }: { turma: CardTurma; lotada: boolean }) {
  return (
    <div className="mt-0.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold tabular-nums ${lotada ? "text-accent" : ""}`}>
          {turma.ocupacao}/{turma.capacidade}
        </span>
        {/* Lotada tem texto além da cor, nunca só cor. */}
        {lotada && <span className="font-semibold text-accent">Lotada</span>}
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentualOcupacao(turma)}%`,
            backgroundColor: lotada ? "var(--accent)" : turma.modalidadeCor,
          }}
        />
      </div>
    </div>
  );
}

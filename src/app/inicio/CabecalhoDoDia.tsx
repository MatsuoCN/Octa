import Link from "next/link";
import { Suspense } from "react";
import { ClipboardList } from "lucide-react";
import { NovoAluno } from "@/app/alunos/NovoAluno";
import { getModalidades } from "@/lib/api";
import { dataPorExtenso, fraseDoDia, horariosDeMudanca, primeiroNome, proximaAula, saudacao } from "@/lib/inicio";
import { caminhoChamada } from "@/lib/turmas";
import { buscarUsuarioExibido } from "@/lib/usuarioAtual";
import { AtualizarNoHorario } from "./AtualizarNoHorario";
import { buscarDadosDoDia } from "./dadosDoDia";

/**
 * Cabeçalho do Início (INICIO-01): saudação, data, frase do dia e atalhos.
 * Precisa ficar dentro de um <Suspense>.
 */
export async function CabecalhoDoDia() {
  const [{ agora, aulas }, usuario] = await Promise.all([
    buscarDadosDoDia(),
    buscarUsuarioExibido().catch(() => null),
  ]);
  const proxima = aulas ? proximaAula(aulas) : undefined;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm text-muted">{dataPorExtenso(agora.data)}</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-balance md:text-[1.7rem]">
          {saudacao(agora.hora)}
          {usuario && `, ${primeiroNome(usuario.nome)}`}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {aulas ? fraseDoDia(aulas, agora.hora) : "Não foi possível carregar as aulas de hoje."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Suspense fallback={<div className="h-11 w-36 animate-pulse rounded-lg bg-line" />}>
          <BotaoNovoAluno />
        </Suspense>
        {proxima && (
          <Link
            href={caminhoChamada(proxima.turmaId)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
          >
            <ClipboardList className="size-4" aria-hidden />
            Chamada das {proxima.horario}
          </Link>
        )}
      </div>

      {aulas && <AtualizarNoHorario horarios={horariosDeMudanca(aulas)} />}
    </div>
  );
}

/** Mesmo "Novo aluno" da lista de alunos (ALUNOS-03). */
async function BotaoNovoAluno() {
  const modalidades = await getModalidades().catch(() => []);
  return <NovoAluno modalidades={modalidades.map((m) => ({ valor: m.id, rotulo: m.nome }))} />;
}

export function CabecalhoDoDiaCarregando() {
  return (
    <div aria-busy="true" aria-label="Carregando o dia">
      <div className="h-4 w-48 animate-pulse rounded bg-line" />
      <div className="mt-2 h-8 w-64 animate-pulse rounded bg-line" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-line" />
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getAluno, getInstrutores, getModalidades } from "@/lib/api";
import { formatarData } from "@/lib/formatadores";
import { montarLinhaDoTempo, nivelAtual, podeRegistrarGraduacao, type GrupoModalidade } from "@/lib/graduacoes";
import { buscarPerfilAtual } from "@/lib/usuarioAtual";
import { RegistrarGraduacao, type OpcaoAvaliador, type OpcaoModalidadeGraduacao } from "./RegistrarGraduacao";

export const metadata: Metadata = { title: "Graduações" };

/** Aba Graduações (ALUNOS-13): a evolução do aluno em cada modalidade. */
export default function GraduacoesPage({ params }: PageProps<"/alunos/[id]/graduacoes">) {
  return (
    <Suspense fallback={<CarregandoGraduacoes />}>
      <ConteudoGraduacoes params={params} />
    </Suspense>
  );
}

/* ---------- Dados ---------- */

async function buscarDados(id: string) {
  try {
    const [aluno, modalidades, instrutores, perfil] = await Promise.all([
      getAluno(id),
      getModalidades(),
      getInstrutores(),
      buscarPerfilAtual(),
    ]);
    return { aluno, modalidades, instrutores, perfil };
  } catch {
    return null;
  }
}

async function ConteudoGraduacoes({ params }: { params: PageProps<"/alunos/[id]/graduacoes">["params"] }) {
  const { id } = await params;
  const dados = await buscarDados(id);
  // Aluno inexistente já é tratado pelo layout do perfil; aqui sobra só falha de carregamento.
  if (!dados) return <ErroAoCarregar />;

  const { aluno, modalidades, instrutores, perfil } = dados;
  const grupos = montarLinhaDoTempo(aluno.graduacoes, modalidades, instrutores);

  // Modalidades do aluno e as que já têm histórico (ele pode ter parado de treinar alguma).
  const idsModalidades = new Set([...aluno.modalidadeIds, ...aluno.graduacoes.map((g) => g.modalidadeId)]);
  const opcoesModalidade: OpcaoModalidadeGraduacao[] = modalidades
    .filter((m) => m.usaGraduacao && idsModalidades.has(m.id))
    .map((m) => ({ valor: m.id, rotulo: m.nome, nivelAtual: nivelAtual(aluno.graduacoes, m.id) }));
  const avaliadores: OpcaoAvaliador[] = instrutores.map((i) => ({
    valor: i.id,
    rotulo: `${i.titulo} ${i.nome}`,
    modalidadeIds: i.modalidadeIds,
  }));

  return (
    <section aria-labelledby="titulo-graduacoes">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-graduacoes" className="font-display text-lg font-bold">
          Graduações
        </h2>
        {podeRegistrarGraduacao(perfil) ? (
          <RegistrarGraduacao alunoId={aluno.id} modalidades={opcoesModalidade} avaliadores={avaliadores} />
        ) : (
          <p className="text-sm text-muted">Só Instrutor, Gestor ou Dono registram graduações.</p>
        )}
      </div>

      {grupos.length === 0 ? (
        <SemGraduacoes />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {grupos.map((grupo) => (
            <LinhaDoTempo key={grupo.modalidadeId} grupo={grupo} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Linha do tempo ---------- */

function LinhaDoTempo({ grupo }: { grupo: GrupoModalidade }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-4">
      <header className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: grupo.cor }} aria-hidden />
          {grupo.nome}
        </h3>
        <span className="text-sm text-muted">
          Nível atual <span className="font-display text-lg font-bold text-ink">{grupo.nivelAtual}</span>
        </span>
      </header>

      <ol className="mt-4 flex flex-col">
        {grupo.itens.map((item, i) => (
          <li key={item.chave} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Trilho vertical ligando os pontos, menos no último. */}
            {i < grupo.itens.length - 1 && (
              <span className="absolute top-5 bottom-0 left-[7px] w-0.5 bg-line" aria-hidden />
            )}
            <span
              className="relative mt-1.5 size-4 shrink-0 rounded-full border-2"
              style={{ borderColor: grupo.cor, backgroundColor: item.atual ? grupo.cor : "var(--surface)" }}
              aria-hidden
            />
            <div
              className="min-w-0 flex-1 rounded-lg border border-transparent px-3 py-2"
              style={
                item.atual
                  ? {
                      backgroundColor: `color-mix(in srgb, ${grupo.cor} 10%, transparent)`,
                      borderColor: `color-mix(in srgb, ${grupo.cor} 45%, transparent)`,
                    }
                  : undefined
              }
            >
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">Nível {item.nivel}</span>
                {item.atual && (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-surface">Atual</span>
                )}
              </p>
              <p className="text-sm text-muted">
                Exame em {formatarData(item.data)} ·{" "}
                {item.avaliadorNome ? `avaliado por ${item.avaliadorNome}` : "avaliador não informado"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

/* ---------- Estados ---------- */

function SemGraduacoes() {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <p className="font-semibold">Nenhuma graduação registrada ainda</p>
      <p className="mt-1 text-sm text-muted">Quando o aluno fizer o primeiro exame, registre aqui.</p>
    </div>
  );
}

function ErroAoCarregar() {
  return (
    <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
      Não foi possível carregar as graduações. Verifique o backend ou use os dados mockados.
    </p>
  );
}

function CarregandoGraduacoes() {
  return (
    <div aria-busy="true" aria-label="Carregando graduações">
      <div className="h-6 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl border border-line bg-surface" />
        <div className="h-48 animate-pulse rounded-xl border border-line bg-surface" />
      </div>
    </div>
  );
}

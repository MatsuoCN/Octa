import type { ReactNode } from "react";
import { Suspense } from "react";
import { ApiError, getAluno, getModalidades } from "@/lib/api";
import { resolverModalidades, indexarPorId } from "@/lib/alunos";
import { AbasPerfil, AbasPerfilCarregando } from "./AbasPerfil";
import { CabecalhoPerfil, CabecalhoPerfilCarregando } from "./CabecalhoPerfil";
import { VoltarParaLista } from "./VoltarParaLista";

/**
 * Perfil do aluno (ALUNOS-06): cabeçalho e abas ficam aqui; cada aba é uma página
 * dentro desta pasta. Trocar de aba não recarrega o cabeçalho.
 */
export default function PerfilAlunoLayout({ children, params }: LayoutProps<"/alunos/[id]">) {
  return (
    <>
      <VoltarParaLista />
      <Suspense fallback={<CabecalhoPerfilCarregando />}>
        <PerfilAluno params={params}>{children}</PerfilAluno>
      </Suspense>
    </>
  );
}

type Busca =
  | { tipo: "ok"; aluno: Awaited<ReturnType<typeof getAluno>>; modalidades: Awaited<ReturnType<typeof getModalidades>> }
  | { tipo: "nao_encontrado" }
  | { tipo: "erro" };

async function buscarPerfil(id: string): Promise<Busca> {
  try {
    const [aluno, modalidades] = await Promise.all([getAluno(id), getModalidades()]);
    return { tipo: "ok", aluno, modalidades };
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return { tipo: "nao_encontrado" };
    return { tipo: "erro" };
  }
}

interface PerfilAlunoProps {
  params: LayoutProps<"/alunos/[id]">["params"];
  children: ReactNode;
}

async function PerfilAluno({ params, children }: PerfilAlunoProps) {
  const { id } = await params;
  const busca = await buscarPerfil(id);

  if (busca.tipo === "nao_encontrado") return <AlunoNaoEncontrado />;
  if (busca.tipo === "erro") return <ErroAoCarregar />;

  const { aluno, modalidades } = busca;
  return (
    <>
      <CabecalhoPerfil aluno={aluno} modalidades={resolverModalidades(aluno.modalidadeIds, indexarPorId(modalidades))} />
      <Suspense fallback={<AbasPerfilCarregando alunoId={aluno.id} />}>
        <AbasPerfil alunoId={aluno.id} />
      </Suspense>
      <div className="mt-6">{children}</div>
    </>
  );
}

function AlunoNaoEncontrado() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <h1 className="font-display text-xl font-bold">Aluno não encontrado</h1>
      <p className="mt-1 text-sm text-muted">O link pode estar errado ou o cadastro foi removido.</p>
    </div>
  );
}

function ErroAoCarregar() {
  return (
    <p className="rounded-xl border border-line bg-surface p-6 text-sm text-muted">
      Não foi possível carregar o aluno. Verifique o backend ou use os dados mockados.
    </p>
  );
}

import { Suspense } from "react";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";
import { getAluno } from "@/lib/api";
import { VoltarParaLista } from "./VoltarParaLista";

/** Perfil provisório. A tela de verdade vem na ALUNOS-06. */
export default function PerfilAlunoPage({ params }: PageProps<"/alunos/[id]">) {
  return (
    <>
      <VoltarParaLista />
      <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded bg-line" />}>
        <Cabecalho params={params} />
      </Suspense>
      <EmConstrucao
        itens={["Perfil com abas Resumo, Comunicação, Vendas, Contratos, Financeiro, Graduações e Serviços (ALUNOS-06)"]}
      />
    </>
  );
}

async function Cabecalho({ params }: { params: PageProps<"/alunos/[id]">["params"] }) {
  const { id } = await params;
  const aluno = await getAluno(id).catch(() => null);
  return <PageHeader titulo={aluno?.nome ?? "Aluno não encontrado"} />;
}

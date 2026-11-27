import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmConstrucao } from "@/components/PageHeader";
import { abaPeloSegmento } from "@/lib/perfilAluno";

/**
 * Abas que ainda não foram construídas. Quando uma aba ganhar a própria pasta
 * (como graduacoes/), aquela rota passa a valer no lugar desta.
 */
const EM_CONSTRUCAO: Record<string, string> = {
  comunicacao: "Histórico de mensagens e documentos do aluno (ALUNOS-14)",
  vendas: "Vendas avulsas do aluno (ALUNOS-14)",
  contratos: "Contratos e histórico de versões (ALUNOS-09)",
  financeiro: "Parcelas, pagamentos e valores em atraso (ALUNOS-12)",
  servicos: "Serviços contratados pelo aluno (ALUNOS-14)",
};

export default function AbaPerfilPage({ params }: PageProps<"/alunos/[id]/[aba]">) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-xl border border-line bg-surface" />}>
      <ConteudoAba params={params} />
    </Suspense>
  );
}

async function ConteudoAba({ params }: { params: PageProps<"/alunos/[id]/[aba]">["params"] }) {
  const { aba } = await params;
  if (!abaPeloSegmento(aba) || !EM_CONSTRUCAO[aba]) notFound();
  return <EmConstrucao itens={[EM_CONSTRUCAO[aba]]} />;
}

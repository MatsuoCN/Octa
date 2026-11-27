import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";
import { getModalidades, getTurma } from "@/lib/api";
import { DIAS_SEMANA } from "@/lib/turmas";

/** Chamada provisória, só para a grade já ter para onde levar. A tela de verdade vem na TURMAS-05. */
export default function ChamadaPage({ params }: PageProps<"/turmas/[id]/chamada">) {
  return (
    <>
      <Link href="/turmas" className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden />
        Turmas
      </Link>
      <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded bg-line" />}>
        <Cabecalho params={params} />
      </Suspense>
      <EmConstrucao
        itens={[
          "Contador de presentes (X/Y) e um card por aluno, marcado com um toque (TURMAS-05)",
          "Botões “Marcar todos” e “Aluno experimental”",
          "“Salvar chamada” preso no rodapé",
        ]}
      />
    </>
  );
}

async function Cabecalho({ params }: { params: PageProps<"/turmas/[id]/chamada">["params"] }) {
  const { id } = await params;
  const [turma, modalidades] = await Promise.all([getTurma(id).catch(() => null), getModalidades().catch(() => [])]);
  if (!turma) return <PageHeader titulo="Turma não encontrada" />;

  const modalidade = modalidades.find((m) => m.id === turma.modalidadeId);
  return (
    <PageHeader
      titulo={`Chamada · ${modalidade?.nome ?? "Turma"}`}
      descricao={`${DIAS_SEMANA[turma.diaSemana].nome}, ${turma.horario} · ${turma.sala}`}
    />
  );
}

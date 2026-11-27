import type { Metadata } from "next";
import { EmConstrucao } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Aluno" };

/** Aba Resumo. O conteúdo vem na ALUNOS-07. */
export default function ResumoAlunoPage() {
  return (
    <EmConstrucao
      itens={["Resumo do aluno: contato, plano, próximas aulas, presença e observações (ALUNOS-07)"]}
    />
  );
}

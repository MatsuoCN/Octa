import type { Metadata } from "next";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Turmas" };

export default function TurmasPage() {
  return (
    <>
      <PageHeader titulo="Turmas" descricao="Grade semanal das 8 modalidades." />
      <EmConstrucao
        itens={[
          "Grade semanal com horário, instrutor, sala e ocupação (X/Y)",
          "Filtro por modalidade",
          "Chamada de presença com registro de substituição de instrutor",
        ]}
      />
    </>
  );
}

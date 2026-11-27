import { Suspense } from "react";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";
import { AulasDeHoje, AulasDeHojeCarregando } from "./inicio/AulasDeHoje";

export default function InicioPage() {
  return (
    <>
      <PageHeader titulo="Início" descricao="Resumo do dia da escola." />
      <Suspense fallback={<AulasDeHojeCarregando />}>
        <AulasDeHoje />
      </Suspense>
      <EmConstrucao
        itens={[
          "Cabeçalho do dia e atalhos (INICIO-01)",
          "Indicadores: matrículas ativas, presença do dia, recebido no mês, valor em atraso e leads novos (INICIO-02)",
          "Alunos para cobrar hoje (INICIO-04)",
          "Feed da escola: avisos, eventos e feriados",
        ]}
      />
    </>
  );
}

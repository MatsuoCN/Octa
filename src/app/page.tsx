import { Suspense } from "react";
import { EmConstrucao } from "@/components/PageHeader";
import { AulasDeHoje, AulasDeHojeCarregando } from "./inicio/AulasDeHoje";
import { CabecalhoDoDia, CabecalhoDoDiaCarregando } from "./inicio/CabecalhoDoDia";
import { Indicadores, IndicadoresCarregando } from "./inicio/Indicadores";

export default function InicioPage() {
  return (
    <>
      <Suspense fallback={<CabecalhoDoDiaCarregando />}>
        <CabecalhoDoDia />
      </Suspense>
      <Suspense fallback={<IndicadoresCarregando />}>
        <Indicadores />
      </Suspense>
      <Suspense fallback={<AulasDeHojeCarregando />}>
        <AulasDeHoje />
      </Suspense>
      <EmConstrucao
        itens={[
          "Alunos para cobrar hoje (INICIO-04)",
          "Feed da escola: avisos, eventos e feriados",
        ]}
      />
    </>
  );
}

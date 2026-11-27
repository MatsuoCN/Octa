import { Suspense } from "react";
import { EmConstrucao } from "@/components/PageHeader";
import { AulasDeHoje, AulasDeHojeCarregando } from "./inicio/AulasDeHoje";
import { CabecalhoDoDia, CabecalhoDoDiaCarregando } from "./inicio/CabecalhoDoDia";
import { CobrarHoje, CobrarHojeCarregando } from "./inicio/CobrarHoje";
import { Indicadores, IndicadoresCarregando } from "./inicio/Indicadores";

/** Início (OCTA-2): o resumo do dia da escola. Cada bloco carrega por conta própria. */
export default function InicioPage() {
  return (
    <>
      <Suspense fallback={<CabecalhoDoDiaCarregando />}>
        <CabecalhoDoDia />
      </Suspense>
      <Suspense fallback={<IndicadoresCarregando />}>
        <Indicadores />
      </Suspense>
      <div className="grid grid-cols-1 items-start gap-x-6 xl:grid-cols-[3fr_2fr]">
        <Suspense fallback={<AulasDeHojeCarregando />}>
          <AulasDeHoje />
        </Suspense>
        <Suspense fallback={<CobrarHojeCarregando />}>
          <CobrarHoje />
        </Suspense>
      </div>
      <EmConstrucao itens={["Feed da escola: avisos, eventos e feriados"]} />
    </>
  );
}

import { Suspense } from "react";
import { EmConstrucao } from "@/components/PageHeader";
import { AulasDeHoje, AulasDeHojeCarregando } from "./inicio/AulasDeHoje";
import { CabecalhoDoDia, CabecalhoDoDiaCarregando } from "./inicio/CabecalhoDoDia";

export default function InicioPage() {
  return (
    <>
      <Suspense fallback={<CabecalhoDoDiaCarregando />}>
        <CabecalhoDoDia />
      </Suspense>
      <Suspense fallback={<AulasDeHojeCarregando />}>
        <AulasDeHoje />
      </Suspense>
      <EmConstrucao
        itens={[
          "Indicadores: matrículas ativas, presença do dia, recebido no mês, valor em atraso e leads novos (INICIO-02)",
          "Alunos para cobrar hoje (INICIO-04)",
          "Feed da escola: avisos, eventos e feriados",
        ]}
      />
    </>
  );
}

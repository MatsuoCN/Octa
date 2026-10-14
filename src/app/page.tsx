import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export default function InicioPage() {
  return (
    <>
      <PageHeader titulo="Início" descricao="Resumo do dia da escola." />
      <EmConstrucao
        itens={[
          "Indicadores: matrículas ativas, presença do dia, recebido no mês, valor em atraso e leads novos",
          "Aulas de hoje com acesso direto à chamada",
          "Alunos para cobrar hoje",
          "Feed da escola: avisos, eventos e feriados",
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Financeiro" };

export default function FinanceiroPage() {
  return (
    <>
      <PageHeader titulo="Financeiro" descricao="Parcelas, cobrança e caixa." />
      <EmConstrucao
        itens={[
          "Visão geral do mês e recebido por forma de pagamento",
          "Parcelas com cobrança por PIX e cartão recorrente",
          "Fechamento de caixa com conferência do dinheiro",
          "Aulas por instrutor, base para o repasse",
        ]}
      />
    </>
  );
}

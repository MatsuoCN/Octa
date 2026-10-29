import type { Metadata } from "next";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader titulo="Configurações" descricao="Dados da escola, pagamentos e importação." />
      <EmConstrucao
        itens={[
          "Dados da escola e gateway de pagamento",
          "Importar dados da NextFit (XLSX e CSV)",
          "Notificações, app do aluno e privacidade (LGPD)",
        ]}
      />
    </>
  );
}

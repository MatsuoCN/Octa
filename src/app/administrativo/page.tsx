import type { Metadata } from "next";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Administrativo" };

export default function AdministrativoPage() {
  return (
    <>
      <PageHeader titulo="Administrativo" descricao="Cadastros da escola." />
      <EmConstrucao
        itens={[
          "Contratos, Cupom de Desconto, Local, Metas, Métodos de Pagamento, Modalidades",
          "Motivos de Encerramento, Feed (Notícias), Perfil de Acesso, Serviços, Templates e Usuários",
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import { EmConstrucao, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Alunos" };

export default function AlunosPage() {
  return (
    <>
      <PageHeader titulo="Alunos" descricao="Cadastro único, vinculado a uma ou mais escolas." />
      <EmConstrucao
        itens={[
          "Novo aluno e Convidar aluno",
          "Grade ou lista, filtros por status, modalidade e turma, busca por nome, CPF ou telefone",
          "Perfil com abas Resumo, Comunicação, Vendas, Contratos, Financeiro, Graduações e Serviços",
        ]}
      />
    </>
  );
}

"use server";

/**
 * Ação de registrar graduação (ALUNOS-13). Roda no servidor; a janela chama direto.
 * Confere tudo de novo aqui, porque Server Actions podem ser chamadas sem passar pela tela.
 */
import { revalidatePath } from "next/cache";
import { ApiError, getAluno, registrarGraduacao } from "@/lib/api";
import {
  hojeIso,
  montarGraduacao,
  nivelAtualSeForRebaixamento,
  podeRegistrarGraduacao,
  temErrosGraduacao,
  validarGraduacao,
  type CamposGraduacao,
  type ErrosGraduacao,
} from "@/lib/graduacoes";
import { caminhoAba } from "@/lib/perfilAluno";
import { buscarPerfilAtual } from "@/lib/usuarioAtual";

export type ResultadoGraduacao =
  | { tipo: "salvo" }
  | { tipo: "invalido"; erros: ErrosGraduacao }
  | { tipo: "confirmar_nivel_menor"; nivelAtual: number }
  | { tipo: "erro"; mensagem: string };

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError && erro.status === 0) return "Sem conexão com o servidor. Tente de novo em instantes.";
  if (erro instanceof ApiError && erro.status === 404) return "Aluno não encontrado.";
  return "Não foi possível salvar agora. Tente de novo.";
}

/**
 * @param confirmouNivelMenor true quando a pessoa já viu o aviso de nível menor e confirmou.
 */
export async function registrarGraduacaoDoAluno(
  alunoId: string,
  campos: CamposGraduacao,
  confirmouNivelMenor: boolean,
): Promise<ResultadoGraduacao> {
  try {
    if (!podeRegistrarGraduacao(await buscarPerfilAtual())) {
      return { tipo: "erro", mensagem: "Só Instrutor, Gestor ou Dono podem registrar graduações." };
    }

    const erros = validarGraduacao(campos, hojeIso());
    if (temErrosGraduacao(erros)) return { tipo: "invalido", erros };

    const aluno = await getAluno(alunoId);
    const atual = nivelAtualSeForRebaixamento(aluno.graduacoes, campos);
    if (atual !== null && !confirmouNivelMenor) return { tipo: "confirmar_nivel_menor", nivelAtual: atual };

    await registrarGraduacao(alunoId, montarGraduacao(campos));
    revalidatePath(caminhoAba(alunoId, "graduacoes"));
    return { tipo: "salvo" };
  } catch (erro) {
    return { tipo: "erro", mensagem: mensagemDeErro(erro) };
  }
}

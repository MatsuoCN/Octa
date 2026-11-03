"use server";

/**
 * Ações do cadastro rápido (ALUNOS-03). Rodam no servidor; a janela chama direto.
 *
 * TODO(FUT-03): conferir o usuário logado e o perfil antes de gravar.
 * Server Actions podem ser chamadas por POST direto, sem passar pela tela.
 */
import { revalidatePath } from "next/cache";
import {
  ApiError,
  buscarAlunoNaFederacao,
  criarAluno,
  getEscolaAtual,
  getEscolas,
  marcarAulaExperimental,
  vincularAlunoAEscolaAtual,
} from "@/lib/api";
import { montarNovoAluno, temErros, validarCadastro, type CamposCadastro, type ErrosCadastro } from "@/lib/cadastroAluno";

export interface AlunoResumo {
  id: string;
  nome: string;
}

export type ResultadoCadastro =
  | { tipo: "invalido"; erros: ErrosCadastro }
  | { tipo: "duplicado_nesta_escola"; aluno: AlunoResumo }
  | { tipo: "duplicado_outra_escola"; aluno: AlunoResumo; escolas: string[] }
  | { tipo: "salvo"; aluno: AlunoResumo; vinculo: boolean }
  | { tipo: "erro"; mensagem: string };

const resumir = (aluno: AlunoResumo): AlunoResumo => ({ id: aluno.id, nome: aluno.nome });

/** Mensagem amigável para qualquer erro da API. */
function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError && erro.status === 0) return "Sem conexão com o servidor. Tente de novo em instantes.";
  return "Não foi possível salvar agora. Tente de novo.";
}

/** Atualiza a lista de alunos para quem estiver com ela aberta. */
function atualizarListaDeAlunos() {
  revalidatePath("/alunos");
}

/** Nomes das escolas onde o aluno já está, sem a escola atual. */
async function nomesDasOutrasEscolas(escolaIds: string[], escolaAtualId: string): Promise<string[]> {
  const escolas = await getEscolas();
  return escolas.filter((e) => e.id !== escolaAtualId && escolaIds.includes(e.id)).map((e) => e.nome);
}

export async function cadastrarAluno(campos: CamposCadastro): Promise<ResultadoCadastro> {
  const erros = validarCadastro(campos);
  if (temErros(erros)) return { tipo: "invalido", erros };

  try {
    const [escolaAtual, existente] = await Promise.all([
      getEscolaAtual(),
      buscarAlunoNaFederacao({ telefone: campos.telefone, cpf: campos.cpf }),
    ]);

    if (existente) {
      if (existente.escolaIds.includes(escolaAtual.id)) {
        return { tipo: "duplicado_nesta_escola", aluno: resumir(existente) };
      }
      const escolas = await nomesDasOutrasEscolas(existente.escolaIds, escolaAtual.id);
      return { tipo: "duplicado_outra_escola", aluno: resumir(existente), escolas };
    }

    const aluno = await criarAluno(montarNovoAluno(campos));
    atualizarListaDeAlunos();
    return { tipo: "salvo", aluno: resumir(aluno), vinculo: false };
  } catch (erro) {
    return { tipo: "erro", mensagem: mensagemDeErro(erro) };
  }
}

export async function vincularAluno(alunoId: string): Promise<ResultadoCadastro> {
  try {
    const aluno = await vincularAlunoAEscolaAtual(alunoId);
    atualizarListaDeAlunos();
    return { tipo: "salvo", aluno: resumir(aluno), vinculo: true };
  } catch (erro) {
    return { tipo: "erro", mensagem: mensagemDeErro(erro) };
  }
}

export async function colocarEmAulaExperimental(alunoId: string): Promise<{ ok: boolean; mensagem?: string }> {
  try {
    await marcarAulaExperimental(alunoId);
    atualizarListaDeAlunos();
    return { ok: true };
  } catch (erro) {
    return { ok: false, mensagem: mensagemDeErro(erro) };
  }
}

/**
 * Regras do bloco "Cobrar hoje" do Início (INICIO-04), em funções puras.
 */
import type { Aluno, Contrato, Parcela, Plano } from "@/types";
import { formatarData, formatarMoeda } from "@/lib/formatadores";
import { primeiroNome } from "@/lib/inicio";

export interface AlunoParaCobrar {
  alunoId: string;
  nome: string;
  telefone: string;
  /** Vencimento da parcela atrasada mais antiga. */
  vencimento: string;
  quantidadeParcelas: number;
  planoNome: string | null;
  valorEmAtraso: number;
}

/**
 * Um item por aluno com parcela atrasada, somando as parcelas dele.
 * Só entram alunos da lista recebida (os da escola atual). Mais antigo primeiro.
 */
export function montarAlunosParaCobrar(
  parcelas: Parcela[],
  alunos: Aluno[],
  contratos: Contrato[],
  planos: Plano[],
): AlunoParaCobrar[] {
  const porAluno = new Map<string, AlunoParaCobrar>();

  for (const parcela of parcelas) {
    if (parcela.situacao !== "atrasada") continue;
    const aluno = alunos.find((a) => a.id === parcela.alunoId);
    if (!aluno) continue;

    const item = porAluno.get(aluno.id);
    if (item) {
      item.quantidadeParcelas += 1;
      item.valorEmAtraso += parcela.valor;
      if (parcela.vencimento < item.vencimento) item.vencimento = parcela.vencimento;
      continue;
    }

    const contrato = contratos.find((c) => c.id === parcela.contratoId);
    porAluno.set(aluno.id, {
      alunoId: aluno.id,
      nome: aluno.nome,
      // Para menor de idade, o telefone do cadastro já é o do responsável.
      telefone: aluno.telefone,
      vencimento: parcela.vencimento,
      quantidadeParcelas: 1,
      planoNome: planos.find((p) => p.id === contrato?.planoId)?.nome ?? null,
      valorEmAtraso: parcela.valor,
    });
  }

  return [...porAluno.values()].sort((a, b) => a.vencimento.localeCompare(b.vencimento));
}

/**
 * Mensagem educada de cobrança.
 * TODO(FINANCEIRO-04): incluir o link de pagamento e registrar a cobrança na aba Comunicação.
 */
export function mensagemDeCobranca(item: AlunoParaCobrar, escolaNome: string): string {
  const parcelas = item.quantidadeParcelas === 1 ? "a mensalidade vencida" : `${item.quantidadeParcelas} mensalidades, a primeira vencida`;
  return (
    `Olá, ${primeiroNome(item.nome)}! Tudo bem? Aqui é da ${escolaNome}. ` +
    `Consta em aberto ${parcelas} em ${formatarData(item.vencimento)}, no total de ${formatarMoeda(item.valorEmAtraso)}. ` +
    `Se já pagou, desconsidere. Qualquer dúvida, é só responder por aqui.`
  );
}

/** Link do WhatsApp com a mensagem pronta. null se o telefone não for válido. */
export function linkDeCobranca(item: AlunoParaCobrar, escolaNome: string): string | null {
  const digitos = item.telefone.replace(/\D/g, "");
  if (digitos.length !== 10 && digitos.length !== 11) return null;
  return `https://wa.me/55${digitos}?text=${encodeURIComponent(mensagemDeCobranca(item, escolaNome))}`;
}

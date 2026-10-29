/**
 * Regras do cadastro rápido de aluno (ALUNOS-03), em funções puras.
 * Rodam no navegador (aviso na hora, enquanto a pessoa preenche) e no servidor (a palavra final).
 */
import type { NovoAluno } from "@/types";
import { calcularIdade } from "@/lib/formatadores";

export const IDADE_MAIORIDADE = 18;

/** Campos do formulário, como chegam dos inputs (tudo texto). */
export interface CamposCadastro {
  nome: string;
  telefone: string;
  dataNascimento: string;
  modalidadeId: string;
  cpf: string;
  responsavelNome: string;
  responsavelTelefone: string;
}

export const CAMPOS_VAZIOS: CamposCadastro = {
  nome: "",
  telefone: "",
  dataNascimento: "",
  modalidadeId: "",
  cpf: "",
  responsavelNome: "",
  responsavelTelefone: "",
};

export type ErrosCadastro = Partial<Record<keyof CamposCadastro, string>>;

export function soDigitos(texto: string): string {
  return texto.replace(/\D/g, "");
}

/** Celular ou fixo com DDD: 10 ou 11 dígitos. */
export function telefoneValido(telefone: string): boolean {
  const digitos = soDigitos(telefone);
  return digitos.length === 10 || digitos.length === 11;
}

/** Só confere o tamanho. A conta dos dígitos verificadores fica para quando houver backend. */
export function cpfValido(cpf: string): boolean {
  return soDigitos(cpf).length === 11;
}

/** Data de nascimento no passado e com no máximo 120 anos. */
export function dataNascimentoValida(data: string, hoje: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const idade = calcularIdade(data, hoje);
  return idade >= 0 && idade <= 120 && data <= hoje.toISOString().slice(0, 10);
}

/** Menor de idade só quando a data foi informada e é válida. */
export function ehMenorDeIdade(dataNascimento: string, hoje: Date = new Date()): boolean {
  return dataNascimentoValida(dataNascimento, hoje) && calcularIdade(dataNascimento, hoje) < IDADE_MAIORIDADE;
}

/** Confere os campos. Objeto vazio = pode salvar. */
export function validarCadastro(campos: CamposCadastro, hoje: Date = new Date()): ErrosCadastro {
  const erros: ErrosCadastro = {};

  if (!campos.nome.trim()) erros.nome = "Informe o nome.";
  else if (campos.nome.trim().length < 3) erros.nome = "Nome muito curto.";

  if (!campos.telefone.trim()) erros.telefone = "Informe o WhatsApp.";
  else if (!telefoneValido(campos.telefone)) erros.telefone = "Use DDD + número, ex.: (85) 98812-4471.";

  if (campos.dataNascimento && !dataNascimentoValida(campos.dataNascimento, hoje)) {
    erros.dataNascimento = "Data inválida.";
  }

  if (campos.cpf && !cpfValido(campos.cpf)) erros.cpf = "O CPF tem 11 números.";

  if (ehMenorDeIdade(campos.dataNascimento, hoje)) {
    if (!campos.responsavelNome.trim()) erros.responsavelNome = "Informe o nome do responsável.";
    if (!campos.responsavelTelefone.trim()) erros.responsavelTelefone = "Informe o telefone do responsável.";
    else if (!telefoneValido(campos.responsavelTelefone)) erros.responsavelTelefone = "Use DDD + número.";
  }

  return erros;
}

export function temErros(erros: ErrosCadastro): boolean {
  return Object.keys(erros).length > 0;
}

/** Converte os campos já validados no formato que a API espera. */
export function montarNovoAluno(campos: CamposCadastro, hoje: Date = new Date()): NovoAluno {
  const menor = ehMenorDeIdade(campos.dataNascimento, hoje);
  return {
    nome: campos.nome.trim().replace(/\s+/g, " "),
    telefone: formatarTelefoneDigitado(campos.telefone),
    dataNascimento: campos.dataNascimento,
    modalidadeId: campos.modalidadeId,
    cpf: soDigitos(campos.cpf),
    ...(menor
      ? {
          responsavel: {
            nome: campos.responsavelNome.trim(),
            telefone: formatarTelefoneDigitado(campos.responsavelTelefone),
          },
        }
      : {}),
  };
}

/* ---------- Máscaras enquanto digita ---------- */

/** "8598812" -> "(85) 98812"; "85988124471" -> "(85) 98812-4471" */
export function formatarTelefoneDigitado(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const ddd = `(${d.slice(0, 2)}) `;
  const resto = d.slice(2);
  const corte = d.length === 11 ? 5 : 4;
  return resto.length > corte ? `${ddd}${resto.slice(0, corte)}-${resto.slice(corte)}` : `${ddd}${resto}`;
}

/** "12345678901" -> "123.456.789-01" */
export function formatarCpfDigitado(valor: string): string {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

/**
 * Formatadores em português, usados em todas as telas.
 * Não dependem do locale do servidor nem do navegador, para o HTML do servidor
 * e o do navegador saírem iguais.
 */

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** 1234.5 -> "R$ 1.234,50" */
export function formatarMoeda(valor: number): string {
  const [inteiro, centavos] = Math.abs(valor).toFixed(2).split(".");
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${valor < 0 ? "-" : ""}R$ ${comPontos},${centavos}`;
}

/** "2026-10-08" -> "08/10/2026" */
export function formatarData(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

/** "2023-03-25" -> "mar/2023" */
export function formatarMesAno(iso: string): string {
  const [a, m] = iso.split("-");
  return `${MESES_CURTOS[Number(m) - 1]}/${a}`;
}

/** "85988124471" ou "(85) 98812-4471" -> "(85) 98812-4471" */
export function formatarTelefone(telefone: string): string {
  const d = telefone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone;
}

/**
 * Idade em anos completos a partir de "AAAA-MM-DD".
 * Usa a data de hoje, então só pode rodar no navegador (Client Component):
 * com Cache Components, `new Date()` não é permitido no prerender do servidor.
 */
export function calcularIdade(dataNascimento: string, hoje: Date = new Date()): number {
  const [a, m, d] = dataNascimento.split("-").map(Number);
  let idade = hoje.getFullYear() - a;
  const mesHoje = hoje.getMonth() + 1;
  if (mesHoje < m || (mesHoje === m && hoje.getDate() < d)) idade--;
  return idade;
}

/** "Ana Beatriz Costa" -> "AC" */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

/** pluralizar(1, "aluno", "alunos") -> "1 aluno"; pluralizar(3, ...) -> "3 alunos" */
export function pluralizar(quantidade: number, singular: string, plural: string): string {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

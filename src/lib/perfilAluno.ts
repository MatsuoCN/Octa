/**
 * Regras do perfil do aluno (ALUNOS-06), em funções puras.
 * Cada aba é uma rota própria (/alunos/[id]/graduacoes...), então o link e o recarregar
 * abrem direto na aba certa. O Resumo é a raiz do perfil.
 */
import type { Genero } from "@/types";

export interface AbaPerfil {
  /** Segmento da rota. null = raiz do perfil (Resumo). */
  segmento: string | null;
  rotulo: string;
}

export const ABAS_PERFIL: AbaPerfil[] = [
  { segmento: null, rotulo: "Resumo" },
  { segmento: "comunicacao", rotulo: "Comunicação" },
  { segmento: "vendas", rotulo: "Vendas" },
  { segmento: "contratos", rotulo: "Contratos" },
  { segmento: "financeiro", rotulo: "Financeiro" },
  { segmento: "graduacoes", rotulo: "Graduações" },
  { segmento: "servicos", rotulo: "Serviços" },
];

export function caminhoAba(alunoId: string, segmento: string | null): string {
  return segmento ? `/alunos/${alunoId}/${segmento}` : `/alunos/${alunoId}`;
}

export function abaPeloSegmento(segmento: string): AbaPerfil | undefined {
  return ABAS_PERFIL.find((a) => a.segmento === segmento);
}

/** Gênero só aparece quando foi declarado. */
export function generoExibido(genero: Genero): string | null {
  return genero === "Não declarado" ? null : genero;
}

/** "(85) 98812-4471" -> "https://wa.me/5585988124471". Sem número válido, devolve null. */
export function linkWhatsApp(telefone: string): string | null {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length !== 10 && digitos.length !== 11) return null;
  return `https://wa.me/55${digitos}`;
}

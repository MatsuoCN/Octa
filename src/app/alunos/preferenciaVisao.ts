/**
 * Preferência grade/lista da tela de alunos.
 *
 * Como funciona:
 * 1. A escolha fica salva no localStorage.
 * 2. Ela é aplicada como atributo no <html> (data-visao-alunos="lista").
 * 3. O CSS em globals.css esconde o modo que não está ativo.
 * 4. Um script inline aplica a escolha antes da primeira pintura, então recarregar não pisca.
 */

export type Visao = "grade" | "lista";

const CHAVE_STORAGE = "octa:alunos:visao";
const EVENTO_MUDANCA = "octa:visao-alunos";
export const VISAO_PADRAO: Visao = "grade";

export function lerVisao(): Visao {
  try {
    return localStorage.getItem(CHAVE_STORAGE) === "lista" ? "lista" : "grade";
  } catch {
    // Navegação privada ou armazenamento bloqueado.
    return VISAO_PADRAO;
  }
}

export function aplicarVisao(visao: Visao): void {
  document.documentElement.dataset.visaoAlunos = visao;
}

export function salvarVisao(visao: Visao): void {
  try {
    localStorage.setItem(CHAVE_STORAGE, visao);
  } catch {
    // Sem armazenamento: a troca vale só nesta visita.
  }
  aplicarVisao(visao);
  avisarMudanca();
}

function avisarMudanca(): void {
  window.dispatchEvent(new Event(EVENTO_MUDANCA));
}

/** Avisa o React quando a visão muda (nesta aba ou em outra). Devolve a função de cancelar. */
export function assinarMudancas(callback: () => void): () => void {
  window.addEventListener(EVENTO_MUDANCA, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENTO_MUDANCA, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Código do script inline. Roda durante a leitura do HTML, antes de a página aparecer. */
export function scriptAplicarVisao(): string {
  return `try{if(localStorage.getItem(${JSON.stringify(CHAVE_STORAGE)})==="lista")document.documentElement.dataset.visaoAlunos="lista"}catch(e){}`;
}

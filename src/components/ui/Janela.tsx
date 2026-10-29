"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface JanelaProps {
  aberta: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
}

/**
 * Janela (modal) sobre a página. Usa o <dialog> nativo, que já cuida de foco,
 * tecla Esc e de bloquear o resto da página.
 * No celular sobe de baixo e ocupa a largura toda; no computador fica centralizada.
 */
export function Janela({ aberta, onFechar, titulo, children }: JanelaProps) {
  const ref = useRef<HTMLDialogElement>(null);

  // Sincroniza o estado do React com o <dialog>.
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberta && !dialogo.open) dialogo.showModal();
    if (!aberta && dialogo.open) dialogo.close();
  }, [aberta]);

  return (
    <dialog
      ref={ref}
      onClose={onFechar}
      aria-labelledby="janela-titulo"
      // Clique no fundo escuro (fora da caixa) fecha a janela.
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50 sm:m-auto sm:max-w-md sm:rounded-2xl"
    >
      {aberta && (
        <div className="flex flex-col gap-5 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-start justify-between gap-3">
            <h2 id="janela-titulo" className="font-display text-xl font-bold">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={onFechar}
              className="-mt-1 -mr-2 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
              aria-label="Fechar"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ABAS_PERFIL, caminhoAba } from "@/lib/perfilAluno";

/** Barra de abas do perfil. No celular rola para o lado dentro dela mesma. */
export function AbasPerfil({ alunoId }: { alunoId: string }) {
  // null na raiz (Resumo); "graduacoes" em /alunos/[id]/graduacoes etc.
  const ativo = useSelectedLayoutSegment();
  return <ListaAbas alunoId={alunoId} ativo={ativo} />;
}

/** Mesmas abas sem nenhuma marcada, enquanto o endereço não é conhecido. */
export function AbasPerfilCarregando({ alunoId }: { alunoId: string }) {
  return <ListaAbas alunoId={alunoId} ativo={undefined} />;
}

function ListaAbas({ alunoId, ativo }: { alunoId: string; ativo: string | null | undefined }) {
  return (
    <nav aria-label="Seções do perfil" className="-mx-4 mt-6 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
      <ul className="flex gap-1">
        {ABAS_PERFIL.map((aba) => {
          const atual = ativo !== undefined && aba.segmento === ativo;
          return (
            <li key={aba.rotulo} className="shrink-0">
              <Link
                href={caminhoAba(alunoId, aba.segmento)}
                aria-current={atual ? "page" : undefined}
                className={`-mb-px inline-flex min-h-11 items-center border-b-2 px-3 text-sm whitespace-nowrap transition-colors ${
                  atual ? "border-accent font-semibold text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {aba.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

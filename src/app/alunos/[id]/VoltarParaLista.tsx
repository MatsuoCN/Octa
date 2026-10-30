"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEnderecoDaLista } from "../ultimaBusca";

/** Volta para a lista de alunos com os mesmos filtros de antes. */
export function VoltarParaLista() {
  return (
    <Link
      href={useEnderecoDaLista()}
      className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden />
      Alunos
    </Link>
  );
}

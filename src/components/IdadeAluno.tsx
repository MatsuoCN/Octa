"use client";

import { Suspense } from "react";
import { calcularIdade, pluralizar } from "@/lib/formatadores";

/**
 * Idade a partir da data de nascimento. Depende da data de hoje: com Cache Components,
 * ler a hora no prerender adia a renderização até o Suspense mais próximo; por isso
 * a idade tem o próprio Suspense e o resto da tela continua saindo pronto do servidor.
 */
export function IdadeAluno({ dataNascimento }: { dataNascimento: string }) {
  return (
    <Suspense fallback={<span className="inline-block h-3 w-12 animate-pulse rounded bg-line align-middle" />}>
      <Idade dataNascimento={dataNascimento} />
    </Suspense>
  );
}

function Idade({ dataNascimento }: { dataNascimento: string }) {
  return <span>{pluralizar(calcularIdade(dataNascimento), "ano", "anos")}</span>;
}

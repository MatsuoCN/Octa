import type { ReactNode } from "react";

interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
}

export function PageHeader({ titulo, descricao, acoes }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-balance md:text-[1.7rem]">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-muted">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

/** Espaço reservado enquanto a tela não é construída. */
export function EmConstrucao({ itens }: { itens: string[] }) {
  return (
    <section className="mt-6 rounded-xl border border-dashed border-line bg-surface p-6">
      <p className="text-sm font-semibold">Tela em construção</p>
      <p className="mt-1 text-sm text-muted">O que vai entrar aqui:</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
        {itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

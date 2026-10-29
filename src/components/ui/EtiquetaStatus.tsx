import type { StatusAluno } from "@/types";

export const STATUS_ALUNO: Record<StatusAluno, { rotulo: string; classes: string }> = {
  em_dia: { rotulo: "Em dia", classes: "bg-ok-soft text-ok" },
  atraso: { rotulo: "Em atraso", classes: "bg-accent-soft text-accent" },
  experimental: { rotulo: "Experimental", classes: "bg-gold-soft text-gold" },
  trancado: { rotulo: "Trancado", classes: "bg-surface-2 text-muted ring-1 ring-line ring-inset" },
  inativo: { rotulo: "Inativo", classes: "bg-surface-2 text-muted ring-1 ring-line ring-inset" },
};

/** Etiqueta de status do aluno. Sempre texto e cor juntos, nunca só cor. */
export function EtiquetaStatus({ status }: { status: StatusAluno }) {
  const { rotulo, classes } = STATUS_ALUNO[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${classes}`}>
      {rotulo}
    </span>
  );
}

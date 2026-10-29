interface ChipModalidadeProps {
  nome: string;
  cor: string;
}

/**
 * Chip de modalidade com a cor dela.
 * A cor vai na bolinha e na borda; o texto fica na cor normal para continuar legível
 * no tema escuro (algumas cores de modalidade são escuras demais para virar texto).
 */
export function ChipModalidade({ nome, cor }: ChipModalidadeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs whitespace-nowrap"
      style={{ borderColor: `color-mix(in srgb, ${cor} 45%, transparent)`, backgroundColor: `color-mix(in srgb, ${cor} 10%, transparent)` }}
    >
      <span className="size-2 rounded-full" style={{ backgroundColor: cor }} aria-hidden="true" />
      {nome}
    </span>
  );
}

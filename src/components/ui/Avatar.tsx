import { BadgeCheck } from "lucide-react";
import { iniciais } from "@/lib/formatadores";

const TAMANHOS = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
} as const;

interface AvatarProps {
  nome: string;
  /** Cor de fundo. Sem ela, usa a cor de destaque suave. */
  cor?: string;
  verificado?: boolean;
  tamanho?: keyof typeof TAMANHOS;
}

/** Avatar com as iniciais do nome e, opcionalmente, o selo de verificado. */
export function Avatar({ nome, cor, verificado = false, tamanho = "md" }: AvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`${TAMANHOS[tamanho]} inline-flex items-center justify-center rounded-full font-semibold ${
          cor ? "text-white" : "bg-accent-soft text-accent"
        }`}
        style={cor ? { backgroundColor: cor } : undefined}
        aria-hidden="true"
      >
        {iniciais(nome)}
      </span>
      {verificado && (
        <BadgeCheck
          className="absolute -right-1 -bottom-1 size-[18px] rounded-full bg-surface fill-ok text-surface"
          aria-label="Cadastro verificado"
          role="img"
        />
      )}
    </span>
  );
}

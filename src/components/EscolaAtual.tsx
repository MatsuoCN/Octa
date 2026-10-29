import { ChevronsUpDown } from "lucide-react";
import { getEscolaAtual, getUsuarioAtual } from "@/lib/api";

const PERFIL: Record<string, string> = {
  dono: "Dono da escola",
  gestor: "Gestor",
  instrutor: "Instrutor",
  recepcao: "Recepção",
};

/** Escola e usuário logados, exibidos no topo da sidebar. Busca os dados via api.ts. */
export async function EscolaAtual() {
  const dados = await Promise.all([getEscolaAtual(), getUsuarioAtual()]).catch(() => null);

  if (!dados) {
    return (
      <div className="rounded-lg border border-side-line px-3 py-2 text-xs text-side-muted">
        Não foi possível carregar a escola. Verifique o backend ou use os dados mockados.
      </div>
    );
  }

  const [escola, usuario] = dados;
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-2 rounded-lg border border-side-line bg-side-hover px-3 py-2 text-left"
      title={`${usuario.nome} · ${PERFIL[usuario.perfil]}`}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-side-ink">{escola.nome}</span>
        <span className="block truncate text-xs text-side-muted">
          {escola.cidade} · {escola.uf} · {usuario.nome.split(" ")[0]}
        </span>
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-side-muted" aria-hidden />
    </button>
  );
}

export function EscolaAtualCarregando() {
  return (
    <div className="rounded-lg border border-side-line bg-side-hover px-3 py-2" aria-busy="true">
      <div className="h-3.5 w-28 animate-pulse rounded bg-side-line" />
      <div className="mt-1.5 h-2.5 w-20 animate-pulse rounded bg-side-line" />
    </div>
  );
}

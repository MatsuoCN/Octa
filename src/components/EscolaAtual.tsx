import { ChevronsUpDown } from "lucide-react";
import { getEscolaAtual, getUsuarioAtual } from "@/lib/api";
import { rotuloDoPerfil } from "@/lib/login";
import { lerSessao } from "@/lib/sessao";
import type { PerfilAcesso } from "@/types";

interface UsuarioExibido {
  nome: string;
  perfil: PerfilAcesso;
}

/**
 * Quem está usando o sistema. Vem da sessão do login de mentira (BASE-05);
 * sem sessão, usa o usuário padrão do mock.
 */
async function buscarUsuarioExibido(): Promise<UsuarioExibido> {
  const sessao = await lerSessao();
  if (sessao) return { nome: sessao.nome, perfil: sessao.perfil };
  const usuario = await getUsuarioAtual();
  return { nome: usuario.nome, perfil: usuario.perfil };
}

/** Escola e usuário logados, exibidos no topo da sidebar. */
export async function EscolaAtual() {
  const dados = await Promise.all([getEscolaAtual(), buscarUsuarioExibido()]).catch(() => null);

  if (!dados) {
    return (
      <div className="rounded-lg border border-side-line px-3 py-2 text-xs text-side-muted">
        Não foi possível carregar a escola. Verifique o backend ou use os dados mockados.
      </div>
    );
  }

  const [escola, usuario] = dados;
  const perfil = rotuloDoPerfil(usuario.perfil);
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-2 rounded-lg border border-side-line bg-side-hover px-3 py-2 text-left"
      title={`${usuario.nome} · ${perfil} · ${escola.cidade}/${escola.uf}`}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-side-ink">{escola.nome}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-side-muted">
          <span className="rounded bg-side-line px-1.5 py-px font-semibold text-side-ink">{perfil}</span>
          <span className="truncate">{usuario.nome.split(" ")[0]}</span>
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Database,
  House,
  LogOut,
  LayoutGrid,
  Menu,
  Server,
  Settings,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import type { FonteDados } from "@/lib/api";
import { OctaMark } from "@/components/OctaMark";
import { sair } from "@/app/login/actions";

interface ItemMenu {
  href: string;
  rotulo: string;
  icone: LucideIcon;
}

export const MENU_PRINCIPAL: ItemMenu[] = [
  { href: "/", rotulo: "Início", icone: House },
  { href: "/alunos", rotulo: "Alunos", icone: Users },
  { href: "/turmas", rotulo: "Turmas", icone: CalendarDays },
  { href: "/financeiro", rotulo: "Financeiro", icone: Wallet },
  { href: "/administrativo", rotulo: "Administrativo", icone: LayoutGrid },
];

export const MENU_RODAPE: ItemMenu[] = [{ href: "/configuracoes", rotulo: "Configurações", icone: Settings }];

function estaAtivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  /** Bloco da escola atual, renderizado no servidor. */
  escola: ReactNode;
  fonteDados: FonteDados;
}

export function Sidebar({ escola, fonteDados }: SidebarProps) {
  const [aberta, setAberta] = useState(false);
  const fechar = () => setAberta(false);

  return (
    <>
      {/* Barra superior no celular */}
      <header className="casca-lateral sticky top-0 z-30 flex items-center gap-3 bg-side px-4 py-3 text-side-ink md:hidden">
        <button
          type="button"
          onClick={() => setAberta(true)}
          className="-ml-1 rounded-md p-1.5 hover:bg-side-hover"
          aria-label="Abrir menu"
          aria-expanded={aberta}
          aria-controls="sidebar"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <OctaMark size={26} />
        <span className="font-display text-lg font-bold">Octa</span>
      </header>

      {/* Fundo escuro do menu aberto no celular */}
      {aberta && (
        <div className="casca-lateral fixed inset-0 z-40 bg-black/50 md:hidden" onClick={fechar} aria-hidden="true" />
      )}

      <aside
        id="sidebar"
        aria-label="Menu principal"
        className={`casca-lateral fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col gap-5 overflow-y-auto bg-side px-3 py-5 text-side-ink transition-transform md:sticky md:top-0 md:z-auto md:h-screen md:w-auto md:translate-x-0 ${
          aberta ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" onClick={fechar} className="flex items-center gap-2.5">
            <OctaMark />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-tight">Octa</span>
              <span className="block text-xs text-side-muted">Federação Pa-Kua</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={fechar}
            className="rounded-md p-1.5 hover:bg-side-hover md:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {escola}

        <nav className="flex flex-1 flex-col">
          {/*
            usePathname() só é conhecido na requisição em rotas com parâmetro (ex.: /alunos/[id]).
            Com Cache Components, ele precisa ficar dentro de Suspense; o fallback é o mesmo menu sem item ativo.
          */}
          <Suspense fallback={<Menus pathname={null} onNavegar={fechar} />}>
            <MenusComRota onNavegar={fechar} />
          </Suspense>
        </nav>

        <form action={sair}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[0.93rem] text-side-ink/80 transition-colors hover:bg-side-hover hover:text-side-ink"
          >
            <LogOut className="size-[18px] shrink-0" aria-hidden />
            Sair
          </button>
        </form>

        <div
          className="flex items-center gap-2 px-3 text-xs text-side-muted"
          title="Definido por NEXT_PUBLIC_DATA_SOURCE"
        >
          {fonteDados === "mock" ? (
            <Database className="size-3.5" aria-hidden />
          ) : (
            <Server className="size-3.5" aria-hidden />
          )}
          {fonteDados === "mock" ? "Dados mockados" : "Dados do backend"}
        </div>
      </aside>
    </>
  );
}

function MenusComRota({ onNavegar }: { onNavegar: () => void }) {
  return <Menus pathname={usePathname()} onNavegar={onNavegar} />;
}

function Menus({ pathname, onNavegar }: { pathname: string | null; onNavegar: () => void }) {
  const renderItem = ({ href, rotulo, icone: Icone }: ItemMenu) => {
    const ativo = pathname !== null && estaAtivo(pathname, href);
    return (
      <li key={href}>
        <Link
          href={href}
          onClick={onNavegar}
          aria-current={ativo ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.93rem] transition-colors ${
            ativo
              ? "bg-[#A51F24] font-semibold text-white"
              : "text-side-ink/80 hover:bg-side-hover hover:text-side-ink"
          }`}
        >
          <Icone className="size-[18px] shrink-0" aria-hidden />
          {rotulo}
        </Link>
      </li>
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-0.5">{MENU_PRINCIPAL.map(renderItem)}</ul>
      <ul className="mt-auto flex flex-col gap-0.5 border-t border-side-line pt-3">{MENU_RODAPE.map(renderItem)}</ul>
    </>
  );
}

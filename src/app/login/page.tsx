import type { Metadata } from "next";
import { OctaMark } from "@/components/OctaMark";
import { FormularioLogin } from "./FormularioLogin";

export const metadata: Metadata = { title: "Entrar" };

/**
 * Tela de login (BASE-05). O atributo data-tela-cheia faz o layout esconder
 * a sidebar nesta página (regra em globals.css).
 */
export default function LoginPage() {
  return (
    <div data-tela-cheia className="flex min-h-[calc(100dvh-3rem)] items-center justify-center md:min-h-[calc(100dvh-4rem)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <OctaMark size={48} />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Entrar no Octa</h1>
            <p className="mt-1 text-sm text-muted">Gestão das escolas da Federação Pa-Kua</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <FormularioLogin />
        </div>
      </div>
    </div>
  );
}

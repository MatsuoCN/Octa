import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EscolaAtual, EscolaAtualCarregando } from "@/components/EscolaAtual";
import { FONTE_PADRAO } from "@/lib/api";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: { default: "Octa", template: "%s · Octa" },
  description: "Sistema de gestão das escolas Pa-Kua",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <div className="casca-app md:grid md:min-h-screen md:grid-cols-[240px_minmax(0,1fr)]">
          <Sidebar
            fonteDados={FONTE_PADRAO}
            escola={
              <Suspense fallback={<EscolaAtualCarregando />}>
                <EscolaAtual />
              </Suspense>
            }
          />
          <main className="min-w-0 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

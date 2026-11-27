"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { momentoNaEscola } from "@/lib/horarioEscola";

/** Minutos desde a meia-noite: "18:30" -> 1110. */
const emMinutos = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Atualiza a página (busca os dados de novo no servidor) no próximo horário da lista,
 * por exemplo quando uma aula termina e a "próxima" passa a ser outra.
 * Também atualiza quando a aba volta a ficar visível, para não mostrar um dia velho.
 * Não desenha nada.
 */
export function AtualizarNoHorario({ horarios }: { horarios: string[] }) {
  const router = useRouter();

  useEffect(() => {
    const agora = momentoNaEscola(new Date()).hora;
    const proximo = horarios.find((h) => h > agora);
    // Depois do último horário do dia, atualiza na virada para o dia seguinte.
    const minutosAte = (proximo ? emMinutos(proximo) : 24 * 60) - emMinutos(agora);
    const segundos = new Date().getSeconds();
    // +2 s de folga para o servidor já enxergar o novo minuto.
    const espera = Math.max(1, minutosAte * 60 - segundos + 2) * 1000;
    const timer = setTimeout(() => router.refresh(), espera);

    const aoVoltar = () => document.visibilityState === "visible" && router.refresh();
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [horarios, router]);

  return null;
}

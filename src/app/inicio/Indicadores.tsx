import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getIndicadoresInicio } from "@/lib/api";
import { formatarMoeda, pluralizar } from "@/lib/formatadores";
import { CAMINHO_PARCELAS_ATRASADAS, percentual } from "@/lib/inicio";
import { buscarDadosDoDia } from "./dadosDoDia";

const CLASSE_GRADE = "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5";
const CLASSE_CARTAO = "flex h-full flex-col gap-1 rounded-xl border border-line bg-surface p-4";

/** Os cinco cartões de indicadores do Início (INICIO-02). Precisa ficar dentro de um <Suspense>. */
export async function Indicadores() {
  const { agora } = await buscarDadosDoDia();
  const dados = await getIndicadoresInicio(agora.data).catch(() => null);

  if (!dados) {
    return (
      <p className="mt-6 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        Não foi possível carregar os indicadores. Verifique o backend ou use os dados mockados.
      </p>
    );
  }

  const emAtraso = dados.valorEmAtraso > 0;

  return (
    <section aria-label="Indicadores do dia" className={CLASSE_GRADE}>
      <Cartao rotulo="Matrículas ativas" valor={String(dados.matriculasAtivas)}>
        +{dados.novasMatriculasMes} no mês · {pluralizar(dados.trancadas, "trancada", "trancadas")}
      </Cartao>

      <Cartao rotulo="Presença hoje" valor={String(dados.presencaHoje)} complemento={`de ${dados.capacidadeHoje}`}>
        nas chamadas já feitas
      </Cartao>

      <Cartao rotulo="Recebido no mês" valor={formatarMoeda(dados.recebidoMes)}>
        <Barra percentual={percentual(dados.recebidoMes, dados.previstoMes)} />
        <span className="mt-1 block">
          {percentual(dados.recebidoMes, dados.previstoMes)}% de {formatarMoeda(dados.previstoMes)} previstos
        </span>
      </Cartao>

      <Link href={CAMINHO_PARCELAS_ATRASADAS} className="group rounded-xl focus-visible:outline-offset-2">
        <Cartao
          rotulo="Em atraso"
          valor={formatarMoeda(dados.valorEmAtraso)}
          destaque={emAtraso}
          seta
          classeExtra="transition-colors group-hover:border-muted/50"
        >
          {emAtraso ? pluralizar(dados.alunosEmAtraso, "aluno", "alunos") : "Ninguém em atraso"}
        </Cartao>
      </Link>

      <Cartao rotulo="Leads novos" valor={String(dados.leadsNovos)} classeExtra="col-span-2 lg:col-span-1">
        aguardando primeiro contato
      </Cartao>
    </section>
  );
}

interface CartaoProps {
  rotulo: string;
  valor: string;
  complemento?: string;
  /** Valor em vermelho (ex.: atraso maior que zero). */
  destaque?: boolean;
  seta?: boolean;
  classeExtra?: string;
  children: ReactNode;
}

function Cartao({ rotulo, valor, complemento, destaque = false, seta = false, classeExtra = "", children }: CartaoProps) {
  return (
    <div className={`${CLASSE_CARTAO} ${classeExtra}`}>
      <p className="flex items-center justify-between gap-2 text-sm text-muted">
        {rotulo}
        {seta && <ChevronRight className="size-4" aria-hidden />}
      </p>
      <p className={`font-display text-2xl font-bold tabular-nums ${destaque ? "text-accent" : ""}`}>
        {valor}
        {complemento && <span className="ml-1 text-base font-medium text-muted">{complemento}</span>}
      </p>
      <div className="mt-auto text-xs text-muted">{children}</div>
    </div>
  );
}

function Barra({ percentual }: { percentual: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
      <div className="h-full rounded-full bg-ok" style={{ width: `${percentual}%` }} />
    </div>
  );
}

/** Esqueleto: um por cartão, no mesmo lugar. */
export function IndicadoresCarregando() {
  return (
    <div className={CLASSE_GRADE} aria-busy="true" aria-label="Carregando indicadores">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`${CLASSE_CARTAO} ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
          <div className="h-4 w-24 animate-pulse rounded bg-line" />
          <div className="mt-1 h-7 w-20 animate-pulse rounded bg-line" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

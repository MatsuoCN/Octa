import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { caminhoPerfil } from "@/lib/alunos";
import { getAlunos, getContratos, getEscolaAtual, getParcelas, getPlanos } from "@/lib/api";
import { linkDeCobranca, montarAlunosParaCobrar, type AlunoParaCobrar } from "@/lib/cobrarHoje";
import { formatarData, formatarMoeda, pluralizar } from "@/lib/formatadores";
import { CAMINHO_PARCELAS_ATRASADAS } from "@/lib/inicio";

async function buscarDados() {
  try {
    const [parcelas, alunos, contratos, planos, escola] = await Promise.all([
      getParcelas({ situacao: "atrasada" }),
      getAlunos(),
      getContratos(),
      getPlanos(),
      getEscolaAtual(),
    ]);
    return { itens: montarAlunosParaCobrar(parcelas, alunos, contratos, planos), escolaNome: escola.nome };
  } catch {
    return null;
  }
}

/** Bloco "Cobrar hoje" do Início (INICIO-04). Precisa ficar dentro de um <Suspense>. */
export async function CobrarHoje() {
  const dados = await buscarDados();

  if (!dados) {
    return (
      <Moldura>
        <p className="p-4 text-sm text-muted">Não foi possível carregar as cobranças. Verifique o backend ou use os dados mockados.</p>
      </Moldura>
    );
  }

  return (
    <Moldura quantidade={dados.itens.length}>
      {dados.itens.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted">Nenhum aluno em atraso</p>
      ) : (
        <ul className="divide-y divide-line">
          {dados.itens.map((item) => (
            <LinhaCobranca key={item.alunoId} item={item} escolaNome={dados.escolaNome} />
          ))}
        </ul>
      )}
    </Moldura>
  );
}

function Moldura({ quantidade, children }: { quantidade?: number; children: ReactNode }) {
  return (
    <section aria-labelledby="titulo-cobrar-hoje" className="mt-6 rounded-xl border border-line bg-surface">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="titulo-cobrar-hoje" className="font-display text-lg font-bold">
          Cobrar hoje
          {quantidade !== undefined && quantidade > 0 && (
            <span className="ml-2 text-sm font-normal text-muted">{pluralizar(quantidade, "aluno", "alunos")}</span>
          )}
        </h2>
        <Link
          href={CAMINHO_PARCELAS_ATRASADAS}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          Ver todos
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>
      {children}
    </section>
  );
}

function LinhaCobranca({ item, escolaNome }: { item: AlunoParaCobrar; escolaNome: string }) {
  const whatsapp = linkDeCobranca(item, escolaNome);

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Avatar nome={item.nome} tamanho="sm" />
      <div className="min-w-0 flex-1">
        <Link href={caminhoPerfil(item.alunoId)} className="block truncate font-semibold hover:underline">
          {item.nome}
        </Link>
        <p className="truncate text-sm text-muted">
          {item.quantidadeParcelas > 1 ? `${item.quantidadeParcelas} parcelas · desde ` : "Venceu em "}
          {formatarData(item.vencimento)}
          {item.planoNome && ` · ${item.planoNome}`}
        </p>
      </div>
      <p className="shrink-0 font-semibold text-accent tabular-nums">{formatarMoeda(item.valorEmAtraso)}</p>
      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Cobrar ${item.nome} pelo WhatsApp`}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold hover:bg-surface-2"
        >
          <MessageCircle className="size-4" aria-hidden />
          {/* No celular, só o ícone. */}
          <span className="hidden sm:inline">Cobrar</span>
        </a>
      ) : (
        <span className="shrink-0 text-xs text-muted">Telefone inválido</span>
      )}
    </li>
  );
}

export function CobrarHojeCarregando() {
  return (
    <div className="mt-6 rounded-xl border border-line bg-surface" aria-busy="true" aria-label="Carregando cobranças">
      <div className="border-b border-line px-4 py-4">
        <div className="h-5 w-32 animate-pulse rounded bg-line" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-b border-line px-4 py-4 last:border-b-0">
          <div className="size-9 animate-pulse rounded-full bg-line" />
          <div className="h-8 flex-1 animate-pulse rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

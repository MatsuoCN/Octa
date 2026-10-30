"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, type MouseEvent, type ReactNode } from "react";
import { LayoutGrid, List, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ChipModalidade } from "@/components/ui/ChipModalidade";
import { EtiquetaStatus } from "@/components/ui/EtiquetaStatus";
import {
  calcularSituacaoFinanceira,
  caminhoPerfil,
  type LinhaAluno,
  type ModalidadeResumida,
  type SituacaoFinanceira,
} from "@/lib/alunos";
import { calcularIdade, formatarMesAno, formatarMoeda, formatarTelefone, pluralizar } from "@/lib/formatadores";
import { scriptAplicarVisao, type Visao } from "./preferenciaVisao";
import { useVisaoAlunos } from "./useVisaoAlunos";

/* ======================================================================
 * Componente principal
 *
 * As duas visões saem prontas do servidor; o CSS mostra só a escolhida
 * (ver preferenciaVisao.ts).
 * ==================================================================== */

interface VisaoAlunosProps {
  alunos: LinhaAluno[];
  /** Texto à esquerda do botão grade/lista, ex.: "16 alunos" ou "3 de 16 alunos". */
  resumo: ReactNode;
}

export function VisaoAlunos({ alunos, resumo }: VisaoAlunosProps) {
  const [visao, trocarVisao] = useVisaoAlunos();

  return (
    <>
      <ScriptInline codigo={scriptAplicarVisao()} />

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{resumo}</p>
        <AlternarVisao visao={visao} onTrocar={trocarVisao} />
      </div>

      <div data-so-visao="grade" className="mt-3">
        <GradeAlunos alunos={alunos} />
      </div>
      <div data-so-visao="lista" className="mt-3">
        <TabelaAlunos alunos={alunos} />
      </div>
    </>
  );
}

/**
 * Script que roda durante a leitura do HTML, só no carregamento completo da página.
 * No navegador vira texto inerte, para o React não reclamar de <script> renderizado.
 */
function ScriptInline({ codigo }: { codigo: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: codigo }}
    />
  );
}

/* ======================================================================
 * Botão grade/lista
 * ==================================================================== */

const OPCOES_VISAO: { valor: Visao; rotulo: string; icone: LucideIcon }[] = [
  { valor: "grade", rotulo: "Grade", icone: LayoutGrid },
  { valor: "lista", rotulo: "Lista", icone: List },
];

interface AlternarVisaoProps {
  visao: Visao;
  onTrocar: (visao: Visao) => void;
}

function AlternarVisao({ visao, onTrocar }: AlternarVisaoProps) {
  return (
    <div role="group" aria-label="Modo de exibição" className="inline-flex rounded-lg border border-line bg-surface p-1">
      {OPCOES_VISAO.map((opcao) => (
        <BotaoVisao key={opcao.valor} {...opcao} ativo={visao === opcao.valor} onClick={() => onTrocar(opcao.valor)} />
      ))}
    </div>
  );
}

interface BotaoVisaoProps {
  rotulo: string;
  icone: LucideIcon;
  ativo: boolean;
  onClick: () => void;
}

function BotaoVisao({ rotulo, icone: Icone, ativo, onClick }: BotaoVisaoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm transition-colors ${
        ativo ? "bg-ink text-surface" : "text-muted hover:text-ink"
      }`}
    >
      <Icone className="size-4" aria-hidden />
      <span className="sr-only sm:not-sr-only">{rotulo}</span>
    </button>
  );
}

/* ======================================================================
 * Modo grade
 * ==================================================================== */

function GradeAlunos({ alunos }: { alunos: LinhaAluno[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {alunos.map((aluno) => (
        <li key={aluno.id}>
          <CardAluno aluno={aluno} />
        </li>
      ))}
    </ul>
  );
}

function CardAluno({ aluno }: { aluno: LinhaAluno }) {
  return (
    <Link
      href={caminhoPerfil(aluno.id)}
      className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted/50"
    >
      <CabecalhoCard aluno={aluno} />
      <ListaModalidades modalidades={aluno.modalidades} />
      <p className="mt-auto border-t border-line pt-3 text-sm">
        <TextoSituacao situacao={calcularSituacaoFinanceira(aluno)} />
      </p>
    </Link>
  );
}

function CabecalhoCard({ aluno }: { aluno: LinhaAluno }) {
  return (
    <div className="flex items-start gap-3">
      <AvatarAluno aluno={aluno} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{aluno.nome}</p>
        <p className="text-sm text-muted">
          <IdadeComCarregamento dataNascimento={aluno.dataNascimento} /> ·{" "}
          <span className="whitespace-nowrap">desde {formatarMesAno(aluno.alunoDesde)}</span>
        </p>
      </div>
      <EtiquetaStatus status={aluno.status} />
    </div>
  );
}

/** Texto do rodapé do card, conforme a situação calculada em lib/alunos.ts. */
function TextoSituacao({ situacao }: { situacao: SituacaoFinanceira }) {
  switch (situacao.tipo) {
    case "atraso":
      return <span className="font-semibold text-accent">{formatarMoeda(situacao.valor)} em atraso</span>;
    case "trancado":
      return <span className="text-muted">Matrícula trancada</span>;
    case "vencimento":
      return <span className="text-muted">Vence todo dia {situacao.dia}</span>;
    case "experimental":
      return <span className="text-muted">Em aula experimental, sem plano</span>;
    case "sem_plano":
      return <span className="text-muted">Sem plano ativo</span>;
  }
}

/* ======================================================================
 * Modo lista
 * ==================================================================== */

const COLUNAS = ["Aluno", "Modalidades", "Plano", "Status", "Em atraso"];

function TabelaAlunos({ alunos }: { alunos: LinhaAluno[] }) {
  return (
    // A tabela rola para o lado dentro do próprio card, sem empurrar a página.
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <CabecalhoTabela />
        <tbody className="divide-y divide-line">
          {alunos.map((aluno) => (
            <LinhaTabela key={aluno.id} aluno={aluno} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CabecalhoTabela() {
  return (
    <thead className="border-b border-line bg-surface-2 text-xs text-muted">
      <tr>
        {COLUNAS.map((coluna, i) => (
          <th key={coluna} scope="col" className={`px-4 py-3 font-semibold ${i === COLUNAS.length - 1 ? "text-right" : ""}`}>
            {coluna}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function LinhaTabela({ aluno }: { aluno: LinhaAluno }) {
  const router = useRouter();
  const abrirPerfil = () => router.push(caminhoPerfil(aluno.id));

  return (
    // A linha inteira abre o perfil no clique; pelo teclado, o link no nome faz o mesmo.
    <tr onClick={abrirPerfil} className="cursor-pointer transition-colors hover:bg-surface-2">
      <td className="px-4 py-3">
        <CelulaAluno aluno={aluno} />
      </td>
      <td className="px-4 py-3">
        <ListaModalidades modalidades={aluno.modalidades} />
      </td>
      <td className="px-4 py-3 text-muted">{aluno.planoNome ?? "—"}</td>
      <td className="px-4 py-3">
        <EtiquetaStatus status={aluno.status} />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
        <ValorEmAtraso valor={aluno.valorEmAtraso} />
      </td>
    </tr>
  );
}

function CelulaAluno({ aluno }: { aluno: LinhaAluno }) {
  // Evita que o clique no link dispare também o clique da linha.
  const pararPropagacao = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className="flex items-center gap-3">
      <AvatarAluno aluno={aluno} tamanho="sm" />
      <div className="min-w-0 whitespace-nowrap">
        <Link href={caminhoPerfil(aluno.id)} onClick={pararPropagacao} className="block font-semibold hover:underline">
          {aluno.nome}
        </Link>
        <span className="block text-xs text-muted">{formatarTelefone(aluno.telefone)}</span>
      </div>
    </div>
  );
}

function ValorEmAtraso({ valor }: { valor: number }) {
  if (valor <= 0) return <span className="text-muted">—</span>;
  return <span className="font-semibold text-accent">{formatarMoeda(valor)}</span>;
}

/* ======================================================================
 * Peças usadas nos dois modos
 * ==================================================================== */

function AvatarAluno({ aluno, tamanho = "md" }: { aluno: LinhaAluno; tamanho?: "sm" | "md" }) {
  // A cor do avatar é a da primeira modalidade do aluno.
  return <Avatar nome={aluno.nome} cor={aluno.modalidades[0]?.cor} verificado={aluno.verificado} tamanho={tamanho} />;
}

function ListaModalidades({ modalidades }: { modalidades: ModalidadeResumida[] }) {
  if (modalidades.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {modalidades.map((m) => (
        <ChipModalidade key={m.id} nome={m.nome} cor={m.cor} />
      ))}
    </div>
  );
}

/**
 * A idade depende da data de hoje. Com Cache Components, ler a hora atual no
 * prerender adia a renderização até o Suspense mais próximo; por isso cada idade
 * tem o seu Suspense, e o resto do card continua saindo pronto do servidor.
 */
function IdadeComCarregamento({ dataNascimento }: { dataNascimento: string }) {
  if (!dataNascimento) return <span>idade não informada</span>;
  return (
    <Suspense fallback={<span className="inline-block h-3 w-12 animate-pulse rounded bg-line align-middle" />}>
      <Idade dataNascimento={dataNascimento} />
    </Suspense>
  );
}

function Idade({ dataNascimento }: { dataNascimento: string }) {
  return <span>{pluralizar(calcularIdade(dataNascimento), "ano", "anos")}</span>;
}

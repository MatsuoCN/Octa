"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { CampoSelecao } from "@/components/ui/Campo";
import type { LinhaAluno } from "@/lib/alunos";
import {
  FILTROS_VAZIOS,
  PILULAS_STATUS,
  contarPorStatus,
  filtrarAlunos,
  filtrosParaQuery,
  lerFiltros,
  temFiltroAtivo,
  type FiltrosAlunos,
} from "@/lib/filtrosAlunos";
import { pluralizar } from "@/lib/formatadores";
import type { StatusAluno } from "@/types";
import { salvarUltimaBusca } from "./ultimaBusca";
import { VisaoAlunos } from "./VisaoAlunos";

export interface Opcao {
  valor: string;
  rotulo: string;
}

interface AlunosComFiltrosProps {
  alunos: LinhaAluno[];
  modalidades: Opcao[];
  turmas: Opcao[];
}

/**
 * Lista de alunos com busca e filtros (ALUNOS-02).
 * Os filtros vêm do endereço da página; mudar um filtro só troca o endereço
 * (replaceState), sem nova busca no servidor: a lista da escola já está aqui.
 */
export function AlunosComFiltros({ alunos, modalidades, turmas }: AlunosComFiltrosProps) {
  const query = useSearchParams().toString();
  const filtros = lerFiltros(new URLSearchParams(query));

  // O texto digitado fica num estado próprio, para o campo responder na hora.
  const [busca, setBusca] = useState(filtros.busca);

  // Lembra a busca atual para o botão "Alunos" do perfil (também quando a página abre já filtrada).
  useEffect(() => {
    salvarUltimaBusca(query ? `?${query}` : "");
  }, [query]);

  function aplicar(novos: FiltrosAlunos) {
    window.history.replaceState(null, "", `/alunos${filtrosParaQuery(novos)}`);
  }

  const mudar = (parcial: Partial<FiltrosAlunos>) => aplicar({ ...filtros, busca, ...parcial });

  function limpar() {
    setBusca("");
    aplicar(FILTROS_VAZIOS);
  }

  const filtrosAtuais = { ...filtros, busca };
  const visiveis = filtrarAlunos(alunos, filtrosAtuais);
  const contagem = contarPorStatus(alunos, filtrosAtuais);
  const filtrando = temFiltroAtivo(filtrosAtuais);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <CampoBusca
        valor={busca}
        onMudar={(texto) => {
          setBusca(texto);
          mudar({ busca: texto });
        }}
      />

      <PilulasStatus selecionado={filtros.status} contagem={contagem} onEscolher={(status) => mudar({ status })} />

      <div className="grid grid-cols-2 gap-3 lg:max-w-xl">
        <CampoSelecao
          id="filtro-modalidade"
          rotulo="Modalidade"
          vazio="Todas"
          opcoes={modalidades}
          value={filtros.modalidadeId}
          onChange={(e) => mudar({ modalidadeId: e.target.value })}
        />
        <CampoSelecao
          id="filtro-turma"
          rotulo="Turma"
          vazio="Todas"
          opcoes={turmas}
          value={filtros.turmaId}
          onChange={(e) => mudar({ turmaId: e.target.value })}
        />
      </div>

      {visiveis.length === 0 ? (
        <NadaEncontrado onLimpar={limpar} />
      ) : (
        <VisaoAlunos
          alunos={visiveis}
          resumo={
            filtrando ? (
              <span>
                {visiveis.length} de {pluralizar(alunos.length, "aluno", "alunos")} ·{" "}
                <BotaoTexto onClick={limpar}>Limpar filtros</BotaoTexto>
              </span>
            ) : (
              pluralizar(alunos.length, "aluno", "alunos")
            )
          }
        />
      )}
    </div>
  );
}

/* ======================================================================
 * Peças
 * ==================================================================== */

function CampoBusca({ valor, onMudar }: { valor: string; onMudar: (texto: string) => void }) {
  return (
    <div className="relative">
      <label htmlFor="busca-alunos" className="sr-only">
        Buscar aluno por nome, CPF ou telefone
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        id="busca-alunos"
        type="search"
        enterKeyHint="search"
        placeholder="Nome, CPF ou telefone"
        value={valor}
        onChange={(e) => onMudar(e.target.value)}
        className="min-h-11 w-full rounded-lg border border-line bg-surface pr-11 pl-9 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onMudar("")}
          aria-label="Apagar busca"
          className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

interface PilulasStatusProps {
  selecionado: StatusAluno | "";
  contagem: Record<StatusAluno | "", number>;
  onEscolher: (status: StatusAluno | "") => void;
}

function PilulasStatus({ selecionado, contagem, onEscolher }: PilulasStatusProps) {
  return (
    // No celular as pílulas rolam para o lado dentro da própria faixa.
    <div role="group" aria-label="Filtrar por status" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {PILULAS_STATUS.map(({ valor, rotulo }) => {
        const ativo = selecionado === valor;
        return (
          <button
            key={valor || "todos"}
            type="button"
            aria-pressed={ativo}
            onClick={() => onEscolher(valor)}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors ${
              ativo ? "border-ink bg-ink text-surface" : "border-line bg-surface text-ink hover:border-muted"
            }`}
          >
            {rotulo}
            <span className={`tabular-nums ${ativo ? "opacity-80" : "text-muted"}`}>{contagem[valor]}</span>
          </button>
        );
      })}
    </div>
  );
}

function NadaEncontrado({ onLimpar }: { onLimpar: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-center">
      <p className="font-semibold">Nenhum aluno encontrado</p>
      <p className="mt-1 text-sm text-muted">Confira a grafia ou tire algum filtro.</p>
      <button
        type="button"
        onClick={onLimpar}
        className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
      >
        Limpar filtros
      </button>
    </div>
  );
}

function BotaoTexto({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="font-semibold text-ink underline underline-offset-2">
      {children}
    </button>
  );
}

import { Ban, ChevronDown, Lock, MessageCircle, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ChipModalidade } from "@/components/ui/ChipModalidade";
import { EtiquetaStatus } from "@/components/ui/EtiquetaStatus";
import { IdadeAluno } from "@/components/IdadeAluno";
import type { ModalidadeResumida } from "@/lib/alunos";
import { generoExibido, linkWhatsApp } from "@/lib/perfilAluno";
import type { Aluno } from "@/types";

interface CabecalhoPerfilProps {
  aluno: Aluno;
  modalidades: ModalidadeResumida[];
}

export function CabecalhoPerfil({ aluno, modalidades }: CabecalhoPerfilProps) {
  const genero = generoExibido(aluno.genero);

  return (
    <header className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4 md:flex-row md:items-start md:justify-between md:p-5">
      <div className="flex min-w-0 items-start gap-4">
        {/* Foto ainda não existe no cadastro: por enquanto, as iniciais. */}
        <Avatar nome={aluno.nome} cor={modalidades[0]?.cor} verificado={aluno.verificado} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-display text-2xl font-bold tracking-tight text-balance">{aluno.nome}</h1>
            <EtiquetaStatus status={aluno.status} />
          </div>
          <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-muted">
            <IdadeAluno dataNascimento={aluno.dataNascimento} />
            {genero && <Separado>{genero}</Separado>}
            {aluno.cpf && <Separado>CPF {aluno.cpf}</Separado>}
          </p>
          {modalidades.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {modalidades.map((m) => (
                <ChipModalidade key={m.id} nome={m.nome} cor={m.cor} />
              ))}
            </div>
          )}
        </div>
      </div>
      <AcoesPerfil telefone={aluno.telefone} />
    </header>
  );
}

function Separado({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden>·</span>
      <span className="whitespace-nowrap">{children}</span>
    </>
  );
}

/* ---------- Botões ---------- */

const CLASSE_BOTAO =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2";

function AcoesPerfil({ telefone }: { telefone: string }) {
  const whatsapp = linkWhatsApp(telefone);

  return (
    <div className="flex flex-wrap gap-2 md:shrink-0 md:justify-end">
      {/* TODO(ALUNOS-04): abrir o cadastro completo. */}
      <button
        type="button"
        disabled
        title="Chega com o cadastro completo (ALUNOS-04)"
        className={`${CLASSE_BOTAO} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <Pencil className="size-4" aria-hidden />
        Cadastro
      </button>

      {whatsapp ? (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={CLASSE_BOTAO}>
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </a>
      ) : (
        <button type="button" disabled title="Telefone inválido" className={`${CLASSE_BOTAO} opacity-60`}>
          <MessageCircle className="size-4" aria-hidden />
          WhatsApp
        </button>
      )}

      <MaisAcoes />
    </div>
  );
}

/** Menu "Mais ações". Usa <details>, que abre e fecha sem JavaScript. */
function MaisAcoes() {
  return (
    <details className="group relative">
      <summary className={`${CLASSE_BOTAO} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
        Mais ações
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <ul className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-line bg-surface p-1 shadow-lg">
        {/* TODO(ALUNOS-11): ligar trancar e encerrar. */}
        <ItemMenu icone={<Lock className="size-4" aria-hidden />}>Trancar matrícula</ItemMenu>
        <ItemMenu icone={<Ban className="size-4" aria-hidden />} perigo>
          Encerrar matrícula
        </ItemMenu>
      </ul>
    </details>
  );
}

function ItemMenu({ icone, perigo = false, children }: { icone: ReactNode; perigo?: boolean; children: ReactNode }) {
  return (
    <li>
      <button
        type="button"
        disabled
        title="Chega com trancar e encerrar matrícula (ALUNOS-11)"
        className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
          perigo ? "text-accent" : ""
        }`}
      >
        {icone}
        {children}
      </button>
    </li>
  );
}

export function CabecalhoPerfilCarregando() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5" aria-busy="true" aria-label="Carregando aluno">
      <div className="flex items-start gap-4">
        <div className="size-12 animate-pulse rounded-full bg-line" />
        <div className="flex-1">
          <div className="h-7 w-56 animate-pulse rounded bg-line" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-line" />
        </div>
      </div>
    </div>
  );
}

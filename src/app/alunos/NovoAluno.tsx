"use client";

import Link from "next/link";
import { useState, useTransition, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";
import { CircleCheck, TriangleAlert, UserPlus } from "lucide-react";
import { CampoSelecao, CampoTexto } from "@/components/ui/Campo";
import { Janela } from "@/components/ui/Janela";
import { caminhoPerfil } from "@/lib/alunos";
import {
  CAMPOS_VAZIOS,
  ehMenorDeIdade,
  formatarCpfDigitado,
  formatarTelefoneDigitado,
  temErros,
  validarCadastro,
  type CamposCadastro,
  type ErrosCadastro,
} from "@/lib/cadastroAluno";
import {
  cadastrarAluno,
  colocarEmAulaExperimental,
  vincularAluno,
  type AlunoResumo,
  type ResultadoCadastro,
} from "./actions";

export interface OpcaoModalidade {
  valor: string;
  rotulo: string;
}

/** Em que ponto da janela a pessoa está. */
type Etapa =
  | { tipo: "formulario" }
  | { tipo: "duplicado_nesta_escola"; aluno: AlunoResumo }
  | { tipo: "duplicado_outra_escola"; aluno: AlunoResumo; escolas: string[] }
  | { tipo: "salvo"; aluno: AlunoResumo; vinculo: boolean };

/* ======================================================================
 * Botão + janela
 * ==================================================================== */

export function NovoAluno({ modalidades }: { modalidades: OpcaoModalidade[] }) {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110"
      >
        <UserPlus className="size-4" aria-hidden />
        Novo aluno
      </button>
      <Janela aberta={aberta} onFechar={() => setAberta(false)} titulo="Novo aluno">
        {/* Só monta o conteúdo com a janela aberta: assim cada abertura começa do zero. */}
        <CadastroRapido modalidades={modalidades} onConcluir={() => setAberta(false)} />
      </Janela>
    </>
  );
}

/* ======================================================================
 * Fluxo do cadastro
 * ==================================================================== */

interface CadastroRapidoProps {
  modalidades: OpcaoModalidade[];
  onConcluir: () => void;
}

function CadastroRapido({ modalidades, onConcluir }: CadastroRapidoProps) {
  const [campos, setCampos] = useState<CamposCadastro>(CAMPOS_VAZIOS);
  const [erros, setErros] = useState<ErrosCadastro>({});
  const [etapa, setEtapa] = useState<Etapa>({ tipo: "formulario" });
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, iniciarTransicao] = useTransition();

  /** Aplica a resposta do servidor na tela. */
  function tratarResultado(resultado: ResultadoCadastro) {
    setErroGeral(null);
    if (resultado.tipo === "invalido") setErros(resultado.erros);
    else if (resultado.tipo === "erro") setErroGeral(resultado.mensagem);
    else setEtapa(resultado);
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const errosLocais = validarCadastro(campos);
    setErros(errosLocais);
    if (temErros(errosLocais)) return;
    iniciarTransicao(async () => tratarResultado(await cadastrarAluno(campos)));
  }

  function criarVinculo(alunoId: string) {
    iniciarTransicao(async () => tratarResultado(await vincularAluno(alunoId)));
  }

  function marcarExperimental(alunoId: string) {
    iniciarTransicao(async () => {
      const resposta = await colocarEmAulaExperimental(alunoId);
      if (resposta.ok) onConcluir();
      else setErroGeral(resposta.mensagem ?? null);
    });
  }

  const voltarAoFormulario = () => setEtapa({ tipo: "formulario" });

  return (
    <>
      {erroGeral && (
        <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
          {erroGeral}
        </p>
      )}

      {etapa.tipo === "formulario" && (
        <FormularioCadastro
          campos={campos}
          erros={erros}
          modalidades={modalidades}
          salvando={salvando}
          onMudar={(novos) => setCampos(novos)}
          onSalvar={salvar}
        />
      )}

      {etapa.tipo === "duplicado_nesta_escola" && (
        <AvisoJaCadastrado aluno={etapa.aluno} onVoltar={voltarAoFormulario} />
      )}

      {etapa.tipo === "duplicado_outra_escola" && (
        <AvisoOutraEscola
          aluno={etapa.aluno}
          escolas={etapa.escolas}
          salvando={salvando}
          onVincular={() => criarVinculo(etapa.aluno.id)}
          onVoltar={voltarAoFormulario}
        />
      )}

      {etapa.tipo === "salvo" && (
        <ProximoPasso
          aluno={etapa.aluno}
          vinculo={etapa.vinculo}
          salvando={salvando}
          onExperimental={() => marcarExperimental(etapa.aluno.id)}
          onDepois={onConcluir}
        />
      )}
    </>
  );
}

/* ======================================================================
 * Etapa 1: formulário
 * ==================================================================== */

interface FormularioCadastroProps {
  campos: CamposCadastro;
  erros: ErrosCadastro;
  modalidades: OpcaoModalidade[];
  salvando: boolean;
  onMudar: (campos: CamposCadastro) => void;
  onSalvar: (e: FormEvent) => void;
}

function FormularioCadastro({ campos, erros, modalidades, salvando, onMudar, onSalvar }: FormularioCadastroProps) {
  /** Atualiza um campo, aplicando a máscara quando houver. */
  const mudar = (campo: keyof CamposCadastro, mascara?: (valor: string) => string) => (valor: string) =>
    onMudar({ ...campos, [campo]: mascara ? mascara(valor) : valor });

  const menor = ehMenorDeIdade(campos.dataNascimento);

  return (
    <form onSubmit={onSalvar} noValidate className="flex flex-col gap-4">
      <CampoTexto
        id="nome"
        rotulo="Nome"
        autoFocus
        autoComplete="name"
        autoCapitalize="words"
        value={campos.nome}
        onChange={(e) => mudar("nome")(e.target.value)}
        erro={erros.nome}
      />
      <CampoTexto
        id="telefone"
        rotulo="WhatsApp"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(85) 98812-4471"
        value={campos.telefone}
        onChange={(e) => mudar("telefone", formatarTelefoneDigitado)(e.target.value)}
        erro={erros.telefone}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CampoTexto
          id="dataNascimento"
          rotulo="Nascimento"
          type="date"
          value={campos.dataNascimento}
          onChange={(e) => mudar("dataNascimento")(e.target.value)}
          erro={erros.dataNascimento}
        />
        <CampoSelecao
          id="modalidadeId"
          rotulo="Modalidade de interesse"
          vazio="Ainda não sabe"
          opcoes={modalidades}
          value={campos.modalidadeId}
          onChange={(e) => mudar("modalidadeId")(e.target.value)}
        />
      </div>

      {menor && <CamposResponsavel campos={campos} erros={erros} onMudar={mudar} />}

      <CampoTexto
        id="cpf"
        rotulo="CPF"
        opcional
        inputMode="numeric"
        placeholder="000.000.000-00"
        value={campos.cpf}
        onChange={(e) => mudar("cpf", formatarCpfDigitado)(e.target.value)}
        erro={erros.cpf}
      />

      <BotaoPrincipal type="submit" carregando={salvando}>
        Salvar aluno
      </BotaoPrincipal>
    </form>
  );
}

interface CamposResponsavelProps {
  campos: CamposCadastro;
  erros: ErrosCadastro;
  onMudar: (campo: keyof CamposCadastro, mascara?: (valor: string) => string) => (valor: string) => void;
}

function CamposResponsavel({ campos, erros, onMudar }: CamposResponsavelProps) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-xl bg-gold-soft p-4">
      <legend className="sr-only">Responsável</legend>
      <p className="text-sm font-semibold text-gold">Menor de idade: precisamos de um responsável.</p>
      <CampoTexto
        id="responsavelNome"
        rotulo="Nome do responsável"
        autoCapitalize="words"
        value={campos.responsavelNome}
        onChange={(e) => onMudar("responsavelNome")(e.target.value)}
        erro={erros.responsavelNome}
      />
      <CampoTexto
        id="responsavelTelefone"
        rotulo="Telefone do responsável"
        type="tel"
        inputMode="tel"
        value={campos.responsavelTelefone}
        onChange={(e) => onMudar("responsavelTelefone", formatarTelefoneDigitado)(e.target.value)}
        erro={erros.responsavelTelefone}
      />
    </fieldset>
  );
}

/* ======================================================================
 * Etapa 2: avisos de duplicado
 * ==================================================================== */

function AvisoJaCadastrado({ aluno, onVoltar }: { aluno: AlunoResumo; onVoltar: () => void }) {
  return (
    <Aviso icone={<TriangleAlert className="size-5 text-gold" aria-hidden />}>
      <p>
        <strong>{aluno.nome}</strong> já está cadastrado nesta escola com este telefone ou CPF.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Link href={caminhoPerfil(aluno.id)} className={CLASSE_BOTAO_PRINCIPAL}>
          Abrir perfil
        </Link>
        <BotaoSecundario onClick={onVoltar}>Voltar e corrigir</BotaoSecundario>
      </div>
    </Aviso>
  );
}

interface AvisoOutraEscolaProps {
  aluno: AlunoResumo;
  escolas: string[];
  salvando: boolean;
  onVincular: () => void;
  onVoltar: () => void;
}

function AvisoOutraEscola({ aluno, escolas, salvando, onVincular, onVoltar }: AvisoOutraEscolaProps) {
  return (
    <Aviso icone={<TriangleAlert className="size-5 text-gold" aria-hidden />}>
      <p>
        <strong>{aluno.nome}</strong> já tem cadastro na federação
        {escolas.length > 0 && <> ({escolas.join(", ")})</>}, com este telefone ou CPF.
      </p>
      <p className="text-muted">Dá para usar o mesmo cadastro e só vincular a esta escola, sem duplicar.</p>
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <BotaoPrincipal onClick={onVincular} carregando={salvando}>
          Vincular a esta escola
        </BotaoPrincipal>
        <BotaoSecundario onClick={onVoltar}>Voltar e corrigir</BotaoSecundario>
      </div>
    </Aviso>
  );
}

/* ======================================================================
 * Etapa 3: depois de salvar
 * ==================================================================== */

interface ProximoPassoProps {
  aluno: AlunoResumo;
  vinculo: boolean;
  salvando: boolean;
  onExperimental: () => void;
  onDepois: () => void;
}

function ProximoPasso({ aluno, vinculo, salvando, onExperimental, onDepois }: ProximoPassoProps) {
  return (
    <Aviso icone={<CircleCheck className="size-5 text-ok" aria-hidden />}>
      <p>
        <strong>{aluno.nome}</strong> {vinculo ? "foi vinculado a esta escola." : "foi cadastrado."} E agora?
      </p>
      <div className="flex flex-col gap-2">
        {/* TODO(ALUNOS-08): abrir a matrícula. */}
        <BotaoPrincipal disabled title="Chega com a matrícula (ALUNOS-08)">
          Matricular agora
        </BotaoPrincipal>
        <BotaoSecundario onClick={onExperimental} disabled={salvando}>
          {salvando ? "Salvando…" : "Marcar aula experimental"}
        </BotaoSecundario>
        <BotaoSecundario onClick={onDepois} disabled={salvando}>
          Depois
        </BotaoSecundario>
      </div>
    </Aviso>
  );
}

/* ======================================================================
 * Peças
 * ==================================================================== */

function Aviso({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <div className="flex gap-3" role="status">
      <div className="pt-0.5">{icone}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-4 text-sm">{children}</div>
    </div>
  );
}

const CLASSE_BOTAO =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1";
const CLASSE_BOTAO_PRINCIPAL = `${CLASSE_BOTAO} bg-accent text-accent-ink`;
const CLASSE_BOTAO_SECUNDARIO = `${CLASSE_BOTAO} border border-line bg-surface hover:bg-surface-2`;

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement> & { carregando?: boolean };

function BotaoPrincipal({ carregando, children, disabled, type = "button", ...props }: BotaoProps) {
  return (
    <button type={type} disabled={disabled || carregando} className={CLASSE_BOTAO_PRINCIPAL} {...props}>
      {carregando ? "Salvando…" : children}
    </button>
  );
}

function BotaoSecundario({ children, type = "button", ...props }: BotaoProps) {
  return (
    <button type={type} className={CLASSE_BOTAO_SECUNDARIO} {...props}>
      {children}
    </button>
  );
}

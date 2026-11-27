"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Award, TriangleAlert } from "lucide-react";
import { CampoSelecao, CampoTexto } from "@/components/ui/Campo";
import { Janela } from "@/components/ui/Janela";
import {
  CAMPOS_GRADUACAO_VAZIOS,
  NIVEL_MAXIMO,
  hojeIso,
  temErrosGraduacao,
  validarGraduacao,
  type CamposGraduacao,
  type ErrosGraduacao,
} from "@/lib/graduacoes";
import { registrarGraduacaoDoAluno, type ResultadoGraduacao } from "./actions";

export interface OpcaoModalidadeGraduacao {
  valor: string;
  rotulo: string;
  nivelAtual: number | null;
}

export interface OpcaoAvaliador {
  valor: string;
  rotulo: string;
  modalidadeIds: string[];
}

interface RegistrarGraduacaoProps {
  alunoId: string;
  modalidades: OpcaoModalidadeGraduacao[];
  avaliadores: OpcaoAvaliador[];
}

/* ======================================================================
 * Botão + janela
 * ==================================================================== */

export function RegistrarGraduacao(props: RegistrarGraduacaoProps) {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110"
      >
        <Award className="size-4" aria-hidden />
        Registrar graduação
      </button>
      <Janela aberta={aberta} onFechar={() => setAberta(false)} titulo="Registrar graduação">
        {/* Só monta com a janela aberta: cada abertura começa do zero, com a data de hoje. */}
        <FluxoRegistro {...props} onConcluir={() => setAberta(false)} />
      </Janela>
    </>
  );
}

/* ======================================================================
 * Fluxo: formulário -> (confirmação de nível menor) -> salvo
 * ==================================================================== */

function FluxoRegistro({ alunoId, modalidades, avaliadores, onConcluir }: RegistrarGraduacaoProps & { onConcluir: () => void }) {
  // Pré-preenche a modalidade quando o aluno só tem uma, e a data com hoje.
  const [campos, setCampos] = useState<CamposGraduacao>(() => ({
    ...CAMPOS_GRADUACAO_VAZIOS,
    modalidadeId: modalidades.length === 1 ? modalidades[0].valor : "",
    data: hojeIso(),
  }));
  const [erros, setErros] = useState<ErrosGraduacao>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<number | null>(null);
  const [salvando, iniciarTransicao] = useTransition();

  const modalidade = modalidades.find((m) => m.valor === campos.modalidadeId);

  function tratarResultado(resultado: ResultadoGraduacao) {
    setErroGeral(null);
    if (resultado.tipo === "salvo") onConcluir();
    else if (resultado.tipo === "invalido") {
      setConfirmando(null);
      setErros(resultado.erros);
    } else if (resultado.tipo === "confirmar_nivel_menor") setConfirmando(resultado.nivelAtual);
    else setErroGeral(resultado.mensagem);
  }

  function enviar(confirmou: boolean) {
    iniciarTransicao(async () => tratarResultado(await registrarGraduacaoDoAluno(alunoId, campos, confirmou)));
  }

  function salvar(e: FormEvent) {
    e.preventDefault();
    const errosLocais = validarGraduacao(campos, hojeIso());
    setErros(errosLocais);
    if (temErrosGraduacao(errosLocais)) return;

    // Nível menor que o atual: pede confirmação antes de ir ao servidor.
    const atual = modalidade?.nivelAtual ?? null;
    if (atual !== null && Number(campos.nivel) < atual) setConfirmando(atual);
    else enviar(false);
  }

  return (
    <>
      {erroGeral && (
        <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
          {erroGeral}
        </p>
      )}

      {confirmando === null ? (
        <FormularioGraduacao
          campos={campos}
          erros={erros}
          modalidades={modalidades}
          avaliadores={avaliadores}
          salvando={salvando}
          onMudar={setCampos}
          onSalvar={salvar}
        />
      ) : (
        <ConfirmarNivelMenor
          modalidade={modalidade?.rotulo ?? "esta modalidade"}
          nivelNovo={Number(campos.nivel)}
          nivelAtual={confirmando}
          salvando={salvando}
          onConfirmar={() => enviar(true)}
          onVoltar={() => setConfirmando(null)}
        />
      )}
    </>
  );
}

/* ======================================================================
 * Formulário
 * ==================================================================== */

interface FormularioGraduacaoProps {
  campos: CamposGraduacao;
  erros: ErrosGraduacao;
  modalidades: OpcaoModalidadeGraduacao[];
  avaliadores: OpcaoAvaliador[];
  salvando: boolean;
  onMudar: (campos: CamposGraduacao) => void;
  onSalvar: (e: FormEvent) => void;
}

function FormularioGraduacao({ campos, erros, modalidades, avaliadores, salvando, onMudar, onSalvar }: FormularioGraduacaoProps) {
  const mudar = (campo: keyof CamposGraduacao) => (valor: string) => onMudar({ ...campos, [campo]: valor });
  const atual = modalidades.find((m) => m.valor === campos.modalidadeId)?.nivelAtual ?? null;

  // Avaliadores que dão aula da modalidade escolhida aparecem primeiro.
  const daModalidade = avaliadores.filter((a) => a.modalidadeIds.includes(campos.modalidadeId));
  const outros = avaliadores.filter((a) => !a.modalidadeIds.includes(campos.modalidadeId));

  return (
    <form onSubmit={onSalvar} noValidate className="flex flex-col gap-4">
      <CampoSelecao
        id="modalidadeId"
        rotulo="Modalidade"
        vazio="Escolha a modalidade"
        opcoes={modalidades}
        value={campos.modalidadeId}
        onChange={(e) => mudar("modalidadeId")(e.target.value)}
        erro={erros.modalidadeId}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <CampoTexto
            id="nivel"
            rotulo="Nível"
            type="number"
            inputMode="numeric"
            min={1}
            max={NIVEL_MAXIMO}
            step={1}
            value={campos.nivel}
            onChange={(e) => mudar("nivel")(e.target.value)}
            erro={erros.nivel}
          />
          {atual !== null && !erros.nivel && <p className="text-xs text-muted">Nível atual: {atual}</p>}
        </div>
        <CampoTexto
          id="data"
          rotulo="Data do exame"
          type="date"
          max={hojeIso()}
          value={campos.data}
          onChange={(e) => mudar("data")(e.target.value)}
          erro={erros.data}
        />
      </div>

      <CampoSelecao
        id="avaliadorId"
        rotulo="Avaliador"
        vazio="Quem avaliou"
        opcoes={[...daModalidade, ...outros]}
        value={campos.avaliadorId}
        onChange={(e) => mudar("avaliadorId")(e.target.value)}
        erro={erros.avaliadorId}
      />

      <button
        type="submit"
        disabled={salvando}
        className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110 disabled:opacity-60"
      >
        {salvando ? "Salvando…" : "Registrar"}
      </button>
    </form>
  );
}

/* ======================================================================
 * Confirmação de nível menor que o atual
 * ==================================================================== */

interface ConfirmarNivelMenorProps {
  modalidade: string;
  nivelNovo: number;
  nivelAtual: number;
  salvando: boolean;
  onConfirmar: () => void;
  onVoltar: () => void;
}

function ConfirmarNivelMenor({ modalidade, nivelNovo, nivelAtual, salvando, onConfirmar, onVoltar }: ConfirmarNivelMenorProps) {
  return (
    <div className="flex flex-col gap-4" role="alertdialog" aria-labelledby="titulo-nivel-menor">
      <div className="flex gap-3 rounded-lg bg-gold-soft p-3 text-sm">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
        <div>
          <p id="titulo-nivel-menor" className="font-semibold">
            Nível menor que o atual
          </p>
          <p className="mt-1 text-muted">
            O aluno está no nível {nivelAtual} em {modalidade}. Registrar o nível {nivelNovo} muda o nível atual para{" "}
            {nivelNovo}.
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onVoltar}
          disabled={salvando}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
        >
          Voltar e corrigir
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={salvando}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110 disabled:opacity-60"
        >
          {salvando ? "Salvando…" : `Registrar nível ${nivelNovo} mesmo assim`}
        </button>
      </div>
    </div>
  );
}

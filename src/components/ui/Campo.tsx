import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const CLASSE_CONTROLE =
  "min-h-11 w-full rounded-lg border bg-surface px-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-accent";

interface RotuloProps {
  id: string;
  rotulo: string;
  opcional?: boolean;
  erro?: string;
  children: ReactNode;
}

/** Rótulo em cima, controle no meio, erro embaixo. */
function Rotulo({ id, rotulo, opcional, erro, children }: RotuloProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
        {opcional && <span className="ml-1 font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="text-sm text-accent">
          {erro}
        </p>
      )}
    </div>
  );
}

type CampoTextoProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  rotulo: string;
  opcional?: boolean;
  erro?: string;
};

export function CampoTexto({ id, rotulo, opcional, erro, ...input }: CampoTextoProps) {
  return (
    <Rotulo id={id} rotulo={rotulo} opcional={opcional} erro={erro}>
      <input
        id={id}
        name={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${CLASSE_CONTROLE} border-line`}
        {...input}
      />
    </Rotulo>
  );
}

type CampoSelecaoProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  id: string;
  rotulo: string;
  opcional?: boolean;
  erro?: string;
  opcoes: { valor: string; rotulo: string }[];
  vazio: string;
};

export function CampoSelecao({ id, rotulo, opcional, erro, opcoes, vazio, ...select }: CampoSelecaoProps) {
  return (
    <Rotulo id={id} rotulo={rotulo} opcional={opcional} erro={erro}>
      <select id={id} name={id} className={`${CLASSE_CONTROLE} border-line`} {...select}>
        <option value="">{vazio}</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </Rotulo>
  );
}

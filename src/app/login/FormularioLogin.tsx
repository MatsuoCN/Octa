"use client";

import { useActionState, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ESTADO_LOGIN_INICIAL, PERFIS, temErrosLogin, validarLogin, type ErrosLogin } from "@/lib/login";
import { entrar } from "./actions";

export function FormularioLogin() {
  const [estado, acaoEntrar, entrando] = useActionState(entrar, ESTADO_LOGIN_INICIAL);
  // Erros conferidos no navegador antes de enviar; os do servidor chegam em `estado`.
  const [errosLocais, setErrosLocais] = useState<ErrosLogin | null>(null);
  const [lembrete, setLembrete] = useState(false);
  const erros = errosLocais ?? estado.erros;

  /** Confere antes de enviar. Se houver erro, nem chega ao servidor. */
  function conferir(e: FormEvent<HTMLFormElement>) {
    const dados = new FormData(e.currentTarget);
    const encontrados = validarLogin({
      email: String(dados.get("email") ?? ""),
      senha: String(dados.get("senha") ?? ""),
      perfil: String(dados.get("perfil") ?? ""),
    });
    if (temErrosLogin(encontrados)) {
      e.preventDefault();
      setErrosLocais(encontrados);
    } else {
      setErrosLocais(null);
    }
  }

  return (
    <form action={acaoEntrar} onSubmit={conferir} noValidate className="flex flex-col gap-4">
      {estado.mensagem && (
        <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
          {estado.mensagem}
        </p>
      )}

      <CampoLogin
        id="email"
        rotulo="E-mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        placeholder="nome@escola.com.br"
        defaultValue={estado.email}
        erro={erros.email}
      />

      <CampoSenha erro={erros.senha} onEsqueci={() => setLembrete((v) => !v)} />
      {lembrete && (
        <p className="-mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted" role="status">
          A recuperação de senha chega junto com o login de verdade. Por enquanto, qualquer senha entra.
        </p>
      )}

      <EscolhaPerfil selecionado={estado.perfil} erro={erros.perfil} />

      <button
        type="submit"
        disabled={entrando}
        className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:brightness-110 disabled:opacity-60"
      >
        {entrando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

/* ======================================================================
 * Campos
 * ==================================================================== */

const CLASSE_INPUT =
  "min-h-11 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-accent";

function MensagemErro({ id, erro }: { id: string; erro?: string }) {
  if (!erro) return null;
  return (
    <p id={`${id}-erro`} className="text-sm text-accent">
      {erro}
    </p>
  );
}

type CampoLoginProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & { id: string; rotulo: string; erro?: string };

function CampoLogin({ id, rotulo, erro, ...input }: CampoLoginProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={CLASSE_INPUT}
        {...input}
      />
      <MensagemErro id={id} erro={erro} />
    </div>
  );
}

function CampoSenha({ erro, onEsqueci }: { erro?: string; onEsqueci: () => void }) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="senha" className="text-sm font-semibold">
          Senha
        </label>
        <button type="button" onClick={onEsqueci} className="text-sm text-muted underline underline-offset-2 hover:text-ink">
          Esqueci minha senha
        </button>
      </div>
      <div className="relative">
        <input
          id="senha"
          name="senha"
          type={visivel ? "text" : "password"}
          autoComplete="current-password"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? "senha-erro" : undefined}
          className={`${CLASSE_INPUT} pr-12`}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Esconder senha" : "Mostrar senha"}
          className="absolute top-1/2 right-1 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
        >
          {visivel ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
      <MensagemErro id="senha" erro={erro} />
    </div>
  );
}

/** Enquanto não há login de verdade, a pessoa escolhe com qual perfil quer ver o sistema. */
function EscolhaPerfil({ selecionado, erro }: { selecionado: string; erro?: string }) {
  return (
    <fieldset className="flex flex-col gap-1.5" aria-describedby={erro ? "perfil-erro" : undefined}>
      <legend className="mb-1.5 text-sm font-semibold">
        Entrar como <span className="font-normal text-muted">(só no protótipo)</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {PERFIS.map((perfil) => (
          <label
            key={perfil.valor}
            title={perfil.descricao}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-2 has-[:checked]:font-semibold"
          >
            <input
              type="radio"
              name="perfil"
              value={perfil.valor}
              defaultChecked={selecionado === perfil.valor}
              className="accent-[var(--accent)]"
            />
            {perfil.rotulo}
          </label>
        ))}
      </div>
      <MensagemErro id="perfil" erro={erro} />
    </fieldset>
  );
}

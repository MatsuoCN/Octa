"use server";

import { redirect } from "next/navigation";
import { nomePeloEmail, perfilValido, temErrosLogin, validarLogin, type EstadoLogin } from "@/lib/login";
import { apagarSessao, gravarSessao } from "@/lib/sessao";

const texto = (dados: FormData, campo: string) => String(dados.get(campo) ?? "");

/** Entrar: por enquanto aceita qualquer e-mail com senha (login de verdade na FUT-03). */
export async function entrar(_anterior: EstadoLogin, dados: FormData): Promise<EstadoLogin> {
  const campos = { email: texto(dados, "email").trim(), senha: texto(dados, "senha"), perfil: texto(dados, "perfil") };
  const erros = validarLogin(campos);
  if (temErrosLogin(erros) || !perfilValido(campos.perfil)) {
    return { erros, mensagem: null, email: campos.email, perfil: campos.perfil };
  }

  try {
    await gravarSessao({ email: campos.email, nome: nomePeloEmail(campos.email), perfil: campos.perfil });
  } catch {
    return { erros: {}, mensagem: "Não foi possível entrar agora. Tente de novo.", email: campos.email, perfil: campos.perfil };
  }
  redirect("/");
}

export async function sair(): Promise<void> {
  await apagarSessao();
  redirect("/login");
}

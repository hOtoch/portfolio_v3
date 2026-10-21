"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import type { EstadoContrato } from "@/lib/contato-tipos";
import { enviarEmail, escapar } from "@/lib/email";

/**
 * Limite por IP: 3 envios a cada 10 minutos.
 * Em memoria — suficiente para um portfolio. Numa infra com varias instancias
 * cada uma tem o seu contador; se isso virar problema, trocar por Redis/Upstash.
 */
const JANELA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 3;
const historico = new Map<string, number[]>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (historico.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= MAX_ENVIOS) {
    historico.set(ip, recentes);
    return true;
  }
  recentes.push(agora);
  historico.set(ip, recentes);
  return false;
}

function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}


export async function enviarContrato(
  _anterior: EstadoContrato,
  dados: FormData,
): Promise<EstadoContrato> {
  // Honeypot: preenchido = bot. Responde como sucesso para nao ensinar o robo.
  if (texto(dados, "empresa_site")) {
    return { status: "ok" };
  }

  const nome = texto(dados, "nome");
  const empresa = texto(dados, "empresa");
  const contato = texto(dados, "contato");
  const briefing = texto(dados, "briefing");

  if (nome.length < 2 || nome.length > 120) {
    return { status: "erro", campo: "nome", mensagem: "Informe o seu nome." };
  }
  if (contato.length < 5 || contato.length > 160) {
    return {
      status: "erro",
      campo: "contato",
      mensagem: "Informe um e-mail ou telefone para eu responder.",
    };
  }
  if (empresa.length > 160) {
    return { status: "erro", campo: "empresa", mensagem: "Nome da empresa muito longo." };
  }
  if (briefing.length < 20 || briefing.length > 4000) {
    return {
      status: "erro",
      campo: "briefing",
      mensagem: "Escreva pelo menos 20 caracteres sobre a vaga ou o convite.",
    };
  }

  const cabecalhos = await headers();
  const ip =
    cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    cabecalhos.get("x-real-ip") ??
    "desconhecido";

  if (excedeuLimite(ip)) {
    return {
      status: "erro",
      mensagem: `Muitos envios seguidos. Tente de novo em alguns minutos ou escreva para ${site.email}.`,
    };
  }

  const corpo = `
    <h2>Novo contato pelo portfólio</h2>
    <p><strong>Nome:</strong> ${escapar(nome)}</p>
    ${empresa ? `<p><strong>Empresa:</strong> ${escapar(empresa)}</p>` : ""}
    <p><strong>Contato:</strong> ${escapar(contato)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapar(briefing).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><small>Enviado pelo formulário de ${site.url} · IP ${escapar(ip)}</small></p>
  `;

  const resultado = await enviarEmail({
    origem: "contato",
    assunto: `[Portfólio] ${nome}${empresa ? ` — ${empresa}` : ""}`,
    html: corpo,
    responderPara: contato.includes("@") ? contato : undefined,
  });

  if (resultado === "sem-chave") {
    return {
      status: "erro",
      mensagem: `Canal de envio indisponível no momento. Escreva direto para ${site.email}.`,
    };
  }
  if (resultado === "falhou") {
    return {
      status: "erro",
      mensagem: `Não consegui enviar agora. Escreva direto para ${site.email}.`,
    };
  }

  return { status: "ok" };
}

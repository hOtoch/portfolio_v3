"use server";

import { headers } from "next/headers";
import { faixasOrcamento, servicos, site } from "@/content/site";
import type { EstadoContrato } from "@/lib/contato-tipos";

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

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  const contato = texto(dados, "contato");
  const servico = texto(dados, "servico");
  const orcamento = texto(dados, "orcamento");
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
  if (!servicos.some((s) => s.codinome === servico)) {
    return { status: "erro", campo: "servico", mensagem: "Escolha um tipo de serviço." };
  }
  if (!faixasOrcamento.includes(orcamento as (typeof faixasOrcamento)[number])) {
    return { status: "erro", campo: "orcamento", mensagem: "Escolha uma faixa de orçamento." };
  }
  if (briefing.length < 20 || briefing.length > 4000) {
    return {
      status: "erro",
      campo: "briefing",
      mensagem: "Descreva o projeto em pelo menos 20 caracteres.",
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

  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    console.error(
      "[contato] RESEND_API_KEY ausente — o formulário não envia. Veja .env.example.",
    );
    return {
      status: "erro",
      mensagem: `Canal de envio indisponível no momento. Escreva direto para ${site.email}.`,
    };
  }

  const corpo = `
    <h2>Novo contrato — ${escapar(servico)}</h2>
    <p><strong>Nome:</strong> ${escapar(nome)}</p>
    <p><strong>Contato:</strong> ${escapar(contato)}</p>
    <p><strong>Serviço:</strong> ${escapar(servico)}</p>
    <p><strong>Orçamento:</strong> ${escapar(orcamento)}</p>
    <p><strong>Briefing:</strong></p>
    <p>${escapar(briefing).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><small>Enviado pelo formulário de ${site.url} · IP ${escapar(ip)}</small></p>
  `;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTATO_FROM ?? "Portfólio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: contato.includes("@") ? contato : undefined,
        subject: `[Contrato] ${nome} — ${servico}`,
        html: corpo,
      }),
    });

    if (!resposta.ok) {
      console.error("[contato] Resend respondeu", resposta.status, await resposta.text());
      return {
        status: "erro",
        mensagem: `Não consegui enviar agora. Escreva direto para ${site.email}.`,
      };
    }
  } catch (erro) {
    console.error("[contato] falha na requisição", erro);
    return {
      status: "erro",
      mensagem: `Sinal perdido. Escreva direto para ${site.email}.`,
    };
  }

  return { status: "ok" };
}

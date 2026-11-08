"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import {
  type EstadoContrato,
  ehEnviarPor,
  emailValido,
  LIMITES,
  linkWhatsApp,
  validarComum,
} from "@/lib/contato-tipos";
import { enviarEmail, escapar } from "@/lib/email";
import { permitirEnvio } from "@/lib/limite";

/** Quando o e-mail não pode sair, o WhatsApp do mesmo formulário continua livre. */
const TENTE_WHATSAPP = `Troque "enviar_por" para WhatsApp ou escreva para ${site.email}.`;

function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

export async function enviarContrato(
  _anterior: EstadoContrato,
  dados: FormData,
): Promise<EstadoContrato> {
  // O campo-isca do formulário se chama `url_referencia` (FormularioContrato).
  // Preenchido = bot. Responde como sucesso para nao ensinar o robo.
  if (texto(dados, "url_referencia")) {
    return { status: "ok" };
  }

  const pedido = texto(dados, "enviar_por");
  const enviarPor = ehEnviarPor(pedido) ? pedido : "email";
  const nome = texto(dados, "nome");
  const empresa = texto(dados, "empresa");
  const email = texto(dados, "email");
  const briefing = texto(dados, "briefing");

  const erro = validarComum({ nome, empresa, mensagem: briefing });
  if (erro) return erro;

  // WhatsApp: com JS o formulário abre o link sozinho e nem chega aqui. Sem JS,
  // a action manda o navegador direto para a conversa.
  if (enviarPor === "whatsapp") {
    redirect(linkWhatsApp({ nome, empresa, mensagem: briefing }));
  }

  if (email.length > LIMITES.email.max || !emailValido(email)) {
    return {
      status: "erro",
      campo: "email",
      mensagem: "Informe um e-mail válido para eu responder, como voce@empresa.com.",
    };
  }

  const cabecalhos = await headers();
  const ip =
    cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    cabecalhos.get("x-real-ip") ??
    "desconhecido";

  // Limite no Upstash (lib/limite.ts): 3 por IP a cada 10 min e o teto diário do site.
  const limite = await permitirEnvio("contato", ip);
  if (limite === "limite-pessoal") {
    return {
      status: "erro",
      mensagem: `Você já mandou 3 mensagens nos últimos 10 minutos. Espere um pouco, ou: ${TENTE_WHATSAPP}`,
    };
  }
  if (limite === "limite-diario") {
    return {
      status: "erro",
      mensagem: `O envio por e-mail atingiu o limite de hoje. ${TENTE_WHATSAPP}`,
    };
  }

  const corpo = `
    <h2>Novo contato pelo portfólio</h2>
    <p><strong>Nome:</strong> ${escapar(nome)}</p>
    ${empresa ? `<p><strong>Empresa:</strong> ${escapar(empresa)}</p>` : ""}
    <p><strong>E-mail:</strong> ${escapar(email)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapar(briefing).replace(/\n/g, "<br>")}</p>
    <hr>
    <p><small>Enviado pelo formulário de ${site.url} · IP ${escapar(ip)}</small></p>
  `;

  const resultado = await enviarEmail({
    origem: "contato",
    assunto: `[Portfólio] ${nome}${empresa ? ` · ${empresa}` : ""}`,
    html: corpo,
    // "Responder" no seu e-mail já vai para a pessoa.
    responderPara: email,
  });

  if (resultado === "sem-chave") {
    return {
      status: "erro",
      mensagem: `Canal de envio indisponível no momento. Escreva direto para ${site.email}.`,
    };
  }
  if (resultado === "limite") {
    return {
      status: "erro",
      mensagem: `O envio por e-mail atingiu o limite de hoje. ${TENTE_WHATSAPP}`,
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

"use server";

import { site } from "@/content/site";
import { lerConvite } from "@/lib/convite";
import { LIMITES_LAMBE, type EstadoLambe } from "@/lib/depoimento-tipos";
import { enviarEmail, escapar } from "@/lib/email";

/**
 * Envio de depoimento pelo muro. Nada é publicado aqui: o lambe chega por
 * e-mail com o bloco pronto para colar em src/content/depoimentos.ts, e só
 * aparece no site depois que você cola e publica (armazenamento "opção 1").
 */

/** No máximo 3 envios por convite a cada hora — um link vazado não vira spam. */
const JANELA_MS = 60 * 60 * 1000;
const MAX_ENVIOS = 3;
const envios = new Map<string, number[]>();

function excedeuLimite(chave: string): boolean {
  const agora = Date.now();
  const recentes = (envios.get(chave) ?? []).filter((t) => agora - t < JANELA_MS);
  const excedeu = recentes.length >= MAX_ENVIOS;
  if (!excedeu) recentes.push(agora);
  envios.set(chave, recentes);
  return excedeu;
}

function texto(dados: FormData, campo: string): string {
  const valor = dados.get(campo);
  return typeof valor === "string" ? valor.trim() : "";
}

/** Chamado pelo muro ao abrir: diz se o link é válido e para quem. */
export async function verificarConvite(token: string): Promise<{ cliente: string } | null> {
  const convite = lerConvite(token);
  return convite ? { cliente: convite.cliente } : null;
}

export async function enviarLambe(_anterior: EstadoLambe, dados: FormData): Promise<EstadoLambe> {
  // Honeypot: preenchido = bot. Responde como sucesso para não ensinar o robô.
  if (texto(dados, "site_do_negocio")) return { status: "ok" };

  const token = texto(dados, "convite");
  const convite = lerConvite(token);
  if (!convite) {
    return {
      status: "erro",
      mensagem: `Este convite não vale mais. Peça um novo link para ${site.email}.`,
    };
  }

  const nome = texto(dados, "nome");
  const negocio = texto(dados, "negocio");
  const depoimento = texto(dados, "texto");
  const nota = Number(texto(dados, "nota"));

  if (nome.length < 2 || nome.length > 80) {
    return { status: "erro", campo: "nome", mensagem: "Assine com o seu nome." };
  }
  if (negocio.length < 2 || negocio.length > 80) {
    return { status: "erro", campo: "negocio", mensagem: "Diga qual negócio ou projeto." };
  }
  if (depoimento.length < LIMITES_LAMBE.textoMin || depoimento.length > LIMITES_LAMBE.textoMax) {
    return {
      status: "erro",
      campo: "texto",
      mensagem: `Escreva entre ${LIMITES_LAMBE.textoMin} e ${LIMITES_LAMBE.textoMax} caracteres.`,
    };
  }
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return { status: "erro", campo: "nota", mensagem: "Dê uma nota de 1 a 5." };
  }

  if (excedeuLimite(token)) {
    return {
      status: "erro",
      mensagem: "Este convite já colou lambes demais por agora. Tente de novo mais tarde.",
    };
  }

  const data = new Date().toISOString().slice(0, 10);
  const slug = negocio
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Bloco pronto para colar em depoimentos.ts. JSON.stringify cuida de aspas
  // e quebras de linha dentro do texto.
  const bloco = [
    "  {",
    `    id: ${JSON.stringify(`${data}-${slug}`)},`,
    `    nome: ${JSON.stringify(nome)},`,
    `    negocio: ${JSON.stringify(negocio)},`,
    `    texto: ${JSON.stringify(depoimento)},`,
    `    nota: ${nota},`,
    `    data: ${JSON.stringify(data)},`,
    "  },",
  ].join("\n");

  const html = `
    <h2>Lambe novo no muro — ${escapar(negocio)}</h2>
    <p><strong>Convite de:</strong> ${escapar(convite.cliente)}</p>
    <p><strong>Assinado por:</strong> ${escapar(nome)}</p>
    <p><strong>Nota:</strong> ${"★".repeat(nota)}${"☆".repeat(5 - nota)}</p>
    <blockquote style="border-left:3px solid #ff2d8f;margin:16px 0;padding:4px 12px">
      ${escapar(depoimento).replace(/\n/g, "<br>")}
    </blockquote>
    <p><strong>Para aprovar:</strong> cole o bloco abaixo no fim da lista em
    <code>src/content/depoimentos.ts</code>, faça commit e publique. Se quiser
    recusar, é só ignorar este e-mail.</p>
    <pre style="background:#111;color:#eee;padding:12px;border-radius:6px;white-space:pre-wrap">${escapar(bloco)}</pre>
    <hr>
    <p><small>Enviado pelo muro de ${site.url}</small></p>
  `;

  const resultado = await enviarEmail({
    origem: "muro",
    assunto: `[Muro] ${negocio} — ${nota}★`,
    html,
  });

  if (resultado !== "ok") {
    return {
      status: "erro",
      mensagem: `A cola secou por aqui. Mande o seu depoimento para ${site.email}.`,
    };
  }

  return { status: "ok" };
}

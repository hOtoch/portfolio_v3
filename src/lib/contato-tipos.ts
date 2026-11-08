/**
 * Tipos, estado inicial e regras do formulario de contato, compartilhados
 * entre o formulario (cliente) e a action (servidor).
 *
 * Fica fora de `app/actions/contato.ts` de proposito: um arquivo "use server"
 * so pode exportar funcoes assincronas — exportar uma constante de la quebra
 * o build em tempo de execucao.
 */

import { site } from "@/content/site";

export type EstadoContrato = {
  status: "inicial" | "ok" | "erro";
  mensagem?: string;
  /** Campo que falhou, para marcar o input. */
  campo?: string;
};

export const ESTADO_INICIAL: EstadoContrato = { status: "inicial" };

/**
 * Por onde a mensagem sai:
 * - `email`: o site envia pela Resend; a pessoa deixa o e-mail dela para a resposta.
 * - `whatsapp`: abre o WhatsApp dela numa conversa com o Hugo, com o texto pronto.
 *   O número dela chega junto, então ela não digita contato nenhum.
 */
export type EnviarPor = "email" | "whatsapp";

export const ehEnviarPor = (v: string): v is EnviarPor => v === "email" || v === "whatsapp";

export const LIMITES = {
  nome: { min: 2, max: 120 },
  empresa: { max: 160 },
  email: { max: 160 },
  mensagem: { min: 20, max: 4000 },
} as const;

export const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Validação comum aos dois canais. Devolve o primeiro erro, ou null. */
export function validarComum(campos: {
  nome: string;
  empresa: string;
  mensagem: string;
}): EstadoContrato | null {
  const { nome, empresa, mensagem } = campos;
  if (nome.length < LIMITES.nome.min || nome.length > LIMITES.nome.max) {
    return { status: "erro", campo: "nome", mensagem: "Informe o seu nome." };
  }
  if (empresa.length > LIMITES.empresa.max) {
    return { status: "erro", campo: "empresa", mensagem: "Nome da empresa muito longo." };
  }
  if (mensagem.length < LIMITES.mensagem.min || mensagem.length > LIMITES.mensagem.max) {
    return {
      status: "erro",
      campo: "briefing",
      mensagem: "Escreva pelo menos 20 caracteres sobre a vaga ou o convite.",
    };
  }
  return null;
}

/** Link wa.me para o WhatsApp do Hugo com a mensagem já escrita. */
export function linkWhatsApp({
  nome,
  empresa,
  mensagem,
}: {
  nome: string;
  empresa: string;
  mensagem: string;
}): string {
  const texto = `Olá, Hugo! Sou ${nome}${empresa ? `, da ${empresa}` : ""}. Vim pelo seu portfólio.\n\n${mensagem}`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

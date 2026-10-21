import { site } from "@/content/site";

/**
 * Envio pela Resend, usado pelo formulário de contato e pelo muro.
 * Sem RESEND_API_KEY não envia: quem chama decide a mensagem para o usuário.
 */

export type ResultadoEnvio = "ok" | "sem-chave" | "falhou";

export function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function enviarEmail({
  assunto,
  html,
  responderPara,
  origem,
}: {
  assunto: string;
  html: string;
  responderPara?: string;
  /** Prefixo dos logs, para saber qual formulário falhou. */
  origem: string;
}): Promise<ResultadoEnvio> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    console.error(`[${origem}] RESEND_API_KEY ausente — nada é enviado. Veja .env.example.`);
    return "sem-chave";
  }

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTATO_FROM || "Portfólio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: responderPara,
        subject: assunto,
        html,
      }),
    });

    if (!resposta.ok) {
      console.error(`[${origem}] Resend respondeu`, resposta.status, await resposta.text());
      return "falhou";
    }
    return "ok";
  } catch (erro) {
    console.error(`[${origem}] falha na requisição`, erro);
    return "falhou";
  }
}

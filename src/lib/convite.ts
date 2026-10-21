import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Convites do muro de depoimentos — só quem recebe um link assinado consegue
 * colar um lambe.
 *
 * Formato do token: `<payload>.<assinatura>`, ambos em base64url.
 *   payload     JSON { c: cliente, iat: segundos desde a época }
 *   assinatura  HMAC-SHA256 do payload com DEPOIMENTO_SEGREDO
 *
 * O mesmo formato é gerado por `scripts/convite.mjs` (npm run convite). Se
 * mudar aqui, mude lá. Só roda no servidor: a chave nunca vai para o browser.
 */

export type Convite = { cliente: string; emitidoEm: Date };

/** Um convite vale por 120 dias depois de gerado. */
const VALIDADE_MS = 120 * 24 * 60 * 60 * 1000;

function assinar(payload: string, segredo: string): Buffer {
  return createHmac("sha256", segredo).update(payload).digest();
}

export function lerConvite(token: string | null | undefined): Convite | null {
  const segredo = process.env.DEPOIMENTO_SEGREDO;
  if (!segredo || !token) return null;

  const [payload, assinatura] = token.split(".");
  if (!payload || !assinatura) return null;

  const esperada = assinar(payload, segredo);
  const recebida = Buffer.from(assinatura, "base64url");
  if (recebida.length !== esperada.length || !timingSafeEqual(recebida, esperada)) {
    return null;
  }

  try {
    const dados = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      c?: unknown;
      iat?: unknown;
    };
    if (typeof dados.c !== "string" || typeof dados.iat !== "number") return null;
    const emitidoEm = new Date(dados.iat * 1000);
    if (Date.now() - emitidoEm.getTime() > VALIDADE_MS) return null;
    return { cliente: dados.c, emitidoEm };
  } catch {
    return null;
  }
}

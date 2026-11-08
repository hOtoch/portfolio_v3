import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Limite de envio de e-mail, guardado no Upstash Redis.
 *
 * Por que fora da memória: na Vercel cada função roda em instâncias que nascem,
 * morrem e se multiplicam sozinhas. Um contador num `Map` zerava a cada
 * instância nova, e o limite não segurava nada. No Redis o contador é um só
 * para todas as instâncias e sobrevive entre elas.
 *
 * Duas camadas:
 * - **Pessoal:** por IP (contato) ou por convite (muro). Barra quem insiste.
 * - **Diária, do site inteiro:** 80 e-mails por dia somando contato e muro, abaixo
 *   dos 100/dia do plano gratuito da Resend. Barra ataque espalhado por muitos
 *   IPs. A janela fixa de 1 dia vira à meia-noite UTC, como a cota da Resend.
 *
 * Só para o servidor: importado pelas actions de `app/actions/` (o token do
 * Redis não pode ir para o navegador).
 *
 * Se o Upstash não responder (ou as variáveis faltarem), o envio passa: um
 * recrutador nunca fica sem conseguir escrever por causa da proteção. A cota
 * da Resend continua sendo a última barreira.
 */

/** A integração da Vercel cria KV_*; o painel do Upstash usa UPSTASH_REDIS_REST_*. */
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

/** Teto diário do site. Mude aqui se trocar de plano na Resend. */
export const EMAILS_POR_DIA = 80;

/** Mais que isso esperando o Upstash e o envio segue sem limite. */
const ESPERA_MAXIMA_MS = 1500;

const redis = url && token ? new Redis({ url, token }) : null;

const criar = (limiter: ConstructorParameters<typeof Ratelimit>[0]["limiter"], prefixo: string) =>
  redis ? new Ratelimit({ redis, limiter, prefix: `rl:${prefixo}`, timeout: ESPERA_MAXIMA_MS }) : null;

const LIMITADORES = {
  /** 3 mensagens por IP a cada 10 minutos. */
  contato: criar(Ratelimit.slidingWindow(3, "10 m"), "contato:ip"),
  /** 3 lambes por convite a cada hora: um link vazado não vira spam. */
  muro: criar(Ratelimit.slidingWindow(3, "1 h"), "muro:convite"),
  diario: criar(Ratelimit.fixedWindow(EMAILS_POR_DIA, "1 d"), "emails:dia"),
};

export type ResultadoLimite = "ok" | "limite-pessoal" | "limite-diario";

async function consumir(limitador: Ratelimit | null, chave: string, origem: string) {
  if (!limitador) return true;
  try {
    const { success, reason } = await limitador.limit(chave);
    if (reason === "timeout") console.warn(`[${origem}] Upstash demorou; envio liberado sem limite.`);
    return success;
  } catch (erro) {
    console.error(`[${origem}] Upstash falhou; envio liberado sem limite.`, erro);
    return true;
  }
}

/**
 * Consome uma vaga do limite pessoal e uma do diário. Chamar só depois da
 * validação dos campos: erro de digitação não deve gastar envio.
 */
export async function permitirEnvio(
  tipo: "contato" | "muro",
  chave: string,
): Promise<ResultadoLimite> {
  if (!redis) {
    console.warn(`[${tipo}] Upstash não configurado (KV_REST_API_URL/TOKEN); envio sem limite.`);
    return "ok";
  }
  if (!(await consumir(LIMITADORES[tipo], chave, tipo))) return "limite-pessoal";
  if (!(await consumir(LIMITADORES.diario, "site", tipo))) return "limite-diario";
  return "ok";
}

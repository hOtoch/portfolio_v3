/**
 * Gera o link de convite para um cliente colar um lambe no muro.
 *
 *   npm run convite -- "Pet Park"
 *
 * Lê DEPOIMENTO_SEGREDO (e SITE_URL, opcional) do .env.local. O formato do
 * token é o mesmo de src/lib/convite.ts — se mudar um, mude o outro.
 */
import { createHmac } from "node:crypto";

const cliente = process.argv.slice(2).join(" ").trim();
const segredo = process.env.DEPOIMENTO_SEGREDO;
const base = (process.env.SITE_URL ?? "https://hugootoch.dev").replace(/\/$/, "");

if (!cliente) {
  console.error('Uso: npm run convite -- "Nome do cliente"');
  process.exit(1);
}
if (!segredo) {
  console.error("DEPOIMENTO_SEGREDO ausente. Defina no .env.local (veja .env.example).");
  process.exit(1);
}

const payload = Buffer.from(
  JSON.stringify({ c: cliente, iat: Math.floor(Date.now() / 1000) }),
).toString("base64url");
const assinatura = createHmac("sha256", segredo).update(payload).digest("base64url");

console.log(`\nConvite para ${cliente} (vale 120 dias):\n`);
console.log(`${base}/?convite=${payload}.${assinatura}#muro\n`);

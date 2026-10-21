/**
 * Tipos e estado inicial do lambe novo. Fora de `app/actions/depoimento.ts`
 * pelo mesmo motivo de contato-tipos.ts: arquivo "use server" só exporta
 * funções assíncronas.
 */

export type EstadoLambe = {
  status: "inicial" | "ok" | "erro";
  mensagem?: string;
  /** Campo que falhou, para marcar o input. */
  campo?: "nome" | "negocio" | "texto" | "nota";
};

export const LAMBE_INICIAL: EstadoLambe = { status: "inicial" };

export const LIMITES_LAMBE = { textoMin: 20, textoMax: 500 } as const;

/**
 * Tipos e estado inicial do formulario de contato.
 *
 * Fica fora de `app/actions/contato.ts` de proposito: um arquivo "use server"
 * so pode exportar funcoes assincronas — exportar uma constante de la quebra
 * o build em tempo de execucao.
 */

export type EstadoContrato = {
  status: "inicial" | "ok" | "erro";
  mensagem?: string;
  /** Campo que falhou, para marcar o input. */
  campo?: string;
};

export const ESTADO_INICIAL: EstadoContrato = { status: "inicial" };

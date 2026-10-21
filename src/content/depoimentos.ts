import type { EixoId } from "./site";

/**
 * Setor 06 — o muro. Cada item é um lambe colado por um cliente.
 *
 * Como um lambe entra aqui (armazenamento "opção 1", sem banco):
 *   1. Gere um convite:  npm run convite -- "Nome do cliente"
 *   2. O cliente abre o link, escreve e envia pelo próprio muro.
 *   3. Chega um e-mail com o depoimento e o bloco pronto para colar abaixo.
 *   4. Se aprovar, cole o bloco no fim da lista, faça commit e publique.
 *
 * Regra do design.md §17: só entra o que o cliente escreveu de verdade. Pode
 * corrigir erro de digitação; não pode reescrever o sentido.
 */
export type Depoimento = {
  /** Único e estável: decide a posição e a inclinação do lambe no muro. */
  id: string;
  /** Quem assina o depoimento. */
  nome: string;
  /** Negócio ou projeto atendido. */
  negocio: string;
  texto: string;
  nota: 1 | 2 | 3 | 4 | 5;
  /** AAAA-MM-DD */
  data: string;
  servico?: EixoId;
};

export const depoimentos: readonly Depoimento[] = [];

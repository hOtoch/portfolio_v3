/**
 * `cn` — junta classes condicionais.
 *
 * A versão do shadcn usa clsx + tailwind-merge. Esta aqui só concatena — ela
 * NÃO resolve conflito entre utilitários. Se um componente embute `relative` e
 * quem o usa passa `absolute`, as duas classes sobrevivem e quem vence é a
 * ordem da folha de estilo, não a ordem do argumento. Por isso os componentes
 * deste projeto não embutem utilitários que o consumidor possa querer trocar.
 * Se um dia entrar shadcn de verdade, troque por:
 *   import { clsx, type ClassValue } from "clsx";
 *   import { twMerge } from "tailwind-merge";
 *   export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

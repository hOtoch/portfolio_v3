import { useId } from "react";

/**
 * design.md §14.1 — o [H] da placa de neon. O mesmo desenho de `src/app/icon.svg`
 * (o favicon), inline para sair nítido em qualquer tamanho e sem requisição extra.
 * Mudou um, mude o outro.
 */
export function MarcaIcone({ className }: { className?: string }) {
  // useId pode trazer ":" ou "«»", que quebram o url(#…) do filtro em alguns navegadores.
  const brilho = `marca-brilho-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <filter id={brilho} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
      </defs>
      <path d="M8 1.5H30.5V24L24 30.5H1.5V8Z" fill="#07060d" stroke="#ff2d8f" strokeWidth="2" />
      <path
        d="M11 9V21.5M21 9V21.5M11 15.25H21"
        fill="none"
        stroke="#ff2d8f"
        strokeWidth="4.5"
        strokeLinecap="square"
        filter={`url(#${brilho})`}
      />
      <path
        d="M11 9V21.5M21 9V21.5M11 15.25H21"
        fill="none"
        stroke="#fff2f9"
        strokeWidth="3.2"
        strokeLinecap="square"
      />
      <path d="M6.5 26.5H18.5" stroke="#2bf5ff" strokeWidth="1.6" />
    </svg>
  );
}

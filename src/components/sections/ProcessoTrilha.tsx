"use client";

import { useEffect, useRef, useState } from "react";

import { etapas } from "@/content/percurso";

/**
 * Setor 03 — a trilha acompanha a rolagem.
 *
 * Uma linha de leitura fica a 60% da altura da tela. A trilha preenche até ela,
 * com um ponto de luz na ponta, e cada etapa acende quando o preenchimento
 * alcança o seu marcador: a de agora brilha, as de trás ficam acesas e as da
 * frente esperam apagadas. Rolando de volta, apagam na mesma ordem.
 *
 * O preenchimento vai por variável CSS (sem re-render a cada quadro); só a
 * troca de etapa passa pelo estado. Transições em globals.css (`.etapa-*`).
 */

const LINHA_DE_LEITURA = 0.6;
/** Folga da trilha no topo e na base (top-2 / bottom-2). */
const FOLGA = 8;
/** Distância do topo do item até o centro do marcador. */
const CENTRO_MARCADOR = 14;

export function ProcessoTrilha() {
  const lista = useRef<HTMLOListElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  // -1: nenhuma etapa alcançada ainda.
  const [alcancada, setAlcancada] = useState(-1);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--progresso", "1");
      setAlcancada(etapas.length - 1);
      return;
    }

    let agendado = false;

    const medir = () => {
      agendado = false;
      const caixa = el.getBoundingClientRect();
      const percurso = caixa.height - FOLGA * 2;
      const alcance = window.innerHeight * LINHA_DE_LEITURA - caixa.top - FOLGA;
      const progresso = Math.min(1, Math.max(0, alcance / percurso));
      el.style.setProperty("--progresso", String(progresso));

      const ponta = progresso * percurso + FOLGA;
      let ultima = -1;
      itens.current.forEach((item, i) => {
        if (item && item.offsetTop + CENTRO_MARCADOR <= ponta + 1) ultima = i;
      });
      setAlcancada(ultima);
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <ol
      ref={lista}
      className="relative mt-(--spacing-bloco) max-w-[70ch] pl-10 sm:pl-14"
      style={{ "--progresso": 0 } as React.CSSProperties}
    >
      {/* Trilha */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-hairline sm:left-[11px]" />
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top scale-y-(--progresso) sm:left-[11px]"
        style={{ background: "var(--grad-brand)" }}
      />
      {/* Ponto de luz na ponta do preenchimento */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7.5px] w-0 sm:left-[11.5px]">
        <span
          className="etapa-cursor absolute left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta"
          style={{ top: "calc(var(--progresso) * 100%)" }}
        />
      </span>

      {etapas.map((etapa, i) => {
        const estado = i < alcancada ? "feita" : i === alcancada ? "atual" : "vem";

        return (
          <li
            key={etapa.numero}
            ref={(item) => {
              itens.current[i] = item;
            }}
            data-estado={estado}
            className="etapa relative pb-12 last:pb-0"
          >
            {/* Marcador */}
            <span
              aria-hidden="true"
              className="etapa-marcador absolute top-1.5 -left-10 grid size-[15px] place-items-center rounded-full border border-hairline-hi bg-void sm:-left-14 sm:size-[23px]"
            >
              <span className="etapa-miolo size-1.5 rounded-full bg-magenta" />
            </span>

            <div className="etapa-corpo">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="etapa-numero font-mono text-xs text-text-mute">[ {etapa.numero} ]</span>
                <h3 className="text-[length:var(--text-step-2)]">{etapa.nome}</h3>
              </div>

              <p className="mt-3 text-text">{etapa.texto}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

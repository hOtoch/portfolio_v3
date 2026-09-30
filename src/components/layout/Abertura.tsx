"use client";

import { useEffect, useRef, useState } from "react";

import { LoaderGlitchText } from "@/components/ui/LoaderGlitchText";

/**
 * Abertura — tela de glitch que cobre o site por ~1,6s no carregamento.
 *
 * O tempo mora no CSS, não no JS: a cortina entra no HTML do servidor e some
 * sozinha pela animação `abertura-sai`. Se o JS demorar ou falhar, ela some do
 * mesmo jeito — nunca trava o site atrás de uma tela preta.
 *
 * O JS faz só duas coisas:
 *   1. Avisa o hero quando a cortina começa a subir (`data-abertura="fim"` no
 *      <html> + evento), para o nome decodificar à vista e não escondido.
 *   2. Tira a cortina do DOM quando a animação termina.
 *
 * Os dois momentos saem do relógio da própria animação CSS (Web Animations
 * API), não de timers contados no JS. Timer é frágil: em hidratação lenta ele
 * dispara atrasado e arranca a cortina ainda opaca, cortando o fade no meio.
 */

const SOBE_EM = 1200; // ms — igual a --abertura no globals.css

export const EVENTO_FIM_ABERTURA = "abertura:fim";

function sinalizarFim() {
  if (document.documentElement.dataset.abertura === "fim") return;
  document.documentElement.dataset.abertura = "fim";
  window.dispatchEvent(new Event(EVENTO_FIM_ABERTURA));
}

/** Roda `cb` quando a abertura começar a sumir — ou já, se ela já sumiu. */
export function aoFimDaAbertura(cb: () => void) {
  if (document.documentElement.dataset.abertura === "fim") {
    cb();
    return () => {};
  }
  window.addEventListener(EVENTO_FIM_ABERTURA, cb, { once: true });
  return () => window.removeEventListener(EVENTO_FIM_ABERTURA, cb);
}

export function Abertura() {
  const [montada, setMontada] = useState(true);
  const cortina = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animacao = cortina.current
      ?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === "abertura-sai");

    // Sem animação (movimento reduzido esconde a cortina): libera tudo já.
    if (!animacao) {
      sinalizarFim();
      const t = setTimeout(() => setMontada(false), 0);
      return () => clearTimeout(t);
    }

    // currentTime inclui o atraso da animação: é o tempo desde que a cortina
    // foi pintada, seja qual for o momento em que o React hidratou.
    const decorrido = Number(animacao.currentTime ?? 0);
    const sobe = setTimeout(sinalizarFim, Math.max(0, SOBE_EM - decorrido));

    let viva = true;
    animacao.finished
      .then(() => {
        if (viva) setMontada(false);
      })
      .catch(() => {
        // Animação cancelada (ex.: preferência de movimento mudou no meio)
        if (viva) setMontada(false);
      });

    return () => {
      viva = false;
      clearTimeout(sobe);
    };
  }, []);

  if (!montada) return null;

  return (
    <div
      ref={cortina}
      aria-hidden="true"
      className="abertura fixed inset-0 flex items-center justify-center bg-void"
      style={{ zIndex: "var(--z-cursor)" }}
    >
      <LoaderGlitchText
        text="CARREGANDO"
        intensity="medium"
        // O tracking deixa 0.3em sobrando depois da última letra; a margem negativa
        // tira essa sobra da conta da centralização. Não use padding: as camadas
        // do glitch são inset-0 e ficariam desalinhadas do texto.
        className="-mr-[0.3em] text-3xl font-semibold tracking-[0.3em] text-text-hi sm:text-5xl"
      />
    </div>
  );
}

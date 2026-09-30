"use client";

import { useEffect, useRef } from "react";

/**
 * Casca interativa do retrato do hero.
 *
 * Só escreve variáveis CSS no próprio elemento — o desenho (inclinação,
 * parallax, reflexo, mira) mora em globals.css (`.retrato-*`):
 *   --mx / --my   posição do ponteiro no quadro, de 0 a 1 (0.5 = centro)
 *   --ativo       0 fora, 1 com o ponteiro em cima (suavizado)
 *
 * O valor persegue o ponteiro com amortecimento num rAF que dorme quando
 * assenta, então parado não custa nada. Clique/toque dispara um glitch.
 * Com movimento reduzido nada disso liga e o retrato fica como era.
 */

const AMORTECIMENTO = 0.14;
const DURACAO_GLITCH = 560;

export function RetratoInterativo({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const leitura = el.querySelector<HTMLElement>("[data-leitura]");
    const alvo = { x: 0.5, y: 0.5, a: 0 };
    const atual = { ...alvo };
    let quadro = 0;
    let fimGlitch = 0;

    const passo = () => {
      atual.x += (alvo.x - atual.x) * AMORTECIMENTO;
      atual.y += (alvo.y - atual.y) * AMORTECIMENTO;
      atual.a += (alvo.a - atual.a) * AMORTECIMENTO;

      el.style.setProperty("--mx", atual.x.toFixed(4));
      el.style.setProperty("--my", atual.y.toFixed(4));
      el.style.setProperty("--ativo", atual.a.toFixed(4));
      if (leitura) {
        leitura.textContent = `X ${atual.x.toFixed(2)} · Y ${atual.y.toFixed(2)}`;
      }

      const assentou =
        Math.abs(alvo.x - atual.x) < 0.001 &&
        Math.abs(alvo.y - atual.y) < 0.001 &&
        Math.abs(alvo.a - atual.a) < 0.001;
      quadro = assentou ? 0 : requestAnimationFrame(passo);
    };

    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(passo);
    };

    const mover = (e: PointerEvent) => {
      const caixa = el.getBoundingClientRect();
      alvo.x = Math.min(1, Math.max(0, (e.clientX - caixa.left) / caixa.width));
      alvo.y = Math.min(1, Math.max(0, (e.clientY - caixa.top) / caixa.height));
      alvo.a = 1;
      agendar();
    };

    const soltar = () => {
      alvo.x = 0.5;
      alvo.y = 0.5;
      alvo.a = 0;
      agendar();
    };

    const glitch = (e: PointerEvent) => {
      mover(e);
      // Remove e repõe o atributo para a animação reiniciar a cada clique.
      delete el.dataset.glitch;
      void el.offsetWidth;
      el.dataset.glitch = "";
      window.clearTimeout(fimGlitch);
      fimGlitch = window.setTimeout(() => delete el.dataset.glitch, DURACAO_GLITCH);
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerdown", glitch);
    el.addEventListener("pointerleave", soltar);
    el.addEventListener("pointercancel", soltar);

    return () => {
      cancelAnimationFrame(quadro);
      window.clearTimeout(fimGlitch);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerdown", glitch);
      el.removeEventListener("pointerleave", soltar);
      el.removeEventListener("pointercancel", soltar);
    };
  }, []);

  return (
    <div ref={ref} className="retrato-interativo">
      {children}
    </div>
  );
}

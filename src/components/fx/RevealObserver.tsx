"use client";

import { useEffect } from "react";

/**
 * Revelação no scroll — design.md §7.2.
 *
 * Um observador só para a página inteira, montado no layout. As seções apenas
 * marcam `data-reveal` (e opcionalmente `--reveal-atraso` para o stagger) — não
 * precisam virar client components por causa da animação.
 *
 * Dispara a 20% de visibilidade e para de observar: rolar de volta não re-anima.
 */
export function RevealObserver() {
  useEffect(() => {
    const alvos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (alvos.length === 0) return;

    const revelar = (el: HTMLElement) => {
      el.dataset.revelado = "true";
    };

    // Sem IntersectionObserver ou com movimento reduzido: mostra tudo de uma vez.
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento || typeof IntersectionObserver === "undefined") {
      alvos.forEach(revelar);
      return;
    }

    const pendentes = new Set(alvos);

    const concluir = (el: HTMLElement) => {
      revelar(el);
      observador.unobserve(el);
      pendentes.delete(el);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) concluir(entrada.target as HTMLElement);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    /**
     * Rede de segurança para o que o observador não vê.
     *
     * Num salto (link de âncora, hash na URL, fim/início pelo teclado) o bloco
     * vai de "abaixo da tela" direto para "acima da tela": a razão de interseção
     * nunca cruza o threshold e nenhum callback dispara. Sem esta varredura a
     * seção pulada fica invisível para sempre, e quem rolar de volta vê um buraco.
     */
    const varrer = () => {
      pendentes.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) concluir(el);
      });
      if (pendentes.size === 0) window.removeEventListener("scroll", aoRolar);
    };

    let agendado = false;
    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        varrer();
      });
    };

    alvos.forEach((el) => {
      // Já visível no primeiro paint (acima da dobra): revela sem esperar scroll.
      const caixa = el.getBoundingClientRect();
      if (caixa.top < window.innerHeight * 0.8 && caixa.bottom > 0) {
        revelar(el);
        pendentes.delete(el);
        return;
      }
      observador.observe(el);
    });

    window.addEventListener("scroll", aoRolar, { passive: true });

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  return null;
}

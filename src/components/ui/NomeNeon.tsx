"use client";

import { useEffect, useRef } from "react";

import { aoFimDaAbertura } from "@/components/layout/Abertura";

/**
 * Letreiro do nome — design.md §7.2.
 *
 * Duas fases encadeadas:
 *   1. DECODIFICAÇÃO — cada letra embaralha caracteres e trava no caractere
 *      real, da esquerda para a direita. A letra continua apagada.
 *   2. TUBO ACENDENDO — em cascata, cada letra acende; duas hesitam antes de
 *      firmar, como neon de verdade ligando.
 * Depois disso, duas letras ganham o pisca raro (§6.2) — evento, não loop.
 *
 * Renderização: o servidor entrega o nome COMPLETO e ACESO. A animação é
 * progressive enhancement e só começa depois de montar. Assim o nome está
 * legível no primeiro paint, vale para SEO, e quem não tem JS ou pediu
 * movimento reduzido vê o estado final direto.
 */

const RUIDO = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789#%&*<>/[]{}|";

const PASSO_RUIDO = 45; // de quanto em quanto tempo troca o caractere
const ATRASO_LETRA = 45; // stagger da decodificação
const DURACAO_RUIDO = 320; // quanto cada letra embaralha antes de travar
const RESPIRO = 140; // pausa entre decodificar tudo e começar a acender
const PASSO_ACENDE = 60; // stagger do acendimento

export type Palavra = { texto: string; neon?: boolean };

function ruido() {
  return RUIDO[Math.floor(Math.random() * RUIDO.length)];
}

export function NomeNeon({ palavras }: { palavras: readonly Palavra[] }) {
  const raiz = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const no = raiz.current;
    if (!no) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letras = Array.from(no.querySelectorAll<HTMLElement>("[data-letra]"));
    if (letras.length === 0) return;

    const reais = letras.map((el) => el.textContent ?? "");
    const total = letras.length;

    // Momentos de cada letra, em ms a partir do início
    const decodificaEm = letras.map((_, i) => i * ATRASO_LETRA + DURACAO_RUIDO);
    const inicioAcende = Math.max(...decodificaEm) + RESPIRO;
    const acendeEm = letras.map((_, i) => inicioAcende + i * PASSO_ACENDE);

    // Duas letras hesitam ao acender — sempre as mesmas, para o efeito ser
    // reconhecível a cada visita em vez de parecer defeito aleatório.
    const hesitam = new Set([Math.floor(total * 0.35), total - 2]);

    // Estado inicial da animação: apagado e embaralhado
    letras.forEach((el, i) => {
      el.dataset.acesa = "false";
      el.removeAttribute("data-vive");
      if (hesitam.has(i)) el.dataset.falha = "true";
      el.textContent = ruido();
    });

    let inicio = 0;
    let ultimoRuido = 0;
    let frame = 0;

    const passo = (agora: number) => {
      const t = agora - inicio;
      const trocaRuido = t - ultimoRuido >= PASSO_RUIDO;
      if (trocaRuido) ultimoRuido = t;

      let terminou = true;

      letras.forEach((el, i) => {
        if (t < decodificaEm[i]) {
          if (trocaRuido) el.textContent = ruido();
          terminou = false;
        } else if (el.textContent !== reais[i]) {
          el.textContent = reais[i];
        }

        if (t >= acendeEm[i]) {
          if (el.dataset.acesa !== "true") el.dataset.acesa = "true";
        } else {
          terminou = false;
        }
      });

      if (terminou) {
        // Passa o bastão para o pisca raro, em duas letras com ciclos
        // diferentes para as falhas nunca coincidirem.
        const a = letras[1];
        const b = letras[total - 3] ?? letras[total - 1];
        a.dataset.vive = "true";
        a.style.setProperty("--pisca-dur", "14s");
        a.style.setProperty("--pisca-atraso", "4s");
        b.dataset.vive = "true";
        b.style.setProperty("--pisca-dur", "19s");
        b.style.setProperty("--pisca-atraso", "11s");
        return;
      }

      frame = requestAnimationFrame(passo);
    };

    // Espera a abertura comecar a subir: decodificar atras da cortina seria
    // gastar o efeito sem ninguem ver.
    const pararDeEsperar = aoFimDaAbertura(() => {
      inicio = performance.now();
      frame = requestAnimationFrame(passo);
    });

    return () => {
      pararDeEsperar();
      cancelAnimationFrame(frame);
      letras.forEach((el, i) => {
        el.textContent = reais[i];
        el.dataset.acesa = "true";
      });
    };
  }, [palavras]);

  return (
    <span ref={raiz}>
      {/* Nome real para leitor de tela e para o texto do <h1> */}
      <span className="sr-only">{palavras.map((p) => p.texto).join(" ")}</span>

      <span aria-hidden="true">
        {palavras.map((palavra) => (
          <span key={palavra.texto} className="block">
            {[...palavra.texto].map((caractere, i) => (
              <span
                key={`${palavra.texto}-${i}`}
                data-letra=""
                data-acesa="true"
                className={`letra${palavra.neon ? " letra--neon" : ""}`}
              >
                {caractere}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

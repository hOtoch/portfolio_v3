"use client";

import { useEffect, useRef, useState } from "react";

import { trajetoria, type Marco, type TipoMarco } from "@/content/percurso";
import { cn } from "@/lib/utils";

/**
 * Setor 03 — a trajetória acompanha a rolagem.
 *
 * Uma linha de leitura fica a 60% da altura da tela; a trilha central preenche
 * até ela, com um ponto de luz na ponta. Cada marco tem o título de um lado da
 * trilha e os feitos do outro, como lâmpadas: o marco acende quando a trilha
 * alcança o seu marcador, e cada lâmpada acende quando a linha de leitura passa
 * por ela. Rolando de volta, apagam na mesma ordem.
 *
 * Os períodos se sobrepõem de verdade (o SigAMAES rodou junto com a Seer e com
 * o trabalho autônomo). Uma trilha só, em sequência, faria parecer que uma coisa
 * terminou quando a outra começou, então cada marco diz com quem correu em
 * paralelo, com link para o outro marco.
 *
 * O preenchimento e as lâmpadas vão por variável CSS e atributo, sem re-render
 * a cada quadro; só a troca de marco passa pelo estado. Visual em globals.css
 * (`.marco-*`).
 */

const LINHA_DE_LEITURA = 0.6;
/** Folga da trilha no topo e na base (top-2 / bottom-2). */
const FOLGA = 8;
/** Distância do topo do item até o centro do marcador. */
const CENTRO_MARCADOR = 14;
/** Distância do topo de uma lâmpada até o seu centro. */
const CENTRO_LUZ = 10;

type Tema = { rgb: string; cor: string; texto: string; rotulo: string };

const TEMA: Record<TipoMarco, Tema> = {
  emprego: { rgb: "255, 45, 143", cor: "var(--color-magenta)", texto: "text-magenta", rotulo: "Emprego" },
  autoral: { rgb: "255, 51, 85", cor: "var(--color-crimson)", texto: "text-crimson", rotulo: "Autoral" },
  academico: { rgb: "177, 75, 255", cor: "var(--color-violet)", texto: "text-violet", rotulo: "Acadêmico" },
  formacao: { rgb: "43, 245, 255", cor: "var(--color-cyan)", texto: "text-cyan", rotulo: "Formação" },
};

/** "YYYY-MM" em meses absolutos. */
function emMeses(iso: string) {
  const [ano, mes] = iso.split("-").map(Number);
  return ano * 12 + (mes - 1);
}

/** Intervalo do marco em meses absolutos, com o fim inclusivo. */
function intervalo(marco: Marco, agora: number): [number, number] {
  return [emMeses(marco.inicio), marco.fim ? emMeses(marco.fim) : agora];
}

function duracaoEmMeses(marco: Marco, agora: number) {
  const [inicio, fim] = intervalo(marco, agora);
  return Math.max(1, fim - inicio);
}

/** A formação é um marco pontual: não conta como trabalho em paralelo. */
const conta = (marco: Marco) => marco.tipo !== "formacao";

function paralelos(marco: Marco, agora: number) {
  if (!conta(marco)) return [];
  const [a0, a1] = intervalo(marco, agora);
  return trajetoria.filter((outro) => {
    if (outro.slug === marco.slug || !conta(outro)) return false;
    const [b0, b1] = intervalo(outro, agora);
    return a0 < b1 && b0 < a1;
  });
}

export function Trajetoria() {
  const lista = useRef<HTMLOListElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  // -1: nenhum marco alcançado ainda.
  const [alcancado, setAlcancado] = useState(-1);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const luzes = [...el.querySelectorAll<HTMLElement>("[data-luz]")];

    // Os setAlcancado deste efeito passam por requestAnimationFrame de
    // propósito: setState direto no corpo do efeito dispara render em cascata.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--progresso", "1");
      luzes.forEach((luz) => luz.setAttribute("data-acesa", ""));
      const quadro = requestAnimationFrame(() => setAlcancado(trajetoria.length - 1));
      return () => cancelAnimationFrame(quadro);
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
      let ultimo = -1;
      itens.current.forEach((item, i) => {
        if (item && item.offsetTop + CENTRO_MARCADOR <= ponta + 1) ultimo = i;
      });
      setAlcancado(ultimo);

      // Cada lâmpada acende quando a linha de leitura chega na altura dela.
      const linha = window.innerHeight * LINHA_DE_LEITURA;
      for (const luz of luzes) {
        const acesa = luz.getBoundingClientRect().top + CENTRO_LUZ <= linha;
        if (acesa !== luz.hasAttribute("data-acesa")) luz.toggleAttribute("data-acesa", acesa);
      }
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    };

    const primeiraMedida = requestAnimationFrame(medir);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      cancelAnimationFrame(primeiraMedida);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  const agora = emMeses(new Date().toISOString().slice(0, 7));

  return (
    <>
      <ol
        ref={lista}
        className="relative mt-(--spacing-bloco) pl-10 md:pl-0"
        style={{ "--progresso": 0 } as React.CSSProperties}
      >
        {/* Trilha: encostada à esquerda no celular, no centro em telas largas */}
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-hairline md:left-1/2" />
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px origin-top scale-y-(--progresso) md:left-1/2"
          style={{ background: "var(--grad-brand)" }}
        />
        {/* Ponto de luz na ponta do preenchimento */}
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7.5px] w-0 md:left-1/2">
          <span
            className="marco-cursor absolute left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta"
            style={{ top: "calc(var(--progresso) * 100%)" }}
          />
        </span>

        {trajetoria.map((marco, i) => {
          const estado = i < alcancado ? "feita" : i === alcancado ? "atual" : "vem";
          const tema = TEMA[marco.tipo];
          const meses = duracaoEmMeses(marco, agora);
          const atual = marco.fim === null;
          const juntos = paralelos(marco, agora);

          return (
            <li
              key={marco.slug}
              id={`marco-${marco.slug}`}
              ref={(item) => {
                itens.current[i] = item;
              }}
              data-estado={estado}
              className="marco relative scroll-mt-28 pb-20 last:pb-0 md:grid md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)]"
              style={{ "--marco-cor": tema.cor, "--marco-rgb": tema.rgb } as React.CSSProperties}
            >
              {/* Marcador, sempre encostado na trilha */}
              <span
                aria-hidden="true"
                className="marco-marcador absolute top-1.5 -left-10 z-1 grid size-[15px] place-items-center rounded-full border border-hairline-hi bg-void md:left-1/2 md:size-[23px] md:-translate-x-1/2"
              >
                <span className="marco-miolo size-1.5 rounded-full" style={{ background: tema.cor }} />
              </span>

              {/* Lado do título */}
              <div className="marco-corpo md:col-start-1 md:text-right">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:justify-end">
                  <span className={cn("font-mono text-[0.6rem] tracking-[0.18em] uppercase", tema.texto)}>
                    {tema.rotulo}
                  </span>
                  <span className="marco-periodo font-mono text-xs tracking-[0.1em] text-text-mute tabular-nums">
                    {marco.periodo}
                  </span>
                  {atual && (
                    <span className={cn("font-mono text-[0.6rem] tracking-[0.18em] uppercase", tema.texto)}>
                      ● agora
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-[length:var(--text-step-2)]">{marco.funcao}</h3>
                <p className="mt-1.5 font-mono text-xs tracking-[0.08em] text-text-dim">
                  {marco.organizacao} · {marco.local}
                  {marco.tipo !== "formacao" && (
                    <span className="text-text-mute">
                      {" "}
                      · {meses} {meses === 1 ? "mês" : "meses"}
                    </span>
                  )}
                </p>

                {juntos.length > 0 && (
                  <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[0.62rem] tracking-[0.12em] text-text-mute uppercase md:justify-end">
                    <span>Em paralelo com</span>
                    {juntos.map((outro) => (
                      <a
                        key={outro.slug}
                        href={`#marco-${outro.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2 py-0.5 text-text-dim transition-colors hover:border-hairline-hi hover:text-text"
                      >
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full"
                          style={{ background: TEMA[outro.tipo].cor }}
                        />
                        {outro.organizacao}
                      </a>
                    ))}
                  </p>
                )}

                {marco.stack.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2 md:justify-end">
                    {marco.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.1em] text-text-dim uppercase"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Lado das luzes */}
              <div className="mt-6 md:col-start-3 md:mt-1">
                <ul className="space-y-4">
                  {marco.marcas.map((marca) => (
                    <li key={marca} data-luz="" className="marco-luz flex gap-3.5 text-sm leading-relaxed">
                      <span aria-hidden="true" className="marco-lampada mt-[0.4rem] size-2 shrink-0 rounded-full" />
                      <span className="marco-luz-texto">{marca}</span>
                    </li>
                  ))}
                </ul>

                {marco.link && (
                  <a
                    href={marco.link.href}
                    target="_blank"
                    rel="noopener"
                    className={cn(
                      "mt-6 inline-flex items-center gap-2 font-mono text-[0.68rem] font-semibold tracking-[0.14em] uppercase underline-offset-[6px] hover:underline",
                      tema.texto,
                    )}
                  >
                    {marco.link.rotulo}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

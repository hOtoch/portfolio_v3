"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { trajetoria, type Marco, type TipoMarco } from "@/content/percurso";
import { cn } from "@/lib/utils";

/**
 * Setor 05 — a trilha da trajetoria acompanha a rolagem.
 *
 * Herda o mecanismo do antigo ProcessoTrilha: uma linha de leitura fica a 60%
 * da altura da tela, a trilha preenche ate ela com um ponto de luz na ponta, e
 * cada marco acende quando o preenchimento alcanca o seu marcador. O de agora
 * brilha, os de tras ficam acesos, os da frente esperam apagados. Rolando de
 * volta, apagam na mesma ordem.
 *
 * O preenchimento vai por variavel CSS (sem re-render a cada quadro); so a
 * troca de marco passa pelo estado. Transicoes em globals.css (`.marco-*`).
 *
 * O que e novo: DOIS TRILHOS. Os periodos se sobrepoem de verdade (SigAMAES
 * roda dentro da Seer; o freelance cobre o inicio do SigAMAES), e uma linha
 * unica em sequencia faria parecer que uma coisa terminou quando a outra
 * comecou. Emprego fica de um lado, autoral/academico/formacao do outro, e a
 * sobreposicao passa a ser o argumento: trabalho e lideranca tecnica ao mesmo
 * tempo. No celular os dois trilhos viram um, porque duas colunas nao cabem.
 */

const LINHA_DE_LEITURA = 0.6;
/** Folga da trilha no topo e na base (top-2 / bottom-2). */
const FOLGA = 8;
/** Distância do topo do item até o centro do marcador. */
const CENTRO_MARCADOR = 14;

type Tema = {
  /** Lado do trilho em telas largas. */
  lado: "esquerda" | "direita";
  rgb: string;
  cor: string;
  texto: string;
  rotulo: string;
};

const TEMA: Record<TipoMarco, Tema> = {
  emprego: {
    lado: "esquerda",
    rgb: "255, 45, 143",
    cor: "var(--color-magenta)",
    texto: "text-magenta",
    rotulo: "Emprego",
  },
  autoral: {
    lado: "direita",
    rgb: "255, 51, 85",
    cor: "var(--color-crimson)",
    texto: "text-crimson",
    rotulo: "Autoral",
  },
  academico: {
    lado: "direita",
    rgb: "177, 75, 255",
    cor: "var(--color-violet)",
    texto: "text-violet",
    rotulo: "Acadêmico",
  },
  formacao: {
    lado: "direita",
    rgb: "177, 75, 255",
    cor: "var(--color-violet)",
    texto: "text-violet",
    rotulo: "Formação",
  },
};

/** "YYYY-MM" em meses absolutos, para medir duração. */
function emMeses(iso: string) {
  const [ano, mes] = iso.split("-").map(Number);
  return ano * 12 + (mes - 1);
}

function duracaoEmMeses(marco: Marco, agora: number) {
  const fim = marco.fim ? emMeses(marco.fim) : agora;
  return Math.max(1, fim - emMeses(marco.inicio));
}

export function Trajetoria() {
  const lista = useRef<HTMLOListElement>(null);
  const itens = useRef<(HTMLLIElement | null)[]>([]);
  // -1: nenhum marco alcançado ainda.
  const [alcancado, setAlcancado] = useState(-1);

  useEffect(() => {
    const el = lista.current;
    if (!el) return;

    // Os dois setAlcancado deste efeito passam por requestAnimationFrame de
    // proposito: chamar setState direto no corpo do efeito dispara render em
    // cascata (react-hooks/set-state-in-effect).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--progresso", "1");
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

  // Escala das barras de duração: o marco mais longo ocupa a barra inteira.
  const agora = emMeses(new Date().toISOString().slice(0, 7));
  const maiorDuracao = Math.max(...trajetoria.map((m) => duracaoEmMeses(m, agora)));

  return (
    <>
      {/* Legenda dos dois trilhos */}
      <ul className="mt-(--spacing-bloco) flex flex-wrap items-center gap-x-7 gap-y-3">
        {(["emprego", "autoral", "academico", "formacao"] as const).map((tipo) => (
          <li key={tipo} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: TEMA[tipo].cor }}
            />
            <span className="font-mono text-[0.68rem] tracking-[0.16em] text-text-mute uppercase">
              {TEMA[tipo].rotulo}
            </span>
          </li>
        ))}
      </ul>

      <ol
        ref={lista}
        className="relative mt-10 pl-10 md:mx-auto md:max-w-[var(--container-site)] md:pl-0"
        style={{ "--progresso": 0 } as React.CSSProperties}
      >
        {/* Trilha: encostada à esquerda no celular, no centro em telas largas */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px bg-hairline md:left-1/2"
        />
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
          const esquerda = tema.lado === "esquerda";
          const meses = duracaoEmMeses(marco, agora);
          const atual = marco.fim === null;

          return (
            <li
              key={marco.slug}
              ref={(item) => {
                itens.current[i] = item;
              }}
              data-estado={estado}
              className="marco relative pb-14 last:pb-0"
              style={
                {
                  "--marco-cor": tema.cor,
                  "--marco-rgb": tema.rgb,
                } as React.CSSProperties
              }
            >
              {/* Marcador, sempre encostado na trilha */}
              <span
                aria-hidden="true"
                className="marco-marcador absolute top-1.5 -left-10 z-1 grid size-[15px] place-items-center rounded-full border border-hairline-hi bg-void md:left-1/2 md:size-[23px] md:-translate-x-1/2"
              >
                <span
                  className="marco-miolo size-1.5 rounded-full"
                  style={{ background: tema.cor }}
                />
              </span>

              <div
                className={cn(
                  "marco-corpo md:w-[calc(50%-3.5rem)]",
                  esquerda ? "md:mr-auto md:text-right" : "md:ml-auto",
                )}
              >
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-x-3 gap-y-2",
                    esquerda && "md:justify-end",
                  )}
                >
                  <span className="marco-periodo font-mono text-xs tracking-[0.1em] text-text-mute tabular-nums">
                    {marco.periodo}
                  </span>
                  {atual && (
                    <span
                      className="font-mono text-[0.6rem] tracking-[0.18em] uppercase"
                      style={{ color: tema.cor }}
                    >
                      ● agora
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-[length:var(--text-step-2)]">{marco.funcao}</h3>
                <p className="mt-1.5 font-mono text-xs tracking-[0.08em] text-text-dim">
                  {marco.organizacao} · {marco.local}
                </p>

                {/* Barra de duração: mostra o tamanho real do período e deixa a
                    sobreposição entre os dois trilhos visível. */}
                <div
                  aria-hidden="true"
                  className={cn("mt-4 flex items-center gap-3", esquerda && "md:flex-row-reverse")}
                >
                  <span className="h-px w-full max-w-28 overflow-hidden">
                    <span
                      className="marco-duracao block h-px"
                      style={{ width: `${(meses / maiorDuracao) * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-[0.6rem] tracking-[0.14em] text-text-mute whitespace-nowrap uppercase tabular-nums">
                    {meses} {meses === 1 ? "mês" : "meses"}
                  </span>
                </div>

                <ul className={cn("mt-5 space-y-2.5", esquerda && "md:text-right")}>
                  {marco.marcas.map((marca) => (
                    <li key={marca} className="text-sm text-text">
                      {marca}
                    </li>
                  ))}
                </ul>

                {marco.stack.length > 0 && (
                  <ul
                    className={cn(
                      "mt-5 flex flex-wrap gap-x-2 gap-y-2",
                      esquerda && "md:justify-end",
                    )}
                  >
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

                {marco.projeto && (
                  <Link
                    href={`/projetos/${marco.projeto}`}
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase transition-colors hover:text-text"
                    style={{ color: tema.cor }}
                  >
                    Ver o projeto
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}

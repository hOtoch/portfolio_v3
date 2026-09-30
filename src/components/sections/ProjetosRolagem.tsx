"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { vitrines, type Vitrine } from "@/content/projetos";
import { servicos } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { cn } from "@/lib/utils";

/**
 * Setor 02 — a rolagem passa pelos projetos.
 *
 * Desktop: o palco fica preso na tela enquanto a trilha (N × altura) rola por
 * baixo; cada trecho da trilha é um projeto. O carrossel de celulares gira
 * para o projeto do trecho e a ficha ao lado sai por cima enquanto a próxima
 * entra por baixo — invertido quando se rola de volta.
 *
 * Tela estreita, tela baixa ou movimento reduzido: não cabe prender, então os
 * projetos descem em lista (cada um com o carrossel parado nele) e cada bloco
 * entra/sai conforme cruza a tela.
 *
 * As transições das fichas moram no CSS (`.vitrine-*[data-estado]`,
 * globals.css); aqui só se decide o estado: "vem" (abaixo), "ativo" ou "saiu".
 */

type Estado = "vem" | "ativo" | "saiu";

const TEMA = {
  web: { texto: "text-magenta", marcador: "text-magenta", barra: "bg-magenta", brilho: "rgba(255,45,143,.42)" },
  rpa: { texto: "text-violet", marcador: "text-violet", barra: "bg-violet", brilho: "rgba(177,75,255,.42)" },
  ia: { texto: "text-crimson", marcador: "text-crimson", barra: "bg-crimson", brilho: "rgba(255,51,85,.42)" },
} as const;

/** Rolagem, em svh, que cada projeto ocupa na trilha presa. */
const TRECHO_SVH = 90;

const CONSULTA_PRESO = "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";

function usePreso() {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(CONSULTA_PRESO);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(CONSULTA_PRESO).matches,
    () => false,
  );
}

function estadoDe(i: number, ativo: number): Estado {
  return i === ativo ? "ativo" : i < ativo ? "saiu" : "vem";
}

export function ProjetosRolagem() {
  return usePreso() ? <Palco /> : <Lista />;
}

/* ── Desktop: palco preso ─────────────────────────────────────────────────── */

function Palco() {
  const trilha = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const [ativo, setAtivo] = useState(0);
  const total = vitrines.length;

  useEffect(() => {
    let agendado = false;

    const medir = () => {
      agendado = false;
      const el = trilha.current;
      if (!el) return;
      const percurso = el.offsetHeight - window.innerHeight;
      const progresso = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / percurso));
      setAtivo(Math.min(total - 1, Math.floor(progresso * total)));
      // A barra acompanha a rolagem contínua sem passar por re-render.
      barra.current?.style.setProperty("--progresso", String(progresso));
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
  }, [total]);

  // Os controles rolam a página até o meio do trecho do projeto: a rolagem
  // continua sendo a fonte da verdade, e o estado vem de `medir`.
  const irPara = (i: number) => {
    const el = trilha.current;
    if (!el) return;
    const alvo = Math.min(total - 1, Math.max(0, i));
    const percurso = el.offsetHeight - window.innerHeight;
    const topo = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: topo + percurso * ((alvo + 0.5) / total), behavior: "smooth" });
  };

  const tema = TEMA[vitrines[ativo].servico];

  return (
    <div ref={trilha} className="relative" style={{ height: `calc(${total} * ${TRECHO_SVH}svh + 100svh)` }}>
      <div className="sticky top-0 flex h-svh items-center pt-16">
        <div
          role="group"
          aria-roledescription="carrossel"
          aria-label="Sites no ar"
          className="grid w-full grid-cols-2 items-center gap-20"
        >
          <div>
            <Aparelhos ativo={ativo} aoEscolher={irPara} className="w-[min(16.5rem,calc((100svh-13rem)*0.462))]" />

            <Controles ativo={ativo} total={total} irPara={irPara} barra={barra} corBarra={tema.barra} />
          </div>

          {/* Fichas empilhadas: a célula mede a mais alta, sem pulo de layout */}
          <div className="grid">
            {vitrines.map((vitrine, i) => {
              const estado = estadoDe(i, ativo);
              return (
                <Ficha
                  key={vitrine.slug}
                  vitrine={vitrine}
                  indice={i}
                  estado={estado}
                  inerte={estado !== "ativo"}
                  className="[grid-area:1/1]"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Carrossel de celulares: o projeto ativo na frente, os vizinhos recuados e
 * apagados atrás, um de cada lado. A rolagem gira o carrossel — cada troca
 * desliza o vizinho para a frente e empurra o atual para trás.
 */
function Aparelhos({
  ativo,
  aoEscolher,
  className,
}: {
  ativo: number;
  aoEscolher: (i: number) => void;
  className?: string;
}) {
  const tema = TEMA[vitrines[ativo].servico];

  return (
    <div className={cn("relative mx-auto aspect-[390/844] select-none", className)}>
      {/* Brilho da cor do serviço atrás do aparelho da frente */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-35%] top-[12%] bottom-[-8%]"
        style={{ background: `radial-gradient(closest-side, ${tema.brilho}, transparent)`, filter: "blur(28px)" }}
      />

      {vitrines.map((vitrine, i) => {
        // Sem volta circular: a rolagem é linear, então o anterior fica à
        // esquerda e o próximo à direita.
        const d = i - ativo;
        const frente = d === 0;
        const visivel = Math.abs(d) <= 1;

        return (
          <div
            key={vitrine.slug}
            inert={!frente}
            onClick={() => visivel && !frente && aoEscolher(i)}
            className={cn(
              "carrossel-tela absolute inset-0",
              visivel && !frente ? "cursor-pointer" : !visivel && "pointer-events-none",
            )}
            style={{
              transform: `translateX(${d * 62}%) scale(${frente ? 1 : 0.8}) perspective(1200px) rotateY(${d * -16}deg)`,
              opacity: frente ? 1 : visivel ? 0.38 : 0,
              zIndex: frente ? 3 : visivel ? 2 : 1,
              transitionDuration: "var(--dur-scene)",
            }}
          >
            <PhoneFrame
              src={vitrine.telas[0].src}
              alt={vitrine.telas[0].alt}
              brilho={frente ? TEMA[vitrine.servico].brilho : undefined}
              className="h-full"
            />
          </div>
        );
      })}
    </div>
  );
}

function Controles({
  ativo,
  total,
  irPara,
  barra,
  corBarra,
}: {
  ativo: number;
  total: number;
  irPara: (i: number) => void;
  barra: React.RefObject<HTMLSpanElement | null>;
  corBarra: string;
}) {
  const botao =
    "chamfer grid size-10 place-items-center border border-hairline-hi bg-surface-3/60 font-mono text-sm text-text-dim transition-colors duration-[--dur-fast] hover:border-magenta hover:text-text-hi disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="relative mt-10 flex items-center justify-center gap-5">
      <button type="button" onClick={() => irPara(ativo - 1)} disabled={ativo === 0} aria-label="Projeto anterior" className={botao}>
        ↑
      </button>

      {/* Progresso contínuo da rolagem pela trilha */}
      <span aria-hidden="true" className="relative h-0.5 w-24 overflow-hidden rounded-full bg-hairline-hi">
        <span
          ref={barra}
          className={cn("absolute inset-0 origin-left scale-x-(--progresso) transition-colors duration-(--dur-slow)", corBarra)}
          style={{ "--progresso": 0 } as React.CSSProperties}
        />
      </span>

      <p
        aria-live="polite"
        className="min-w-[4.5rem] text-center font-mono text-xs tracking-[0.14em] whitespace-nowrap text-text-mute tabular-nums"
      >
        <span className="sr-only">Projeto </span>
        {String(ativo + 1).padStart(2, "0")}
        <span aria-hidden="true"> / </span>
        <span className="sr-only"> de </span>
        {String(total).padStart(2, "0")}
      </p>

      <button
        type="button"
        onClick={() => irPara(ativo + 1)}
        disabled={ativo === total - 1}
        aria-label="Próximo projeto"
        className={botao}
      >
        ↓
      </button>
    </div>
  );
}

/* ── Tela estreita: lista com entrada e saída ─────────────────────────────── */

function Lista() {
  const blocos = useRef<(HTMLLIElement | null)[]>([]);

  const irPara = (i: number) => {
    blocos.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <ol className="space-y-24">
      {vitrines.map((vitrine, i) => (
        <li
          key={vitrine.slug}
          ref={(el) => {
            blocos.current[i] = el;
          }}
          className="grid scroll-mt-24 items-center gap-12 lg:grid-cols-2 lg:gap-20"
        >
          {/* Cada bloco mostra o carrossel com o seu projeto na frente */}
          <NaTela>
            {(estado) => (
              <div data-estado={estado} className="vitrine-aparelho">
                <Aparelhos ativo={i} aoEscolher={irPara} className="w-[min(58vw,16.5rem)]" />
              </div>
            )}
          </NaTela>
          <NaTela>{(estado) => <Ficha vitrine={vitrine} indice={i} estado={estado} />}</NaTela>
        </li>
      ))}
    </ol>
  );
}

/** Estado do bloco em relação à tela: entra ao cruzar, sai pelo lado que deixou. */
function NaTela({ children }: { children: (estado: Estado) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("vem");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEstado("ativo");
      return;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) setEstado("ativo");
        else setEstado(entrada.boundingClientRect.top < 0 ? "saiu" : "vem");
      },
      { threshold: 0.15, rootMargin: "-8% 0px -8% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return <div ref={ref}>{children(estado)}</div>;
}

/* ── Ficha do projeto ─────────────────────────────────────────────────────── */

function Ficha({
  vitrine,
  indice,
  estado,
  inerte = false,
  className,
}: {
  vitrine: Vitrine;
  indice: number;
  estado: Estado;
  /** Fora de cena no palco preso: sem foco, clique nem leitor de tela. */
  inerte?: boolean;
  className?: string;
}) {
  const servico = servicos.find((s) => s.id === vitrine.servico)!;
  const tema = TEMA[vitrine.servico];
  // Cada filho entra um passo depois do anterior (--ordem no CSS).
  const ordem = (n: number) => ({ "--ordem": n }) as React.CSSProperties;

  return (
    <article data-estado={estado} inert={inerte} className={cn("vitrine-ficha", className)}>
      <p
        style={ordem(0)}
        className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.68rem] tracking-[0.14em] text-text-mute uppercase"
      >
        <span>[ {String(indice + 1).padStart(2, "0")} ]</span>
        <span className={tema.texto}>{servico.codinome}</span>
      </p>

      <h3 style={ordem(1)} className="mt-5 text-[length:var(--text-step-3)]">
        {vitrine.titulo}
      </h3>
      <p style={ordem(1)} className="mt-3 font-mono text-xs tracking-[0.08em] text-text-dim">
        {vitrine.segmento}
      </p>

      <p style={ordem(2)} className="mt-7 max-w-[54ch] leading-relaxed text-text">
        {vitrine.resumo}
      </p>

      <ul style={ordem(3)} className="mt-7 space-y-2.5">
        {vitrine.destaques.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-dim">
            <span aria-hidden="true" className={tema.marcador}>
              ·
            </span>
            {item}
          </li>
        ))}
      </ul>

      <ul style={ordem(4)} className="mt-8 flex flex-wrap gap-2" aria-label="Stack">
        {vitrine.stack.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-hairline bg-surface-3 px-2.5 py-1 font-mono text-[0.68rem] text-text-dim"
          >
            {item}
          </li>
        ))}
      </ul>

      <div style={ordem(5)} className="mt-10">
        <Button href={vitrine.url} target="_blank" rel="noopener noreferrer" seta>
          Ver site no ar
          <span className="sr-only"> (abre em nova aba)</span>
        </Button>
      </div>
    </article>
  );
}

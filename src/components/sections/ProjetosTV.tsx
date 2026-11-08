"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import type { Projeto, Status } from "@/content/projetos";
import { eixos } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { LinkProducao } from "@/components/ui/LinkProducao";
import { cn } from "@/lib/utils";

/**
 * Setor 02 — a televisão.
 *
 * v6 — a TV é uma foto real (`public/tv.jpg`) que cobre a tela inteira. Os
 * prints do projeto passam por cima do tubo apagado da foto, posicionados em
 * porcentagem da imagem (`.tv-tela`, globals.css), então o encaixe vale em
 * qualquer largura.
 *
 * Cada projeto é um canal. No desktop a cena fica presa na tela enquanto a
 * trilha rola por baixo; ao cruzar para o trecho do próximo projeto a TV chia
 * (ruído em canvas, tranco na imagem, faixa rolando) e volta sintonizada no
 * canal novo. Rolando de volta, o caminho inverte. Dentro do canal, as telas
 * do projeto se revezam como uma programação.
 *
 * Tela estreita, tela baixa ou movimento reduzido: não cabe prender, então a
 * mesma TV, recortada em volta do aparelho, vira um controle remoto: o guia de
 * canais embaixo dela e o deslize na tela trocam o canal (sem chiado com
 * movimento reduzido). Nenhum projeto aparece duas vezes.
 *
 * A ficha ao lado é curta de propósito: categoria, título, uma frase e o botão.
 * Números, stack e decisões moram na página do case.
 */

type Estado = "vem" | "ativo" | "saiu";

const TEMA = {
  magenta: { texto: "text-magenta", brilho: "rgba(255,45,143,.28)" },
  violet: { texto: "text-violet", brilho: "rgba(177,75,255,.28)" },
  crimson: { texto: "text-crimson", brilho: "rgba(255,51,85,.28)" },
} as const;

const ETIQUETA: Record<Status, { rotulo: string; titulo: string }> = {
  "no-ar": { rotulo: "Em produção", titulo: "Publicado e em uso, com endereço aberto" },
  privado: {
    rotulo: "Privado · sem demo",
    titulo: "Projeto autoral de uso próprio: roda localmente ou em VPS própria",
  },
  confidencial: {
    rotulo: "Confidencial",
    titulo: "Projeto de empresa ou cliente: mostrado só no nível de arquitetura",
  },
};

/** A foto do aparelho. As medidas da tela dentro dela estão em `.tv-tela`. */
const FOTO = { src: "/tv.jpg", largura: 2752, altura: 1536 } as const;

/** Rolagem, em svh, que cada canal ocupa na trilha presa. */
const TRECHO_SVH = 100;
/** Duração total do chiado e o instante, dentro dele, em que o canal troca. */
const CHIADO_MS = 640;
const TROCA_MS = 260;
/** Tempo de cada tela na programação do canal. */
const QUADRO_MS = 4200;

/**
 * Abaixo de 3:2 a TV da foto ocupa a largura quase toda e não sobra coluna
 * para o texto (iPad deitado, monitor 5:4): cai para a lista.
 */
const CONSULTA_PRESO =
  "(min-width: 1024px) and (min-height: 680px) and (min-aspect-ratio: 3/2) and (prefers-reduced-motion: no-preference)";

const pad = (n: number) => String(n).padStart(2, "0");

function useConsulta(consulta: string) {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}

/**
 * Canal no ar + chiado. `sintonizar` é chamado de evento (rolagem, clique,
 * interseção), nunca do corpo de um efeito: liga o chiado, troca o canal no
 * meio dele e desliga no fim. Trocas seguidas reiniciam o relógio.
 */
function useSintonia(inicial: number) {
  const [noAr, setNoAr] = useState(inicial);
  const [chiando, setChiando] = useState(false);
  const relogios = useRef<number[]>([]);

  const sintonizar = useCallback((canal: number) => {
    relogios.current.forEach(clearTimeout);
    setChiando(true);
    relogios.current = [
      window.setTimeout(() => setNoAr(canal), TROCA_MS),
      window.setTimeout(() => setChiando(false), CHIADO_MS),
    ];
  }, []);

  useEffect(() => {
    const pendentes = relogios.current;
    return () => pendentes.forEach(clearTimeout);
  }, []);

  return { noAr, chiando, sintonizar };
}

/**
 * Botão de energia da TV. `mudou` só vira true no primeiro clique: sem ele a
 * TV faria a animação de ligar toda vez que a página carrega.
 */
function useEnergia(aoLigar: () => void) {
  const [ligada, setLigada] = useState(true);
  const [mudou, setMudou] = useState(false);

  const definir = (valor: boolean) => {
    setMudou(true);
    setLigada(valor);
    if (valor) aoLigar();
  };

  return {
    ligada,
    mudou,
    alternar: () => definir(!ligada),
    /** Escolher um canal com a TV desligada liga a TV, como num controle remoto. */
    garantirLigada: () => {
      if (!ligada) definir(true);
    },
  };
}

type Props = {
  canais: readonly Projeto[];
  /** Título da seção. No palco preso ele fica na coluna da esquerda, sobre a foto. */
  cabecalho: React.ReactNode;
};

export function ProjetosTV({ canais, cabecalho }: Props) {
  return useConsulta(CONSULTA_PRESO) ? (
    <Palco canais={canais} cabecalho={cabecalho} />
  ) : (
    <Controle canais={canais} cabecalho={cabecalho} />
  );
}

/* ── Desktop: palco preso ─────────────────────────────────────────────────── */

function Palco({ canais, cabecalho }: Props) {
  const trilha = useRef<HTMLDivElement>(null);
  const alvo = useRef(0);
  const { noAr, chiando, sintonizar } = useSintonia(0);
  const energia = useEnergia(() => sintonizar(alvo.current));
  const total = canais.length;

  useEffect(() => {
    let agendado = false;

    const medir = () => {
      agendado = false;
      const el = trilha.current;
      if (!el) return;
      const percurso = el.offsetHeight - window.innerHeight;
      const progresso = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / percurso));
      const canal = Math.min(total - 1, Math.floor(progresso * total));
      if (canal !== alvo.current) {
        alvo.current = canal;
        sintonizar(canal);
      }
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
  }, [total, sintonizar]);

  // Os botões de canal rolam a página até o meio do trecho: a rolagem
  // continua sendo a fonte da verdade, e a troca vem de `medir`.
  const irPara = (i: number) => {
    energia.garantirLigada();
    const el = trilha.current;
    if (!el) return;
    const percurso = el.offsetHeight - window.innerHeight;
    const topo = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: topo + percurso * ((i + 0.5) / total), behavior: "smooth" });
  };

  return (
    <div
      ref={trilha}
      className="relative"
      style={{ height: `calc(${total} * ${TRECHO_SVH}svh + 100svh)` }}
    >
      <div className="sticky top-0 h-svh">
        <div className="cena cena--palco">
          <div className="cena-fundo">
            <Televisao
              canais={canais}
              noAr={noAr}
              chiando={chiando}
              ligada={energia.ligada}
              mudou={energia.mudou}
              aoEnergia={energia.alternar}
              prioridade
              sizes="115vw"
            />
          </div>

          <div className="cena-ui">
            <div className="cena-lado">
              {cabecalho}
              <Fichas canais={canais} noAr={noAr} />
            </div>

            <GuiaCanais canais={canais} noAr={noAr} aoEscolher={irPara} className="cena-guia" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Celular, tela quase quadrada ou movimento reduzido: controle remoto ──── */

/** Deslocamento mínimo, em px, para um arrasto na tela contar como troca de canal. */
const ARRASTO_PX = 48;

/**
 * Uma TV só, sem prender a rolagem: o canal troca pelo guia logo abaixo ou
 * deslizando o dedo na tela. Um toque simples na tela continua abrindo o case.
 */
function Controle({ canais, cabecalho }: Props) {
  const { noAr, chiando, sintonizar } = useSintonia(0);
  const total = canais.length;
  // O canal pedido por último: `noAr` só muda no meio do chiado, e dois
  // deslizes seguidos precisam contar a partir do segundo, não do primeiro.
  const alvo = useRef(0);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const deslizou = useRef(false);
  const energia = useEnergia(() => sintonizar(alvo.current));

  const trocar = (canal: number) => {
    energia.garantirLigada();
    if (canal === alvo.current) return;
    alvo.current = canal;
    sintonizar(canal);
  };

  return (
    <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
      <div data-reveal>{cabecalho}</div>

      <div
        className="cena cena--solo mt-10"
        onPointerDown={(e) => {
          toque.current = { x: e.clientX, y: e.clientY };
          deslizou.current = false;
        }}
        onPointerUp={(e) => {
          const inicio = toque.current;
          toque.current = null;
          if (!inicio || total < 2) return;
          const dx = e.clientX - inicio.x;
          const dy = e.clientY - inicio.y;
          if (Math.abs(dx) < ARRASTO_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
          deslizou.current = true;
          trocar((alvo.current + (dx < 0 ? 1 : -1) + total) % total);
        }}
        onPointerCancel={() => {
          toque.current = null;
        }}
        // O deslize não pode virar clique no link da tela.
        onClickCapture={(e) => {
          if (!deslizou.current) return;
          deslizou.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="cena-fundo">
          <Televisao
            canais={canais}
            noAr={noAr}
            chiando={chiando}
            ligada={energia.ligada}
            mudou={energia.mudou}
            aoEnergia={energia.alternar}
            prioridade
            sizes="(min-width: 768px) 96rem, 185vw"
          />
        </div>
      </div>

      <GuiaCanais
        canais={canais}
        noAr={noAr}
        aoEscolher={trocar}
        dica="deslize na tela"
        horizontal
        className="mx-auto mt-5 max-w-[52rem]"
      />

      <Fichas canais={canais} noAr={noAr} className="mx-auto mt-10 max-w-[52rem]" />
    </div>
  );
}

/* ── Peças compartilhadas pelo palco e pelo controle ──────────────────────── */

/** Fichas empilhadas na mesma célula: ela mede a mais alta, sem pulo de layout. */
function Fichas({
  canais,
  noAr,
  className,
}: {
  canais: readonly Projeto[];
  noAr: number;
  className?: string;
}) {
  return (
    <div className={cn("grid", className)}>
      {canais.map((projeto, i) => {
        const estado: Estado = i === noAr ? "ativo" : i < noAr ? "saiu" : "vem";
        return (
          <Ficha
            key={projeto.slug}
            projeto={projeto}
            indice={i}
            estado={estado}
            inerte={estado !== "ativo"}
            className="[grid-area:1/1]"
          />
        );
      })}
    </div>
  );
}

/** Guia de canais: número em cima, nome embaixo. */
function GuiaCanais({
  canais,
  noAr,
  aoEscolher,
  dica,
  horizontal = false,
  className,
}: {
  canais: readonly Projeto[];
  noAr: number;
  aoEscolher: (i: number) => void;
  /** Complemento do rótulo, ex. como trocar de canal no celular. */
  dica?: string;
  /** Botões lado a lado (controle) em vez de empilhados (palco). */
  horizontal?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Canais" className={className}>
      <p className="font-mono text-[0.62rem] tracking-[0.22em] text-text-mute uppercase tabular-nums">
        {pad(canais.length)} canais{dica && ` · ${dica}`}
      </p>
      <ol
        className={cn(
          "mt-3 grid gap-1.5",
          // 6.5rem: três canais cabem numa linha só num celular de 375px.
          horizontal && "grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-2 [&_li]:min-w-0",
        )}
      >
        {canais.map((canal, i) => (
          <li key={canal.slug} className="grid">
            <button
              type="button"
              aria-pressed={i === noAr}
              onClick={() => aoEscolher(i)}
              className={cn("guia-canal", horizontal && "guia-canal--compacto")}
            >
              <span className="guia-canal-numero">CH {pad(i + 1)}</span>
              <span>{canal.titulo}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── O aparelho: a foto e a tela por cima do tubo ─────────────────────────── */

function Televisao({
  canais,
  noAr,
  chiando,
  ligada,
  mudou,
  aoEnergia,
  prioridade = false,
  sizes,
}: {
  canais: readonly Projeto[];
  noAr: number;
  chiando: boolean;
  ligada: boolean;
  /** Já houve clique no botão de energia: libera a animação de ligar. */
  mudou: boolean;
  aoEnergia: () => void;
  prioridade?: boolean;
  /** `sizes` da foto: a placa é mais larga que a cena. */
  sizes: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);
  const reduzido = useConsulta("(prefers-reduced-motion: reduce)");

  const projeto = canais[noAr];
  const eixo = eixos.find((e) => e.id === projeto.eixo)!;
  const tema = TEMA[eixo.cor];

  // A programação só roda com a TV na tela.
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={raiz}
      className="cena-placa"
      style={{ "--tv-brilho": tema.brilho } as React.CSSProperties}
    >
      <Image
        src={FOTO.src}
        alt=""
        width={FOTO.largura}
        height={FOTO.altura}
        sizes={sizes}
        preload={prioridade}
        draggable={false}
        className="absolute inset-0 size-full select-none"
      />

      <div
        className="tv-tela"
        data-chiando={(ligada && chiando) || undefined}
        data-energia={ligada ? "ligada" : "desligada"}
        data-mudou={mudou || undefined}
      >
        {/* Tudo o que o tubo emite: é isto que encolhe numa linha ao desligar */}
        <div className="tv-sinal">
          <div className="tv-imagem">
            {canais.map((canal, i) => (
              <Programa
                key={canal.slug}
                projeto={canal}
                ativo={i === noAr}
                rodando={ligada && i === noAr && visivel && !chiando && !reduzido}
                prioridade={prioridade && i === noAr}
              />
            ))}
          </div>

          <div aria-hidden="true" className="tv-linhas" />

          {/* OSD: sinal ao vivo e número do canal */}
          <div aria-hidden="true" className="tv-osd">
            <span className="tv-ao-vivo">
              <span className="tv-ao-vivo-ponto" />
              Ao vivo
            </span>
            <span key={noAr} className="tv-canal">
              CH {pad(noAr + 1)}
            </span>
          </div>

          <Chiado ligado={ligada && chiando} />
        </div>

        {/* A tela inteira abre o case — atalho de mouse; o teclado usa o botão da ficha.
            Desligada, a tela não abre nada. */}
        {ligada && (
          <Link
            href={`/projetos/${projeto.slug}`}
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 z-[2]"
          />
        )}

        <div aria-hidden="true" className="tv-vidro" />
      </div>

      {/* Botão de energia e LED do próprio aparelho da foto */}
      <button
        type="button"
        aria-pressed={ligada}
        aria-label={ligada ? "Desligar a TV" : "Ligar a TV"}
        title={ligada ? "Desligar" : "Ligar"}
        onClick={aoEnergia}
        className="tv-energia"
      />
      <span aria-hidden="true" className="tv-led" data-ligada={ligada || undefined} />

      <p aria-live="polite" className="sr-only">
        {ligada ? `Canal ${noAr + 1} de ${canais.length}: ${projeto.titulo}` : "TV desligada"}
      </p>
    </div>
  );
}

/** As telas de um projeto se revezando dentro do canal. */
function Programa({
  projeto,
  ativo,
  rodando,
  prioridade,
}: {
  projeto: Projeto;
  ativo: boolean;
  rodando: boolean;
  prioridade: boolean;
}) {
  const telas = (projeto.desktop ?? []).slice(0, 4);
  const [quadro, setQuadro] = useState(0);

  useEffect(() => {
    if (!rodando || telas.length < 2) return;
    const id = window.setInterval(() => setQuadro((q) => (q + 1) % telas.length), QUADRO_MS);
    return () => window.clearInterval(id);
  }, [rodando, telas.length]);

  return (
    <div className="tv-programa" data-ativo={ativo || undefined} aria-hidden={!ativo}>
      {telas.map((tela, i) => (
        <div key={tela.src} className="tv-quadro" data-ativo={i === quadro || undefined}>
          <Image
            src={tela.src}
            alt={i === quadro ? tela.alt : ""}
            fill
            draggable={false}
            sizes="(min-width: 1024px) 45vw, 70vw"
            preload={prioridade && i === 0}
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

/** Ruído de TV fora do ar, desenhado só enquanto chia. */
function Chiado({ ligado }: { ligado: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ligado) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width: w, height: h } = canvas;
    const imagem = ctx.createImageData(w, h);
    const pixels = new Uint32Array(imagem.data.buffer);
    let quadro = 0;

    const desenhar = () => {
      for (let y = 0; y < h; y++) {
        // Cada linha com intensidade própria: o ruído sai em faixas, como sinal ruim.
        const faixa = 0.45 + Math.random() * 0.55;
        for (let x = 0; x < w; x++) {
          const v = (Math.random() * 255 * faixa) | 0;
          pixels[y * w + x] = 0xff000000 | (v << 16) | (v << 8) | v;
        }
      }
      ctx.putImageData(imagem, 0, 0);
      quadro = requestAnimationFrame(desenhar);
    };

    desenhar();
    return () => cancelAnimationFrame(quadro);
  }, [ligado]);

  return (
    <canvas
      ref={ref}
      width={192}
      height={136}
      aria-hidden="true"
      data-ligado={ligado || undefined}
      className="tv-chiado"
    />
  );
}

/* ── Ficha do canal ───────────────────────────────────────────────────────── */

function Etiqueta({ status }: { status: Status }) {
  const { rotulo, titulo } = ETIQUETA[status];

  return (
    <span
      title={titulo}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.14em] uppercase",
        status === "no-ar" ? "border-cyan/40 text-cyan/90" : "border-hairline-hi text-text-mute",
      )}
    >
      {status === "no-ar" ? (
        <span aria-hidden="true" className="relative flex size-1.5">
          <span className="absolute inset-0 rounded-full bg-cyan motion-safe:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-cyan" />
        </span>
      ) : (
        <span aria-hidden="true">◌</span>
      )}
      {rotulo}
    </span>
  );
}

function Ficha({
  projeto,
  indice,
  estado,
  inerte = false,
  className,
}: {
  projeto: Projeto;
  indice: number;
  estado: Estado;
  /** Fora do ar no palco preso: sem foco, clique nem leitor de tela. */
  inerte?: boolean;
  className?: string;
}) {
  const eixo = eixos.find((e) => e.id === projeto.eixo)!;
  const tema = TEMA[eixo.cor];
  // Cada filho entra um passo depois do anterior (--ordem no CSS).
  const ordem = (n: number) => ({ "--ordem": n }) as React.CSSProperties;

  return (
    <article data-estado={estado} inert={inerte} className={cn("canal-ficha", className)}>
      <div
        style={ordem(0)}
        className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase"
      >
        <span className="text-text-mute">CH {pad(indice + 1)}</span>
        <span className={tema.texto}>
          <span aria-hidden="true" className="mr-2">
            {eixo.glifo}
          </span>
          {eixo.codinome}
        </span>
        <Etiqueta status={projeto.status} />
      </div>

      <div style={ordem(1)} className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h3 className="text-[length:var(--text-step-3)] leading-[1.02]">{projeto.titulo}</h3>
        {projeto.url && <LinkProducao url={projeto.url} />}
      </div>

      <p style={ordem(2)} className="canal-ficha-resumo mt-4 max-w-[46ch] leading-relaxed text-text">
        {projeto.subtitulo}
      </p>

      <div style={ordem(3)} className="mt-7">
        <Button href={`/projetos/${projeto.slug}`} seta>
          Abrir o case
          <span className="sr-only">: {projeto.titulo}</span>
        </Button>
      </div>
    </article>
  );
}

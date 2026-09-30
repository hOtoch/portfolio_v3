"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/**
 * Chuva com relâmpago — porte do componente `rain.tsx` (shadcn/registry).
 *
 * O que mudou em relação ao original, e por quê:
 *
 * 1. Keyframes foram para o globals.css. No App Router o `<style jsx>` exige um
 *    StyleRegistry no layout (node_modules/next/dist/docs/.../css-in-js.md), e o
 *    projeto já concentra keyframes num lugar só.
 * 2. O lint do React Compiler (Next 16) rejeita três padrões do original:
 *    setState no corpo de effect, useCallback que se auto-referencia para
 *    reagendar, e mutação de ref. Reescrito com useSyncExternalStore para ler o
 *    ambiente, useMemo para as gotas e agendamento recursivo dentro do effect.
 * 3. O trovão é sintetizado em WebAudio (o caminho do `ThunderAudio` original).
 *    O data URL base64 do componente vinha truncado e não era um WAV válido.
 * 4. Gating de custo e acessibilidade: não monta sob prefers-reduced-motion,
 *    abaixo de 768px nem em máquinas de 4 núcleos ou menos (design.md §7.3, §12).
 * 5. O clarão respeita o limite de 3 flashes por segundo (WCAG 2.3.1).
 */

interface RainDrop {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  size: number;
  delay: number;
}

interface Lightning {
  id: number;
  type: "flash" | "bolt";
  intensity: number;
  duration: number;
}

export interface RainBackgroundProps {
  /** Número de gotas. Cada gota é um nó no DOM com a própria animação. */
  intensity?: number;
  /** Multiplicador de velocidade (maior = mais rápido). */
  speed?: number;
  /** Cor da gota. */
  color?: string;
  /** Inclinação do vento, em graus. */
  angle?: number;
  dropSize?: { min: number; max: number };
  lightningEnabled?: boolean;
  /** Intervalo base entre relâmpagos, em segundos (sorteia entre f e 2f). */
  lightningFrequency?: number;
  /** Cor do clarão e do raio, como `"R, G, B"`. */
  lightningColor?: string;
  /** Teto da intensidade (0–1). Abaixo de 1 evita estourar a cena. */
  lightningMaxIntensity?: number;
  thunderEnabled?: boolean;
  thunderVolume?: number;
  thunderDelay?: number;
  /** Semente do sorteio das gotas. Trocar muda o desenho da chuva. */
  seed?: number;
  className?: string;
  children?: React.ReactNode;
}

/* ── Ambiente ─────────────────────────────────────────────────────────── */

const MQ_MOVIMENTO = "(prefers-reduced-motion: reduce)";
const MQ_PEQUENA = "(max-width: 767px)";

function inscrever(aoMudar: () => void) {
  const consultas = [window.matchMedia(MQ_MOVIMENTO), window.matchMedia(MQ_PEQUENA)];
  consultas.forEach((mq) => mq.addEventListener("change", aoMudar));
  return () => consultas.forEach((mq) => mq.removeEventListener("change", aoMudar));
}

function lerCliente() {
  const semMovimento = window.matchMedia(MQ_MOVIMENTO).matches;
  const telaPequena = window.matchMedia(MQ_PEQUENA).matches;
  const fraca = (navigator.hardwareConcurrency ?? 8) <= 4;
  return !semMovimento && !telaPequena && !fraca;
}

/** No servidor a chuva nunca existe: é enfeite e não deve ir no HTML. */
const lerServidor = () => false;

/* ── Gotas ────────────────────────────────────────────────────────────── */

/** mulberry32 — PRNG deterministico por seed. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Gerador puro: as mesmas entradas dao sempre a mesma chuva.
 * `Math.random` durante o render e barrado pelo lint (react-hooks/purity) — e
 * de todo jeito seria instavel a cada re-render.
 */
function gerarGotas(
  quantidade: number,
  velocidade: number,
  minimo: number,
  maximo: number,
  seed: number,
): RainDrop[] {
  const rand = rng(seed);
  return Array.from({ length: quantidade }, (_, id) => ({
    id,
    left: rand() * 100,
    animationDuration: (rand() + 0.5) / velocidade,
    opacity: rand() * 0.6 + 0.2,
    size: rand() * (maximo - minimo) + minimo,
    delay: rand() * 2,
  }));
}

/* ── Trovão ───────────────────────────────────────────────────────────── */

function tocarTrovao(volume: number) {
  const Contexto =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Contexto) return;

  const ctx = new Contexto();
  const duracao = 2 + Math.random() * 3;
  const amostras = Math.floor(ctx.sampleRate * duracao);
  const buffer = ctx.createBuffer(1, amostras, ctx.sampleRate);
  const canal = buffer.getChannelData(0);

  for (let i = 0; i < amostras; i++) {
    const t = i / ctx.sampleRate;
    let amostra = 0;
    amostra += (Math.random() * 2 - 1) * Math.exp(-t * 2) * 0.5; // estalo
    amostra += (Math.random() * 2 - 1) * Math.exp(-t * 0.5) * 0.3; // ronco
    amostra += Math.sin(t * 60 + Math.random() * 10) * Math.exp(-t) * 0.2; // grave
    canal[i] = amostra * Math.exp(-t * 0.8) * (1 - Math.exp(-t * 10));
  }

  const fonte = ctx.createBufferSource();
  const ganho = ctx.createGain();
  fonte.buffer = buffer;
  ganho.gain.value = volume;
  fonte.connect(ganho);
  ganho.connect(ctx.destination);
  fonte.onended = () => void ctx.close();
  fonte.start();
}

/** Caminho quebrado do raio, de cima até embaixo, em coordenadas 0–100. */
function caminhoDoRaio() {
  const segmentos = 8 + Math.floor(Math.random() * 4);
  let x = Math.random() * 100;
  let caminho = `M ${x} 0`;

  for (let i = 1; i <= segmentos; i++) {
    x = Math.max(0, Math.min(100, x + (Math.random() - 0.5) * 20));
    caminho += ` L ${x} ${(i * 100) / segmentos}`;
  }

  return caminho;
}

/* ── Componente ───────────────────────────────────────────────────────── */

export function RainBackground({
  intensity = 100,
  speed = 1,
  color = "rgba(174, 194, 224, 0.6)",
  angle = 0,
  dropSize = { min: 1, max: 3 },
  lightningEnabled = false,
  lightningFrequency = 8,
  lightningColor = "255, 255, 255",
  lightningMaxIntensity = 1,
  thunderEnabled = false,
  thunderVolume = 0.5,
  thunderDelay = 2,
  seed = 1312,
  className,
  children,
}: RainBackgroundProps) {
  const ativo = useSyncExternalStore(inscrever, lerCliente, lerServidor);
  const [lightning, setLightning] = useState<Lightning | null>(null);

  const dropMin = dropSize.min;
  const dropMax = dropSize.max;

  // Gotas montadas no render a partir de um gerador puro e deterministico.
  const raindrops = useMemo<RainDrop[]>(
    () => (ativo ? gerarGotas(intensity, speed, dropMin, dropMax, seed) : []),
    [ativo, intensity, speed, dropMin, dropMax, seed],
  );

  // Ciclo do relâmpago. O reagendamento vive dentro do effect para não precisar
  // de um useCallback que se auto-referencia (barrado pelo lint).
  useEffect(() => {
    if (!ativo || !lightningEnabled) return;

    const pendentes: ReturnType<typeof setTimeout>[] = [];
    let vivo = true;
    let contador = 0;

    const agendar = (atraso: number) => {
      pendentes.push(
        setTimeout(() => {
          if (!vivo) return;

          const tipos: Lightning["type"][] = ["flash", "flash", "bolt"];
          const type = tipos[Math.floor(Math.random() * tipos.length)];
          const duration =
            type === "flash" ? 150 + Math.random() * 100 : 300 + Math.random() * 200;

          contador += 1;
          setLightning({
            id: contador,
            type,
            intensity: (Math.random() * 0.8 + 0.2) * lightningMaxIntensity,
            duration,
          });

          pendentes.push(
            setTimeout(() => {
              if (vivo) setLightning(null);
            }, duration),
          );

          if (thunderEnabled) {
            pendentes.push(
              setTimeout(() => {
                if (vivo) tocarTrovao(thunderVolume);
              }, thunderDelay * 1000),
            );
          }

          agendar((lightningFrequency + Math.random() * lightningFrequency) * 1000);
        }, atraso),
      );
    };

    agendar(Math.random() * lightningFrequency * 1000);

    return () => {
      vivo = false;
      pendentes.forEach(clearTimeout);
    };
  }, [
    ativo,
    lightningEnabled,
    lightningFrequency,
    lightningMaxIntensity,
    thunderEnabled,
    thunderVolume,
    thunderDelay,
  ]);

  return (
    // Sem `relative` embutido: ele conflitaria com um `absolute` vindo da prop
    // (o `cn` daqui nao faz merge de utilitarios como o do shadcn) e o root
    // colapsava para altura 0, apagando a chuva. Quem usa define a posicao.
    <div className={cn("overflow-hidden", className)}>
      {lightning?.type === "flash" && (
        <div
          aria-hidden="true"
          className="animate-lightning-flash pointer-events-none absolute inset-0 z-20"
          style={{
            background: `radial-gradient(circle, rgba(${lightningColor}, ${lightning.intensity}) 0%, rgba(${lightningColor}, ${lightning.intensity * 0.3}) 50%, transparent 100%)`,
            animationDuration: `${lightning.duration}ms`,
          }}
        />
      )}

      {lightning?.type === "bolt" && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="animate-lightning-bolt h-full w-full"
            style={{ animationDuration: `${lightning.duration}ms` }}
          >
            <defs>
              <filter id="brilho-raio">
                <feGaussianBlur stdDeviation="2" result="borrado" />
                <feMerge>
                  <feMergeNode in="borrado" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d={caminhoDoRaio()}
              stroke={`rgba(${lightningColor}, ${lightning.intensity})`}
              strokeWidth="1.5"
              fill="none"
              filter="url(#brilho-raio)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}

      <div
        aria-hidden="true"
        data-fx="rain"
        className="pointer-events-none absolute inset-0"
        style={{ transform: `rotate(${angle}deg)`, transformOrigin: "center center" }}
      >
        {raindrops.map((drop) => (
          <div
            key={drop.id}
            className="animate-rain-fall absolute"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 10}px`,
              background: `linear-gradient(to bottom, transparent, ${color})`,
              borderRadius: `${drop.size}px`,
              animationDuration: `${drop.animationDuration}s`,
              animationDelay: `${drop.delay}s`,
              opacity: drop.opacity,
              top: "-20px",
            }}
          />
        ))}
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

/**
 * Chuva do hero — design.md §6.11.
 * Overlay sem filhos, na frente do skyline e atrás do conteúdo.
 */
export function Rain() {
  return (
    <RainBackground
      intensity={260}
      speed={0.55}
      angle={10}
      color="rgba(198, 186, 232, 0.55)"
      dropSize={{ min: 1, max: 2 }}
      lightningEnabled
      lightningFrequency={14}
      lightningColor="177, 75, 255"
      lightningMaxIntensity={0.32}
      thunderEnabled={false}
      className="pointer-events-none absolute inset-0"
    />
  );
}

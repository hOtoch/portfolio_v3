"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Carrossel de celulares — no lugar do `phone-mockups-1` (registry shadcn).
 *
 * O componente original importa `phone-mockups-1-utils/phone-carousel`, que não
 * veio junto; este aqui respeita a mesma API (`images: { src, alt }[]`) e foi
 * desenhado no sistema do site: moldura em surface/hairline, brilho na cor do
 * serviço, controles em mono. Sem shadcn Button nem cva — os controles usam os
 * tokens daqui, e as duas dependências não teriam mais nenhum uso.
 *
 * Tela ativa na frente; vizinhas recuadas e apagadas atrás, em loop.
 * Navega por botão, clique na vizinha, arrasto/deslize e setas do teclado.
 */

export type ImageItem = { src: string; alt: string };

const COR = {
  magenta: { brilho: "rgba(255,45,143,.42)", ativo: "bg-magenta" },
  violet: { brilho: "rgba(177,75,255,.42)", ativo: "bg-violet" },
  crimson: { brilho: "rgba(255,51,85,.42)", ativo: "bg-crimson" },
} as const;

type Props = {
  images: readonly ImageItem[];
  /** Nome de quem aparece nas telas — entra nos rótulos de acessibilidade. */
  rotulo?: string;
  cor?: keyof typeof COR;
  className?: string;
};

const ARRASTO_MINIMO = 40;

export function PhoneCarousel({ images, rotulo = "site", cor = "magenta", className }: Props) {
  const [ativo, setAtivo] = useState(0);
  const inicioArrasto = useRef<number | null>(null);
  const idContador = useId();
  const total = images.length;
  const tema = COR[cor];

  const circular = (indice: number) => ((indice % total) + total) % total;
  const ir = (indice: number) => setAtivo(circular(indice));
  // Passo relativo em cima do valor mais recente: dois cliques rápidos antes do
  // re-render leriam o mesmo `ativo` e andariam uma tela só.
  const andar = (passo: number) => setAtivo((atual) => circular(atual + passo));

  // Distância circular até a tela ativa: -1 à esquerda, 0 na frente, 1 à direita.
  const deslocamento = (i: number) => {
    let d = i - ativo;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return (
    <div
      role="group"
      aria-roledescription="carrossel"
      aria-label={`Telas do ${rotulo} no celular`}
      className={cn("select-none", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") andar(-1);
        if (e.key === "ArrowRight") andar(1);
      }}
    >
      {/* Palco */}
      <div
        className="relative mx-auto aspect-[390/844] w-[min(58vw,16.5rem)] touch-pan-y"
        onPointerDown={(e) => {
          inicioArrasto.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (inicioArrasto.current === null) return;
          const dx = e.clientX - inicioArrasto.current;
          inicioArrasto.current = null;
          if (Math.abs(dx) >= ARRASTO_MINIMO) andar(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          inicioArrasto.current = null;
        }}
      >
        {/* Brilho da cor do serviço atrás do aparelho da frente */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-35%] top-[12%] bottom-[-8%]"
          style={{
            background: `radial-gradient(closest-side, ${tema.brilho}, transparent)`,
            filter: "blur(28px)",
          }}
        />

        {images.map((imagem, i) => {
          const d = deslocamento(i);
          const frente = d === 0;
          const visivel = Math.abs(d) <= 1;

          return (
            <div
              key={imagem.src}
              aria-hidden={!frente}
              onClick={() => !frente && visivel && ir(i)}
              className={cn(
                "carrossel-tela absolute inset-0",
                visivel && !frente && "cursor-pointer",
                !visivel && "pointer-events-none",
              )}
              style={{
                transform: `translateX(${d * 62}%) scale(${frente ? 1 : 0.8}) perspective(1200px) rotateY(${d * -16}deg)`,
                opacity: frente ? 1 : visivel ? 0.38 : 0,
                zIndex: frente ? 3 : visivel ? 2 : 1,
              }}
            >
              {/* Moldura do aparelho */}
              <div
                className={cn(
                  "relative h-full rounded-[2.4rem] border border-hairline-hi bg-surface-1 p-2 transition-shadow duration-[--dur-slow]",
                )}
                style={
                  frente
                    ? { boxShadow: `0 40px 90px -40px ${tema.brilho}, inset 0 1px 0 rgba(255,255,255,.06)` }
                    : undefined
                }
              >
                <div className="relative h-full overflow-hidden rounded-[1.95rem] bg-void">
                  <Image
                    src={imagem.src}
                    alt={frente ? imagem.alt : ""}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 264px, 58vw"
                    className="object-cover object-top"
                  />
                  {/* Ilha da câmera */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-1/2 h-[1.15rem] w-[34%] -translate-x-1/2 rounded-full bg-void"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controles */}
      <div className="mt-10 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => andar(-1)}
          aria-label="Tela anterior"
          className="chamfer grid size-10 place-items-center border border-hairline-hi bg-surface-3/60 font-mono text-sm text-text-dim transition-colors duration-[--dur-fast] hover:border-magenta hover:text-text-hi"
        >
          ←
        </button>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          {images.map((imagem, i) => (
            <button
              key={imagem.src}
              type="button"
              tabIndex={-1}
              onClick={() => ir(i)}
              className={cn(
                // Barra de 2px, área de clique de 18px: o py fica fora da pintura
                "h-[1.125rem] rounded-full bg-clip-content py-2 transition-all duration-[--dur-base]",
                i === ativo ? `w-7 ${tema.ativo}` : "w-3 bg-hairline-hi hover:bg-text-mute",
              )}
            />
          ))}
        </div>

        <p
          id={idContador}
          aria-live="polite"
          className="min-w-[4.5rem] text-center font-mono text-xs tracking-[0.14em] whitespace-nowrap text-text-mute tabular-nums"
        >
          <span className="sr-only">Tela </span>
          {String(ativo + 1).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> de </span>
          {String(total).padStart(2, "0")}
        </p>

        <button
          type="button"
          onClick={() => andar(1)}
          aria-label="Próxima tela"
          className="chamfer grid size-10 place-items-center border border-hairline-hi bg-surface-3/60 font-mono text-sm text-text-dim transition-colors duration-[--dur-fast] hover:border-magenta hover:text-text-hi"
        >
          →
        </button>
      </div>
    </div>
  );
}

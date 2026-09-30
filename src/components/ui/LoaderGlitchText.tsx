"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Texto com glitch — porte do `loader-glitch-text.tsx` (registry shadcn).
 *
 * O que mudou em relação ao original:
 * - Keyframes foram para o globals.css (`glitch-clip-1/2`), junto dos outros.
 * - O lint do React Compiler barra dois padrões do original: escrever em ref
 *   durante o render (`textRef.current = text`) e setState no corpo de effect
 *   para ressincronizar o texto. Aqui o embaralhado guarda de qual texto veio,
 *   e o que aparece na tela é derivado no render.
 * - `text-foreground` e as cores oklch viraram tokens do projeto (magenta/ciano).
 */

const GLITCH_CHARS = "!@#$%^&*<>{}[]|/\\~";

const CONFIG = {
  subtle: { translateScale: 1, duration: "4s", interval: 300, scrambleChars: 1 },
  medium: { translateScale: 1, duration: "2s", interval: 150, scrambleChars: 2 },
  heavy: { translateScale: 1.5, duration: "1s", interval: 80, scrambleChars: 3 },
} as const;

export type LoaderGlitchTextProps = {
  text?: string;
  intensity?: keyof typeof CONFIG;
  className?: string;
};

function embaralhar(texto: string, quantidade: number) {
  const chars = texto.split("");
  const indices = new Set<number>();
  while (indices.size < Math.min(quantidade, chars.length)) {
    indices.add(Math.floor(Math.random() * chars.length));
  }
  return chars
    .map((c, i) =>
      indices.has(i) && c !== " "
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : c,
    )
    .join("");
}

export function LoaderGlitchText({
  text = "LOADING",
  intensity = "medium",
  className,
}: LoaderGlitchTextProps) {
  const config = CONFIG[intensity];
  // Guarda de qual texto o embaralhado saiu: se `text` mudar, o valor antigo
  // é ignorado no render, sem precisar de effect para ressincronizar.
  const [ruido, setRuido] = useState<{ base: string; valor: string } | null>(null);
  const exibido = ruido?.base === text ? ruido.valor : text;

  useEffect(() => {
    let frame = 0;
    let ultimo = 0;
    let volta: ReturnType<typeof setTimeout> | undefined;

    const passo = (agora: number) => {
      if (agora - ultimo >= config.interval) {
        ultimo = agora;
        setRuido({ base: text, valor: embaralhar(text, config.scrambleChars) });
        clearTimeout(volta);
        volta = setTimeout(() => setRuido(null), 50 + Math.random() * 50);
      }
      frame = requestAnimationFrame(passo);
    };

    frame = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(volta);
    };
  }, [text, config.interval, config.scrambleChars]);

  return (
    <output
      data-slot="loader-glitch-text"
      aria-live="polite"
      aria-label={text}
      className={cn("relative inline-block font-mono", className)}
      style={{ "--translate-scale": config.translateScale } as React.CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative">
        {exibido}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-magenta"
        style={{
          animation: `glitch-clip-1 ${config.duration} infinite linear alternate-reverse`,
        }}
      >
        {exibido}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-cyan"
        style={{
          animation: `glitch-clip-2 ${config.duration} infinite linear alternate-reverse`,
        }}
      >
        {exibido}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgb(0 0 0 / 0.18) 2px, rgb(0 0 0 / 0.18) 4px)",
        }}
      />
    </output>
  );
}

export default LoaderGlitchText;

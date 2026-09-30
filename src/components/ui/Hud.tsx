"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/**
 * HUD do canto inferior direito do hero — design.md §9.1.
 * O relogio usa a hora local do visitante; so renderiza depois de montar
 * para nao divergir do HTML do servidor.
 */
export function Hud() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setHora(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none font-mono text-[0.7rem] tracking-[0.18em] text-text-dim uppercase"
    >
      <span>{site.base.replace(", ", "/")}</span>
      {/* Coordenadas saem abaixo de lg: sem elas o HUD cabe na mesma linha da
          faixa de servicos ate 768px, que e onde a faixa comeca a aparecer. */}
      <span className="mx-2 hidden text-hairline-hi lg:inline">·</span>
      <span className="hidden lg:inline">
        LAT {site.coordenadas.lat} LON {site.coordenadas.lon}
      </span>
      <span className="mx-2 text-hairline-hi">·</span>
      <span className="text-cyan/70 tabular-nums">{hora ?? "--:--"}</span>
    </div>
  );
}

import type { Depoimento } from "@/content/depoimentos";
import { eixos } from "@/content/site";

/**
 * Um depoimento colado no muro como lambe-lambe: papel, fita nas pontas,
 * meio torto. Cor do papel, inclinação e desnível saem do `id`, então cada
 * lambe fica sempre no mesmo lugar sem guardar posição nenhuma.
 * Visual em globals.css (`.lambe*`).
 */

export const TONS = ["osso", "rosa", "ciano", "amarelo"] as const;

/**
 * Hash estável — o mesmo id dá sempre o mesmo número. FNV-1a seguido da
 * mistura final do MurmurHash3: sem ela, ids que só mudam no fim
 * ("…-pet-park", "…-pet-shop") saíam com a mesma cor e quase a mesma inclinação.
 */
export function hashDe(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Inclinação entre -4° e 4°, desnível até 28px e tom do papel. */
export function jeitoDoLambe(id: string) {
  const h = hashDe(id);
  return {
    rotacao: ((h % 81) - 40) / 10,
    desce: (h >>> 8) % 29,
    tom: TONS[(h >>> 16) % TONS.length],
  };
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function mesAno(data: string): string {
  const [ano, mes] = data.split("-");
  return `${MESES[Number(mes) - 1] ?? ""}/${ano}`;
}

export function Lambe({ depoimento, numero }: { depoimento: Depoimento; numero: number }) {
  const { rotacao, desce, tom } = jeitoDoLambe(depoimento.id);
  const servico = eixos.find((e) => e.id === depoimento.servico);

  return (
    <figure
      className={`lambe lambe-${tom}`}
      style={{ "--rot": `${rotacao}deg`, "--desce": `${desce}px` } as React.CSSProperties}
    >
      <span aria-hidden="true" className="lambe-fita lambe-fita-a" />
      <span aria-hidden="true" className="lambe-fita lambe-fita-b" />

      <p className="flex flex-wrap justify-between gap-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase opacity-70">
        <span>Lambe nº {String(numero).padStart(3, "0")}</span>
        {servico && <span>{servico.codinome}</span>}
      </p>

      <p className="lambe-nota mt-3" role="img" aria-label={`Nota ${depoimento.nota} de 5`}>
        {"★".repeat(depoimento.nota)}
        <span className="opacity-25">{"★".repeat(5 - depoimento.nota)}</span>
      </p>

      <blockquote className="mt-3 font-display text-[1.05rem] leading-snug font-semibold">
        “{depoimento.texto}”
      </blockquote>

      <figcaption className="mt-5 border-t border-current/20 pt-3 font-mono text-[0.68rem] leading-relaxed">
        <span className="font-semibold">{depoimento.nome}</span>
        <span className="block opacity-70">
          {depoimento.negocio} · {mesAno(depoimento.data)}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Skyline em 3 camadas de profundidade — design.md §9.1 e §14.2.
 *
 * Gerado proceduralmente com PRNG *deterministico* (seed fixa) para que servidor
 * e cliente rendam exatamente o mesmo SVG — sem hydration mismatch.
 */

const VIEW_W = 1600;
const VIEW_H = 520;

/** PRNG mulberry32 — deterministico por seed. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Janela = { x: number; y: number; w: number; h: number; piscando: boolean; delay: number };
type Predio = { x: number; w: number; h: number; janelas: Janela[] };

function gerarCamada(
  seed: number,
  opts: {
    larguraMin: number;
    larguraMax: number;
    alturaMin: number;
    alturaMax: number;
    densidadeJanela: number;
    maxPiscando: number;
  },
): Predio[] {
  const rand = rng(seed);
  const predios: Predio[] = [];
  let x = -40;
  let piscando = 0;

  while (x < VIEW_W + 40) {
    const w = opts.larguraMin + rand() * (opts.larguraMax - opts.larguraMin);
    const h = opts.alturaMin + rand() * (opts.alturaMax - opts.alturaMin);
    const janelas: Janela[] = [];

    // Grade de janelas dentro do predio
    const passoX = 11;
    const passoY = 15;
    for (let jx = x + 7; jx < x + w - 7; jx += passoX) {
      for (let jy = VIEW_H - h + 12; jy < VIEW_H - 10; jy += passoY) {
        if (rand() > opts.densidadeJanela) continue;
        const pisca = piscando < opts.maxPiscando && rand() > 0.93;
        if (pisca) piscando += 1;
        janelas.push({
          x: jx,
          y: jy,
          w: 3,
          h: 4,
          piscando: pisca,
          delay: rand() * 9,
        });
      }
    }

    predios.push({ x, w, h, janelas });
    x += w + 2 + rand() * 14;
  }

  return predios;
}

// Geradas uma unica vez, no modulo — identicas em todo render.
const CAMADA_FUNDO = gerarCamada(7, {
  larguraMin: 46,
  larguraMax: 96,
  alturaMin: 180,
  alturaMax: 380,
  densidadeJanela: 0.72,
  maxPiscando: 6,
});

const CAMADA_MEIO = gerarCamada(21, {
  larguraMin: 58,
  larguraMax: 120,
  alturaMin: 120,
  alturaMax: 260,
  densidadeJanela: 0.6,
  maxPiscando: 12,
});

const CAMADA_FRENTE = gerarCamada(94, {
  larguraMin: 76,
  larguraMax: 160,
  alturaMin: 70,
  alturaMax: 150,
  densidadeJanela: 0.45,
  maxPiscando: 12,
});

function Camada({
  predios,
  fill,
  janelaFill,
  opacidade,
}: {
  predios: Predio[];
  fill: string;
  janelaFill: string;
  opacidade: number;
}) {
  return (
    <g opacity={opacidade}>
      {predios.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={VIEW_H - p.h} width={p.w} height={p.h} fill={fill} />
          {p.janelas.map((j, k) => (
            <rect
              key={k}
              x={j.x}
              y={j.y}
              width={j.w}
              height={j.h}
              fill={janelaFill}
              opacity={j.piscando ? 0.85 : 0.55}
              style={
                j.piscando
                  ? {
                      animation: `window-blink ${5 + (k % 5)}s steps(1, end) ${j.delay}s infinite`,
                    }
                  : undefined
              }
            />
          ))}
        </g>
      ))}
    </g>
  );
}

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      data-fx="skyline"
      data-parallax=""
      style={{ zIndex: "var(--z-bg)", "--parallax": "9%" } as React.CSSProperties}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[55vh] w-full ${className}`}
    >
      <defs>
        {/* Desvanece o topo dos predios no ceu */}
        <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="28%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="sky-mask">
          <rect width={VIEW_W} height={VIEW_H} fill="url(#sky-fade)" />
        </mask>
      </defs>

      <g mask="url(#sky-mask)">
        {/* Camada 3 — torres distantes, quase dissolvidas na nevoa */}
        <Camada predios={CAMADA_FUNDO} fill="#15102a" janelaFill="#b14bff" opacidade={0.55} />
        {/* Camada 2 — predios medios */}
        <Camada predios={CAMADA_MEIO} fill="#0f0c1c" janelaFill="#ff2d8f" opacidade={0.8} />
        {/* Camada 1 — silhueta da frente, mais escura e mais definida */}
        <Camada predios={CAMADA_FRENTE} fill="#08060f" janelaFill="#2bf5ff" opacidade={1} />
      </g>
    </svg>
  );
}

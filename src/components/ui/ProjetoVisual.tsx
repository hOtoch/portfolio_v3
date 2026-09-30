/**
 * Visual do card de projeto — design.md §8.4.
 *
 * Não é screenshot: enquanto não houver imagem real de cada entrega, um print
 * inventado seria pior que nenhum. Aqui a "capa" é um padrão de dados gerado a
 * partir do slug — determinístico, então servidor e cliente rendem igual.
 *
 * Quando existir imagem real do projeto, troque este componente por <Image>.
 */

const COR = {
  web: "#ff2d8f",
  rpa: "#b14bff",
  ia: "#ff3355",
} as const;

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ProjetoVisual({
  slug,
  servico,
  rotulo,
  largo = false,
}: {
  slug: string;
  servico: keyof typeof COR;
  rotulo: string;
  /** Card de destaque ocupa 2 colunas: a capa fica mais baixa para nao dominar. */
  largo?: boolean;
}) {
  const rand = rng(hash(slug));
  const cor = COR[servico];

  const colunas = 24;
  const linhas = 15;
  const celulas: { x: number; y: number; o: number; alta: boolean }[] = [];

  for (let c = 0; c < colunas; c++) {
    for (let l = 0; l < linhas; l++) {
      const v = rand();
      if (v < 0.72) continue;
      celulas.push({ x: c * 16 + 4, y: l * 16 + 4, o: 0.1 + v * 0.4, alta: v > 0.985 });
    }
  }

  return (
    <div
      className={`relative overflow-hidden border-b border-hairline bg-void ${
        largo ? "aspect-[21/8]" : "aspect-[16/10]"
      }`}
      aria-hidden="true"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 384 240"
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
      >
        {/* Grade de fundo */}
        <defs>
          <pattern id={`g-${slug}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M16 0H0V16" fill="none" stroke="#2e2740" strokeWidth="0.5" />
          </pattern>
          <linearGradient id={`f-${slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={cor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="384" height="240" fill={`url(#g-${slug})`} />
        <rect width="384" height="240" fill={`url(#f-${slug})`} />

        {celulas.map((celula, i) => (
          <rect
            key={i}
            x={celula.x}
            y={celula.y}
            width={celula.alta ? 8 : 5}
            height={5}
            fill={cor}
            opacity={celula.alta ? 0.8 : celula.o * 0.4}
          />
        ))}

        {/* Linha de varredura */}
        <rect x="0" y="176" width="384" height="1" fill={cor} opacity="0.5" />
      </svg>

      {/* Marca d'agua com o codinome do servico */}
      <span
        className="absolute bottom-3 left-4 font-mono text-[0.62rem] tracking-[0.22em] uppercase"
        style={{ color: cor, opacity: 0.75 }}
      >
        {rotulo}
      </span>

      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 45%, rgba(7,6,13,.55) 80%, rgba(7,6,13,.9))",
        }}
      />
    </div>
  );
}

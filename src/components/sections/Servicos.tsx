import Link from "next/link";
import { servicos, type Servico } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * design.md §9.2 — Setor 01 // RUA DE NEON.
 * Tres fachadas. O card do meio desce 40px no desktop: e a assimetria que
 * tira o bloco da cara de template.
 */

/** Movimento parado de cada glifo — o ⟳ girando é o mais literal dos três. */
const VIDA_GLIFO = {
  web: "glifo-web",
  rpa: "glifo-rpa",
  ia: "glifo-ia",
} as const;

const TEMA = {
  magenta: {
    texto: "text-magenta",
    borda: "group-hover:border-t-magenta",
    filete: "bg-magenta",
    brilho: "group-hover:[box-shadow:var(--glow-magenta)]",
    nevoa: "rgba(255,45,143,.16)",
  },
  violet: {
    texto: "text-violet",
    borda: "group-hover:border-t-violet",
    filete: "bg-violet",
    brilho: "group-hover:[box-shadow:var(--glow-violet)]",
    nevoa: "rgba(177,75,255,.16)",
  },
  crimson: {
    texto: "text-crimson",
    borda: "group-hover:border-t-crimson",
    filete: "bg-crimson",
    brilho: "group-hover:[box-shadow:0_0_12px_rgba(255,51,85,.55),0_0_38px_rgba(255,51,85,.22)]",
    nevoa: "rgba(255,51,85,.16)",
  },
} as const;

function Fachada({ servico, indice }: { servico: Servico; indice: number }) {
  const tema = TEMA[servico.cor];
  const deslocado = indice === 1;

  return (
    <li
      data-reveal
      style={{ "--reveal-atraso": `${indice * 200}ms` } as React.CSSProperties}
      className={`fachada${deslocado ? " lg:mt-10" : ""}`}
    >
      <article className="group relative h-full">
        {/* Nevoa da cor do servico, atras do card */}
        <div
          aria-hidden="true"
          // Sem sangria horizontal: -inset-6 nos dois eixos estourava 4px alem da
          // viewport no mobile. O blur ja faz a luz vazar para os lados.
          className="pointer-events-none absolute inset-x-0 -inset-y-6 opacity-0 transition-opacity duration-[--dur-slow] group-hover:opacity-100"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${tema.nevoa} 0%, transparent 70%)`,
            filter: "blur(24px)",
          }}
        />

        <div className="panel chamfer relative flex h-full flex-col p-7 transition-colors duration-[--dur-base] group-hover:border-hairline-hi">
          {/* Filete superior acende no hover */}
          <span
            aria-hidden="true"
            className={`filete-fachada absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-[--dur-slow] ease-[--ease-out] group-hover:scale-x-100 ${tema.filete}`}
          />

          <div className="flex items-start justify-between">
            <span
              aria-hidden="true"
              className={`inline-block text-2xl leading-none ${tema.texto} ${VIDA_GLIFO[servico.id]}`}
            >
              {servico.glifo}
            </span>
            <span className="font-mono text-xs text-text-mute">
              [ 0{indice + 1} ]
            </span>
          </div>

          <p className={`kicker mt-8 ${tema.texto}`}>{servico.codinome}</p>
          <h3 className="mt-3">{servico.nome}</h3>
          <p className="mt-4 text-text">{servico.vitrine}</p>

          <ul className="mt-7 space-y-2.5 border-t border-hairline pt-6">
            {servico.itens.map((item, i) => (
              <li
                key={item}
                className="bullet-terminal flex gap-3 font-mono text-xs leading-relaxed text-text-dim"
                style={
                  { "--bullet-atraso": `${indice * 200 + 620 + i * 70}ms` } as React.CSSProperties
                }
              >
                <span aria-hidden="true" className={tema.texto}>
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="#contato"
            className="mt-5 inline-flex items-center gap-2 self-start py-3 font-mono text-xs font-semibold tracking-[0.1em] text-text-hi uppercase underline-offset-[6px] transition-colors duration-[--dur-fast] hover:underline"
          >
            Pedir orçamento
            <span
              aria-hidden="true"
              className="transition-transform duration-[--dur-base] ease-[--ease-snap] group-hover:translate-x-1"
            >
              →
            </span>
            <span className="sr-only"> de {servico.nome}</span>
          </Link>
        </div>
      </article>
    </li>
  );
}

export function Servicos() {
  return (
    <section
      id="servicos"
      className="relative scroll-mt-24 py-(--spacing-section)"
    >
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading
          revelar
          numero="01"
          setor="Rua de neon"
          titulo="O que eu construo"
          descricao="Três frentes que se encaixam: o site que traz o cliente, a automação que tira o trabalho manual do caminho e o agente que atende quando você não está."
        />

        <ul className="rua-de-neon mt-(--spacing-bloco) grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico, i) => (
            <Fachada key={servico.id} servico={servico} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

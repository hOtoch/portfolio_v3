import { canais, garantias, site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FormularioContrato } from "@/components/ui/FormularioContrato";

/**
 * design.md §9.7 — Setor 06 // CONTRATOS.
 * Entrada: o painel do formulário "liga" (borda pisca e acende) e os campos
 * sobem em sequência; os canais deslizam da direita e as garantias em seguida.
 */
export function Contato() {
  const canaisVisiveis = site.whatsapp
    ? [
        ...canais.slice(0, 1),
        {
          rotulo: "WhatsApp",
          valor: site.whatsapp,
          href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`,
        },
        ...canais.slice(1),
      ]
    : canais;

  return (
    <section
      id="contato"
      className="relative scroll-mt-24 overflow-hidden py-(--spacing-section)"
    >
      {/* Nevoa quente atras do setor final da rua */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: "var(--z-bg)", background: "var(--grad-sky)", opacity: 0.6 }}
      />

      <div
        className="mx-auto max-w-(--container-site) px-(--spacing-gutter)"
        style={{ position: "relative", zIndex: "var(--z-content)" }}
      >
        <SectionHeading
          numero="06"
          setor="Contratos"
          titulo="Vamos abrir um contrato."
          descricao="Descreva o problema em duas linhas. Eu respondo com escopo, prazo e preço — ou digo que não é comigo e indico alguém."
        />

        <div className="mt-(--spacing-bloco) grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div data-reveal>
            <FormularioContrato />
          </div>

          <aside data-reveal style={{ "--reveal-atraso": "120ms" } as React.CSSProperties}>
            <p className="entra entra-dir kicker text-text-dim">Frequências diretas</p>
            <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
              {canaisVisiveis.map((canal, i) => (
                <li
                  key={canal.rotulo}
                  style={{ "--i": i + 1 } as React.CSSProperties}
                  className="entra entra-dir"
                >
                  <a
                    href={canal.href}
                    target={canal.href.startsWith("http") ? "_blank" : undefined}
                    rel={canal.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline gap-4 py-4 transition-colors duration-[--dur-fast]"
                  >
                    <span className="w-24 shrink-0 font-mono text-xs tracking-[0.14em] text-text-mute uppercase">
                      {canal.rotulo}
                    </span>
                    <span className="font-mono text-sm text-text transition-colors duration-[--dur-fast] group-hover:text-cyan">
                      {canal.valor}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto text-text-mute transition-all duration-[--dur-base] ease-[--ease-snap] group-hover:translate-x-1 group-hover:text-cyan"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <ul className="mt-8 space-y-2.5">
              {garantias.map((garantia, i) => (
                <li
                  key={garantia}
                  style={{ "--i": canaisVisiveis.length + 2 + i } as React.CSSProperties}
                  className="entra entra-esq flex items-baseline gap-3 font-mono text-xs text-text-dim"
                >
                  <span aria-hidden="true" className="text-ok">
                    ✓
                  </span>
                  {garantia}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

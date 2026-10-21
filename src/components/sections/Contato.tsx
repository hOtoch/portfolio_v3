import { canais, contratacao, site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FormularioContrato } from "@/components/ui/FormularioContrato";

/**
 * design.md §9.7 — Setor 06 // CONTATO.
 * Entrada: o painel do formulário "liga" (borda pisca e acende) e os campos
 * sobem em sequência; os canais deslizam da direita e a ficha em seguida.
 *
 * v4 — saiu o WhatsApp (canal de cliente) e saíram as garantias comerciais.
 * No lugar entram o currículo em PDF e a ficha de contratação: nível,
 * modalidade, local e idioma, que é o que o recrutador precisa conferir.
 */
export function Contato() {
  const canaisVisiveis = [
    ...canais,
    { rotulo: "Currículo", valor: "PDF", href: site.curriculo },
  ];

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
          setor="Contato"
          titulo="Vamos conversar."
          descricao="Se o perfil encaixa no que vocês procuram, me escreva. Respondo em até 24h — e se não for comigo, eu digo na primeira resposta em vez de ocupar a agenda de ninguém."
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

            <p
              className="entra entra-esq kicker mt-10 text-text-dim"
              style={{ "--i": canaisVisiveis.length + 1 } as React.CSSProperties}
            >
              Ficha de contratação
            </p>
            <dl className="mt-5 divide-y divide-hairline border-y border-hairline">
              {contratacao.map((fato, i) => (
                <div
                  key={fato.rotulo}
                  style={{ "--i": canaisVisiveis.length + 2 + i } as React.CSSProperties}
                  className="entra entra-esq flex items-baseline gap-4 py-3"
                >
                  <dt className="w-24 shrink-0 font-mono text-xs tracking-[0.14em] text-text-mute uppercase">
                    {fato.rotulo}
                  </dt>
                  <dd className="font-mono text-sm text-text">{fato.valor}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

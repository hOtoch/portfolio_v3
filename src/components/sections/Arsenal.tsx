import { arsenal } from "@/content/percurso";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * design.md §9.5 — Setor 04 // ARSENAL.
 * Sem barra de "nível de habilidade": 85% é informação vazia.
 *
 * Cada linha entra com um filete de luz correndo a borda; o grupo desliza da
 * esquerda e as tecnologias acendem em sequência (`.entra`, globals.css).
 */
export function Arsenal() {
  return (
    <section id="arsenal" className="scroll-mt-24 py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading
          numero="04"
          setor="Arsenal"
          titulo="Com o que eu trabalho"
          descricao="A ordem não é aleatória: o que aparece primeiro é onde eu tenho mais quilometragem."
        />

        <dl className="mt-(--spacing-bloco) divide-y divide-hairline border-y border-hairline">
          {arsenal.map((bloco, i) => (
            <div
              key={bloco.grupo}
              data-reveal
              style={{ "--reveal-atraso": `${i * 70}ms` } as React.CSSProperties}
              className="relative grid gap-4 overflow-x-clip py-7 md:grid-cols-[16rem_1fr] md:gap-8"
            >
              <span aria-hidden="true" className="varredura" />
              <dt className="entra entra-esq kicker pt-1 text-text-dim">{bloco.grupo}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {bloco.itens.map((item, j) => (
                    <li
                      key={item}
                      style={{ "--i": j + 1 } as React.CSSProperties}
                      className="entra entra-pop rounded-sm border border-hairline bg-surface-1 px-3 py-1.5 font-mono text-xs text-text hover:border-cyan/60 hover:text-cyan"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

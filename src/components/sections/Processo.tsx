import { SectionHeading } from "@/components/ui/SectionHeading";

import { ProcessoTrilha } from "./ProcessoTrilha";

/**
 * design.md §9.4 — Setor 03 // PIPELINE.
 * A trilha vertical preenche conforme o scroll e cada etapa acende quando é
 * alcançada (ProcessoTrilha).
 */
export function Processo() {
  return (
    <section id="processo" className="scroll-mt-24 py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading
          numero="03"
          setor="Pipeline"
          titulo="Como o trabalho anda"
          descricao="Sem caixa-preta: você sabe onde está o projeto em cada momento e o que vem depois."
        />

        <ProcessoTrilha />
      </div>
    </section>
  );
}

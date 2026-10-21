import { SectionHeading } from "@/components/ui/SectionHeading";

import { Trajetoria } from "./Trajetoria";

/**
 * design.md §9.6 — Setor 03 // PERCURSO.
 *
 * Ocupa o lugar do antigo setor PIPELINE, que explicava o processo comercial
 * (briefing, orcamento, entrega). Vaga nao se conquista explicando como se
 * cobra: se conquista mostrando o caminho andado.
 */
export function Percurso() {
  return (
    <section id="trajetoria" className="scroll-mt-24 py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading
          numero="03"
          setor="Percurso"
          titulo="O caminho até aqui"
          descricao="Quatro anos entre estágio, extensão, trabalho autoral e emprego remoto. Os períodos se sobrepõem porque foram vividos assim — emprego de um lado da linha, trabalho autoral e acadêmico do outro."
        />

        <Trajetoria />
      </div>
    </section>
  );
}

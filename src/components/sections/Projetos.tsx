import { vitrines } from "@/content/projetos";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { ProjetosRolagem } from "./ProjetosRolagem";

/**
 * Setor 02 // ARQUIVO — sites no ar. A rolagem passa pelos projetos: o celular
 * e a ficha de cada um entram e saem conforme a página desce.
 */

export function Projetos() {
  return (
    <section id="projetos" className="scroll-mt-24 overflow-x-clip py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            numero="02"
            setor="Arquivo"
            titulo="O que já está no ar"
            descricao="Sites publicados e abertos para você navegar. Role para passar pelos projetos ou abra o endereço de verdade."
          />
          <p className="font-mono text-xs tracking-[0.18em] text-text-mute uppercase tabular-nums">
            {String(vitrines.length).padStart(2, "0")} registros
          </p>
        </div>

        <div className="mt-(--spacing-bloco)">
          <ProjetosRolagem />
        </div>
      </div>
    </section>
  );
}

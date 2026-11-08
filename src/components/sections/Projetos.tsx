import { projetos } from "@/content/projetos";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { ProjetosTV } from "./ProjetosTV";

/**
 * Setor 02 // ARQUIVO.
 *
 * v6 — os projetos passam numa televisão de verdade: uma foto que cobre a tela
 * inteira no desktop. Cada projeto é um canal e a rolagem troca de canal, com
 * chiado no meio. A prova continua morando na página do case; a TV é a porta
 * de entrada.
 *
 * O palco do desktop sangra até a borda da janela, então o contêiner do site
 * fica a cargo do <ProjetosTV> (só o controle do celular usa).
 *
 * Por enquanto só os autorais vão ao ar. Os outros cases continuam em
 * `projetos` (a Trajetória e o sitemap apontam para eles) e voltam à grade
 * de canais quando entrarem nesta lista.
 */
const CANAIS = ["prospecto-sh", "pelada-sofredores", "myvitri"] as const;

const noAr = CANAIS.map((slug) => projetos.find((p) => p.slug === slug)!);

export function Projetos() {
  return (
    <section id="projetos" className="scroll-mt-24 overflow-x-clip py-(--spacing-section)">
      <ProjetosTV
        canais={noAr}
        cabecalho={<SectionHeading numero="02" setor="Arquivo" titulo="O que eu já construí" revelar={false} />}
      />
    </section>
  );
}

import { depoimentos } from "@/content/depoimentos";
import { Lambe } from "@/components/ui/Lambe";
import { LambeNovo } from "@/components/ui/LambeNovo";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Setor 06 // MURO — depoimentos colados pelos próprios clientes.
 *
 * Os lambes vêm de src/content/depoimentos.ts (sem banco: entram por e-mail
 * e são colados à mão depois de aprovados). Quem abre o site por um link de
 * convite vê também a vaga para colar o seu (<LambeNovo>).
 *
 * Entrada: cada lambe "bate" no concreto em sequência quando o muro aparece.
 */

export function Muro() {
  const total = depoimentos.length;
  const media = total ? depoimentos.reduce((soma, d) => soma + d.nota, 0) / total : 0;

  return (
    <section id="muro" className="scroll-mt-24 overflow-x-clip py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            numero="06"
            setor="Muro"
            titulo="O que ficou colado no muro"
            descricao="Cada lambe aqui foi colado por um cliente, com as palavras dele, depois do contrato encerrado."
          />
          {total > 0 && (
            <p
              data-reveal
              className="adesivo-media"
              aria-label={`Média ${media.toFixed(1)} de 5 em ${total} depoimentos`}
            >
              <span className="font-display text-2xl leading-none font-bold">
                {media.toFixed(1)}
                <span className="text-[#d81b72]"> ★</span>
              </span>
              <span className="mt-1 block font-mono text-[0.58rem] tracking-[0.16em] uppercase">
                {String(total).padStart(2, "0")} lambes
              </span>
            </p>
          )}
        </div>

        <div data-reveal className="muro chamfer mt-(--spacing-bloco)">
          <span aria-hidden="true" className="muro-letreiro neon">
            Cole aqui
          </span>

          {total === 0 && <MuroLimpo />}

          <ol className="muro-grade" aria-label="Depoimentos de clientes">
            <LambeNovo />
            {depoimentos.map((depoimento, i) => (
              <li
                key={depoimento.id}
                className="lambe-cola"
                style={{ "--i": i + 1 } as React.CSSProperties}
              >
                <Lambe depoimento={depoimento} numero={i + 1} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Muro sem lambe nenhum: restos de papel arrancado e o recado pichado. */
function MuroLimpo() {
  return (
    <div className="relative py-10 text-center sm:py-16">
      <span aria-hidden="true" className="muro-resto" style={{ left: "6%", top: "10%", rotate: "-7deg" }} />
      <span aria-hidden="true" className="muro-resto" style={{ right: "9%", top: "22%", rotate: "5deg" }} />
      <span aria-hidden="true" className="muro-resto" style={{ left: "38%", bottom: "4%", rotate: "2deg" }} />

      <p className="muro-pichacao">muro recém-pintado</p>
      <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-text-dim">
        Os lambes são colados pelos próprios clientes quando o contrato encerra. Nenhum texto aqui é
        escrito por mim, então este espaço enche no ritmo dos trabalhos entregues.
      </p>
    </div>
  );
}

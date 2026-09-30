import { site } from "@/content/site";
import { trajetoria } from "@/content/percurso";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RetratoSimples } from "@/components/ui/Retrato";

/**
 * design.md §9.6 — Setor 05 // OPERADOR.
 *
 * O retrato vem de <RetratoSimples>, o mesmo componente do hero: basta apontar
 * `site.foto` para o arquivo em public/ e a foto aparece nos dois lugares.
 *
 * Entrada: um scanner desce pelo retrato e os campos da ficha são impressos
 * um a um; o texto e a trajetória revelam em cascata quando chegam na tela.
 */

const FICHA = [
  { campo: "Operador", valor: site.nome },
  { campo: "Função", valor: site.titulo },
  { campo: "Base", valor: site.baseCompleta },
  { campo: "Formação", valor: site.formacao },
  { campo: "Idiomas", valor: site.idiomas },
] as const;

export function Sobre() {
  return (
    <section id="sobre" className="scroll-mt-24 py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading numero="05" setor="Operador" titulo="Quem assina o contrato" />

        <div className="mt-(--spacing-bloco) grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
          {/* Ficha de identidade */}
          {/* max-w segura a ficha no tamanho de cracha quando a coluna empilha
              abaixo de lg — sem isso o retrato vira um bloco de tela inteira. */}
          <div
            data-reveal
            className="panel chamfer w-full max-w-[22rem] overflow-hidden"
          >
            {/* Retrato com o scanner que desce quando a ficha abre */}
            <div className="relative">
              <RetratoSimples />
              <span aria-hidden="true" className="scanner" />
            </div>
            <dl className="divide-y divide-hairline border-t border-hairline">
              {FICHA.map((linha, i) => (
                <div
                  key={linha.campo}
                  style={{ "--i": i + 3 } as React.CSSProperties}
                  className="entra entra-esq px-5 py-3.5"
                >
                  <dt className="font-mono text-[0.62rem] tracking-[0.2em] text-text-mute uppercase">
                    {linha.campo}
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-text">{linha.valor}</dd>
                </div>
              ))}
              <div
                style={{ "--i": FICHA.length + 4 } as React.CSSProperties}
                className="entra entra-pop flex items-center gap-2.5 px-5 py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-ok"
                  style={{ animation: "pulse-dot 2.4s var(--ease-in-out) infinite" }}
                />
                <span className="font-mono text-xs text-ok">Disponível para projetos</span>
              </div>
            </dl>
          </div>

          {/* Texto + trajetoria */}
          {/* Cada grupo revela sozinho: a trajetória fica longe do texto no celular */}
          <div>
            <div
              data-reveal
              style={{ "--reveal-atraso": "120ms" } as React.CSSProperties}
              className="max-w-[62ch] space-y-5 text-[length:var(--text-step-1)] leading-[1.55] text-text"
            >
              <p className="entra">
                Eu construo a parte que ninguém vê funcionar direito quando dá errado: o backend,
                a integração, a automação que roda de madrugada sem ninguém olhando. Engenheiro
                de computação pela UFES, hoje trabalho na arquitetura de uma plataforma de IA que
                conduz negociações de cobrança sozinha, ponta a ponta.
              </p>
              <p className="entra" style={{ "--i": 2 } as React.CSSProperties}>
                Antes disso foram APIs e processos de ETL alimentando decisões de gente que não
                pode esperar relatório, e um ano e meio como freelancer entregando agentes de IA
                e robôs de coleta de dados. É de onde vem o jeito que eu trabalho: escopo escrito
                antes de começar, entrega incremental que você acompanha rodando, e nada de
                promessa que o código não sustenta.
              </p>
            </div>

            <div data-reveal>
              <h3 className="entra entra-esq kicker mt-12 text-text-dim">Trajetória</h3>
              <ol className="mt-6 divide-y divide-hairline border-y border-hairline">
                {trajetoria.map((item, i) => (
                  <li
                    key={`${item.organizacao}-${item.periodo}`}
                    style={{ "--i": i + 1 } as React.CSSProperties}
                    className="entra entra-esq grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6"
                  >
                    <span className="font-mono text-xs text-text-mute tabular-nums">
                      {item.periodo}
                    </span>
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display font-semibold text-text-hi">
                          {item.organizacao}
                        </span>
                        <span className="font-mono text-xs text-text-dim">{item.funcao}</span>
                      </p>
                      <p className="mt-1 text-sm text-text-dim">{item.nota}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <a
              data-reveal
              style={{ "--reveal-atraso": "200ms" } as React.CSSProperties}
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 py-3 font-mono text-xs tracking-[0.1em] text-text-dim uppercase underline-offset-[6px] transition-colors duration-[--dur-fast] hover:text-cyan hover:underline"
            >
              Currículo completo no LinkedIn
              <span
                aria-hidden="true"
                className="transition-transform duration-[--dur-base] ease-[--ease-snap] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

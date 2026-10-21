import Link from "next/link";

import { projetos, vitrines, type Projeto, type Status } from "@/content/projetos";
import { eixos } from "@/content/site";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

import { ProjetosRolagem } from "./ProjetosRolagem";

/**
 * Setor 02 // ARQUIVO.
 *
 * A inversao da v4: o grid principal e de CASES, nao de links. Projeto autoral
 * nao tem demo publica e isso aparece declarado na etiqueta, sem disfarce —
 * ausencia de link so machuca quando a pagina finge que o link deveria existir.
 * A prova mora na pagina do case: decisao tecnica, arquitetura e as telas.
 *
 * Os sites de cliente ficam numa faixa compacta no fim, fora do grid: provam
 * entrega de frontend, mas nao e o eixo da candidatura.
 */

const TEMA = {
  magenta: { texto: "text-magenta", filete: "bg-magenta", brilho: "rgba(255,45,143,.3)" },
  violet: { texto: "text-violet", filete: "bg-violet", brilho: "rgba(177,75,255,.3)" },
  crimson: { texto: "text-crimson", filete: "bg-crimson", brilho: "rgba(255,51,85,.3)" },
} as const;

const ETIQUETA: Record<Status, { rotulo: string; titulo: string }> = {
  "no-ar": { rotulo: "No ar", titulo: "Publicado, com endereço aberto" },
  privado: {
    rotulo: "Privado · sem demo",
    titulo: "Projeto autoral de uso próprio: roda localmente ou em VPS própria",
  },
  confidencial: {
    rotulo: "Confidencial",
    titulo: "Projeto de empresa ou cliente: mostrado só no nível de arquitetura",
  },
};

function Etiqueta({ status }: { status: Status }) {
  const { rotulo, titulo } = ETIQUETA[status];

  return (
    <span
      title={titulo}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.14em] uppercase",
        status === "no-ar"
          ? "border-cyan/40 text-cyan/90"
          : "border-hairline-hi text-text-mute",
      )}
    >
      <span aria-hidden="true">{status === "no-ar" ? "◉" : "◌"}</span>
      {rotulo}
    </span>
  );
}

function Card({ projeto, indice }: { projeto: Projeto; indice: number }) {
  const eixo = eixos.find((e) => e.id === projeto.eixo)!;
  const tema = TEMA[eixo.cor];
  const capa = projeto.desktop?.[0];

  return (
    <li
      data-reveal
      style={{ "--reveal-atraso": `${(indice % 3) * 140}ms` } as React.CSSProperties}
      className={cn(projeto.destaque && "lg:col-span-2")}
    >
      <Link
        href={`/projetos/${projeto.slug}`}
        className="group block h-full focus-visible:outline-none"
      >
        <article className="panel chamfer relative flex h-full flex-col p-7 transition-colors duration-[--dur-base] group-hover:border-hairline-hi group-focus-visible:border-hairline-hi">
          {/* Filete superior acende no hover */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-[--dur-slow] ease-[--ease-out] group-hover:scale-x-100 group-focus-visible:scale-x-100",
              tema.filete,
            )}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={cn("kicker", tema.texto)}>
              <span aria-hidden="true" className="mr-2">
                {eixo.glifo}
              </span>
              {eixo.codinome}
            </p>
            <Etiqueta status={projeto.status} />
          </div>

          <h3 className="mt-6 text-[length:var(--text-step-2)]">{projeto.titulo}</h3>
          <p className="mt-2 font-mono text-xs tracking-[0.08em] text-text-dim">
            {projeto.origem} · {projeto.periodo}
          </p>
          <p className="mt-4 text-text">{projeto.subtitulo}</p>

          {capa && projeto.destaque && (
            <BrowserFrame
              src={capa.src}
              alt={capa.alt}
              rotulo={projeto.titulo.toLowerCase().replace(/\s+/g, "-")}
              brilho={tema.brilho}
              priority
              sizes="(min-width: 1024px) 680px, 90vw"
              className="mt-7"
            />
          )}

          {projeto.numeros && (
            <ul className="mt-7 flex flex-wrap gap-x-10 gap-y-5 border-t border-hairline pt-6">
              {projeto.numeros.map((numero) => (
                <li key={numero.rotulo}>
                  <p className={cn("font-display text-2xl leading-none", tema.texto)}>
                    {numero.valor}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.6rem] tracking-[0.12em] text-text-mute uppercase">
                    {numero.rotulo}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <ul
            className={cn(
              "flex flex-wrap gap-x-2 gap-y-2",
              projeto.numeros ? "mt-6" : "mt-7 border-t border-hairline pt-6",
            )}
          >
            {projeto.stack.slice(0, 6).map((item) => (
              <li
                key={item}
                className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.1em] text-text-dim uppercase"
              >
                {item}
              </li>
            ))}
            {projeto.stack.length > 6 && (
              <li className="px-1 py-1 font-mono text-[0.62rem] tracking-[0.1em] text-text-mute uppercase">
                +{projeto.stack.length - 6}
              </li>
            )}
          </ul>

          <p className="mt-7 inline-flex items-center gap-2 pt-1 font-mono text-xs font-semibold tracking-[0.1em] text-text-hi uppercase">
            Abrir o case
            <span
              aria-hidden="true"
              className="transition-transform duration-[--dur-base] ease-[--ease-snap] group-hover:translate-x-1"
            >
              →
            </span>
          </p>
        </article>
      </Link>
    </li>
  );
}

export function Projetos() {
  return (
    <section id="projetos" className="scroll-mt-24 overflow-x-clip py-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            numero="02"
            setor="Arquivo"
            titulo="O que eu já construí"
            descricao="Projeto autoral abre tudo: arquitetura, decisão de prompt, custo. Projeto de empresa fica no nível de arquitetura, sem dado de cliente. Nenhum dos dois depende de um link para provar que existe."
          />
          <p className="font-mono text-xs tracking-[0.18em] text-text-mute uppercase tabular-nums">
            {String(projetos.length).padStart(2, "0")} registros
          </p>
        </div>

        <ul className="mt-(--spacing-bloco) grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projetos.map((projeto, i) => (
            <Card key={projeto.slug} projeto={projeto} indice={i} />
          ))}
        </ul>
      </div>

      {/* Faixa de sites de cliente — fora do grid, de propósito. */}
      <div className="mx-auto mt-(--spacing-section) max-w-(--container-site) px-(--spacing-gutter)">
        <header data-reveal className="max-w-[46ch] border-t border-hairline pt-10">
          <p className="kicker flex items-center gap-3 text-text-dim">
            <span className="text-text-mute">[ 02b ]</span>
            <span className="text-cyan/80">Fora do eixo</span>
          </p>
          <h3 className="mt-5 text-[length:var(--text-step-2)]">Sites de cliente, no ar</h3>
          <p className="mt-4 max-w-[54ch] text-text">
            Trabalho de web que entreguei e que você pode abrir agora. Não é o foco da
            candidatura — fica aqui porque dá para conferir, e porque frontend inteiro também é
            parte do que eu entrego.
          </p>
        </header>

        <div className="mt-(--spacing-bloco)">
          <ProjetosRolagem />
        </div>

        <p className="mt-6 font-mono text-xs tracking-[0.14em] text-text-mute uppercase tabular-nums">
          {String(vitrines.length).padStart(2, "0")} sites publicados
        </p>
      </div>
    </section>
  );
}

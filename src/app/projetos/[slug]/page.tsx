import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projetos } from "@/content/projetos";
import { eixos, site } from "@/content/site";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { PhoneCarousel } from "@/components/ui/PhoneCarousel";
import { cn } from "@/lib/utils";

/**
 * Pagina de case — a resposta para "projeto que nao tem link".
 *
 * Um link clicavel prova que a coisa existe; um case bem escrito prova que o
 * autor sabe POR QUE construiu daquele jeito, que e o que diferencia candidato
 * em entrevista tecnica. Por isso o bloco de decisoes vem antes das telas.
 */

const TEMA = {
  magenta: { texto: "text-magenta", filete: "bg-magenta", brilho: "rgba(255,45,143,.3)" },
  violet: { texto: "text-violet", filete: "bg-violet", brilho: "rgba(177,75,255,.3)" },
  crimson: { texto: "text-crimson", filete: "bg-crimson", brilho: "rgba(255,51,85,.3)" },
} as const;

const COR_CARROSSEL = { magenta: "magenta", violet: "violet", crimson: "crimson" } as const;

const ETIQUETA = {
  "no-ar": "No ar",
  privado: "Privado · sem demo pública",
  confidencial: "Confidencial",
} as const;

export function generateStaticParams() {
  return projetos.map((projeto) => ({ slug: projeto.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projeto = projetos.find((p) => p.slug === slug);
  if (!projeto) return {};

  const titulo = `${projeto.titulo} — ${site.nome}`;

  return {
    title: titulo,
    description: projeto.subtitulo,
    alternates: { canonical: `/projetos/${projeto.slug}` },
    openGraph: {
      title: titulo,
      description: projeto.subtitulo,
      url: `/projetos/${projeto.slug}`,
    },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projeto = projetos.find((p) => p.slug === slug);
  if (!projeto) notFound();

  const eixo = eixos.find((e) => e.id === projeto.eixo)!;
  const tema = TEMA[eixo.cor];

  return (
    <article className="pt-32 pb-(--spacing-section)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <Link
          href="/#projetos"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-text-mute uppercase transition-colors hover:text-text"
        >
          <span aria-hidden="true">←</span>
          Voltar ao arquivo
        </Link>

        {/* Cabeçalho */}
        <header className="mt-10 max-w-[60ch]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className={cn("kicker", tema.texto)}>
              <span aria-hidden="true" className="mr-2">
                {eixo.glifo}
              </span>
              {eixo.codinome}
            </p>
            <span className="font-mono text-[0.58rem] tracking-[0.14em] text-text-mute uppercase">
              {ETIQUETA[projeto.status]}
            </span>
          </div>

          <h1 className="mt-6">{projeto.titulo}</h1>
          <p className="mt-4 font-mono text-xs tracking-[0.08em] text-text-dim">
            {projeto.origem} · {projeto.periodo}
          </p>
          <p className="mt-6 text-[length:var(--text-step-1)] text-text">{projeto.subtitulo}</p>
        </header>

        {projeto.numeros && (
          <ul className="mt-14 flex flex-wrap gap-x-14 gap-y-8 border-y border-hairline py-8">
            {projeto.numeros.map((numero) => (
              <li key={numero.rotulo}>
                <p className={cn("font-display text-[length:var(--text-step-3)] leading-none", tema.texto)}>
                  {numero.valor}
                </p>
                <p className="mt-2 font-mono text-[0.62rem] tracking-[0.14em] text-text-mute uppercase">
                  {numero.rotulo}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Problema e solução */}
        <div className="mt-(--spacing-bloco) grid gap-x-16 gap-y-12 md:grid-cols-2">
          <section>
            <h2 className="kicker text-text-dim">O problema</h2>
            <p className="mt-5 text-text">{projeto.problema}</p>
          </section>
          <section>
            <h2 className="kicker text-text-dim">O que eu construí</h2>
            <p className="mt-5 text-text">{projeto.solucao}</p>
          </section>
        </div>

        {/* Decisões — o bloco que um tech lead vai ler */}
        <section className="mt-(--spacing-section)">
          <h2 className="text-[length:var(--text-step-2)]">Decisões e por quê</h2>
          <ol className="mt-(--spacing-bloco) grid gap-6 md:grid-cols-2">
            {projeto.decisoes.map((decisao, i) => (
              <li key={decisao.titulo} data-reveal className="panel chamfer relative flex flex-col p-7">
                <span
                  aria-hidden="true"
                  className={cn("absolute inset-x-0 top-0 h-0.5 origin-left", tema.filete)}
                  style={{ opacity: 0.5 }}
                />
                <p className="font-mono text-xs text-text-mute">
                  [ {String(i + 1).padStart(2, "0")} ]
                </p>
                <h3 className="mt-4 text-[length:var(--text-step-1)]">{decisao.titulo}</h3>
                <p className="mt-4 text-sm text-text">{decisao.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Telas */}
        {projeto.desktop && projeto.desktop.length > 0 && (
          <section className="mt-(--spacing-section)">
            <h2 className="text-[length:var(--text-step-2)]">As telas</h2>
            <p className="mt-5 max-w-[54ch] text-text">
              Capturas reais da aplicação rodando
              {projeto.natureza === "autoral"
                ? ", com dados fictícios gerados pela própria massa de demonstração do projeto"
                : ""}
              . Passe o cursor para a página descer.
            </p>

            <div className="mt-(--spacing-bloco) space-y-14">
              {projeto.desktop.map((tela, i) => (
                <figure key={tela.src} data-reveal>
                  <BrowserFrame
                    src={tela.src}
                    alt={tela.alt}
                    rotulo={projeto.titulo.toLowerCase().replace(/\s+/g, "-")}
                    brilho={tema.brilho}
                    rolar
                    priority={i === 0}
                    sizes="(min-width: 1024px) 1100px, 94vw"
                  />
                  <figcaption className="mt-4 max-w-[70ch] font-mono text-xs leading-relaxed text-text-dim">
                    {tela.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {projeto.mobile && projeto.mobile.length > 0 && (
          <section className="mt-(--spacing-section)">
            <h2 className="text-[length:var(--text-step-2)]">No celular</h2>
            <p className="mt-5 max-w-[54ch] text-text">
              A mesma aplicação na tela pequena, que é onde ela é realmente usada.
            </p>
            <div className="mt-(--spacing-bloco) flex justify-center">
              <PhoneCarousel
                images={projeto.mobile}
                rotulo={projeto.titulo}
                cor={COR_CARROSSEL[eixo.cor]}
                className="w-full max-w-md"
              />
            </div>
          </section>
        )}

        {/* Stack */}
        <section className="mt-(--spacing-section) border-t border-hairline pt-10">
          <h2 className="kicker text-text-dim">Stack</h2>
          <ul className="mt-6 flex flex-wrap gap-x-2.5 gap-y-2.5">
            {projeto.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-hairline px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.1em] text-text-dim uppercase"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {projeto.atribuicao && (
          <section className="mt-14 max-w-[70ch] border-l-2 border-hairline-hi pl-6">
            <h2 className="kicker text-text-dim">Origem do código</h2>
            <p className="mt-4 text-sm text-text-dim">{projeto.atribuicao}</p>
          </section>
        )}

        {projeto.url && (
          <p className="mt-14">
            <a
              href={projeto.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.1em] uppercase underline-offset-[6px] hover:underline",
                tema.texto,
              )}
            >
              Abrir o projeto
              <span aria-hidden="true">↗</span>
            </a>
          </p>
        )}

        {/* Rodapé do case */}
        <nav className="mt-(--spacing-section) flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-10">
          <Link
            href="/#projetos"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-text-mute uppercase transition-colors hover:text-text"
          >
            <span aria-hidden="true">←</span>
            Todos os projetos
          </Link>
          <Link
            href="/#contato"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.1em] text-text-hi uppercase underline-offset-[6px] hover:underline"
          >
            Falar comigo
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}

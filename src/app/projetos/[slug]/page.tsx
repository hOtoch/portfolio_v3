import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projetos } from "@/content/projetos";
import { eixos, site } from "@/content/site";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { LinkProducao } from "@/components/ui/LinkProducao";
import { PhoneCarousel } from "@/components/ui/PhoneCarousel";
import { cn } from "@/lib/utils";

/**
 * Pagina de case — a resposta para "projeto que nao tem link".
 *
 * Um link clicavel prova que a coisa existe; um case bem escrito prova que o
 * autor sabe POR QUE construiu daquele jeito, que e o que diferencia candidato
 * em entrevista tecnica.
 *
 * Ordem: problema → como funciona (fluxo) → o que faz (cada funcionalidade ao
 * lado da sua tela) → decisoes e por que → telas restantes → celular →
 * qualidade e stack. Os blocos opcionais somem quando o case nao tem o dado,
 * como nos projetos confidenciais.
 */

const TEMA = {
  magenta: { texto: "text-magenta", filete: "bg-magenta", brilho: "rgba(255,45,143,.3)" },
  violet: { texto: "text-violet", filete: "bg-violet", brilho: "rgba(177,75,255,.3)" },
  crimson: { texto: "text-crimson", filete: "bg-crimson", brilho: "rgba(255,51,85,.3)" },
} as const;

const COR_CARROSSEL = { magenta: "magenta", violet: "violet", crimson: "crimson" } as const;

const ETIQUETA = {
  "no-ar": "Em produção",
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

  const titulo = `${projeto.titulo} · ${site.nome}`;

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
  const rotulo = projeto.titulo.toLowerCase().replace(/\s+/g, "-");

  // Cada funcionalidade puxa a sua tela de `desktop`; o que sobra vai para a galeria.
  const telas = projeto.desktop ?? [];
  const funcionalidades = (projeto.funcionalidades ?? []).map((funcionalidade) => ({
    funcionalidade,
    tela: telas.find((t) => t.src === funcionalidade.tela),
  }));
  const usadas = new Set(funcionalidades.map((f) => f.tela?.src));
  const outrasTelas = telas.filter((t) => !usadas.has(t.src));

  // Projeto no ar mostra o site publicado; o autoral sem demo, a massa de demonstração.
  const notaCapturas =
    projeto.status === "no-ar"
      ? "Capturas do site no ar, só das telas abertas a qualquer visitante: o que fica atrás do login está descrito, não mostrado."
      : "Capturas reais da aplicação rodando, com dados fictícios gerados pela própria massa de demonstração do projeto.";

  return (
    <article className="pt-32 pb-(--spacing-section)" data-cursor-cor={eixo.cor}>
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
            {projeto.status === "no-ar" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 px-2.5 py-1 font-mono text-[0.58rem] tracking-[0.14em] text-cyan/90 uppercase">
                <span aria-hidden="true" className="relative flex size-1.5">
                  <span className="absolute inset-0 rounded-full bg-cyan motion-safe:animate-ping" />
                  <span className="relative size-1.5 rounded-full bg-cyan" />
                </span>
                {ETIQUETA[projeto.status]}
              </span>
            ) : (
              <span className="font-mono text-[0.58rem] tracking-[0.14em] text-text-mute uppercase">
                {ETIQUETA[projeto.status]}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <h1>{projeto.titulo}</h1>
            {projeto.url && <LinkProducao url={projeto.url} className="px-4 py-2 text-sm" />}
          </div>
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

        {/* Como funciona — o fluxo de ponta a ponta, em etapas */}
        {projeto.fluxo && projeto.fluxo.length > 0 && (
          <section className="mt-(--spacing-section)">
            <h2 className="text-[length:var(--text-step-2)]">Como funciona</h2>
            <ol className="mt-(--spacing-bloco) grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-5">
              {projeto.fluxo.map((etapa, i) => (
                <li key={etapa.titulo} data-reveal className="relative bg-surface-1 p-6">
                  <p className={cn("font-mono text-xs tracking-[0.14em]", tema.texto)}>
                    {String(i + 1).padStart(2, "0")}
                    {i < projeto.fluxo!.length - 1 && (
                      <span aria-hidden="true" className="ml-2 text-text-mute">
                        →
                      </span>
                    )}
                  </p>
                  <h3 className="mt-4 text-[length:var(--text-step-0)] font-semibold">{etapa.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-dim">{etapa.texto}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* O que ele faz — cada grupo ao lado da tela que o mostra */}
        {funcionalidades.length > 0 && (
          <section className="mt-(--spacing-section)">
            <h2 className="text-[length:var(--text-step-2)]">O que ele faz</h2>
            {projeto.natureza === "autoral" && (
              <p className="mt-5 max-w-[54ch] text-text">{notaCapturas}</p>
            )}

            <div className="mt-(--spacing-bloco) space-y-(--spacing-bloco) lg:space-y-28">
              {funcionalidades.map(({ funcionalidade, tela }, i) => (
                <div
                  key={funcionalidade.titulo}
                  data-reveal
                  className={cn(
                    "grid items-center gap-8 lg:gap-14",
                    tela &&
                      (i % 2 === 1
                        ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
                        : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"),
                  )}
                >
                  <div className={cn(tela && i % 2 === 1 && "lg:order-2")}>
                    <p className="font-mono text-xs text-text-mute">
                      [ {String(i + 1).padStart(2, "0")} ]
                    </p>
                    <h3 className="mt-4 text-[length:var(--text-step-1)]">{funcionalidade.titulo}</h3>
                    <ul className="mt-6 space-y-3">
                      {funcionalidade.itens.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-text">
                          <span aria-hidden="true" className={tema.texto}>
                            ·
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tela && (
                    <figure>
                      <BrowserFrame
                        src={tela.src}
                        alt={tela.alt}
                        rotulo={rotulo}
                        brilho={tema.brilho}
                        priority={i === 0}
                        sizes="(min-width: 1024px) 720px, 94vw"
                      />
                      <figcaption className="mt-3 font-mono text-[0.68rem] leading-relaxed text-text-mute">
                        {tela.alt}
                      </figcaption>
                    </figure>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

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

        {/* Telas que não entraram em nenhuma funcionalidade */}
        {outrasTelas.length > 0 && (
          <section className="mt-(--spacing-section)">
            <h2 className="text-[length:var(--text-step-2)]">
              {funcionalidades.length > 0 ? "Mais telas" : "As telas"}
            </h2>
            {funcionalidades.length === 0 && projeto.natureza === "autoral" && (
              <p className="mt-5 max-w-[54ch] text-text">{notaCapturas}</p>
            )}

            <div className="mt-(--spacing-bloco) grid gap-x-8 gap-y-12 md:grid-cols-2">
              {outrasTelas.map((tela) => (
                <figure key={tela.src} data-reveal>
                  <BrowserFrame
                    src={tela.src}
                    alt={tela.alt}
                    rotulo={rotulo}
                    brilho={tema.brilho}
                    sizes="(min-width: 1024px) 620px, 94vw"
                  />
                  <figcaption className="mt-3 font-mono text-[0.68rem] leading-relaxed text-text-mute">
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

        {/* Qualidade e stack */}
        <div
          className={cn(
            "mt-(--spacing-section) grid gap-x-16 gap-y-12 border-t border-hairline pt-10",
            projeto.qualidade && "md:grid-cols-2",
          )}
        >
          {projeto.qualidade && (
            <section>
              <h2 className="kicker text-text-dim">Qualidade e entrega</h2>
              <ul className="mt-6 space-y-3">
                {projeto.qualidade.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-text">
                    <span aria-hidden="true" className={tema.texto}>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
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
        </div>

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

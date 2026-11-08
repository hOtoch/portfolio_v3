import { eixos, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Hud } from "@/components/ui/Hud";
import { Retrato } from "@/components/ui/Retrato";
import { NomeNeon } from "@/components/ui/NomeNeon";
import Image from "next/image";
import { Fog } from "@/components/fx/Fog";
import { Rain } from "@/components/fx/Rain";
import fotoRua from "../../../public/hero.jpg";

const COR_SERVICO = {
  magenta: "text-magenta",
  violet: "text-violet",
  crimson: "text-crimson",
} as const;

/**
 * design.md §9.1 — Setor 00 // CHEGADA, arranjo "placa de neon".
 *
 * O nome é o elemento display e o <h1>; a função desce para subtítulo.
 *
 * v4 — o hero virou cartão de identificação: título e nível ficam visíveis
 * de imediato, e o par de botões leva à prova e ao
 * currículo em PDF, porque recrutador quer o arquivo, não só a página.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 pb-10 sm:pt-28"
    >
      {/* ── Cenario ──────────────────────────────────────────────────── */}
      {/*
        Foto da rua (public/hero.jpg). O contêiner sobra 8% acima
        da seção porque o parallax (§14.2) empurra a camada para baixo ao rolar;
        sem essa folga, aparecia uma faixa vazia no topo.
      */}
      <div
        aria-hidden="true"
        data-parallax=""
        className="pointer-events-none absolute inset-x-0 -top-[8%] bottom-0"
        style={{ zIndex: "var(--z-bg)", "--parallax": "7%" } as React.CSSProperties}
      >
        <Image
          src={fotoRua}
          alt=""
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-[50%_60%]"
        />
      </div>
      {/* Véu de leitura: escurece a esquerda (nome) e o topo (nav) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: "var(--z-bg)",
          background:
            "linear-gradient(90deg, rgba(7,6,13,.7) 0%, rgba(7,6,13,.35) 45%, transparent 75%), linear-gradient(180deg, rgba(7,6,13,.6) 0%, transparent 25%)",
        }}
      />
      <Fog />
      <Rain />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          zIndex: "var(--z-bg)",
          background:
            "linear-gradient(180deg, transparent, rgba(7,6,13,.85) 55%, var(--color-void))",
        }}
      />

      {/* ── Conteudo — centralizado no espaco que sobra acima do rodape ── */}
      <div
        className="flex flex-1 items-center"
        style={{ zIndex: "var(--z-content)", position: "relative" }}
      >
        <div className="mx-auto w-full max-w-(--container-site) px-(--spacing-gutter)">
        <div className="grid items-center gap-8 sm:gap-10 md:grid-cols-[1.35fr_1fr] md:gap-12 lg:gap-16">
          {/* Letreiro */}
          <div>
            {/* A animação do letreiro vive em <NomeNeon> (decodificação →
                tubo acendendo → pisca raro). Sem `ignite` aqui: o fade da
                seção inteira brigaria com a cascata letra a letra. */}
            <h1 className="text-[length:var(--text-step-5)] leading-[0.84] tracking-[-0.045em] uppercase">
              <NomeNeon
                palavras={[{ texto: "Hugo" }, { texto: "Otoch", neon: true }]}
              />
            </h1>

            <div
              aria-hidden="true"
              className="mt-7 h-px w-full max-w-[22rem]"
              style={{
                background: "var(--grad-brand)",
                animation: "reveal-up var(--dur-slow) var(--ease-out) calc(var(--abertura) + 360ms) both",
              }}
            />

            <p
              className="mt-6 font-mono text-[length:var(--text-step-1)] leading-[1.35] tracking-[0.02em] text-text"
              style={{ animation: "reveal-up var(--dur-slow) var(--ease-out) calc(var(--abertura) + 440ms) both" }}
            >
              {site.titulo}
              <span className="text-text-dim"> · {site.nivel}</span>
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10"
              style={{ animation: "reveal-up var(--dur-slow) var(--ease-out) calc(var(--abertura) + 540ms) both" }}
            >
              <Button href="#projetos">Ver projetos</Button>
              <Button href={site.curriculo} target="_blank" rel="noopener" variante="secundario" seta>
                Baixar CV
              </Button>
            </div>
          </div>

          {/* Retrato — no mobile vem antes do nome, em escala de crachá */}
          <div
            className="order-first w-40 justify-self-start sm:w-52 md:order-none md:w-full md:max-w-[22rem] md:justify-self-end"
            style={{ animation: "reveal-up var(--dur-scene) var(--ease-out) calc(var(--abertura) + 300ms) both" }}
          >
            <Retrato />
          </div>
          </div>
        </div>
      </div>

      {/*
        ── Rodape do hero ──────────────────────────────────────────────
        Linha de servicos + indicador de scroll + HUD, encostados na base.
        So a partir de `md`, onde o layout vira duas colunas e sobra altura.
        Abaixo disso o conteudo empilha e a faixa estourava o 100svh — e os
        servicos aparecem inteiros na secao seguinte de qualquer forma.
      */}
      <div
        className="mx-auto hidden w-full max-w-(--container-site) px-(--spacing-gutter) md:block"
        style={{ zIndex: "var(--z-content)", position: "relative" }}
      >
        {/* Indicador de scroll: fica acima do filete, apontando para a faixa */}
        <div
          aria-hidden="true"
          className="relative mb-5 h-14 w-px overflow-hidden bg-hairline"
        >
          <span
            className="absolute inset-x-0 top-0 h-4 bg-magenta"
            style={{ animation: "scroll-dot 2s var(--ease-in-out) infinite" }}
          />
        </div>

        {/* Servicos e HUD na mesma linha: servicos a esquerda, coordenadas a direita */}
        <div
          className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-hairline pt-5"
          style={{ animation: "reveal-up var(--dur-slow) var(--ease-out) calc(var(--abertura) + 660ms) both" }}
        >
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-3">
            {eixos.map((servico) => (
              <li key={servico.id} className="flex items-center gap-2.5">
                <span aria-hidden="true" className={`${COR_SERVICO[servico.cor]} text-sm`}>
                  {servico.glifo}
                </span>
                <span className="font-mono text-xs tracking-[0.16em] text-text-dim uppercase">
                  {servico.codinome}
                </span>
              </li>
            ))}
          </ul>

          <Hud />
        </div>
      </div>
    </section>
  );
}

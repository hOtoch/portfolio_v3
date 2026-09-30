import Image from "next/image";
import { site } from "@/content/site";
import { RetratoInterativo } from "@/components/ui/RetratoInterativo";

/**
 * Retrato do hero em duotone violeta→magenta — design.md §9.1 e §14.2.
 *
 * Enquanto `site.foto` estiver vazio, renderiza a placa de neon com o monograma:
 * é uma decisão de arte, não um buraco. Para colocar a sua foto:
 *   1. salve o arquivo em `public/` (ex.: public/hugo-otoch.jpg)
 *   2. preencha `foto` em src/content/site.ts com "/hugo-otoch.jpg"
 *
 * A foto atual já vem graduada em magenta/violeta da geração de imagem, então o
 * duotone de CSS foi desligado: grayscale + mix-blend-mode por cima dobrariam a
 * cor e sujariam o resultado. Se um dia entrar uma foto crua aqui, reative o
 * bloco marcado em <Foto> — ele está comentado logo abaixo.
 */

function Moldura({ children, interativo = false }: { children: React.ReactNode; interativo?: boolean }) {
  return (
    <div className="chamfer relative size-full overflow-hidden border border-hairline bg-void">
      {interativo ? <div className="retrato-foto size-full">{children}</div> : children}

      {/* Vinheta: cola o retrato no escuro da cena */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 70px 12px rgba(7,6,13,.95)" }}
      />
      {/* Farol de carro passando na rua — §9.1 */}
      <div
        aria-hidden="true"
        data-fx="farol"
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/3"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.14) 35%, rgba(255,45,143,.22) 55%, transparent)",
          animation: "farol 9s var(--ease-in-out) infinite",
          willChange: "transform",
        }}
      />

      {/* Scanline fina, como monitor de vigilância */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[.18]"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(0,0,0,.5) 0 1px, transparent 1px 5px)",
        }}
      />

      {interativo && <CamadasInterativas />}
    </div>
  );
}

/**
 * Reflexo holográfico e mira de vigilância que seguem o ponteiro. Posição e
 * intensidade vêm das variáveis do <RetratoInterativo>; visual em globals.css.
 */
function CamadasInterativas() {
  return (
    <>
      <div aria-hidden="true" className="retrato-reflexo pointer-events-none absolute inset-0" />

      <div aria-hidden="true" className="retrato-mira pointer-events-none absolute inset-0">
        <span className="retrato-mira-h" />
        <span className="retrato-mira-v" />
        <span className="retrato-mira-alvo">
          <span />
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[0.58rem] tracking-[0.2em] text-cyan uppercase">
          <span className="retrato-mira-status">● Alvo</span>
          <span data-leitura className="mt-1 block text-text-dim tabular-nums">
            X 0.50 · Y 0.50
          </span>
        </span>
      </div>
    </>
  );
}

function PlacaMonograma() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 55% at 50% 108%, rgba(177,75,255,.4), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 30px), repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0 1px, transparent 1px 30px)",
        }}
      />
      <span
        aria-hidden="true"
        className="tube chamfer relative grid size-32 place-items-center rounded-[2px] font-display text-4xl font-bold text-magenta"
        style={{ animation: "flicker 9s steps(1, end) infinite" }}
      >
        HO
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-5 left-5 font-mono text-[0.62rem] tracking-[0.24em] text-text-mute uppercase"
      >
        稼働中
      </span>
    </div>
  );
}

function Foto({ semPreload = false }: { semPreload?: boolean }) {
  return (
    <div className="relative size-full">
      <Image
        src={site.foto}
        alt={`${site.nome}, ${site.titulo.toLowerCase()}`}
        fill
        sizes="(max-width: 1023px) 45vw, 22rem"
        // Next 16: `priority` foi descontinuado em favor de `preload`.
        // Só o retrato do hero pré-carrega: a cópia do reflexo e a da ficha
        // apontam para o mesmo arquivo e gerariam <link> duplicado.
        preload={!semPreload}
        // Sem `quality` custom de proposito: com quality 90 o otimizador do Next
        // 16.3.4 pendura ao gerar o webp de 384px desta imagem (a resposta nunca
        // fecha e o <img> fica eternamente carregando). O padrao 75 gera webp
        // menor e sem diferenca visivel nesta escala.
        // Leve escurecimento só para a foto assentar no escuro da página.
        className="object-cover brightness-[.93] contrast-[1.03]"
      />
      {/*
        Duotone de CSS — desligado: a foto já chega graduada.
        Para uma foto crua, devolva `grayscale contrast-[1.12] brightness-[.82]`
        ao className acima e descomente a camada abaixo.

        <div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-color"
          style={{ background: "linear-gradient(165deg, #B14BFF 0%, #FF2D8F 100%)" }}
        />
      */}
    </div>
  );
}

export function Retrato({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Recorte quadrado abaixo de md: mesmo espaço vertical, rosto bem maior.
          Interativo: inclina com o ponteiro e dá glitch no clique. */}
      <RetratoInterativo>
        <div className="retrato-inclina aspect-square w-full md:aspect-[4/5]">
          <Moldura interativo>{site.foto ? <Foto /> : <PlacaMonograma />}</Moldura>
        </div>
      </RetratoInterativo>

      {/*
        Reflexo no asfalto molhado — design.md §6.9.
        O espelhamento vai na CÓPIA, não na faixa: com scaleY(-1) na faixa
        apareceria o topo do retrato, e um reflexo mostra a base dele.
        A cópia tem a altura inteira e a faixa recorta os primeiros 128px.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full hidden h-32 overflow-hidden md:block"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,.9), transparent 72%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,.9), transparent 72%)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 aspect-[4/5]"
          style={{
            transform: "scaleY(-1)",
            filter: "blur(3px) saturate(130%)",
            opacity: 0.26,
          }}
        >
          <Moldura>{site.foto ? <Foto semPreload /> : <PlacaMonograma />}</Moldura>
        </div>
      </div>
    </div>
  );
}

/** Só o conteúdo, sem moldura nem reflexo — usado na ficha do setor Operador. */
export function RetratoSimples() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-void">
      {site.foto ? <Foto semPreload /> : <PlacaMonograma />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 60px 10px rgba(7,6,13,.9)" }}
      />
    </div>
  );
}

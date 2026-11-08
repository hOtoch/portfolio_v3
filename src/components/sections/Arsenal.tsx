import { arsenal } from "@/content/percurso";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ALTURA, COR_DA_LINHA, LARGURA, montarRede, type Estacao, type Lado } from "./metro/rede";

/**
 * design.md §9.6 — Setor 04 // ARSENAL, como mapa de metro.
 *
 * Cada grupo do curriculo e uma linha na sua cor; cada tecnologia, uma
 * estacao. As baldeacoes sao onde duas linhas rodaram juntas numa
 * experiencia do curriculo, e cada uma aponta para o marco na Trajetoria.
 * Profundidade dita por conexao, nunca por barra de "nivel de
 * habilidade" (§2.1).
 *
 * Tudo e server component: a geometria sai de `metro/rede.ts`, a animacao e
 * CSS puro disparado pelo [data-reveal] do mapa (globals.css, `.metro-*`).
 * O mapa desenhado so existe a partir de `lg`; abaixo disso, e para leitor de
 * tela em qualquer largura, as linhas viram listas verticais.
 */

const rede = montarRede();
const linhaPorId = Object.fromEntries(arsenal.map((l) => [l.id, l]));

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

const varsDaLinha = (id: keyof typeof COR_DA_LINHA) =>
  ({ "--linha-cor": COR_DA_LINHA[id].cor, "--linha-rgb": COR_DA_LINHA[id].rgb }) as React.CSSProperties;

/** Onde o rotulo fica em volta do ponto, por lado. */
const POSICAO_ROTULO: Record<Lado, string> = {
  cima: "bottom-0 left-0 origin-bottom-left -rotate-40 pl-3 pb-1",
  baixo: "top-0 left-0 origin-top-left rotate-40 pl-3 pt-1",
  direita: "left-0 top-0 -translate-y-1/2 pl-5",
  esquerda: "right-0 top-0 -translate-y-1/2 pr-5",
  sob: "left-0 top-0 pl-3 pt-3.5",
};

function Rotulo({ e }: { e: Estacao }) {
  const hub = e.linhas.length > 1;
  const alvo = hub ? { "data-linhas": e.linhas.join(" ") } : { "data-linha": e.linha };
  return (
    <div
      {...alvo}
      className="metro-rotulo absolute size-0"
      style={{ left: pct(e.x, LARGURA), top: pct(e.y, ALTURA), "--metro-atraso": `${e.atraso}ms` } as React.CSSProperties}
    >
      {/* Area de toque do ponto: o rotulo girado sozinho e um alvo dificil */}
      <span className="absolute -top-2.5 -left-2.5 size-5" />
      <span
        className={`metro-texto absolute whitespace-nowrap font-mono leading-none ${POSICAO_ROTULO[e.lado]} ${
          hub ? "text-[0.76rem] font-semibold text-text-hi" : "text-[0.72rem] text-text"
        }`}
      >
        {e.nome}
      </span>
    </div>
  );
}

function MapaDesenhado() {
  const totalEstacoes = rede.estacoes.length;
  return (
    <div data-reveal className="relative hidden lg:block" aria-hidden="true">
      {/* So em xl: abaixo disso cai em cima dos rotulos da IA */}
      <span className="pointer-events-none absolute -top-6 right-0 hidden font-display xl:block text-6xl font-bold text-text-hi opacity-[0.06] select-none">
        路線図
      </span>

      <div className="relative" style={{ aspectRatio: `${LARGURA} / ${ALTURA}` }}>
        <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="absolute inset-0 size-full overflow-visible">
          {rede.trilhos.map((t) => (
            <g key={t.linha.id} data-linha={t.linha.id} className="metro-grupo" style={varsDaLinha(t.linha.id)}>
              {[
                { largura: 14, cor: "rgba(var(--linha-rgb), .16)" },
                { largura: 5, cor: "var(--linha-cor)" },
                { largura: 1.2, cor: "rgba(255, 255, 255, .45)" },
              ].map((camada) => (
                <path
                  key={camada.largura}
                  d={t.d}
                  pathLength={1}
                  fill="none"
                  stroke={camada.cor}
                  strokeWidth={camada.largura}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="metro-trilho"
                  style={{ "--metro-atraso": `${t.atraso}ms`, "--metro-dur": `${t.duracao}ms` } as React.CSSProperties}
                />
              ))}

              {rede.estacoes
                .filter((e) => e.linhas.length === 1 && e.linha === t.linha.id)
                .map((e) => (
                  <circle
                    key={e.nome}
                    cx={e.x}
                    cy={e.y}
                    r={4.5}
                    strokeWidth={2.2}
                    stroke="var(--linha-cor)"
                    fill="var(--linha-cor)"
                    className="metro-ponto"
                    style={{ "--metro-atraso": `${e.atraso}ms` } as React.CSSProperties}
                  />
                ))}

              {/* Um trem de vez em quando nas duas linhas principais: a cidade esta viva */}
              {(t.linha.id === "ia" || t.linha.id === "backend") && (
                <rect width={16} height={5} x={-8} y={-2.5} rx={2.5} fill="#fff2f9" className="metro-trem">
                  <animateMotion
                    path={t.d}
                    dur={t.linha.id === "ia" ? "13s" : "17s"}
                    begin={t.linha.id === "ia" ? "4s" : "9s"}
                    repeatCount="indefinite"
                    rotate="auto"
                    keyPoints="0;1;1"
                    keyTimes="0;0.4;1"
                    calcMode="linear"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0"
                    keyTimes="0;0.03;0.37;0.4;1"
                    dur={t.linha.id === "ia" ? "13s" : "17s"}
                    begin={t.linha.id === "ia" ? "4s" : "9s"}
                    repeatCount="indefinite"
                  />
                </rect>
              )}
            </g>
          ))}

          {rede.estacoes
            .filter((e) => e.linhas.length > 1)
            .map((e) => (
              <g key={e.nome} data-linhas={e.linhas.join(" ")}>
                <circle
                  cx={e.x}
                  cy={e.y}
                  r={e.linhas.length > 2 ? 10 : 8}
                  fill="var(--color-asphalt)"
                  stroke="var(--color-text-hi)"
                  strokeWidth={3}
                  className="metro-ponto"
                  style={{ "--metro-atraso": `${e.atraso}ms` } as React.CSSProperties}
                />
              </g>
            ))}
        </svg>

        {rede.trilhos.map((t) => (
          <span
            key={t.linha.id}
            data-linha={t.linha.id}
            className="metro-placa absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm border border-(--linha-cor) bg-asphalt font-mono text-[0.7rem] font-semibold text-(--linha-cor)"
            style={{ ...varsDaLinha(t.linha.id), left: pct(t.placa.x, LARGURA), top: pct(t.placa.y, ALTURA) }}
          >
            {t.linha.codigo}
          </span>
        ))}

        {rede.estacoes.map((e) => (
          <Rotulo key={e.nome} e={e} />
        ))}
      </div>

      {/* Legenda: codigo + nome de cada linha. Passar o cursor acende a linha no mapa. */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {arsenal.map((linha) => (
            <li
              key={linha.id}
              data-linha={linha.id}
              className="metro-legenda flex cursor-default items-center gap-2 font-mono text-xs"
              style={varsDaLinha(linha.id)}
            >
              <span className="h-1 w-5 rounded-full bg-(--linha-cor)" />
              <span className="font-semibold text-(--linha-cor)">{linha.codigo}</span>
              <span className="text-text">{linha.grupo}</span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-text-mute">
          Rede · {rede.trilhos.length} linhas · {rede.baldeacoes.length} baldeações · {totalEstacoes} estações
        </p>
      </div>
    </div>
  );
}

/** Abaixo de `lg`, e para leitor de tela sempre: as linhas como listas. */
function Linhas() {
  return (
    <ol className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:sr-only">
      {arsenal.map((linha, i) => (
        <li
          key={linha.id}
          data-reveal
          style={{ ...varsDaLinha(linha.id), "--reveal-atraso": `${i * 70}ms` } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-sm border border-(--linha-cor) font-mono text-[0.7rem] font-semibold text-(--linha-cor)">
              {linha.codigo}
            </span>
            <h3 className="kicker text-text-hi">{linha.grupo}</h3>
          </div>

          <ul className="relative mt-5 ml-3.25 border-l-4 border-(--linha-cor) pb-1">
            {linha.itens.map((nome, j) => {
              const e = rede.estacoes.find((x) => x.nome === nome)!;
              const outras = arsenal.map((l) => l.id).filter((id) => id !== linha.id && e.linhas.includes(id));
              return (
                <li
                  key={nome}
                  className="entra entra-esq relative flex flex-wrap items-baseline gap-x-2 py-1 pl-5"
                  style={{ "--i": j } as React.CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 -left-0.5 rounded-full border-2 ${
                      outras.length ? "size-4 border-text-hi bg-asphalt" : "size-3 border-(--linha-cor) bg-(--linha-cor)"
                    }`}
                  />
                  <span className={`font-mono text-sm ${outras.length ? "font-semibold text-text-hi" : "text-text"}`}>
                    {nome}
                  </span>
                  {outras.length > 0 && (
                    <span className="font-mono text-[0.62rem] text-text-mute">
                      baldeação ·{" "}
                      {outras.map((id) => (
                        <span key={id} className="ml-1" style={{ color: COR_DA_LINHA[id].cor }}>
                          {linhaPorId[id].codigo}
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function Arsenal() {
  return (
    <section id="arsenal" className="scroll-mt-24 py-(--spacing-section)">
      <div className="metro mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <SectionHeading
          numero="04"
          setor="Arsenal"
          titulo="Com o que eu trabalho"
          descricao="Cada linha é uma frente do meu currículo. Onde duas se cruzam, elas rodaram juntas no mesmo trabalho."
        />

        <div className="mt-(--spacing-bloco) lg:mt-[calc(var(--spacing-bloco)+3rem)]">
          <MapaDesenhado />
          <Linhas />
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Cursor de HUD — design.md §7.11.
 *
 * Uma retícula de quatro cantos que segue o ponteiro e, sobre um alvo
 * clicável, trava na borda dele e diz o que o clique vai fazer. A cor vem do
 * eixo do alvo (`data-cursor-cor` num ancestral); fora de eixo, é ciano.
 *
 * Por que é imperativo: posição muda a cada quadro, então nada passa pelo
 * estado do React. O laço de rAF só roda enquanto há algo se movendo e para
 * sozinho quando a retícula assenta — cursor parado custa zero.
 *
 * Gating: só com mouse de verdade (`pointer: fine` + `hover: hover`). Em toque
 * não monta. Sob `prefers-reduced-motion` monta, mas sem inércia e sem a
 * piscada de entrada.
 */

const MQ_MOUSE = "(pointer: fine) and (hover: hover)";
const MQ_MOVIMENTO = "(prefers-reduced-motion: reduce)";

/** O que conta como alvo clicável. */
const ALVO = "a[href], button, [role='button'], label[for], select, summary, [data-cursor-rotulo]";
/** Onde a retícula some e o cursor nativo volta: digitação e o retrato, que tem mira própria. */
const NATIVO =
  "input:not([type='checkbox'], [type='radio'], [type='submit'], [type='button']), textarea, [contenteditable='true'], .retrato-interativo";

const LADO = 28; // retícula em repouso
const FOLGA = 6; // distância da retícula até a borda do alvo
const FOLGA_PRESSIONADO = 2;
const INERCIA = 0.22;
const ALVO_GRANDE = 140; // acima disso o rótulo acompanha o ponteiro, não a borda

function inscrever(aoMudar: () => void) {
  const mq = window.matchMedia(MQ_MOUSE);
  mq.addEventListener("change", aoMudar);
  return () => mq.removeEventListener("change", aoMudar);
}
const lerCliente = () => window.matchMedia(MQ_MOUSE).matches;
const lerServidor = () => false;

/** Rótulo do alvo: explícito no `data-cursor-rotulo`, ou deduzido do elemento. */
function rotular(el: Element): string {
  const explicito = el.closest("[data-cursor-rotulo]")?.getAttribute("data-cursor-rotulo");
  if (explicito) return explicito;

  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute("href") ?? "";
    if (/\.pdf($|[?#])/i.test(href)) return "PDF ↗";
    if (href.startsWith("mailto:")) return "E-MAIL ↗";
    if (href.startsWith("#") || (href.includes("#") && el.pathname === location.pathname)) return "IR ↓";
    if (href.includes("/projetos/")) return "ABRIR CASE →";
    if (el.target === "_blank" || el.origin !== location.origin) return "ABRIR ↗";
    return "IR →";
  }
  if (el instanceof HTMLButtonElement && el.type === "submit") return "ENVIAR";
  if (el instanceof HTMLSelectElement) return "ESCOLHER";
  if (el.tagName === "SUMMARY") return "ABRIR";
  return "ACIONAR";
}

function corDe(el: Element): string {
  const cor = el.closest("[data-cursor-cor]")?.getAttribute("data-cursor-cor");
  return cor ? `var(--color-${cor})` : "var(--color-cyan)";
}

const coord = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export function CursorHud() {
  const ativo = useSyncExternalStore(inscrever, lerCliente, lerServidor);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!ativo || !el) return;

    const cantos = Array.from(el.querySelectorAll<HTMLElement>("[data-canto]"));
    const ponto = el.querySelector<HTMLElement>("[data-ponto]")!;
    const leitura = el.querySelector<HTMLElement>("[data-leitura]")!;
    const moldura = el.querySelector<HTMLElement>("[data-moldura]")!;
    const reduzido = window.matchMedia(MQ_MOVIMENTO).matches;
    const k = reduzido ? 1 : INERCIA;

    // Estado do laço — locais do efeito, não estado do React.
    let px = -100;
    let py = -100;
    let x = px - LADO / 2;
    let y = py - LADO / 2;
    let w = LADO;
    let h = LADO;
    let alvo: Element | null = null;
    let visivel = false;
    let pressionado = false;
    let texto = "";
    let larguraTexto = 0;
    let quadro = 0;

    document.documentElement.setAttribute("data-cursor-hud", "");

    function escrever(novo: string) {
      if (novo === texto) return;
      // A coordenada muda a cada quadro mas tem largura fixa (mono, 4 dígitos):
      // só mede quando o comprimento muda, para não forçar layout por quadro.
      const medir = novo.length !== texto.length;
      texto = novo;
      leitura.textContent = novo;
      if (medir) larguraTexto = leitura.offsetWidth;
    }

    function mirar(sob: Element | null) {
      const nativo = sob?.closest(NATIVO);
      const novo = nativo ? null : (sob?.closest(ALVO) ?? null);
      const mostrar = !nativo;
      if (mostrar !== visivel) {
        visivel = mostrar;
        el!.style.opacity = mostrar ? "1" : "0";
      }
      if (novo === alvo) return;
      alvo = novo;
      el!.style.setProperty("--hud-cor", novo ? corDe(novo) : "var(--color-cyan)");
      el!.toggleAttribute("data-travado", !!novo);
      if (novo) {
        escrever(rotular(novo));
        // Glitch é evento, não estado (§2.1): uma piscada de tubo ao travar.
        if (!reduzido) {
          moldura.animate([{ opacity: 1 }, { opacity: 0.25 }, { opacity: 1 }, { opacity: 0.45 }, { opacity: 1 }], {
            duration: 220,
            easing: "steps(4, end)",
          });
        }
      }
    }

    function passo() {
      quadro = 0;
      let tx: number, ty: number, tw: number, th: number;
      const folga = pressionado ? FOLGA_PRESSIONADO : FOLGA;

      if (alvo && alvo.isConnected) {
        const r = alvo.getBoundingClientRect();
        tx = r.left - folga;
        ty = r.top - folga;
        tw = r.width + folga * 2;
        th = r.height + folga * 2;
      } else {
        const lado = pressionado ? LADO - 8 : LADO;
        tx = px - lado / 2;
        ty = py - lado / 2;
        tw = lado;
        th = lado;
      }

      x += (tx - x) * k;
      y += (ty - y) * k;
      w += (tw - w) * k;
      h += (th - h) * k;

      cantos[0].style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cantos[1].style.transform = `translate3d(${x + w - 8}px, ${y}px, 0)`;
      cantos[2].style.transform = `translate3d(${x}px, ${y + h - 8}px, 0)`;
      cantos[3].style.transform = `translate3d(${x + w - 8}px, ${y + h - 8}px, 0)`;
      ponto.style.transform = `translate3d(${px - 2}px, ${py - 2}px, 0)`;

      if (!alvo) escrever(`X ${coord(px)} · Y ${coord(py)}`);

      // Rótulo na base direita da retícula; vira para a esquerda perto da borda.
      // Alvo grande (a tela da TV) teria o rótulo longe da mão: aí ele segue o ponteiro.
      let lx: number, ly: number;
      if (alvo && h > ALVO_GRANDE) {
        lx = px + 18;
        ly = py + 14;
      } else {
        lx = x + w + 8;
        ly = y + h - 14;
      }
      if (lx + larguraTexto > window.innerWidth - 8) lx = (alvo && h > ALVO_GRANDE ? px - 18 : x - 8) - larguraTexto;
      leitura.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

      const assentou =
        Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(tw - w) < 0.1 && Math.abs(th - h) < 0.1;
      // Com alvo, continua: ele pode estar se mexendo (hover que sobe 2px, carrossel).
      if (!assentou || alvo) quadro = requestAnimationFrame(passo);
    }

    function acordar() {
      if (!quadro) quadro = requestAnimationFrame(passo);
    }

    function aoMover(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      mirar(e.target as Element);
      acordar();
    }

    // Rolar com o ponteiro parado troca o que está embaixo dele.
    function aoRolar() {
      if (!visivel && !alvo) return;
      mirar(document.elementFromPoint(px, py));
      acordar();
    }

    function aoSair(e: PointerEvent) {
      if (e.relatedTarget) return;
      visivel = false;
      el!.style.opacity = "0";
    }

    function aoApertar(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pressionado = true;
      acordar();
    }

    function aoSoltar() {
      pressionado = false;
      acordar();
    }

    // Some ao trocar de aba e não volta travado num alvo que já saiu da tela.
    function aoBlur() {
      visivel = false;
      el!.style.opacity = "0";
    }

    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("pointerdown", aoApertar, { passive: true });
    window.addEventListener("pointerup", aoSoltar, { passive: true });
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("blur", aoBlur);
    document.addEventListener("pointerout", aoSair);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerdown", aoApertar);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("blur", aoBlur);
      document.removeEventListener("pointerout", aoSair);
      document.documentElement.removeAttribute("data-cursor-hud");
    };
  }, [ativo]);

  if (!ativo) return null;

  return (
    <div ref={raiz} aria-hidden="true" className="cursor-hud" style={{ opacity: 0 }}>
      <div data-moldura>
        <i data-canto="tl" />
        <i data-canto="tr" />
        <i data-canto="bl" />
        <i data-canto="br" />
      </div>
      <i data-ponto />
      <span data-leitura />
    </div>
  );
}

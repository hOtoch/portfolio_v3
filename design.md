# DESIGN.md — Portfólio "Night City"

> Direção de arte + sistema de design do portfólio de **Hugo Otoch** — desenvolvedor fullstack
> e engenheiro de IA atuando como freelancer.
> Fonte única de verdade para quem (pessoa ou agente de IA) for implementar, estender ou revisar o site.

## 0. Identidade — dados reais

| Campo | Valor |
|---|---|
| Nome de marca | **Hugo Otoch** (o nome é a marca; `OtochLabs` fica como assinatura de estúdio, opcional no footer) |
| Nome completo | Hugo Lima Otoch Demetrio de Souza |
| Título | Desenvolvedor Fullstack & Engenheiro de IA |
| Base | Vitória, Espírito Santo · Remoto (Brasil e global) |
| E-mail | `otochdev@gmail.com` |
| GitHub | `github.com/hugootoch` |
| LinkedIn | `linkedin.com/in/hugootoch/` |
| WhatsApp | `[PREENCHER]` — único dado que ainda falta |
| Formação | Bacharelado em Engenharia de Computação — UFES (concluído em fev/2026) |
| Idiomas | Português (nativo) · Inglês (B1) |
| Domínio sugerido | `hugootoch.dev` (1ª opção) · `otoch.dev` · `otochlabs.com` |

**Regra de conteúdo:** tudo neste documento que aparece como texto de site vem do currículo real.
Nada de número inventado. Se um dado não estiver no §17 (Inventário de conteúdo), ele não vai pro site.

---

## 1. Conceito

### 1.1 A ideia central

O site é uma **caminhada por uma rua de Night City às 2h da manhã**.

Não é "um portfólio com cores cyberpunk". É uma cidade. O visitante chega no início da avenida
(hero), passa pelas fachadas de neon que anunciam os serviços, entra no arquivo de dados onde
ficam os projetos, consulta o painel de contratos e sai pelo fim da rua. **A rolagem é o
deslocamento.** Cada seção é um setor da cidade.

E a cidade está **viva mesmo de madrugada**: luz piscando, reflexo molhado no asfalto, letreiro
girando, ticker de dados rolando, névoa subindo do bueiro. Nada disso é enfeite — é a prova
ambiente de que "aqui tem alguém trabalhando enquanto o resto dorme".

### 1.2 Posicionamento

| Eixo | Posição |
|---|---|
| Arquétipo | O **Netrunner / Fixer** — o operador que entrega o serviço que os outros não entregam |
| Tom | Direto, técnico, confiante. Zero hype de agência. Nada de "transformamos sonhos em realidade". |
| Promessa | "Você descreve o problema. Eu entrego o sistema rodando." |
| Prova | Código, métrica, caso com número. Não adjetivo. |

### 1.3 Tagline (escolha uma)

- `Sistemas que trabalham enquanto você dorme.` ← **recomendada** (casa com a noite)
- `Código, automação e agentes. Entregues.`
- `Da ideia ao deploy. Web, RPA e IA.`

### 1.4 Os três serviços como fachadas

Cada serviço tem **placa de neon, cor e glifo próprios**. Essa tripla se repete sem exceção em
todo o site: cards, filtros de projeto, formulário, footer, favicon de página interna.

| Serviço | Codinome | Cor | Glifo | Frase de vitrine |
|---|---|---|---|---|
| Sites & Landing Pages | `WEB//CRAFT` | `--neon-magenta` | `◤` | Presença digital que converte — não que só existe. |
| Automações RPA | `AUTO//FLOW` | `--neon-violet` | `⟳` | Processo manual vira rotina que não erra e não dorme. |
| Agentes de IA | `AGENT//CORE` | `--neon-crimson` | `◈` | Agentes que executam tarefas reais, com ferramentas e memória. |

---

## 2. Princípios de design

1. **A escuridão é o produto.** ~85% da tela é superfície escura. O neon é o que sobra.
   Se tudo brilha, nada brilha.
2. **Luz vem de fontes, não do CSS.** Todo brilho deve parecer emitido por um objeto do cenário:
   uma placa, uma tela, um cabo, um refletor. Nunca um `box-shadow` colorido solto num card.
3. **Sujeira por cima de tudo.** Grão, scanline, vinheta e leve aberração cromática sobre a página
   inteira. Pixel limpo demais entrega que é template.
4. **Profundidade em camadas.** Fundo (skyline/névoa) → meio (conteúdo) → frente (chuva/grão/HUD).
   Parallax discreto separa as camadas.
5. **Tipografia é sinalização urbana.** Títulos gigantes e apertados, kickers em mono maiúsculo —
   letreiro e placa de rua.
6. **Assimetria.** Grid de 12 colunas usado desbalanceado. Nada centralizado por preguiça.
7. **Nunca decore o que precisa ser lido.** Texto de corpo é sempre sólido: sem glow, sem
   gradiente, sem outline.
8. **Performance é estética.** Uma cidade a 30fps deixa de ser viva e vira GIF pesado.

### 2.1 Anti-padrões — proibido

- ❌ Gradiente roxo→rosa em botão sobre fundo claro (o visual "AI startup 2023").
- ❌ **Orbitron** (ou similar) em texto corrido. Cyberpunk não é fonte de nave espacial.
- ❌ Matrix rain verde. Cor errada, referência errada.
- ❌ Glassmorphism genérico: branco 10% + blur 20px em tudo.
- ❌ Glitch em loop infinito em todo elemento. **Glitch é evento, não estado.**
- ❌ Emoji 🚀✨💡 em título, botão ou card.
- ❌ Ícones de biblioteca sem tratamento (traço fino cinza, estilo padrão).
- ❌ Seção de depoimentos com foto de banco de imagens. Sem cliente real → sem seção.
- ❌ Preto puro `#000` e branco puro `#FFF`.
- ❌ Texto neon sobre fundo neon.
- ❌ Hero com "vídeo de fundo" genérico de cidade em timelapse.

---

## 3. Cor

### 3.1 Filosofia

A base **não é preta** — é azul-violeta profundo, a cor do céu poluído refletindo a cidade.
O neon é saturado mas aparece em **traços finos e áreas pequenas**. O ciano entra em dose
homeopática: é ele que faz o magenta parecer realmente quente (contraste de temperatura).

Distribuição alvo por tela: **70% base escura · 20% texto/superfície · 8% neon de marca · 2% ciano**.

### 3.2 Tokens

```css
:root {
  color-scheme: dark;

  /* ── Base / Superfícies ───────────────────────────── */
  --void:        #07060D;  /* fundo absoluto: topo da página, footer */
  --asphalt:     #0B0A12;  /* fundo padrão de seção */
  --surface-1:   #110F1B;  /* card em repouso */
  --surface-2:   #191527;  /* card em hover / elevado */
  --surface-3:   #221C33;  /* input, chip, estado pressionado */
  --hairline:    #2E2740;  /* borda 1px padrão */
  --hairline-hi: #453A63;  /* borda em hover/foco */

  /* ── Texto ────────────────────────────────────────── */
  --text-hi:     #F5F2FF;  /* títulos */
  --text:        #CAC3DF;  /* corpo */
  --text-dim:    #8E86A8;  /* meta, legenda, placeholder */
  --text-mute:   #807A9E;  /* meta discreta, numeração de seção — 4.87:1 ✓ */

  /* ── Neon de marca ────────────────────────────────── */
  --neon-magenta: #FF2D8F;  /* PRIMÁRIA — CTA, links, foco, Web */
  --neon-violet:  #B14BFF;  /* SECUNDÁRIA — RPA, gradientes */
  --neon-crimson: #FF3355;  /* TERCIÁRIA — IA, calor, alerta */

  /* ── Acentos de sinalização (uso ≤ 5% da tela) ────── */
  --neon-cyan:    #2BF5FF;  /* dados, status online, detalhe de HUD */
  --neon-sodium:  #FF9F4A;  /* poste de rua, calor ao longe */

  /* ── Semânticos ───────────────────────────────────── */
  --ok:    #2BF5B0;
  --warn:  #FFC53D;
  --error: #FF3355;

  /* ── Gradientes ───────────────────────────────────── */
  --grad-brand: linear-gradient(100deg, #FF2D8F 0%, #B14BFF 55%, #6A2BFF 100%);
  --grad-heat:  linear-gradient(100deg, #FF9F4A 0%, #FF3355 50%, #FF2D8F 100%);
  --grad-sky:   radial-gradient(120% 80% at 50% 100%,
                  rgba(177,75,255,.28) 0%, rgba(255,45,143,.12) 35%, transparent 70%);
  --grad-fade:  linear-gradient(180deg, transparent, var(--asphalt) 85%);

  /* ── Brilhos (com parcimônia) ─────────────────────── */
  --glow-magenta: 0 0 12px rgba(255,45,143,.55), 0 0 38px rgba(255,45,143,.22);
  --glow-violet:  0 0 12px rgba(177,75,255,.55), 0 0 38px rgba(177,75,255,.22);
  --glow-cyan:    0 0 10px rgba(43,245,255,.50), 0 0 30px rgba(43,245,255,.18);

  /* ── Elevação (sombra real, não brilho) ───────────── */
  --shadow-1: 0 1px 2px rgba(0,0,0,.6);
  --shadow-2: 0 8px 24px -8px rgba(0,0,0,.8);
  --shadow-3: 0 24px 64px -16px rgba(0,0,0,.9);
}
```

### 3.3 Regras de uso

| Regra | Detalhe |
|---|---|
| Texto de corpo | **Sempre** `--text`. Nunca neon, nunca gradiente. |
| Texto neon | Só em: kicker, número de estatística, **uma** palavra dentro do H1, letreiro decorativo. Máx. **2 ocorrências por viewport**. |
| CTA primário | Fundo `--neon-magenta`, texto `--void`. Contraste 5.79:1 ✓ |
| Link inline | `--neon-magenta` + `text-underline-offset: 4px`. No hover ganha brilho sutil — nunca troca de cor. |
| Gradiente | Só em: barra de progresso, linha divisória, borda de card em hover e letreiro do hero. **Nunca** em fundo de seção inteira. |
| Ciano | Só indicadores de estado, coordenadas de HUD e hover de item de dado. Nunca em CTA. |
| Vermelho | Serviço de IA **e** erros. Como a cor se repete, o erro sempre vem com ícone + label: nunca depende só da cor. |
| Bordas | 1px `--hairline` é o padrão. Borda neon só em elemento focado, ativo ou em hover. |

### 3.4 Modo claro

**Não existe.** Dark-only por conceito — Night City não tem dia. Declare `color-scheme: dark`,
force o tema e defina `<meta name="theme-color" content="#07060D">`. Não faça um modo claro meia-boca.

---

## 4. Tipografia

### 4.1 Famílias

```css
--font-display: "Chakra Petch", "Archivo", system-ui, sans-serif; /* títulos, placas */
--font-sans:    "Inter Tight", "Inter", system-ui, sans-serif;    /* corpo, UI */
--font-mono:    "JetBrains Mono", "IBM Plex Mono", monospace;     /* kicker, dado, código */
```

- **Chakra Petch** (600/700) — corte técnico japonês-industrial sem virar caricatura de ficção
  científica. Use em H1/H2 e nas placas de neon.
- **Inter Tight** — corpo legível sobre fundo escuro, com tracking levemente negativo em
  tamanhos grandes.
- **JetBrains Mono** (500) — tudo que finge ser leitura de máquina: kicker, coordenada,
  numeração de seção, tag de stack, terminal.

> Alternativa premium (se houver licença): **Monument Extended** no display + **Satoshi** no corpo.
> Alternativa 100% Google Fonts: `Archivo` + `Inter` + `JetBrains Mono`.
> Carregue no máximo **3 famílias e 4 pesos** — `font-display: swap`, subset `latin`, self-hosted.

### 4.2 Escala fluida

```css
--step--1: clamp(0.80rem, 0.77rem + 0.15vw, 0.88rem);  /* meta, legenda */
--step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem);  /* corpo */
--step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.50rem);  /* lead */
--step-2:  clamp(1.60rem, 1.40rem + 1.00vw, 2.25rem);  /* H3 */
--step-3:  clamp(2.10rem, 1.70rem + 2.00vw, 3.50rem);  /* H2 */
--step-4:  clamp(2.80rem, 1.90rem + 4.50vw, 6.00rem);  /* H1 */
--step-5:  clamp(3.50rem, 1.50rem + 9.00vw, 11.0rem);  /* display / letreiro */
```

### 4.3 Regras por elemento

| Elemento | Spec |
|---|---|
| H1 | display 700 · `--step-4` · `line-height:.92` · `letter-spacing:-.03em` |
| H2 | display 700 · `--step-3` · `lh 1.0` · `ls -.02em` |
| H3 | display 600 · `--step-2` · `lh 1.15` |
| Kicker | mono 500 · `--step--1` · UPPERCASE · `ls .22em` · `--neon-cyan` ou `--text-dim` |
| Corpo | sans 400 · `--step-0` · `lh 1.65` · `max-width: 68ch` |
| Lead | sans 400 · `--step-1` · `lh 1.5` · `max-width: 54ch` |
| Botão | mono 600 · `.875rem` · UPPERCASE · `ls .1em` |
| Número (stat) | display 700 · `--step-4` · `font-variant-numeric: tabular-nums` |
| Numeração de seção | mono · formato `[ 01 ]` · `--text-mute` |

**Nunca** use uppercase em bloco com mais de 6 palavras.

### 4.4 Bilinguismo de ambiente

Night City é poliglota. Use fragmentos em japonês como **textura**, sempre com
`aria-hidden="true"` e `opacity ≤ .35`, nunca carregando informação:

`夜の街` (cidade noturna) · `接続` (conexão) · `自動化` (automação) · `人工知能` (IA) · `稼働中` (em operação)

Todo o conteúdo real do site é em **português brasileiro**.

---

## 5. Layout, grid e espaçamento

### 5.1 Grid

```css
--container: 1280px;
--gutter:    clamp(1.25rem, 4vw, 3rem);
/* 12 colunas no desktop · 6 no tablet · 4 no mobile */
```

- Conteúdo padrão ocupa **col 2–11**.
- Elementos "de rua" (letreiro, marquee, skyline, faixa de ticker) **sangram até a borda**.
- Assimetria obrigatória: texto em `col 2–7` + visual em `col 8–12`; na seção seguinte, inverta
  e desloque verticalmente (`margin-top` diferente entre as colunas).

### 5.2 Espaçamento (base 4px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

```css
--section-y: clamp(6rem, 12vh, 10rem);  /* padding vertical de seção */
--block-y:   clamp(3rem, 6vh, 5rem);    /* entre blocos internos */
```

Respiro é o que separa "premium" de "template". Entre seções, **nunca menos que 96px no desktop**.

### 5.3 Raio e borda

```css
--r-sm: 4px;   /* chip, tag */
--r-md: 8px;   /* botão, input */
--r-lg: 12px;  /* card */
--r-xl: 20px;  /* painel grande */
```

Estética industrial ⇒ raios pequenos. Nada de `border-radius: 24px` genérico.
Cantos chanfrados (corte diagonal) em cards de destaque — ver §6.5.

### 5.4 Camadas

```css
--z-bg: 0;  --z-content: 10;  --z-sticky: 20;
--z-overlay: 30;  --z-fx: 40;  /* chuva, grão, scanline — pointer-events:none */  --z-cursor: 50;
```

---

## 6. Receitas de efeito

Anime **`transform` e `opacity`**. Evite animar `filter`, `box-shadow` e `backdrop-filter` em loop.

### 6.1 Texto em neon

```css
.neon {
  color: #FFF2F9;
  text-shadow:
    0 0 4px  rgba(255,255,255,.65),
    0 0 11px rgba(255,45,143,.85),
    0 0 26px rgba(255,45,143,.55),
    0 0 52px rgba(255,45,143,.30);
}
.neon--dead { color: #4A3550; text-shadow: none; }  /* letra queimada do letreiro */
```

### 6.2 Flicker de placa (evento, não loop constante)

```css
@keyframes flicker {
  0%, 92%, 100% { opacity: 1; }
  93% { opacity: .35; }
  94% { opacity: 1; }
  96% { opacity: .20; }
  97% { opacity: .90; }
}
.sign { animation: flicker 7s steps(1, end) infinite; }
.sign:nth-child(2) { animation-delay: -2.3s; }  /* dessincroniza as placas */
```

### 6.3 Tubo de neon (borda acesa)

```css
.tube {
  border: 1px solid var(--neon-magenta);
  box-shadow:
    inset 0 0 8px rgba(255,45,143,.35),
    0 0 10px rgba(255,45,143,.45),
    0 0 34px rgba(255,45,143,.18);
}
```

### 6.4 Vidro sujo (card padrão)

Não é glassmorphism branco — é vidro escuro com película:

```css
.panel {
  background:
    linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.012)),
    var(--surface-1);
  border: 1px solid var(--hairline);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-2);
  backdrop-filter: blur(10px) saturate(115%);
}
.panel:hover {
  border-color: color-mix(in oklab, var(--neon-magenta) 45%, var(--hairline));
  box-shadow: var(--shadow-3), 0 0 0 1px rgba(255,45,143,.12);
}
```

### 6.5 Canto chanfrado (HUD)

```css
.chamfer {
  clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px),
                     calc(100% - 18px) 100%, 0 100%, 0 18px);
}
```

### 6.6 Grão de filme (overlay global)

```css
.grain::after {
  content: ""; position: fixed; inset: -50%; pointer-events: none; z-index: var(--z-fx);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  opacity: .055;
  animation: grainShift 1.1s steps(4) infinite;
}
@keyframes grainShift {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-3%, 2%); }
  50%  { transform: translate(2%, -3%); }
  75%  { transform: translate(-2%, -2%); }
}
```

### 6.7 Scanlines (sutil — valide em tela 4K)

```css
.scanlines::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: var(--z-fx);
  background: repeating-linear-gradient(180deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px);
  opacity: .35;
}
```

### 6.8 Aberração cromática no hover (glitch de 180ms)

```css
.glitch:hover { animation: chroma .18s steps(2) 2; }
@keyframes chroma {
  0%   { text-shadow: none; transform: translate(0); }
  50%  { text-shadow: -2px 0 var(--neon-crimson), 2px 0 var(--neon-cyan);
         transform: translate(1px, -1px); }
  100% { text-shadow: none; transform: translate(0); }
}
```

### 6.9 Reflexo molhado no asfalto

Duplique o elemento (placa, título), espelhe e mascare:

```css
.reflection {
  transform: scaleY(-1);
  filter: blur(3px) saturate(130%);
  opacity: .28;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,.9), transparent 70%);
}
```

### 6.10 Névoa volumétrica

Dois `radial-gradient` grandes em `position:absolute` com `filter: blur(80px)` e `opacity:.35`,
animados por `transform: translate3d()` em ciclo de 20–30s. **Nunca anime o `blur`.**

### 6.11 Chuva e relâmpago

Implementado em `components/fx/Rain.tsx`, porte do componente `rain.tsx` de registry
shadcn. Cada gota é um `<div>` com `animation: rain-fall linear infinite` — não é canvas.

**Props do `<RainBackground>`:** `intensity`, `speed`, `color`, `angle`, `dropSize`,
`lightningEnabled`, `lightningFrequency`, `lightningColor`, `lightningMaxIntensity`,
`thunderEnabled`, `thunderVolume`, `thunderDelay`, `seed`.
O `<Rain>` exportado no mesmo arquivo é o preset do hero.

**Regras que valem para este projeto:**

- **`intensity` é o botão de custo.** Cada unidade é um nó no DOM animado. O hero usa 260.
  Medido nesta máquina, sem throttle: 119fps com as 260 gotas contra 137fps sem chuva —
  ~13% do orçamento de quadro. O valor 500 do demo original não foi medido (o ambiente de
  teste suspendia o rAF), então trate-o como não verificado antes de subir.
- **Gating obrigatório:** não monta sob `prefers-reduced-motion`, abaixo de 768px, nem com
  `hardwareConcurrency <= 4`. Lido por `useSyncExternalStore`, então reage a mudança de
  preferência sem recarregar.
- **As gotas vêm de PRNG com seed**, não de `Math.random` em render — o lint do React
  Compiler barra função impura no render, e sorteio a cada re-render seria instável.
- **Trovão desligado.** Áudio automático é bloqueado pelo navegador e hostil num portfólio.
  A prop existe e sintetiza o som em WebAudio se você quiser ligar.
- **Relâmpago no máximo 0.32 de intensidade e em violeta** (`--neon-violet`), não no branco
  azulado do original — clarão branco a 100% estoura a cena e foge da paleta.
  Os keyframes respeitam o limite de 3 flashes por segundo (WCAG 2.3.1).
- Keyframes moram no `globals.css`, não em `<style jsx>`: no App Router o styled-jsx
  exigiria um `StyleRegistry` no layout.

---

## 7. Movimento

### 7.1 Tokens

```css
--dur-fast: 140ms;  --dur-base: 260ms;  --dur-slow: 520ms;  --dur-scene: 900ms;
--ease-out:    cubic-bezier(.16, 1, .3, 1);   /* entrada padrão */
--ease-in-out: cubic-bezier(.65, 0, .35, 1);
--ease-snap:   cubic-bezier(.2, .8, .2, 1);   /* botão, chip */
```

### 7.2 Padrões

| Padrão | Spec |
|---|---|
| Revelação no scroll | `opacity 0→1` + `translateY(24px→0)`, `--dur-slow`, stagger 60–80ms, dispara a 20% de visibilidade, **uma única vez** |
| Letreiro do nome | Duas fases, ~1,1s no total (§7.4). Componente `<NomeNeon>`. |
| Hover de card | `translateY(-4px)` + borda neon + seta `→` aparece. **Sem escala.** |
| Hover de botão | Preenchimento varre da esquerda (`::before` com `scaleX`) |
| Cursor custom | Ponto 8px + halo 32px, `mix-blend-mode: screen`, lerp .12; cresce sobre alvos clicáveis. Só em `(pointer: fine)`. |
| Marquee | Letreiro horizontal de serviços, 40s linear infinito, pausa no hover |
| Parallax | Camadas de fundo a `0.15–0.35` da velocidade do scroll. Máx. 3 camadas. |
| Ticker de status | Linha mono: `SISTEMA ONLINE · 3 CONTRATOS ATIVOS · LAT -3.73 LON -38.52 · 02:47` |
| Transição de página | Varredura de scanline 400ms + fade. Nunca acima de 600ms. |

### 7.4 O letreiro do nome

Sequência do hero, em `<NomeNeon>`:

| Fase | Quando | O que acontece |
|---|---|---|
| Decodificação | 0 → ~460ms | Cada letra embaralha caracteres (katakana + dígitos + símbolos), trocando a cada 45ms, e trava no caractere real. Stagger de 45ms por letra. A letra continua **apagada**. |
| Tubo acendendo | ~600 → ~1100ms | Cascata de 60ms por letra: `color` e `text-shadow` entram por transição. Duas letras fixas hesitam (`falha-ao-acender`) antes de firmar. |
| Pisca raro | depois | Duas letras ganham `pisca-letra` em ciclos de 14s e 19s, com atrasos diferentes para as falhas nunca coincidirem. ~220ms de falha por ciclo. |

**Regras:**

- O servidor entrega o nome **completo e aceso**. A animação é progressive
  enhancement e só começa depois de montar — o nome está legível no primeiro paint,
  vale para SEO, e quem não tem JS vê o estado final.
- O nome real fica num `sr-only` dentro do `<h1>`; as letras animadas são
  `aria-hidden`. Leitor de tela lê "Hugo Otoch", não letra por letra.
- Sob `prefers-reduced-motion` o efeito não roda: o CSS já força `.letra` ao estado aceso.
- As letras que hesitam e as que piscam são **sempre as mesmas**. Aleatório a cada
  visita faria parecer defeito; fixo faz parecer uma placa com um tubo ruim.
- Em desenvolvimento há um flash do nome aceso antes de embaralhar (~500ms), porque a
  hidratação é lenta com HMR. Em produção isso não acontece — medido: já nasce embaralhado.

### 7.5 Farol no retrato

Um brilho diagonal atravessa a moldura do retrato a cada 9s, em ~1,2s.
O elemento fica parado 86% do ciclo (`translateX(-130%)`) e só então cruza —
assim o custo é um `transform` por ciclo, não uma animação contínua.
Sai sob `prefers-reduced-motion` (`[data-fx="farol"]`).

### 7.6 Revelação no scroll

Um `<RevealObserver>` só, montado no layout, observa tudo que tem `data-reveal`.
As seções continuam server components: elas só marcam o atributo e, opcionalmente,
`--reveal-atraso` para o stagger.

- Entra com `translateY(24px)` + `opacity 0 → 1`, dispara a **20% de visibilidade**,
  e para de observar: rolar de volta não re-anima.
- **Rede de segurança obrigatória:** num salto (link de âncora, hash na URL, End no
  teclado) o bloco vai de "abaixo da tela" direto para "acima da tela" e a razão de
  interseção **nunca cruza o threshold** — nenhum callback dispara e a seção ficaria
  invisível para sempre. Por isso há uma varredura em `scroll` que revela o que já
  passou. Sem ela, medido: só 2 de 21 blocos apareciam ao abrir em `/#contato`.
- Sem JS (`@media (scripting: none)`) ou com movimento reduzido, tudo nasce visível.

### 7.7 Setor 01 — o que se move nas fachadas

| Efeito | Como |
|---|---|
| Cascata de entrada | Cada card roda `acende-fachada` (700ms) com stagger de **200ms**: sobe 26px, acende, **hesita duas vezes** e firma — é um tubo ligando, não um fade. O filete do topo varre junto, com o mesmo atraso. |
| Bullets de terminal | Cada item entra 620ms depois do card acender, 70ms entre linhas — o atraso soma o índice do card para não colidir com a cascata |
| Glifos vivos | `⟳` gira (8s, é literalmente um símbolo de ciclo), `◈` respira (3s), `◤` pulsa (4s) |
| Foco em hover | `.rua-de-neon:has(> li:hover) > li:not(:hover) > article` cai para 55% — a rua apaga e só a vitrine sob o cursor fica acesa |

> **Armadilha, já paga uma vez:** a transição do foco em hover **tem que mirar no
> `<article>`, nunca no `<li>`**. No `<li>` ela é um shorthand `transition` com
> especificidade `(0,1,1)`, que vence `[data-reveal]` `(0,1,0)` e **zera o
> `transition-delay`** — a cascata inteira colapsa em um fade simultâneo e a subida
> de 24px some, sem erro nenhum no console.

### 7.8 Progresso e parallax

- **Barra de progresso:** filete de 2px no topo com `--grad-brand`, em
  `animation-timeline: scroll(root block)`. CSS puro, sem listener.
  **Precisa de `--z-overlay`**, acima da nav: com o mesmo `--z-sticky` a navbar é
  pintada depois no DOM e engole o filete inteiro.
- **Parallax do cenário:** `[data-parallax]` com `animation-timeline: view(block)`.
  Névoa a 22%, skyline a 9% — as duas únicas camadas, dentro do teto de 3 do §7.2.
- **Setor ativo na nav:** `IntersectionObserver` com `rootMargin: -45% 0px -45%`, ou
  seja, a faixa de detecção é a fatia central da tela. O item ganha um ponto ciano.
  Num salto instantâneo pode não haver setor ativo — aceitável, o pior caso é nenhum ponto.

### 7.3 Redução de movimento — obrigatório

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .rain, .grain::after, .sign { display: none; }
}
```

Mesmo sem movimento o site deve continuar bonito e legível — o neon estático já entrega o conceito.

---

## 8. Componentes

### 8.1 Navbar — "Placa de rua"

- Fixa no topo, `height: 64px`, `backdrop-filter: blur(16px)`, fundo `rgba(7,6,13,.72)`,
  `border-bottom: 1px solid var(--hairline)`.
- Esquerda: marca (monograma `[HO]` + `HUGO OTOCH`). Centro: links em mono uppercase `ls .12em`.
  Direita: CTA `ABRIR CONTRATO`.
- Item ativo: ponto ciano de 4px antes do texto + underline de 1px com `--grad-brand`.
- Após 80px de scroll: altura cai para 56px e a borda ganha 1px de brilho magenta.
- Mobile: menu full-screen com fundo `--void`, itens em `--step-3`, entrando em stagger de 60ms.

### 8.2 Botões

| Variante | Spec |
|---|---|
| Primário | Fundo `--neon-magenta`, texto `--void`, `--r-md`, `padding: 14px 28px`. Hover: `box-shadow: var(--glow-magenta)` + `translateY(-2px)`. |
| Secundário | Transparente, `border: 1px solid var(--hairline-hi)`, texto `--text-hi`. Hover: borda magenta + fundo `rgba(255,45,143,.06)`. |
| Ghost | Só texto + seta `→`. Hover: seta desliza 4px e underline cresce da esquerda. |
| Ícone | 40×40, `--r-md`, `--surface-2`. |

Estados obrigatórios em todos: `:hover`, `:active` (`translateY(0)` + brilho reduzido),
`:focus-visible` (`outline: 2px solid var(--neon-cyan); outline-offset: 3px`), `:disabled`
(`opacity:.4; cursor:not-allowed`) e `loading` (spinner mono + texto `PROCESSANDO...`).

### 8.3 Card de serviço — "Fachada"

```
┌─────────────────────────────────┐
│ ◤                      [ 01 ]   │  ← glifo neon na cor do serviço + índice mono
│                                 │
│ WEB//CRAFT                      │  ← kicker mono, cor do serviço
│ Sites & Landing Pages           │  ← H3 display
│                                 │
│ Presença digital que converte — │  ← corpo, 2–3 linhas
│ não que só existe.              │
│                                 │
│ · Next.js · Landing de alta conv│  ← 3–4 bullets curtos em mono, --text-dim
│ · SEO técnico · Deploy + domínio│
│                                 │
│ VER DETALHES  →                 │  ← ghost button
└─────────────────────────────────┘
```

- Base `.panel` + `.chamfer`. No hover: a borda superior vira um filete de 2px na cor do serviço
  com `--glow-*`, e o glifo ganha flicker de um ciclo.
- Uma leve névoa radial da cor do serviço aparece atrás do card (`opacity: 0 → .18`).

### 8.4 Card de projeto — "Arquivo de dados"

- Thumbnail 16:10 com duotone escuro (base `--void` → realce na cor do serviço) que, no hover,
  desatura menos e ganha saturação total (`filter: grayscale(.35) → grayscale(0)`).
- Overlay inferior com gradiente `--grad-fade` sustentando o título.
- Metadados em mono: `TIPO · ANO · STACK`.
- Faixa de resultado em destaque quando existir: `-73% tempo de processamento`,
  `+41% conversão` — número em `--neon-cyan`, tabular-nums.
- Hover: `translateY(-6px)`, borda neon, e um `ID: NC-0042` aparece no canto.

### 8.5 Formulário — "Terminal de contrato"

O formulário é estilizado como terminal:

```
> nome_do_contratante:  ______________
> canal_de_contato:     ______________
> tipo_de_servico:      [ WEB//CRAFT ▾ ]
> orcamento:            [ < 5k | 5–15k | 15k+ | a definir ]
> briefing:             ______________
                        [ ENVIAR CONTRATO ]
```

- Labels em mono minúsculo com prefixo `>` em `--neon-cyan`.
- Input: fundo `--surface-3`, `border-bottom: 1px solid var(--hairline)`; no foco a borda vira
  magenta com glow e um caret piscante `_` aparece.
- Erro: borda `--error` + mensagem com ícone `▲` (nunca só cor).
- Sucesso: o painel inteiro faz uma varredura de scanline ciano e exibe
  `CONTRATO RECEBIDO · RESPOSTA EM ATÉ 24H`.

### 8.6 Outros

- **Chip/Tag de stack:** mono `--step--1`, `--r-sm`, fundo `--surface-3`, borda `--hairline`.
  Hover: borda ciano.
- **Badge de status:** ponto pulsante `--ok` + `DISPONÍVEL PARA PROJETOS`.
- **Divisória:** linha 1px com `--grad-brand` e `mask-image` desvanecendo nas pontas.
- **Scrollbar:** trilha `--void`, polegar `--surface-3`, hover `--neon-magenta`, largura 8px.
- **Seleção:** `::selection { background: var(--neon-magenta); color: var(--void); }`

---

## 9. Estrutura da página

Uma landing page única (`/`) com âncoras + páginas de estudo de caso (`/projetos/[slug]`).

| # | Setor | Seção | Objetivo |
|---|---|---|---|
| 00 | `CHEGADA` | Hero | Dizer quem é e o que entrega em 5 segundos |
| 01 | `RUA DE NEON` | Serviços | Os 3 serviços como fachadas |
| 02 | `ARQUIVO` | Projetos | Provar com trabalho real |
| 03 | `PIPELINE` | Processo | Reduzir o risco percebido de contratar |
| 04 | `ARSENAL` | Stack | Prova técnica em 10 segundos |
| 05 | `OPERADOR` | Sobre | Criar confiança pessoal |
| 06 | `CONTRATOS` | CTA + Formulário | Converter |
| — | `FIM DA RUA` | Footer | Fechar e dar rotas alternativas |

### 9.1 Hero — `00 // CHEGADA`

Arranjo **"placa de neon"**: o nome é o letreiro, a foto é o retrato ao lado dele.

**Composição:** full-viewport, duas colunas (`1.35fr / 1fr`) a partir de `md`. Skyline em
silhueta no fundo com janelas acesas piscando; névoa violeta subindo da base; chuva fina na
camada da frente; asfalto escurecendo os últimos 30% da altura.

**Conteúdo:**
```
  HUGO                                  ╭─────────────╮
  OTOCH        ← H1, --step-5,          │             │
                 "OTOCH" em .neon       │   RETRATO   │
  ══════════════  ← filete --grad-brand │   duotone   │
                                        │  violeta→   │
  Desenvolvedor fullstack &             │   magenta   │
  engenheiro de IA   ← mono, --step-1   ╰─────────────╯
                                          ~ reflexo ~
  [ ABRIR CONTRATO ]  [ VER PROJETOS → ]

              (o conteúdo acima centraliza no espaço livre)

  ═══════════════════════════════════════════════════════
  ◤ WEB//CRAFT   ⟳ AUTO//FLOW   ◈ AGENT//CORE   ← faixa de rodapé
  │                                    VITÓRIA/ES · HUD
```

**Regras deste setor:**

- **O nome é o `<h1>`.** A função desce para um `<p>` em mono. Em portfólio pessoal a marca é
  a pessoa; o cargo aparece de novo no `<title>` e no JSON-LD, então nada se perde de SEO.
- **Nada de parágrafo de posicionamento, badge de status ou barra de selos.** A linha de
  serviços no rodapé do hero já diz o que é vendido; disponibilidade e credenciais moram na
  ficha do setor Operador (§9.6). Hero com uma mensagem só.
- **Retrato** (§14.2): `public/otoch.png`, gerado por IA a partir de uma foto real com a luz
  do próprio site — key magenta, contraluz violeta, bokeh de cidade e chuva fina. Como já
  chega graduado, **o duotone de CSS fica desligado**: `grayscale` + `mix-blend-mode: color`
  por cima dobrariam a cor. Ficam só a moldura chanfrada, a vinheta e a scanline.
  O bloco do duotone está comentado em `<Foto>` para o caso de entrar uma foto crua.
  Abaixo dele, o reflexo molhado (§6.9) — só em `lg`, onde há altura para ele.
- **Não use `quality` custom no `<Image>` do retrato.** Com `quality={90}` o otimizador do
  Next 16.3.4 pendura ao gerar o webp de 384px desta imagem: a resposta nunca fecha e o
  retrato fica eternamente carregando. O padrão 75 resolve e não muda nada visível nesta escala.
- **Sem foto ainda?** O mesmo componente cai para a placa de neon com o monograma `HO`.
  É decisão de arte, não buraco: nunca use avatar genérico ou foto de banco.
- **Faixa de rodapé do hero** (só a partir de `md`): a linha de serviços, o indicador de
  scroll e o HUD encostam na base da primeira tela, e o conteúdo centraliza no espaço que
  sobra (`flex-1` no bloco de cima). Abaixo de `md` a faixa inteira some — o hero empilha,
  fecha em exatos 100svh no celular e os serviços aparecem completos na seção seguinte.
- Mobile: o retrato vem **antes** do nome, em escala de crachá (`w-40`) e com recorte
  quadrado — mesmo espaço vertical, rosto bem maior. O reflexo some.
- HUD: `VITÓRIA/ES · LAT -20.32 LON -40.34 · 02:47` (relógio real do visitante).
- Indicador de scroll: linha vertical 1px com um ponto magenta descendo em loop de 2s.
- O nome entra com a cascata "acende" (§7.2) — sem `typewriter` clichê.

### 9.2 Serviços — `01 // RUA DE NEON`

- Kicker: `[ 01 ]  SERVIÇOS` · H2: `O que eu construo`.
- Três cards §8.3 em linha no desktop. **Desloque o card do meio 40px para baixo** — é a
  assimetria que quebra o template.
- Atrás dos cards, névoa radial trocando de cor conforme o card em hover.
- Abaixo, marquee full-bleed: `SITES · LANDING PAGES · RPA · AGENTES DE IA · INTEGRAÇÕES · APIs ·`
  em display outline (`-webkit-text-stroke: 1px var(--hairline-hi)`, `color: transparent`).

### 9.3 Projetos — `02 // ARQUIVO`

**Hoje a seção mostra só sites no ar**, em "vitrines": carrossel de celular de um lado,
ficha do projeto do outro, alternando o lado a cada vitrine. Dados em
`content/projetos.ts` → `vitrines`; carrossel em `components/ui/PhoneCarousel.tsx`.

| Slug | Site | Stack (lida do bundle publicado) |
|---|---|---|
| `sentir-terapias` | https://sentir-terapias.vercel.app/ | HTML, CSS, JavaScript, GSAP |
| `pet-park` | https://pet-park-seven.vercel.app/ | React, Vite, GSAP |

**Regras da vitrine:**
- Texto só com o que dá para verificar no próprio site. Sem "cliente", prazo ou resultado
  enquanto não estiver confirmado (§17.2 continua valendo).
- Telas são capturas reais em 390×844 @2x, em `public/projetos/<slug>/NN-nome.webp`, 4 por
  site. **Nunca use tela com placeholder visível**: no Pet Park, as seções "mochilinha" e
  "serviços" ficaram de fora porque mostram `[O_QUE_VAI_NA_MOCHILINHA]` e
  `[DETALHES_ATIVIDADES]` no ar.
- O carrossel anda sempre com update funcional (`setAtivo(a => …)`): com `ativo + 1` lido do
  render, dois cliques rápidos andavam uma tela só.

**Cases arquivados.** Os 5 cases de backend/IA (`sigamaes-ufes`, `plataforma-ia-cobrancas`,
`agentes-autonomos-langgraph`, `rpa-coleta-dados`, `dashboards-etl-django`) seguem em
`content/projetos.ts` → `arquivados`, fora da tela, junto com o `ProjetoVisual` que só eles
usam. Para quando voltarem: NDA descrito sem nomear o cliente
(`CLIENTE CONFIDENCIAL · SETOR FINANCEIRO`), filtros por serviço e contador de registros.

### 9.4 Processo — `03 // PIPELINE`

Quatro etapas numeradas ligadas por uma linha vertical com gradiente que **preenche conforme
o scroll** (`scroll-driven animation` ou `ScrollTrigger`):

1. `BRIEFING` — Entendo o problema, não o pedido. Escopo e prazo por escrito.
2. `ARQUITETURA` — Defino stack, integrações e critérios de aceite antes de escrever código.
3. `BUILD` — Entregas incrementais com ambiente de preview. Você acompanha, não espera.
4. `DEPLOY & OPERAÇÃO` — Vai ao ar, monitorado. Suporte e ajustes combinados.

Cada etapa tem um tempo estimado em mono (`3–5 dias`) — previsibilidade vende.

### 9.5 Stack — `04 // ARSENAL`

Grid denso de tags agrupadas por categoria. Logos monocromáticos em `--text-dim` que acendem na
cor original só no hover. Sem barras de "nível de habilidade" (`85%` é informação vazia).

Stack real, agrupada exatamente assim:

```
BACKEND & ARQUITETURA
  Python · Django · Django REST Framework · Flask · Spring Boot
  Clean Architecture · Design Patterns · Celery · RabbitMQ · Pytest

IA & AGENTES
  LangChain · LangGraph · RAG · Engenharia de Prompt
  Integração de LLMs via API

AUTOMAÇÃO / RPA
  Selenium · n8n · Make · Processos de ETL

FRONTEND
  Next.js · React · TypeScript · Angular

DADOS & INFRA
  PostgreSQL · MSSQL · Redis · Docker · Git
  CI/CD (GitHub Actions) · Swagger/OpenAPI · Power BI
```

> Ordem proposital: o que é mais forte aparece primeiro. Não infle a lista de frontend com
> ferramentas que você não usa — a lista honesta já é densa o bastante.

### 9.6 Sobre — `05 // OPERADOR`

Formato **ficha de identidade / cyberware panel**: foto tratada em duotone violeta-magenta dentro
de um painel chanfrado, com dados em mono ao lado:

```
OPERADOR     HUGO OTOCH
FUNÇÃO       Desenvolvedor Fullstack · Engenheiro de IA
BASE         Vitória, ES · Remoto
FORMAÇÃO     Eng. de Computação — UFES
IDIOMAS      PT-BR (nativo) · EN (B1)
STATUS       ● Disponível para projetos
```

Ao lado, 2 parágrafos em primeira pessoa, sem currículo cronológico. Diga: o que você resolve,
por que você resolve bem e como é trabalhar com você. Base factual para escrever:
engenheiro de computação pela UFES, hoje construindo uma plataforma de IA para automação de
negociação e cobrança; antes disso, APIs e ETL para dashboards estratégicos e um ano e meio
como freelancer entregando agentes de IA e RPA.

**Bloco `TRAJETÓRIA`** (timeline compacta à direita ou abaixo da ficha, mono, linha vertical com
gradiente): cada item é `período · empresa · função`, com 1 linha de descrição. Só isso — o
currículo completo mora no LinkedIn, e há link para ele.

```
2026 →     Tech Solutio            Desenvolvedor Backend
2025–2026  Seer                    Desenvolvedor Backend
2025–2026  LabES / UFES            Full Stack · Projeto de extensão (SigAMAES)
2024–2025  Freelancer              Desenvolvedor RPA e IA
2022–2023  Vixteam                 Estágio · Desenvolvimento e Análise de Dados
```

### 9.7 Contato — `06 // CONTRATOS`

- H2 grande em neon: `Vamos abrir um contrato.`
- Esquerda: formulário-terminal (§8.5). Direita: canais diretos como lista de "frequências",
  cada um com hover ciano:

```
E-MAIL      otochdev@gmail.com
WHATSAPP    [PREENCHER]
GITHUB      github.com/hugootoch
LINKEDIN    linkedin.com/in/hugootoch
```
- Abaixo, microgarantias em mono — `RESPOSTA EM ATÉ 24H · ORÇAMENTO SEM COMPROMISSO ·
  ATENDIMENTO FORA DO HORÁRIO COMERCIAL · NDA SE PRECISAR`.

### 9.8 Footer — `FIM DA RUA`

Fundo `--void`. Letreiro gigante em outline com `HUGO OTOCH` cortado pela borda inferior
(sangra para fora da tela). Links secundários, ticker de status e a linha:
`© 2026 HUGO OTOCH · VITÓRIA/ES · CONSTRUÍDO EM NIGHT CITY`.
Assinatura opcional de estúdio à direita, discreta: `OTOCHLABS`.

---

## 10. Voz e microcopy

**Regra:** frases curtas. Verbo no presente. Número sempre que possível. Zero superlativo.

| Contexto | ✅ Escreva | ❌ Evite |
|---|---|---|
| CTA principal | `ABRIR CONTRATO` | `Entre em contato conosco` |
| CTA secundário | `VER PROJETOS →` | `Saiba mais` |
| Vazio/erro | `SINAL PERDIDO. Tente de novo.` | `Ops! Algo deu errado 😅` |
| 404 | `SETOR NÃO MAPEADO` + link de volta | `Página não encontrada` |
| Loading | `PROCESSANDO...` | `Carregando...` |
| Sucesso | `CONTRATO RECEBIDO · RESPOSTA EM ATÉ 24H` | `Mensagem enviada com sucesso!` |
| Sobre serviço | `Processo manual vira rotina que não erra.` | `Soluções inovadoras de automação` |

O vocabulário de Night City (`contrato`, `operador`, `setor`, `sinal`, `arsenal`) fica na
**navegação e nos rótulos**. A explicação do serviço é sempre em português claro — o cliente
precisa entender o que está comprando.

---

## 11. Acessibilidade

Não é opcional. Neon + fundo escuro é o cenário mais fácil de errar.

- **Contraste:** corpo ≥ 4.5:1, títulos ≥ 3:1. Medidos sobre `--asphalt`:
  `--text` 11.6:1 · `--text-dim` 5.74:1 · `--text-mute` 4.87:1 · `--text-hi` 17.8:1 ·
  magenta 5.65:1 · ciano 14.6:1. Placeholder usa `--text-dim` (4.78:1 sobre `--surface-3`).
  Neon **nunca** em texto pequeno sobre superfície escura sem verificar.
- **Foco visível:** `outline: 2px solid var(--neon-cyan); outline-offset: 3px` em **tudo** que
  é focável. Nunca `outline: none` sem substituto.
- **Cor não é o único sinal:** erro, sucesso e filtro ativo sempre têm ícone ou texto.
- **Semântica:** um `<h1>` por página, hierarquia sem pular níveis, `<nav>`/`<main>`/`<footer>`,
  `<button>` para ação e `<a>` para navegação.
- **Decoração:** grão, scanline, chuva, kanji e letreiros → `aria-hidden="true"` e
  `pointer-events: none`.
- **Skip link:** `Pular para o conteúdo` como primeiro elemento focável.
- **Movimento:** respeite `prefers-reduced-motion` (§7.3). Flicker forte pode incomodar pessoas
  fotossensíveis — mantenha amplitude baixa e nunca acima de 3 flashes por segundo.
- **Alvos de toque:** mínimo 24×24px (WCAG 2.5.8 AA); 44×44px nos controles principais.
- **Teste:** navegação completa só com teclado + Lighthouse a11y ≥ 95.

---

## 12. Performance

Efeito bonito que trava é efeito ruim. Orçamento definido:

| Métrica | Alvo |
|---|---|
| LCP | < 2.0s (4G) |
| CLS | < 0.05 |
| INP | < 200ms |
| JS inicial | < 180KB gzip |
| Peso da 1ª tela | < 900KB |
| FPS no scroll | 60fps estável |
| Lighthouse Perf | ≥ 90 mobile |

**Regras:**
- Máx. **3 elementos** com `backdrop-filter` visíveis ao mesmo tempo.
- `blur()` acima de 40px só em elementos estáticos, nunca animados.
- Anime apenas `transform`/`opacity`. `will-change` só durante a animação — remova depois.
- Canvas (chuva/partículas): pause com `IntersectionObserver` quando fora da viewport e
  desligue em `(max-width: 768px)` e em `navigator.hardwareConcurrency <= 4`.
- Imagens: AVIF/WebP, `loading="lazy"` (exceto o hero), `width`/`height` sempre declarados.
- Fontes: self-hosted, `woff2`, `preload` só da display, `font-display: swap`.
- Sem biblioteca de animação 3D pesada, a menos que o hero justifique — e nesse caso, com
  fallback estático.

---

## 13. Implementação recomendada

### 13.1 Stack

```
Next.js 16 (App Router) + TypeScript   ← implementado na 16.3.4
Tailwind CSS v4 (tokens via @theme)
Motion (framer-motion) para reveals + GSAP ScrollTrigger se precisar de scrub
Lenis para smooth scroll (respeitando reduced-motion)
Conteúdo em MDX ou arquivos TS locais (projetos/serviços)
Formulário: Server Action + Resend (e-mail) + honeypot + rate limit
Deploy: Vercel · Analytics: Vercel Analytics ou Plausible
```

Implementado com Next.js. Se um dia quiser algo 100% estático e mais leve: **Astro 5** + Tailwind v4 + ilhas de React só onde
houver interação.

### 13.2 Estrutura de pastas

```
src/
  app/
    layout.tsx            ← fontes, metadata, overlays globais (grão/scanline)
    page.tsx              ← landing com todas as seções
    projetos/[slug]/page.tsx
    api/ (ou actions/)
  components/
    layout/    Nav, Footer, ScrollProgress
    sections/  Hero, Servicos, Projetos, Processo, Stack, Sobre, Contato
    ui/        Button, Panel, Chip, Badge, Input, Marquee, Reveal
    fx/        Grain, Scanlines, Rain, Fog, NeonText, CursorGlow
  content/     servicos.ts, projetos.ts, stack.ts
  styles/      tokens.css, globals.css
  lib/         utils.ts, motion.ts, seo.ts
public/
  fonts/  images/  og/
```

### 13.3 Tokens no Tailwind v4

```css
/* styles/tokens.css */
@import "tailwindcss";

@theme {
  --color-void:      #07060D;
  --color-asphalt:   #0B0A12;
  --color-surface-1: #110F1B;
  --color-surface-2: #191527;
  --color-hairline:  #2E2740;
  --color-text-hi:   #F5F2FF;
  --color-text:      #CAC3DF;
  --color-text-dim:  #8E86A8;
  --color-magenta:   #FF2D8F;
  --color-violet:    #B14BFF;
  --color-crimson:   #FF3355;
  --color-cyan:      #2BF5FF;

  --font-display: "Chakra Petch", ui-sans-serif, system-ui;
  --font-sans:    "Inter Tight", ui-sans-serif, system-ui;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;  --radius-xl: 20px;

  --ease-out:  cubic-bezier(.16, 1, .3, 1);
  --ease-snap: cubic-bezier(.2, .8, .2, 1);
}
```

### 13.4 SEO e metadados

- `title`: `Hugo Otoch — Desenvolvedor Fullstack & Engenheiro de IA`
- `description`: `Sites e landing pages, automações RPA e agentes de IA. Engenheiro de computação
  (UFES) com 4 anos construindo sistemas em produção. Vitória/ES e remoto.` (≤ 155 caracteres)
- OG image 1200×630 no tema: fundo `--void`, skyline, `HUGO OTOCH` em neon magenta, glifos dos serviços.
- JSON-LD `Person` (`name: Hugo Otoch`, `alumniOf: Universidade Federal do Espírito Santo`,
  `sameAs: [github.com/hugootoch, linkedin.com/in/hugootoch]`, `knowsAbout: [Python, Django,
  LangChain, RPA, Next.js, ...]`) + `ProfessionalService` com `areaServed: BR`.
- `theme-color: #07060D` · favicon com o monograma em neon · `sitemap.xml` + `robots.txt`.

---

## 14. Identidade visual

### 14.1 Monograma

Letreiro vertical estilo Kabukicho: as letras **H O** empilhadas dentro de um retângulo
chanfrado, com tubo de neon magenta (§6.3) e um filete ciano na base. Na horizontal, a marca
completa é `[HO] HUGO OTOCH`, com o monograma em neon e o nome em display.
Funciona em 16px (favicon: só o `[H]` com o corte diagonal, em magenta sobre `--void`).

### 14.2 Assets a produzir

| Asset | Spec |
|---|---|
| Skyline | SVG em 3 camadas de profundidade (silhueta escura, prédios médios, torres com janelas) |
| Janelas acesas | Pontos de 2–4px com opacidade animada aleatoriamente (máx. 40 ativos) |
| Texturas | Grão SVG (§6.6), máscara de asfalto molhado, poça d'água |
| Ícones | Traço 1.5px, cantos retos, estilo HUD — **desenhados**, não baixados cru |
| Foto pessoal | Duotone `--void` → `--neon-violet`, com leve grão e vinheta |
| Thumbs de projeto | 16:10, mesmo tratamento duotone com a cor do serviço |
| OG image | 1200×630 no tema |

### 14.3 Referências

Cyberpunk 2077 (HUD, sinalização), Blade Runner 2049 (névoa, escala, vermelho de sódio),
Ghost in the Shell (tipografia bilíngue), Kowloon/Shinjuku à noite (densidade de placas),
Ghostrunner (contraste magenta/ciano).

---

## 15. Checklist de QA

**Design**
- [ ] Nenhuma tela tem mais de 2 elementos com glow simultâneos
- [ ] Texto de corpo em nenhum lugar usa neon ou gradiente
- [ ] Pelo menos 3 seções quebram a simetria (offset vertical / grid desbalanceado)
- [ ] Espaçamento entre seções ≥ 96px no desktop
- [ ] Os 3 serviços mantêm cor+glifo consistentes em 100% das aparições

**Conteúdo**
- [ ] Todos os projetos são reais (ou rotulados como pessoal/laboratório)
- [ ] Toda seção tem um CTA claro ou leva à próxima
- [ ] Nenhum texto genérico de template sobrou

**Técnico**
- [ ] 60fps no scroll (DevTools > Performance, CPU 4× throttle)
- [ ] Lighthouse ≥ 90 perf / ≥ 95 a11y em mobile
- [ ] `prefers-reduced-motion` testado — site continua bonito
- [ ] Navegação completa por teclado com foco sempre visível
- [ ] Responsivo real em 360 / 768 / 1024 / 1440 / 1920 / 2560
- [ ] Formulário: validação, erro, sucesso, honeypot e rate limit funcionando
- [ ] OG image renderiza no WhatsApp, LinkedIn e X
- [ ] Sem erro no console e sem CLS ao carregar as fontes

---

## 16. Roadmap de construção

1. **Fundação** — tokens, fontes, reset, overlays globais (grão + scanline), layout base.
2. **Componentes** — Button, Panel, Chip, Reveal, Marquee, NeonText.
3. **Hero** — a seção mais cara; acerte ela antes de qualquer outra, ela define o padrão.
4. **Serviços + Contato** — o caminho mínimo de conversão. Com isso o site já vende.
5. **Projetos + Processo + Stack + Sobre.**
6. **FX ambientais** — chuva, névoa, parallax, cursor. Por último, e só se o orçamento de
   performance permitir.
7. **Polimento** — a11y, SEO, OG, checklist §15.

> Se o tempo acabar no passo 4, você ainda tem um portfólio que funciona.
> Nunca comece pelos efeitos.

### 16.1 Estado atual

**Construído:** tokens e base (§3–§7), FX de cenário (grão, scanlines, névoa, skyline),
nav, footer e os sete setores da landing — hero, serviços, projetos, processo, arsenal,
sobre e contato (formulário-terminal com Server Action, honeypot e rate limit).

**Falta:**
- `WhatsApp` em `src/content/site.ts` e `RESEND_API_KEY` no `.env.local` (sem a chave o
  formulário valida mas não envia — ele direciona para o e-mail).
- ~~A foto~~ — feita: `public/otoch.png`, apontada por `foto` em `src/content/site.ts`,
  aparecendo no hero e na ficha do Operador pelo mesmo componente.
- Imagens reais dos projetos (hoje: capa procedural gerada do slug, não screenshot falso).
- Páginas de caso `/projetos/[slug]` — só valem a pena quando houver material real
  (arquitetura, números medidos). Enquanto não houver, o card resume problema e entrega.
- FX opcionais do §6.11 (chuva) e do §7.2 (cursor custom, parallax).

---

## 17. Inventário de conteúdo (fonte: currículo real)

Esta seção é a **fonte de verdade do conteúdo**. Nenhum texto do site pode afirmar algo que
não esteja aqui. Se precisar de um dado novo, adicione aqui primeiro.

### 17.1 Experiência

**Tech Solutio** — Desenvolvedor Backend · Remoto · mar/2026 → atual
- Arquitetura e escala ponta a ponta de uma plataforma de IA para automação de negociação e cobrança.
- Integração de modelos de IA para conduzir interações autônomas com clientes inadimplentes.
- Fluxos assíncronos de alta performance e tarefas em segundo plano com Celery.
- Infraestrutura e banco: Docker para conteinerização, MSSQL para modelagem relacional.

**Seer** — Desenvolvedor Backend · Remoto · ago/2025 → mar/2026
- APIs em Django para geração automatizada de dashboards e relatórios estratégicos.
- Processos de ETL para integração de dados de múltiplas fontes.
- Backend estruturado para grandes volumes, com foco em performance de consulta e integridade.

**Freelancer** — Desenvolvedor RPA e IA · Remoto · jan/2024 → ago/2025
- Agentes autônomos de IA e chatbots com LangChain e LangGraph, integrando LLMs a fluxos empresariais.
- Automações de RPA com Selenium para coleta de dados em larga escala, reduzindo tempo de
  processamento manual em tarefas repetitivas.

**SigAMAES — LabES/UFES** — Desenvolvedor Full Stack (extensão) · Vitória/ES · fev/2025 → jan/2026
- Liderou o desenvolvimento técnico do site do projeto com Spring Boot e Next.js.
- Coordenou a integração frontend/backend aplicando Clean Code para manutenção por outros estudantes.
- Atuou como foco técnico do laboratório, orientando a arquitetura a partir de requisitos reais.

**Vixteam** — Estagiário em Desenvolvimento e Análise de Dados · Vitória/ES · jun/2022 → jun/2023
- Dashboards interativos em Power BI integrados a scripts Python para análise preditiva.
- Apoio no desenvolvimento de sistemas web com Angular no frontend e .NET/Spring no backend.

### 17.2 Números que podem ir ao ar

Só estes. Qualquer outro precisa de evidência antes de ser publicado.

| Dado | Como escrever |
|---|---|
| Tempo de carreira | `4 anos em produção` (desde jun/2022) |
| Freelance em RPA/IA | `1,5 ano entregando RPA e agentes de IA como freelancer` |
| Formação | `Engenharia de Computação — UFES` |
| Liderança técnica | `Liderança técnica em projeto de extensão da UFES` |

❌ **Não publique** percentuais de ganho (`-73% de tempo`, `+41% de conversão`) enquanto não
tiver a medição documentada de um projeto específico. O card de projeto (§8.4) prevê uma faixa
de resultado — deixe-a oculta quando o número não existir, em vez de preenchê-la com estimativa.

### 17.3 Nota de posicionamento — leia antes de escrever a copy

Sua evidência mais forte é **backend, automação e IA**. Frontend aparece em Next.js (SigAMAES),
React/TypeScript e Angular (Vixteam), mas ainda sem um site de cliente entregue.

Isso não muda a oferta — os três serviços continuam de pé. Muda a **ordem da prova**:

1. Na seção de serviços, mantenha `WEB//CRAFT` primeiro (é o que o cliente pequeno procura),
   mas escreva a copy dele apoiada no diferencial que você realmente tem: *"site rápido, com
   backend de verdade por trás — formulário, integração e automação inclusos, não um template
   com formulário quebrado."*
2. ~~No grid de projetos, o destaque inicial é `sigamaes-ufes`.~~ Substituído: a seção de
   projetos agora mostra os sites no ar (§9.3).
3. **Este portfólio é o seu case de frontend.** Ele será a primeira coisa que um cliente de
   landing page vai olhar para decidir se você sabe fazer landing page. Trate-o como entrega
   de cliente: performance, acessibilidade e polimento do §15 valem mais aqui que em qualquer
   outro projeto seu.

### 17.4 Detalhe de honestidade

Você está empregado (Tech Solutio, desde mar/2026) e atuando como freelancer em paralelo.
O badge `● DISPONÍVEL PARA PROJETOS` continua correto, mas alinhe a expectativa no §9.7:
inclua `ATENDIMENTO FORA DO HORÁRIO COMERCIAL` nas microgarantias. Isso é coerente com o
conceito do site — a cidade que trabalha de madrugada — e evita frustração de prazo.

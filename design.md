# DESIGN.md — Portfólio "Night City" (v4)

> Direção de arte + sistema de design do portfólio de **Hugo Otoch** — engenheiro de IA
> candidatando-se a vaga.
> Fonte única de verdade para quem (pessoa ou agente de IA) for implementar, estender ou revisar o site.

**Quem lê o site:** recrutador técnico e tech lead. Não cliente.

Isso é a única coisa que muda tudo. A direção de arte da v3 continua inteira — paleta, grão,
scanline, neon, camadas, tipografia, movimento. O que saiu foi a camada comercial: não há
orçamento, prazo, escopo, garantia nem "pedir proposta" em lugar nenhum. O site não vende um
serviço; ele apresenta um candidato e entrega a prova.

**Regra que está acima de todas as outras:** nada no site pode afirmar algo que não esteja
verificável em `src/content/`. Número só entra quando foi medido. Veja §17.

---

## 0. Identidade — dados reais

| Campo | Valor |
|---|---|
| Nome de marca | **Hugo Otoch** (o nome é a marca; `OtochLabs` fica como assinatura de estúdio, opcional no footer) |
| Nome completo | Hugo Lima Otoch Demetrio de Souza |
| Título | **Engenheiro de IA** · Pleno |
| Especialidade | Agentes de IA, LLMs e automação em produção |
| Base | Vitória, Espírito Santo · Remoto |
| E-mail | `otochdev@gmail.com` |
| GitHub | `github.com/hugootoch` |
| LinkedIn | `linkedin.com/in/hugootoch/` |
| Currículo | `/hugo-otoch-engenheiro-de-ia.pdf` — gerado por `npm run curriculo` (§13.5) |
| Formação | Bacharelado em Engenharia de Computação — UFES (concluído em fev/2026) |
| Idiomas | Português (nativo) · Inglês (B1) |
| Domínio | `hugootoch.dev` |

Tudo isso mora em `src/content/site.ts`. **O WhatsApp saiu**: era canal de cliente. O que ocupou
o lugar dele é a ficha de contratação (§9.7).

---

## 1. Conceito

### 1.1 A ideia central

O site é uma **caminhada por uma rua de Night City às 2h da manhã**.

Não é "um portfólio com cores cyberpunk". É uma cidade. O visitante chega no início da avenida
(hero), passa pelas fachadas de neon que anunciam os três eixos de atuação, entra no arquivo
onde ficam os cases, percorre a trilha que acende conforme ele desce, consulta o arsenal e a
ficha do operador, e sai pelo painel de contato. **A rolagem é o deslocamento.** Cada seção é
um setor da cidade.

E a cidade está **viva mesmo de madrugada**: luz piscando, reflexo molhado no asfalto, letreiro
girando, névoa subindo do bueiro, chuva fina. Nada disso é enfeite — é a prova ambiente de que
"aqui tem alguém trabalhando enquanto o resto dorme". Na v4 isso virou argumento literal: o
trabalho é construir agentes que operam sozinhos.

### 1.2 Posicionamento

| Eixo | Posição |
|---|---|
| Leitor-alvo | Recrutador técnico e tech lead, nos primeiros ~90 segundos de leitura |
| Arquétipo | O **operador** — quem coloca o agente em produção, não quem faz a demo |
| Tom | Direto, técnico, confiante. Zero hype. Nada de "apaixonado por tecnologia". |
| Promessa | "Agentes e aplicações com LLM que saem do notebook e vão para produção." |
| Prova | Decisão técnica escrita, arquitetura, número medido. Não adjetivo. |

**O diferencial, e por que a copy aponta para ele.** Candidato que faz RAG em notebook existe
aos montes. Candidato que coloca agente em produção com fila assíncrona, container, banco
relacional e esteira de CI é raro — e é o que o currículo sustenta. Competir no eixo
"pesquisa e modelagem" seria entrar onde não há prova. Toda a copy do site empurra para o eixo
da entrega.

### 1.3 Tagline

`Sistemas que trabalham enquanto você dorme.`

Ela sobreviveu à virada por sorte e por mérito: escrita para a noite da cidade, agora lê como
agente autônomo. `lead` em `site.ts` complementa: *"Construo agentes e aplicações com LLM que
saem do notebook e vão para produção — com o backend que sustenta."*

### 1.4 Os três eixos como fachadas

Cada eixo tem **placa de neon, cor e glifo próprios**. Essa tripla se repete sem exceção em todo
o site: fachadas, cards de case, página de case, OG image.

| Eixo | Codinome | Cor | Glifo | Frase de vitrine |
|---|---|---|---|---|
| Agentes de IA | `AGENT//CORE` | `--color-crimson` | `◈` | Agentes que executam tarefas reais, com ferramentas, memória e saída validada. |
| LLM em produção | `LLM//OPS` | `--color-violet` | `⟳` | A parte que separa demo de sistema: custo, falha, latência e saber quando não usar IA. |
| Plataforma e backend | `SHIP//PROD` | `--color-magenta` | `◤` | O que sustenta a IA embaixo: API, fila, banco e esteira de entrega. |

**A ordem é a candidatura**: o mais forte primeiro.

**O que mudou da v3.** Eram três *serviços à venda* (`WEB//CRAFT`, `AUTO//FLOW`, `AGENT//CORE`).
Viraram três *eixos de atuação*. `WEB//CRAFT` foi aposentado — anunciar criação de sites dilui
um perfil de IA. A mecânica cor/glifo/codinome é idêntica; só o conteúdo e o destino do botão
mudaram (leva à prova, não ao orçamento).

**Regra de eixo:** eixo sem case que o prove não entra aqui. Hoje `RAG` aparece no arsenal
(vem do currículo) mas **não tem case próprio** — por isso não virou fachada. Quando houver,
é candidato natural a um quarto eixo ou a reforço do `AGENT//CORE`.

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
9. **O que falta é declarado, não escondido.** Projeto sem demo pública diz isso na etiqueta.
   Ausência de link só machuca quando a página finge que o link deveria existir. Honestidade
   declarada lê como confiança; disfarce lê como desculpa.

### 2.1 Anti-padrões — proibido

- ❌ Gradiente roxo→rosa em botão sobre fundo claro (o visual "AI startup 2023").
- ❌ **Orbitron** (ou similar) em texto corrido. Cyberpunk não é fonte de nave espacial.
- ❌ Matrix rain verde. Cor errada, referência errada.
- ❌ Glassmorphism genérico: branco 10% + blur 20px em tudo.
- ❌ Glitch em loop infinito em todo elemento. **Glitch é evento, não estado.**
- ❌ Emoji 🚀✨💡 em título, botão ou card.
- ❌ Ícones de biblioteca sem tratamento (traço fino cinza, estilo padrão).
- ❌ Preto puro `#000` e branco puro `#FFF`.
- ❌ Texto neon sobre fundo neon.
- ❌ Hero com "vídeo de fundo" genérico de cidade em timelapse.

Específicos da v4:

- ❌ **Barra de "nível de habilidade"** (`Python ▓▓▓▓░ 85%`). É informação vazia e todo
  entrevistador técnico sabe disso. A profundidade se diz em palavra (`nota` no arsenal, §9.5).
- ❌ **Métrica inventada** para preencher card. Sem medição → o campo não existe (§17.2).
- ❌ **Vocabulário de venda**: contrato, orçamento, proposta, escopo, prazo, "vamos trabalhar
  juntos". Se aparecer, é resíduo da v3 — remova.
- ❌ Esconder que um projeto não tem demo pública, ou linkar para um repositório privado que
  devolve 404.
- ❌ Depoimento de cliente. Não move recrutador (§9.9).

---

## 3. Cor

### 3.1 Filosofia

A base **não é preta** — é azul-violeta profundo, a cor do céu poluído refletindo a cidade.
O neon é saturado mas aparece em **traços finos e áreas pequenas**. O ciano entra em dose
homeopática: é ele que faz o magenta parecer realmente quente (contraste de temperatura).

Distribuição alvo por tela: **70% base escura · 20% texto/superfície · 8% neon de marca · 2% ciano**.

### 3.2 Tokens

Moram em `src/styles/tokens.css`. **Não adicione valor literal fora dali.**

Cores, fontes, escala, raio, layout e easing entram no bloco `@theme` do Tailwind v4 — daí os
nomes com prefixo `--color-*`, que é o que gera os utilitários (`bg-void`, `text-magenta`,
`border-hairline`). Gradientes, brilhos, sombras, durações e camadas ficam em `:root`, porque
não precisam virar utilitário.

```css
@theme {
  /* Base / superfícies */
  --color-void:        #07060d;  /* fundo absoluto: topo da página, footer */
  --color-asphalt:     #0b0a12;  /* fundo padrão de seção */
  --color-surface-1:   #110f1b;  /* card em repouso */
  --color-surface-2:   #191527;  /* card elevado */
  --color-surface-3:   #221c33;  /* input, chip, estado pressionado */
  --color-hairline:    #2e2740;  /* borda 1px padrão */
  --color-hairline-hi: #453a63;  /* borda em hover/foco */

  /* Texto */
  --color-text-hi:   #f5f2ff;  /* títulos */
  --color-text:      #cac3df;  /* corpo */
  --color-text-dim:  #8e86a8;  /* meta, legenda, placeholder */
  --color-text-mute: #807a9e;  /* meta discreta, numeração de setor — 4.87:1 ✓ */

  /* Neon de marca — a cor de cada eixo (§1.4) */
  --color-magenta: #ff2d8f;  /* SHIP//PROD · CTA, links, foco */
  --color-violet:  #b14bff;  /* LLM//OPS */
  --color-crimson: #ff3355;  /* AGENT//CORE · também o erro */

  /* Acentos de sinalização (uso ≤ 5% da tela) */
  --color-cyan:   #2bf5ff;  /* dados, status, detalhe de HUD */
  --color-sodium: #ff9f4a;  /* poste de rua, calor ao longe */

  /* Semânticos */
  --color-ok: #2bf5b0;  --color-warn: #ffc53d;  --color-error: #ff3355;
}

:root {
  --grad-brand: linear-gradient(100deg, #ff2d8f 0%, #b14bff 55%, #6a2bff 100%);
  --grad-heat:  linear-gradient(100deg, #ff9f4a 0%, #ff3355 50%, #ff2d8f 100%);
  --grad-sky:   radial-gradient(120% 80% at 50% 100%,
                  rgba(177,75,255,.28) 0%, rgba(255,45,143,.12) 35%, transparent 70%);
  --grad-fade:  linear-gradient(180deg, transparent, var(--color-asphalt) 85%);

  --glow-magenta: 0 0 12px rgba(255,45,143,.55), 0 0 38px rgba(255,45,143,.22);
  --glow-violet:  0 0 12px rgba(177,75,255,.55), 0 0 38px rgba(177,75,255,.22);
  --glow-cyan:    0 0 10px rgba(43,245,255,.50), 0 0 30px rgba(43,245,255,.18);

  --shadow-1: 0 1px 2px rgba(0,0,0,.6);
  --shadow-2: 0 8px 24px -8px rgba(0,0,0,.8);
  --shadow-3: 0 24px 64px -16px rgba(0,0,0,.9);
}
```

### 3.3 Regras de uso

| Regra | Detalhe |
|---|---|
| Texto de corpo | **Sempre** `--color-text`. Nunca neon, nunca gradiente. |
| Texto neon | Só em: kicker, número de estatística, **uma** palavra dentro do H1, letreiro decorativo. Máx. **2 ocorrências por viewport**. |
| CTA primário | Fundo magenta, texto `--color-void`. Contraste 5.79:1 ✓ |
| Link inline | Magenta + `text-underline-offset: 4px`. No hover ganha brilho sutil — nunca troca de cor. |
| Gradiente | Só em: barra de progresso, linha divisória, trilha do percurso e letreiro do hero. **Nunca** em fundo de seção inteira. |
| Ciano | Só indicadores de estado, coordenadas de HUD, etiqueta `No ar` e hover de item de dado. Nunca em CTA. |
| Vermelho | Eixo `AGENT//CORE` **e** erros. Como a cor se repete, o erro sempre vem com ícone + label: nunca depende só da cor. |
| Bordas | 1px `--color-hairline` é o padrão. Borda neon só em elemento focado, ativo ou em hover. |

### 3.4 Modo claro

**Não existe.** Dark-only por conceito — Night City não tem dia. `color-scheme: dark` declarado,
`<meta name="theme-color" content="#07060D">`. Não faça um modo claro meia-boca.

---

## 4. Tipografia

### 4.1 Famílias

Carregadas por `next/font` no `layout.tsx` e expostas como variável CSS:

```css
--font-display: var(--font-chakra),        "Archivo", ui-sans-serif, system-ui, sans-serif;
--font-sans:    var(--font-inter-tight),   "Inter",   ui-sans-serif, system-ui, sans-serif;
--font-mono:    var(--font-jetbrains),     "IBM Plex Mono", ui-monospace, monospace;
```

- **Chakra Petch** (600/700) — corte técnico japonês-industrial sem virar caricatura de ficção
  científica. H1/H2 e placas de neon.
- **Inter Tight** — corpo legível sobre fundo escuro, com tracking levemente negativo em
  tamanhos grandes.
- **JetBrains Mono** (500) — tudo que finge ser leitura de máquina: kicker, coordenada,
  numeração de setor, tag de stack, etiqueta de status, terminal.

Teto: **3 famílias e 4 pesos**, `font-display: swap`, subset latino.

### 4.2 Escala fluida

```css
--text-step--1: clamp(0.80rem, 0.77rem + 0.15vw, 0.88rem);  /* meta, legenda */
--text-step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem);  /* corpo */
--text-step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.50rem);  /* lead */
--text-step-2:  clamp(1.60rem, 1.40rem + 1.00vw, 2.25rem);  /* H3 */
--text-step-3:  clamp(2.10rem, 1.70rem + 2.00vw, 3.50rem);  /* H2 */
--text-step-4:  clamp(2.60rem, 1.70rem + 4.20vw, 5.25rem);  /* H1 */
--text-step-5:  clamp(3.50rem, 1.50rem + 9.00vw, 11.0rem);  /* display / letreiro */
```

> `--text-step-4` foi reduzido do valor de projeto (teto de 6rem) para **5.25rem**: no hero,
> `HUGO OTOCH` em duas linhas estourava a coluna em telas entre 1024 e 1280px.

### 4.3 Regras por elemento

| Elemento | Spec |
|---|---|
| H1 | display 700 · `--text-step-4` · `line-height:.92` · `letter-spacing:-.03em` |
| H2 | display 700 · `--text-step-3` · `lh 1.0` · `ls -.02em` |
| H3 | display 600 · `--text-step-2` · `lh 1.15` |
| Kicker | mono 500 · `--text-step--1` · UPPERCASE · `ls .22em` · ciano ou `--color-text-dim` |
| Corpo | sans 400 · `--text-step-0` · `lh 1.65` · `max-width: 68ch` |
| Lead | sans 400 · `--text-step-1` · `lh 1.5` · `max-width: 54ch` |
| Botão | mono 600 · `.875rem` · UPPERCASE · `ls .1em` |
| Número (stat) | display 700 · `--text-step-3/4` · `font-variant-numeric: tabular-nums` |
| Numeração de setor | mono · formato `[ 01 ]` · `--color-text-mute` |
| Etiqueta de status | mono · `.58rem` · UPPERCASE · `ls .14em` |

**Nunca** use uppercase em bloco com mais de 6 palavras.

### 4.4 Bilinguismo de ambiente

Night City é poliglota. Fragmentos em japonês como **textura**, sempre com `aria-hidden="true"`
e `opacity ≤ .35`, nunca carregando informação:

`夜の街` (cidade noturna) · `接続` (conexão) · `自動化` (automação) · `人工知能` (IA) · `稼働中` (em operação)

Todo o conteúdo real do site é em **português brasileiro**.

---

## 5. Layout, grid e espaçamento

### 5.1 Grid

```css
--container-site: 1280px;
--spacing-gutter: clamp(1.25rem, 4vw, 3rem);
/* 12 colunas no desktop · 6 no tablet · 4 no mobile */
```

- Conteúdo padrão ocupa **col 2–11**.
- Elementos "de rua" (letreiro, marquee, skyline, trilha do percurso) **sangram até a borda**.
- Assimetria obrigatória: texto em `col 2–7` + visual em `col 8–12`; na seção seguinte, inverta
  e desloque verticalmente.

### 5.2 Espaçamento (base 4px)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

```css
--spacing-section: clamp(6rem, 12vh, 10rem);  /* padding vertical de setor */
--spacing-bloco:   clamp(3rem, 6vh, 5rem);    /* entre blocos internos */
```

Respiro é o que separa "premium" de "template". Entre setores, **nunca menos que 96px no desktop**.

> **Armadilha, já paga:** não chame o segundo token de `--spacing-block`. No Tailwind v4 todo
> token `--spacing-X` gera também o utilitário `inline-X` (`inline-size`), então `--spacing-block`
> criava a classe `.inline-block` com `inline-size: 55px` — e tudo que usava `inline-block` para
> display era espremido. Por isso o nome em português: `--spacing-bloco`.

### 5.3 Raio e borda

```css
--radius-sm: 4px;   /* chip, tag */
--radius-md: 8px;   /* botão, input */
--radius-lg: 12px;  /* card, moldura de navegador */
--radius-xl: 20px;  /* painel grande */
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
  border: 1px solid var(--color-magenta);
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
    var(--color-surface-1);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  backdrop-filter: blur(10px) saturate(115%);
}
.panel:hover {
  border-color: color-mix(in oklab, var(--color-magenta) 45%, var(--color-hairline));
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
  50%  { text-shadow: -2px 0 var(--color-crimson), 2px 0 var(--color-cyan);
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
- **Relâmpago no máximo 0.32 de intensidade e em violeta**, não no branco azulado do original —
  clarão branco a 100% estoura a cena e foge da paleta. Os keyframes respeitam o limite de
  3 flashes por segundo (WCAG 2.3.1).
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
| Hover de botão | `translateY(-2px)` + `--glow-magenta` |
| Cursor custom | Ponto 8px + halo 32px, `mix-blend-mode: screen`, lerp .12; cresce sobre alvos clicáveis. Só em `(pointer: fine)`. |
| Marquee | Letreiro horizontal da stack, linear infinito, **pausa no hover** (`group-hover:[animation-play-state:paused]`) |
| Parallax | Camadas de fundo a `0.15–0.35` da velocidade do scroll. Máx. 3 camadas. |
| Trilha do percurso | Preenche conforme o scroll, acende marco a marco (§7.9) |

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
Componentes com lógica em JS (trilha, chuva, farol) checam `matchMedia` e **nascem no estado final**.

### 7.4 O letreiro do nome

Sequência do hero, em `<NomeNeon>`:

| Fase | Quando | O que acontece |
|---|---|---|
| Decodificação | 0 → ~460ms | Cada letra embaralha caracteres (katakana + dígitos + símbolos), trocando a cada 45ms, e trava no caractere real. Stagger de 45ms por letra. A letra continua **apagada**. |
| Tubo acendendo | ~600 → ~1100ms | Cascata de 60ms por letra: `color` e `text-shadow` entram por transição. Duas letras fixas hesitam (`falha-ao-acender`) antes de firmar. |
| Pisca raro | depois | Duas letras ganham `pisca-letra` em ciclos de 14s e 19s, com atrasos diferentes para as falhas nunca coincidirem. ~220ms de falha por ciclo. |

**Regras:**

- O servidor entrega o nome **completo e aceso**. A animação é progressive enhancement e só
  começa depois de montar — o nome está legível no primeiro paint, vale para SEO, e quem não
  tem JS vê o estado final.
- O nome real fica num `sr-only` dentro do `<h1>`; as letras animadas são `aria-hidden`.
  Leitor de tela lê "Hugo Otoch", não letra por letra.
- Sob `prefers-reduced-motion` o efeito não roda: o CSS já força `.letra` ao estado aceso.
- As letras que hesitam e as que piscam são **sempre as mesmas**. Aleatório a cada visita faria
  parecer defeito; fixo faz parecer uma placa com um tubo ruim.

### 7.5 A abertura

`<Abertura>` é a cortina de glitch que cobre o site por ~1,6s no carregamento. O tempo mora no
CSS (`--abertura: 1200ms`), não em timer de JS: se o JS demorar ou falhar, a cortina some do
mesmo jeito e nunca tranca o site atrás de uma tela preta.

> **Ela mora em `app/page.tsx`, não no `layout.tsx`.** Enquanto era do layout, rodava em toda
> rota — e desde que os cases ganharam página própria (§9.4) isso significava fazer o recrutador
> esperar a cortina de novo a cada case aberto. Quem depende de `aoFimDaAbertura` é só o
> `<NomeNeon>`, que também só existe no hero.

### 7.6 Farol no retrato

Um brilho diagonal atravessa a moldura do retrato a cada 9s, em ~1,2s. O elemento fica parado
86% do ciclo (`translateX(-130%)`) e só então cruza — o custo é um `transform` por ciclo, não
uma animação contínua. Sai sob `prefers-reduced-motion` (`[data-fx="farol"]`).

### 7.7 Revelação no scroll

Um `<RevealObserver>` só, montado no layout, observa tudo que tem `data-reveal`. As seções
continuam server components: elas só marcam o atributo e, opcionalmente, `--reveal-atraso`
para o stagger.

- Entra com `translateY(24px)` + `opacity 0 → 1`, dispara a **20% de visibilidade**, e para de
  observar: rolar de volta não re-anima.
- **Rede de segurança obrigatória:** num salto (link de âncora, hash na URL, End no teclado) o
  bloco vai de "abaixo da tela" direto para "acima da tela" e a razão de interseção **nunca
  cruza o threshold** — nenhum callback dispara e a seção ficaria invisível para sempre. Por
  isso há uma varredura em `scroll` que revela o que já passou. Sem ela, medido: só 2 de 21
  blocos apareciam ao abrir em `/#contato`.
- Sem JS (`@media (scripting: none)`) ou com movimento reduzido, tudo nasce visível.

### 7.8 Setor 01 — o que se move nas fachadas

| Efeito | Como |
|---|---|
| Cascata de entrada | Cada card roda `acende-fachada` (700ms) com stagger de **200ms**: sobe 26px, acende, **hesita duas vezes** e firma — é um tubo ligando, não um fade. O filete do topo varre junto, com o mesmo atraso. |
| Bullets de terminal | Cada item entra 620ms depois do card acender, 70ms entre linhas — o atraso soma o índice do card para não colidir com a cascata |
| Glifos vivos | `⟳` gira (8s, é literalmente um símbolo de ciclo), `◈` respira (3s), `◤` pulsa (4s) |
| Foco em hover | `.rua-de-neon:has(> li:hover) > li:not(:hover) > article` cai para 55% — a rua apaga e só a vitrine sob o cursor fica acesa |

> **Armadilha, já paga uma vez:** a transição do foco em hover **tem que mirar no `<article>`,
> nunca no `<li>`**. No `<li>` ela é um shorthand `transition` com especificidade `(0,1,1)`, que
> vence `[data-reveal]` `(0,1,0)` e **zera o `transition-delay`** — a cascata inteira colapsa em
> um fade simultâneo e a subida de 24px some, sem erro nenhum no console.

> **Nota de nomenclatura:** as classes continuam `.rua-de-neon` e `.fachada`, e os glifos
> continuam mapeados por `glifo-web` / `glifo-rpa` / `glifo-ia` no CSS. Os nomes vêm da v3,
> quando os eixos eram serviços. A ligação hoje é por **glifo**, não por serviço:
> `◤`→`glifo-web`, `⟳`→`glifo-rpa`, `◈`→`glifo-ia`.

### 7.9 A trilha do percurso

O mecanismo do setor 03 (§9.4), em `components/sections/Trajetoria.tsx`.

- Uma **linha de leitura** fica a 60% da altura da tela. A trilha preenche até ela, com um ponto
  de luz na ponta, e cada marco acende quando o preenchimento alcança o seu marcador: o de agora
  brilha, os de trás ficam acesos, os da frente esperam apagados. Rolando de volta, apagam na
  mesma ordem.
- O preenchimento vai por **variável CSS** (`--progresso`), sem re-render a cada quadro. Só a
  troca de marco passa pelo estado do React. As transições moram no `globals.css` (`.marco-*`).
- A cor de cada marco entra por `--marco-cor` / `--marco-rgb` inline, conforme o tipo. Magenta
  é só o padrão.
- Sob `prefers-reduced-motion`, a trilha nasce cheia e todos os marcos acesos.

> **Armadilha:** os dois `setAlcancado` do efeito passam por `requestAnimationFrame`. Chamar
> `setState` direto no corpo do efeito dispara render em cascata e o lint
> (`react-hooks/set-state-in-effect`) barra.

### 7.10 Progresso e parallax

- **Barra de progresso:** filete de 2px no topo com `--grad-brand`, em
  `animation-timeline: scroll(root block)`. CSS puro, sem listener.
  **Precisa de `--z-overlay`**, acima da nav: com o mesmo `--z-sticky` a navbar é pintada
  depois no DOM e engole o filete inteiro.
- **Parallax do cenário:** `[data-parallax]` com `animation-timeline: view(block)`.
  Névoa a 22%, skyline a 9% — as duas únicas camadas, dentro do teto de 3 do §7.2.
- **Setor ativo na nav:** `IntersectionObserver` com `rootMargin: -45% 0px -45%`, ou seja, a
  faixa de detecção é a fatia central da tela. O item ganha um ponto ciano. Num salto
  instantâneo pode não haver setor ativo — aceitável, o pior caso é nenhum ponto.

---

## 8. Componentes

### 8.1 Navbar — "Placa de rua"

- Fixa no topo, `backdrop-filter: blur(16px)`, fundo `rgba(7,6,13,.72)`,
  `border-bottom: 1px solid var(--color-hairline)`.
- Esquerda: marca (monograma `[HO]` + `HUGO OTOCH`). Centro: links em mono uppercase `ls .12em`.
  Direita: CTA **`FALAR COMIGO`**.
- Item ativo: ponto ciano de 4px antes do texto.
- Mobile: menu full-screen com fundo `--color-void`, itens em `--text-step-3`, stagger de 60ms.

Links: `Atuação · Projetos · Trajetória · Arsenal · Sobre` (de `nav` em `site.ts`).

### 8.2 Botões

| Variante | Spec |
|---|---|
| Primário | Fundo magenta, texto `--color-void`, `--radius-md`, `px-7 py-3.5`. Hover: `--glow-magenta` + `translateY(-2px)`. |
| Secundário | Transparente, `border: 1px solid var(--color-hairline-hi)`, texto `--color-text-hi`. Hover: borda magenta + fundo `rgba(255,45,143,.06)`. |
| Ghost | Só texto + seta `→`. Hover: seta desliza 4px e underline cresce. |

O componente embrulha o `<Link>` do Next e repassa o resto das props, então `target` e `rel`
funcionam — é assim que o botão `Baixar CV` abre o PDF em outra aba.

Estados obrigatórios: `:hover`, `:active`, `:focus-visible`
(`outline: 2px solid var(--color-cyan); outline-offset: 3px`), `:disabled` e `loading`.

### 8.3 Card de eixo — "Fachada"

```
┌─────────────────────────────────┐
│ ◈                      [ 01 ]   │  ← glifo neon na cor do eixo + índice mono
│                                 │
│ AGENT//CORE                     │  ← kicker mono, cor do eixo
│ Agentes de IA                   │  ← H3 display
│                                 │
│ Agentes que executam tarefas    │  ← vitrine, 2–3 linhas
│ reais, com ferramentas...       │
│                                 │
│ · LangChain · LangGraph         │  ← 4 bullets curtos em mono, --color-text-dim
│ · Tool use e pesquisa na web    │
│                                 │
│ VER OS PROJETOS  →              │  ← ghost, aponta para #projetos
└─────────────────────────────────┘
```

- Base `.panel` + `.chamfer`. No hover: a borda superior vira um filete de 2px na cor do eixo,
  e o glifo ganha vida (§7.8).
- Névoa radial da cor do eixo atrás do card (`opacity: 0 → 1` num gradiente a .16).
- O card do meio desce 40px no desktop (`lg:mt-10`) — é a assimetria que tira a cara de template.
- **O botão leva à prova, não ao contato.** Na v3 dizia `Pedir orçamento`.

### 8.4 Card de case — "Arquivo"

Substituiu o antigo card de projeto. Clicável inteiro, leva a `/projetos/[slug]`.

```
┌──────────────────────────────────────────────┐
│ ◈ AGENT//CORE          ◌ PRIVADO · SEM DEMO  │  ← eixo + etiqueta de status
│                                              │
│ Prospecto.sh                                 │  ← H3
│ Projeto autoral · Jul 2026 – Set 2026        │  ← mono, --color-text-dim
│ Prospecção de clientes com IA onde ela...    │  ← subtítulo, 1–2 linhas
│                                              │
│ ┌──────────────────────────────────────────┐ │  ← só no card de destaque:
│ │  ●●●  prospecto.sh                       │ │     BrowserFrame com a capa
│ │  [ captura da aplicação ]                │ │
│ └──────────────────────────────────────────┘ │
│ ──────────────────────────────────────────── │
│ 430+        230+        2                    │  ← números medidos, cor do eixo
│ TESTES      NICHOS      CHAMADAS             │
│                                              │
│ [PYTHON] [FLASK] [REACT 19] [+9]             │  ← chips de stack, máx. 6 + contador
│                                              │
│ ABRIR O CASE  →                              │
└──────────────────────────────────────────────┘
```

- `destaque: true` faz o card ocupar 2 colunas (`lg:col-span-2`) e ganhar a captura de capa.
- O bloco de números só existe quando há `numeros` medidos (§17.2).
- Filete do topo na cor do eixo acende no hover **e no `:focus-visible`** — o card é um link,
  precisa responder ao teclado igual.

**Etiqueta de status** — a peça que resolve "projeto sem link":

| Status | Rótulo | Cor | Significado |
|---|---|---|---|
| `no-ar` | `◉ No ar` | ciano | Publicado, com endereço aberto |
| `privado` | `◌ Privado · sem demo` | `--color-text-mute` | Autoral, roda local ou em VPS própria |
| `confidencial` | `◌ Confidencial` | `--color-text-mute` | De empresa ou cliente; só arquitetura |

Cada etiqueta tem `title` explicando o status por extenso.

### 8.5 Moldura de navegador — `<BrowserFrame>`

A contraparte do `<PhoneFrame>` para projeto que vive no desktop (painel, CRM, dashboard).
Barra de título com três pontos e o rótulo em mono, corpo em `aspect-[16/10]`.

> **Por que ela existe assim:** as capturas dos projetos autorais são de **página inteira**
> (1440×4309 numa delas), não de viewport. A moldura fixa a proporção e ancora a imagem no topo
> (`object-top`), mostrando a dobra em vez de espremer a página toda num retângulo ilegível.
> Com `rolar`, a captura desliza até `object-bottom` no hover (2,8s) para ver o resto sem sair
> da página — desligado sob `prefers-reduced-motion`.

### 8.6 Formulário — "Terminal de contrato"

```
> seu_nome:              ______________
> canal_de_contato:      ______________
> empresa_ou_time (opcional): _________
> mensagem:              ______________
                         [ ENVIAR MENSAGEM ]
```

- Labels em mono minúsculo com prefixo `>` em ciano.
- Input: fundo `--color-surface-3`, borda `--color-hairline`; no foco a borda vira magenta com glow.
- Erro: borda `--color-error` + mensagem com ícone `▲` (nunca só cor).
- Sucesso: painel trocado por `MENSAGEM RECEBIDA · RESPOSTA EM ATÉ 24H`.
- Server Action + Resend, com honeypot e rate limit de 3 envios por IP a cada 10 min.

**Saíram na v4:** o `select` de tipo de serviço e o grupo de faixa de orçamento. Entrou
`empresa`, opcional.

> **Armadilha, já paga:** o honeypot se chamava `empresa_site`. Com um campo `empresa` visível
> ao lado, o autofill do navegador passa a mirar nele — e um recrutador de verdade teria a
> mensagem engolida em silêncio, porque honeypot preenchido responde "sucesso" sem enviar.
> Agora se chama `url_referencia`.

### 8.7 Outros

- **Chip/Tag de stack:** mono `.62rem`, `rounded-full`, borda `--color-hairline`, texto dim.
- **Badge de status:** ponto pulsante `--color-ok` + `ABERTO A PROPOSTAS`.
- **Divisória:** linha 1px com `--grad-brand` e `mask-image` desvanecendo nas pontas.
- **Scrollbar:** trilha `--color-void`, polegar `--color-surface-3`, hover magenta, largura 8px.
- **Seleção:** `::selection { background: var(--color-magenta); color: var(--color-void); }`

---

## 9. Estrutura da página

Uma landing única (`/`) com âncoras + uma página de case por projeto (`/projetos/[slug]`,
estática via `generateStaticParams`).

| # | Setor | Âncora | Objetivo |
|---|---|---|---|
| 00 | `CHEGADA` | `#inicio` | Quem é, qual o recorte e qual o nível — em 5 segundos |
| 01 | `RUA DE NEON` | `#atuacao` | Os três eixos de atuação |
| 02 | `ARQUIVO` | `#projetos` | A prova: cases com decisão técnica |
| 03 | `PERCURSO` | `#trajetoria` | O caminho andado, com as sobreposições à mostra |
| 04 | `ARSENAL` | `#arsenal` | Profundidade técnica em 10 segundos |
| 05 | `OPERADOR` | `#sobre` | A pessoa e a ficha |
| 06 | `CONTATO` | `#contato` | Currículo, canais e ficha de contratação |
| — | `FIM DA RUA` | — | Footer |

A ordem é deliberada: **quem é → onde atua → prova → percurso → profundidade → pessoa → contato.**

### 9.1 Hero — `00 // CHEGADA`

Arranjo **"placa de neon"**: o nome é o letreiro, a foto é o retrato ao lado dele.

**Composição:** full-viewport, duas colunas (`1.35fr / 1fr`) a partir de `md`. Skyline em
silhueta no fundo com janelas acesas piscando; névoa violeta subindo da base; chuva fina na
camada da frente; asfalto escurecendo os últimos 30% da altura.

```
  HUGO                                  ╭─────────────╮
  OTOCH        ← H1, --text-step-5,     │             │
                 "OTOCH" em .neon       │   RETRATO   │
  ══════════════  ← filete --grad-brand │             │
                                        │             │
  Engenheiro de IA · Pleno              ╰─────────────╯
  Agentes de IA, LLMs e automação em      ~ reflexo ~
  produção · Vitória, ES · Remoto

  [ VER PROJETOS ]  [ BAIXAR CV → ]

  ═══════════════════════════════════════════════════════
  ◈ AGENT//CORE   ⟳ LLM//OPS   ◤ SHIP//PROD   ← faixa de rodapé
  │                                    VITÓRIA/ES · HUD
```

**Regras deste setor:**

- **O nome é o `<h1>`.** A função desce para um `<p>` em mono. Em portfólio pessoal a marca é
  a pessoa; o cargo aparece de novo no `<title>` e no JSON-LD, então nada se perde de SEO.
- **O hero é cartão de identificação.** Título, nível, recorte da especialidade e base ficam
  visíveis de imediato — é a informação que o recrutador procura primeiro. Na v3 havia só o
  título.
- **Os dois botões são `Ver projetos` e `Baixar CV`.** Recrutador quer o arquivo, não só a
  página. O CV abre em aba nova.
- **Retrato:** `public/otoch.png`, gerado por IA a partir de uma foto real com a luz do próprio
  site — key magenta, contraluz violeta, bokeh de cidade. Como já chega graduado, **o duotone de
  CSS fica desligado**: `grayscale` + `mix-blend-mode` por cima dobrariam a cor. Ficam só a
  moldura chanfrada, a vinheta e a scanline.
- **Não use `quality` custom no `<Image>` do retrato.** Com `quality={90}` o otimizador do
  Next 16.3.4 pendura ao gerar o webp de 384px desta imagem: a resposta nunca fecha e o retrato
  fica eternamente carregando. O padrão 75 resolve e não muda nada visível nesta escala.
- **Sem foto?** O mesmo componente cai para a placa de neon com o monograma `HO`. É decisão de
  arte, não buraco: nunca use avatar genérico ou foto de banco.
- **Faixa de rodapé do hero** (só a partir de `md`): a linha de eixos, o indicador de scroll e o
  HUD encostam na base da primeira tela, e o conteúdo centraliza no espaço que sobra. Abaixo de
  `md` a faixa some — o hero empilha, fecha em exatos 100svh no celular, e os eixos aparecem
  completos na seção seguinte.
- Mobile: o retrato vem **antes** do nome, em escala de crachá (`w-40`). O reflexo some.
- HUD: `VITÓRIA/ES · LAT -20.32 LON -40.34 · 02:47` (relógio real do visitante).

Logo abaixo do hero, **marquee** full-bleed em display outline com a stack —
`Agentes de IA · LangGraph · RAG · Python · Django · Celery · Docker · Next.js`. Na v3 eram os
serviços vendidos.

### 9.2 Atuação — `01 // RUA DE NEON`

- Kicker `[ 01 ] RUA DE NEON` · H2 `Onde eu atuo`.
- Três cards §8.3 em linha no desktop, o do meio deslocado 40px para baixo.
- Atrás dos cards, névoa radial na cor do card em hover.

### 9.3 Projetos — `02 // ARQUIVO`

H2 `O que eu já construí`. Grid de dois por linha, com o case de destaque ocupando a linha inteira.

**A inversão da v4, e a razão dela.** Os projetos de empresa são confidenciais: os cases ali
ficam obrigatoriamente no nível de arquitetura. Os **projetos autorais são o único lugar sem
NDA** — neles dá para abrir arquitetura, decisão de prompt, estratégia de chunking, custo e
código. Então eles não são preenchimento: são a vitrine técnica de verdade, e a ausência de link
público deixa de importar quase totalmente.

| Slug | Eixo | Status | Natureza |
|---|---|---|---|
| `prospecto-sh` | `AGENT//CORE` | privado | autoral · **destaque** |
| `plataforma-ia-cobrancas` | `AGENT//CORE` | confidencial | profissional |
| `pelada-sofredores` | `SHIP//PROD` | privado | autoral |
| `agentes-autonomos-langgraph` | `AGENT//CORE` | confidencial | cliente |
| `sigamaes-ufes` | `SHIP//PROD` | confidencial | acadêmico |
| `dashboards-etl-django` | `SHIP//PROD` | confidencial | profissional |

**Faixa `02b // FORA DO EIXO`.** Abaixo do grid, separada por uma régua, a faixa de sites de
cliente no ar (`sentir-terapias`, `pet-park`), no `<ProjetosRolagem>` com carrossel de celular.
Ficam fora do grid de propósito: provam entrega de frontend, mas web não é o eixo da candidatura
e competiria pela atenção. A faixa tem tema magenta fixo — na v3 a cor vinha do serviço do
projeto, e serviço deixou de existir.

**Regras da vitrine:** texto só com o que dá para verificar no próprio site. **Nunca use tela com
placeholder visível**: no Pet Park, as seções "mochilinha" e "serviços" ficaram de fora porque
mostram `[O_QUE_VAI_NA_MOCHILINHA]` e `[DETALHES_ATIVIDADES]` no ar. O carrossel anda sempre com
update funcional (`setAtivo(a => …)`): com `ativo + 1` lido do render, dois cliques rápidos
andavam uma tela só.

### 9.4 Página de case — `/projetos/[slug]`

A resposta para "projeto que não tem link". Um link clicável prova que a coisa existe; um case
bem escrito prova que o autor **sabe por que construiu daquele jeito**, que é o que diferencia
candidato em entrevista técnica.

Ordem da página, e ela importa:

1. **Cabeçalho** — eixo, etiqueta de status, título, origem · período, subtítulo.
2. **Números medidos**, quando existirem.
3. **O problema / O que eu construí**, em duas colunas.
4. **Decisões e por quê** — grid de cards numerados. *Vem antes das telas, de propósito.*
5. **As telas** — `<BrowserFrame>` por captura, com legenda. A nota sobre dados fictícios só
   aparece para projeto autoral.
6. **No celular** — `<PhoneCarousel>`, quando houver captura mobile.
7. **Stack** completa em chips.
8. **Origem do código**, quando o projeto parte de código de outra pessoa.

> **Atribuição é obrigatória e é sinal positivo.** O `prospecto-sh` é fork evoluído de um projeto
> MIT de terceiro. Omitir isso seria risco (o recrutador checa o GitHub) e mentira; declarar,
> dizendo exatamente o que foi construído por cima, mostra que a pessoa lê e estende código
> alheio. O campo `atribuicao` existe para isso.

### 9.5 Percurso — `03 // PERCURSO`

H2 `O caminho até aqui`. A trilha de §7.9, alimentada por `trajetoria` em `content/percurso.ts`.

**Dois trilhos, e por quê.** Os períodos **se sobrepõem de verdade**: o SigAMAES (fev/25–jan/26)
roda dentro da Seer (ago/25–mar/26), e o freelance (jan/24–ago/25) cobre o início do SigAMAES.
Uma linha única acendendo em sequência daria a entender que uma coisa terminou quando a outra
começou — pareceria erro ou, pior, invenção. Então:

- **Trilho da esquerda:** `emprego` (magenta).
- **Trilho da direita:** `autoral` (crimson), `academico` e `formacao` (violeta).
- No celular os dois viram um trilho à esquerda — duas colunas não cabem. A cor do marcador
  continua distinguindo o tipo, e há legenda no topo.

Assim a sobreposição deixa de ser bug e vira argumento: mostra que houve emprego remoto e
liderança técnica de projeto acadêmico ao mesmo tempo.

**Ordem decrescente.** A narrativa "a trilha acende até hoje" seria mais bonita em ordem
crescente, mas recrutador raramente chega ao fim da seção: o cargo atual tem que ser o primeiro
item, marcado `● agora`.

**Cada marco traz** período, função, organização · local, uma **barra de duração** proporcional
aos meses (é ela que torna a sobreposição legível), 2–3 marcas do currículo, chips de stack e,
quando existe, link `Ver o projeto →` para o case correspondente. Esse link é o que amarra
percurso e prova num circuito só.

> As datas aqui têm precisão de **mês** porque a trilha mede duração. Data vaga em site de
> candidato levanta suspeita.

### 9.6 Arsenal — `04 // ARSENAL`

Grid denso de tags agrupadas. Sem barras de "nível de habilidade" (§2.1).

Ordem dos grupos — **a ordem do arsenal é a ordem da candidatura**:

```
IA & AGENTES          ← "Onde eu trabalho hoje, todos os dias."
BACKEND & ARQUITETURA ← "A base que sustenta tudo acima."
DADOS & INFRA         ← "Entrego o que construo rodando, não em branch."
AUTOMAÇÃO / RPA       ← "De onde eu vim para a IA."
FRONTEND              ← "O suficiente para entregar inteira a interface do que eu construo."
```

Cada grupo tem um campo `nota`: é assim que a profundidade é dita, em palavra e sem inflar.
Honestidade de nível evita entrevista ruim e, em vaga de pleno, conta a favor.

### 9.7 Sobre — `05 // OPERADOR`

H2 `Quem assina o código`. Ficha de identidade ao lado de dois parágrafos em primeira pessoa.

```
OPERADOR     HUGO OTOCH
FUNÇÃO       Engenheiro de IA · Pleno
BASE         Vitória, Espírito Santo · Remoto
FORMAÇÃO     Bacharelado em Eng. de Computação — UFES · concluído em fev/2026
IDIOMAS      Português (nativo) · Inglês (B1)
STATUS       ● Aberto a propostas
```

Os parágrafos dizem o que a pessoa resolve e como trabalha — teste antes de confiar, custo
medido em vez de estimado, e a regra de só colocar modelo onde ele agrega. **Não repetem a
trajetória**: ela tem setor próprio agora. Abaixo, link para o LinkedIn.

### 9.8 Contato — `06 // CONTATO`

H2 `Vamos conversar.` Formulário-terminal (§8.6) à esquerda; à direita, canais diretos como
lista de "frequências" — **e-mail, LinkedIn, GitHub, Currículo (PDF)** — seguidos da ficha:

```
NÍVEL        Pleno
FOCO         Engenheiro de IA
MODALIDADE   CLT ou PJ
LOCAL        Remoto · Vitória/ES
INGLÊS       Intermediário (B1)
FORMAÇÃO     Eng. de Computação — UFES · fev/2026
```

Isso ocupa o lugar das antigas microgarantias comerciais (`orçamento sem compromisso`,
`NDA se precisar`). É o que um recrutador precisa conferir antes de abrir conversa.

### 9.9 O setor que não está na página

O **Muro** (`#muro`) — depoimentos colados por clientes, com convite assinado por e-mail — está
construído e fora da página. Depoimento de cliente não move recrutador. O que moveria é
**recomendação de colega ou tech lead**, e a infra de convite serve igual para isso: só muda o
público. Os arquivos (`Muro.tsx`, `Lambe.tsx`, `LambeNovo.tsx`, `content/depoimentos.ts`,
`lib/convite.ts`, `actions/depoimento.ts`) continuam no repositório.

> Ele ainda carrega `numero="06"`, que hoje colide com o Contato. Se voltar, renumere.

### 9.10 Footer — `FIM DA RUA`

Fundo `--color-void`. Letreiro gigante em outline com `HUGO OTOCH` cortado pela borda inferior.
Links secundários e a linha `© 2026 HUGO OTOCH · VITÓRIA/ES · CONSTRUÍDO EM NIGHT CITY`.

---

## 10. Voz e microcopy

**Regra:** frases curtas. Verbo no presente. Número sempre que possível. Zero superlativo.

| Contexto | ✅ Escreva | ❌ Evite |
|---|---|---|
| CTA principal | `FALAR COMIGO` | `Entre em contato` · ~~`ABRIR CONTRATO`~~ (v3) |
| CTA do hero | `VER PROJETOS` · `BAIXAR CV →` | `Saiba mais` |
| CTA de case | `ABRIR O CASE →` | `Ver detalhes` |
| Projeto sem demo | `◌ PRIVADO · SEM DEMO` | esconder, ou linkar repo privado |
| Vazio/erro | `SINAL PERDIDO. Tente de novo.` | `Ops! Algo deu errado 😅` |
| 404 | `SETOR NÃO MAPEADO` + link de volta | `Página não encontrada` |
| Sucesso | `MENSAGEM RECEBIDA · RESPOSTA EM ATÉ 24H` | `Mensagem enviada com sucesso!` |
| Sobre um eixo | `A parte que separa demo de sistema.` | `Soluções inovadoras em IA` |
| Sobre si | `teste antes de confiar, custo medido` | `apaixonado por tecnologia` |

O vocabulário de Night City (`operador`, `setor`, `arsenal`, `percurso`, `arquivo`) fica na
**navegação e nos rótulos**. A explicação técnica é sempre em português claro.

**Palavras banidas na v4:** contrato, orçamento, proposta, escopo, prazo, cliente (quando se
refere ao leitor), contratar, "vamos trabalhar juntos".

---

## 11. Acessibilidade

Não é opcional. Neon + fundo escuro é o cenário mais fácil de errar.

- **Contraste:** corpo ≥ 4.5:1, títulos ≥ 3:1. Medidos sobre `--color-asphalt`:
  `--color-text` 11.6:1 · `--color-text-dim` 5.74:1 · `--color-text-mute` 4.87:1 ·
  `--color-text-hi` 17.8:1 · magenta 5.65:1 · ciano 14.6:1. Placeholder usa `--color-text-dim`
  (4.78:1 sobre `--color-surface-3`). Neon **nunca** em texto pequeno sem verificar.
- **Foco visível:** `outline: 2px solid var(--color-cyan); outline-offset: 3px` em tudo que é
  focável. O card de case é um link: o filete e a borda respondem a `:focus-visible` igual ao hover.
- **Cor não é o único sinal:** erro, sucesso e etiqueta de status sempre têm ícone ou texto.
- **Semântica:** um `<h1>` por página, hierarquia sem pular níveis, `<nav>`/`<main>`/`<footer>`.
  Na página de case, o `<h1>` é o nome do projeto.
- **Decoração:** grão, scanline, chuva, kanji, glifos e barras de duração → `aria-hidden="true"`
  e `pointer-events: none`.
- **Skip link:** `Pular para o conteúdo` como primeiro elemento focável.
- **Movimento:** respeite `prefers-reduced-motion` (§7.3). Flicker com amplitude baixa e nunca
  acima de 3 flashes por segundo.
- **Alvos de toque:** mínimo 24×24px (WCAG 2.5.8 AA); 44×44px nos controles principais.
- **Alt text real:** cada captura de projeto descreve o que está na tela, não "screenshot do
  projeto". Elas são a prova — se a imagem não carregar, o alt tem que sustentar o argumento.
- **Teste:** navegação completa só com teclado + Lighthouse a11y ≥ 95.

---

## 12. Performance

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
- Anime apenas `transform`/`opacity`. `will-change` só durante a animação.
- Canvas e partículas: pause fora da viewport, desligue abaixo de 768px e com
  `hardwareConcurrency <= 4`.
- **Imagens de projeto em WebP**, convertidas antes de entrar em `public/` — as 17 capturas
  saíram de 7,6MB em PNG para 2,1MB. `sizes` sempre declarado; `priority` só na primeira
  captura do case e na capa do card de destaque.
- Fontes via `next/font`, `font-display: swap`.

---

## 13. Implementação

### 13.1 Stack

```
Next.js 16.3.4 (App Router) + TypeScript
Tailwind CSS v4 (tokens via @theme)
Motion para reveals pontuais; o resto é CSS puro e IntersectionObserver
Formulário: Server Action + Resend + honeypot + rate limit
Currículo: pdfkit, gerado por script (§13.5)
```

### 13.2 Estrutura de pastas

```
scripts/
  convite.mjs             ← gera link de convite do muro
  curriculo.mjs           ← gera public/hugo-otoch-engenheiro-de-ia.pdf
src/
  app/
    layout.tsx            ← fontes, metadata, JSON-LD, overlays globais
    page.tsx              ← landing: Abertura + os sete setores
    not-found.tsx
    projetos/[slug]/page.tsx   ← página de case (SSG)
    actions/              ← contato.ts, depoimento.ts
    opengraph-image.tsx · twitter-image.tsx · sitemap.ts · robots.ts
  components/
    layout/    Nav, Footer, Abertura
    sections/  Hero, Atuacao, Projetos, ProjetosRolagem, Percurso,
               Trajetoria, Arsenal, Sobre, Contato, Muro
    ui/        Button, SectionHeading, BrowserFrame, PhoneFrame, PhoneCarousel,
               FormularioContrato, Marquee, NomeNeon, Retrato, Hud, StatusBadge, Lambe
    fx/        Grain, Scanlines, Rain, Fog, Skyline, RevealObserver
  content/     site.ts, projetos.ts, percurso.ts, depoimentos.ts
  styles/      tokens.css, globals.css
  lib/         utils.ts, og.tsx, email.ts, convite.ts, *-tipos.ts
public/
  otoch.png · hugo-otoch-engenheiro-de-ia.pdf
  projetos/<slug>/*.webp
```

### 13.3 Conteúdo

`src/content/` é a fonte de verdade (§17). Quem mexe no site mexe ali primeiro.

| Arquivo | O que guarda |
|---|---|
| `site.ts` | Identidade, `eixos`, `canais`, `contratacao`, `nav` |
| `projetos.ts` | `projetos` (os seis cases) e `vitrines` (os sites de cliente) |
| `percurso.ts` | `trajetoria` (os marcos) e `arsenal` |
| `depoimentos.ts` | Muro, fora da página |

### 13.4 SEO e metadados

- `title`: `Hugo Otoch — Engenheiro de IA`
- `description`: `Engenheiro de IA pleno: agentes, LLMs e automação em produção, com o backend
  que sustenta. Engenharia de Computação pela UFES. Vitória/ES e remoto.` (≤ 155 caracteres)
- OG image 1200×630 no tema, com os glifos dos três eixos. O Satori não cobre `◤ ⟳ ◈` na fonte
  embarcada, então no OG eles viram blocos coloridos.
- **JSON-LD só `Person`.** O nó `ProfessionalService` da v3 saiu: declarar um negócio que vende
  serviço é sinal errado para quem busca vaga. O `Person` carrega `jobTitle`, `alumniOf`,
  `knowsAbout` (IA primeiro), `knowsLanguage`, `hasCredential` e `seeks`.
- Cada case tem `canonical` e OG próprios, e entra no `sitemap.xml` — é ali que mora a prova dos
  projetos sem demo, então precisa ser indexável.

### 13.5 O currículo

`npm run curriculo` gera `public/hugo-otoch-engenheiro-de-ia.pdf` a partir de
`scripts/curriculo.mjs`, onde o conteúdo mora.

**Por que existe:** o PDF era compilado em LaTeX no Overleaf, sem fonte versionado no
repositório. O resultado era o site dizendo "Engenheiro de IA" e o arquivo que o recrutador
baixava dizendo "Desenvolvedor Backend", sem como corrigir um sem reabrir o outro em outro lugar.

**Regras do documento:**
- **Uma página é requisito, não preferência.** O script conta as páginas antes de fechar o
  arquivo e **falha com erro** se passar de uma. Sem essa trava ele já produziu um PDF de cinco
  páginas em silêncio, porque o pdfkit pagina sozinho quando o conteúdo transborda. Se precisar
  de espaço, baixe `P` antes de mexer nas margens.
- Experiência vem antes de liderança: o cargo atual é de IA e é ele que precisa aparecer primeiro.
- Times no lugar da Computer Modern do LaTeX — é a serifada mais próxima entre as 14 padrão do
  PDF, que dispensam embutir arquivo de fonte.
- Headline de IA sob o nome, e `Keywords` no metadado: sem isso, filtro de ATS não encontra o
  perfil, porque todos os cargos antigos se chamam "Desenvolvedor".

---

## 14. Identidade visual

### 14.1 Monograma

Letreiro vertical estilo Kabukicho: as letras **H O** empilhadas dentro de um retângulo
chanfrado, com tubo de neon magenta (§6.3) e um filete ciano na base. Na horizontal, a marca
completa é `[HO] HUGO OTOCH`. Funciona em 16px (favicon: só o `[H]` com o corte diagonal).

### 14.2 Assets

| Asset | Estado |
|---|---|
| Skyline | SVG em camadas de profundidade — feito |
| Texturas | Grão SVG (§6.6), vinheta, scanline — feito |
| Retrato | `public/otoch.png`, tratado na luz do site — feito |
| Capturas de projeto | WebP em `public/projetos/<slug>/` — feito |
| Currículo PDF | Gerado por script (§13.5) — feito |
| OG image | 1200×630, gerada em runtime por `lib/og.tsx` — feito |
| Ícones | Traço 1.5px, cantos retos, estilo HUD — **desenhados**, não baixados cru |

### 14.3 Referências

Cyberpunk 2077 (HUD, sinalização), Blade Runner 2049 (névoa, escala, vermelho de sódio),
Ghost in the Shell (tipografia bilíngue), Kowloon/Shinjuku à noite (densidade de placas),
Ghostrunner (contraste magenta/ciano).

---

## 15. Checklist de QA

**Design**
- [ ] Nenhuma tela tem mais de 2 elementos com glow simultâneos
- [ ] Texto de corpo em nenhum lugar usa neon ou gradiente
- [ ] Pelo menos 3 seções quebram a simetria
- [ ] Espaçamento entre setores ≥ 96px no desktop
- [ ] Os 3 eixos mantêm cor+glifo consistentes em 100% das aparições

**Conteúdo**
- [ ] Nenhuma palavra banida do §10 sobrou no site
- [ ] Todo projeto declara o status (no ar / privado / confidencial)
- [ ] Todo número exibido tem medição por trás (§17.2)
- [ ] Projeto derivado de código de terceiro declara a origem
- [ ] O PDF do currículo diz a mesma coisa que o site sobre cargo e nível
- [ ] Nenhum alt text é "screenshot do projeto"

**Técnico**
- [ ] `npm run curriculo` passa (a trava de uma página é parte do teste)
- [ ] 60fps no scroll (DevTools > Performance, CPU 4× throttle)
- [ ] Lighthouse ≥ 90 perf / ≥ 95 a11y em mobile
- [ ] `prefers-reduced-motion` testado — trilha nasce cheia, site continua bonito
- [ ] Navegação completa por teclado, incluindo entrar num case e voltar
- [ ] Responsivo real em 360 / 768 / 1024 / 1440 / 1920
- [ ] Trilha do percurso colapsa para um trilho abaixo de `md`
- [ ] Formulário: validação, erro, sucesso, honeypot e rate limit funcionando
- [ ] Abertura roda só na home, nunca ao abrir um case
- [ ] Sem erro no console e sem CLS ao carregar as fontes

---

## 16. Estado atual

**Construído:** tokens e base (§3–§7), FX de cenário, nav, footer, os sete setores da landing,
as seis páginas de case, a trilha do percurso em dois trilhos, o gerador do currículo e o muro
de depoimentos (fora da página).

**Aberto:**

- `Modalidade: "CLT ou PJ"` na ficha de contratação é **suposição**, marcada com `TODO` em
  `content/site.ts`. Confirme ou corrija.
- `RESEND_API_KEY` no `.env.local`: sem a chave o formulário valida mas não envia — ele
  direciona para o e-mail.
- **`RAG` não tem case que o prove.** Aparece no arsenal e no marquee porque está no currículo,
  mas nenhum dos dois projetos autorais usa RAG, embeddings ou vector store. O próximo projeto
  autoral deveria fechar esse buraco.
- **Perguntas que um tech lead vai fazer e o site ainda não responde:** qual vector store, como
  se avalia agente e retrieval (eval set, tracing), e como se controla custo, latência e token
  em produção. O `prospecto-sh` responde parte da terceira. É a informação mais valiosa que
  falta.
- Lint: `ProjetosRolagem.tsx` tem um `setState` síncrono em efeito, anterior à v4.
- FX opcionais: cursor custom e parallax de §7.2.

---

## 17. Regra de conteúdo

A fonte de verdade do conteúdo é **`src/content/`**, não este documento. O que segue aqui é a
**regra** que governa o que pode entrar lá.

### 17.1 A regra

Nenhum texto do site pode afirmar algo que não seja verificável. Na prática:

- **Experiência** sai do currículo real, com datas em precisão de mês.
- **Stack de projeto** sai do código do projeto, não de memória.
- **Período de projeto autoral** sai do git do próprio repositório.
- **Número** só entra quando foi medido, e o campo é opcional justamente para poder não existir.
- **Projeto de empresa ou cliente** é descrito no nível de arquitetura, sem nome de cliente e
  sem dado de operação.
- **Código de terceiro** é creditado, dizendo o que foi construído por cima.
- **Captura de tela** só vai ao ar com dado fictício. As dos dois projetos autorais vêm de seed
  de demonstração — antes de publicar qualquer captura nova, confira nome, valor, e-mail e saldo
  na tela.

### 17.2 Números que estão no ar

| Número | Onde | Fonte |
|---|---|---|
| `430+` testes · `230+` nichos · `2` chamadas por roteiro | case `prospecto-sh` | README do projeto |
| `~19k` linhas · `62` testes · `0,25` de desnível médio | case `pelada-sofredores` | README do projeto |
| Durações em meses | trilha do percurso | calculadas das datas do currículo |

❌ **Não publique** percentual de ganho (`-73% de tempo`, `+41% de conversão`) sem medição
documentada. O card de case prevê a faixa de números — deixe-a inexistente quando o número não
existir, em vez de preenchê-la com estimativa.

### 17.3 Nota de posicionamento

A evidência mais forte é **agentes, LLM em produção e o backend que sustenta**. Frontend aparece
em Next.js, React/TypeScript e Angular, e nos dois sites de cliente entregues — por isso a faixa
`02b` existe, e por isso ela fica fora do grid principal.

Machine Learning clássico — treino, métrica de modelo, MLOps — **não está no currículo e não
entra no site** enquanto não houver prova. "AI Engineer" e "ML Engineer" são vagas diferentes;
anunciar as duas faz o recrutador técnico desconfiar das duas.

**Este portfólio é parte da prova.** É a primeira coisa que um tech lead vai abrir. Trate-o como
entrega: performance, acessibilidade e o checklist do §15 valem mais aqui que em qualquer outro
projeto.

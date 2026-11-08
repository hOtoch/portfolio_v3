import { arsenal, baldeacoes, trajetoria, type Baldeacao, type Linha, type LinhaId } from "@/content/percurso";

/**
 * design.md §9.6 — a geometria do mapa de metro do Arsenal.
 *
 * Tudo aqui e calculado no servidor, uma vez: coordenadas no espaco do
 * viewBox (LARGURA x ALTURA), o `d` de cada linha com cantos arredondados e o
 * atraso de cada estacao para ela acender quando o trilho chega nela.
 *
 * O desenho e feito a mao, de proposito: Python e o no de onde saem tres
 * linhas (Backend para a direita, IA para cima, Automacao para baixo); a IA
 * forma um arco apoiado no Backend e desce em Celery; Dados e Frontend
 * descem das baldeacoes em PostgreSQL e Spring Boot. As estacoes se espalham
 * pelo espaco de cada trecho, entao a quantidade pode mudar em `percurso.ts`;
 * o que nao pode mudar sem mexer aqui e a POSICAO das baldeacoes (Python e
 * Celery nas pontas do Backend, as outras duas nos indices de `DESCIDA_*`).
 */

export const LARGURA = 1200;
export const ALTURA = 580;

type Pt = { x: number; y: number };

/**
 * De que lado do ponto o rotulo fica. `cima`/`baixo` sao girados a 40°;
 * `sob` e horizontal, logo abaixo e a direita do ponto.
 */
export type Lado = "cima" | "baixo" | "esquerda" | "direita" | "sob";

export type Estacao = {
  nome: string;
  x: number;
  y: number;
  lado: Lado;
  /** Linhas que param aqui. Mais de uma = baldeacao. */
  linhas: readonly LinhaId[];
  /** Linha dona do rotulo (a primeira a chegar). */
  linha: LinhaId;
  /** ms desde a revelacao ate o trilho chegar aqui. */
  atraso: number;
};

export type Trilho = {
  linha: Linha;
  d: string;
  /** ms ate o trilho comecar a se desenhar. */
  atraso: number;
  duracao: number;
  /** Onde fica a placa "L1" da linha. */
  placa: Pt;
};

/* ── A grade ───────────────────────────────────────────────────────────── */

const X0 = 90; // Python
const XC = 1078; // Celery
const X_FIM = 1100; // onde a linha de Dados termina

const Y_IA = 125;
// 165 de arco: "Django REST Framework" girado encostava na IA em 1024px com 140
const Y_BACK = 290;
const Y_FRONT = 380;
const Y_DADOS = 450;
const PASSO_V = 56; // Automacao desce na vertical, rotulo na horizontal
const PASSO_FRONT = 110;

/** Indices, no Backend, de onde Dados e Frontend descem. */
const DESCIDA_DADOS = 2;
const DESCIDA_FRONT = 8;

const RAIO = 18;
/** px do viewBox por ms — velocidade constante do trilho acendendo. */
const VELOCIDADE = 0.75;

/* ── Rotas: os vertices de cada linha e onde ficam as estacoes ─────────── */

type Rota = {
  vertices: Pt[];
  estacoes: Pt[];
  lado: Lado;
  placa: Pt;
  /** Estacao (do Backend) de onde esta linha parte, para herdar o atraso. */
  parteDe?: string;
};

const qtd = (id: LinhaId) => arsenal.find((l) => l.id === id)!.itens.length;

/** `n` pontos entre `a` e `b`, sem as pontas. */
const entre = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * (i + 1)) / (n + 1));

function rotas(): Record<LinhaId, Rota> {
  const nBack = qtd("backend");
  const xB = (i: number) => X0 + (i * (XC - X0)) / (nBack - 1);
  const pg = { x: xB(DESCIDA_DADOS), y: Y_BACK };
  const desce = { x: xB(DESCIDA_FRONT), y: Y_BACK };

  // Dados: a primeira estacao e a baldeacao; as outras se espalham ate X_FIM.
  const nDados = qtd("dados") - 1;
  const passoDados = (X_FIM - 40 - pg.x) / nDados;

  const nFront = qtd("frontend") - 1;
  const xFrontFim = desce.x - nFront * PASSO_FRONT;

  return {
    ia: {
      vertices: [
        { x: X0, y: Y_BACK },
        { x: X0, y: Y_IA },
        { x: XC, y: Y_IA },
        { x: XC, y: Y_BACK },
      ],
      estacoes: [
        { x: X0, y: Y_BACK },
        ...entre(X0, XC, qtd("ia") - 2).map((x) => ({ x, y: Y_IA })),
        { x: XC, y: Y_BACK },
      ],
      lado: "cima",
      placa: { x: X0 - 44, y: Y_IA },
    },
    backend: {
      vertices: [
        { x: X0, y: Y_BACK },
        { x: XC, y: Y_BACK },
      ],
      estacoes: Array.from({ length: nBack }, (_, i) => ({ x: xB(i), y: Y_BACK })),
      lado: "cima",
      placa: { x: XC, y: Y_BACK + 72 }, // abaixo do rotulo horizontal de Spring Boot
    },
    dados: {
      vertices: [pg, { x: pg.x, y: Y_DADOS }, { x: X_FIM, y: Y_DADOS }],
      estacoes: [pg, ...Array.from({ length: nDados }, (_, i) => ({ x: pg.x + (i + 1) * passoDados, y: Y_DADOS }))],
      lado: "baixo",
      placa: { x: X_FIM + 32, y: Y_DADOS },
      parteDe: arsenal.find((l) => l.id === "backend")!.itens[DESCIDA_DADOS],
    },
    automacao: {
      vertices: [
        { x: X0, y: Y_BACK },
        { x: X0, y: Y_BACK + (qtd("automacao") - 1) * PASSO_V + 18 },
      ],
      estacoes: Array.from({ length: qtd("automacao") }, (_, i) => ({ x: X0, y: Y_BACK + i * PASSO_V })),
      lado: "direita",
      placa: { x: X0, y: Y_BACK + (qtd("automacao") - 1) * PASSO_V + 46 },
    },
    frontend: {
      vertices: [desce, { x: desce.x, y: Y_FRONT }, { x: xFrontFim - 26, y: Y_FRONT }],
      estacoes: [desce, ...Array.from({ length: nFront }, (_, i) => ({ x: desce.x - (i + 1) * PASSO_FRONT, y: Y_FRONT }))],
      lado: "cima",
      placa: { x: xFrontFim - 58, y: Y_FRONT },
      parteDe: arsenal.find((l) => l.id === "backend")!.itens[DESCIDA_FRONT],
    },
  };
}

/**
 * Rotulo fixo das baldeacoes, pela posicao no mapa: as pontas do arco ficam
 * na horizontal para fora; a descida do Frontend fica na horizontal, na faixa
 * vazia entre o Backend e Dados — girado para cima o nome encostaria na IA
 * em 1024px, e girado para baixo, em Dados.
 */
function ladoDaBaldeacao(p: Pt, xFront: number): Lado | undefined {
  if (p.y !== Y_BACK) return undefined;
  if (p.x === X0) return "esquerda";
  if (p.x === XC) return "direita";
  if (p.x === xFront) return "sob";
  return undefined;
}

/* ── Geometria ─────────────────────────────────────────────────────────── */

const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

/** Polilinha com os cantos arredondados por uma curva quadratica. */
function caminho(v: Pt[]): string {
  let d = `M ${v[0].x} ${v[0].y}`;
  for (let i = 1; i < v.length - 1; i++) {
    const [a, b, c] = [v[i - 1], v[i], v[i + 1]];
    const r1 = Math.min(RAIO, dist(a, b) / 2);
    const r2 = Math.min(RAIO, dist(b, c) / 2);
    const p1 = { x: b.x + ((a.x - b.x) * r1) / dist(a, b), y: b.y + ((a.y - b.y) * r1) / dist(a, b) };
    const p2 = { x: b.x + ((c.x - b.x) * r2) / dist(b, c), y: b.y + ((c.y - b.y) * r2) / dist(b, c) };
    d += ` L ${p1.x} ${p1.y} Q ${b.x} ${b.y} ${p2.x} ${p2.y}`;
  }
  const fim = v[v.length - 1];
  return `${d} L ${fim.x} ${fim.y}`;
}

/** Distancia percorrida ao longo da polilinha ate o ponto `p` (que esta nela). */
function percorrido(v: Pt[], p: Pt): number {
  let total = 0;
  for (let i = 1; i < v.length; i++) {
    const [a, b] = [v[i - 1], v[i]];
    const seg = dist(a, b);
    if (Math.abs(dist(a, p) + dist(p, b) - seg) < 0.5) return total + dist(a, p);
    total += seg;
  }
  return total;
}

const comprimento = (v: Pt[]) => v.slice(1).reduce((s, p, i) => s + dist(v[i], p), 0);

/* ── Montagem ──────────────────────────────────────────────────────────── */

export type Rede = {
  trilhos: Trilho[];
  estacoes: Estacao[];
  /** `organizacao` e o marco da trajetoria que prova a baldeacao. */
  baldeacoes: readonly (Baldeacao & { organizacao: string })[];
};

export function montarRede(): Rede {
  const r = rotas();
  const xFront = r.frontend.estacoes[0].x;
  const porNome = new Map<string, Estacao>();
  const trilhos: Trilho[] = [];

  // Backend primeiro: Dados e Frontend herdam o atraso de uma estacao dele.
  const ordem: LinhaId[] = ["backend", "ia", "automacao", "dados", "frontend"];

  for (const id of ordem) {
    const linha = arsenal.find((l) => l.id === id)!;
    const rota = r[id];

    const inicio = rota.parteDe ? porNome.get(rota.parteDe)!.atraso : 0;
    if (rota.parteDe && linha.itens[0] !== rota.parteDe) {
      throw new Error(
        `Mapa do Arsenal: a linha ${id} desce do Backend em ${rota.parteDe}, entao tem que comecar por ela em percurso.ts.`,
      );
    }

    trilhos.push({
      linha,
      d: caminho(rota.vertices),
      atraso: inicio,
      duracao: Math.round(comprimento(rota.vertices) / VELOCIDADE),
      placa: rota.placa,
    });

    linha.itens.forEach((nome, i) => {
      const p = rota.estacoes[i];
      const atraso = Math.round(inicio + percorrido(rota.vertices, p) / VELOCIDADE);
      const existente = porNome.get(nome);
      if (existente) {
        if (Math.abs(existente.x - p.x) > 0.5 || Math.abs(existente.y - p.y) > 0.5) {
          throw new Error(
            `Mapa do Arsenal: a baldeacao ${nome} esta em dois lugares. Confira a ordem dos itens em percurso.ts.`,
          );
        }
        existente.linhas = [...existente.linhas, id];
        existente.atraso = Math.min(existente.atraso, atraso);
        return;
      }
      porNome.set(nome, {
        nome,
        x: p.x,
        y: p.y,
        lado: ladoDaBaldeacao(p, xFront) ?? rota.lado,
        linhas: [id],
        linha: id,
        atraso,
      });
    });
  }

  const estacoes = [...porNome.values()];

  // Toda estacao compartilhada precisa de prova, e toda prova de um marco real.
  for (const e of estacoes.filter((e) => e.linhas.length > 1)) {
    if (!baldeacoes.some((b) => b.estacao === e.nome)) {
      throw new Error(
        `Mapa do Arsenal: ${e.nome} esta em ${e.linhas.join(", ")} mas nao tem baldeacao provada pelo curriculo.`,
      );
    }
  }

  return {
    trilhos,
    estacoes,
    baldeacoes: baldeacoes.map((b) => {
      const marco = trajetoria.find((m) => m.slug === b.prova);
      if (!marco) {
        throw new Error(`Mapa do Arsenal: a baldeacao ${b.estacao} cita um marco que nao existe (${b.prova}).`);
      }
      // L1, L2... na ordem do codigo, nao na ordem em que foram escritas
      const linhas = [...b.linhas].sort(
        (a, z) => arsenal.findIndex((l) => l.id === a) - arsenal.findIndex((l) => l.id === z),
      );
      return { ...b, linhas, organizacao: marco.organizacao };
    }),
  };
}

/** Cor de cada linha: as tres do eixo + os dois acentos (design.md §3.2). */
export const COR_DA_LINHA: Record<LinhaId, { cor: string; rgb: string }> = {
  ia: { cor: "var(--color-crimson)", rgb: "255, 51, 85" },
  backend: { cor: "var(--color-violet)", rgb: "177, 75, 255" },
  dados: { cor: "var(--color-cyan)", rgb: "43, 245, 255" },
  automacao: { cor: "var(--color-sodium)", rgb: "255, 159, 74" },
  frontend: { cor: "var(--color-magenta)", rgb: "255, 45, 143" },
};

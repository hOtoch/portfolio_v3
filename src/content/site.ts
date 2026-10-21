/**
 * Fonte de verdade do conteudo — design.md §0 e §17.
 * Nada no site pode afirmar algo que nao esteja aqui.
 *
 * v4 — o site deixou de vender servico e passou a candidatar a vaga.
 * O leitor-alvo e recrutador tecnico e tech lead, nao cliente.
 */

export const site = {
  nome: "Hugo Otoch",
  nomeCompleto: "Hugo Lima Otoch Demetrio de Souza",
  titulo: "Engenheiro de IA",
  /** Subtitulo do titulo — o recorte da vaga que esta sendo buscada. */
  especialidade: "Agentes de IA, LLMs e automação em produção",
  nivel: "Pleno",
  base: "Vitória, ES",
  baseCompleta: "Vitória, Espírito Santo · Remoto",
  coordenadas: { lat: -20.32, lon: -40.34 },
  url: "https://hugootoch.dev",
  email: "otochdev@gmail.com",
  github: "https://github.com/hugootoch",
  linkedin: "https://linkedin.com/in/hugootoch",
  /** Curriculo em PDF — CTA do hero e do contato. */
  curriculo: "/hugo-otoch-engenheiro-de-ia.pdf",
  // Foto do hero e do setor Operador. Vazio = placa de neon com o monograma.
  foto: "/otoch.png" as string,
  formacao: "Engenharia de Computação — UFES",
  formacaoCompleta: "Bacharelado em Engenharia de Computação — UFES · concluído em fev/2026",
  idiomas: "Português (nativo) · Inglês (B1)",
  tagline: "Sistemas que trabalham enquanto você dorme.",
  lead: "Construo agentes e aplicações com LLM que saem do notebook e vão para produção — com o backend que sustenta.",
  /** Aberto a propostas. Controla o StatusBadge. */
  disponivel: true,
} as const;

export type EixoId = "agentes" | "llmops" | "plataforma";

export type Eixo = {
  id: EixoId;
  codinome: string;
  nome: string;
  glifo: string;
  /** Token de cor correspondente em tokens.css */
  cor: "magenta" | "violet" | "crimson";
  vitrine: string;
  /** 4 itens curtos, em mono. So o que existe no arsenal real (§17). */
  itens: readonly string[];
};

/**
 * design.md §1.4 — a tripla cor/glifo/codinome se repete em todo o site.
 *
 * v4: deixaram de ser servicos a venda e passaram a ser os tres eixos de
 * atuacao. A ordem e proposital — o mais forte primeiro, e o mais forte agora
 * e agente de IA. Cada eixo tem case que o prova em `projetos.ts`; eixo sem
 * prova nao entra aqui (§17).
 */
export const eixos: readonly Eixo[] = [
  {
    id: "agentes",
    codinome: "AGENT//CORE",
    nome: "Agentes de IA",
    glifo: "◈",
    cor: "crimson",
    vitrine: "Agentes que executam tarefas reais, com ferramentas, memória e saída validada.",
    itens: [
      "LangChain · LangGraph",
      "Tool use e pesquisa na web",
      "Saída estruturada por schema",
      "Fluxos agênticos multi-etapa",
    ],
  },
  {
    id: "llmops",
    codinome: "LLM//OPS",
    nome: "LLM em produção",
    glifo: "⟳",
    cor: "violet",
    vitrine: "A parte que separa demo de sistema: custo, falha, latência e saber quando não usar IA.",
    itens: [
      "Multiprovedor com fallback",
      "Cache de prompt e custo por token",
      "Temperatura por tarefa",
      "Retry com backoff e cota",
    ],
  },
  {
    id: "plataforma",
    codinome: "SHIP//PROD",
    nome: "Plataforma e backend",
    glifo: "◤",
    cor: "magenta",
    vitrine: "O que sustenta a IA embaixo: API, fila, banco e esteira de entrega.",
    itens: [
      "Python · Django · DRF",
      "Celery · RabbitMQ · Redis",
      "Docker · CI/CD · Pytest",
      "PostgreSQL · MSSQL · ETL",
    ],
  },
] as const;

/** Canais diretos — design.md §9.7. */
export const canais = [
  { rotulo: "E-mail", valor: site.email, href: `mailto:${site.email}` },
  { rotulo: "LinkedIn", valor: "linkedin.com/in/hugootoch", href: site.linkedin },
  { rotulo: "GitHub", valor: "github.com/hugootoch", href: site.github },
] as const;

/**
 * Fatos de contratacao — ocupam o lugar das antigas `garantias` comerciais.
 * Tudo aqui sai do curriculo real, exceto `Modalidade`.
 *
 * TODO(hugo): confirmar a modalidade aceita (CLT, PJ ou as duas).
 */
export const contratacao = [
  { rotulo: "Nível", valor: "Pleno" },
  { rotulo: "Foco", valor: "Engenheiro de IA" },
  { rotulo: "Modalidade", valor: "CLT ou PJ" },
  { rotulo: "Local", valor: "Remoto · Vitória/ES" },
  { rotulo: "Inglês", valor: "Intermediário (B1)" },
  { rotulo: "Formação", valor: "Eng. de Computação — UFES · fev/2026" },
] as const;

export const nav = [
  { label: "Atuação", href: "#atuacao" },
  { label: "Projetos", href: "#projetos" },
  { label: "Trajetória", href: "#trajetoria" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "Sobre", href: "#sobre" },
] as const;

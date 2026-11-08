/**
 * design.md §9.6 — Setor TRAJETORIA. O curriculo completo mora no LinkedIn.
 *
 * v4: as datas vem do curriculo em PDF, com precisao de mes, porque a trilha
 * posiciona cada marco pela data e nao pelo indice da lista.
 *
 * Os periodos SE SOBREPOEM de proposito — SigAMAES roda dentro da Seer, e o
 * freelance cobre o inicio do SigAMAES. A trilha tem dois trilhos (emprego de
 * um lado, autoral/academico do outro) justamente para a sobreposicao aparecer
 * como argumento em vez de erro.
 *
 * Ordem decrescente pelo inicio: recrutador le de cima para baixo e o cargo
 * atual tem que ser o primeiro item. A formacao entra no mes em que foi
 * concluida (fev 2026), entre a Tech Solutio e a Seer.
 */

export type TipoMarco = "emprego" | "autoral" | "academico" | "formacao";

export type Marco = {
  slug: string;
  /** "YYYY-MM" — usado para posicionar o marcador na trilha. */
  inicio: string;
  /** "YYYY-MM", ou null quando e o cargo atual. */
  fim: string | null;
  /** Rotulo legivel, como aparece na tela. */
  periodo: string;
  organizacao: string;
  funcao: string;
  local: string;
  tipo: TipoMarco;
  /** 2–3 marcas curtas, todas verificaveis no curriculo. */
  marcas: readonly string[];
  stack: readonly string[];
  /** Link extra do marco, como o PDF do TCC na formação. */
  link?: { rotulo: string; href: string };
};

export const trajetoria: readonly Marco[] = [
  {
    slug: "tech-solutio",
    inicio: "2026-03",
    fim: null,
    periodo: "Mar 2026 → atual",
    organizacao: "Tech Solutio",
    funcao: "Engenheiro de IA · Pleno",
    local: "Remoto",
    tipo: "emprego",
    marcas: [
      "Arquitetura e escala de ponta a ponta de uma plataforma de IA para automação de negociação e cobrança.",
      "Integração de modelos de IA conduzindo interações autônomas com clientes inadimplentes.",
      "Fluxos assíncronos de alta performance com Celery, infraestrutura em Docker e modelagem em MSSQL.",
    ],
    stack: ["Python", "OpenAI API", "LLM-as-a-judge", "Celery", "Docker", "MSSQL"],
  },
  {
    slug: "ufes",
    inicio: "2026-02",
    fim: "2026-02",
    periodo: "Fev 2026",
    organizacao: "UFES",
    funcao: "Bacharelado em Engenharia de Computação",
    local: "Vitória, ES",
    tipo: "formacao",
    marcas: [
      "TCC sobre a generalização de modelos de aprendizado de máquina entre domínios de imagens de lesões de pele, aprovado em 26 de fevereiro de 2026.",
      "Comparação de ResNet-50, ResNet-101, MobileNetV3 e Vision Transformer sob domain shift entre fotos clínicas de celular e imagens dermatoscópicas.",
      "A ResNet-101 foi a mais eficaz; a transferência direta entre domínios degrada o desempenho, e juntar as duas bases não trouxe ganho sobre os modelos especialistas.",
    ],
    stack: ["Aprendizado profundo", "Visão computacional", "ResNet", "Vision Transformer"],
    link: { rotulo: "Ler o TCC (PDF)", href: "/tcc-hugo-otoch.pdf" },
  },
  {
    slug: "seer",
    inicio: "2025-08",
    fim: "2026-03",
    periodo: "Ago 2025 → Mar 2026",
    organizacao: "Seer",
    funcao: "Desenvolvedor Backend",
    local: "Remoto",
    tipo: "emprego",
    marcas: [
      "APIs em Django para geração automatizada de dashboards e relatórios estratégicos.",
      "Processos de ETL integrando múltiplas fontes de dados.",
      "Backend estruturado para grandes volumes, com foco em performance de consulta e integridade.",
    ],
    stack: ["Django", "ETL", "PostgreSQL"],
  },
  {
    slug: "labes-ufes",
    inicio: "2025-02",
    fim: "2026-01",
    periodo: "Fev 2025 → Jan 2026",
    organizacao: "LabES · UFES",
    funcao: "Full Stack · Projeto de extensão",
    local: "Vitória, ES",
    tipo: "academico",
    marcas: [
      "Liderança técnica do desenvolvimento da plataforma SigAMAES, em Spring Boot e Next.js.",
      "Coordenação da integração entre frontend e backend, com Clean Code para manutenção por outros estudantes.",
      "Foco técnico dentro do laboratório, orientando a arquitetura a partir de requisitos reais.",
    ],
    stack: ["Next.js", "Spring Boot", "Clean Code"],
  },
  {
    slug: "freelance-rpa-ia",
    inicio: "2024-01",
    fim: "2025-08",
    periodo: "Jan 2024 → Ago 2025",
    organizacao: "Autônomo",
    funcao: "Desenvolvedor RPA e IA",
    local: "Remoto",
    tipo: "autoral",
    marcas: [
      "Agentes autônomos e chatbots avançados em LangChain e LangGraph, integrando LLMs a fluxos empresariais.",
      "Automações de RPA com Selenium para coleta de dados em larga escala.",
    ],
    stack: ["LangChain", "LangGraph", "Selenium", "Python"],
  },
  {
    slug: "vixteam",
    inicio: "2022-06",
    fim: "2023-06",
    periodo: "Jun 2022 → Jun 2023",
    organizacao: "Vixteam",
    funcao: "Estágio · Desenvolvimento e análise de dados",
    local: "Vitória, ES",
    tipo: "emprego",
    marcas: [
      "Dashboards interativos em Power BI integrados a scripts Python para análise preditiva.",
      "Apoio ao desenvolvimento de sistemas web em Angular e arquiteturas .NET/Spring.",
    ],
    stack: ["Power BI", "Python", "Angular", ".NET"],
  },
] as const;

/**
 * design.md §9.6 — Setor ARSENAL. Ordem proposital: o mais forte primeiro.
 *
 * A FONTE E O CURRICULO (scripts/curriculo.mjs), nao os projetos: a secao
 * Habilidades inteira, mais o que as experiencias citam pelo nome (Spring
 * Boot, Power BI, Angular, Next.js). Tecnologia que so aparece na stack de
 * um projeto nao entra aqui. Mudou o curriculo, mude aqui.
 *
 * v4: `IA & Agentes` subiu para o topo e `Frontend` desceu para o fim — a
 * ordem do arsenal e a ordem da candidatura.
 */
export type LinhaId = "ia" | "backend" | "dados" | "automacao" | "frontend";

export type Linha = {
  id: LinhaId;
  /** Codigo da linha no mapa, como num metro de verdade. */
  codigo: string;
  grupo: string;
  /**
   * As estacoes NA ORDEM DO TRAJETO. Uma estacao que aparece em mais de uma
   * linha e uma baldeacao e precisa estar em `baldeacoes`, com a experiencia
   * que a prova. O desenho do mapa (components/sections/metro/rede.ts) depende
   * desta ordem: mudou aqui, confira lá.
   */
  itens: readonly string[];
};

/**
 * design.md §9.6 — o Arsenal virou um mapa de metro. Cada grupo e uma linha;
 * a ordem das linhas continua sendo a ordem da candidatura.
 */
export const arsenal: readonly Linha[] = [
  {
    id: "ia",
    codigo: "L1",
    grupo: "IA & Agentes",
    itens: [
      "Python",
      "LangChain",
      "LangGraph",
      "RAG",
      "Engenharia de Prompt",
      "Integração de LLMs via API",
      "OpenAI API",
      "Evals de LLM",
      "LLM-as-a-judge",
      "Cache de prompt",
      "Celery",
    ],
  },
  {
    id: "backend",
    codigo: "L2",
    grupo: "Backend & arquitetura",
    itens: [
      "Python",
      "Django",
      "PostgreSQL",
      "Flask",
      "Django REST Framework",
      "Arquitetura Limpa",
      "Design Patterns",
      "Pytest",
      "Spring Boot",
      "RabbitMQ",
      "Celery",
    ],
  },
  {
    id: "dados",
    codigo: "L3",
    grupo: "Dados & infra",
    itens: [
      "PostgreSQL",
      "MSSQL",
      "Redis",
      "Processos de ETL",
      "Docker",
      "Git",
      "GitHub Actions",
      "Swagger/OpenAPI",
      "Power BI",
    ],
  },
  {
    id: "automacao",
    codigo: "L4",
    grupo: "Automação / RPA",
    itens: ["Python", "Selenium", "Playwright", "n8n", "Make"],
  },
  {
    id: "frontend",
    codigo: "L5",
    grupo: "Frontend",
    itens: ["Spring Boot", "Next.js", "Angular"],
  },
];

export type Baldeacao = {
  estacao: string;
  linhas: readonly LinhaId[];
  /** Slug do marco em `trajetoria` (a experiencia do curriculo) onde as linhas rodaram juntas. */
  prova: string;
  /** Uma linha, verificavel no curriculo. */
  porque: string;
};

/**
 * Onde uma linha cruza a outra. Regra do §17: baldeacao sem experiencia do
 * curriculo que a prove nao entra — e por isso que sao so quatro.
 */
export const baldeacoes: readonly Baldeacao[] = [
  {
    estacao: "Python",
    linhas: ["backend", "ia", "automacao"],
    prova: "freelance-rpa-ia",
    porque: "Como autônomo: agentes em LangChain e LangGraph e RPA com Selenium no mesmo período.",
  },
  {
    estacao: "Celery",
    linhas: ["backend", "ia"],
    prova: "tech-solutio",
    porque: "Na Tech Solutio, a IA que conduz a negociação roda em fluxos assíncronos com Celery.",
  },
  {
    estacao: "PostgreSQL",
    linhas: ["backend", "dados"],
    prova: "seer",
    porque: "Na Seer, APIs em Django e processos de ETL sobre PostgreSQL.",
  },
  {
    estacao: "Spring Boot",
    linhas: ["backend", "frontend"],
    prova: "labes-ufes",
    porque: "No SigAMAES, backend em Spring Boot integrado ao frontend em Next.js.",
  },
];

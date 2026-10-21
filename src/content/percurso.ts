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
 * Ordem decrescente: recrutador le de cima para baixo e o cargo atual tem que
 * ser o primeiro item.
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
  /** Slug do case relacionado em `projetos.ts`, quando existe. */
  projeto?: string;
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
    stack: ["Python", "Celery", "Docker", "MSSQL"],
    projeto: "plataforma-ia-cobrancas",
  },
  {
    slug: "seer",
    inicio: "2025-08",
    fim: "2026-03",
    periodo: "Ago 2025 – Mar 2026",
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
    projeto: "dashboards-etl-django",
  },
  {
    slug: "labes-ufes",
    inicio: "2025-02",
    fim: "2026-01",
    periodo: "Fev 2025 – Jan 2026",
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
    projeto: "sigamaes-ufes",
  },
  {
    slug: "freelance-rpa-ia",
    inicio: "2024-01",
    fim: "2025-08",
    periodo: "Jan 2024 – Ago 2025",
    organizacao: "Autônomo",
    funcao: "Desenvolvedor RPA e IA",
    local: "Remoto",
    tipo: "autoral",
    marcas: [
      "Agentes autônomos e chatbots avançados em LangChain e LangGraph, integrando LLMs a fluxos empresariais.",
      "Automações de RPA com Selenium para coleta de dados em larga escala.",
    ],
    stack: ["LangChain", "LangGraph", "Selenium", "Python"],
    projeto: "agentes-autonomos-langgraph",
  },
  {
    slug: "vixteam",
    inicio: "2022-06",
    fim: "2023-06",
    periodo: "Jun 2022 – Jun 2023",
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
  {
    slug: "ufes",
    inicio: "2026-02",
    fim: "2026-02",
    periodo: "Concluído em fev 2026",
    organizacao: "UFES",
    funcao: "Bacharelado em Engenharia de Computação",
    local: "Vitória, ES",
    tipo: "formacao",
    marcas: ["Universidade Federal do Espírito Santo."],
    stack: [],
  },
] as const;

/**
 * design.md §9.5 — Setor ARSENAL. Ordem proposital: o mais forte primeiro.
 *
 * v4: `IA & Agentes` subiu para o topo e `Frontend` desceu para o fim — a
 * ordem do arsenal e a ordem da candidatura.
 *
 * `nota` existe para dizer a profundidade sem inflar. Honestidade de nivel
 * evita entrevista ruim e, em vaga de pleno, conta a favor.
 */
export const arsenal = [
  {
    grupo: "IA & Agentes",
    nota: "Onde eu trabalho hoje, todos os dias.",
    itens: [
      "LangChain",
      "LangGraph",
      "Agentes com tool use",
      "Saída estruturada por schema",
      "Engenharia de Prompt",
      "Cache de prompt",
      "RAG",
      "Anthropic Claude SDK",
      "Google Gemini",
      "Groq",
      "OpenAI",
      "NVIDIA NIM",
    ],
  },
  {
    grupo: "Backend & arquitetura",
    nota: "A base que sustenta tudo acima.",
    itens: [
      "Python",
      "Django",
      "Django REST Framework",
      "Flask",
      "Celery",
      "RabbitMQ",
      "Clean Architecture",
      "Design Patterns",
      "Pytest",
      "Spring Boot",
    ],
  },
  {
    grupo: "Dados & infra",
    nota: "Entrego o que construo rodando, não em branch.",
    itens: [
      "PostgreSQL",
      "MSSQL",
      "SQLite",
      "Redis",
      "Processos de ETL",
      "Docker",
      "GitHub Actions",
      "Git",
      "Swagger/OpenAPI",
      "VPS Linux · systemd",
      "Power BI",
    ],
  },
  {
    grupo: "Automação / RPA",
    nota: "De onde eu vim para a IA.",
    itens: ["Selenium", "Playwright", "n8n", "Make"],
  },
  {
    grupo: "Frontend",
    nota: "O suficiente para entregar inteira a interface do que eu construo.",
    itens: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vite", "Angular"],
  },
] as const;

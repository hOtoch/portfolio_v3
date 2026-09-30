/** design.md §9.4 — Setor 03 // PIPELINE. Previsibilidade vende. */
export const etapas = [
  {
    numero: "01",
    nome: "Briefing",
    texto:
      "Entendo o problema, não o pedido. Saio daqui com escopo, prazo e preço por escrito — antes de qualquer linha de código.",
  },
  {
    numero: "02",
    nome: "Arquitetura",
    texto:
      "Defino stack, integrações e critérios de aceite. Você aprova o desenho antes da construção, quando mudar ainda é barato.",
  },
  {
    numero: "03",
    nome: "Build",
    texto:
      "Entregas incrementais com ambiente de preview. Você acompanha funcionando a cada etapa, em vez de esperar no escuro até o fim.",
  },
  {
    numero: "04",
    nome: "Deploy & operação",
    texto:
      "Vai ao ar monitorado, com domínio e infraestrutura configurados. Suporte e ajustes combinados desde o começo.",
  },
] as const;

/** design.md §9.5 — Setor 04 // ARSENAL. Ordem proposital: o mais forte primeiro. */
export const arsenal = [
  {
    grupo: "Backend & arquitetura",
    itens: [
      "Python",
      "Django",
      "Django REST Framework",
      "Flask",
      "Spring Boot",
      "Clean Architecture",
      "Design Patterns",
      "Celery",
      "RabbitMQ",
      "Pytest",
    ],
  },
  {
    grupo: "IA & agentes",
    itens: [
      "LangChain",
      "LangGraph",
      "RAG",
      "Engenharia de Prompt",
      "Integração de LLMs via API",
    ],
  },
  {
    grupo: "Automação / RPA",
    itens: ["Selenium", "n8n", "Make", "Processos de ETL"],
  },
  {
    grupo: "Frontend",
    itens: ["Next.js", "React", "TypeScript", "Angular"],
  },
  {
    grupo: "Dados & infra",
    itens: [
      "PostgreSQL",
      "MSSQL",
      "Redis",
      "Docker",
      "Git",
      "GitHub Actions",
      "Swagger/OpenAPI",
      "Power BI",
    ],
  },
] as const;

/** design.md §9.6 — bloco TRAJETÓRIA. O currículo completo mora no LinkedIn. */
export const trajetoria = [
  {
    periodo: "2026 →",
    organizacao: "Tech Solutio",
    funcao: "Desenvolvedor Backend",
    nota: "Plataforma de IA para automação de negociação e cobrança.",
  },
  {
    periodo: "2025–2026",
    organizacao: "Seer",
    funcao: "Desenvolvedor Backend",
    nota: "APIs em Django e processos de ETL para dashboards estratégicos.",
  },
  {
    periodo: "2025–2026",
    organizacao: "LabES / UFES",
    funcao: "Full Stack · Extensão",
    nota: "Liderança técnica da plataforma SigAMAES.",
  },
  {
    periodo: "2024–2025",
    organizacao: "Freelancer",
    funcao: "Desenvolvedor RPA e IA",
    nota: "Agentes de IA, chatbots e automações de coleta de dados.",
  },
  {
    periodo: "2022–2023",
    organizacao: "Vixteam",
    funcao: "Estágio · Dev e Análise de Dados",
    nota: "Dashboards em Power BI e sistemas web em Angular e .NET/Spring.",
  },
] as const;

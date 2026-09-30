import type { ServicoId } from "./site";

/**
 * Setor 02 — sites no ar, mostrados em carrossel de celular.
 *
 * Regra do design.md §17: todo texto aqui tem que ser verificavel no proprio
 * site. Nada de resultado, prazo ou "cliente" que nao esteja confirmado.
 * `stack` foi lida dos bundles publicados, nao presumida.
 *
 * `telas` sao capturas reais em 390x844 @2x (iPhone), em /public/projetos.
 */
export type Tela = { src: string; alt: string };

export type Vitrine = {
  slug: string;
  titulo: string;
  servico: ServicoId;
  segmento: string;
  url: string;
  resumo: string;
  destaques: readonly string[];
  stack: readonly string[];
  telas: readonly Tela[];
};

export const vitrines: readonly Vitrine[] = [
  {
    slug: "sentir-terapias",
    titulo: "Sentir Terapias Holísticas",
    servico: "web",
    segmento: "Terapias holísticas · Serra/ES",
    url: "https://sentir-terapias.vercel.app/",
    resumo:
      "Site de apresentação de uma terapeuta que atende online e presencialmente em Jacaraípe. A página tem o ritmo do atendimento: tipografia serifada, muito respiro e nenhuma pressa para chegar ao botão.",
    destaques: [
      "Quatro terapias, cada uma com agendamento direto no WhatsApp",
      "Avaliações públicas do Google em carrossel",
      "Rolagem suave e entradas animadas com GSAP",
      "Endereço e mapa do atendimento presencial",
    ],
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    telas: [
      { src: "/projetos/sentir-terapias/01-inicio.webp", alt: "Sentir Terapias: abertura com o título “Um espaço para voltar ao seu eixo”" },
      { src: "/projetos/sentir-terapias/02-terapias.webp", alt: "Sentir Terapias: seção “Quatro caminhos para o mesmo repouso”, começando pelo Reiki" },
      { src: "/projetos/sentir-terapias/03-reiki.webp", alt: "Sentir Terapias: detalhe do Reiki Tradicional com botão de agendamento" },
      { src: "/projetos/sentir-terapias/04-depoimentos.webp", alt: "Sentir Terapias: carrossel de avaliações do Google" },
    ],
  },
  {
    slug: "pet-park",
    titulo: "Pet Park",
    servico: "web",
    segmento: "Creche e hotel para cães · Vila Velha/ES",
    url: "https://pet-park-seven.vercel.app/",
    resumo:
      "Site de uma creche e hotel para cães em Itapuã. A página responde às perguntas de quem vai deixar o cachorro com alguém: quem cuida, como é o espaço e como começar.",
    destaques: [
      "Botão de WhatsApp fixo na base da tela do celular",
      "Serviços, equipe e fotos reais do espaço",
      "Nota do Google e perguntas frequentes",
      "Animações de rolagem com GSAP",
    ],
    stack: ["React", "Vite", "GSAP"],
    telas: [
      { src: "/projetos/pet-park/01-inicio.webp", alt: "Pet Park: abertura com o título “Enquanto você trabalha, ele tem o dia dele”" },
      { src: "/projetos/pet-park/02-equipe.webp", alt: "Pet Park: seção “Motivos para deixar seu cachorro aqui” com foto da equipe" },
      { src: "/projetos/pet-park/03-espaco.webp", alt: "Pet Park: seção “Onde ele vai passar o dia” com fotos do espaço" },
      { src: "/projetos/pet-park/04-contato.webp", alt: "Pet Park: contato com WhatsApp, telefone e endereço" },
    ],
  },
];

/* ── Arquivo ─────────────────────────────────────────────────────────────── */

/**
 * design.md §9.3 e §17.1 — todos os registros saem do currículo real.
 *
 * Regras:
 * - `resultado` só existe quando houver número medido. Enquanto não houver,
 *   deixe undefined — o card esconde a faixa (design.md §17.2).
 * - Cliente de freelance entra como confidencial; empregador entra pelo nome.
 * - `destaque` ocupa 2 colunas no grid. Troque assim que houver um site de
 *   cliente entregue (design.md §17.3).
 */
export type Projeto = {
  slug: string;
  titulo: string;
  servico: ServicoId;
  origem: string;
  periodo: string;
  problema: string;
  entrega: string;
  stack: readonly string[];
  resultado?: string;
  destaque?: boolean;
};

/**
 * Cases fora do ar por enquanto — a secao mostra so os sites em `vitrines`.
 * Voltam junto com o componente ProjetoVisual (que so eles usam).
 */
export const arquivados: readonly Projeto[] = [
  {
    slug: "sigamaes-ufes",
    titulo: "SigAMAES — plataforma do LabES/UFES",
    servico: "web",
    origem: "Projeto de extensão · UFES",
    periodo: "2025–2026",
    problema:
      "O projeto precisava de uma plataforma web própria, construída para ser mantida por outros estudantes depois da minha saída.",
    entrega:
      "Liderei o desenvolvimento técnico do site de ponta a ponta e coordenei a integração entre frontend e backend, com Clean Code e arquitetura derivada de requisitos reais do laboratório.",
    stack: ["Next.js", "Spring Boot", "Clean Code"],
    destaque: true,
  },
  {
    slug: "plataforma-ia-cobrancas",
    titulo: "Plataforma de IA para negociação e cobrança",
    servico: "ia",
    origem: "Tech Solutio",
    periodo: "2026 → atual",
    problema:
      "Negociação com clientes inadimplentes é repetitiva, escala mal e trava quando depende de uma pessoa em cada conversa.",
    entrega:
      "Arquitetura e escala ponta a ponta da plataforma, com modelos de IA conduzindo as interações de forma autônoma, fluxos assíncronos em Celery e infraestrutura conteinerizada.",
    stack: ["Python", "Celery", "Docker", "MSSQL"],
  },
  {
    slug: "agentes-autonomos-langgraph",
    titulo: "Agentes autônomos e chatbots com LLM",
    servico: "ia",
    origem: "Cliente confidencial · Freelance",
    periodo: "2024–2025",
    problema:
      "Fluxos de trabalho empresariais que exigiam alguém lendo, interpretando e respondendo manualmente o dia inteiro.",
    entrega:
      "Agentes autônomos e chatbots avançados em LangChain e LangGraph, integrando modelos de LLM diretamente aos fluxos existentes da operação.",
    stack: ["LangChain", "LangGraph", "Python"],
  },
  {
    slug: "rpa-coleta-dados",
    titulo: "RPA de coleta de dados em larga escala",
    servico: "rpa",
    origem: "Cliente confidencial · Freelance",
    periodo: "2024–2025",
    problema:
      "Coleta de dados feita à mão, tarefa repetitiva consumindo horas de trabalho que não escalava junto com o volume.",
    entrega:
      "Automações de RPA com Selenium rodando em larga escala, reduzindo o tempo de processamento manual das tarefas repetitivas.",
    stack: ["Selenium", "Python"],
  },
  {
    slug: "dashboards-etl-django",
    titulo: "APIs e ETL para dashboards estratégicos",
    servico: "rpa",
    origem: "Seer",
    periodo: "2025–2026",
    problema:
      "Dados espalhados em várias fontes e relatórios montados manualmente, sempre atrasados em relação à decisão.",
    entrega:
      "APIs em Django gerando dashboards e relatórios de forma automatizada, alimentadas por processos de ETL que integram múltiplas fontes, com o backend estruturado para grandes volumes.",
    stack: ["Django", "ETL", "PostgreSQL"],
  },
] as const;

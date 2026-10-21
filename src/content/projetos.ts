import type { EixoId } from "./site";

/**
 * Setor 02 — PROJETOS.
 *
 * Regra do design.md §17: todo texto aqui tem que ser verificavel. Numero so
 * entra quando foi medido; periodo de projeto autoral sai do git do proprio
 * repositorio; stack sai do codigo, nao de memoria.
 *
 * A inversao da v4: os projetos AUTORAIS sao a vitrine tecnica de verdade,
 * porque sao o unico lugar sem NDA — da para abrir arquitetura, decisao de
 * prompt, custo e codigo. Os projetos de empresa ficam no nivel de arquitetura,
 * sem dado de cliente.
 */

export type Status =
  /** Publico, com link que abre. */
  | "no-ar"
  /** Autoral, roda localmente ou em VPS propria. Sem demo publica. */
  | "privado"
  /** De empresa ou cliente. Nao pode ser mostrado. */
  | "confidencial";

export type Natureza = "autoral" | "profissional" | "academico" | "cliente";

export type Tela = { src: string; alt: string };

export type Decisao = { titulo: string; texto: string };

export type Numero = { valor: string; rotulo: string };

export type Projeto = {
  slug: string;
  titulo: string;
  /** Uma linha, para o card. */
  subtitulo: string;
  eixo: EixoId;
  natureza: Natureza;
  status: Status;
  origem: string;
  periodo: string;
  problema: string;
  solucao: string;
  /** O bloco que um tech lead vai ler. Decisao + porque. */
  decisoes: readonly Decisao[];
  stack: readonly string[];
  /** So quando ha numero medido (design.md §17.2). */
  numeros?: readonly Numero[];
  /** Capturas em 1440x900. Vazio = o case nao mostra tela. */
  desktop?: readonly Tela[];
  /** Capturas em 390x844 @2x, para a moldura de celular. */
  mobile?: readonly Tela[];
  url?: string;
  /** Credito de origem quando o projeto parte de codigo de outra pessoa. */
  atribuicao?: string;
  /** Ocupa 2 colunas no grid. */
  destaque?: boolean;
};

export const projetos: readonly Projeto[] = [
  {
    slug: "prospecto-sh",
    titulo: "Prospecto.sh",
    subtitulo:
      "Prospecção de clientes com IA onde ela ajuda e código determinístico onde ela atrapalharia.",
    eixo: "agentes",
    natureza: "autoral",
    status: "privado",
    origem: "Projeto autoral",
    periodo: "Jul 2026 – Set 2026",
    problema:
      "Quem vende site para pequeno negócio gasta horas achando empresas que precisam de um, descobrindo se o site atual é ruim, escrevendo mensagem que não pareça spam e lembrando de cada follow-up.",
    solucao:
      "Sistema que fecha o ciclo inteiro: capta no Google Maps e no Instagram, qualifica analisando o site de cada empresa, dá score de 0 a 100, gera o roteiro da conversa com um fluxo agêntico no Claude, dispara o primeiro contato pelo WhatsApp a partir de uma VPS e mostra num dashboard qual nicho, região e canal estão trazendo resposta.",
    decisoes: [
      {
        titulo: "Saber quando não usar IA",
        texto:
          "O primeiro contato é texto fixo validado, preenchido com os dados reais do lead. Não alucina, não custa token e a mensagem que já converte sai idêntica toda vez. A saudação vem do relógio do servidor, porque o modelo não sabe que horas são. O raio-X do site e os destaques do dashboard são regras com amostra mínima, para não concluir nada a partir de 1 resposta em 2.",
      },
      {
        titulo: "Fluxo agêntico em duas chamadas",
        texto:
          "A primeira chamada dá ao Claude as ferramentas de busca e leitura na web, com teto de 6 buscas e 3 leituras, e exige um dossiê em que cada fato carrega a URL da fonte, mais uma seção de incertezas. A segunda roda sem ferramentas e devolve as 7 etapas da conversa em JSON validado por schema, com as ramificações de resposta. Turno que volta pausado é retomado automaticamente.",
      },
      {
        titulo: "Cache de prompt e custo na tela",
        texto:
          "O guia de prospecção de ~400 linhas entra como system prompt em cache, não a cada requisição. Cada geração mostra o custo estimado em tokens, cache e buscas, e o resultado fica salvo para não pagar de novo ao reabrir o lead.",
      },
      {
        titulo: "Multiprovedor com fallback de verdade",
        texto:
          "Camada própria que alterna entre Gemini, Groq, NVIDIA NIM e OpenAI: usa os gratuitos primeiro e deixa o pago por último, refaz a chamada com backoff exponencial dentro de um orçamento de tempo, põe em geladeira por 5 minutos o provedor que estourou cota e traduz cada erro para algo que o usuário entenda.",
      },
      {
        titulo: "Temperatura por tarefa",
        texto:
          "Copy roda a 0,9 e classificação a 0,2. E o fechamento do follow-up é sorteado no código, não pelo modelo — pedir ao LLM que sorteie faz ele repetir sempre o mesmo final e inventar horário.",
      },
    ],
    stack: [
      "Anthropic Claude SDK",
      "Google Gemini",
      "Groq",
      "NVIDIA NIM",
      "OpenAI",
      "Python",
      "Flask",
      "SQLite (WAL)",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "TanStack Query",
      "Electron",
      "Playwright",
      "VPS Linux · systemd · Caddy",
    ],
    numeros: [
      { valor: "430+", rotulo: "testes automatizados" },
      { valor: "230+", rotulo: "nichos no catálogo de busca" },
      { valor: "2", rotulo: "chamadas por roteiro gerado" },
    ],
    desktop: [
      {
        src: "/projetos/prospecto-sh/08-copiloto-ia.webp",
        alt: "Prospecto.sh: copiloto com Claude mostrando o roteiro da conversa com ramificações, alertas, objeções e o custo da geração",
      },
      {
        src: "/projetos/prospecto-sh/09-instagram-classificacao-ia.webp",
        alt: "Prospecto.sh: perfis do Instagram classificados pela IA, com prioridade, nicho detectado e sugestão de DM",
      },
      {
        src: "/projetos/prospecto-sh/01-dashboard.webp",
        alt: "Prospecto.sh: painel de desempenho com indicadores, destaques automáticos, ritmo semanal e funil",
      },
      {
        src: "/projetos/prospecto-sh/07-lead-detalhe.webp",
        alt: "Prospecto.sh: detalhe do lead com estratégia de abordagem, mensagem pronta e raio-X do site",
      },
      {
        src: "/projetos/prospecto-sh/10-disparo-automatico.webp",
        alt: "Prospecto.sh: disparo automático pelo WhatsApp com estado, fila, configuração e webhook",
      },
      {
        src: "/projetos/prospecto-sh/03-dashboard-regioes.webp",
        alt: "Prospecto.sh: desempenho por região, canal e tipo de lead, com mapa de calor nicho por cidade",
      },
      {
        src: "/projetos/prospecto-sh/06-leads-kanban.webp",
        alt: "Prospecto.sh: CRM em kanban, de novo a fechado, com arrastar e soltar",
      },
    ],
    atribuicao:
      "Fork evoluído do ProspectOS, projeto open source (MIT) de nando0x, que trouxe a base de captação, CRM e IA multiprovedor. Sobre ela construí o copiloto de conversa com Claude, o disparo automático pelo WhatsApp com webhook e deploy em VPS, o dashboard de desempenho por nicho e região, e a identidade visual.",
    destaque: true,
  },
  {
    slug: "plataforma-ia-cobrancas",
    titulo: "Plataforma de IA para negociação e cobrança",
    subtitulo: "Modelos conduzindo a negociação com inadimplente de forma autônoma.",
    eixo: "agentes",
    natureza: "profissional",
    status: "confidencial",
    origem: "Tech Solutio",
    periodo: "Mar 2026 → atual",
    problema:
      "Negociação com cliente inadimplente é repetitiva, escala mal e trava quando depende de uma pessoa em cada conversa.",
    solucao:
      "Atuo como engenheiro responsável pela arquitetura e escala de ponta a ponta da plataforma, com modelos de IA conduzindo as interações de forma autônoma, fluxos assíncronos de alta performance em Celery e infraestrutura conteinerizada.",
    decisoes: [
      {
        titulo: "Assíncrono por necessidade",
        texto:
          "Conversa conduzida por modelo não cabe em ciclo de requisição e resposta: a latência é do provedor, não da aplicação. O trabalho vive em tarefa de segundo plano gerenciada por Celery.",
      },
      {
        titulo: "Relacional, não documento",
        texto:
          "Negociação e cobrança são dado contábil: precisa de integridade, histórico e conciliação. Modelagem relacional em MSSQL, conteinerizada em Docker.",
      },
    ],
    stack: ["Python", "Celery", "Docker", "MSSQL", "Integração de LLMs via API"],
  },
  {
    slug: "pelada-sofredores",
    titulo: "Peladinhas Sofredores",
    subtitulo:
      "Gestão de uma pelada semanal de ponta a ponta, com sorteio de times por algoritmo e overall que se recalcula a cada rodada.",
    eixo: "plataforma",
    natureza: "autoral",
    status: "privado",
    origem: "Projeto autoral",
    periodo: "Abr 2026 → atual",
    problema:
      "Uma pelada semanal entre amigos tem caixa, mensalidade, convidado, presença e discussão sobre time desequilibrado — tudo isso vivia em planilha e grupo de WhatsApp.",
    solucao:
      "Aplicação web com dois níveis de acesso que cuida do caixa do grupo, da lista de presença, do sorteio de times equilibrados por nível técnico e de um sistema de avaliação entre jogadores que recalcula o overall de cada um a cada rodada, no estilo FIFA.",
    decisoes: [
      {
        titulo: "Busca exata até onde ela cabe",
        texto:
          "O balanceador distribui os confirmados buscando o menor desnível possível, considerando o overall de cada jogador e o equilíbrio de defensivos. Até 16 jogadores faz busca exata com backtracking; acima disso cai para heurística gulosa com refinamento por troca de pares. Nos prints o desnível médio ficou em 0,25 ponto.",
      },
      {
        titulo: "Snapshot em vez de recálculo retroativo",
        texto:
          "O overall usado no sorteio fica congelado na presença daquela pelada. O passado não muda quando o presente muda — histórico que se reescreve sozinho é histórico que mente.",
      },
      {
        titulo: "Estorno em vez de delete",
        texto:
          "Lançamento errado vira VOIDED e continua auditável. Todo valor monetário é Decimal, nunca float.",
      },
      {
        titulo: "Monolito de propósito",
        texto:
          "O público real são algumas dezenas de pessoas. Nada de microsserviço, fila ou cache distribuído: o custo apareceria e o benefício não. A separação acontece onde importa — o cálculo de balanceamento vive em módulo próprio, testado isoladamente.",
      },
      {
        titulo: "Autorização sempre no servidor",
        texto:
          "Permissão explícita por view, padrão negar, e nenhum campo vindo do cliente decide o que o usuário pode fazer.",
      },
    ],
    stack: [
      "Python 3.12",
      "Django 4.2",
      "Django REST Framework",
      "PostgreSQL",
      "React 18",
      "TypeScript",
      "Vite",
      "GSAP",
      "Docker Compose",
      "GitHub Actions",
      "Pytest",
      "Playwright",
      "Ruff",
    ],
    numeros: [
      { valor: "~19k", rotulo: "linhas de código próprio" },
      { valor: "62", rotulo: "testes passando" },
      { valor: "0,25", rotulo: "ponto de desnível médio entre times" },
    ],
    desktop: [
      {
        src: "/projetos/pelada-sofredores/02-dashboard-financeiro.webp",
        alt: "Peladinhas Sofredores: dashboard financeiro com saldo consolidado, entradas, saídas e fluxo mensal",
      },
      {
        src: "/projetos/pelada-sofredores/03-pelada-times.webp",
        alt: "Peladinhas Sofredores: pré-jogo com lista de presença e os times já sorteados pelo algoritmo",
      },
      {
        src: "/projetos/pelada-sofredores/04-ranking-esportivo.webp",
        alt: "Peladinhas Sofredores: ranking com pódio, tabela de overall e artilharia da temporada",
      },
      {
        src: "/projetos/pelada-sofredores/09-portal-do-jogador.webp",
        alt: "Peladinhas Sofredores: portal do jogador com overall, gráfico de evolução e time da semana",
      },
      {
        src: "/projetos/pelada-sofredores/05-elenco.webp",
        alt: "Peladinhas Sofredores: elenco em cards no estilo FIFA, com posição, camisa e overall",
      },
    ],
    mobile: [
      {
        src: "/projetos/pelada-sofredores/mobile-06-votacao.webp",
        alt: "Peladinhas Sofredores no celular: votação de notas, um jogador por vez, com slider e contagem regressiva",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-02-dashboard.webp",
        alt: "Peladinhas Sofredores no celular: dashboard financeiro do grupo",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-03-pelada-times.webp",
        alt: "Peladinhas Sofredores no celular: times sorteados para a rodada",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-04-ranking.webp",
        alt: "Peladinhas Sofredores no celular: ranking de overall da temporada",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-05-portal.webp",
        alt: "Peladinhas Sofredores no celular: portal do jogador com overall e pendências",
      },
    ],
  },
  {
    slug: "agentes-autonomos-langgraph",
    titulo: "Agentes autônomos e chatbots com LLM",
    subtitulo: "Agentes em LangChain e LangGraph integrados a fluxos de trabalho empresariais.",
    eixo: "agentes",
    natureza: "cliente",
    status: "confidencial",
    origem: "Clientes · trabalho autônomo",
    periodo: "Jan 2024 – Ago 2025",
    problema:
      "Fluxos de trabalho empresariais que exigiam alguém lendo, interpretando e respondendo manualmente o dia inteiro.",
    solucao:
      "Projetei e implementei agentes autônomos e chatbots avançados em LangChain e LangGraph, integrando modelos de LLM diretamente aos fluxos existentes da operação. No mesmo período, automações de RPA com Selenium para coleta de dados em larga escala.",
    decisoes: [
      {
        titulo: "Grafo em vez de corrente",
        texto:
          "Fluxo de atendimento tem volta: o agente pergunta, recebe resposta incompleta e precisa insistir. LangGraph permite representar isso como estado e transição, em vez de uma cadeia que só anda para a frente.",
      },
    ],
    stack: ["LangChain", "LangGraph", "Python", "Selenium", "Integração de LLMs via API"],
  },
  {
    slug: "sigamaes-ufes",
    titulo: "SigAMAES — plataforma do LabES/UFES",
    subtitulo: "Liderança técnica de uma plataforma feita para ser mantida por quem vem depois.",
    eixo: "plataforma",
    natureza: "academico",
    status: "confidencial",
    origem: "Projeto de extensão · LabES/UFES",
    periodo: "Fev 2025 – Jan 2026",
    problema:
      "O projeto precisava de uma plataforma web própria, construída para ser mantida por outros estudantes depois da minha saída.",
    solucao:
      "Liderei o desenvolvimento técnico de ponta a ponta e coordenei a integração entre frontend e backend, atuando como foco técnico dentro do laboratório e orientando a arquitetura a partir de requisitos reais.",
    decisoes: [
      {
        titulo: "Clean Code como requisito, não como gosto",
        texto:
          "Em projeto de extensão a equipe troca por semestre. A escolha de arquitetura foi pautada por quem assume depois: a plataforma precisava continuar evoluindo sem mim.",
      },
    ],
    stack: ["Next.js", "Spring Boot", "Clean Code"],
  },
  {
    slug: "dashboards-etl-django",
    titulo: "APIs e ETL para dashboards estratégicos",
    subtitulo: "Dado espalhado em várias fontes virando relatório que chega antes da decisão.",
    eixo: "plataforma",
    natureza: "profissional",
    status: "confidencial",
    origem: "Seer",
    periodo: "Ago 2025 – Mar 2026",
    problema:
      "Dados espalhados em várias fontes e relatórios montados à mão, sempre atrasados em relação à decisão.",
    solucao:
      "APIs em Django gerando dashboards e relatórios de forma automatizada, alimentadas por processos de ETL que integram múltiplas fontes, com o backend estruturado para grandes volumes.",
    decisoes: [
      {
        titulo: "Performance de consulta é requisito de produto",
        texto:
          "Relatório que demora não é consultado. O backend foi estruturado para grandes volumes com foco em performance de consulta e integridade da informação processada.",
      },
    ],
    stack: ["Django", "PostgreSQL", "Processos de ETL"],
  },
] as const;

/* ── Trabalhos de web ────────────────────────────────────────────────────── */

/**
 * Sites de cliente entregues. Ficam numa faixa compacta no fim do setor, fora
 * do grid principal: provam entrega de frontend, mas nao e o eixo da
 * candidatura e competem pela atencao do recrutador.
 *
 * `telas` sao capturas reais em 390x844 @2x (iPhone), em /public/projetos.
 */
export type Vitrine = {
  slug: string;
  titulo: string;
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
    segmento: "Terapias holísticas · Serra/ES",
    url: "https://sentir-terapias.vercel.app/",
    resumo:
      "Site de apresentação de uma terapeuta que atende online e presencialmente. A página tem o ritmo do atendimento: tipografia serifada, muito respiro e nenhuma pressa para chegar ao botão.",
    destaques: [
      "Quatro terapias, cada uma com agendamento direto no WhatsApp",
      "Avaliações públicas do Google em carrossel",
      "Rolagem suave e entradas animadas com GSAP",
      "Endereço e mapa do atendimento presencial",
    ],
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    telas: [
      {
        src: "/projetos/sentir-terapias/01-inicio.webp",
        alt: "Sentir Terapias: abertura com o título “Um espaço para voltar ao seu eixo”",
      },
      {
        src: "/projetos/sentir-terapias/02-terapias.webp",
        alt: "Sentir Terapias: seção “Quatro caminhos para o mesmo repouso”, começando pelo Reiki",
      },
      {
        src: "/projetos/sentir-terapias/03-reiki.webp",
        alt: "Sentir Terapias: detalhe do Reiki Tradicional com botão de agendamento",
      },
      {
        src: "/projetos/sentir-terapias/04-depoimentos.webp",
        alt: "Sentir Terapias: carrossel de avaliações do Google",
      },
    ],
  },
  {
    slug: "pet-park",
    titulo: "Pet Park",
    segmento: "Creche e hotel para cães · Vila Velha/ES",
    url: "https://pet-park-seven.vercel.app/",
    resumo:
      "Site de uma creche e hotel para cães. A página responde às perguntas de quem vai deixar o cachorro com alguém: quem cuida, como é o espaço e como começar.",
    destaques: [
      "Botão de WhatsApp fixo na base da tela do celular",
      "Serviços, equipe e fotos reais do espaço",
      "Nota do Google e perguntas frequentes",
      "Animações de rolagem com GSAP",
    ],
    stack: ["React", "Vite", "GSAP"],
    telas: [
      {
        src: "/projetos/pet-park/01-inicio.webp",
        alt: "Pet Park: abertura com o título “Enquanto você trabalha, ele tem o dia dele”",
      },
      {
        src: "/projetos/pet-park/02-equipe.webp",
        alt: "Pet Park: seção “Motivos para deixar seu cachorro aqui” com foto da equipe",
      },
      {
        src: "/projetos/pet-park/03-espaco.webp",
        alt: "Pet Park: seção “Onde ele vai passar o dia” com fotos do espaço",
      },
      {
        src: "/projetos/pet-park/04-contato.webp",
        alt: "Pet Park: contato com WhatsApp, telefone e endereço",
      },
    ],
  },
];

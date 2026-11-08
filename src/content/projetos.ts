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

/** Uma etapa do fluxo principal do sistema, na ordem em que acontece. */
export type Etapa = { titulo: string; texto: string };

/** Um bloco de funcionalidade; `tela` é o `src` de uma das capturas de `desktop`. */
export type Funcionalidade = { titulo: string; itens: readonly string[]; tela?: string };

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
  /** Como o sistema funciona, de ponta a ponta. */
  fluxo?: readonly Etapa[];
  /** O que o sistema faz, agrupado, cada grupo com a tela que o mostra. */
  funcionalidades?: readonly Funcionalidade[];
  /** O bloco que um tech lead vai ler. Decisao + porque. */
  decisoes: readonly Decisao[];
  /** Testes, CI, seguranca e deploy — o que sustenta o codigo. */
  qualidade?: readonly string[];
  stack: readonly string[];
  /** So quando ha numero medido (design.md §17.2). */
  numeros?: readonly Numero[];
  /** Capturas em 1440x900. Vazio = o case nao mostra tela. */
  desktop?: readonly Tela[];
  /** Capturas em 390x844 @2x, para a moldura de celular. */
  mobile?: readonly Tela[];
  url?: string;
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
    periodo: "Jul 2026 → Set 2026",
    problema:
      "Quem vende site para pequeno negócio gasta horas achando empresas que precisam de um, descobrindo se o site atual é ruim, escrevendo mensagem que não pareça spam e lembrando de cada follow-up.",
    solucao:
      "Sistema que fecha o ciclo inteiro: capta no Google Maps e no Instagram, qualifica analisando o site de cada empresa, dá score de 0 a 100, gera o roteiro da conversa com um fluxo agêntico no Claude, dispara o primeiro contato pelo WhatsApp a partir de uma VPS e mostra num dashboard qual nicho, região e canal estão trazendo resposta.",
    fluxo: [
      {
        titulo: "Captar",
        texto: "Busca no Google Maps por nicho e cidade, ou por pino e raio no mapa, e extrai quem comentou em posts do Instagram.",
      },
      {
        titulo: "Qualificar",
        texto: "Analisa o site de cada empresa, monta o raio-X e dá um score de 0 a 100 para ordenar a fila.",
      },
      {
        titulo: "Preparar a conversa",
        texto: "O Claude pesquisa o lead na web e devolve o roteiro completo, com ramificações e objeções.",
      },
      {
        titulo: "Disparar",
        texto: "A VPS envia o primeiro contato pelo WhatsApp em horário comercial e recebe as respostas por webhook.",
      },
      {
        titulo: "Medir",
        texto: "O dashboard mostra qual nicho, região e canal respondem, e onde vale parar de insistir.",
      },
    ],
    funcionalidades: [
      {
        titulo: "Captação e qualificação",
        tela: "/projetos/prospecto-sh/05-lead-detalhe.webp",
        itens: [
          "Busca no Google Maps por nicho + cidade ou desenhando pinos com raio num mapa, num catálogo de mais de 230 nichos",
          "Fonte de dados plugável: scraper local ou Google Places API",
          "Análise do site de cada empresa: sem site, certificado inválido, sem HTTPS, conteúdo misto, não adaptado ao celular",
          "Raio-X do site com 9 itens, como WhatsApp, telefone clicável, mapa e descrição para o Google",
          "Score de 0 a 100 para ordenar a fila de abordagem",
        ],
      },
      {
        titulo: "Copiloto de conversa com Claude",
        tela: "/projetos/prospecto-sh/06-copiloto-ia.webp",
        itens: [
          "Primeira chamada com busca e leitura na web, com teto de 6 buscas e 3 leituras, e um dossiê em que cada fato carrega a URL da fonte",
          "Segunda chamada sem ferramentas devolve as 7 etapas da conversa em JSON validado por schema",
          "Cada etapa traz as mensagens prontas e as ramificações: se o lead responder X, responda Y",
          "Objeções prováveis e alertas do que conferir antes de enviar, como grafia do nome e fatos com fonte duvidosa",
          "Custo estimado de cada geração na tela, e o resultado fica salvo para não pagar de novo",
        ],
      },
      {
        titulo: "Leads do Instagram classificados por IA",
        tela: "/projetos/prospecto-sh/07-instagram-classificacao-ia.webp",
        itens: [
          "Quem comentou num post vira lead, com bio, seguidores e tipo de conta",
          "O modelo devolve prioridade, nicho detectado, justificativa e uma sugestão de DM na voz do vendedor",
          "Formato rígido e validado; \"descartado\" só sai quando não há nenhum indício de negócio real",
          "Classificação a temperatura 0,2 e copy a 0,9",
        ],
      },
      {
        titulo: "CRM e rotina de prospecção",
        tela: "/projetos/prospecto-sh/04-leads-kanban.webp",
        itens: [
          "Lista e kanban com arrastar e soltar, histórico de status e tags",
          "Follow-ups com cadência crescente, que não repetem argumento nem estrutura da mensagem anterior",
          "Tarefas do dia, meta semanal e modo foco para sessões de prospecção",
          "Exportação em CSV e diagnóstico do site em PDF para enviar ao cliente",
        ],
      },
      {
        titulo: "Disparo automático pelo WhatsApp",
        tela: "/projetos/prospecto-sh/08-disparo-automatico.webp",
        itens: [
          "Roda numa VPS e envia o primeiro contato só no horário comercial, com intervalo mínimo e folga aleatória entre envios",
          "Verifica antes se o número tem WhatsApp e pausa sozinho após falhas seguidas",
          "Recebe por webhook a entrega, a leitura e a resposta, e marca automaticamente quem respondeu",
          "Reserva atômica no banco antes de cada envio",
        ],
      },
      {
        titulo: "Dashboard de desempenho",
        tela: "/projetos/prospecto-sh/01-dashboard.webp",
        itens: [
          "Resposta, fechamento e descarte por nicho, por região, por canal e por tipo de lead",
          "Cidade e bairro extraídos do endereço de cada lead",
          "Ritmo semanal, funil com a taxa de cada etapa e mapa de calor nicho × cidade",
          "Destaques automáticos com amostra mínima: o nicho que mais responde, leads parados, onde parar de insistir",
        ],
      },
    ],
    qualidade: [
      "430+ testes automatizados com pytest",
      "Chaves de API guardadas no cofre do sistema operacional (keyring), nunca em arquivo",
      "Webhook do WhatsApp autenticado por token",
      "App de desktop para Windows com atualização automática (Electron + electron-updater, PyInstaller, Inno Setup)",
      "Disparador em VPS Linux com systemd e HTTPS pelo Caddy",
    ],
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
          "Copy roda a 0,9 e classificação a 0,2. E o fechamento do follow-up é sorteado no código, não pelo modelo. Pedir ao LLM que sorteie faz ele repetir sempre o mesmo final e inventar horário.",
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
        src: "/projetos/prospecto-sh/06-copiloto-ia.webp",
        alt: "Prospecto.sh: copiloto com Claude mostrando o roteiro da conversa com ramificações, alertas, objeções e o custo da geração",
      },
      {
        src: "/projetos/prospecto-sh/07-instagram-classificacao-ia.webp",
        alt: "Prospecto.sh: perfis do Instagram classificados pela IA, com prioridade, nicho detectado e sugestão de DM",
      },
      {
        src: "/projetos/prospecto-sh/01-dashboard.webp",
        alt: "Prospecto.sh: painel de desempenho com indicadores, destaques automáticos, ritmo semanal e funil",
      },
      {
        src: "/projetos/prospecto-sh/05-lead-detalhe.webp",
        alt: "Prospecto.sh: detalhe do lead com estratégia de abordagem gerada por IA, ganchos e ações de contato",
      },
      {
        src: "/projetos/prospecto-sh/08-disparo-automatico.webp",
        alt: "Prospecto.sh: disparo automático pelo WhatsApp com fila, horário de envio, conexão e webhook",
      },
      {
        src: "/projetos/prospecto-sh/02-desempenho-por-nicho.webp",
        alt: "Prospecto.sh: ritmo semanal da prospecção, funil de conversão e desempenho por nicho",
      },
      {
        src: "/projetos/prospecto-sh/03-dashboard-regioes.webp",
        alt: "Prospecto.sh: desempenho por região, canal e tipo de lead, com mapa de calor nicho por cidade",
      },
      {
        src: "/projetos/prospecto-sh/04-leads-kanban.webp",
        alt: "Prospecto.sh: CRM em kanban, de novo a fechado, com os indicadores dos leads do Google Maps",
      },
      {
        src: "/projetos/prospecto-sh/09-tarefas-do-dia.webp",
        alt: "Prospecto.sh: tarefas do dia com os follow-ups vencidos e o atalho para o WhatsApp",
      },
    ],
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
      "Uma pelada semanal entre amigos tem caixa, mensalidade, convidado, presença e discussão sobre time desequilibrado. Tudo isso vivia em planilha e grupo de WhatsApp.",
    solucao:
      "Aplicação web com dois níveis de acesso que cuida do caixa do grupo, da lista de presença, do sorteio de times equilibrados por nível técnico e de um sistema de avaliação entre jogadores que recalcula o overall de cada um a cada rodada, no estilo FIFA.",
    fluxo: [
      {
        titulo: "Presença",
        texto: "Mensalistas confirmam presença e o administrador inclui os convidados avulsos da rodada.",
      },
      {
        titulo: "Sorteio",
        texto: "O balanceador divide os confirmados pelo menor desnível de overall e de defensivos entre os times.",
      },
      {
        titulo: "Jogo",
        texto: "A pelada é encerrada com o time vencedor, e gols e assistências entram pela planilha da rodada.",
      },
      {
        titulo: "Votação",
        texto: "Abre uma janela de 24 horas para os jogadores se avaliarem com notas de 1 a 10, pelo celular.",
      },
      {
        titulo: "Overall novo",
        texto: "Quando a janela fecha, o overall de cada jogador é recalculado e o ranking se atualiza.",
      },
    ],
    funcionalidades: [
      {
        titulo: "Caixa do grupo",
        tela: "/projetos/pelada-sofredores/01-dashboard-financeiro.webp",
        itens: [
          "Saldo consolidado, entradas, saídas e fluxo mensal dos últimos meses",
          "Lançamentos categorizados, com status lançado, pendente ou estornado",
          "Cobrança por mês de referência: quem pagou, quem está parcial, quem está devendo",
          "Taxa avulsa de convidado com responsável pela cobrança: quem levou o convidado responde por ele",
          "Exportação do extrato e do relatório da temporada em CSV e JSON",
        ],
      },
      {
        titulo: "Sorteio de times equilibrados",
        tela: "/projetos/pelada-sofredores/02-times-sorteados.webp",
        itens: [
          "Algoritmo próprio que busca o menor desnível entre os times, considerando overall e equilíbrio de defensivos",
          "Busca exata com backtracking até 16 jogadores; acima disso, heurística gulosa com refinamento por troca de pares",
          "Troca manual entre times, para quando o algoritmo acerta a conta mas erra o clima",
          "Times escalados em campo para todo mundo ver antes do jogo",
        ],
      },
      {
        titulo: "Avaliação entre jogadores e overall dinâmico",
        tela: "/projetos/pelada-sofredores/07-notas.webp",
        itens: [
          "Janela de 24 horas depois da pelada, com notas de 1 a 10, entre os próprios times ou geral",
          "Votação feita para o celular: um jogador por vez, slider, avanço automático e contagem regressiva",
          "A média vira uma nota da comunidade e o overall caminha 25% nessa direção, sempre entre 0 e 99",
          "Log de votos auditável; o administrador acompanha e fecha a janela, mas não vota",
        ],
      },
      {
        titulo: "Ranking da temporada",
        tela: "/projetos/pelada-sofredores/03-ranking.webp",
        itens: [
          "Pódio e tabela de overall com faixas bronze, prata, ouro e diamante",
          "Artilheiros, assistentes e maiores vencedores acumulados na temporada",
          "Importação e exportação da planilha da rodada em .xlsx para lançar gols e assistências em lote",
          "Rankings de presença e de pagamento para o administrador",
        ],
      },
      {
        titulo: "Portal do jogador",
        tela: "/projetos/pelada-sofredores/04-portal-do-jogador.webp",
        itens: [
          "Overall atual, classificação e gráfico de evolução ao longo da temporada",
          "Time da semana com os melhores avaliados da última pelada, desenhado no campo",
          "Pendências pessoais: mensalidade do mês e taxas dos convidados que ele levou",
          "Saldo do grupo e os próprios lançamentos, para o caixa ser transparente para todos",
        ],
      },
      {
        titulo: "Elenco e contas de acesso",
        tela: "/projetos/pelada-sofredores/05-elenco.webp",
        itens: [
          "Jogadores em cards no estilo FIFA, com posição, camisa, mensalidade, status e overall",
          "Contas de acesso separadas do cadastro de jogador, com vínculo entre os dois",
          "Reset de senha e senha temporária, que obriga a troca no primeiro acesso",
          "Cadastro público: a conta só vota depois que um administrador a vincula a um jogador do elenco",
        ],
      },
    ],
    qualidade: [
      "62 testes com pytest, com o balanceador de times testado isoladamente",
      "CI no GitHub Actions a cada PR: lint, format, migrations, system checks, pytest, ESLint, typecheck e build",
      "Testes de ponta a ponta com Playwright, que sobem backend e frontend e rodam o seed antes",
      "Hooks de pre-commit com Ruff, Prettier, ESLint e checagem de chave privada",
      "Docker Compose com PostgreSQL, backend e frontend; deploy no Render com checklist de staging versionado",
    ],
    decisoes: [
      {
        titulo: "Busca exata até onde ela cabe",
        texto:
          "O balanceador distribui os confirmados buscando o menor desnível possível, considerando o overall de cada jogador e o equilíbrio de defensivos. Até 16 jogadores faz busca exata com backtracking; acima disso cai para heurística gulosa com refinamento por troca de pares. Nos prints o desnível médio ficou em 0,25 ponto.",
      },
      {
        titulo: "Snapshot em vez de recálculo retroativo",
        texto:
          "O overall usado no sorteio fica congelado na presença daquela pelada. O passado não muda quando o presente muda: histórico que se reescreve sozinho é histórico que mente.",
      },
      {
        titulo: "Estorno em vez de delete",
        texto:
          "Lançamento errado vira VOIDED e continua auditável. Todo valor monetário é Decimal, nunca float.",
      },
      {
        titulo: "Monolito de propósito",
        texto:
          "O público real são algumas dezenas de pessoas. Nada de microsserviço, fila ou cache distribuído: o custo apareceria e o benefício não. A separação acontece onde importa: o cálculo de balanceamento vive em módulo próprio, testado isoladamente.",
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
        src: "/projetos/pelada-sofredores/01-dashboard-financeiro.webp",
        alt: "Peladinhas Sofredores: dashboard financeiro com saldo, pendências, adimplência e convidados a pagar",
      },
      {
        src: "/projetos/pelada-sofredores/02-times-sorteados.webp",
        alt: "Peladinhas Sofredores: pelada do dia com os dois times sorteados pelo algoritmo, escalados em campo",
      },
      {
        src: "/projetos/pelada-sofredores/03-ranking.webp",
        alt: "Peladinhas Sofredores: ranking com pódio e tabela de overall por faixa",
      },
      {
        src: "/projetos/pelada-sofredores/04-portal-do-jogador.webp",
        alt: "Peladinhas Sofredores: portal do jogador com overall, gráfico de evolução e time da semana",
      },
      {
        src: "/projetos/pelada-sofredores/05-elenco.webp",
        alt: "Peladinhas Sofredores: elenco em cards no estilo FIFA, com posição, status e overall",
      },
      {
        src: "/projetos/pelada-sofredores/06-pre-jogo.webp",
        alt: "Peladinhas Sofredores: pré-jogo com a pelada ativa, lista de presença e histórico de peladas",
      },
      {
        src: "/projetos/pelada-sofredores/07-notas.webp",
        alt: "Peladinhas Sofredores: votação de notas da rodada com contagem regressiva e log de votos",
      },
    ],
    mobile: [
      {
        src: "/projetos/pelada-sofredores/mobile-01-votacao.webp",
        alt: "Peladinhas Sofredores no celular: votação de notas, um jogador por vez, com slider e contagem regressiva",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-02-dashboard.webp",
        alt: "Peladinhas Sofredores no celular: dashboard financeiro do grupo",
      },
      {
        src: "/projetos/pelada-sofredores/mobile-03-pre-jogo.webp",
        alt: "Peladinhas Sofredores no celular: pré-jogo com a pelada ativa e a lista de presença",
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
    slug: "myvitri",
    titulo: "MyVitri",
    subtitulo:
      "Vitrine pública onde creators juntam os cupons, produtos e kits que indicam num link só, para a bio.",
    eixo: "plataforma",
    natureza: "autoral",
    status: "no-ar",
    origem: "Cofundador",
    periodo: "Nov 2026 → atual",
    problema:
      "Creator que divulga marca responde o dia inteiro \"qual é o cupom?\" e \"onde compra?\". Os códigos ficam espalhados em stories que somem em 24 horas, e ninguém sabe qual indicação está dando resultado.",
    solucao:
      "Plataforma em que a creator monta uma vitrine com os cupons das marcas, os produtos que usa, com o preço já calculado com o desconto, e kits. A vitrine fica num link curto (myvitri.com/seunome) para a bio do Instagram e do TikTok. O seguidor copia o cupom e vai direto para a loja oficial; o MyVitri não vende nada. A creator ainda tem uma página de métricas com visitas, cliques e cupons copiados.",
    fluxo: [
      {
        titulo: "Criar",
        texto: "A creator escolhe nome e link e entra com e-mail e senha ou com o Google.",
      },
      {
        titulo: "Montar",
        texto: "No editor, cadastra cupons, importa produtos colando o link da loja e monta kits. O rascunho se salva sozinho.",
      },
      {
        titulo: "Publicar",
        texto: "Um clique grava a vitrine inteira de uma vez, numa transação do Postgres.",
      },
      {
        titulo: "Divulgar",
        texto: "O link vai para a bio, com imagem para stories e prévia de link geradas pelo servidor.",
      },
      {
        titulo: "Medir",
        texto: "Cada visita e cada clique vira um evento anônimo, e a página de métricas mostra o que funciona.",
      },
    ],
    funcionalidades: [
      {
        titulo: "Vitrine pública",
        tela: "/projetos/myvitri/02-vitrine.webp",
        itens: [
          "Link curto por creator, com capa, foto, chamada e atalhos para cupons, produtos e kits",
          "Cupom com o código à mostra e um botão que copia e já abre a loja oficial da marca",
          "Produtos com o preço já calculado com o cupom ligado a eles, filtro por categoria e busca",
          "Favoritar e comentar pedem login, mas não pedem vitrine: quem segue também tem conta",
        ],
      },
      {
        titulo: "Página inicial e descoberta",
        tela: "/projetos/myvitri/04-categorias.webp",
        itens: [
          "A página inicial reúne as vitrines, os cupons que estão valendo, os produtos por categoria e as marcas",
          "Cada produto mostra quem o indica e leva para a vitrine dessa pessoa",
          "Busca sem acento em creators, marcas e produtos, ordenada por igual, começa com, contém e semelhança",
          "Ranking das vitrines mais clicadas do dia, no fuso de São Paulo",
        ],
      },
      {
        titulo: "Editor e publicação",
        itens: [
          "Rascunho salvo sozinho 800 ms depois da última mudança, separado da vitrine no ar",
          "Importação de produto colando o link da loja: nome, marca, foto, preço e se está esgotado",
          "Busca automática do logo da marca no site da loja",
          "Publicar valida tudo com Zod e grava a vitrine inteira numa transação só",
        ],
      },
      {
        titulo: "Métricas para a creator",
        itens: [
          "Visitas, cliques para a loja e cupons copiados em 7, 30 ou 90 dias",
          "Variação contra o período anterior de mesma duração, gráfico dia a dia e funil",
          "Produtos mais clicados, cupons mais copiados e posição entre as vitrines do dia",
          "Avisos de cupom vencendo em até 7 dias e de produto esgotado, com atalho para o editor",
        ],
      },
      {
        titulo: "Conta e acesso",
        tela: "/projetos/myvitri/07-criar-vitrine.webp",
        itens: [
          "Criar a conta e a vitrine na mesma tela, com e-mail e senha ou com o Google",
          "Confirmação de e-mail e troca de senha por link, com PKCE",
          "Depois de entrar, a pessoa volta para a página em que clicou em Entrar",
          "Mensagens de erro que não revelam se um e-mail está cadastrado",
        ],
      },
    ],
    decisoes: [
      {
        titulo: "Autorização no banco, não na aplicação",
        texto:
          "Toda tabela tem Row Level Security, e o app nunca usa chave de serviço: só a chave publicável, com a sessão de quem está logado. Cada Server Action confere a sessão antes de mexer em dado, e a RLS é a segunda barreira. Se um dia uma action esquecer a checagem, o Postgres ainda recusa.",
      },
      {
        titulo: "Rascunho separado e publicação atômica",
        texto:
          "A creator edita um rascunho que se salva sozinho numa tabela própria, sem tocar na vitrine que os seguidores estão vendo. Publicar chama uma função do Postgres que troca cupons, produtos e kits numa transação só, na ordem que as chaves estrangeiras exigem. Ou a vitrine nova entra inteira, ou nada muda.",
      },
      {
        titulo: "Cache por tag, invalidado ao publicar",
        texto:
          "A vitrine pública é lida com \"use cache\" do Next 16 e fica em cache por horas, porque só muda quando a creator publica, e a publicação invalida a tag daquela vitrine. A leitura cacheada usa um cliente do Supabase sem cookies, já que o resultado é o mesmo para todos os visitantes. O ranking do dia muda a cada clique, então expira em minutos.",
      },
      {
        titulo: "Importar produto sem abrir a rede interna",
        texto:
          "Colar um link faz o servidor baixar uma página que o usuário escolheu, o que é SSRF esperando acontecer. Antes de cada requisição, e de novo a cada redirecionamento, o servidor resolve o DNS e recusa endereço privado, com teto de 3 redirecionamentos e 1,5 MB. A leitura tenta JSON-LD, depois as metatags Open Graph, depois a Brave Search quando a loja bloqueia robôs, e por fim só o que o endereço diz.",
      },
      {
        titulo: "Métricas anônimas sem expor números alheios",
        texto:
          "O evento sai do navegador por sendBeacon e só entra no banco se a vitrine existir e o horário estiver a um minuto do relógio do servidor. Só a dona lê os eventos da própria vitrine; o ranking público passa por uma função que devolve a ordem das vitrines, nunca as contagens.",
      },
      {
        titulo: "O autor do comentário nunca vem do cliente",
        texto:
          "Um trigger do Postgres preenche autor, nome, foto e data a partir do token da sessão, ignorando o que o navegador mandou, e recusa o sexto comentário da mesma pessoa no mesmo minuto.",
      },
    ],
    qualidade: [
      "TypeScript strict, com o conteúdo da vitrine validado por schema Zod antes de publicar",
      "Row Level Security em todas as tabelas e nos buckets do Storage, sem chave de serviço no app",
      "Proteção contra SSRF em toda requisição que o servidor faz a um endereço vindo do usuário",
      "14 migrações SQL versionadas, aplicadas em ordem",
      "No ar na Vercel, com banco, login e arquivos no Supabase",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Zod",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "Supabase Auth",
      "sharp",
      "Brave Search API",
      "Vercel",
    ],
    numeros: [
      { valor: "~13k", rotulo: "linhas de código" },
      { valor: "14", rotulo: "migrações SQL" },
      { valor: "0", rotulo: "chaves de serviço no app" },
    ],
    desktop: [
      {
        src: "/projetos/myvitri/01-landing.webp",
        alt: "MyVitri: página inicial com a chamada \"Indicado por gente. Não pelo algoritmo.\" e os botões de criar e explorar vitrines",
      },
      {
        src: "/projetos/myvitri/02-vitrine.webp",
        alt: "MyVitri: vitrine pública de uma creator, com capa, foto, chamada e o botão de favoritar",
      },
      {
        src: "/projetos/myvitri/03-vitrine-produtos.webp",
        alt: "MyVitri: produtos da vitrine, com filtro por categoria e busca",
      },
      {
        src: "/projetos/myvitri/07-criar-vitrine.webp",
        alt: "MyVitri: criar a vitrine com nome, link, e-mail e senha ou com o Google",
      },
      {
        src: "/projetos/myvitri/04-categorias.webp",
        alt: "MyVitri: produtos por categoria na página inicial, cada um com quem o indica",
      },
      {
        src: "/projetos/myvitri/05-cupons.webp",
        alt: "MyVitri: cupons que estão valendo agora, com a creator que divulga cada um",
      },
      {
        src: "/projetos/myvitri/06-marcas.webp",
        alt: "MyVitri: marcas indicadas e o melhor cupom de cada uma",
      },
      {
        src: "/projetos/myvitri/08-entrar.webp",
        alt: "MyVitri: entrar com e-mail e senha ou com o Google",
      },
    ],
    mobile: [
      {
        src: "/projetos/myvitri/mobile-01-landing.webp",
        alt: "MyVitri no celular: página inicial",
      },
      {
        src: "/projetos/myvitri/mobile-02-vitrine.webp",
        alt: "MyVitri no celular: vitrine pública de uma creator",
      },
      {
        src: "/projetos/myvitri/mobile-03-vitrine-cupons.webp",
        alt: "MyVitri no celular: cupom com o botão de copiar e ir para a loja, e os produtos logo abaixo",
      },
      {
        src: "/projetos/myvitri/mobile-04-criar-vitrine.webp",
        alt: "MyVitri no celular: criar a vitrine",
      },
    ],
    url: "https://www.myvitri.com/",
  },
  {
    slug: "agentes-autonomos-langgraph",
    titulo: "Agentes autônomos e chatbots com LLM",
    subtitulo: "Agentes em LangChain e LangGraph integrados a fluxos de trabalho empresariais.",
    eixo: "agentes",
    natureza: "cliente",
    status: "confidencial",
    origem: "Clientes · trabalho autônomo",
    periodo: "Jan 2024 → Ago 2025",
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
    titulo: "SigAMAES, plataforma do LabES/UFES",
    subtitulo: "Liderança técnica de uma plataforma feita para ser mantida por quem vem depois.",
    eixo: "plataforma",
    natureza: "academico",
    status: "confidencial",
    origem: "Projeto de extensão · LabES/UFES",
    periodo: "Fev 2025 → Jan 2026",
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
    periodo: "Ago 2025 → Mar 2026",
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

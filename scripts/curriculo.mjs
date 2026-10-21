/**
 * Gera o curriculo em PDF publicado em /public.
 *
 *   npm run curriculo
 *
 * Por que isto existe: o PDF original era compilado em LaTeX no Overleaf, sem
 * fonte nenhum versionado aqui. Resultado: o site dizia "Engenheiro de IA" e o
 * arquivo que o recrutador baixava dizia "Desenvolvedor Backend", e nao havia
 * como corrigir um sem reabrir o outro em outro lugar. Agora o conteudo mora no
 * repositorio, ao lado do site, e o PDF e reproduzivel.
 *
 * O desenho segue o template LaTeX anterior: nome centralizado em versalete,
 * linha de contato, secoes com regua, e cada entrada em duas linhas (cargo e
 * local em negrito, funcao e periodo em italico). A fonte e Times no lugar da
 * Computer Modern do LaTeX — e a serifada mais proxima entre as 14 padrao do
 * PDF, que dispensam embutir arquivo de fonte.
 *
 * Regra de conteudo (design.md §17): tudo aqui vem do curriculo real. Nada de
 * numero ou atribuicao que nao se sustente numa entrevista.
 */

import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import PDFDocument from "pdfkit";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = path.join(RAIZ, "public", "hugo-otoch-engenheiro-de-ia.pdf");

/* ── Conteudo ────────────────────────────────────────────────────────────── */

const cabecalho = {
  nome: "HUGO LIMA OTOCH DEMETRIO DE SOUZA",
  // O headline que faltava: sem ele, recrutador filtrando por IA nao encontra
  // nada — todos os cargos abaixo sao "Desenvolvedor".
  titulo: "Engenheiro de IA · Agentes, LLMs e automação em produção",
  contato: [
    "Vitória, Espírito Santo",
    "otochdev@gmail.com",
    "linkedin.com/in/hugootoch",
    "github.com/hugootoch",
  ],
};

const experiencia = [
  {
    organizacao: "Tech Solutio",
    local: "Remoto",
    funcao: "Engenheiro de IA (Pleno)",
    periodo: "Mar 2026 - Atual",
    marcas: [
      "Integro modelos de Inteligência Artificial para conduzir interações autônomas com clientes inadimplentes.",
      "Respondo pela arquitetura e escala de ponta a ponta de uma plataforma de IA voltada para automação de negociações e cobranças.",
      "Implementei fluxos assíncronos de alta performance e gerenciamento de tarefas em segundo plano utilizando Celery.",
      "Gerencio infraestrutura e banco de dados, utilizando Docker para conteinerização e MSSQL para modelagem de dados relacionais.",
    ],
  },
  {
    organizacao: "Seer",
    local: "Remoto",
    funcao: "Desenvolvedor Backend",
    periodo: "Ago 2025 - Mar 2026",
    marcas: [
      "Desenvolvi e gerenciei APIs robustas utilizando Django para a geração automatizada de dashboards e relatórios estratégicos.",
      "Implementei processos complexos de ETL para integração de dados de múltiplas fontes, otimizando a disponibilidade de informações para tomada de decisão.",
      "Estruturei o backend para suportar grandes volumes de dados, focando em performance de consultas e integridade das informações processadas.",
    ],
  },
  {
    organizacao: "Freelancer",
    local: "Remoto",
    funcao: "Desenvolvedor de IA e RPA",
    periodo: "Jan 2024 - Ago 2025",
    marcas: [
      "Projetei e implementei agentes autônomos de IA e chatbots avançados utilizando LangChain e LangGraph, integrando modelos de LLM a fluxos de trabalho empresariais.",
      "Desenvolvi automações de RPA com Selenium para coleta de dados em larga escala, reduzindo o tempo de processamento manual em tarefas repetitivas.",
    ],
  },
  {
    organizacao: "Vixteam",
    local: "Vitória, ES",
    funcao: "Estagiário em Desenvolvimento e Análise de Dados",
    periodo: "Jun 2022 - Jun 2023",
    marcas: [
      "Criei dashboards interativos no PowerBI integrados a scripts Python para análise preditiva de dados corporativos.",
      "Auxiliei no desenvolvimento de sistemas web utilizando Angular no frontend e arquiteturas .NET/Spring no backend.",
    ],
  },
];

const lideranca = [
  {
    organizacao: "SigAMAES - LabES (UFES)",
    local: "Vitória, ES",
    funcao: "Desenvolvedor Full Stack (Projeto de Extensão)",
    periodo: "Fev 2025 - Jan 2026",
    marcas: [
      "Liderei o desenvolvimento técnico do website do projeto SigAMAES utilizando Spring Boot e Next.js, garantindo a entrega de uma plataforma escalável para o projeto.",
      "Coordenei a integração de funcionalidades entre o frontend e backend, aplicando práticas de Clean Code e facilitando a manutenção futura por outros estudantes.",
      "Atuei como foco técnico dentro do Laboratório de Engenharia de Software (LabES), orientando a arquitetura da solução baseada em requisitos reais.",
    ],
  },
];

/** `IA & Agentes` vem primeiro: a ordem da lista e a ordem da candidatura. */
const habilidades = [
  {
    grupo: "IA & Agentes",
    itens:
      "Agentes de IA (LangChain, LangGraph), RAG, Engenharia de Prompt, Integração de LLMs via API, Saída estruturada por schema, Cache de prompt.",
  },
  {
    grupo: "Backend & Arquitetura",
    itens:
      "Python, Django, Flask, Django Rest Framework (DRF), Arquitetura Limpa, Design Patterns, Mensageria (Celery/RabbitMQ), Testes Unitários e de Integração (Pytest).",
  },
  {
    grupo: "Dados e Infraestrutura",
    itens:
      "PostgreSQL, MSSQL, Redis, Processos de ETL, Docker, Git, CI/CD (GitHub Actions), Swagger/OpenAPI.",
  },
  {
    grupo: "Automação / RPA",
    itens: "Selenium, Playwright, n8n, Make.",
  },
  {
    grupo: "Idiomas",
    itens: "Português (Nativo), Inglês (Intermediário - B1).",
  },
];

const educacao = {
  instituicao: "Universidade Federal do Espírito Santo (UFES)",
  local: "Vitória, ES",
  curso: "Bacharelado em Engenharia de Computação",
  periodo: "Concluído em Fev 2026",
};

/* ── Desenho ─────────────────────────────────────────────────────────────── */

const MARGEM = 46;
const LARGURA = 595.28 - MARGEM * 2;

const COR_TEXTO = "#000000";
const COR_REGUA = "#777777";

/**
 * Corpo em 10.3pt. O limite real e caber numa pagina so: o PDF anterior
 * derramava quatro linhas para a pagina 2, o que e pior do que apertar o corpo.
 * Se alguma entrada nova estourar, baixe daqui antes de mexer nas margens.
 */
const P = 9.9;

function regua(doc, y) {
  doc
    .moveTo(MARGEM, y)
    .lineTo(MARGEM + LARGURA, y)
    .lineWidth(0.6)
    .strokeColor(COR_REGUA)
    .stroke();
}

function secao(doc, titulo) {
  doc.moveDown(0.55);
  doc.font("Times-Bold").fontSize(13).fillColor(COR_TEXTO).text(titulo, MARGEM, doc.y);
  regua(doc, doc.y + 1.5);
  doc.moveDown(0.45);
}

/** Linha com texto a esquerda e texto a direita, na mesma altura. */
function linhaDupla(doc, esquerda, direita, { fonte, tamanho }) {
  const y = doc.y;
  doc.font(fonte).fontSize(tamanho).fillColor(COR_TEXTO);
  doc.text(esquerda, MARGEM, y, { width: LARGURA * 0.68, lineBreak: false });
  doc.text(direita, MARGEM, y, { width: LARGURA, align: "right", lineBreak: false });
  doc.y = y + doc.currentLineHeight() + 1;
}

function entrada(doc, item) {
  linhaDupla(doc, item.organizacao, item.local, { fonte: "Times-Bold", tamanho: 10.9 });
  linhaDupla(doc, item.funcao, item.periodo, { fonte: "Times-Italic", tamanho: 9.9 });

  doc.moveDown(0.18);
  doc.font("Times-Roman").fontSize(P).fillColor(COR_TEXTO);
  for (const marca of item.marcas) {
    const y = doc.y;
    doc.text("•", MARGEM + 8, y, { lineBreak: false });
    doc.text(marca, MARGEM + 20, y, {
      width: LARGURA - 20,
      align: "justify",
      lineGap: 0.6,
    });
    doc.moveDown(0.13);
  }
  doc.moveDown(0.36);
}

function gerar() {
  const doc = new PDFDocument({
    // bufferPages deixa contar as paginas antes de fechar o arquivo.
    bufferPages: true,
    size: "A4",
    margins: { top: MARGEM, bottom: MARGEM, left: MARGEM, right: MARGEM },
    info: {
      Title: "Currículo - Hugo Lima Otoch",
      Author: "Hugo Lima Otoch",
      Subject: "Engenheiro de IA",
      Keywords:
        "Engenheiro de IA, AI Engineer, LangChain, LangGraph, RAG, LLM, Python, Django, Celery, Docker",
    },
  });

  doc.pipe(createWriteStream(SAIDA));

  /* Cabecalho */
  doc
    .font("Times-Bold")
    .fontSize(19)
    .fillColor(COR_TEXTO)
    .text(cabecalho.nome, MARGEM, MARGEM, { width: LARGURA, align: "center", characterSpacing: 0.4 });

  doc.moveDown(0.3);
  doc
    .font("Times-Bold")
    .fontSize(11.2)
    .text(cabecalho.titulo, MARGEM, doc.y, { width: LARGURA, align: "center" });

  doc.moveDown(0.3);
  doc
    .font("Times-Roman")
    .fontSize(9.2)
    .text(cabecalho.contato.join("  •  "), MARGEM, doc.y, { width: LARGURA, align: "center" });

  doc.moveDown(0.25);

  /* Experiencia vem antes da lideranca: o cargo atual e de IA, e e ele que
     precisa aparecer primeiro para quem esta contratando IA. */
  secao(doc, "Experiência");
  for (const item of experiencia) entrada(doc, item);

  secao(doc, "Atividades de Liderança");
  for (const item of lideranca) entrada(doc, item);

  secao(doc, "Habilidades");
  doc.font("Times-Roman").fontSize(P).fillColor(COR_TEXTO);
  for (const bloco of habilidades) {
    const y = doc.y;
    doc.text("•", MARGEM + 8, y, { lineBreak: false });
    doc
      .font("Times-Bold")
      .text(`${bloco.grupo}: `, MARGEM + 20, y, { continued: true, width: LARGURA - 20 })
      .font("Times-Roman")
      .text(bloco.itens, { align: "justify", lineGap: 0.6 });
    doc.moveDown(0.2);
  }

  secao(doc, "Educação");
  linhaDupla(doc, educacao.instituicao, educacao.local, { fonte: "Times-Bold", tamanho: 10.9 });
  linhaDupla(doc, educacao.curso, educacao.periodo, { fonte: "Times-Italic", tamanho: 9.9 });

  const { count } = doc.bufferedPageRange();
  if (count !== 1) {
    throw new Error(
      `O currículo saiu com ${count} páginas. Uma página é requisito: reduza P ` +
        `em scripts/curriculo.mjs ou corte conteúdo antes de mexer nas margens.`,
    );
  }

  doc.flushPages();
  doc.end();
}

await mkdir(path.dirname(SAIDA), { recursive: true });
gerar();
console.log(`Currículo gerado em ${path.relative(RAIZ, SAIDA)}`);

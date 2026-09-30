/**
 * Fonte de verdade do conteudo — design.md §0 e §17.
 * Nada no site pode afirmar algo que nao esteja aqui.
 */

export const site = {
  nome: "Hugo Otoch",
  nomeCompleto: "Hugo Lima Otoch Demetrio de Souza",
  titulo: "Desenvolvedor Fullstack & Engenheiro de IA",
  base: "Vitória, ES",
  baseCompleta: "Vitória, Espírito Santo · Remoto",
  coordenadas: { lat: -20.32, lon: -40.34 },
  url: "https://hugootoch.dev",
  email: "otochdev@gmail.com",
  github: "https://github.com/hugootoch",
  linkedin: "https://linkedin.com/in/hugootoch",
  // TODO: preencher — unico dado que falta (design.md §0)
  whatsapp: "" as string,
  // Foto do hero e do setor Operador. Vazio = placa de neon com o monograma.
  foto: "/otoch.png" as string,
  formacao: "Engenharia de Computação — UFES",
  idiomas: "Português (nativo) · Inglês (B1)",
  tagline: "Sistemas que trabalham enquanto você dorme.",
  lead: "Sites, automações RPA e agentes de IA para empresas que não podem esperar.",
  disponivel: true,
} as const;

export type ServicoId = "web" | "rpa" | "ia";

export type Servico = {
  id: ServicoId;
  codinome: string;
  nome: string;
  glifo: string;
  /** Token de cor correspondente em tokens.css */
  cor: "magenta" | "violet" | "crimson";
  vitrine: string;
  /** 4 itens curtos, em mono. So o que existe no arsenal real (§17). */
  itens: readonly string[];
};

/** design.md §1.4 — a tripla cor/glifo/codinome se repete em todo o site. */
export const servicos: readonly Servico[] = [
  {
    id: "web",
    codinome: "WEB//CRAFT",
    nome: "Sites & Landing Pages",
    glifo: "◤",
    cor: "magenta",
    vitrine: "Presença digital que converte — não que só existe.",
    itens: [
      "Next.js · React · TypeScript",
      "Landing de alta conversão",
      "SEO técnico e performance",
      "Deploy, domínio e manutenção",
    ],
  },
  {
    id: "rpa",
    codinome: "AUTO//FLOW",
    nome: "Automações RPA",
    glifo: "⟳",
    cor: "violet",
    vitrine: "Processo manual vira rotina que não erra e não dorme.",
    itens: [
      "Selenium · n8n · Make",
      "Coleta de dados em larga escala",
      "Processos de ETL e relatórios",
      "Integração entre sistemas",
    ],
  },
  {
    id: "ia",
    codinome: "AGENT//CORE",
    nome: "Agentes de IA",
    glifo: "◈",
    cor: "crimson",
    vitrine: "Agentes que executam tarefas reais, com ferramentas e memória.",
    itens: [
      "LangChain · LangGraph",
      "RAG sobre os seus próprios dados",
      "Integração de LLMs via API",
      "Atendimento e triagem automatizados",
    ],
  },
] as const;

/** Faixas do formulario — design.md §8.5. */
export const faixasOrcamento = ["< R$ 5k", "R$ 5k – 15k", "R$ 15k+", "A definir"] as const;

/** Canais diretos — design.md §9.7. */
export const canais = [
  { rotulo: "E-mail", valor: site.email, href: `mailto:${site.email}` },
  { rotulo: "GitHub", valor: "github.com/hugootoch", href: site.github },
  { rotulo: "LinkedIn", valor: "linkedin.com/in/hugootoch", href: site.linkedin },
] as const;

/** design.md §9.7 — microgarantias abaixo do formulario. */
export const garantias = [
  "Resposta em até 24h",
  "Orçamento sem compromisso",
  "Atendimento fora do horário comercial",
  "NDA se precisar",
] as const;

export const nav = [
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Processo", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
] as const;

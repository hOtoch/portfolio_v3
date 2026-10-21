import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/fx/Grain";
import { Scanlines } from "@/components/fx/Scanlines";
import { CursorMultifollow } from "@/components/ui/motion-cursor-multifollow";
import { RevealObserver } from "@/components/fx/RevealObserver";
import "@/styles/globals.css";

/* Fontes — design.md §4.1. Self-hosted pelo next/font, subset latin, display swap. */
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nome} — ${site.titulo}`,
  description:
    "Engenheiro de IA pleno: agentes, LLMs e automação em produção, com o backend que sustenta. Engenharia de Computação pela UFES. Vitória/ES e remoto.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nome,
    title: `${site.nome} — ${site.titulo}`,
    description: site.lead,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} — ${site.titulo}`,
    description: site.lead,
  },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#07060D",
  colorScheme: "dark",
};

/* design.md §13.4 — JSON-LD.
   v4: saiu o no ProfessionalService (negocio que vende servico) — sinal errado
   para quem busca vaga. Ficou so Person, com formacao, idiomas e o cargo que
   esta sendo procurado. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.nome,
      alternateName: site.nomeCompleto,
      jobTitle: `${site.titulo} ${site.nivel}`,
      email: `mailto:${site.email}`,
      url: site.url,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universidade Federal do Espírito Santo",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vitória",
        addressRegion: "ES",
        addressCountry: "BR",
      },
      sameAs: [site.github, site.linkedin],
      knowsAbout: [
        "Agentes de IA",
        "LangChain",
        "LangGraph",
        "RAG",
        "Engenharia de Prompt",
        "Integração de LLMs",
        "Python",
        "Django",
        "Celery",
        "Docker",
        "PostgreSQL",
      ],
      knowsLanguage: [
        { "@type": "Language", name: "Português" },
        { "@type": "Language", name: "Inglês" },
      ],
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Bacharelado",
        name: "Engenharia de Computação",
        educationalLevel: "Bachelor's degree",
      },
      seeks: {
        "@type": "Demand",
        name: `Vaga de ${site.titulo} ${site.nivel}`,
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${chakra.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <a
          href="#conteudo"
          className="sr-only rounded-md bg-magenta px-4 py-2 font-mono text-sm text-void focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Pular para o conteúdo
        </a>

        {/* Progresso do scroll — scroll-driven em CSS, sem listener */}
        <div
          aria-hidden="true"
          className="barra-progresso fixed inset-x-0 top-0 h-0.5"
          // Acima da nav: com o mesmo z-index a navbar pinta por cima e some
          // com o filete de 1px que fica embaixo dela.
          style={{ zIndex: "var(--z-overlay)", background: "var(--grad-brand)" }}
        />

        <Nav />
        <main id="conteudo">{children}</main>
        <Footer />

        {/* Overlays de cenario — sempre por cima, nunca clicaveis */}
        <Grain />
        <Scanlines />
        <CursorMultifollow />
        <RevealObserver />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

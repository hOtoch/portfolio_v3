import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Abertura } from "@/components/layout/Abertura";
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
    "Sites e landing pages, automações RPA e agentes de IA. Engenheiro de computação (UFES) com 4 anos construindo sistemas em produção. Vitória/ES e remoto.",
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

/* design.md §13.4 — JSON-LD Person + ProfessionalService */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.nome,
      alternateName: site.nomeCompleto,
      jobTitle: site.titulo,
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
        "Python",
        "Django",
        "Next.js",
        "LangChain",
        "LangGraph",
        "RAG",
        "RPA",
        "Selenium",
        "Celery",
        "Docker",
        "PostgreSQL",
      ],
    },
    {
      "@type": "ProfessionalService",
      name: site.nome,
      description: site.lead,
      url: site.url,
      areaServed: "BR",
      serviceType: ["Desenvolvimento web", "Automação RPA", "Agentes de IA"],
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
        <Abertura />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

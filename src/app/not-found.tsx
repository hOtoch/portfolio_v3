import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

/**
 * design.md §10 — "SETOR NÃO MAPEADO".
 * Fica no root com layout único, então herda tema, fontes, nav e footer;
 * `global-not-found` só faria sentido com múltiplos root layouts.
 */
export const metadata: Metadata = {
  title: "Setor não mapeado — 404",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden py-(--spacing-section)">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: "var(--z-bg)", background: "var(--grad-sky)", opacity: 0.5 }}
      />

      <div
        className="mx-auto w-full max-w-(--container-site) px-(--spacing-gutter)"
        style={{ position: "relative", zIndex: "var(--z-content)" }}
      >
        <p className="kicker flex items-center gap-3 text-text-dim">
          <span className="text-text-mute">[ 404 ]</span>
          <span className="text-crimson">Sinal perdido</span>
        </p>

        <h1 className="mt-6 uppercase">
          Setor não <span className="neon">mapeado</span>
        </h1>

        <p className="mt-8 max-w-[52ch] text-[length:var(--text-step-1)] text-text">
          Esse endereço não existe nesta cidade. Pode ser um link velho, pode ser um erro de
          digitação — de qualquer forma, a rua principal continua aberta.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/">Voltar ao início</Button>
          <Button href="/#contato" variante="secundario" seta>
            Falar comigo
          </Button>
        </div>
      </div>
    </section>
  );
}

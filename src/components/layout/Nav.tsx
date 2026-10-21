"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

/** design.md §8.1 — "Placa de rua". Encolhe e acende a borda apos 80px de scroll. */
export function Nav() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Setor ativo: marca o item da nav do trecho da rua em que o visitante esta.
  // rootMargin puxa a linha de deteccao para o meio da tela, entao o item so
  // troca quando a secao realmente domina a viewport.
  useEffect(() => {
    const secoes = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    if (secoes.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setSetorAtivo(`#${visivel.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    secoes.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // Trava o scroll do body enquanto o menu mobile esta aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header
      className="fixed inset-x-0 top-0 border-b transition-all duration-[--dur-base] ease-[--ease-out]"
      style={{
        zIndex: "var(--z-sticky)",
        height: rolou ? 56 : 64,
        backgroundColor: "rgba(7,6,13,.72)",
        backdropFilter: "blur(16px)",
        borderBottomColor: rolou ? "rgba(255,45,143,.35)" : "var(--color-hairline)",
        boxShadow: rolou ? "0 1px 0 0 rgba(255,45,143,.18)" : "none",
      }}
    >
      <div className="mx-auto flex h-full max-w-(--container-site) items-center justify-between px-(--spacing-gutter)">
        {/* Marca */}
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.nome} — início`}>
          <span
            aria-hidden="true"
            className="tube chamfer grid size-8 place-items-center rounded-[2px] font-display text-xs font-bold text-magenta"
          >
            HO
          </span>
          <span className="font-display text-sm font-bold tracking-[0.08em] text-text-hi uppercase">
            {site.nome}
          </span>
        </Link>

        {/* Links — desktop */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={setorAtivo === item.href ? "true" : undefined}
                  className={`flex items-center gap-2 py-3.5 font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-[--dur-fast] hover:text-text-hi ${
                    setorAtivo === item.href ? "text-text-hi" : "text-text-dim"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-1 rounded-full transition-all duration-[--dur-base] ${
                      setorAtivo === item.href
                        ? "scale-100 bg-cyan [box-shadow:var(--glow-cyan)]"
                        : "scale-0 bg-transparent"
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Button href="#contato" className="px-5 py-2.5 text-xs">
            Falar comigo
          </Button>
        </div>

        {/* Alternador mobile */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          className="grid size-11 place-items-center rounded-md border border-hairline text-text-hi md:hidden"
        >
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          <span aria-hidden="true" className="font-mono text-lg leading-none">
            {aberto ? "✕" : "≡"}
          </span>
        </button>
      </div>

      {/* Menu mobile — full screen */}
      {aberto && (
        <div
          id="menu-mobile"
          className="fixed inset-0 top-[56px] bg-void px-(--spacing-gutter) pt-16 md:hidden"
          style={{ zIndex: "var(--z-overlay)" }}
        >
          <ul className="flex flex-col gap-6">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{
                  animation: `reveal-up var(--dur-slow) var(--ease-out) ${i * 60}ms both`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="font-display text-[var(--text-step-3)] font-bold text-text-hi uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button href="#contato" onClick={() => setAberto(false)}>
              Falar comigo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

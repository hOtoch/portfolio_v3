import Link from "next/link";
import { canais, nav, site } from "@/content/site";

/** design.md §9.8 — FIM DA RUA. Letreiro gigante sangrando pela borda inferior. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-void pt-(--spacing-bloco)">
      <div className="mx-auto max-w-(--container-site) px-(--spacing-gutter)">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center py-2 font-mono text-xs tracking-[0.12em] text-text-dim uppercase transition-colors duration-[--dur-fast] hover:text-text-hi"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {canais.map((canal) => (
              <li key={canal.rotulo}>
                <a
                  href={canal.href}
                  target={canal.href.startsWith("http") ? "_blank" : undefined}
                  rel={canal.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center py-2 font-mono text-xs tracking-[0.12em] text-text-dim uppercase transition-colors duration-[--dur-fast] hover:text-cyan"
                >
                  {canal.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="font-mono text-[0.7rem] tracking-[0.14em] text-text-mute uppercase">
            © {new Date().getFullYear()} {site.nome} · {site.base} · Construído em Night City
          </p>
          <p
            aria-hidden="true"
            className="font-mono text-[0.7rem] tracking-[0.2em] text-text-mute uppercase"
          >
            OtochLabs
          </p>
        </div>
      </div>

      {/* Letreiro sangrando para fora da tela */}
      <p
        aria-hidden="true"
        className="outline-text mt-6 -mb-[0.22em] truncate text-center font-display text-[clamp(4rem,16vw,14rem)] leading-none font-bold tracking-[-0.04em] uppercase select-none"
      >
        {site.nome}
      </p>
    </footer>
  );
}

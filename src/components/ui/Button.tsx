import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** design.md §8.2 — variantes e estados obrigatorios. */
type Variante = "primario" | "secundario" | "ghost";

const BASE =
  "group inline-flex items-center justify-center gap-2.5 font-mono text-sm font-semibold uppercase tracking-[0.1em] " +
  "transition-all duration-[--dur-base] ease-[--ease-snap] " +
  "disabled:pointer-events-none disabled:opacity-40";

const VARIANTES: Record<Variante, string> = {
  primario:
    "rounded-md bg-magenta px-7 py-3.5 text-void " +
    "hover:-translate-y-0.5 hover:[box-shadow:var(--glow-magenta)] active:translate-y-0",
  secundario:
    "rounded-md border border-hairline-hi bg-transparent px-7 py-3.5 text-text-hi " +
    "hover:border-magenta hover:bg-[rgba(255,45,143,0.06)] active:translate-y-0",
  ghost:
    "px-0 py-1 text-text-dim hover:text-text-hi " +
    "underline-offset-[6px] hover:underline decoration-magenta",
};

type Props = {
  variante?: Variante;
  seta?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "children">;

export function Button({ variante = "primario", seta = false, children, className = "", ...rest }: Props) {
  return (
    <Link className={`${BASE} ${VARIANTES[variante]} ${className}`} {...rest}>
      {children}
      {seta && (
        <span
          aria-hidden="true"
          className="transition-transform duration-[--dur-base] ease-[--ease-snap] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}

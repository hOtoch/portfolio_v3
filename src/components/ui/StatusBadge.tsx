/** design.md §8.6 — ponto pulsante + rotulo de disponibilidade. */
export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-sm border border-hairline bg-surface-3/60 px-3 py-1.5">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-ok"
        style={{ animation: "pulse-dot 2.4s var(--ease-in-out) infinite" }}
      />
      <span className="kicker text-text-dim">{children}</span>
    </span>
  );
}

/**
 * Scanlines sobre a pagina inteira — design.md §6.7.
 * Estatico (nao anima), entao permanece sob prefers-reduced-motion.
 */
export function Scanlines() {
  return (
    <div
      aria-hidden="true"
      data-fx="scanlines"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: "var(--z-fx)",
        background:
          "repeating-linear-gradient(180deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px)",
        opacity: 0.35,
      }}
    />
  );
}

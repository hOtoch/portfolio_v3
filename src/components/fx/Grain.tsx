/**
 * Grao de filme sobre a pagina inteira — design.md §6.6.
 * Decorativo: aria-hidden + pointer-events none. Sai sob prefers-reduced-motion.
 */

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")";

export function Grain() {
  return (
    <div
      aria-hidden="true"
      data-fx="grain"
      className="pointer-events-none fixed -inset-1/2"
      style={{
        zIndex: "var(--z-fx)",
        backgroundImage: NOISE_SVG,
        opacity: 0.055,
        animation: "grain-shift 1.1s steps(4) infinite",
      }}
    />
  );
}

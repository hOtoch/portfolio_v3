/**
 * Letreiro horizontal full-bleed — design.md §9.2.
 * O conteudo e duplicado para o loop ser continuo; a copia e aria-hidden.
 */
export function Marquee({
  itens,
  duracao = 40,
}: {
  itens: readonly string[];
  duracao?: number;
}) {
  const linha = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {itens.map((item) => (
        <li
          key={item}
          className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-bold uppercase tracking-[-0.02em] whitespace-nowrap outline-text [-webkit-text-stroke:1px_var(--color-text-mute)]"
        >
          {item}
          <span aria-hidden="true" className="ml-10 text-magenta/40">
            /
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="group relative flex overflow-hidden border-y border-hairline py-6"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duracao}s linear infinite`,
          willChange: "transform",
        }}
      >
        {linha}
        <div aria-hidden="true" className="flex">
          {linha}
        </div>
      </div>
    </div>
  );
}

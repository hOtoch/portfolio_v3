/** Cabecalho padrao de setor — design.md §9: numeracao mono + H2 display. */
export function SectionHeading({
  numero,
  setor,
  titulo,
  descricao,
  revelar = true,
}: {
  numero: string;
  setor: string;
  titulo: string;
  descricao?: string;
  /** Entra com a revelação no scroll (§7.2). */
  revelar?: boolean;
}) {
  return (
    <header className="max-w-[46ch]" {...(revelar ? { "data-reveal": "" } : {})}>
      <p className="kicker flex items-center gap-3 text-text-dim">
        <span className="text-text-mute">[ {numero} ]</span>
        <span className="text-cyan/80">{setor}</span>
      </p>
      <h2 className="mt-5">{titulo}</h2>
      {descricao && <p className="mt-5 max-w-[54ch] text-text">{descricao}</p>}
    </header>
  );
}

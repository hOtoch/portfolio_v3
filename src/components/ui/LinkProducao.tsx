import { cn } from "@/lib/utils";

/**
 * O endereço de produção ao lado do título do projeto: "myvitri.com ↗".
 * Mostra só o domínio, que é o que o recrutador reconhece e pode digitar.
 */
export function LinkProducao({ url, className }: { url: string; className?: string }) {
  const dominio = new URL(url).hostname.replace(/^www\./, "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-cyan/40 px-3.5 py-1.5 font-mono text-xs tracking-[0.06em] text-cyan transition-colors hover:border-cyan hover:bg-cyan/10",
        className,
      )}
    >
      {dominio}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(abre o projeto em produção numa nova aba)</span>
    </a>
  );
}

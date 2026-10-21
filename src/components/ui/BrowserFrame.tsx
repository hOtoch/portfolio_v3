import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Moldura de navegador com uma captura dentro — a contraparte do PhoneFrame
 * para projeto que vive no desktop (painel, CRM, dashboard).
 *
 * Mesma linguagem do site: surface/hairline, barra de titulo em mono, brilho
 * opcional na cor do eixo.
 *
 * Detalhe que motivou o componente: as capturas dos projetos autorais sao de
 * PAGINA INTEIRA (1440x4309 em um dos casos), nao de viewport. Entao a moldura
 * fixa a proporcao em 16:10 e ancora a imagem no topo (`object-top`), mostrando
 * a dobra em vez de espremer a pagina toda num retangulo ilegivel. `rolar`
 * desce a imagem no hover para quem quiser ver o resto sem sair da pagina.
 */

type Props = {
  src: string;
  alt: string;
  /** Endereço mostrado na barra. Sem link: projeto privado não tem URL. */
  rotulo?: string;
  /** rgba da cor do eixo para a sombra projetada. */
  brilho?: string;
  /** Desliza a captura inteira no hover. Para imagem de página inteira. */
  rolar?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function BrowserFrame({
  src,
  alt,
  rotulo,
  brilho,
  rolar = false,
  sizes = "(min-width: 1024px) 760px, 94vw",
  priority = false,
  className,
}: Props) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-xl border border-hairline-hi bg-surface-1",
        className,
      )}
      style={
        brilho
          ? { boxShadow: `0 40px 90px -40px ${brilho}, inset 0 1px 0 rgba(255,255,255,.06)` }
          : undefined
      }
    >
      {/* Barra de título */}
      <div className="flex items-center gap-3 border-b border-hairline px-3.5 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-hairline-hi" />
          <span className="size-2 rounded-full bg-hairline-hi" />
          <span className="size-2 rounded-full bg-hairline-hi" />
        </span>
        {rotulo && (
          <span className="truncate font-mono text-[0.62rem] tracking-[0.1em] text-text-mute">
            {rotulo}
          </span>
        )}
      </div>

      <div className="relative aspect-[16/10] overflow-hidden bg-void">
        <Image
          src={src}
          alt={alt}
          fill
          draggable={false}
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover object-top",
            // A captura inteira desliza para cima no hover, revelando o resto
            // da pagina. `object-cover` com altura automatica nao serve aqui:
            // a imagem e muito mais alta que a moldura.
            rolar &&
              "transition-[object-position] duration-[2800ms] ease-[--ease-out] group-hover:object-bottom motion-reduce:transition-none motion-reduce:group-hover:object-top",
          )}
        />
      </div>
    </figure>
  );
}

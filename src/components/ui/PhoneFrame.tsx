import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Moldura de celular com uma captura de tela dentro — surface/hairline e ilha
 * da câmera. O brilho na cor do serviço entra como sombra, quando houver.
 */

type Props = {
  src: string;
  alt: string;
  /** rgba da cor do serviço para a sombra projetada. */
  brilho?: string;
  sizes?: string;
  className?: string;
};

export function PhoneFrame({ src, alt, brilho, sizes = "(min-width: 1024px) 264px, 58vw", className }: Props) {
  return (
    <div
      className={cn("relative aspect-[390/844] rounded-[2.4rem] border border-hairline-hi bg-surface-1 p-2", className)}
      style={brilho ? { boxShadow: `0 40px 90px -40px ${brilho}, inset 0 1px 0 rgba(255,255,255,.06)` } : undefined}
    >
      <div className="relative h-full overflow-hidden rounded-[1.95rem] bg-void">
        <Image src={src} alt={alt} fill draggable={false} sizes={sizes} className="object-cover object-top" />
        {/* Ilha da câmera */}
        <span
          aria-hidden="true"
          className="absolute top-2 left-1/2 h-[1.15rem] w-[34%] -translate-x-1/2 rounded-full bg-void"
        />
      </div>
    </div>
  );
}

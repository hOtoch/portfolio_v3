import { Hero } from "@/components/sections/Hero";
import { Servicos } from "@/components/sections/Servicos";
import { Projetos } from "@/components/sections/Projetos";
import { Processo } from "@/components/sections/Processo";
import { Arsenal } from "@/components/sections/Arsenal";
import { Sobre } from "@/components/sections/Sobre";
import { Contato } from "@/components/sections/Contato";
import { Marquee } from "@/components/ui/Marquee";

const LETREIRO = [
  "Sites",
  "Landing pages",
  "RPA",
  "Agentes de IA",
  "Integrações",
  "APIs",
] as const;

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee itens={LETREIRO} />
      <Servicos />
      <Projetos />
      <Processo />
      <Arsenal />
      <Sobre />
      <Contato />
    </>
  );
}

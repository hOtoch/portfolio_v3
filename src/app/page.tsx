import { Hero } from "@/components/sections/Hero";
import { Atuacao } from "@/components/sections/Atuacao";
import { Projetos } from "@/components/sections/Projetos";
import { Percurso } from "@/components/sections/Percurso";
import { Arsenal } from "@/components/sections/Arsenal";
import { Sobre } from "@/components/sections/Sobre";
import { Contato } from "@/components/sections/Contato";
import { Marquee } from "@/components/ui/Marquee";
import { Abertura } from "@/components/layout/Abertura";

/**
 * Ordem dos setores — pensada para os ~90 segundos de leitura de um
 * recrutador: quem e (Hero) -> onde atua (Atuacao) -> prova (Projetos) ->
 * percurso (Trajetoria) -> profundidade (Arsenal) -> pessoa (Sobre) ->
 * contato.
 *
 * O setor MURO (depoimentos de cliente) fica fora desta versao: depoimento de
 * cliente nao move recrutador. O componente e a infra de convite continuam no
 * repositorio para voltar como recomendacao de colega ou tech lead.
 *
 * A <Abertura> mora aqui, e nao no layout: desde que os cases ganharam pagina
 * propria, deixa-la no layout fazia o recrutador esperar a cortina de glitch
 * de novo a cada case aberto. Quem usa `aoFimDaAbertura` e so o <NomeNeon>, no
 * hero, que tambem so existe nesta pagina.
 */

const LETREIRO = [
  "Agentes de IA",
  "LangGraph",
  "RAG",
  "Python",
  "Django",
  "Celery",
  "Docker",
  "Next.js",
] as const;

export default function Home() {
  return (
    <>
      <Abertura />
      <Hero />
      <Marquee itens={LETREIRO} />
      <Atuacao />
      <Projetos />
      <Percurso />
      <Arsenal />
      <Sobre />
      <Contato />
    </>
  );
}

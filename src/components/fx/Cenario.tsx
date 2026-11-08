/**
 * Cenário contínuo — a mesma rua da TV atrás do site inteiro.
 *
 * Uma camada fixa na janela, atrás do conteúdo (z-index -1), com três peças:
 *
 * - **Placa longe:** a rua bem desfocada. É o fundo das seções de texto.
 * - **Placa perto:** a mesma rua quase nítida. Entra conforme a TV chega e
 *   sai depois dela, como uma câmera puxando o foco para a TV e soltando.
 * - **Luzes:** uma mancha de neon por seção, na cor dela, que acende enquanto
 *   a seção passa. É a placa da esquina por onde se está andando.
 *
 * Tudo é animação ligada à rolagem em CSS (`view-timeline` das seções, ver
 * globals.css › "Cenário contínuo"), sem listener. Sem suporte (Firefox), fica
 * só a placa longe, parada.
 *
 * As placas saem de `public/cenario/rua.jpg`, a mesma cena da `tv.jpg` sem o
 * aparelho, reduzida a 1920px e desfocada (perto: raio 5; longe: raio 26), em
 * WebP. Se trocar a rua, gere as duas de novo com o mesmo desfoque.
 */

const LUZES = ["atuacao", "projetos", "trajetoria", "arsenal", "sobre", "contato"] as const;

export function Cenario() {
  return (
    <div aria-hidden="true" className="cenario">
      <div className="cenario-placa cenario-placa--longe" />
      <div className="cenario-placa cenario-placa--perto" />
      {LUZES.map((secao) => (
        <div key={secao} className={`cenario-luz cenario-luz--${secao}`} />
      ))}
      <div className="cenario-veu" />
    </div>
  );
}

import { ImageResponse } from "next/og";
import { eixos, site } from "@/content/site";

/**
 * Imagem social compartilhada por `opengraph-image` e `twitter-image`.
 *
 * Restrições do ImageResponse (node_modules/next/dist/docs/.../image-response.md):
 * só flexbox — nada de grid —, fontes em ttf/otf/woff e bundle de até 500KB.
 * Por isso o skyline aqui é uma fileira de divs, não um SVG.
 */

export const alt = `${site.nome} — ${site.titulo}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COR = { magenta: "#FF2D8F", violet: "#B14BFF", crimson: "#FF3355" } as const;

/**
 * Busca a Chakra Petch em ttf no build. Se a rede falhar, a imagem sai com a
 * fonte padrão do Satori — feia, mas melhor que quebrar o build.
 */
async function fonteDisplay(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700",
      // UA antigo faz o Google devolver ttf em vez de woff2, que o Satori não lê
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64)" } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/** Silhueta de prédios: alturas fixas para a imagem ser sempre idêntica. */
const PREDIOS = [
  34, 58, 44, 92, 66, 120, 78, 52, 104, 70, 136, 88, 60, 112, 46, 82, 128, 64, 96, 40,
  74, 118, 54, 86, 62, 108, 48, 90, 68, 124, 56, 100,
];

export async function imagemSocial() {
  const fonte = await fonteDisplay();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#07060D",
          backgroundImage:
            "radial-gradient(120% 80% at 50% 100%, rgba(177,75,255,0.34) 0%, rgba(255,45,143,0.14) 38%, rgba(7,6,13,0) 72%)",
          fontFamily: fonte ? "Chakra" : "sans-serif",
          position: "relative",
        }}
      >
        {/* Filete superior da marca */}
        <div style={{ display: "flex", height: 6, width: "100%", backgroundColor: COR.magenta }} />

        <div style={{ display: "flex", flexDirection: "column", padding: "0 72px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 6,
              color: "#8E86A8",
              textTransform: "uppercase",
            }}
          >
            {site.nome}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 20,
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#F5F2FF",
              textTransform: "uppercase",
            }}
          >
            Desenvolvedor fullstack
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -2,
              color: "#F5F2FF",
              textTransform: "uppercase",
            }}
          >
            &amp; engenheiro de&nbsp;
            <span
              style={{
                color: "#FFF2F9",
                textShadow: `0 0 12px ${COR.magenta}, 0 0 40px rgba(255,45,143,0.75)`,
              }}
            >
              IA
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 30,
              color: "#CAC3DF",
            }}
          >
            {site.lead}
          </div>
        </div>

        {/* Rodapé: serviços + skyline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 40, padding: "0 72px 28px" }}>
            {eixos.map((servico) => (
              <div key={servico.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Bloco em vez do glifo do site: ◤ ⟳ ◈ não existem na fonte
                    embarcada e o Satori falha ao buscar uma que os cubra. */}
                <div
                  style={{
                    display: "flex",
                    width: 14,
                    height: 14,
                    backgroundColor: COR[servico.cor],
                  }}
                />
                <span style={{ color: "#8E86A8", fontSize: 22, letterSpacing: 3 }}>
                  {servico.codinome}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", height: 140, width: "100%" }}>
            {PREDIOS.map((altura, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flex: 1,
                  height: altura,
                  backgroundColor: i % 3 === 0 ? "#15102A" : "#0F0C1C",
                  borderTop: `1px solid ${i % 5 === 0 ? "rgba(255,45,143,0.5)" : "rgba(46,39,64,0.9)"}`,
                  marginRight: 3,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonte
        ? [{ name: "Chakra", data: fonte, style: "normal" as const, weight: 700 as const }]
        : undefined,
    },
  );
}

import type { MetadataRoute } from "next";
import { projetos } from "@/content/projetos";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Cada case tem pagina propria: e ali que mora a prova dos projetos sem
    // demo publica, entao precisa ser indexavel.
    ...projetos.map((projeto) => ({
      url: `${site.url}/projetos/${projeto.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

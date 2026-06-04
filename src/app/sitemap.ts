import type { MetadataRoute } from "next";

import { getActiveMatches } from "@/infrastructure/actions/match.actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeMatches = await getActiveMatches();

  //TODO: Unificar generacion de urls en un solo lugar.
  const matchesSitemapEntries = activeMatches.map((match) => ({
    url: `https://expectedscore.app/match/${match.leagueSlug}/${match.slug}/${match.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  })) as MetadataRoute.Sitemap;

  //TODO: Guardar BASE URL en una variable de entorno.
  return [
    {
      url: "https://expectedscore.app/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...matchesSitemapEntries,
  ];
}

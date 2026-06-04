import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  //TODO: Guardar BASE URL en una variable de entorno.
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
    ],
    sitemap: "https://expectedscore.app/sitemap.xml",
  };
}

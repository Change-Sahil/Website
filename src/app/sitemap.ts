// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

const locales = ["de", "en", "es", "tr"] as const;
const pages   = ["", "/services", "/approach", "/about", "/contact", "/speaking"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const url = `${BASE_URL}/${locale}${page}`;

      // Alternates: alle Sprachversionen dieser Seite
      const languages: Record<string, string> = {};
      for (const l of locales) {
        languages[l] = `${BASE_URL}/${l}${page}`;
      }
      languages["x-default"] = `${BASE_URL}/de${page}`;

      entries.push({
        url,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority:      page === "" ? 1.0 : 0.8,
        alternates:    { languages },
      });
    }
  }

  return entries;
}

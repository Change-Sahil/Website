// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

const locales = ["de", "en", "es", "tr"] as const;

const staticPages = [
  "",
  "/services",
  "/approach",
  "/about",
  "/contact",
  "/speaking",
  "/impulse",
  "/werkstattgespraech",
] as const;

function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }
  languages["x-default"] = `${BASE_URL}/de${path}`;
  return { languages };
}

/**
 * Seiten, die es nur auf Deutsch gibt. Sie stehen bewusst NICHT in
 * staticPages: Dort würde für jede Locale eine URL samt hreflang-Alternative
 * erzeugt, obwohl /en, /es und /tr auf /de umleiten. Das wären drei
 * Weiterleitungs-URLs pro Seite in der Sitemap.
 */
const germanOnlyPages = ["/uebergabe-check"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of germanOnlyPages) {
    entries.push({
      url: `${BASE_URL}/de${page}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Static pages – all locales
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority:        page === "" ? 1.0 : 0.8,
        alternates:      buildAlternates(page),
      });
    }
  }

  // Article pages – canonical German; other locales have lower priority
  for (const article of ARTICLES) {
    const path = `/impulse/${article.slug}`;
    for (const locale of locales) {
      entries.push({
        url:             `${BASE_URL}/${locale}${path}`,
        changeFrequency: "monthly",
        priority:        locale === "de" ? 0.7 : 0.3,
        alternates:      buildAlternates(path),
      });
    }
  }

  return entries;
}

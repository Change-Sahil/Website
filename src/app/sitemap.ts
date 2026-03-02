// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/de",
    "/de/services",
    "/de/approach",
    "/de/about",
    "/de/contact",
    "/de/speaking",
    "/en",
    "/en/services",
    "/en/approach",
    "/en/about",
    "/en/contact",
    "/en/speaking",
    "/es",
    "/es/services",
    "/es/approach",
    "/es/about",
    "/es/contact",
    "/es/speaking",
    "/tr",
    "/tr/services",
    "/tr/approach",
    "/tr/about",
    "/tr/contact",
    "/tr/speaking",
  ] as const;

  return routes.map((path) => ({
    url: new URL(path, BASE_URL).toString(),
    lastModified: new Date(),
  }));
}
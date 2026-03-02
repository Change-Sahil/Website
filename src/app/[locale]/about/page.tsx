import type { Metadata } from "next";
import { Suspense } from "react";
import AboutClient from "./about-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Transformationsberater mit Industrie- und M&A-Erfahrung | Seref Sahil",
    en: "Transformation advisor with industry & M&A experience | Seref Sahil",
    es: "Consultor de transformación con experiencia en industria y M&A | Seref Sahil",
    tr: "Sanayi ve M&A deneyimli dönüşüm danışmanı | Seref Sahil",
  };

  const description: Record<string, string> = {
    de: "Erfahrung in Industrie, Mittelstand und komplexen Transformationssituationen. Fokus auf Umsetzung, Führung und nachhaltige Performance.",
    en: "Experience across industry, mid-market and complex transformation situations. Focus on execution, leadership and sustainable performance.",
    es: "Experiencia en industria, medianas empresas y transformaciones complejas. Enfoque en ejecución, liderazgo y rendimiento sostenible.",
    tr: "Sanayi, orta ölçekli şirketler ve karmaşık dönüşüm durumlarında deneyim. Odak: uygulama, liderlik ve sürdürülebilir performans.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/about`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/about`,
        en: `${BASE_URL}/en/about`,
        es: `${BASE_URL}/es/about`,
        tr: `${BASE_URL}/tr/about`,
      },
    },
    openGraph: {
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: ogLocale[locale] ?? "de_DE",
    },
    twitter: {
      card: "summary_large_image",
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AboutClient />
    </Suspense>
  );
}
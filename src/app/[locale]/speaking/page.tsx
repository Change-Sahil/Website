import type { Metadata } from "next";
import { Suspense } from "react";
import SpeakingClient from "./speaking-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Vorträge zu M&A-Integration, Shopfloor-Führung & Lean | Industrie",
    en: "Speaking on M&A Integration, Shop Floor Leadership & Lean | Industry",
    es: "Ponencias sobre integración M&A, liderazgo en planta y lean | Industria",
    tr: "M&A Entegrasyonu, Saha Liderliği & Lean Üzerine Konuşmalar | Sanayi",
  };

  const description: Record<string, string> = {
    de: "Praxisnahe Keynotes und Lehraufträge zu Post-Merger Integration, Shopfloor Management und operativer Change-Umsetzung im produzierenden Mittelstand – basierend auf eigener Erfahrung und laufender Forschung.",
    en: "Hands-on keynotes and teaching on post-merger integration, shop floor management and operational change execution in manufacturing SMEs – grounded in firsthand experience and ongoing research.",
    es: "Keynotes y docencia sobre integración post-fusión, gestión en planta y ejecución operativa del cambio en pymes industriales – basadas en experiencia directa e investigación en curso.",
    tr: "Birleşme sonrası entegrasyon, saha yönetimi ve üretim KOBİ'lerinde operasyonel değişim uygulaması üzerine uygulamalı keynote ve dersler – doğrudan deneyim ve devam eden araştırmaya dayalı.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/speaking`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/speaking`,
        en: `${BASE_URL}/en/speaking`,
        es: `${BASE_URL}/es/speaking`,
        tr: `${BASE_URL}/tr/speaking`,
      },
    },
    openGraph: {
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: ogLocale[locale] ?? "de_DE",
      images: [{ url: `${BASE_URL}/seref-sahil-change-werkstatt.jpg`, width: 1200, height: 1600, alt: "Seref Sahil – Change-Werkstatt Sahil" }],
    },
    twitter: {
      card: "summary_large_image",
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      images: [`${BASE_URL}/seref-sahil-change-werkstatt.jpg`],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SpeakingClient />
    </Suspense>
  );
}
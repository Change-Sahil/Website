import type { Metadata } from "next";
import ImpulseClient from "./impulse-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Impulse | Beiträge zur Umsetzungspraxis im Mittelstand",
    en: "Impulse | Articles on Implementation in Practice",
    es: "Impulse | Artículos sobre implementación práctica",
    tr: "Impulse | Uygulamada Pratik Makaleler",
  };

  const description: Record<string, string> = {
    de: "Beiträge aus der Beratungspraxis: Was die Umsetzungslücke ist, warum Führungskräfte im Meeting zustimmen und später bremsen — und was das für die Praxis im produzierenden Mittelstand bedeutet.",
    en: "Articles from consulting practice: what the implementation gap is, why leaders agree in meetings and stall later — and what this means for manufacturing SMEs.",
    es: "Artículos de la práctica consultora: qué es la brecha de implementación y qué significa para las pymes industriales.",
    tr: "Danışmanlık pratiğinden makaleler: uygulama boşluğu nedir ve üretim KOBİ'leri için ne anlama gelir.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/impulse`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/impulse`,
        en: `${BASE_URL}/en/impulse`,
        es: `${BASE_URL}/es/impulse`,
        tr: `${BASE_URL}/tr/impulse`,
      },
    },
    openGraph: {
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: ogLocale[locale] ?? "de_DE",
      images: [
        {
          url: `${BASE_URL}/seref-sahil-change-werkstatt.jpg`,
          width: 1200,
          height: 1600,
          alt: "Seref Sahil – Change-Werkstatt Sahil",
        },
      ],
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
  return <ImpulseClient />;
}

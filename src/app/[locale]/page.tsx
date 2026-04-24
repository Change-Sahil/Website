// src/app/[locale]/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import HomeClient from "./home-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Change-Beratung & Shopfloor-Umsetzung | Produzierender Mittelstand",
    en: "Hands-on Change Management & Shop Floor Execution | Manufacturing SMEs",
    es: "Consultoría de cambio operativo en planta | Pymes industriales",
    tr: "Operasyonel Değişim Danışmanlığı & Saha Uygulaması | Üretim KOBİ'leri",
  };

  const description: Record<string, string> = {
    de: "Wenn Umsetzung im Betrieb nicht greift: Ich arbeite direkt mit Führung und Teams am Shopfloor – für operative Change-Beratung, Post-Merger Integration und Lean-Umsetzung im produzierenden Mittelstand.",
    en: "When execution stalls: I work directly with leadership and teams on the shop floor – hands-on change management, post-merger integration and lean execution for manufacturing SMEs.",
    es: "Cuando la ejecución no avanza: trabajo directamente con líderes y equipos en planta – gestión del cambio operativo, integración post-fusión y lean para pymes industriales.",
    tr: "Uygulama durduğunda: Liderlik ve ekiplerle doğrudan sahada çalışıyorum – üretim KOBİ'leri için operasyonel değişim yönetimi, birleşme sonrası entegrasyon ve lean uygulaması.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        tr: `${BASE_URL}/tr`,
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
      <HomeClient />
    </Suspense>
  );
}
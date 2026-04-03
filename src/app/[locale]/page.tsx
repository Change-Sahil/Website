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

  // SEO-optimierte (unsichtbare) Titles
  const title: Record<string, string> = {
    de: "Transformationsberatung für Industrie & Mittelstand | M&A, Restrukturierung, Umsetzung",
    en: "Transformational Change & Implementation Support for Industry & SMEs",
    es: "Consultoría de transformación e implementación para industria y medianas empresas",
    tr: "Sanayi ve KOBİ'ler için dönüşüm ve uygulama danışmanlığı",
  };

  const description: Record<string, string> = {
    de: "Ich begleite Führung und Teams in anspruchsvollen Transformations-, M&A- und Restrukturierungsprojekten. Werkstattansatz mit klarem Fokus auf wirksame Umsetzung.",
    en: "I support leadership and teams in industrial and mid-market transformations, M&A integrations and restructuring with a hands-on execution mindset.",
    es: "Acompaño a líderes y equipos en transformaciones, integraciones M&A y reestructuraciones con un enfoque práctico y orientado a resultados.",
    tr: "Liderlik ve ekipleri dönüşüm, M&A entegrasyonu ve yeniden yapılanma süreçlerinde uygulama odaklı bir yaklaşımla destekliyorum.",
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
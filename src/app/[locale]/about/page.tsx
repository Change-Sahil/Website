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
    de: "Seref Sahil | Change-Berater mit Shopfloor- & M&A-Erfahrung",
    en: "Seref Sahil | Change Advisor with Shop Floor & M&A Experience",
    es: "Seref Sahil | Consultor de cambio con experiencia en planta y M&A",
    tr: "Seref Sahil | Saha & M&A Deneyimli Değişim Danışmanı",
  };

  const description: Record<string, string> = {
    de: "25 Jahre operative Verantwortung im produzierenden Mittelstand – vom Shopfloor bis zur standortübergreifenden Führung. Heute Change- und Integrationsberatung aus Praxistiefe, nicht aus Fallstudien.",
    en: "25 years of operational responsibility in manufacturing – from the shop floor to cross-site leadership. Today: change and integration consulting grounded in firsthand experience, not case studies.",
    es: "25 años de responsabilidad operativa en industria – desde la planta hasta la dirección multiplanta. Hoy: consultoría de cambio e integración desde la experiencia real, no desde casos de estudio.",
    tr: "Üretimde 25 yıllık operasyonel sorumluluk – sahadan çok lokasyonlu liderliğe. Bugün: vaka çalışmalarından değil, doğrudan deneyimden gelen değişim ve entegrasyon danışmanlığı.",
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
      <AboutClient />
    </Suspense>
  );
}
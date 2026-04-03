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
    de: "Vorträge zu Transformation, Führung & Umsetzung | Industrie",
    en: "Speaking on transformation, leadership & execution",
    es: "Ponencias sobre transformación, liderazgo y ejecución",
    tr: "Dönüşüm, liderlik ve uygulama üzerine konuşmalar",
  };

  const description: Record<string, string> = {
    de: "Keynotes, Trainings und Lehre zu Transformationsführung, Umsetzung im Alltag sowie M&A-Integration und Restrukturierung im industriellen Umfeld.",
    en: "Keynotes, trainings and teaching on transformation leadership, day-to-day execution, M&A integration and restructuring in industrial contexts.",
    es: "Keynotes, talleres y docencia sobre liderazgo en transformación, ejecución en el día a día, integración M&A y reestructuración.",
    tr: "Transformasyon liderliği, günlük uygulama, M&A entegrasyonu ve yeniden yapılanma üzerine keynote ve eğitimler.",
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
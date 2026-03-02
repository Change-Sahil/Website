// src/app/[locale]/speaking/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import SpeakingClient from "./speaking-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Vorträge & Lehre zu Führung, Change & Umsetzung | Change-Werkstatt Sahil",
    en: "Speaking & teaching on leadership, change & execution | Change-Werkstatt Sahil",
    es: "Ponencias y docencia sobre liderazgo, cambio y ejecución | Change-Werkstatt Sahil",
    tr: "Liderlik, değişim ve uygulama üzerine konuşmalar | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Keynotes, Trainings und Lehre mit Werkstattfokus: Umsetzung, Führung, Transformation, M&A und Restrukturierung.",
    en: "Keynotes, trainings and teaching with a practical workshop mindset: execution, leadership, transformation, M&A and restructuring.",
    es: "Keynotes, talleres y docencia con enfoque práctico: ejecución, liderazgo, transformación, M&A y reestructuración.",
    tr: "Uygulama odaklı yaklaşım: keynote, eğitim ve dersler—liderlik, dönüşüm, M&A ve yeniden yapılanma.",
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
      locale,
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
import type { Metadata } from "next";
import { Suspense } from "react";
import ApproachClient from "./approach-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Vorgehen in Transformationsprojekten | Klären, Etablieren, Verankern",
    en: "Approach in transformation projects | Clarify, establish, embed",
    es: "Enfoque en proyectos de transformación | Aclarar, establecer, consolidar",
    tr: "Dönüşüm projelerinde yaklaşım | Netleştir, kur, kalıcılaştır",
  };

  const description: Record<string, string> = {
    de: "Strukturiertes Vorgehen in Transformations-, M&A- und Restrukturierungsprojekten: Diagnose, Intervention und nachhaltige Verankerung in Führung und Organisation.",
    en: "A structured approach for transformations, M&A integrations and restructurings: diagnosis, interventions and sustainable embedding in leadership and organization.",
    es: "Enfoque estructurado para transformaciones, integraciones M&A y reestructuraciones: diagnóstico, intervención y consolidación sostenible.",
    tr: "Dönüşüm, M&A entegrasyonu ve yeniden yapılanma süreçleri için yapılandırılmış yaklaşım: teşhis, müdahale ve kalıcılaştırma.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/approach`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/approach`,
        en: `${BASE_URL}/en/approach`,
        es: `${BASE_URL}/es/approach`,
        tr: `${BASE_URL}/tr/approach`,
      },
    },
    openGraph: {
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: ogLocale[locale] ?? "de_DE",
      images: [{ url: `${BASE_URL}/images/approach-01.jpg`, width: 1200, height: 900, alt: "Change-Werkstatt Sahil – Vorgehen" }],
    },
    twitter: {
      card: "summary_large_image",
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      images: [`${BASE_URL}/images/approach-01.jpg`],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ApproachClient />
    </Suspense>
  );
}
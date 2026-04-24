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
    de: "Operative Umsetzung im Mittelstand | Klären, Führen, Verankern",
    en: "Operational Execution in SMEs | Clarify, Lead, Embed",
    es: "Ejecución operativa en pymes | Aclarar, liderar, consolidar",
    tr: "KOBİ'lerde Operasyonel Uygulama | Netleştir, Yönet, Kalıcılaştır",
  };

  const description: Record<string, string> = {
    de: "Wie Veränderung im produzierenden Betrieb tatsächlich greift: Diagnose am Shopfloor, Führungsroutinen aufbauen, Umsetzung verankern – statt Konzepte abliefern und weitergehen.",
    en: "How change actually takes hold in manufacturing: diagnosis on the shop floor, building leadership routines, embedding execution – not delivering concepts and moving on.",
    es: "Cómo el cambio realmente arraiga en la industria: diagnóstico en planta, construcción de rutinas de liderazgo, consolidación de la ejecución – sin limitarse a entregar conceptos.",
    tr: "Değişim üretimde nasıl gerçekten işler: sahada teşhis, liderlik rutinleri oluşturma, uygulamayı kalıcılaştırma – sadece konsept teslim edip gitmek yerine.",
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
      <ApproachClient />
    </Suspense>
  );
}
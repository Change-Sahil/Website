import type { Metadata } from "next";
import WerkstattgespraechClient from "./werkstattgespraech-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Werkstattgespräch | Zwei Stunden. Ein Thema. Ein klares Bild.",
    en: "Werkstattgespräch | Two Hours. One Topic. One Clear Picture.",
    es: "Werkstattgespräch | Dos horas. Un tema. Una imagen clara.",
    tr: "Werkstattgespräch | İki Saat. Bir Konu. Net Bir Tablo.",
  };

  const description: Record<string, string> = {
    de: "Ein zweistündiges Beratungsformat für Themen, die intern nicht vorankommen. Vor Ort bei Ihnen. 990 € zzgl. MwSt. Inkl. Vor- und Nachbereitung.",
    en: "A focused two-hour advisory session for topics that are stuck internally. On-site with you. 990 € plus VAT. Includes preparation and follow-up.",
    es: "Un formato de asesoría de dos horas para temas que no avanzan internamente. En sus instalaciones. 990 € más IVA.",
    tr: "Kurumsal olarak ilerleme kaydedilemeyen konular için odaklı iki saatlik bir danışmanlık formatı. Yerinde, 990 € + KDV.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE", en: "en_US", es: "es_ES", tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/werkstattgespraech`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/werkstattgespraech`,
        en: `${BASE_URL}/en/werkstattgespraech`,
        es: `${BASE_URL}/es/werkstattgespraech`,
        tr: `${BASE_URL}/tr/werkstattgespraech`,
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
  return <WerkstattgespraechClient />;
}

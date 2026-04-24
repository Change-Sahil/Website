import type { Metadata } from "next";
import ServicesClient from "./services-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Shopfloor-Beratung & Workshops | Operative Umsetzung Mittelstand",
    en: "Shop Floor Consulting & Workshops | Operational Execution for SMEs",
    es: "Consultoría en planta & talleres | Ejecución operativa para pymes",
    tr: "Saha Danışmanlığı & Atölyeler | KOBİ'lerde Operasyonel Uygulama",
  };

  const description: Record<string, string> = {
    de: "Operative Beratungsformate für den produzierenden Mittelstand: Klärungsworkshops, monatliche Umsetzungspartnerschaft am Shopfloor und Executive Sparring für Führungsentscheidungen.",
    en: "Operational consulting formats for manufacturing SMEs: clarification workshops, monthly implementation partnership on the shop floor, and executive sparring for leadership decisions.",
    es: "Formatos de consultoría operativa para pymes industriales: talleres de clarificación, alianza de implementación mensual en planta y sparring ejecutivo para decisiones de liderazgo.",
    tr: "Üretim KOBİ'leri için operasyonel danışmanlık formatları: netleştirme atölyeleri, sahada aylık uygulama ortaklığı ve liderlik kararları için executive sparring.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}/services`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/services`,
        en: `${BASE_URL}/en/services`,
        es: `${BASE_URL}/es/services`,
        tr: `${BASE_URL}/tr/services`,
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
  return <ServicesClient />;
}
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
    de: "Transformationsberatung, Workshops & Executive Sparring für Industrie",
    en: "Transformation Consulting, Workshops & Executive Sparring",
    es: "Consultoría de transformación, talleres y sparring ejecutivo",
    tr: "Dönüşüm danışmanlığı, atölyeler ve executive sparring",
  };

  const description: Record<string, string> = {
    de: "Formate für Industrie- und Mittelstandsunternehmen: Transformationspartnerschaft, Werkstatt-Workshops und Executive Sparring für anspruchsvolle Umsetzungssituationen.",
    en: "Formats for industrial and mid-market companies: transformation partnership, workshops and executive sparring for complex implementation challenges.",
    es: "Formatos para empresas industriales y medianas: alianza de transformación, talleres y sparring ejecutivo para retos complejos de implementación.",
    tr: "Sanayi ve orta ölçekli şirketler için formatlar: dönüşüm ortaklığı, atölyeler ve karmaşık uygulama süreçleri için executive sparring.",
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
// src/app/[locale]/services/page.tsx
import type { Metadata } from "next";
import ServicesClient from "./services-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Leistungen: Workshops, Transformationspartnerschaft, Sparring | Change-Werkstatt Sahil",
    en: "Services: Workshops, Transformation Partnership, Executive Sparring | Change-Werkstatt Sahil",
    es: "Servicios: Talleres, Alianza de Transformación, Sparring Ejecutivo | Change-Werkstatt Sahil",
    tr: "Hizmetler: Atölyeler, Dönüşüm Ortaklığı, Executive Sparring | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Formate für Führung und Teams in anspruchsvollen Umsetzungssituationen: Werkstatt-Workshops, Transformationspartnerschaft und Executive Sparring.",
    en: "Formats for leadership and teams in demanding implementation situations: workshops, transformation partnership and executive sparring.",
    es: "Formatos para dirección y equipos en situaciones exigentes de implementación: talleres, alianza de transformación y sparring ejecutivo.",
    tr: "Zorlu uygulama süreçlerinde liderlik ve ekipler için formatlar: atölyeler, dönüşüm ortaklığı ve executive sparring.",
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
    },
  };
}

export default function Page() {
  return <ServicesClient />;
}
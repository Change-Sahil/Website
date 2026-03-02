// src/app/[locale]/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import HomeClient from "./home-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Umsetzungsbegleitung für Industrie & Mittelstand | Change-Werkstatt Sahil",
    en: "Operational change support for industry & SMEs | Change-Werkstatt Sahil",
    es: "Acompañamiento operativo en procesos de cambio | Change-Werkstatt Sahil",
    tr: "Karmaşık uygulama süreçlerinde operasyonel destek | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Begleitung von Führung und Teams in anspruchsvollen Umsetzungssituationen – besonders bei Transformation, M&A und Restrukturierung.",
    en: "Support for leadership and teams in demanding implementation situations—especially during transformation, M&A and restructuring.",
    es: "Acompañamos a dirección y equipos en situaciones exigentes de implementación, especialmente en transformación, M&A y reestructuración.",
    tr: "Liderlik ve ekipleri zorlu uygulama süreçlerinde destekliyoruz—özellikle dönüşüm, M&A ve yeniden yapılanma dönemlerinde.",
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
      locale,
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
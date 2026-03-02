// src/app/[locale]/about/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import AboutClient from "./about-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Über uns: Profil & Erfahrung | Change-Werkstatt Sahil",
    en: "About: Profile & experience | Change-Werkstatt Sahil",
    es: "Sobre nosotros: Perfil y experiencia | Change-Werkstatt Sahil",
    tr: "Hakkımızda: Profil ve deneyim | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Erfahrung aus Industrie, Führung und Organisationsentwicklung – mit Fokus auf wirksame Umsetzung im Alltag.",
    en: "Experience across industry, leadership and organizational development—focused on execution that works in real operations.",
    es: "Experiencia en industria, liderazgo y desarrollo organizacional, con foco en ejecución real.",
    tr: "Sanayi, liderlik ve organizasyonel gelişim deneyimi—gerçek uygulamaya odaklı.",
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
      locale,
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
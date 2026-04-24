// src/app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./contact-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title: Record<string, string> = {
    de: "Kontakt | Change-Beratung Aalen, Baden-Württemberg | Seref Sahil",
    en: "Contact | Change Management Consulting | Seref Sahil",
    es: "Contacto | Consultoría de cambio | Seref Sahil",
    tr: "İletişim | Değişim Yönetimi Danışmanlığı | Seref Sahil",
  };

  const description: Record<string, string> = {
    de: "15-minütiges Orientierungsgespräch für Führungskräfte im produzierenden Mittelstand. Beratungsstandort: Aalen, Baden-Württemberg – deutschlandweit tätig.",
    en: "15-minute orientation call for leaders in manufacturing SMEs. Advisory base: Aalen, Baden-Württemberg – active throughout Germany.",
    es: "Llamada de orientación de 15 minutos para directivos de pymes industriales. Base de consultoría: Aalen, Baden-Württemberg – activo en toda Alemania.",
    tr: "Üretim KOBİ'lerindeki liderler için 15 dakikalık oryantasyon görüşmesi. Danışmanlık merkezi: Aalen, Baden-Württemberg – Almanya genelinde aktif.",
  };

  const url = `${BASE_URL}/${locale}/contact`;

  return {
    title: title[locale] ?? title.de,
    description: description[locale] ?? description.de,
    alternates: {
      canonical: url,
      languages: {
        de: `${BASE_URL}/de/contact`,
        en: `${BASE_URL}/en/contact`,
        es: `${BASE_URL}/es/contact`,
        tr: `${BASE_URL}/tr/contact`,
      },
    },
    openGraph: {
      title: title[locale] ?? title.de,
      description: description[locale] ?? description.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale,
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
      <ContactClient />
    </Suspense>
  );
}
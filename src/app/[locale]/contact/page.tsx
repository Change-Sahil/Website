// src/app/[locale]/contact/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./contact-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Kontakt | Change-Werkstatt Sahil",
    en: "Contact | Change-Werkstatt Sahil",
    es: "Contacto | Change-Werkstatt Sahil",
    tr: "İletişim | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Kontakt für ein kurzes Orientierungsgespräch und den nächsten sinnvollen Schritt in der Umsetzung.",
    en: "Get in touch for a short orientation call and the next practical step.",
    es: "Contacto para una breve llamada de orientación y definir el siguiente paso.",
    tr: "Kısa bir görüşme ve sonraki adım için iletişime geçin.",
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
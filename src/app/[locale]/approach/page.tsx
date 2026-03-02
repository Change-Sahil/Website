// src/app/[locale]/approach/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ApproachClient from "./approach-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const title: Record<string, string> = {
    de: "Vorgehen: Klären, Etablieren, Verankern | Change-Werkstatt Sahil",
    en: "Approach: Clarify, establish, embed | Change-Werkstatt Sahil",
    es: "Enfoque: Aclarar, establecer, consolidar | Change-Werkstatt Sahil",
    tr: "Yaklaşım: Netleştir, kur, kalıcılaştır | Change-Werkstatt Sahil",
  };

  const description: Record<string, string> = {
    de: "Unser Werkstattansatz im laufenden Betrieb: Klarheit schaffen, Führungsrhythmus etablieren und Umsetzung nachhaltig verankern.",
    en: "Our workshop approach in day-to-day operations: create clarity, establish leadership cadence and embed execution sustainably.",
    es: "Nuestro enfoque práctico en el día a día: claridad, ritmo de liderazgo y consolidación sostenible de la ejecución.",
    tr: "Günlük operasyonlarda atölye yaklaşımı: netlik, liderlik ritmi ve sürdürülebilir uygulama.",
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
      locale,
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
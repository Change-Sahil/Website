// src/app/[locale]/uebergabe-check/page.tsx

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CheckClient from "./check-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

/**
 * Beta-Phase: nicht indexieren, nicht in der Navigation, nicht in der Sitemap.
 * Zum öffentlichen MVP hier auf true stellen und den Pfad in src/app/sitemap.ts
 * sowie in der Navigation ergänzen.
 */
const INDEXABLE = false;

export async function generateMetadata(): Promise<Metadata> {
  const url = `${BASE_URL}/de/uebergabe-check`;

  return {
    title: "Schnellcheck Übergabefähigkeit | Change-Werkstatt Sahil",
    description:
      "In fünf Minuten sichtbar machen, wie stark Ihr Unternehmen an einzelnen Personen hängt: 24 Aussagen, sechs Dimensionen, sofortiges Ergebnis als Netzdiagramm. Kostenlos und ohne Registrierung.",
    robots: INDEXABLE
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title: "Wie übergabefähig ist Ihr Unternehmen?",
      description:
        "24 Aussagen, sechs Dimensionen, sofortiges Ergebnis. Der kostenlose Schnellcheck zur organisationalen Übergabefähigkeit im Mittelstand.",
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: "de_DE",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Der Check ist in Beta v1.0 bewusst nur auf Deutsch verfügbar: die Items
  // sind noch nicht validiert, eine Übersetzung würde die Trennschärfe der
  // Formulierungen verändern.
  if (locale !== "de") redirect("/de/uebergabe-check");

  return <CheckClient />;
}

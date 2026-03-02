// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { locales, isLocale, type Locale } from "@/i18n/config";

/**
 * VOR LAUNCH (Preview / vercel.app):
 * - INDEX = false, FOLLOW = false  -> Google soll das nicht indexieren
 *
 * ZUM LAUNCH:
 * - Setze INDEX/FOLLOW auf true
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://change-werkstatt-sahil.de"; 
const INDEX = false; // <-- ZUM LAUNCH true
const FOLLOW = false; // <-- ZUM LAUNCH true

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  // Site-/Home-Meta je Sprache (ohne zusätzliche sichtbare Texte)
  const titles: Record<string, string> = {
    de: "Umsetzungsbegleitung für Industrie & Mittelstand | Change-Werkstatt Sahil",
    en: "Operational change support for industry & SMEs | Change-Werkstatt Sahil",
    es: "Acompañamiento operativo en situaciones complejas de implementación | Change-Werkstatt Sahil",
    tr: "Karmaşık uygulama süreçlerinde operasyonel destek | Change-Werkstatt Sahil",
  };

  const descriptions: Record<string, string> = {
    de: "Begleitung von Führung und Teams in anspruchsvollen Umsetzungssituationen – besonders bei Transformation, M&A und Restrukturierung.",
    en: "Support for leadership and teams in demanding implementation situations—especially during transformation, M&A and restructuring.",
    es: "Acompañamos a dirección y equipos en situaciones exigentes de implementación, especialmente en transformación, M&A y reestructuración.",
    tr: "Liderlik ve ekipleri zorlu uygulama süreçlerinde destekliyoruz—özellikle dönüşüm, M&A ve yeniden yapılanma dönemlerinde.",
  };

  const title = titles[locale] ?? titles.de;
  const description = descriptions[locale] ?? descriptions.de;

  const url = `${BASE_URL}/${locale}`;

  return {
    title,
    description,

    // Indexierung steuern (vor Launch: noindex)
    robots: {
      index: INDEX,
      follow: FOLLOW,
    },

    // Canonical + hreflang für 4 Sprachen
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
      title,
      description,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale,
    },

    // Optional, aber sinnvoll (saubere Snippets / Social Preview)
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// WICHTIG: sorgt dafür, dass /de /en /tr /es wirklich als Routen existieren
export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const messages = await getMessages({ locale: params.locale });

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Header />
          <main className="page-wrap pt-24 pb-10 sm:pt-24 sm:pb-12">
            <div className="page-stack">{children}</div>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
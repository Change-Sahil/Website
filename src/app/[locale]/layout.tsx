// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { locales, isLocale, type Locale } from "@/i18n/config";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

// Vor Launch: false/false lassen
const INDEX = false;
const FOLLOW = false;

// Next 15/16: params können als Promise kommen -> immer asynchron behandeln
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    de: "Umsetzungsbegleitung für Industrie & Mittelstand | Change-Werkstatt Sahil",
    en: "Operational change support for industry & SMEs | Change-Werkstatt Sahil",
    es: "Acompañamiento operativo en procesos de cambio | Change-Werkstatt Sahil",
    tr: "Karmaşık uygulama süreçlerinde operasyonel destek | Change-Werkstatt Sahil",
  };

  const descriptions: Record<string, string> = {
    de: "Begleitung von Führung und Teams in anspruchsvollen Umsetzungssituationen – besonders bei Transformation, M&A und Restrukturierung.",
    en: "Support for leadership and teams in demanding implementation situations—especially during transformation, M&A and restructuring.",
    es: "Acompañamos a dirección y equipos en situaciones exigentes de implementación, especialmente en transformación, M&A y reestructuración.",
    tr: "Liderlik ve ekipleri zorlu uygulama süreçlerinde destekliyoruz—özellikle dönüşüm, M&A ve yeniden yapılanma dönemlerinde.",
  };

  return {
    title: titles[locale] ?? titles.de,
    description: descriptions[locale] ?? descriptions.de,

    robots: {
      index: INDEX,
      follow: FOLLOW,
    },

    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        tr: `${BASE_URL}/tr`,
      },
    },

    openGraph: {
      title: titles[locale] ?? titles.de,
      description: descriptions[locale] ?? descriptions.de,
      url: `${BASE_URL}/${locale}`,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale,
    },

    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.de,
      description: descriptions[locale] ?? descriptions.de,
    },
  };
}

// sorgt dafür, dass /de /en /tr /es wirklich als Routen existieren
export function generateStaticParams() {
  return (locales as readonly Locale[]).map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="page-wrap pt-24 pb-10 sm:pt-24 sm:pb-12">
        <div className="page-stack">{children}</div>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
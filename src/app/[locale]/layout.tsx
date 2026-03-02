// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { locales, isLocale, type Locale } from "@/i18n/config";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

// Vor Launch: false/false lassen (zum Launch auf true/true stellen)
const INDEX = false;
const FOLLOW = false;

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
    de: "Transformationsberatung für Industrie & Mittelstand | M&A, Restrukturierung, Umsetzung",
    en: "Transformational Change & Implementation Support for Industry & SMEs",
    es: "Consultoría de transformación e implementación para industria y medianas empresas",
    tr: "Sanayi ve KOBİ'ler için dönüşüm ve uygulama danışmanlığı",
  };

  const descriptions: Record<string, string> = {
    de: "Wir begleiten Führung und Teams in anspruchsvollen Transformations-, M&A- und Restrukturierungsprojekten. Werkstattansatz mit klarem Fokus auf wirksame Umsetzung.",
    en: "We support leadership and teams in industrial and mid-market transformations, M&A integrations and restructuring with a hands-on execution mindset.",
    es: "Acompañamos a líderes y equipos en transformaciones, integraciones M&A y reestructuraciones con un enfoque práctico y orientado a resultados.",
    tr: "Liderlik ve ekipleri dönüşüm, M&A entegrasyonu ve yeniden yapılanma süreçlerinde uygulama odaklı bir yaklaşımla destekliyoruz.",
  };

  const ogLocale: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    es: "es_ES",
    tr: "tr_TR",
  };

  const url = `${BASE_URL}/${locale}`;

  return {
    title: titles[locale] ?? titles.de,
    description: descriptions[locale] ?? descriptions.de,

    robots: {
      index: INDEX,
      follow: FOLLOW,
    },

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
      title: titles[locale] ?? titles.de,
      description: descriptions[locale] ?? descriptions.de,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "website",
      locale: ogLocale[locale] ?? "de_DE",
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
      {/* Schema.org (unsichtbar) */}
      <Script
        id="schema-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${BASE_URL}/#organization`,
                name: "Change-Werkstatt Sahil",
                url: BASE_URL,
                logo: `${BASE_URL}/apple-touch-icon.png`,
                sameAs: ["https://www.linkedin.com/in/seref-sahil-78304aa4/"],
              },
              {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                url: BASE_URL,
                name: "Change-Werkstatt Sahil",
                publisher: { "@id": `${BASE_URL}/#organization` },
                inLanguage: locale,
              },
            ],
          }),
        }}
      />

      <Header />
      <main className="page-wrap pt-24 pb-10 sm:pt-24 sm:pb-12">
        <div className="page-stack">{children}</div>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
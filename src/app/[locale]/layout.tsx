// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

// latin-ext deckt türkische Sonderzeichen (ğ, ı, ş, ü …) ab.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { locales, isLocale, type Locale } from "@/i18n/config";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

// Vor Launch: false/false lassen (zum Launch auf true/true stellen)
const INDEX = true;
const FOLLOW = true;

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
    de: "Change-Beratung & Shopfloor-Umsetzung | Produzierender Mittelstand",
    en: "Hands-on Change Management & Shop Floor Execution | Manufacturing SMEs",
    es: "Consultoría de cambio operativo en planta | Pymes industriales",
    tr: "Operasyonel Değişim Danışmanlığı & Saha Uygulaması | Üretim KOBİ'leri",
  };

  const descriptions: Record<string, string> = {
    de: "Wenn Umsetzung im Betrieb nicht greift: Ich arbeite direkt mit Führung und Teams am Shopfloor – für operative Change-Beratung, Post-Merger Integration und Lean-Umsetzung im produzierenden Mittelstand.",
    en: "When execution stalls: I work directly with leadership and teams on the shop floor – hands-on change management, post-merger integration and lean execution for manufacturing SMEs.",
    es: "Cuando la ejecución no avanza: trabajo directamente con líderes y equipos en planta – gestión del cambio operativo, integración post-fusión y lean para pymes industriales.",
    tr: "Uygulama durduğunda: Liderlik ve ekiplerle doğrudan sahada çalışıyorum – üretim KOBİ'leri için operasyonel değişim yönetimi, birleşme sonrası entegrasyon ve lean uygulaması.",
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
      images: [
        {
          url: `${BASE_URL}/seref-sahil-change-werkstatt.jpg`,
          width: 1200,
          height: 1600,
          alt: "Seref Sahil – Change-Werkstatt Sahil",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.de,
      description: descriptions[locale] ?? descriptions.de,
      images: [`${BASE_URL}/seref-sahil-change-werkstatt.jpg`],
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
    <html lang={locale} className={inter.variable}>
    <body>
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
              // ── Person ──────────────────────────────────────────────
              {
                "@type": "Person",
                "@id": `${BASE_URL}/#person`,
                name: "Seref Sahil",
                url: `${BASE_URL}/de/about`,
                image: `${BASE_URL}/seref-sahil-change-werkstatt.jpg`,
                jobTitle: "Transformationsberater",
                description: "Transformationsberater mit 25+ Jahren operativer Erfahrung in Produktion und Führung. Spezialist für M&A-Integration, Restrukturierung, Führungswechsel und Umsetzungsbegleitung im produzierenden Mittelstand.",
                worksFor: { "@id": `${BASE_URL}/#organization` },
                knowsAbout: [
                  "Transformationsberatung",
                  "M&A-Integration",
                  "Restrukturierung",
                  "Führungsentwicklung",
                  "Operational Excellence",
                  "Lean Management",
                  "Post-Merger-Integration",
                  "Organisationsentwicklung",
                  "Unternehmenskultur",
                  "Change Management",
                  "Produzierender Mittelstand",
                  "Shopfloor Management",
                ],
                knowsLanguage: ["de", "en", "tr", "es", "ar"],
                sameAs: [
                  "https://www.linkedin.com/in/seref-sahil-78304aa4/",
                ],
              },
              // ── Organization / ProfessionalService ──────────────────
              {
                "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
                "@id": `${BASE_URL}/#organization`,
                name: "Change-Werkstatt Sahil",
                alternateName: "Change-Werkstatt",
                url: BASE_URL,
                logo: `${BASE_URL}/apple-touch-icon.png`,
                image: `${BASE_URL}/seref-sahil-change-werkstatt.jpg`,
                founder: { "@id": `${BASE_URL}/#person` },
                description: "Beratung für Transformations-, Restrukturierungs- und M&A-Situationen im produzierenden Mittelstand. Fokus auf wirksame Umsetzung, Führungsklarheit und nachhaltige Verankerung — direkt im Betrieb, nicht im Besprechungsraum.",
                slogan: "Wenn Umsetzung nicht greift",
                priceRange: "€€€",
                areaServed: [
                  { "@type": "Country", name: "Deutschland" },
                  { "@type": "Country", name: "Österreich" },
                  { "@type": "Country", name: "Schweiz" },
                  { "@type": "Continent", name: "Europe" },
                ],
                serviceType: [
                  "Transformationsberatung",
                  "M&A-Integrationsbegleitung",
                  "Restrukturierungsbegleitung",
                  "Führungskräfteentwicklung",
                  "Executive Sparring",
                  "Werkstatt-Workshops",
                  "Umsetzungsbegleitung",
                  "Unternehmensberatung",
                ],
                knowsAbout: [
                  "Transformationsberatung produzierender Mittelstand",
                  "M&A-Integration Industrie",
                  "Restrukturierung Fertigung",
                  "Lean Management",
                  "Operational Excellence",
                  "Führungsentwicklung",
                  "Post-Merger-Integration",
                  "Shopfloor Management",
                  "Unternehmensberatung Aalen",
                ],
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Aalen",
                  addressLocality: "Aalen",
                  postalCode: "73430",
                  addressRegion: "Baden-Württemberg",
                  addressCountry: "DE",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 48.8374,
                  longitude: 10.0931,
                },
                sameAs: [
                  "https://www.linkedin.com/in/seref-sahil-78304aa4/",
                ],
              },
              // ── WebSite ──────────────────────────────────────────────
              {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                url: BASE_URL,
                name: "Change-Werkstatt Sahil",
                publisher: { "@id": `${BASE_URL}/#organization` },
                inLanguage: ["de", "en", "tr", "es"],
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${BASE_URL}/de/contact`,
                  query: "Transformationsberatung Mittelstand",
                },
              },
              // ── FAQPage ──────────────────────────────────────────────
              {
                "@type": "FAQPage",
                "@id": `${BASE_URL}/#faq`,
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Was macht Seref Sahil als Transformationsberater?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Seref Sahil begleitet Führungsteams in produzierenden Mittelständlern durch anspruchsvolle Veränderungssituationen: M&A-Integrationen, Restrukturierungen, Führungswechsel, Wachstumsphasen und Unternehmensnachfolge. Er arbeitet direkt im Betrieb — nicht an Konzepten, sondern an der Frage, warum Umsetzung nicht greift und was sich konkret ändern muss.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Für wen ist die Change-Werkstatt Sahil geeignet?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Die Change-Werkstatt richtet sich an Geschäftsführer, Werksleiter und Führungsteams in produzierenden Unternehmen mit 50–2.000 Mitarbeitenden, die gerade in einer messbaren Veränderungssituation stecken und Unterstützung bei der wirksamen Umsetzung benötigen.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Welche Formate bietet die Change-Werkstatt Sahil an?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Es gibt drei Formate: Transformationspartnerschaft (mehrmonatige Begleitung direkt im Betrieb), Werkstatt-Workshops (strukturierte Arbeitssessions für konkrete Fragestellungen) und Executive Sparring (vertraulicher Sparringspartner für Führungsentscheidungen).",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Was unterscheidet die Change-Werkstatt Sahil von klassischer Unternehmensberatung?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Kein Konzept, das erklärt werden muss — sondern Begleitung, die wirkt. Seref Sahil arbeitet nicht im Besprechungsraum, sondern dort, wo Entscheidungen Wirkung entfalten sollen: in Führungssituationen, in Abstimmungen, im Betrieb. Mit 25+ Jahren eigener Praxiserfahrung in Produktion und Führung.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "In welchen Sprachen arbeitet Seref Sahil?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Seref Sahil arbeitet mehrsprachig: Deutsch, Englisch, Türkisch, Spanisch und Arabisch. Diese Mehrsprachigkeit ermöglicht es, kulturelle und identitätsbezogene Spannungen in internationalen Transformationssituationen früh sichtbar zu machen.",
                    },
                  },
                ],
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
    <Analytics />
    </body>
    </html>
  );
}
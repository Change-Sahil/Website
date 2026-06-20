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
    de: "Merger läuft, aber die Integration stockt. Restrukturierung beschlossen, aber die Teams ziehen nicht mit. Seref Sahil begleitet Geschäftsführer im produzierenden Mittelstand direkt im Betrieb.",
    en: "Post-merger integration stalling. Restructuring announced but not landing. Seref Sahil works directly with leadership teams on the shop floor — for manufacturing SMEs when execution fails.",
    es: "La integración post-fusión no avanza. La reestructuración no aterriza. Seref Sahil acompaña a directivos en planta cuando la ejecución no funciona — pymes industriales.",
    tr: "Birleşme sonrası entegrasyon durdu. Yeniden yapılanma sonuç vermiyor. Seref Sahil, üretim KOBİ'lerinde uygulama işe yaramadığında doğrudan sahada yöneticilere eşlik ediyor.",
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
                    name: "Wer hilft uns nach einem Merger, bevor die Leistungsträger das Unternehmen verlassen?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Seref Sahil begleitet Post-Merger-Integrationen im produzierenden Mittelstand direkt im Betrieb. Er arbeitet mit Führungsteams und Schlüsselpersonen an den konkreten Spannungen, die entstehen, wenn zwei Kulturen aufeinandertreffen — bevor die Leistungsträger innerlich kündigen oder das Unternehmen verlassen.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Wir restrukturieren seit Monaten, aber die Umsetzung greift nicht — was kann ein externer Berater tun?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Wenn Konzepte klar sind und die Umsetzung trotzdem scheitert, liegt das fast immer an ungelösten Führungsfragen oder Widerständen direkt im Betrieb. Seref Sahil arbeitet an dieser Lücke: nicht mit neuen Konzepten, sondern direkt am Shopfloor — an den Orten, an denen Entscheidungen in der Praxis Wirkung entfalten müssen.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Neuer Werksleiter nach einem Führungswechsel — wie sichert man die ersten 100 Tage im Betrieb ab?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Führungswechsel im produzierenden Mittelstand sind kritische Phasen. Seref Sahil begleitet neue Führungskräfte in den ersten Monaten: Er hilft, blinde Flecken früh zu erkennen, das Vertrauen der Teams zu gewinnen und operative Entscheidungen auf einem stabilen Fundament zu treffen.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Lean wird seit Monaten eingeführt, aber im Shopfloor-Alltag kommt es nicht an — warum?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Lean-Transformationen scheitern im Mittelstand selten am Werkzeug, fast immer an der Führungskultur im Betrieb. Seref Sahil begleitet Lean-Einführungen am Shopfloor und arbeitet an der Frage, warum Mitarbeitende und Führungskräfte die Methoden im Alltag nicht leben — und was sich konkret ändern muss.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Was unterscheidet Seref Sahil von einem klassischen Unternehmensberater?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Kein Konzept, das erklärt werden muss — sondern Begleitung, die wirkt. Seref Sahil arbeitet nicht im Besprechungsraum, sondern direkt im Betrieb: in Führungssituationen, in Abstimmungen, am Shopfloor. Mit 25+ Jahren eigener Praxiserfahrung als Führungskraft im produzierenden Mittelstand — nicht aus Fallstudien.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Wann macht ein Werkstattgespräch Sinn und was kostet es?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Ein Werkstattgespräch ist sinnvoll, wenn ein Thema intern seit Wochen oder Monaten nicht vorankommt: eine ungeklärte Führungsfrage, ein Organisationsthema das niemand anfasst, eine anstehende Entscheidung mit zu vielen Unbekannten. Zwei Stunden vor Ort, mit externem Blick — für 990 € zzgl. MwSt. inklusive Vor- und Nachbereitung.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      <Header />
      <main id="main-content" className="page-wrap pt-24 pb-10 sm:pt-24 sm:pb-12">
        <div className="page-stack">{children}</div>
      </main>
      <Footer />
    </NextIntlClientProvider>
    <Analytics />
    </body>
    </html>
  );
}
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { locales, isLocale, type Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Change-Werkstatt Sahil",
  description: "Effizienz und Kultur im Einklang",
};

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

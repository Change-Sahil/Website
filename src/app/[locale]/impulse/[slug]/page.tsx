import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/lib/articles";
import ArticleClient from "./article-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

const locales = ["de", "en", "es", "tr"];

export function generateStaticParams() {
  return ARTICLES.flatMap((article) =>
    locales.map((locale) => ({ locale, slug: article.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `${BASE_URL}/${locale}/impulse/${slug}`;

  const titleSuffix: Record<string, string> = {
    de: "Impulse | Change-Werkstatt Sahil",
    en: "Impulse | Change-Werkstatt Sahil",
    es: "Impulse | Change-Werkstatt Sahil",
    tr: "Impulse | Change-Werkstatt Sahil",
  };

  return {
    title: `${article.title} | ${titleSuffix[locale] ?? titleSuffix.de}`,
    description: article.teaser,
    alternates: {
      canonical: `${BASE_URL}/de/impulse/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${BASE_URL}/${l}/impulse/${slug}`])
      ),
    },
    openGraph: {
      title: article.title,
      description: article.teaser,
      url,
      siteName: "Change-Werkstatt Sahil",
      type: "article",
      locale: locale === "de" ? "de_DE" : locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "tr_TR",
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
      title: article.title,
      description: article.teaser,
      images: [`${BASE_URL}/seref-sahil-change-werkstatt.jpg`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return <ArticleClient article={article} locale={locale} />;
}

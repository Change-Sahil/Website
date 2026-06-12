// src/app/[locale]/impulse/[slug]/article-client.tsx
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { ARTICLES, type Article } from "@/lib/articles";

interface Props {
  article: Article;
  locale: string;
}

export default function ArticleClient({ article, locale }: Props) {
  const t   = useTranslations("impulse");
  const nav = useTranslations("nav");
  const isGerman = locale === "de";

  return (
    <div>

      {/* ── ARTIKEL-HERO ── */}
      <section
        className="relative flex flex-col justify-end"
        style={{
          marginTop: "-6rem",
          minHeight: "calc(38vh + 6rem)",
          paddingBottom: "3rem",
        }}
      >
        {/* Background extends to full viewport width without nesting another page-wrap */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "calc(50% - 50vw)",
            right: "calc(50% - 50vw)",
            background: [
              "radial-gradient(700px 360px at 4% 0%, rgba(0,168,165,.22), transparent 58%)",
              "radial-gradient(500px 280px at 96% 100%, rgba(0,112,125,.12), transparent 55%)",
              "linear-gradient(160deg, rgba(18,26,50,.97) 0%, rgba(14,20,40,.95) 100%)",
            ].join(", "),
          }}
        />
        <div className="relative max-w-2xl">

          {/* Breadcrumb */}
          <Link
            href={`/${locale}/impulse`}
            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.12em] uppercase mb-8 transition-opacity hover:opacity-60"
            style={{ color: "rgba(255,255,255,.38)" }}
          >
            ← {t("back")}
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[11px] tracking-[0.22em] uppercase"
              style={{ color: "rgba(255,255,255,.30)" }}
            >
              {article.date}
            </span>
            <span style={{ color: "rgba(255,255,255,.16)" }}>·</span>
            <span
              className="text-[11px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(255,255,255,.30)" }}
            >
              {article.readingTime}
            </span>
            <span style={{ color: "rgba(255,255,255,.16)" }}>·</span>
            <span
              className="text-[11px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(255,255,255,.30)" }}
            >
              {t("by")}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 830,
              lineHeight: 1.1,
              letterSpacing: "-0.028em",
              color: "rgba(255,255,255,.95)",
              marginBottom: "1rem",
            }}
          >
            {article.title}
          </h1>
          <p
            className="text-[1.05rem] leading-[1.62]"
            style={{ color: "rgba(255,255,255,.46)" }}
          >
            {article.subtitle}
          </p>

        </div>
      </section>

      {/* ── ARTIKEL-BODY ── */}
      <Reveal>
        <section className="pt-12 md:pt-16 pb-14 md:pb-18">
          {isGerman ? (
            <div
              className="article-body max-w-2xl"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />
          ) : (
            <div
              className="max-w-2xl rounded-[12px] px-7 py-6"
              style={{
                background: "rgba(14,20,32,.04)",
                border: "1px solid rgba(14,20,32,.08)",
              }}
            >
              <p
                className="text-[15px] leading-[1.72] mb-4"
                style={{ color: "rgba(var(--ink), .62)" }}
              >
                {t("germanOnly")}
              </p>
              <Link
                href={`/de/impulse/${article.slug}`}
                className="text-[14px] font-[580] transition-opacity hover:opacity-70"
                style={{ color: "rgb(var(--accent))" }}
              >
                Zum deutschen Artikel →
              </Link>
            </div>
          )}
        </section>
      </Reveal>

      {/* ── WEITERFÜHRENDE IMPULSE ── */}
      {article.relatedSlugs && article.relatedSlugs.length > 0 && (
        <Reveal>
          <section className="pb-14 md:pb-18">
            <div
              className="h-px mb-10"
              style={{ background: "rgba(14,20,32,.09)" }}
            />
            <p
              className="text-[11px] tracking-[0.22em] uppercase mb-6"
              style={{ color: "rgba(var(--ink), .38)" }}
            >
              Weiterführende Impulse
            </p>
            <div className="flex flex-col gap-4">
              {article.relatedSlugs.map((slug) => {
                const related = ARTICLES.find((a) => a.slug === slug);
                if (!related) return null;
                const href = isGerman
                  ? `/${locale}/impulse/${slug}`
                  : `/de/impulse/${slug}`;
                return (
                  <Link
                    key={slug}
                    href={href}
                    className="group inline-flex items-start gap-3 transition-opacity hover:opacity-75"
                  >
                    <span
                      className="mt-[3px] text-[18px] font-[300] select-none"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      →
                    </span>
                    <span
                      className="text-[1.05rem] font-[650] leading-[1.35] tracking-[-0.01em]"
                      style={{ color: "rgba(var(--ink), .88)" }}
                    >
                      {related.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* ── CTA ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2
                  className="text-[1.4rem] font-[760] leading-[1.3] tracking-[-0.02em]"
                  style={{ color: "rgba(255,255,255,.92)" }}
                >
                  {t("ctaTitle")}
                </h2>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-[1.80]"
                  style={{ color: "rgba(255,255,255,.52)" }}
                >
                  {t("ctaText")}
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center font-semibold px-5 py-3"
                  style={{
                    borderRadius: "5px",
                    background: "rgba(255,255,255,.96)",
                    color: "rgb(10,15,26)",
                    boxShadow: "0 2px 10px rgba(0,0,0,.15)",
                  }}
                >
                  {nav("cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}

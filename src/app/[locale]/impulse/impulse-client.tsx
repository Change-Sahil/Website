// src/app/[locale]/impulse/impulse-client.tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { ARTICLES } from "@/lib/articles";

export default function ImpulseClient() {
  const locale = useLocale();
  const t = useTranslations("impulse");
  const nav = useTranslations("nav");

  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col justify-end"
        style={{
          marginTop: "-6rem",
          minHeight: "calc(40vh + 6rem)",
          paddingBottom: "3.5rem",
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
          <p
            className="text-[11px] tracking-[0.28em] uppercase mb-5"
            style={{ color: "rgba(255,255,255,.36)" }}
          >
            {t("eyebrow")}
          </p>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 4.8vw, 3.8rem)",
              fontWeight: 830,
              lineHeight: 1.1,
              letterSpacing: "-0.032em",
              color: "rgba(255,255,255,.95)",
            }}
          >
            {t("title")}
          </h1>
          <p
            className="mt-5 text-[16px] leading-[1.78] max-w-xl"
            style={{ color: "rgba(255,255,255,.48)" }}
          >
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ── ARTIKEL-KACHELN ── */}
      <Reveal>
        <section className="pt-14 md:pt-18 pb-14 md:pb-20">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ARTICLES.map((article) => {
              const isGerman = locale === "de";
              const tileHref = isGerman
                ? `/${locale}/impulse/${article.slug}`
                : `/de/impulse/${article.slug}`;
              return (
                <Link
                  key={article.slug}
                  href={tileHref}
                  className="group flex flex-col rounded-[14px] px-6 py-7 transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,.99)",
                    border: "1px solid rgba(14,20,32,.09)",
                    boxShadow: "0 2px 6px rgba(15,23,42,.04), 0 6px 20px rgba(15,23,42,.07)",
                  }}
                >
                  {/* Reading time */}
                  <p
                    className="text-[11px] tracking-[0.18em] uppercase mb-4"
                    style={{ color: "rgba(var(--ink), .35)" }}
                  >
                    {article.readingTime}
                  </p>

                  {/* Title */}
                  <h2
                    className="text-[1.05rem] font-[760] leading-[1.3] tracking-[-0.015em] mb-2 transition-opacity duration-150 group-hover:opacity-75 flex-1"
                    style={{ color: "rgba(var(--ink), .92)" }}
                  >
                    {article.title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className="text-[13px] leading-[1.55] mb-6"
                    style={{ color: "rgba(var(--ink), .46)" }}
                  >
                    {article.subtitle}
                  </p>

                  {/* CTA */}
                  {isGerman ? (
                    <span
                      className="text-[13px] font-[640] tracking-[0.01em] mt-auto"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {t("readMore")} →
                    </span>
                  ) : (
                    <span
                      className="text-[11px] tracking-[0.14em] uppercase mt-auto"
                      style={{ color: "rgba(var(--ink), .32)" }}
                    >
                      {t("germanOnlyShort")}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

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

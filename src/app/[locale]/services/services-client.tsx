// src/app/[locale]/services/services-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";
import type { ServiceFormat, ServiceCta } from "@/types/i18n";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ServicesClient() {
  const locale = useLocale();
  const t   = useTranslations("services");
  const nav = useTranslations("nav");

  const formats = asArray<ServiceFormat>(t.raw("formats"));
  const cta     = t.raw("cta") as ServiceCta;

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "calc(52vh + 6rem)" }}>
        <Image
          src="/services2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "grayscale(1) contrast(1.05) brightness(0.97)", objectPosition: "50% 55%" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,15,26,0.90) 0%, rgba(10,15,26,0.80) 50%, rgba(10,15,26,0.60) 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 page-wrap flex flex-col flex-1 pt-28 pb-14 md:pt-32 md:pb-16">
          <div className="flex-1 flex flex-col justify-center max-w-3xl">
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3.4rem)",
                fontWeight: 840,
                lineHeight: 1.12,
                letterSpacing: "-0.032em",
                color: "rgba(255,255,255,.95)",
              }}
            >
              {t("title")}
            </h1>
            <p
              className="mt-6 text-[15.5px] leading-[1.82] whitespace-pre-line max-w-xl"
              style={{ color: "rgba(255,255,255,.50)" }}
            >
              {t("intro")}
            </p>
          </div>
        </div>
      </section>


      {/* ── FORMAT-SEKTIONEN — Editorial Vollbreite ── */}
      <section className="hero-bleed">
        {formats.map((f, i) => {
          const isDark      = i % 2 === 1;
          const bg          = isDark ? "rgb(10,15,26)" : i === 0 ? "rgb(237,236,231)" : "rgb(248,247,243)";
          const textPrimary = isDark ? "rgba(255,255,255,.92)" : "rgba(14,20,32,.88)";
          const textMuted   = isDark ? "rgba(255,255,255,.46)" : "rgba(14,20,32,.52)";
          const borderCol   = isDark ? "rgba(255,255,255,.08)" : "rgba(14,20,32,.08)";
          const dotWhen     = "rgb(var(--accent))";
          const dotNotWhen   = isDark ? "rgba(220,90,90,.50)" : "rgba(160,35,35,.42)";
          const labelNotWhen = isDark ? "rgba(220,90,90,.72)" : "rgba(160,35,35,.65)";

          return (
            <Reveal key={i}>
              <div className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" style={{ background: bg }}>
                <div className="max-w-4xl mx-auto">

                  {/* Mandatsauslöser */}
                  <p
                    className="italic"
                    style={{
                      fontSize: "clamp(1.7rem, 3.2vw, 2.8rem)",
                      fontWeight: 760,
                      lineHeight: 1.2,
                      letterSpacing: "-0.022em",
                      color: textPrimary,
                    }}
                  >
                    {f.trigger}
                  </p>

                  {/* Trennlinie + Format-Name */}
                  <div className="mt-8 flex items-center gap-5">
                    <div className="h-px flex-1" style={{ background: "rgb(var(--accent))", opacity: 0.35 }} />
                    <p
                      className="text-[12px] tracking-[0.26em] uppercase font-[700] shrink-0"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {f.name}
                    </p>
                    <div className="h-px flex-1" style={{ background: "rgb(var(--accent))", opacity: 0.35 }} />
                  </div>

                  {/* Beschreibung */}
                  <p
                    className="mt-8 text-[15px] leading-[1.84] max-w-2xl"
                    style={{ color: textMuted }}
                  >
                    {f.description}
                  </p>

                  {/* Sinnvoll wenn / Nicht passend */}
                  <div
                    className="mt-10 pt-10 grid gap-10 sm:grid-cols-2"
                    style={{ borderTop: `1px solid ${borderCol}` }}
                  >
                    <div>
                      <p
                        className="text-[11.5px] tracking-[0.22em] uppercase font-[700] mb-5"
                        style={{ color: "rgb(var(--accent))" }}
                      >
                        {t("labels.when")}
                      </p>
                      <ul className="space-y-3">
                        {f.when.map((item, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-[13.5px] leading-[1.74]"
                            style={{ color: textMuted }}
                          >
                            <span
                              className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                              style={{ background: dotWhen }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p
                        className="text-[11.5px] tracking-[0.22em] uppercase font-[700] mb-5"
                        style={{ color: labelNotWhen }}
                      >
                        {t("labels.notWhen")}
                      </p>
                      <ul className="space-y-3">
                        {f.notWhen.map((item, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-[13.5px] leading-[1.74]"
                            style={{ color: textMuted }}
                          >
                            <span
                              className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                              style={{ background: dotNotWhen }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>
          );
        })}
      </section>


      {/* ── CTA ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p
                  className="text-[1.35rem] font-[760] leading-[1.35] tracking-[-0.02em]"
                  style={{ color: "rgba(255,255,255,.92)" }}
                >
                  {cta?.kicker ?? ""}
                </p>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-[1.80]"
                  style={{ color: "rgba(255,255,255,.50)" }}
                >
                  {cta?.text ?? ""}
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

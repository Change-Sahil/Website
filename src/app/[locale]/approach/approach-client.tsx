// src/app/[locale]/approach/approach-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ApproachClient() {
  const locale = useLocale();
  const t    = useTranslations("approach");
  const nav  = useTranslations("nav");
  const tHome = useTranslations("home");

  const steps  = asArray<{ phase: string; title: string; intro: string; items: string[]; note: string }>(t.raw("how.steps"));

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "calc(62vh + 6rem)" }}>
        <Image
          src="/images/approach-01.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
          style={{ filter: "grayscale(0.2) brightness(0.94)", objectPosition: "50% 25%" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,15,26,0.78) 0%, rgba(10,15,26,0.72) 45%, rgba(10,15,26,0.42) 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 page-wrap flex flex-col flex-1 pt-28 pb-14 md:pt-32 md:pb-16">
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 850,
                lineHeight: 1.08,
                letterSpacing: "-0.036em",
                color: "rgba(255,255,255,.95)",
              }}
            >
              {t("title")}
            </h1>
            <p
              className="mt-5 text-lg leading-[1.75] whitespace-pre-line"
              style={{ color: "rgba(255,255,255,.62)" }}
            >
              {t("intro")}
            </p>
          </div>
        </div>
      </section>


      {/* ── VORGEHENSMODELL — Split-Screen ── */}
      <section className="hero-bleed">
        {steps.map((s, i) => {
          const isZigRight  = i % 2 === 1;
          const darkOnLeft  = !isZigRight;
          const lightBg     = i % 2 === 0 ? "rgb(237,236,231)" : "rgb(248,247,243)";
          return (
            <Reveal key={i}>
              <div className="flex flex-col">

                {/* ── Hauptzeile: dunkel | hell ── */}
                <div className="flex flex-col lg:flex-row lg:min-h-[62vh]">

                  {/* Dunkle Identitätshälfte */}
                  <div
                    className={`flex flex-col justify-center px-8 py-14 lg:py-20 shrink-0 lg:w-[44%] ${
                      isZigRight ? "lg:order-last" : ""
                    }`}
                    style={{ background: "rgb(10,15,26)" }}
                  >
                    <div
                      className={`lg:px-10 xl:px-16 max-w-md lg:max-w-none ${
                        darkOnLeft ? "lg:text-right" : ""
                      }`}
                    >
                      <div
                        aria-hidden
                        style={{
                          fontSize: "clamp(4.5rem, 7.5vw, 7rem)",
                          fontWeight: 900,
                          lineHeight: 0.82,
                          letterSpacing: "-0.04em",
                          color: "rgb(var(--accent))",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p
                        className="mt-4 text-[10px] tracking-[0.28em] uppercase font-[700]"
                        style={{ color: "rgba(var(--accent),.62)" }}
                      >
                        {s.phase}
                      </p>
                      <h3
                        className="mt-3"
                        style={{
                          fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                          fontWeight: 820,
                          lineHeight: 1.18,
                          letterSpacing: "-0.022em",
                          color: "rgba(255,255,255,.92)",
                        }}
                      >
                        {s.title}
                      </h3>
                      <p
                        className="mt-4 text-[14.5px] leading-[1.82] whitespace-pre-line"
                        style={{ color: "rgba(255,255,255,.48)" }}
                      >
                        {s.intro}
                      </p>
                    </div>
                  </div>

                  {/* Helle Inhaltshälfte — Items */}
                  <div
                    className="flex-1 flex flex-col justify-center px-8 py-14 lg:py-20"
                    style={{ background: lightBg }}
                  >
                    <div className={`lg:px-10 xl:px-16 max-w-lg ${isZigRight ? "lg:text-right lg:ml-auto" : ""}`}>
                      {asArray<string>(s.items).map((item, j) => (
                        <div
                          key={j}
                          className="py-[14px]"
                          style={
                            j > 0
                              ? { borderTop: "1px solid rgba(14,20,32,.10)" }
                              : undefined
                          }
                        >
                          <p className="text-[14.5px] leading-[1.76] text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ── Note — vollbreite Zeile, helles Papier als klare Abgrenzung ── */}
                <div
                  className="px-4 sm:px-6 lg:px-8 py-6"
                  style={{
                    background: lightBg,
                    borderTop: "1px solid rgba(14,20,32,.06)",
                  }}
                >
                  <div className="max-w-6xl mx-auto">
                    <p
                      className="text-[13px] leading-[1.78] italic"
                      style={{ color: "rgba(var(--ink), .40)" }}
                    >
                      {s.note}
                    </p>
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
                className="text-[1.25rem] font-[640] leading-[1.55] max-w-xl"
                style={{ color: "rgba(255,255,255,.88)" }}
              >
                {tHome("externalReason")}
              </p>
              <p
                className="mt-5 text-[14px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,.46)" }}
              >
                {t("cta.text")}
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

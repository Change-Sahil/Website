// src/app/[locale]/speaking/speaking-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type Topic = { title: string; subtitle: string; description: string };

export default function SpeakingClient() {
  const locale = useLocale();
  const t   = useTranslations("speaking");
  const nav = useTranslations("nav");

  const topics  = asArray<Topic>(t.raw("topics"));
  const formats = asArray<string>(t.raw("formats"));

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "calc(62vh + 6rem)" }}>
        <Image
          src="/images/speaking-hero.jpg"
          alt=""
          fill
          priority
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
          style={{ filter: "grayscale(0.15) brightness(0.92)", objectPosition: "50% 30%" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,15,26,0.80) 0%, rgba(10,15,26,0.72) 45%, rgba(10,15,26,0.44) 100%)",
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


      {/* ── THEMEN + FORMATE ── */}
      <Reveal>
        <section className="py-14 md:py-16">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-start">

            {/* Akkordeon: Themen */}
            <div className="lg:col-span-7">
              <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2] mb-2">
                {t("topicsTitle")}
              </h2>
              <p className="mb-8 text-[12px]" style={{ color: "rgba(var(--accent), .75)" }}>
                ↓ {t("topicsHint")}
              </p>

              {topics.map((topic, i) => {
                const open = openIndex === i;
                return (
                  <div
                    key={i}
                    className={i === 0 ? "" : "border-t border-[rgba(14,20,32,.08)]"}
                  >
                    <button
                      type="button"
                      id={`accordion-trigger-${i}`}
                      aria-expanded={open}
                      aria-controls={`accordion-panel-${i}`}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex w-full items-start justify-between gap-4 py-4 text-left"
                    >
                      <div>
                        <p
                          className="text-[15px] font-[580] leading-[1.5] transition-colors duration-150"
                          style={{ color: open ? "rgba(var(--ink), .95)" : "rgba(var(--ink), .82)" }}
                        >
                          {topic.title}
                        </p>
                        <p className="mt-0.5 text-[13.5px] leading-[1.5]"
                           style={{ color: "rgba(var(--ink), .45)" }}>
                          {topic.subtitle}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 flex-none text-[18px] font-[300] select-none transition-transform duration-200"
                        style={{
                          transform: open ? "rotate(45deg)" : "none",
                          color: open ? "rgb(var(--accent))" : "rgba(var(--ink), .35)",
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    </button>

                    <div
                      id={`accordion-panel-${i}`}
                      role="region"
                      aria-labelledby={`accordion-trigger-${i}`}
                      hidden={!open}
                      className="pb-5"
                    >
                      <p className="text-[14.5px] leading-[1.78]"
                         style={{ color: "rgba(var(--ink), .72)" }}>
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formate */}
            <div className="lg:col-span-5 lg:pl-10 lg:border-l border-[rgba(14,20,32,.08)]">
              <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2] mb-2">
                {t("formatsTitle")}
              </h2>
              {t("formatsSubtitle", { defaultValue: "" }) && (
                <p className="mt-2 text-[14px] leading-[1.6] mb-8"
                   style={{ color: "rgba(var(--ink), .52)" }}>
                  {t("formatsSubtitle")}
                </p>
              )}

              <ul className="space-y-0">
                {formats.map((x, i) => (
                  <li
                    key={i}
                    className={`text-[15px] leading-[1.72] text-slate-700 ${
                      i > 0 ? "pt-4 mt-4 border-t border-[rgba(14,20,32,.07)]" : ""
                    }`}
                  >
                    {x}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      </Reveal>


      {/* ── CTA — dunkler Abschluss ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p
                  className="text-[1.35rem] font-[760] leading-[1.35] tracking-[-0.02em]"
                  style={{ color: "rgba(255,255,255,.92)" }}
                >
                  {t("cta.kicker")}
                </p>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-[1.80]"
                  style={{ color: "rgba(255,255,255,.52)" }}
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

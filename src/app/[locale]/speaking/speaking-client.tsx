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
    <div className="space-y-12 md:space-y-16">

      {/* ── HERO (kein Reveal) ── */}
      <section className="page-wrap py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="section-eyebrow">
              <span className="dot" />
              <span>{t("eyebrow")}</span>
            </div>
            <h1 className="mt-4 title">{t("title")}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 muted md:text-lg">{t("intro")}</p>
          </div>

          <div className="lg:col-span-5">
            <div
              className="overflow-hidden rounded-[28px]"
              style={{
                border: "1px solid rgba(15,23,42,.10)",
                background: "rgba(255,255,255,.98)",
                boxShadow: "0 16px 40px rgba(15,23,42,.10)",
              }}
            >
              <Image
                src="/images/speaking-hero.jpg"
                alt={t("title")}
                width={1200}
                height={900}
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-[420px] w-full object-cover md:h-[340px] saturate-[0.9] contrast-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="page-wrap section-pad">
        <div className="grid gap-8 lg:grid-cols-12">

          {/* Akkordeon */}
          <Reveal className="lg:col-span-7">
            <div className="panel h-full">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("topicsTitle")}</span>
              </div>
              <p className="mt-2 text-xs tracking-wide" style={{ color: "rgba(var(--accent), .80)" }}>
                ↓ {t("topicsHint")}
              </p>

              <div className="mt-5">
                {topics.map((topic, i) => {
                  const open = openIndex === i;
                  return (
                    <div key={i} className={i === 0 ? "" : "border-t border-slate-200/70"}>
                      <button
                        type="button"
                        id={`accordion-trigger-${i}`}
                        aria-expanded={open}
                        aria-controls={`accordion-panel-${i}`}
                        onClick={() => setOpenIndex(open ? null : i)}
                        className="flex w-full items-start justify-between gap-4 py-4 text-left group"
                      >
                        <div className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-[10px] h-2 w-2 flex-none rounded-full transition-all duration-200"
                            style={{
                              background: open ? "rgb(var(--accent))" : "rgba(var(--accent), .60)",
                              boxShadow: open ? "0 0 0 8px rgba(0,168,165,.12)" : "0 0 0 6px rgba(0,168,165,.06)",
                            }}
                          />
                          <div>
                            <p
                              className="text-[15px] font-medium leading-7 transition-colors duration-150"
                              style={{ color: open ? "rgba(var(--ink), .95)" : "rgba(var(--ink), .88)" }}
                            >
                              {topic.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{topic.subtitle}</p>
                          </div>
                        </div>
                        <span
                          aria-hidden
                          className="mt-1 flex-none flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium select-none transition-all duration-200"
                          style={{
                            transform: open ? "rotate(45deg)" : "none",
                            background: open ? "rgba(var(--accent), .12)" : "rgba(var(--ink), .06)",
                            color: open ? "rgb(var(--accent))" : "rgba(var(--ink), .45)",
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
                        className="pb-5 pl-5 pr-2"
                      >
                        <p className="text-sm leading-7" style={{ color: "rgba(var(--ink), .74)" }}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Formate */}
          <Reveal className="lg:col-span-5" delay={80}>
            <div className="panel">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("formatsTitle")}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {formats.map((x, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[10px] h-2 w-2 flex-none rounded-full"
                      style={{ background: "rgba(var(--accent), .92)", boxShadow: "0 0 0 8px rgba(0,168,165,.08)" }}
                    />
                    <p className="text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>{x}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 hr-soft" />

              <p className="mt-6 text-sm leading-7" style={{ color: "rgba(var(--ink), .74)" }}>
                {t("ctaText")}
              </p>

              <div className="mt-7">
                <Link href={`/${locale}/contact`} className="btn-primary">{nav("cta")}</Link>
              </div>
              <div className="mt-3">
                <Link href={`/${locale}/services`} className="btn-secondary">{nav("services")}</Link>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

    </div>
  );
}

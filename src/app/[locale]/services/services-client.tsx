// src/app/[locale]/services/services-client.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import type { ServiceUi, ServiceKey, TeaserSection } from "@/types/i18n";

const KEYS: ServiceKey[] = ["workshops", "partnership", "sparring"];

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ServicesClient() {
  const locale = useLocale();
  const t   = useTranslations("services");
  const nav = useTranslations("nav");

  const ui     = t.raw("ui") as ServiceUi;
  const titles = ui?.cardTitles;
  const themes = asArray<string>(t.raw("themes.items"));
  const tabRoles = ui?.tabRole;

  const cards = useMemo(() => {
    const teaserSections = (ui?.teaserSections ?? {}) as Record<string, TeaserSection[]>;
    return KEYS.map((k) => ({
      key:          k,
      title:        titles?.[k] ?? k,
      role:         tabRoles?.[k] ?? "",
      teaser:       t(`ui.teaser.${k}`),
      subtitle:     t(`ui.detailSubtitle.${k}`),
      sections:     asArray<TeaserSection>(teaserSections[k]),
      when:         t(`ui.when.${k}`),
      notSuitable:  asArray<string>(t.raw(`ui.notSuitable.${k}`)),
      duration:     t(`ui.duration.${k}`),
      deliverables: asArray<string>(t.raw(`ui.deliverables.${k}`)),
      topics:       asArray<string>(t.raw(`ui.topics.${k}`)),
    }));
  }, [t, titles, tabRoles, ui]);

  const [activeKey, setActiveKey] = useState<ServiceKey>("partnership");
  const active    = cards.find((c) => c.key === activeKey) ?? cards[0];
  const tilesRef  = React.useRef<HTMLElement>(null);

  function selectFormat(key: ServiceKey) {
    setActiveKey(key);
    setTimeout(() => {
      if (!tilesRef.current) return;
      const top = tilesRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
  }

  const cta = ui?.cta;

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "calc(62vh + 6rem)" }}>
        <Image
          src="/services2.png"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ filter: "grayscale(1) contrast(1.05) brightness(0.97)", objectPosition: "50% 55%" }}
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


      {/* ── THEMENSCHWERPUNKTE ── */}
      <section className="py-14 md:py-16">

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
              {t("themes.title")}
            </h2>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {themes.map((item, i) => (
              <div key={i} className="flex gap-4">
                <span
                  className="shrink-0 text-[11px] font-[700] tracking-[0.08em] mt-[3px] tabular-nums"
                  style={{ color: "rgb(var(--accent))" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15px] leading-[1.75] text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── FORMAT-AUSWAHL ── */}
      <Reveal>
        <section className="py-14 md:py-16" ref={tilesRef}>
          <div>
            <p
              className="mb-6 text-[11px] tracking-[0.22em] uppercase font-[600]"
              style={{ color: "rgba(var(--ink),.38)" }}
            >
              Format wählen
            </p>

            {/* Format-Kacheln */}
            <div className="grid gap-3 sm:grid-cols-3">
              {cards.map((c) => {
                const tagline  = t(`ui.tagline.${c.key}`);
                const isActive = c.key === activeKey;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => selectFormat(c.key)}
                    className="group text-left px-5 py-5 transition-all duration-200 w-full hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      border: `1px solid ${isActive ? "rgba(0,168,165,0.40)" : "rgba(14,20,32,0.09)"}`,
                      background: isActive ? "rgba(0,168,165,0.04)" : "rgba(255,255,255,.80)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className="text-[13.5px] font-[680] leading-[1.25]"
                        style={{ color: "rgba(var(--ink),.90)" }}
                      >
                        {c.title}
                      </span>
                      <span
                        className="shrink-0 text-[10px] font-[650] tracking-[0.06em] mt-0.5"
                        style={{ color: isActive ? "rgb(var(--accent))" : "rgba(var(--ink),.38)" }}
                      >
                        {t(`ui.durationShort.${c.key}`)}
                      </span>
                    </div>
                    <p
                      className="text-[12.5px] leading-[1.6]"
                      style={{ color: "rgba(var(--ink),.52)" }}
                    >
                      {tagline}
                    </p>
                    <p
                      className="mt-3 text-[11px] font-[650] tracking-[0.06em] transition-colors duration-150 group-hover:text-[rgb(var(--accent))]"
                      style={{ color: isActive ? "rgb(var(--accent))" : "rgba(var(--ink),.42)" }}
                    >
                      {isActive ? "↓ Details" : "→ Details"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── DETAIL-PANEL — dunkle Sektion, Panel schwebt darin ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-18" style={{ background: "rgb(237,236,231)" }}>
          <div className="page-wrap">
          <div className="panel min-w-0">
            <p className="page-eyebrow">{t("ui.labels.detailsTitle")}</p>
            <h2
              className="mt-3 text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2] break-words hyphens-auto"
            >
              {active.title}
            </h2>

            <p className="mt-4 text-[15.5px] leading-[1.78] muted">{active.teaser}</p>
            {active.subtitle && (
              <p className="mt-2 text-[15px] font-[550] leading-7"
                 style={{ color: "rgba(var(--ink), .65)" }}>
                {active.subtitle}
              </p>
            )}

            {/* Thought modules */}
            {active.sections.length > 0 && (
              <div className="mt-8 space-y-3">
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p
                    className="mb-2 text-[10px] tracking-[0.18em] uppercase font-[700]"
                    style={{ color: "rgb(var(--accent))" }}
                  >
                    {active.sections[0]?.label}
                  </p>
                  <p className="text-[14.5px] leading-[1.78] muted">{active.sections[0]?.text}</p>
                </div>
                {active.sections.length > 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {active.sections.slice(1).map((s, i) => (
                      <div key={i} className="rounded-lg border border-slate-100 bg-slate-50/60 px-5 py-4">
                        <p
                          className="mb-2 text-[10px] tracking-[0.18em] uppercase font-[700]"
                          style={{ color: "rgb(var(--accent))" }}
                        >
                          {s.label}
                        </p>
                        <p className="text-[14px] leading-[1.78] muted whitespace-pre-line">{s.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 hr-soft" />

            {/* Wann sinnvoll | Was Sie bekommen */}
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div>
                <p className="page-eyebrow mb-4">{t("ui.labels.whenTitle")}</p>
                <ul className="space-y-2.5">
                  {active.when.split("\n").filter(Boolean).map((line, i) => (
                    <li key={i} className="flex gap-3 text-[14.5px] leading-[1.75]"
                        style={{ color: "rgba(var(--ink), .72)" }}>
                      <span className="mt-[10px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                            style={{ background: "rgb(var(--accent))" }} />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="page-eyebrow mb-4">{t("ui.labels.deliverablesTitle")}</p>
                <ul className="space-y-3">
                  {active.deliverables.map((x, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[10px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                            style={{ background: "rgb(var(--accent))" }} />
                      <span className="text-[14.5px] leading-[1.75] font-[450]"
                            style={{ color: "rgba(var(--ink), .80)" }}>
                        {x}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nicht passend */}
            {active.notSuitable.length > 0 && (
              <div
                className="mt-8 px-4 py-4 rounded-lg"
                style={{ border: "1px solid rgba(239,68,68,.16)", background: "rgba(239,68,68,.02)" }}
              >
                <p
                  className="text-[10px] tracking-[0.18em] uppercase font-[700] mb-3"
                  style={{ color: "rgba(185,28,28,.65)" }}
                >
                  {t("ui.labels.notSuitableTitle")}
                </p>
                <ul className="grid gap-y-1.5 sm:grid-cols-2">
                  {active.notSuitable.map((x, i) => (
                    <li key={i} className="flex gap-2.5 text-[12.5px] leading-5"
                        style={{ color: "rgba(var(--ink), .60)" }}>
                      <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full"
                            style={{ background: "rgba(185,28,28,.35)" }} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {active.duration && (
              <p className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                {t("ui.labels.durationTitle")}: {active.duration}
              </p>
            )}
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
                  className="text-[1.35rem] font-[760] leading-[1.35] tracking-[-0.02em] whitespace-pre-line"
                  style={{ color: "rgba(255,255,255,.92)" }}
                >
                  {cta?.kicker ?? ""}
                </p>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-[1.80]"
                  style={{ color: "rgba(255,255,255,.52)" }}
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

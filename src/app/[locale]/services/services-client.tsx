// src/app/[locale]/services/services-client.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";
import type { ServiceUi, ServiceKey } from "@/types/i18n";

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

  const cards = useMemo(() => KEYS.map((k) => ({
    key: k,
    title:        titles?.[k] ?? k,
    role:         tabRoles?.[k] ?? "",
    teaser:       t(`ui.teaser.${k}`),
    when:         t(`ui.when.${k}`),
    notSuitable:  asArray<string>(t.raw(`ui.notSuitable.${k}`)),
    tags:         asArray<string>(t.raw(`ui.tags.${k}`)),
    duration:     t(`ui.duration.${k}`),
    deliverables: asArray<string>(t.raw(`ui.deliverables.${k}`)),
    topics:       asArray<string>(t.raw(`ui.topics.${k}`)),
  })), [t, titles, tabRoles]);

  const [activeKey, setActiveKey] = useState<ServiceKey>("partnership");
  const active = cards.find((c) => c.key === activeKey) ?? cards[0];
  const detailRef = React.useRef<HTMLElement>(null);
  const tilesRef = React.useRef<HTMLElement>(null);

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
    <div className="page-stack">

      {/* ── HERO (kein Reveal) ── */}
      <section className="pt-10 pb-4 md:pt-12 md:pb-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6 min-w-0">
            <div className="section-eyebrow">
              <span className="dot" />
              <span>{ui?.kicker ?? "Formate"}</span>
            </div>
            <h1 className="mt-4 title">{t("title")}</h1>
            <p className="mt-5 text-lg leading-8 muted whitespace-pre-line">{t("intro")}</p>
            <div className="mt-8">
              <Link href={`/${locale}/approach`} className="btn-primary">{nav("approach")}</Link>
            </div>
          </div>

          <div className="lg:col-span-6 lg:-mt-4 min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/images/services-hero.jpg"
                alt={t("title")}
                width={1600}
                height={1000}
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-[380px] w-full object-cover md:h-[440px] saturate-[0.85] contrast-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THEMENSCHWERPUNKTE ── */}
      <Reveal>
        <section className="pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="panel">
            <div className="max-w-3xl">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("themes.kicker")}</span>
              </div>
              <h2 className="mt-3 section-title">{t("themes.title")}</h2>
              <p className="mt-4 text-base leading-7 muted">{t("themes.intro")}</p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {themes.map((item, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 h-full">
                    <div className="flex items-start min-w-0 gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-90" />
                      <p className="min-w-0 text-[15px] leading-6 text-slate-700">{item}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── SCHAUFENSTER-KACHELN ── */}
      <Reveal>
        <section className="pt-6 pb-2 md:pt-8 md:pb-3" ref={tilesRef}>
          <div className="section-eyebrow mb-4 pl-6 sm:pl-8">
            <span className="dot" />
            <span>{ui?.navTitle ?? "Formate"}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((c) => {
              const tagline = t(`ui.tagline.${c.key}`);
              const isActive = c.key === activeKey;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => selectFormat(c.key)}
                  className="text-left rounded-2xl border px-5 py-5 transition-all duration-200 w-full"
                  style={{
                    borderColor: isActive ? "rgba(0,168,165,0.45)" : "rgba(15,23,42,0.10)",
                    background: isActive ? "rgba(0,168,165,0.05)" : "#fff",
                    boxShadow: isActive ? "0 0 0 1px rgba(0,168,165,0.20)" : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-sm font-semibold" style={{ color: "rgba(var(--ink),.90)" }}>{c.title}</span>
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap" style={{ background: "rgba(var(--accent),.10)", color: "rgb(var(--accent))" }}>
                      {t(`ui.durationShort.${c.key}`)}
                    </span>
                  </div>
                  <p className="text-[13px] leading-5" style={{ color: "rgba(var(--ink),.55)" }}>{tagline}</p>
                  <div className="mt-3 text-[12px] font-semibold" style={{ color: isActive ? "rgb(var(--accent))" : "rgba(var(--ink),.35)" }}>
                    {isActive ? "↓ Details" : "→ Details"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ── AUSWAHL + DETAILS ── */}
      <Reveal>
        <section className="pt-2 pb-8 md:pt-3 md:pb-10" ref={detailRef}>
          <div>
            {/* DETAIL PANEL – full width */}
            <div role="tabpanel" id={`panel-${activeKey}`}>
              <div className="panel min-w-0">
                <div className="section-eyebrow">
                  <span className="dot" />
                  <span>{t("ui.labels.detailsTitle")}</span>
                </div>
                <h2 className="mt-3 section-title break-words hyphens-auto max-w-full">{active.title}</h2>
                <p className="mt-4 text-[15px] leading-7 muted whitespace-pre-line">{active.teaser}</p>

                <div className="mt-8 hr-soft" />

                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  <div className="min-w-0">
                    <div className="section-eyebrow">
                      <span className="dot" />
                      <span>{t("ui.labels.whenTitle")}</span>
                    </div>
                    {active.when.includes('\n') ? (
                      <ul className="mt-3 grid gap-y-2">
                        {active.when.split('\n').map((line, i) => (
                          <li key={i} className="flex gap-3 text-[15px] leading-7 break-words" style={{ color: "rgba(var(--ink), .74)" }}>
                            <span className="mt-[11px] h-1.5 w-1.5 flex-none rounded-full" style={{ background: "rgb(var(--accent))" }} />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 pl-[18px] text-[15px] leading-7 break-words" style={{ color: "rgba(var(--ink), .74)" }}>
                        {active.when}
                      </p>
                    )}
                    {active.topics.length ? (
                      <div className="mt-8">
                        <div className="section-eyebrow">
                          <span className="dot" />
                          <span>{t("ui.labels.topicsTitle")}</span>
                        </div>
                        <ul className="mt-4 list break-words">
                          {active.topics.map((x, i) => <li key={i}>{x}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    {active.notSuitable.length ? (
                      <div className="mb-8 rounded-2xl border px-5 py-4" style={{ borderColor: "rgba(239,68,68,.20)", background: "rgba(239,68,68,.03)" }}>
                        <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.20em] uppercase font-semibold" style={{ color: "rgba(185,28,28,.75)" }}>
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden style={{ flexShrink: 0 }}>
                            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M10 6v5M10 14v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                          <span>{t("ui.labels.notSuitableTitle")}</span>
                        </div>
                        <ul className="mt-3 grid gap-y-2">
                          {active.notSuitable.map((x, i) => (
                            <li key={i} className="flex min-w-0 gap-3 text-[13px] leading-6" style={{ color: "rgba(var(--ink), .70)" }}>
                              <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full" style={{ background: "rgba(185,28,28,.45)" }} />
                              <span className="min-w-0">{x}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="section-eyebrow">
                      <span className="dot" />
                      <span>{t("ui.labels.deliverablesTitle")}</span>
                    </div>
                    <ul className="mt-4 list break-words">
                      {active.deliverables.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                    {active.duration && (
                      <div className="mt-8">
                        <div className="section-eyebrow">
                          <span className="dot" />
                          <span>{t("ui.labels.durationTitle")}</span>
                        </div>
                        <p className="mt-1 pl-[18px] text-sm" style={{ color: "rgba(var(--ink), .74)" }}>
                          {active.duration}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section className="pt-8 pb-12 md:pt-10 md:pb-16">
          <div className="dark-block p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="min-w-0">
                <div className="section-eyebrow" style={{ color: "rgba(255,255,255,.70)" }}>
                  <span className="dot" style={{ boxShadow: "0 0 0 7px rgba(0,168,165,.16)" }} />
                  <span>{cta?.kicker ?? "15 Minuten Orientierung"}</span>
                </div>
                <p className="mt-4 max-w-2xl break-words" style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>
                  {cta?.text ?? ""}
                </p>
              </div>
              <Link href={`/${locale}/contact`} className="btn-primary">{nav("cta")}</Link>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}

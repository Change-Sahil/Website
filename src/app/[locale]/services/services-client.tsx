// src/app/[locale]/services/services-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";
import type { ServiceUi, ServiceKey } from "@/types/i18n";

const KEYS: ServiceKey[] = ["workshops", "partnership", "sparring"];

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export default function ServicesClient() {
  const locale = useLocale();
  const t   = useTranslations("services");
  const nav = useTranslations("nav");

  const ui     = t.raw("ui") as ServiceUi;
  const titles = ui?.cardTitles;
  const themes = asArray<string>(t.raw("themes.items"));

  const cards = useMemo(() => KEYS.map((k) => ({
    key: k,
    title:       titles?.[k] ?? k,
    teaser:      t(`ui.teaser.${k}`),
    when:        t(`ui.when.${k}`),
    tags:        asArray<string>(t.raw(`ui.tags.${k}`)),
    duration:    t(`ui.duration.${k}`),
    deliverables: asArray<string>(t.raw(`ui.deliverables.${k}`)),
    topics:      asArray<string>(t.raw(`ui.topics.${k}`)),
  })), [t, titles]);

  const [activeKey, setActiveKey] = useState<ServiceKey>("workshops");
  const active = cards.find((c) => c.key === activeKey) ?? cards[0];
  const tagsWithoutDuration = active.duration
    ? active.tags.filter((x) => x.trim() !== active.duration.trim())
    : active.tags;

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
                      <p className="min-w-0 text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── AUSWAHL + DETAILS ── */}
      <Reveal>
        <section className="py-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-12">

            {/* LINKS – Tabs */}
            <div className="lg:col-span-4 min-w-0">
              <div className="panel">
                <div className="section-eyebrow">
                  <span className="dot" />
                  <span>{ui?.navTitle ?? "Schnellnavigation"}</span>
                </div>
                <div className="mt-5 grid gap-2" role="tablist" aria-label={ui?.navTitle ?? "Formate"}>
                  {cards.map((c) => {
                    const isActive = c.key === activeKey;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        role="tab"
                        id={`tab-${c.key}`}
                        aria-selected={isActive}
                        aria-controls={`panel-${c.key}`}
                        onClick={() => setActiveKey(c.key)}
                        className={[
                          "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200",
                          isActive
                            ? "border border-[rgba(0,168,165,0.35)] bg-[rgba(0,168,165,0.06)]"
                            : "border border-[rgba(15,23,42,0.10)] bg-[rgba(255,255,255,0.98)] hover:border-[rgba(15,23,42,0.18)] hover:bg-white",
                        ].join(" ")}
                      >
                        <span className="text-sm font-semibold break-words" style={{ color: "rgba(var(--ink), .90)" }}>
                          {c.title}
                        </span>
                        <span aria-hidden style={{ color: "rgba(var(--ink), .45)" }}>→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RECHTS – Panel */}
            <div className="lg:col-span-8 min-w-0" role="tabpanel" id={`panel-${activeKey}`} aria-labelledby={`tab-${activeKey}`}>
              <div className="panel h-full min-w-0">
                <div className="section-eyebrow">
                  <span className="dot" />
                  <span>{t("ui.labels.detailsTitle")}</span>
                </div>
                <h2 className="mt-3 section-title break-words hyphens-auto max-w-full">{active.title}</h2>
                <p className="mt-4 text-sm md:text-base leading-7 muted whitespace-pre-line">{active.teaser}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {active.duration ? <Chip>{active.duration}</Chip> : null}
                  {tagsWithoutDuration.slice(0, 2).map((tag, i) => <Chip key={i}>{tag}</Chip>)}
                </div>

                <div className="mt-8 hr-soft" />

                <div className="mt-8 grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-6 min-w-0">
                    <div className="section-eyebrow">
                      <span className="dot" />
                      <span>{t("ui.labels.whenTitle")}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 break-words" style={{ color: "rgba(var(--ink), .74)" }}>
                      {active.when}
                    </p>
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

                  <div className="lg:col-span-6 min-w-0">
                    <div className="section-eyebrow">
                      <span className="dot" />
                      <span>{t("ui.labels.deliverablesTitle")}</span>
                    </div>
                    <ul className="mt-4 list break-words">
                      {active.deliverables.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
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

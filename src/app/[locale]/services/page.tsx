// src/app/[locale]/services/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Key = "workshops" | "partnership" | "sparring";
const KEYS: Key[] = ["workshops", "partnership", "sparring"];

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export default function ServicesPage() {
  const locale = useLocale();
  const t = useTranslations("services");
  const nav = useTranslations("nav");

  const ui = t.raw("ui") as any;
  const titles = ui?.cardTitles as Partial<Record<Key, string>>;

  const cards = useMemo(() => {
    return KEYS.map((k) => ({
      key: k,
      title: titles?.[k] ?? k,
      teaser: t(`ui.teaser.${k}`),
      when: t(`ui.when.${k}`),
      tags: asArray<string>(t.raw(`ui.tags.${k}`)),
      duration: t(`ui.duration.${k}`),
      deliverables: asArray<string>(t.raw(`ui.deliverables.${k}`)),
      topics: asArray<string>(t.raw(`ui.topics.${k}`)),
    }));
  }, [t, titles]);

  const [activeKey, setActiveKey] = useState<Key>("workshops");
  const active = cards.find((c) => c.key === activeKey) ?? cards[0];

  // Remove duration duplication if it appears in tags
  const tagsWithoutDuration = active.duration
    ? active.tags.filter((x) => x.trim() !== active.duration.trim())
    : active.tags;

  // Bottom dark CTA (i18n)
  const cta = t.raw("ui.cta") as any;

  return (
    <div className="space-y-12 md:space-y-14">
 {/* HERO */}
<section className="page-wrap py-12 md:py-16">
  <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
    <div className="lg:col-span-6">
      <div className="section-eyebrow">
        <span className="dot" />
        <span>{ui?.kicker ?? "Formate"}</span>
      </div>

      <h1 className="mt-4 title">{t("title")}</h1>
      <p className="mt-5 text-lg leading-8 muted whitespace-pre-line">
        {t("intro")}
      </p>

      {/* Reduce CTAs: keep only a secondary navigation link (Header already has CTA) */}
      <div className="mt-8">
        <Link href={`/${locale}/approach`} className="btn-secondary">
          {nav("approach")}
        </Link>
      </div>
    </div>

    <div className="lg:col-span-6 lg:-mt-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Image
          src="/images/services-hero.jpg"
          alt={t("title")}
          width={1600}
          height={1000}
          className="h-[380px] w-full object-cover md:h-[440px] saturate-[0.85] contrast-[1.05]"
          priority={false}
        />
      </div>
    </div>
  </div>
</section>


      {/* AUSWAHL + DETAILS */}
      <section className="page-wrap section-pad">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LINKS: Navigation */}
          <div className="lg:col-span-4">
            <div className="panel">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{ui?.navTitle ?? "Schnellnavigation"}</span>
              </div>

              <div className="mt-5 grid gap-2">
                {cards.map((c) => {
                  const isActive = c.key === activeKey;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setActiveKey(c.key)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left"
                      aria-current={isActive ? "true" : undefined}
                      style={{
                        border: isActive
                          ? "1px solid rgba(0,168,165,.35)"
                          : "1px solid rgba(15,23,42,.10)",
                        background: isActive
                          ? "rgba(0,168,165,.06)"
                          : "rgba(255,255,255,.98)",
                      }}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "rgba(var(--ink), .90)" }}
                      >
                        {c.title}
                      </span>
                      <span aria-hidden style={{ color: "rgba(var(--ink), .45)" }}>
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RECHTS: Details */}
          <div className="lg:col-span-8">
            <div className="panel h-full">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("ui.labels.detailsTitle")}</span>
              </div>

              <h2 className="mt-3 section-title">{active.title}</h2>

              <p className="mt-4 text-sm md:text-base leading-7 muted whitespace-pre-line">
              {active.teaser}
              </p>


              {/* Meta: Dauer + 2 Tags (unique) */}
              <div className="mt-6 flex flex-wrap gap-2">
                {active.duration ? <Chip>{active.duration}</Chip> : null}
                {tagsWithoutDuration.slice(0, 2).map((tag, i) => (
                  <Chip key={i}>{tag}</Chip>
                ))}
              </div>

              <div className="mt-8 hr-soft" />

              <div className="mt-8 grid gap-10 lg:grid-cols-12">
                {/* Wann sinnvoll */}
                <div className="lg:col-span-6">
                  <div className="section-eyebrow">
                    <span className="dot" />
                    <span>{t("ui.labels.whenTitle")}</span>
                  </div>
                  <p
                    className="mt-3 text-sm leading-7"
                    style={{ color: "rgba(var(--ink), .74)" }}
                  >
                    {active.when}
                  </p>

                  {/* Typische Anlässe/Themen */}
                  {active.topics.length ? (
                    <div className="mt-8">
                      <div className="section-eyebrow">
                        <span className="dot" />
                        <span>{t("ui.labels.topicsTitle")}</span>
                      </div>
                      <ul className="mt-4 list">
                        {active.topics.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {/* Deliverables */}
                <div className="lg:col-span-6">
                  <div className="section-eyebrow">
                    <span className="dot" />
                    <span>{t("ui.labels.deliverablesTitle")}</span>
                  </div>

                  <ul className="mt-4 list">
                    {active.deliverables.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA unten (i18n, no hardcode) */}
      <section className="page-wrap pb-16 md:pb-20">
        <div className="dark-block p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="section-eyebrow" style={{ color: "rgba(255,255,255,.70)" }}>
                <span className="dot" style={{ boxShadow: "0 0 0 7px rgba(0,168,165,.16)" }} />
                <span>{cta?.kicker ?? "15 Minuten Orientierung"}</span>
              </div>

              <p
                className="mt-4 max-w-2xl"
                style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}
              >
                {cta?.text ?? ""}
              </p>
            </div>

            <Link href={`/${locale}/contact`} className="btn-primary">
              {nav("cta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

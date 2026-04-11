// src/app/[locale]/home-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";
import type { HomeHero, HomePillars, HomeAudience } from "@/types/i18n";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function HomeClient() {
  const locale = useLocale();
  const t = useTranslations("home");
  const nav = useTranslations("nav");

  const hero     = t.raw("hero")     as HomeHero;
  const pillars  = t.raw("pillars")  as HomePillars;
  const audience = t.raw("audience") as HomeAudience;

  const pillarItems = asArray<{ title: string; text: string; meta?: string }>(pillars?.items);
  const targets  = asArray<string>(audience?.targets);
  const triggers = asArray<string>(audience?.triggers);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  return (
    <div className="space-y-14 md:space-y-16">

      {/* ── HERO (kein Reveal – above the fold) ── */}
      <section className="mt-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  src="/images/home-01.jpg"
                  alt="Strategische Ausrichtung"
                  width={1600}
                  height={1000}
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="h-[320px] w-full object-cover object-[left_65%] md:h-[410px] lg:h-[450px] xl:h-[490px]"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="section-eyebrow"><span>{hero?.kicker ?? ""}</span></div>
              <h1 className="mt-3 text-3xl font-[760] leading-[1.12] tracking-[-0.025em] sm:text-4xl" style={{ color: "rgba(var(--ink),.94)" }}>{hero?.title ?? ""}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 muted whitespace-pre-line">
                {hero?.intro ?? ""}
              </p>
            </div>
          </div>
      </section>

      {/* ── ZIELGRUPPEN ── */}
      <Reveal>
        <section>
          <div className="section-eyebrow"><span className="dot" /><span>{audience?.subtitle ?? ""}</span></div>
          <h2 className="mt-3 section-title">{audience?.title ?? ""}</h2>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/40 overflow-hidden">
            {/* Tab-Leiste */}
            <div className="flex border-b border-slate-200">
              {[audience?.boxTitles?.[0] ?? "", audience?.boxTitles?.[1] ?? ""].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i as 0 | 1)}
                  className="group flex-1 px-6 py-4 text-left transition-colors"
                  style={{
                    background: activeTab === i ? "#fff" : "transparent",
                    borderBottom: activeTab === i ? "2px solid rgb(var(--accent))" : "2px solid transparent",
                    marginBottom: "-1px",
                    cursor: activeTab === i ? "default" : "pointer",
                  }}
                >
                  <span
                    className="flex items-center gap-2 text-[11px] font-[700] tracking-[0.20em] uppercase transition-colors"
                    style={{ color: activeTab === i ? "rgb(var(--accent))" : "rgba(var(--ink),.55)" }}
                  >
                    {label}
                    {activeTab === i ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5, flexShrink: 0 }}>
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab-Inhalt */}
            <div className="p-6">
              <ul className="grid gap-y-3 text-[15px] leading-7 text-slate-700">
                {(activeTab === 0 ? targets : triggers).map((x, i) => (
                  <li key={i} className="flex min-w-0 gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-90" />
                    <span className="min-w-0">{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── PILLARS ── */}
      <section>
        <Reveal>
          <div className="section-eyebrow"><span className="dot" /><span>{pillars?.subtitle ?? ""}</span></div>
          <h2 className="mt-3 section-title">{pillars?.title ?? ""}</h2>
        </Reveal>

        {/* Warum extern */}
        <Reveal delay={40}>
          <div
            className="mt-8 px-6 py-5 text-[15px] leading-7"
            style={{
              borderLeft: "3px solid rgb(var(--accent))",
              background: "rgba(0,168,165,.04)",
              borderRadius: "0 14px 14px 0",
              color: "rgba(var(--ink), .82)",
            }}
          >
            {t("externalReason")}
          </div>
        </Reveal>

        {/* Bild + Text */}
        <Reveal delay={80}>
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/images/home-02.jpg"
                alt="Zusammenarbeit in der Umsetzung"
                width={1600}
                height={900}
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-[320px] w-full object-cover md:h-[380px]"
              />
            </div>
            <div className="panel flex items-center">
              <div>
                <div className="section-eyebrow"><span className="dot" /><span>{t("divider.kicker")}</span></div>
                <h3 className="mt-3 section-title">{t("divider.title")}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-7 muted">{t("divider.text")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Kacheln – gestaffelt */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillarItems.slice(0, 3).map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-base font-semibold" style={{ color: "rgba(var(--ink),.88)" }}>{p.title}</div>
                  <div className="text-xs font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <p className="mt-3 text-[15px] leading-7 muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ORIENTIERUNG ── */}
      <Reveal>
        <div className="panel">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="section-eyebrow"><span className="dot" /><span>{t("orientation.kicker")}</span></div>
              <h3 className="mt-3 section-title">{t("orientation.title")}</h3>
              <p className="mt-4 max-w-xl text-[15px] leading-7 muted whitespace-pre-line">
                {t("orientation.text")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${locale}/contact`} className="btn-primary">{nav("cta")}</Link>
                <Link href={`/${locale}/services`} className="btn-secondary">{nav("services")}</Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50">
                <Image
                  src="/images/home-03.jpg"
                  alt="Atmosphäre"
                  width={1200}
                  height={800}
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="h-[220px] w-full object-cover opacity-95 md:h-[240px]"
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

    </div>
  );
}

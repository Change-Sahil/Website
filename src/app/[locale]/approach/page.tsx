// src/app/[locale]/approach/page.tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ApproachPage() {
  const locale = useLocale();
  const t = useTranslations("approach");
  const nav = useTranslations("nav");

  const principles = asArray<string>(t.raw("principles"));
  const toolbox = asArray<string>(t.raw("toolbox"));

  return (
    <div className="space-y-12 md:space-y-14">
      {/* HERO */}
      <section className="page-wrap py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* TEXT */}
          <div className="lg:col-span-6">
            <div className="max-w-2xl">
              <div className="section-eyebrow">
                <span className="dot" />
                {/* FIX: Eyebrow aus approach.json */}
                <span>{t("eyebrow")}</span>
              </div>

              <h1 className="mt-4 title">{t("title")}</h1>
              <p className="mt-5 text-lg leading-8 muted">{t("intro")}</p>

              {/* nur 1 CTA */}
              <div className="mt-8">
                <Link href={`/${locale}/services`} className="btn-primary">
                  {nav("services")}
                </Link>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src="/images/approach-01.jpg"
                alt="Arbeiten im Führungs- und Umsetzungsalltag"
                className="h-[280px] w-full object-cover md:h-[340px] saturate-[0.85] contrast-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRINZIPIEN – editorial, ruhig */}
      <section className="page-wrap section-pad">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">
              <span className="dot" />
              {/* FIX: Eyebrow getrennt vom Titel */}
              <span>{t("principlesEyebrow")}</span>
            </div>
            <h2 className="section-title mt-3">{t("principlesTitle")}</h2>
          </div>
        </div>

        <div className="mt-8 panel">
          <ul className="space-y-5">
            {principles.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-[10px] h-2 w-2 flex-none rounded-full"
                  style={{
                    background: "rgba(var(--accent), .92)",
                    boxShadow: "0 0 0 8px rgba(0,168,165,.08)",
                  }}
                />
                <p className="text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>
                  {p}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* VORGEHENSMODELL */}
      <section className="page-wrap section-pad">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">
              <span className="dot" />
              <span>{t("how.kicker")}</span>
            </div>
            <h2 className="section-title mt-3">{t("how.title")}</h2>
            <p className="mt-3 max-w-3xl text-sm muted">{t("how.subtitle")}</p>
          </div>
        </div>

        <div className="mt-8 panel">
          <div className="grid gap-6 md:grid-cols-3">
            {asArray<{ verb: string; text: string; out: string[] }>(t.raw("how.steps")).map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 sm:p-6"
                style={{ border: "1px solid rgba(15,23,42,.10)", background: "rgba(255,255,255,.98)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] tracking-[0.26em] uppercase" style={{ color: "rgba(var(--ink), .55)" }}>
                      {t("how.stepLabel")} {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-lg" style={{ color: "rgba(var(--ink), .92)", fontWeight: 760 }}>
                      {s.verb}
                    </div>
                    <p className="mt-3 text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>
                      {s.text}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="mt-2 h-2 w-2 flex-none rounded-full"
                    style={{
                      background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent2)))",
                      boxShadow: "0 0 0 8px rgba(0,168,165,.10)",
                    }}
                  />
                </div>

                <div className="mt-5 hr-soft" />

                <div className="mt-5">
                  <div className="text-[11px] tracking-[0.26em] uppercase" style={{ color: "rgba(var(--ink), .55)" }}>
                    {t("how.outTitle")}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {s.out.map((x, j) => (
                      <li key={j} className="text-sm leading-6" style={{ color: "rgba(var(--ink), .74)" }}>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WERKZEUGE */}
      <section className="page-wrap section-pad">
        <div className="section-head">
          <div>
            <div className="section-eyebrow">
              <span className="dot" />
              <span>{t("toolboxEyebrow")}</span>
            </div>
            <h2 className="section-title mt-3">{t("toolboxTitle")}</h2>
            <p className="mt-3 max-w-3xl text-sm muted">{t("toolboxSubtitle")}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {toolbox.map((x, i) => (
            <div key={i} className="card">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="mt-[9px] h-2 w-2 flex-none rounded-full"
                  style={{
                    background: "rgba(var(--accent), .92)",
                    boxShadow: "0 0 0 8px rgba(0,168,165,.08)",
                  }}
                />
                <p className="text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>
                  {x}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* leise Brücke zu Leistungen */}
        <div className="mt-10">
          <div className="hr-soft" />
          <p className="mt-6 max-w-3xl text-sm leading-7 muted">{t("bridge")}</p>
          <div className="mt-5">
            <Link href={`/${locale}/services`} className="btn-secondary">
              {t("bridgeCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA (dark, premium) – komplett aus JSON */}
      <section className="page-wrap pb-16 md:pb-20">
        <div className="dark-block p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="section-eyebrow" style={{ color: "rgba(255,255,255,.70)" }}>
                <span
                  className="dot"
                  style={{
                    boxShadow: "0 0 0 7px rgba(0,168,165,.16)",
                  }}
                />
                <span>{t("cta.kicker")}</span>
              </div>

              <p className="mt-4 max-w-2xl" style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>
                {t("cta.text")}
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

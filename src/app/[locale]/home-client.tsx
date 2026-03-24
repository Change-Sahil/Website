// src/app/[locale]/home-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
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

  return (
    <div className="space-y-20">

      {/* ── HERO (kein Reveal – above the fold) ── */}
      <section className="mt-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6 lg:pt-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  src="/images/home-01.jpg"
                  alt="Strategische Ausrichtung"
                  width={1600}
                  height={1000}
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="h-[320px] w-full object-cover object-[left_65%] md:h-[390px] lg:h-[430px] xl:h-[470px]"
                />
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-8">
              <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
                {hero?.kicker ?? ""}
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-4xl">
                {hero?.title ?? ""}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 whitespace-pre-line">
                {hero?.intro ?? ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZIELGRUPPEN ── */}
      <Reveal>
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
          <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
            {audience?.subtitle ?? ""}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
            {audience?.title ?? ""}
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-6">
              <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
                {audience?.boxTitles?.[0] ?? ""}
              </div>
              <ul className="mt-5 grid gap-y-3 text-sm leading-7 text-slate-700">
                {targets.map((x, i) => (
                  <li key={i} className="flex min-w-0 gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-90" />
                    <span className="min-w-0">{x}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-6">
              <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
                {audience?.boxTitles?.[1] ?? ""}
              </div>
              <ul className="mt-5 grid gap-y-3 text-sm leading-7 text-slate-700">
                {triggers.map((x, i) => (
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
          <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
            {pillars?.subtitle ?? ""}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
            {pillars?.title ?? ""}
          </h2>
        </Reveal>

        {/* Bild + Text */}
        <Reveal delay={80}>
          <div className="mt-10 mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
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
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] md:p-10">
                <div>
                  <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
                    {t("divider.kicker")}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900 whitespace-pre-line">
                    {t("divider.title")}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                    {t("divider.text")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Kacheln – gestaffelt */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillarItems.slice(0, 3).map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-base font-semibold text-slate-900">{p.title}</div>
                  <div className="text-xs font-semibold text-slate-400">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ORIENTIERUNG ── */}
      <Reveal>
        <section className="mt-16">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)] md:p-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.26em] uppercase text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-accent-90" />
                    <span>{t("orientation.kicker")}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900 whitespace-pre-line md:text-3xl">
                    {t("orientation.title")}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
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
          </div>
        </section>
      </Reveal>

    </div>
  );
}

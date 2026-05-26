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
  const t      = useTranslations("home");
  const nav    = useTranslations("nav");

  const hero     = t.raw("hero")     as HomeHero;
  const pillars  = t.raw("pillars")  as HomePillars;
  const audience = t.raw("audience") as HomeAudience;

  const pillarItems = asArray<{ title: string; text: string }>(pillars?.items);
  const triggers    = asArray<string>(audience?.triggers);


  const titleRaw  = hero?.title ?? "";
  const splitAt   = titleRaw.indexOf(". ");
  const heroPartA = splitAt > 0 ? titleRaw.slice(0, splitAt + 1) : titleRaw;
  const heroPartB = splitAt > 0 ? titleRaw.slice(splitAt + 2)    : "";

  return (
    <div>

      {/* ════════════════════════════════════════════
          HERO — Vollbild, Bild im Hintergrund, Text oben
      ════════════════════════════════════════════ */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "100vh" }}>

        {/* Hintergrundbild */}
        <Image
          src="/images/services-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover object-center"
          aria-hidden
        />

        {/* Warmer Overlay — lässt das Bild durchscheinen, hält Text lesbar */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(248,247,243,0.74) 0%, rgba(248,247,243,0.52) 55%, rgba(248,247,243,0.70) 100%)",
          }}
          aria-hidden
        />

        {/* Inhalt */}
        <div className="relative z-10 page-wrap flex flex-col flex-1 pt-28 pb-10 md:pt-32 md:pb-14">


          {/* Typografie — Das Gap */}
          <div className="flex-1 flex flex-col justify-center">
            <h1
              aria-label={titleRaw}
              style={{
                textShadow:
                  "0 0 28px rgba(248,247,243,1), 0 0 56px rgba(248,247,243,0.85), 0 0 90px rgba(248,247,243,0.60)",
              }}
            >
              <span className="home-display home-display--thin">
                {heroPartA}
              </span>

              <span className="block mt-16 mb-12 md:mt-20 md:mb-16" aria-hidden="true" />
<span className="home-display home-display--heavy">
                {heroPartB}
              </span>
            </h1>
          </div>

          {/* Scroll-Hinweis */}
          <div className="pb-4">
            <span
              className="text-[11px] tracking-[0.20em] uppercase"
              style={{ color: "rgba(var(--ink), .28)" }}
            >
              ↓
            </span>
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════
          INTRO — Text links, Seref-Foto rechts
      ════════════════════════════════════════════ */}
      <Reveal>
        <section className="py-12 md:py-16">
          <div className="grid gap-10 items-center lg:grid-cols-2">
            <div>
              <p className="text-lg leading-[1.85] muted whitespace-pre-line">
                {hero?.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/contact`} className="btn-primary">
                  {nav("cta")}
                </Link>
                <Link href={`/${locale}/services`} className="btn-secondary">
                  {nav("services")}
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ height: "520px" }}>
              <Image
                src="/Seref_home.png"
                alt="Seref Sahil"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </section>
      </Reveal>


      {/* ════════════════════════════════════════════
          DIE SITUATION — Trigger
      ════════════════════════════════════════════ */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-18" style={{ background: "rgb(237,236,231)" }}>
          <div className="page-wrap">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4 lg:pt-1">
                <p
                  className="text-[11px] tracking-[0.24em] uppercase"
                  style={{ color: "rgba(var(--ink), .40)" }}
                >
                  {audience?.subtitle}
                </p>
                <h2 className="mt-3 text-[1.6rem] font-[760] leading-[1.2] tracking-[-0.02em]">
                  {audience?.title}
                </h2>
              </div>
              <div className="lg:col-span-8">
                {triggers.map((text, i) => (
                  <div
                    key={i}
                    className={`flex gap-6 ${
                      i > 0 ? "mt-8 pt-8 border-t border-[rgba(14,20,32,.09)]" : ""
                    }`}
                  >
                    <span
                      className="shrink-0 text-[11px] font-[700] tracking-[0.08em] mt-[3px] tabular-nums"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] leading-[1.78] text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>


      {/* ════════════════════════════════════════════
          WAS UNTERSCHEIDET — Bild + Säulen
      ════════════════════════════════════════════ */}
      <Reveal>
        <section className="py-14 md:py-18">
          <div className="grid lg:grid-cols-2 lg:items-stretch gap-0">
            <div className="overflow-hidden">
              <Image
                src="/images/home-02.jpg"
                alt="Zusammenarbeit in der Umsetzung"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="home-img-pillar"
              />
            </div>
            <div className="py-10 lg:pl-14 flex flex-col justify-center">
              {pillarItems.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className={i > 0 ? "mt-8 pt-8 border-t border-[rgba(14,20,32,.07)]" : ""}
                >
                  <h3
                    className="text-[1.05rem] font-[740] leading-[1.3] tracking-[-0.01em]"
                    style={{ color: "rgba(var(--ink), .90)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.78] text-slate-600">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>


      {/* ════════════════════════════════════════════
          CTA — dunkler Abschluss
      ════════════════════════════════════════════ */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2
                  className="whitespace-pre-line"
                  style={{
                    fontSize: "clamp(2rem, 4.6vw, 3.8rem)",
                    fontWeight: 840,
                    lineHeight: 1.1,
                    letterSpacing: "-0.036em",
                    color: "rgba(255,255,255,.92)",
                  }}
                >
                  {t("orientation.title")}
                </h2>
                <p
                  className="mt-6 max-w-lg text-[15px] leading-[1.80] whitespace-pre-line"
                  style={{ color: "rgba(255,255,255,.52)" }}
                >
                  {t("orientation.text")}
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <div className="flex flex-wrap gap-3">
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
                  <Link
                    href={`/${locale}/services`}
                    className="inline-flex items-center justify-center font-semibold px-5 py-3"
                    style={{
                      borderRadius: "5px",
                      color: "rgba(255,255,255,.82)",
                      border: "1px solid rgba(255,255,255,.32)",
                      background: "transparent",
                    }}
                  >
                    {nav("services")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}

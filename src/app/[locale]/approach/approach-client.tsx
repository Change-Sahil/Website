// src/app/[locale]/approach/approach-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ApproachClient() {
  const locale = useLocale();
  const t    = useTranslations("approach");
  const nav  = useTranslations("nav");
  const tHome = useTranslations("home");

  const steps  = asArray<{ verb: string; text: string; out: string[] }>(t.raw("how.steps"));
  const groups = asArray<{ label: string; items: string[] }>(t.raw("collaboration.groups"));

  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero-bleed relative flex flex-col" style={{ marginTop: "-6rem", minHeight: "calc(62vh + 6rem)" }}>
        <Image
          src="/images/approach-01.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="object-cover"
          style={{ filter: "grayscale(0.2) brightness(0.94)", objectPosition: "50% 25%" }}
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


      {/* ── VORGEHENSMODELL ── */}
      <Reveal>
        <section className="py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
                {t("how.title")}
              </h2>
              {t("how.subtitle", { defaultValue: "" }) && (
                <p className="mt-3 text-[14.5px] leading-[1.75] muted">
                  {t("how.subtitle")}
                </p>
              )}
            </div>

            <div className="lg:col-span-8">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`flex gap-8 ${i > 0 ? "mt-10" : ""}`}
                >
                  {/* Schritt-Nummer */}
                  <div className="shrink-0 w-8 pt-1">
                    <span
                      className="text-[11px] font-[700] tracking-[0.08em] tabular-nums"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Verb — das Herzstück, groß */}
                    <h3
                      className="text-[1.55rem] font-[800] tracking-[-0.025em] leading-[1.1]"
                      style={{ color: "rgba(var(--ink), .92)" }}
                    >
                      {s.verb}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-[1.78] text-slate-600">
                      {s.text}
                    </p>

                    {/* Ergebnisse: inline, kein eigener Container */}
                    {s.out.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
                        {s.out.map((x, j) => (
                          <span
                            key={j}
                            className="text-[13px] leading-[1.6]"
                            style={{ color: "rgba(var(--ink), .52)" }}
                          >
                            {j > 0 && (
                              <span className="mr-5" style={{ color: "rgba(var(--ink), .18)" }}>
                                ·
                              </span>
                            )}
                            {x}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── WIE ZUSAMMENARBEIT AUSSIEHT ── */}
      <section className="hero-bleed py-14 md:py-16" style={{ background: "rgb(237,236,231)" }}>
        <div className="page-wrap">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
              {t("collaboration.title")}
            </h2>
          </div>

          {/* Gruppen: drei Blöcke, keine Panel-Box */}
          <div className="lg:col-span-8 grid gap-8 md:grid-cols-3">
            {groups.map((g, i) => (
              <div key={i}>
                <p
                  className="text-[10px] tracking-[0.22em] uppercase font-[700] mb-5"
                  style={{ color: "rgb(var(--accent))" }}
                >
                  {g.label}
                </p>
                <ul className="space-y-3">
                  {g.items.map((item, j) => (
                    <li
                      key={j}
                      className={`text-[14.5px] leading-[1.68] text-slate-700 ${
                        j > 0
                          ? "pt-3 border-t border-[rgba(14,20,32,.06)]"
                          : ""
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>


      {/* ── CTA ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <p
                className="text-[1.25rem] font-[640] leading-[1.55] max-w-xl"
                style={{ color: "rgba(255,255,255,.88)" }}
              >
                {tHome("externalReason")}
              </p>
              <p
                className="mt-5 text-[14px] leading-[1.75]"
                style={{ color: "rgba(255,255,255,.46)" }}
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

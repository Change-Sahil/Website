// src/app/[locale]/werkstattgespraech/werkstattgespraech-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type Step = { label: string; duration: string; text: string };
type Condition = { label: string; text: string };

export default function WerkstattgespraechClient() {
  const locale = useLocale();
  const t      = useTranslations("werkstattgespraech");
  const nav    = useTranslations("nav");

  const pdfHref = ({ de: "/onepager-de.pdf", en: "/onepager-en.pdf", es: "/onepager-es.pdf", tr: "/onepager-tr.pdf" } as Record<string,string>)[locale] ?? "/onepager-de.pdf";

  const steps      = asArray<Step>(t.raw("steps"));
  const deliverables = asArray<string>(t.raw("deliverables"));
  const whenYes    = asArray<string>(t.raw("whenYes"));
  const whenNo     = asArray<string>(t.raw("whenNo"));
  const conditions = asArray<Condition>(t.raw("conditions"));

  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="hero-bleed relative flex flex-col"
        style={{ marginTop: "-6rem", minHeight: "calc(52vh + 6rem)" }}
      >
        <Image
          src="/images/Hero_Werkstattgespraech.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "grayscale(1) contrast(1.05) brightness(0.72)", objectPosition: "50% 40%" }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,15,26,0.90) 0%, rgba(10,15,26,0.76) 55%, rgba(10,15,26,0.60) 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 page-wrap flex flex-col flex-1 pt-28 pb-14 md:pt-36 md:pb-18 justify-end">
          <p
            className="text-[11px] tracking-[0.26em] uppercase font-[700] mb-5"
            style={{ color: "rgb(var(--accent))" }}
          >
            {t("eyebrow")}
          </p>
          <h1
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              fontWeight: 860,
              lineHeight: 1.06,
              letterSpacing: "-0.038em",
              color: "rgba(255,255,255,.95)",
            }}
          >
            {t("title")}
          </h1>
          <p
            className="mt-5 text-[1.15rem] font-[340] tracking-[-0.01em]"
            style={{ color: "rgba(255,255,255,.48)" }}
          >
            {t("tagline")}
          </p>
        </div>
      </section>


      {/* ── INTRO ── */}
      <Reveal>
        <section className="py-14 md:py-18">
          <div className="max-w-2xl">
            {t("intro").split("\n\n").map((p, i) => (
              <p
                key={i}
                className={`text-[15.5px] leading-[1.85] text-slate-700 ${i > 0 ? "mt-5" : ""}`}
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      </Reveal>


      {/* ── ABLAUF ── */}
      <Reveal>
        <section className="hero-bleed py-16 md:py-20" style={{ background: "rgb(237,236,231)" }}>
          <div className="page-wrap">
            <p
              className="text-[11px] tracking-[0.26em] uppercase font-[700] mb-10"
              style={{ color: "rgb(var(--accent))" }}
            >
              {t("processTitle")}
            </p>
            <div className="grid gap-0 md:grid-cols-3">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div
                    className={`py-6 md:py-0 md:pr-10 ${
                      i > 0 ? "border-t border-[rgba(14,20,32,.09)] md:border-t-0 md:border-l md:pl-10" : ""
                    }`}
                  >
                    <span
                      className="block text-[11px] font-[700] tracking-[0.08em] tabular-nums mb-3"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[1rem] font-[740] leading-[1.3] tracking-[-0.01em] mb-1">
                      {step.label}
                    </p>
                    <p
                      className="text-[11px] tracking-[0.08em] uppercase font-[600] mb-3"
                      style={{ color: "rgba(14,20,32,.40)" }}
                    >
                      {step.duration}
                    </p>
                    <p className="text-[14px] leading-[1.75]" style={{ color: "rgba(14,20,32,.62)" }}>
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── WAS SIE BEKOMMEN ── */}
      <Reveal>
        <section className="py-14 md:py-18">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <h2 className="text-[1.3rem] font-[720] tracking-[-0.018em] leading-[1.25]"
                  style={{ color: "rgba(var(--ink),.80)" }}>
                {t("deliverablesTitle")}
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <ul className="space-y-5">
                {deliverables.map((item, i) => (
                  <li key={i} className="flex gap-4 text-[15px] leading-[1.78]"
                      style={{ color: "rgba(var(--ink),.68)" }}>
                    <span
                      className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                      style={{ background: "rgb(var(--accent))" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── SINNVOLL / NICHT SINNVOLL ── */}
      <Reveal>
        <section className="hero-bleed py-16 md:py-20" style={{ background: "rgb(224,222,216)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 sm:grid-cols-2">

              <div>
                <p
                  className="text-[11.5px] tracking-[0.22em] uppercase font-[700] mb-6"
                  style={{ color: "rgb(var(--accent))" }}
                >
                  {t("whenYesTitle")}
                </p>
                <ul className="space-y-4">
                  {whenYes.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-[1.74]"
                        style={{ color: "rgba(14,20,32,.68)" }}>
                      <span
                        className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                        style={{ background: "rgb(var(--accent))" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="text-[11.5px] tracking-[0.22em] uppercase font-[700] mb-6"
                  style={{ color: "rgba(160,35,35,.70)" }}
                >
                  {t("whenNoTitle")}
                </p>
                <ul className="space-y-4">
                  {whenNo.map((item, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-[1.74]"
                        style={{ color: "rgba(14,20,32,.68)" }}>
                      <span
                        className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full shrink-0"
                        style={{ background: "rgba(160,35,35,.50)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>
      </Reveal>


      {/* ── INVESTITION ── */}
      <Reveal>
        <section className="hero-bleed py-16 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">

              <div className="lg:col-span-4">
                <p
                  className="text-[11px] tracking-[0.26em] uppercase font-[700] mb-6"
                  style={{ color: "rgb(var(--accent))" }}
                >
                  {t("investmentTitle")}
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                      fontWeight: 860,
                      letterSpacing: "-0.03em",
                      color: "rgba(255,255,255,.95)",
                      lineHeight: 1,
                    }}
                  >
                    {t("price")}
                  </span>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,.42)" }}>
                    {t("priceSuffix")}
                  </span>
                </div>
                <p className="mt-2 text-[12px]" style={{ color: "rgba(255,255,255,.32)" }}>
                  {t("priceNote")}
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <dl className="space-y-5">
                  {conditions.map((c, i) => (
                    <div key={i} className={`pt-5 ${i > 0 ? "border-t border-[rgba(255,255,255,.07)]" : ""}`}>
                      <dt
                        className="text-[11px] tracking-[0.14em] uppercase font-[700] mb-1"
                        style={{ color: "rgba(255,255,255,.38)" }}
                      >
                        {c.label}
                      </dt>
                      <dd className="text-[14.5px] leading-[1.70]" style={{ color: "rgba(255,255,255,.62)" }}>
                        {c.text}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

            </div>
          </div>
        </section>
      </Reveal>


      {/* ── CTA + PDF ── */}
      <Reveal>
        <section className="py-14 md:py-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-[14px] leading-[1.7] max-w-sm"
              style={{ color: "rgba(var(--ink),.42)" }}
            >
              {t("ctaNote")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: "13px" }}
              >
                ↓ {t("pdfLabel")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="btn-primary"
              >
                {t("ctaLabel")}
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}

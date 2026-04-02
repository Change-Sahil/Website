// src/app/[locale]/approach/approach-client.tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function ApproachClient() {
  const locale = useLocale();
  const t   = useTranslations("approach");
  const nav = useTranslations("nav");

  const principles = asArray<string>(t.raw("principles"));
  const toolbox    = asArray<string>(t.raw("toolbox"));

  return (
    <div className="page-stack">

      {/* ── HERO (kein Reveal) ── */}
      <section className="py-8 md:py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="max-w-2xl">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("eyebrow")}</span>
              </div>
              <h1 className="mt-4 title">{t("title")}</h1>
              <p className="mt-5 text-lg leading-8 muted whitespace-pre-line">{t("intro")}</p>
              <div className="mt-8">
                <Link href={`/${locale}/services`} className="btn-primary">{nav("services")}</Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/images/approach-01.jpg"
                alt="Arbeiten im Führungs- und Umsetzungsalltag"
                width={1200}
                height={900}
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-[280px] w-full object-cover md:h-[340px] saturate-[0.85] contrast-[1.05]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRINZIPIEN ── */}
      <Reveal>
        <section className="section-pad">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("principlesEyebrow")}</span>
              </div>
              <h2 className="section-title mt-3">{t("principlesTitle")}</h2>
            </div>
          </div>

          <div className="mt-8 panel">
            <ul className="space-y-5">
              {principles.map((p, i) => {
                const split = p.indexOf(":\n");
                const title = split >= 0 ? p.slice(0, split) : null;
                const body  = split >= 0 ? p.slice(split + 2) : p;
                return (
                  <li key={i} className="flex gap-4">
                    <span
                      aria-hidden
                      style={{ marginTop: 10, width: 10, height: 10, flexShrink: 0, borderRadius: 999, display: "inline-block", background: "rgb(148,163,184)", boxShadow: "0 0 0 7px rgba(148,163,184,.20)" }}
                    />
                    <p className="text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>
                      {title && <><span className="font-semibold" style={{ color: "rgba(var(--ink), .88)" }}>{title}</span><br /></>}
                      {body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ── VORGEHENSMODELL ── */}
      <section className="section-pad">
        <Reveal>
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
        </Reveal>

        <div className="mt-8 panel">
          <div className="grid gap-6 md:grid-cols-3">
            {asArray<{ verb: string; text: string; out: string[] }>(t.raw("how.steps")).map((s, i) => (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="rounded-2xl p-5 sm:p-6 h-full"
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
                      <p className="mt-3 text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>{s.text}</p>
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
                        <li key={j} className="text-sm leading-6" style={{ color: "rgba(var(--ink), .74)" }}>{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={100}>
          <div className="mt-6 flex items-start gap-3 max-w-3xl">
            <span aria-hidden style={{ color: "rgb(var(--accent))", fontSize: "1rem", lineHeight: "1.75rem", flexShrink: 0 }}>✦</span>
            <p className="text-sm leading-7 muted">{t("how.restriction")}</p>
          </div>
        </Reveal>
      </section>

      {/* ── WERKZEUGE ── */}
      <section className="section-pad">
        <Reveal>
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
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {toolbox.map((x, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="card h-full">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    style={{ marginTop: 9, width: 10, height: 10, flexShrink: 0, borderRadius: 999, display: "inline-block", background: "rgb(148,163,184)", boxShadow: "0 0 0 7px rgba(148,163,184,.20)" }}
                  />
                  <p className="text-[15px] leading-7" style={{ color: "rgba(var(--ink), .78)" }}>{x}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-10">
            <div className="hr-soft" />
            <div className="mt-6 flex items-start gap-3 max-w-3xl">
              <span aria-hidden style={{ color: "rgb(var(--accent))", fontSize: "1rem", lineHeight: "1.75rem", flexShrink: 0 }}>✦</span>
              <p className="text-sm leading-7 muted">{t("bridge")}</p>
            </div>
            <div className="mt-5">
              <Link href={`/${locale}/services`} className="btn-primary">{t("bridgeCta")}</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <Reveal>
        <section className="pb-16 md:pb-20">
          <div className="dark-block p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div>
                <div className="section-eyebrow" style={{ color: "rgba(255,255,255,.70)" }}>
                  <span className="dot" style={{ boxShadow: "0 0 0 7px rgba(0,168,165,.16)" }} />
                  <span>{t("cta.kicker")}</span>
                </div>
                <p className="mt-4 max-w-2xl" style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>
                  {t("cta.text")}
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

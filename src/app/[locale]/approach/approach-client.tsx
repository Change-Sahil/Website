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

      {/* ── WIE ZUSAMMENARBEIT AUSSIEHT ── */}
      <Reveal>
        <section className="section-pad">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("collaboration.kicker")}</span>
              </div>
              <h2 className="section-title mt-3">{t("collaboration.title")}</h2>
            </div>
          </div>
          <div className="mt-8 panel">
            <div className="grid gap-8 md:grid-cols-3">
              {asArray<{ label: string; items: string[] }>(t.raw("collaboration.groups")).map((g, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div>
                    <div className="mb-4 text-[11px] tracking-[0.18em] uppercase font-semibold" style={{ color: "rgb(var(--accent))" }}>{g.label}</div>
                    <ul className="space-y-2.5">
                      {g.items.map((item, j) => (
                        <li key={j} className="flex gap-3" style={{ color: "rgba(var(--ink), .78)" }}>
                          <span className="mt-[10px] h-1.5 w-1.5 flex-none rounded-full shrink-0" style={{ background: "rgb(var(--accent))" }} />
                          <span className="text-[15px] leading-6">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── VORGEHENSMODELL ── */}
      <Reveal>
        <section className="section-pad">
          <div className="section-eyebrow mb-6">
            <span className="dot" />
            <span>{t("how.title")}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {asArray<{ verb: string; text: string; out: string[] }>(t.raw("how.steps")).map((s, i) => (
              <div
                key={i}
                className="rounded-[18px] bg-white px-5 py-6 h-full"
                style={{
                  border: "1px solid rgba(15,23,42,.09)",
                  boxShadow: "0 2px 6px rgba(15,23,42,.06), 0 10px 28px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.85)"
                }}
              >
                <div className="text-[10px] tracking-[0.26em] uppercase font-semibold mb-2" style={{ color: "rgb(var(--accent))", opacity: 0.75 }}>
                  {t("how.stepLabel")} {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[17px] font-semibold mb-3" style={{ color: "rgba(var(--ink), .92)" }}>{s.verb}</div>
                <p className="text-[14px] leading-6 mb-5" style={{ color: "rgba(var(--ink), .65)" }}>{s.text}</p>
                <div className="hr-soft mb-4" />
                <ul className="space-y-2">
                  {s.out.map((x, j) => (
                    <li key={j} className="flex gap-2.5" style={{ color: "rgba(var(--ink), .62)" }}>
                      <span className="mt-[7px] h-1 w-1 flex-none rounded-full shrink-0" style={{ background: "rgba(var(--accent), .55)" }} />
                      <span className="text-[13px] leading-5">{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

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

// src/app/[locale]/about/about-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { blurDataURL } from "@/lib/blur";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type PracticeItem   = { title?: string; text?: string };
type TestimonialItem = { quote?: string; role?: string; context?: string };

export default function AboutClient() {
  const locale = useLocale();
  const t   = useTranslations("about");
  const nav = useTranslations("nav");

  const bullets       = asArray<string>(t.raw("bullets"));
  const intro         = asArray<string>(t.raw("intro"));
  const practiceItems = asArray<PracticeItem>(t.raw("practiceItems"));
  const testimonials  = asArray<TestimonialItem>(t.raw("testimonials"));

  const hasPractice    = !!t("practiceTitle", { defaultValue: "" }) && practiceItems.length > 0;
  const hasTestimonials = !!t("testimonialsTitle", { defaultValue: "" }) && testimonials.length > 0;

  return (
    <div>

      {/* ── HERO — Split: dunkel links, Foto rechts ── */}
      <section
        className="hero-bleed relative"
        style={{ marginTop: "-6rem", minHeight: "calc(70vh + 6rem)" }}
      >
        <div className="grid lg:grid-cols-2" style={{ minHeight: "calc(70vh + 6rem)" }}>

          {/* Links: dunkles Panel */}
          <div
            className="flex flex-col justify-center pt-28 pb-14 px-6 sm:px-10 lg:px-16 xl:px-20 md:pt-32 md:pb-16"
            style={{ background: "rgb(10,15,26)" }}
          >
            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
                fontWeight: 850,
                lineHeight: 1.08,
                letterSpacing: "-0.036em",
                color: "rgba(255,255,255,.95)",
              }}
            >
              {t("heroTitle")}
            </h1>
            <div className="mt-6 space-y-4 max-w-md">
              {intro.map((p, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-[1.80]"
                  style={{ color: "rgba(255,255,255,.56)" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Rechts: Foto ohne Overlay */}
          <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
            <Image
              src="/Seref_about.png"
              alt="Seref Sahil"
              fill
              priority
              className="object-cover object-top"
            />
          </div>

        </div>
      </section>


      {/* ── PROFIL ── */}
      <Reveal>
        <section className="py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Fließtext */}
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
                Seref Sahil
              </h2>
              <div className="space-y-4 pt-2">
                {t("profileText")
                  .split("\n\n")
                  .map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.78] text-slate-700">{p}</p>
                  ))}
              </div>
              <div className="pt-2">
                <a
                  href="https://www.linkedin.com/in/seref-sahil-78304aa4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-2 hover:text-slate-900 transition-colors"
                  style={{ color: "rgba(var(--ink), .55)" }}
                >
                  {t("linkedInLabel", { defaultValue: "LinkedIn-Profil ansehen" })}
                </a>
              </div>
            </div>

            {/* Steckbrief */}
            <div className="lg:col-span-5 lg:pl-10 lg:border-l border-[rgba(14,20,32,.08)]">
              <ul className="space-y-5">
                {bullets.map((b, i) => (
                  <li
                    key={i}
                    className={`pt-5 text-[14.5px] leading-[1.75] text-slate-700 ${
                      i > 0 ? "border-t border-[rgba(14,20,32,.07)]" : ""
                    }`}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>


      {/* ── ERFAHRUNG AUS DER PRAXIS ── */}
      {hasPractice && (
        <section className="hero-bleed py-14 md:py-16" style={{ background: "rgb(237,236,231)" }}>
          <div className="page-wrap">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
                {t("practiceTitle")}
              </h2>
              {t("practiceIntro", { defaultValue: "" }) && (
                <p className="mt-4 text-[15px] leading-[1.75] muted">
                  {t("practiceIntro")}
                </p>
              )}
            </div>

            {/* Praxisfelder: Linien statt Cards */}
            <div className="lg:col-span-8">
              {practiceItems.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div
                    className={`flex gap-6 ${
                      i > 0 ? "mt-8 pt-8 border-t border-[rgba(14,20,32,.07)]" : ""
                    }`}
                  >
                    <span
                      className="shrink-0 text-[11px] font-[700] tracking-[0.08em] mt-[3px] tabular-nums"
                      style={{ color: "rgb(var(--accent))" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      {item.title && (
                        <h3 className="text-[1rem] font-[720] leading-[1.3] tracking-[-0.01em]"
                            style={{ color: "rgba(var(--ink), .90)" }}>
                          {item.title}
                        </h3>
                      )}
                      {item.text && (
                        <p className="mt-2.5 text-[14.5px] leading-[1.78] text-slate-600">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          </div>
        </section>
      )}


      {/* ── TESTIMONIALS ── */}
      {hasTestimonials && (
        <section className="py-14 md:py-18">
          <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2] mb-12">
            {t("testimonialsTitle")}
          </h2>

          <div>
            {testimonials.map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <div
                  className={`grid gap-x-6 md:grid-cols-12 ${
                    i > 0 ? "mt-12 pt-12 border-t border-[rgba(14,20,32,.07)]" : ""
                  }`}
                >
                  {/* Anführungszeichen */}
                  <div className="md:col-span-1">
                    <span
                      className="block text-[4rem] leading-[0.85] font-[200]"
                      style={{ color: "rgb(var(--accent))" }}
                      aria-hidden
                    >&ldquo;</span>
                  </div>

                  {/* Zitat + Quelleninfo */}
                  <div className="md:col-span-11">
                    {item.quote && (
                      <blockquote
                        className="text-[1.08rem] leading-[1.88] font-[380]"
                        style={{ color: "rgba(var(--ink), .80)" }}
                      >
                        {item.quote}
                      </blockquote>
                    )}
                    <div className="mt-5">
                      {item.role && (
                        <p className="text-[11px] font-[700] uppercase tracking-[0.14em]"
                           style={{ color: "rgba(var(--ink), .55)" }}>
                          {item.role}
                        </p>
                      )}
                      {item.context && (
                        <p className="mt-1 text-[12px] leading-[1.5]"
                           style={{ color: "rgba(var(--ink), .38)" }}>
                          {item.context}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}


      {/* ── CTA — dunkler Abschluss ── */}
      <Reveal>
        <section className="hero-bleed py-14 md:py-20" style={{ background: "rgb(10,15,26)" }}>
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <p
                  className="text-[1.35rem] font-[760] leading-[1.35] tracking-[-0.02em]"
                  style={{ color: "rgba(255,255,255,.92)" }}
                >
                  {t("cta.kicker")}
                </p>
                <p
                  className="mt-4 max-w-lg text-[15px] leading-[1.80] whitespace-pre-line"
                  style={{ color: "rgba(255,255,255,.52)" }}
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

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

type PracticeItem = { title?: string; text?: string };
type TestimonialItem = { quote?: string; role?: string; context?: string };

export default function AboutClient() {
  const locale = useLocale();
  const t   = useTranslations("about");
  const nav = useTranslations("nav");

  const bullets      = asArray<string>(t.raw("bullets"));
  const intro        = asArray<string>(t.raw("intro"));
  const practiceItems  = asArray<PracticeItem>(t.raw("practiceItems"));
  const testimonials   = asArray<TestimonialItem>(t.raw("testimonials"));

  const hasPracticeSection  = !!t("practiceTitle", { defaultValue: "" }) && practiceItems.length > 0;
  const hasTestimonialsSection = !!t("testimonialsTitle", { defaultValue: "" }) && testimonials.length > 0;

  return (
    <div className="page-stack">

      {/* ── HERO (kein Reveal) ── */}
      <section className="py-8 md:py-10">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{nav("about")}</span>
              </div>
              <h1 className="mt-4 title">{t("heroTitle")}</h1>
              {t("heroSubtitle", { defaultValue: "" }) && (
                <p className="mt-3 text-xl leading-8">{t("heroSubtitle")}</p>
              )}
              <div className="mt-5 space-y-4">
                {intro.map((p, i) => (
                  <p key={i} className="text-lg leading-8 muted whitespace-pre-line">{p}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="panel overflow-hidden p-0">
              <div className="relative h-[400px] w-full md:h-[520px]">
                <Image
                  src={t("heroImage", { defaultValue: "/seref-sahil-change-werkstatt.jpg" })}
                  alt={t("heroImageAlt", { defaultValue: "Seref Sahil" })}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="object-cover object-[center_15%]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFIL ── */}
      <Reveal>
        <section className="section-pad">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("profileTitle")}</span>
              </div>
              <h2 className="section-title mt-3">Seref Sahil</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <div className="panel h-full">
                <div className="space-y-4">
                  {t("profileText")
                    .split("\n\n")
                    .map((p, i) => (
                      <p
                        key={i}
                        className={
                          i === 0
                            ? "text-[15px] font-medium leading-7 text-slate-800"
                            : "text-[15px] leading-7 text-slate-700"
                        }
                      >
                        {p}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="panel h-full">
                <div className="section-eyebrow">
                  <span className="dot" />
                  <span>{t("bulletsEyebrow")}</span>
                </div>
                <ul className="list mt-4">
                  {bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="mt-6 border-t border-slate-200/70 pt-5" />
                <p className="mt-4 text-sm text-slate-600">
                  <a
                    href="https://www.linkedin.com/in/seref-sahil-78304aa4/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-slate-800"
                  >
                    {t("linkedInLabel", { defaultValue: "LinkedIn-Profil ansehen" })}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── POSITIONIERUNG ── */}
      {t("clarityText", { defaultValue: "" }) && (
        <Reveal>
          <section className="py-2">
            <div
              className="panel px-8 py-7"
              style={{ borderLeft: "3px solid rgb(var(--accent))", background: "rgba(0,168,165,.04)", borderRadius: "0 16px 16px 0" }}
            >
              <p className="text-base leading-8" style={{ color: "rgba(var(--ink), .85)", fontWeight: 500 }}>
                {t("clarityText")}
              </p>
            </div>
          </section>
        </Reveal>
      )}

      {/* ── ERFAHRUNG AUS DER PRAXIS ── */}
      {hasPracticeSection && (
        <section className="section-pad">
          <Reveal>
            <div className="max-w-3xl">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("practiceEyebrow")}</span>
              </div>
              <h2 className="section-title mt-3">{t("practiceTitle")}</h2>
              {t("practiceIntro", { defaultValue: "" }) && (
                <p className="mt-4 text-lg leading-8 muted">{t("practiceIntro")}</p>
              )}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {practiceItems.map((item, i) => (
              <Reveal key={i} delay={i * 70}>
                <article className="panel h-full border border-slate-200/70 bg-white/80 px-6 py-7 md:px-7 md:py-8">
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[rgb(var(--accent))]" />
                    <div>
                      {item.title && (
                        <h3 className="text-lg font-semibold leading-7 text-slate-900">{item.title}</h3>
                      )}
                      {item.text && (
                        <p className="mt-3 text-sm leading-7 text-slate-700 md:text-[0.98rem]">{item.text}</p>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {hasTestimonialsSection && (
        <section className="section-pad">
          <Reveal>
            <div className="max-w-3xl">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("testimonialsEyebrow")}</span>
              </div>
              <h2 className="section-title mt-3">{t("testimonialsTitle")}</h2>
              {t("testimonialsIntro", { defaultValue: "" }) && (
                <p className="mt-4 text-lg leading-8 muted">{t("testimonialsIntro")}</p>
              )}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <article className="panel h-full border border-slate-200/70 bg-white/80 px-6 py-7 md:px-7 md:py-8">
                  <div className="flex h-full flex-col">
                    {item.quote && (
                      <blockquote className="text-[1rem] leading-8 text-slate-900 hyphens-auto break-words">
                        <span className="mr-1 text-4xl leading-none text-[rgb(var(--accent))] align-top">"</span>
                        {item.quote}
                        <span className="ml-1 text-4xl leading-none text-[rgb(var(--accent))] align-[-0.35em]">"</span>
                      </blockquote>
                    )}
                    <div className="mt-auto min-h-[110px] border-t border-slate-200/70 pt-4">
                      {item.role && (
                        <p className="min-h-[20px] text-xs font-semibold uppercase tracking-[0.12em] text-slate-900 md:text-sm">
                          {item.role}
                        </p>
                      )}
                      {item.context && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.context}</p>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <Reveal>
        <section className="pb-6 md:pb-8">
          <div className="dark-block p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div>
                <div className="section-eyebrow" style={{ color: "rgba(255,255,255,.70)" }}>
                  <span className="dot" style={{ boxShadow: "0 0 0 7px rgba(0,168,165,.16)" }} />
                  <span>{t("cta.kicker")}</span>
                </div>
                <p className="mt-4 max-w-xl whitespace-pre-line" style={{ color: "rgba(255,255,255,.72)", lineHeight: 1.7 }}>
                  {t("cta.text")}
                </p>
              </div>
              <div>
                <Link href={`/${locale}/contact`} className="btn-primary">{nav("cta")}</Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}

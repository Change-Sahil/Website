// src/app/[locale]/about/about-client.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function AboutClient() {
  const t = useTranslations("about");
  const nav = useTranslations("nav");

  const bullets = asArray<string>(t.raw("bullets"));
  const intro = asArray<string>(t.raw("intro"));

  return (
    <div className="space-y-12 md:space-y-14">
      {/* HERO */}
      <section className="page-wrap py-12 md:py-16">
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
                  <p key={i} className="text-lg leading-8 muted">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="panel overflow-hidden p-0">
              <div className="relative h-[420px] w-full md:h-[520px]">
                <Image
                  src="/seref-sahil-change-werkstatt.jpg"
                  alt="Seref Sahil"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL */}
      <section className="page-wrap section-pad">
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
            <div className="panel">
              <div className="space-y-4">
                {t("profileText")
                  .split("\n\n")
                  .map((p, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-sm font-medium leading-7 text-slate-800 md:text-base"
                          : "text-sm leading-7 md:text-base"
                      }
                      style={
                        i === 0 ? undefined : { color: "rgba(var(--ink), .74)" }
                      }
                    >
                      {p}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="panel">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("bulletsEyebrow")}</span>
              </div>

              <ul className="list mt-4">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              <div className="mt-6 border-t border-slate-200/70 pt-5" />

              <p className="mt-4 text-sm text-slate-600">
                <a
                  href="https://www.linkedin.com/in/seref-sahil-78304aa4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-slate-800"
                >
                  LinkedIn-Profil ansehen
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
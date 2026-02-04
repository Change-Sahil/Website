// src/app/[locale]/about/page.tsx
"use client";

import { useTranslations } from "next-intl";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function AboutPage() {
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
        {/* Eyebrow */}
        <div className="section-eyebrow">
          <span className="dot" />
          <span>{nav("about")}</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-4 title">
          {t("heroTitle")}
        </h1>

        {/* Hero Subtitle (optional) */}
        {t("heroSubtitle", { defaultValue: "" }) && (
          <p className="mt-3 text-xl leading-8">
            {t("heroSubtitle")}
          </p>
        )}

        {/* Intro Text */}
        <div className="mt-5 space-y-4">
          {intro.map((p, i) => (
            <p key={i} className="text-lg leading-8 muted">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>

    {/* Hero Image */}
    <div className="lg:col-span-5">
      <div className="panel overflow-hidden p-0">
        <img
          src={t("heroImage")}
          alt={t("heroTitle")}
          className="h-[260px] w-full object-cover md:h-[320px]"
        />
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
          {/* Text */}
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
            ? "text-sm md:text-base font-medium leading-7 text-slate-800"
            : "text-sm md:text-base leading-7"
        }
        style={i === 0 ? undefined : { color: "rgba(var(--ink), .74)" }}
      >
        {p}
      </p>
    ))}
</div>
            </div>
          </div>

{/* Bullets */}
<div className="lg:col-span-5">
  <div className="panel">
    {/* Eyebrow für Bullets */}
    <div className="section-eyebrow">
      <span className="dot" />
      <span>{t("bulletsEyebrow")}</span>
    </div>

    <ul className="list mt-4">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>

    {/* Hinweis im selben Kasten */}
    <div className="mt-6 border-t border-slate-200/70 pt-5"></div>

    {/* LinkedIn – bewusst ruhig */}
    <p className="mt-4 text-xs text-slate-500">
      LinkedIn:&nbsp;
      <a
        href="https://www.linkedin.com/in/seref-sahil-78304aa4/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-slate-700"
      >
        Profil ansehen
      </a>
    </p>
  </div>
</div>


          </div>
      </section>
    </div>
  );
}

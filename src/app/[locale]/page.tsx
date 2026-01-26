// src/app/[locale]/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {useLocale, useTranslations} from "next-intl";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");

  const hero = t.raw("hero") as any;
  const pillars = t.raw("pillars") as any;
  const audience = t.raw("audience") as any;
  const blocks = t.raw("blocks") as any;
  const trust = t.raw("trust") as any;

  const heroChips = asArray<string>(hero?.chips);
  const steps = asArray<{title: string; text: string}>(hero?.approach?.steps);

  const pillarItems = asArray<{title: string; text: string; meta?: string}>(pillars?.items);

  const targets = asArray<string>(audience?.targets);
  const triggers = asArray<string>(audience?.triggers);

  const blockItems = asArray<{title: string; text: string}>(blocks?.items);

  const whenUseful = (triggers.length ? triggers : targets).slice(0, 5);
  const nav = useTranslations("nav");

  return (
    <div className="space-y-20">
      {/* HERO (wie bei dir) – ABER nur EIN CTA */}
      {/* HERO */}



      {/* Einstieg (Bild links / Text rechts) – gleiche Flucht wie die nächste Kachel */}
<section className="mt-6">
  <div className="mx-auto max-w-6xl">
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Image
            src="/images/home-01.jpg"
            alt="Strategische Ausrichtung"
            width={1600}
            height={1000}
            className="h-[320px] w-full object-cover md:h-[360px]"
          />
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
          {hero?.kicker ?? ""}
        </div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
          {hero?.title ?? ""}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
  {hero?.intro ?? ""}
</p>

      </div>
    </div>
  </div>
</section>


      {/* Wofür wir stehen (gestrafft) */}
      <section>
        <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">{pillars?.subtitle ?? ""}</div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-slate-900">
          {pillars?.title ?? ""}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pillarItems.slice(0, 3).map((p, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div className="text-base font-semibold text-slate-900">{p.title}</div>
                <div className="text-xs font-semibold text-slate-400">{String(i + 1).padStart(2, "0")}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

{/* IMAGE + TEXT – zwei gleich breite Kacheln, beide rund */}
<section className="mt-16">
  <div className="mx-auto max-w-6xl">
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      {/* IMAGE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative lg:col-span-6">
          <Image
            src="/images/home-02.jpg"
            alt="Zusammenarbeit in der Umsetzung"
            width={1600}
            height={900}
            className="h-[320px] w-full object-cover md:h-[380px]"
            priority={false}
          />
          {/* optional: sehr dezenter Verlauf, damit Textseite optisch dazu passt */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.00), rgba(0,0,0,0.10))"
            }}
          />
        </div>
      </div>

      {/* TEXT CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-[0_18px_55px_rgba(15,23,42,0.07)] flex items-center">
        <div>
          <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
  {hero?.approach?.footerLeft ?? ""}
</div>


<h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
  {t("divider.title")}
</h3>

<p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
  {t("divider.text")}
</p>


          </div>
      </div>
    </div>
  </div>
</section>


      {/* Für wen und wann -> nur kompakt */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
        <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">{audience?.subtitle ?? ""}</div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-slate-900">
          {audience?.title ?? ""}
        </h2>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/40 p-6">
          <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
          {t("audienceFocusTitle")}
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
            {whenUseful.map((x, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full"
                  style={{background: "rgba(0,168,165,0.9)"}}
                />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      

      {/* 15 MIN ORIENTIERUNG – im gleichen, ruhigen Stil */}
<section className="mt-16">
  <div className="mx-auto max-w-6xl">
    <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <div className="text-[11px] tracking-[0.26em] uppercase text-slate-500 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "rgba(0,168,165,0.9)" }}
            />
            <span>{t("orientation.kicker")}</span>
          </div>

          <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-slate-900">
            {t("orientation.title")}
          </h3>


          <p className="mt-4 max-w-xl text-sm md:text-base leading-7 text-slate-600">
            {t("orientation.text")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact`} className="btn-primary">
  {nav("cta")}
</Link>
<Link href={`/${locale}/services`} className="btn-secondary">
  {nav("services")}
</Link>
          </div>
        </div>

        {/* Optional: dezentes Bild rechts – passt zum Stil */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50">
            <Image
              src="/images/home-03.jpg"
              alt="Atmosphäre"
              width={1200}
              height={800}
              className="h-[220px] w-full object-cover md:h-[240px] opacity-95"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}

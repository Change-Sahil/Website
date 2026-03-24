// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const locale   = useLocale();
  const tNav     = useTranslations("nav");
  const tFooter  = useTranslations("footer");
  const year     = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white">
      {/* Accent-Trennlinie oben */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,168,165,0.28)] to-transparent" />
      <div className="border-t border-slate-100" />

      <div className="page-wrap py-5 sm:py-6">

        {/* Haupt-Zeile: Logo + Navigation */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          {/* Links: Logo + Standort */}
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}`} className="inline-flex items-center transition-opacity hover:opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Change-Werkstatt_Vector.svg"
                alt="Change-Werkstatt Sahil"
                className="h-[38px] w-auto"
              />
            </Link>
            <p className="text-xs leading-5 text-slate-400 tracking-wide">
              {tFooter("location")}
            </p>
          </div>

          {/* Navigation (nur Hauptlinks) */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"
          >
            <Link href={`/${locale}/services`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("services")}</Link>
            <Link href={`/${locale}/approach`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("approach")}</Link>
            <Link href={`/${locale}/about`}     className="hover:text-slate-900 transition-colors duration-150">{tNav("about")}</Link>
            <Link href={`/${locale}/speaking`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("speaking")}</Link>
            <Link href={`/${locale}/contact`}   className="hover:text-slate-900 transition-colors duration-150 font-medium">{tNav("cta")}</Link>
          </nav>

        </div>

        {/* Trennlinie */}
        <div className="mt-6 h-px bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100" />

        {/* Untere Zeile: Copyright + Legal */}
        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span>© {year} Change-Werkstatt Sahil</span>
            <Link href={`/${locale}/impressum`}   className="hover:text-slate-600 transition-colors duration-150">{tFooter("imprint")}</Link>
            <Link href={`/${locale}/datenschutz`} className="hover:text-slate-600 transition-colors duration-150">{tFooter("privacy")}</Link>
          </div>
          <div className="tracking-wide">{tFooter("bottomLine")}</div>
        </div>

      </div>
    </footer>
  );
}

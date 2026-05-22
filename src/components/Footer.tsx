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
    <footer className="mt-auto" style={{ background: "rgb(248,247,243)" }}>
      <div className="page-rule" />

      <div className="page-wrap py-6 sm:py-8">

        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">

          {/* Links: Logo + BVMW Badge */}
          <div className="flex flex-row items-center gap-5 divide-x divide-slate-200">
            <Link href={`/${locale}`} className="inline-flex items-center transition-opacity hover:opacity-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Change-Werkstatt_Vector.svg"
                alt="Change-Werkstatt Sahil"
                className="h-[52px] w-auto"
              />
            </Link>
            <a
              href="https://www.bvmw.de"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mitgliedsunternehmen Der Mittelstand. BVMW e.V."
              className="pl-7"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bvmw-mitgliedsunternehmen.jpg"
                alt="Mitgliedsunternehmen Der Mittelstand. BVMW e.V."
                className="h-14 w-auto opacity-80 hover:opacity-100 transition-opacity duration-150"
              />
            </a>
          </div>

          {/* Rechts: Navigation + Tagline + Legal */}
          <div className="flex flex-col gap-3 sm:items-end sm:text-right">

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 sm:justify-end"
            >
              <Link href={`/${locale}/services`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("services")}</Link>
              <Link href={`/${locale}/approach`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("approach")}</Link>
              <Link href={`/${locale}/about`}     className="hover:text-slate-900 transition-colors duration-150">{tNav("about")}</Link>
              <Link href={`/${locale}/speaking`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("speaking")}</Link>
              <Link href={`/${locale}/contact`}   className="hover:text-slate-900 transition-colors duration-150 font-medium">{tNav("cta")}</Link>
            </nav>

            <p className="text-xs text-slate-400 tracking-wide">{tFooter("bottomLine")}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 sm:justify-end">
              <span>© {year} Change-Werkstatt Sahil</span>
              <span className="text-slate-200">·</span>
              <span>{tFooter("location")}</span>
              <span className="text-slate-200">·</span>
              <Link href={`/${locale}/impressum`}   className="hover:text-slate-600 transition-colors duration-150">{tFooter("imprint")}</Link>
              <Link href={`/${locale}/datenschutz`} className="hover:text-slate-600 transition-colors duration-150">{tFooter("privacy")}</Link>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}

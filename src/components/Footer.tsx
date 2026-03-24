// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
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

      <div className="mx-auto max-w-6xl px-6 py-8 sm:py-10">

        {/* Haupt-Zeile: Logo + Navigation */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Links: Logo + Standort */}
          <div className="flex flex-col gap-2.5">
            <Link href={`/${locale}`} className="inline-flex items-center opacity-95 transition-opacity hover:opacity-100">
              <Image
                src="/window.png"
                alt="Change-Werkstatt Sahil"
                width={145}
                height={34}
              />
            </Link>
            <p className="text-xs leading-5 text-slate-400 tracking-wide">
              {tFooter("location")}
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500"
          >
            <Link href={`/${locale}/services`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("services")}</Link>
            <Link href={`/${locale}/approach`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("approach")}</Link>
            <Link href={`/${locale}/about`}     className="hover:text-slate-900 transition-colors duration-150">{tNav("about")}</Link>
            <Link href={`/${locale}/speaking`}  className="hover:text-slate-900 transition-colors duration-150">{tNav("speaking")}</Link>
            <Link href={`/${locale}/contact`}   className="hover:text-slate-900 transition-colors duration-150 font-medium">{tNav("cta")}</Link>

            <span className="hidden sm:inline text-slate-200 select-none">|</span>

            <Link href={`/${locale}/impressum`}   className="hover:text-slate-900 transition-colors duration-150 text-xs text-slate-400">{tFooter("imprint")}</Link>
            <Link href={`/${locale}/datenschutz`} className="hover:text-slate-900 transition-colors duration-150 text-xs text-slate-400">{tFooter("privacy")}</Link>
          </nav>

        </div>

        {/* Trennlinie */}
        <div className="mt-8 h-px bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100" />

        {/* Untere Zeile: Copyright */}
        <div className="mt-5 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} Change-Werkstatt Sahil</div>
          <div className="tracking-wide">{tFooter("bottomLine")}</div>
        </div>

      </div>
    </footer>
  );
}

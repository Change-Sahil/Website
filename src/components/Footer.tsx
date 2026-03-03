// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        {/* Top Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="inline-flex items-center">
              <Image
                src="/window.png"
                alt="Change-Werkstatt Sahil"
                width={145}
                height={34}
                className="opacity-95"
              />
            </Link>

            <span className="hidden sm:inline text-xs text-slate-500 tracking-wide">
              {tFooter("location")}
            </span>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600"
          >
            <Link href={`/${locale}/services`} className="hover:text-slate-900 transition-colors">
              {tNav("services")}
            </Link>
            <Link href={`/${locale}/approach`} className="hover:text-slate-900 transition-colors">
              {tNav("approach")}
            </Link>
            <Link href={`/${locale}/about`} className="hover:text-slate-900 transition-colors">
              {tNav("about")}
            </Link>
            <Link href={`/${locale}/speaking`} className="hover:text-slate-900 transition-colors">
              {tNav("speaking")}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-slate-900 transition-colors">
              {tNav("cta")}
            </Link>

            <span className="hidden sm:inline text-slate-300">|</span>

            <Link href={`/${locale}/impressum`} className="hover:text-slate-900 transition-colors">
              {tFooter("imprint")}
            </Link>
            <Link href={`/${locale}/datenschutz`} className="hover:text-slate-900 transition-colors">
              {tFooter("privacy")}
            </Link>
          </nav>
        </div>

        {/* Mobile location */}
        <div className="sm:hidden mt-1 text-xs text-slate-500">
          {tFooter("location")}
        </div>

        {/* Bottom Row */}
        <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {year} Change-Werkstatt Sahil</div>
          <div className="tracking-wide">{tFooter("bottomLine")}</div>
        </div>
      </div>
    </footer>
  );
}
// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <Image
              src="/window.png"
              alt="Change-Werkstatt Sahil"
              width={150}
              height={34}
              className="opacity-90"
            />
          </Link>

          {/* Links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-slate-600"
          >
            <Link className="hover:text-slate-900" href={`/${locale}/services`}>
              {tNav("services")}
            </Link>
            <Link className="hover:text-slate-900" href={`/${locale}/contact`}>
              {tNav("cta")}
            </Link>
            <Link className="hover:text-slate-900" href={`/${locale}/impressum`}>
              Impressum
            </Link>
            <Link className="hover:text-slate-900" href={`/${locale}/datenschutz`}>
              Datenschutz
            </Link>
          </nav>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          © {year} Change-Werkstatt Sahil
        </div>
      </div>
    </footer>
  );
}

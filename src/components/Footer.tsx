// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            {/* LOGO */}
            <Link href={`/${locale}`} className="inline-flex items-center">
              <Image
                src="/window.png"
                alt="Change-Werkstatt Sahil"
                width={180}
                height={40}
              />
            </Link>
          </div>

          <div className="md:col-span-6 md:flex md:justify-end">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-slate-600 md:grid-cols-2">
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
</div>

          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Change-Werkstatt Sahil</span>
        </div>
      </div>
    </footer>
  );
}

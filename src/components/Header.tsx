// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* LOGO */}
          <Link href={`/${locale}`} className="flex items-center" onClick={closeMenu}>
            <Image
              src="/window.png"
              alt="Change-Werkstatt Sahil"
              width={220}
              height={50}
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link className="text-sm text-slate-600 hover:text-slate-900" href={`/${locale}`}>
              {tNav("home")}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" href={`/${locale}/services`}>
              {tNav("services")}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" href={`/${locale}/approach`}>
              {tNav("approach")}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" href={`/${locale}/about`}>
              {tNav("about")}
            </Link>
            <Link className="text-sm text-slate-600 hover:text-slate-900" href={`/${locale}/speaking`}>
              {tNav("speaking")}
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* DESKTOP LOCALE */}
            <div className="hidden md:flex">
              <LocaleSwitcher />
            </div>

            {/* CTA (always visible) */}
            <Link
  href={`/${locale}/contact`}
  className="inline-flex items-center justify-center rounded-full px-3 py-2 sm:px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95"
  style={{ background: "linear-gradient(135deg, rgb(0,168,165), rgb(0,112,125))" }}
  onClick={closeMenu}
>
  <span className="hidden sm:inline">{tNav("cta")}</span>
  <span className="sm:hidden">Anfragen</span>
</Link>


            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm"
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                // X icon
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="stroke-current">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                // Hamburger icon
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="stroke-current">
                  <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <div className={`md:hidden ${menuOpen ? "block" : "hidden"}`}>
          <div className="pb-4">
            <nav className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
              <Link
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                href={`/${locale}`}
                onClick={closeMenu}
              >
                {tNav("home")}
              </Link>
              <Link
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                href={`/${locale}/services`}
                onClick={closeMenu}
              >
                {tNav("services")}
              </Link>
              <Link
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                href={`/${locale}/approach`}
                onClick={closeMenu}
              >
                {tNav("approach")}
              </Link>
              <Link
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                href={`/${locale}/about`}
                onClick={closeMenu}
              >
                {tNav("about")}
              </Link>
              <Link
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                href={`/${locale}/speaking`}
                onClick={closeMenu}
              >
                {tNav("speaking")}
              </Link>

              <div className="my-2 border-t border-slate-200/70" />

              {/* MOBILE LOCALE SWITCHER */}
              <div className="px-1 py-1" onClick={closeMenu}>
                <LocaleSwitcher />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

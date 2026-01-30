// src/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const tNav = useTranslations("nav");
  
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // helper: marks current page (supports exact match and subroutes)
  const isActive = (href: string) => {
  if (!pathname) return false;

  const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
  const current = normalize(pathname);
  const target = normalize(href);

  // Home should ONLY be active on exact match
  const home = `/${locale}`;
  const homeNormalized = normalize(home);

  if (target === homeNormalized) {
    return current === homeNormalized;
  }

  // All other nav items: exact match OR child routes
  return current === target || current.startsWith(target + "/");
};

  // unified desktop nav link classes
  const navLinkClass = (href: string) =>
    [
      "relative text-sm text-slate-600 hover:text-slate-900 transition-colors",
      isActive(href)
        ? "text-slate-900 after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2px] after:rounded-full after:bg-[rgb(0,168,165)]"
        : "",
    ].join(" ");

  // unified mobile nav link classes
  const mobileLinkClass = (href: string) =>
    [
      "block rounded-xl px-3 py-2 text-sm transition-colors",
      isActive(href)
        ? "bg-slate-50 text-slate-900"
        : "text-slate-700 hover:bg-slate-50",
    ].join(" ");

  const hrefHome = `/${locale}`;
  const hrefServices = `/${locale}/services`;
  const hrefApproach = `/${locale}/approach`;
  const hrefAbout = `/${locale}/about`;
  const hrefSpeaking = `/${locale}/speaking`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* LOGO */}
          <Link href={hrefHome} className="flex items-center" onClick={closeMenu}>
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
            <Link className={navLinkClass(hrefHome)} href={hrefHome}>
              {tNav("home")}
            </Link>
            <Link className={navLinkClass(hrefServices)} href={hrefServices}>
              {tNav("services")}
            </Link>
            <Link className={navLinkClass(hrefApproach)} href={hrefApproach}>
              {tNav("approach")}
            </Link>
            <Link className={navLinkClass(hrefAbout)} href={hrefAbout}>
              {tNav("about")}
            </Link>
            <Link className={navLinkClass(hrefSpeaking)} href={hrefSpeaking}>
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
              style={{
                background: "linear-gradient(135deg, rgb(0,168,165), rgb(0,112,125))",
              }}
              onClick={closeMenu}
            >
              <span className="hidden sm:inline">{tNav("cta")}</span>
              <span className="sm:hidden">{tNav("ctaShort")}</span>

              </Link>

            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm"
              aria-label={menuOpen ? tNav("menuClose") : tNav("menuOpen")}
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
              <Link className={mobileLinkClass(hrefHome)} href={hrefHome} onClick={closeMenu}>
                {tNav("home")}
              </Link>
              <Link
                className={mobileLinkClass(hrefServices)}
                href={hrefServices}
                onClick={closeMenu}
              >
                {tNav("services")}
              </Link>
              <Link
                className={mobileLinkClass(hrefApproach)}
                href={hrefApproach}
                onClick={closeMenu}
              >
                {tNav("approach")}
              </Link>
              <Link className={mobileLinkClass(hrefAbout)} href={hrefAbout} onClick={closeMenu}>
                {tNav("about")}
              </Link>
              <Link
                className={mobileLinkClass(hrefSpeaking)}
                href={hrefSpeaking}
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

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

  const navLinkClass = (href: string) =>
    [
      "relative text-sm text-slate-600 hover:text-slate-900 transition-colors",
      isActive(href)
        ? "text-slate-900"
        : "",
    ].join(" ");

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* LOGO */}
          <Link href={hrefHome} className="flex items-center" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="Change-Werkstatt Sahil"
              width={2480}
              height={555}
              priority
              sizes="(max-width: 768px) 190px, 240px"
              className="h-[52px] w-auto -translate-y-[1px] opacity-[0.96] transition-opacity duration-200 hover:opacity-100"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link className={navLinkClass(hrefHome)} href={hrefHome}>
              {tNav("home")}
              {isActive(hrefHome) && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
                    boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
                  }}
                />
              )}
            </Link>

            <Link className={navLinkClass(hrefServices)} href={hrefServices}>
              {tNav("services")}
              {isActive(hrefServices) && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
                    boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
                  }}
                />
              )}
            </Link>

            <Link className={navLinkClass(hrefApproach)} href={hrefApproach}>
              {tNav("approach")}
              {isActive(hrefApproach) && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
                    boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
                  }}
                />
              )}
            </Link>

            <Link className={navLinkClass(hrefAbout)} href={hrefAbout}>
              {tNav("about")}
              {isActive(hrefAbout) && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
                    boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
                  }}
                />
              )}
            </Link>

            <Link className={navLinkClass(hrefSpeaking)} href={hrefSpeaking}>
              {tNav("speaking")}
              {isActive(hrefSpeaking) && (
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
                    boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
                  }}
                />
              )}
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
              className="inline-flex items-center justify-center rounded-full px-3 py-2 sm:px-4 text-sm font-semibold text-white shadow-sm hover:opacity-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,168,165,0.92), rgba(0,140,150,0.92))",
                boxShadow:
                  "0 10px 30px rgba(2,6,23,0.10), inset 0 0 0 1px rgba(255,255,255,0.10)",
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
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  className="stroke-current"
                >
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  className="stroke-current"
                >
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
              <Link className={mobileLinkClass(hrefServices)} href={hrefServices} onClick={closeMenu}>
                {tNav("services")}
              </Link>
              <Link className={mobileLinkClass(hrefApproach)} href={hrefApproach} onClick={closeMenu}>
                {tNav("approach")}
              </Link>
              <Link className={mobileLinkClass(hrefAbout)} href={hrefAbout} onClick={closeMenu}>
                {tNav("about")}
              </Link>
              <Link className={mobileLinkClass(hrefSpeaking)} href={hrefSpeaking} onClick={closeMenu}>
                {tNav("speaking")}
              </Link>

              <div className="my-2 border-t border-slate-200/70" />

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
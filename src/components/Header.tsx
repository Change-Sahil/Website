// src/components/Header.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const handler = () => {
      const el = document.scrollingElement ?? document.documentElement;
      setScrolled(el.scrollTop > 80);
    };
    window.addEventListener("scroll", handler, { passive: true });
    document.body.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => {
      window.removeEventListener("scroll", handler);
      document.body.removeEventListener("scroll", handler);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Focus-Trap für Mobile-Menü
  useEffect(() => {
    if (!menuOpen) return;
    const el = menuRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { setMenuOpen(false); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
    const current = normalize(pathname);
    const target = normalize(href);
    const home = normalize(`/${locale}`);
    if (target === home) return current === home;
    return current === target || current.startsWith(target + "/");
  };

  const navLinkClass = (href: string) =>
    [
      "relative text-[13px] text-slate-600 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap",
      isActive(href) ? "text-slate-900" : "",
    ].join(" ");

  const mobileLinkClass = (href: string) =>
    [
      "block rounded-xl px-3 py-2 text-sm transition-colors duration-150",
      isActive(href) ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50",
    ].join(" ");

  const hrefHome     = `/${locale}`;
  const hrefServices = `/${locale}/services`;
  const hrefApproach = `/${locale}/approach`;
  const hrefAbout    = `/${locale}/about`;
  const hrefImpulse  = `/${locale}/impulse`;
  const hrefSpeaking = `/${locale}/speaking`;
  const hrefContact  = `/${locale}/contact`;

  const activeBar = (
    <span
      aria-hidden
      className="absolute left-0 right-0 -bottom-2 h-[2px] rounded-full"
      style={{
        background: "linear-gradient(90deg, rgba(0,168,165,0.95), rgba(0,112,125,0.85))",
        boxShadow: "0 6px 16px rgba(0,168,165,0.18)",
      }}
    />
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        isHome && !scrolled
          ? { background: "transparent", borderBottom: "none" }
          : { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(203,213,225,0.8)" }
      }
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4 py-4">

          {/* LOGO */}
          <Link href={hrefHome} className="flex items-center" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Change-Werkstatt_Vector.svg"
              alt="Change-Werkstatt Sahil"
              className="h-[54px] w-auto -translate-y-[1px] transition-opacity duration-200 hover:opacity-95"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-[14px] lg:gap-5 md:flex">
            {[
              { href: hrefHome,     label: tNav("home") },
              { href: hrefServices, label: tNav("services") },
              { href: hrefApproach, label: tNav("approach") },
              { href: hrefAbout,    label: tNav("about") },
              { href: hrefImpulse,  label: tNav("impulse") },
              { href: hrefSpeaking, label: tNav("speaking") },
              { href: hrefContact,  label: tNav("contact") },
            ].map(({ href, label }) => (
              <Link key={href} className={navLinkClass(href)} href={href}>
                {label}
                {isActive(href) && activeBar}
              </Link>
            ))}
          </nav>

          {/* RECHTS */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <LocaleSwitcher />
            </div>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-3 py-2 sm:px-4 text-sm font-semibold text-white shadow-sm"
              style={{
                borderRadius: "5px",
                background: "rgb(10,15,26)",
                boxShadow: "0 4px 14px rgba(10,15,26,.18)",
                transition: "box-shadow 200ms ease, transform 130ms ease",
              }}
              onClick={closeMenu}
            >
              <span className="hidden sm:inline">{tNav("cta")}</span>
              <span className="sm:hidden">{tNav("ctaShort")}</span>
            </Link>

            {/* HAMBURGER */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50"
              aria-label={menuOpen ? tNav("menuClose") : tNav("menuOpen")}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="stroke-current">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="stroke-current">
                  <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENÜ – smooth slide-down */}
        <div
          id="mobile-nav"
          ref={menuRef}
          aria-modal="true"
          className="md:hidden overflow-hidden"
          style={{
            maxHeight: menuOpen ? "500px" : "0px",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: menuOpen
              ? "max-height 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease"
              : "max-height 0.24s ease-in, opacity 0.18s ease",
          }}
        >
          <div className="pb-4">
            <nav className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm">
              <Link className={mobileLinkClass(hrefHome)}     href={hrefHome}     onClick={closeMenu}>{tNav("home")}</Link>
              <Link className={mobileLinkClass(hrefServices)} href={hrefServices} onClick={closeMenu}>{tNav("services")}</Link>
              <Link className={mobileLinkClass(hrefApproach)} href={hrefApproach} onClick={closeMenu}>{tNav("approach")}</Link>
              <Link className={mobileLinkClass(hrefAbout)}    href={hrefAbout}    onClick={closeMenu}>{tNav("about")}</Link>
              <Link className={mobileLinkClass(hrefImpulse)}  href={hrefImpulse}  onClick={closeMenu}>{tNav("impulse")}</Link>
              <Link className={mobileLinkClass(hrefSpeaking)} href={hrefSpeaking} onClick={closeMenu}>{tNav("speaking")}</Link>
              <Link className={mobileLinkClass(hrefContact)}  href={hrefContact}  onClick={closeMenu}>{tNav("contact")}</Link>
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

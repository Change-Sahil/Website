// src/components/LocaleSwitcher.tsx
"use client";

import Image from "next/image";
import { useEffect, useTransition, Suspense } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Locale = "de" | "en" | "tr" | "es";

const LOCALES: Locale[] = ["de", "en", "tr", "es"];

const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  de: { label: "Deutsch", flag: "/flags/de.svg" },
  en: { label: "English", flag: "/flags/gb.svg" },
  tr: { label: "Türkçe", flag: "/flags/tr.svg" },
  es: { label: "Español", flag: "/flags/es.svg" },
};

const SCROLL_KEY = "locale-switch-scrollY";
const HASH_KEY = "locale-switch-hash";

function stripLocalePrefix(pathname: string) {
  const parts = pathname.split("/");
  const first = parts[1] as string | undefined;
  if (first && LOCALES.includes(first as Locale)) {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "/" ? "/" : rest.replace(/\/$/, "");
  }
  return pathname || "/";
}

function LocaleSwitcherInner() {
  const current = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const y = sessionStorage.getItem(SCROLL_KEY);
    const hash = sessionStorage.getItem(HASH_KEY);

    if (!y) return;

    sessionStorage.removeItem(SCROLL_KEY);
    sessionStorage.removeItem(HASH_KEY);

    requestAnimationFrame(() => {
      window.scrollTo({ top: Number(y), left: 0, behavior: "auto" });

      if (hash && hash.startsWith("#")) {
        requestAnimationFrame(() => {
          const el = document.querySelector(hash);
          el?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      }
    });
  }, [pathname]);

  function switchTo(nextLocale: Locale) {
    if (nextLocale === current) return;

    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    sessionStorage.setItem(HASH_KEY, window.location.hash || "");

    const basePath = stripLocalePrefix(pathname);
    const qs = searchParams?.toString();
    const href = `/${nextLocale}${basePath === "/" ? "" : basePath}${qs ? `?${qs}` : ""}`;

    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <div className="flex items-center rounded-full border border-slate-200 bg-white p-1">
      {LOCALES.map((l) => {
        const meta = LOCALE_META[l];
        const active = l === current;

        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-label={meta.label}
            title={meta.label}
            className={[
              "rounded-full p-1.5 transition",
              active ? "opacity-100" : "opacity-45 hover:opacity-75",
            ].join(" ")}
          >
            <Image
              src={meta.flag}
              alt={meta.label}
              width={18}
              height={18}
              className={["rounded-[4px]", active ? "" : "grayscale"].join(" ")}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function LocaleSwitcher() {
  return (
    <Suspense fallback={null}>
      <LocaleSwitcherInner />
    </Suspense>
  );
}

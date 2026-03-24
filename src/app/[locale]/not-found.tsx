"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[62vh] flex-col items-center justify-center px-6 py-20 text-center">
      {/* Eyebrow */}
      <div className="section-eyebrow">
        <span className="dot" />
        <span>404</span>
      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">
        {t("title")}
      </h1>

      <p className="mt-5 max-w-md text-base leading-7 muted">
        {t("text")}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href={`/${locale}`} className="btn-primary">
          {t("home")}
        </Link>
        <Link href={`/${locale}/contact`} className="btn-secondary">
          {t("contact")}
        </Link>
      </div>

      {/* Dezente Dekoration */}
      <div
        className="mt-16 h-px w-24 rounded-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,168,165,0.4), transparent)" }}
      />
    </div>
  );
}

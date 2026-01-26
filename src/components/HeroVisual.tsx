"use client";

import {useMemo} from "react";
import {useTranslations} from "next-intl";

export default function HeroVisual() {
  const t = useTranslations("home.hero.approach");

  const steps = useMemo(
    () => [
      {n: "1", title: t("steps.0.title"), text: t("steps.0.text")},
      {n: "2", title: t("steps.1.title"), text: t("steps.1.text")},
      {n: "3", title: t("steps.2.title"), text: t("steps.2.text")}
    ],
    [t]
  );

  return (
    <div className="panel-soft hero-inset p-7 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="kicker">
          <span className="kicker-dot" />
          <span>{t("eyebrow")}</span>
        </div>
        <div className="icon-puck">
          <span className="icon-dot" />
        </div>
      </div>

      <div className="mt-5 text-lg font-semibold text-ink-0">{t("title")}</div>
      <div className="mt-2 text-sm text-ink-2">{t("subtitle")}</div>

      <div className="mt-6 grid gap-4">
        {steps.map((s) => (
          <div key={s.n} className="step-card">
            <div className="flex items-start gap-4">
              <div className="step-num">{s.n}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink-0">{s.title}</div>
                <div className="mt-1 text-sm text-ink-2">{s.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6 text-xs text-ink-3">
        <span>{t("footerLeft")}</span>
        <span>{t("footerRight")}</span>
      </div>
    </div>
  );
}

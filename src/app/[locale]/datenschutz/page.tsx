// src/app/[locale]/datenschutz/page.tsx
import { getTranslations } from "next-intl/server";

import DatenschutzDe from "./datenschutz-de";

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Die deutsche Fassung ist ausführlicher (Supabase im Detail, Datenarten,
  // getrennte Speicherfristen) und liegt deshalb außerhalb der
  // Message-Dateien. Der Schnellcheck ist ein deutschsprachiges Angebot und
  // verlinkt auf /de/datenschutz, damit ist diese Fassung die einschlägige.
  //
  // en/tr/es enthalten seit dem Perspektivvergleich einen eigenen Abschnitt
  // dazu, bleiben aber knapper. Alle vier Fassungen brauchen vor der
  // Veröffentlichung eine rechtliche Prüfung.
  if (locale === "de") return <DatenschutzDe />;

  const t = await getTranslations({ locale, namespace: "privacy" });

  const purposes = asArray<string>(t.raw("purposes.list"));
  const rights = asArray<string>(t.raw("rights.list"));

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>

      <div className="mt-6 space-y-8 text-slate-700 text-sm leading-7">
        <section className="space-y-3">
          <p>{t("intro.p1")}</p>
          <p>{t("intro.p2")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("controller.title")}
          </h2>
          <p className="whitespace-pre-line">{t("controller.text")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("purposes.title")}
          </h2>
          <p>{t("purposes.p1")}</p>
          <ul className="list-disc pl-5 space-y-1">
            {purposes.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <p className="mt-3">{t("purposes.legal")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("hosting.title")}
          </h2>
          <p>{t("hosting.p1")}</p>
          <p>{t("hosting.p2")}</p>
          <p>{t("hosting.legal")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("contact.title")}
          </h2>
          <p>{t("contact.p1")}</p>
          <p>{t("contact.legal")}</p>
          <p>{t("contact.retention")}</p>
        </section>

        {/* Übergabe-Check und Perspektivvergleich. Steht zwischen
            Kontaktaufnahme und E-Mail-Versand, weil er beides berührt. */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("transitionCheck.title")}
          </h2>
          <p>{t("transitionCheck.p1")}</p>
          <p>{t("transitionCheck.p2")}</p>
          <p>{t("transitionCheck.p3")}</p>

          <h3 className="pt-2 text-sm font-semibold text-slate-900">
            {t("transitionCheck.comparison.title")}
          </h3>
          <p>{t("transitionCheck.comparison.p1")}</p>
          <p>{t("transitionCheck.comparison.p2")}</p>
          <p>{t("transitionCheck.comparison.p3")}</p>
          <p>{t("transitionCheck.comparison.p4")}</p>
          <p>{t("transitionCheck.comparison.p5")}</p>

          <p>{t("transitionCheck.legal")}</p>
          <p>{t("transitionCheck.retention")}</p>
          <p>{t("transitionCheck.providers")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("emailProvider.title")}
          </h2>
          <p>{t("emailProvider.p1")}</p>
          <p>{t("emailProvider.legal")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("analytics.title")}
          </h2>
          <p>{t("analytics.p1")}</p>
          <p>{t("analytics.p2")}</p>
          <p>{t("analytics.p3")}</p>
          <p>{t("analytics.future")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("transfers.title")}
          </h2>
          <p>{t("transfers.p1")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("rights.title")}
          </h2>
          <p>{t("rights.p1")}</p>
          <ul className="list-disc pl-5 space-y-1">
            {rights.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <p className="mt-3">{t("rights.p2")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("security.title")}
          </h2>
          <p>{t("security.p1")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            {t("changes.title")}
          </h2>
          <p>{t("changes.p1")}</p>
          <p>{t("changes.status")}</p>
        </section>
      </div>
    </div>
  );
}
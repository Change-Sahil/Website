// src/app/[locale]/impressum/page.tsx
import { getTranslations } from "next-intl/server";

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">{t("title")}</h1>

      <div className="mt-6 space-y-6 text-slate-700 text-sm leading-7">
        <section>
          <h2 className="font-semibold text-slate-900">{t("tmc.title")}</h2>
          <p className="mt-2 whitespace-pre-line">{t("tmc.text")}</p>
        </section>

        <section>
          <p className="whitespace-pre-line">{t("contact.text")}</p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">{t("activity.title")}</h2>
          <p className="mt-2">{t("activity.text")}</p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">{t("vat.title")}</h2>
          <p className="mt-2">{t("vat.text")}</p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">{t("mstv.title")}</h2>
          <p className="mt-2 whitespace-pre-line">{t("mstv.text")}</p>
        </section>
      </div>
    </div>
  );
}
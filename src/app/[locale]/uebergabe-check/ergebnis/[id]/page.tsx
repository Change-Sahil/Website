// src/app/[locale]/uebergabe-check/ergebnis/[id]/page.tsx
//
// Permanente Ergebnisseite. Der Link wird in der Ergebnis-Mail verschickt und
// ist über die zufällige UUID erreichbar – nicht öffentlich auffindbar und
// grundsätzlich nicht indexierbar.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PersonalReportExtras, {
  ReportContentsNote,
} from "@/components/uebergabe-check/PersonalReportExtras";
import {
  PrintFooter,
  PrintHeader,
} from "@/components/uebergabe-check/PrintFrame";
import Report from "@/components/uebergabe-check/Report";
import ResultCtas from "@/components/uebergabe-check/ResultCtas";
import { getAssessment } from "@/lib/uebergabe-check/db";
import { computeScores } from "@/lib/uebergabe-check/scoring";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ihr Ergebnis | Schnellcheck Übergabefähigkeit",
  robots: { index: false, follow: false, nocache: true },
};

const DATE_FORMAT = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (locale !== "de") redirect(`/de/uebergabe-check/ergebnis/${id}`);

  const assessment = await getAssessment(id);
  if (!assessment) notFound();

  const scores = computeScores(assessment.answers);
  const created = DATE_FORMAT.format(new Date(assessment.created_at));

  return (
    <div className="relative space-y-6 md:space-y-8">
      <div aria-hidden className="uc-wash" />

      <PrintHeader date={created} />

      <header className="max-w-3xl">
        <div className="page-eyebrow">Ergebnis vom {created}</div>
        <h1 className="title mt-3">
          Ihr persönlicher Ergebnis- und Arbeitsbericht
        </h1>
        <p className="mt-4 text-lg leading-8 muted">
          Ihr Übergabeprofil über sechs Dimensionen, als Arbeitsgrundlage für die
          weitere Nachfolgevorbereitung.
        </p>
      </header>

      <ReportContentsNote scores={scores} answers={assessment.answers} />
      <Report scores={scores} answers={assessment.answers} />
      <PersonalReportExtras scores={scores} answers={assessment.answers} />
      <ResultCtas variant="report" />
      <PrintFooter />

      <p className="uc-no-print text-sm muted">
        Dieser Link ist persönlich und nicht öffentlich auffindbar. Sie können
        den{" "}
        <Link
          href="/de/uebergabe-check"
          className="font-medium text-teal-700 underline underline-offset-2"
        >
          Check erneut durchführen
        </Link>{" "}
        oder die Löschung Ihrer Daten jederzeit formlos verlangen.
      </p>
    </div>
  );
}

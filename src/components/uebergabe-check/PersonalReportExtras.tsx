// src/components/uebergabe-check/PersonalReportExtras.tsx
//
// Die Zusatzteile, die den persönlichen Ergebnisbericht von der frei
// zugänglichen Ergebnisseite unterscheiden. Erscheinen ausschließlich auf der
// Seite hinter dem Ergebnislink aus der E-Mail.
//
// Aus dem Bericht soll eine Arbeitsgrundlage werden, kein längerer Ausdruck
// desselben Inhalts.

import {
  DISCUSSION_INTRO,
  DISCUSSION_TITLE,
  WORKSHEET_FIELDS,
  WORKSHEET_INTRO,
  WORKSHEET_TITLE,
  buildDiscussionPoints,
} from "@/lib/uebergabe-check/report-blocks";
import { SUMMARY_TITLE, buildSummary } from "@/lib/uebergabe-check/summary";
import { dimensionContent } from "@/lib/uebergabe-check/content";
import type { Answers } from "@/lib/uebergabe-check/items";
import { computeFlags, type DimensionScore } from "@/lib/uebergabe-check/scoring";

/**
 * Kurzer Hinweis an der Spitze der Berichtsseite: Was enthält dieser Bericht
 * über die frei zugängliche Ergebnisseite hinaus? Ohne diesen Hinweis sieht der
 * Bericht auf den ersten Blick aus wie dieselbe Seite, und der Gegenwert für die
 * E-Mail-Adresse bleibt unsichtbar.
 *
 * Aufgezählt wird nur, was tatsächlich gerendert wird.
 */
export function ReportContentsNote({
  scores,
  answers,
}: {
  scores: DimensionScore[];
  answers: Answers;
}) {
  const flags = computeFlags(answers);
  const entries: string[] = ["eine Zusammenfassung Ihres Profils"];

  if (buildDiscussionPoints(scores, flags).length > 0) {
    entries.push("Fragen für Ihre interne Diskussion");
  }
  entries.push("eine Arbeitsseite zum Ausfüllen");

  const list =
    entries.length === 1
      ? entries[0]
      : `${entries.slice(0, -1).join(", ")} sowie ${entries[entries.length - 1]}`;

  return (
    // Nicht im Druck: Der Kasten erklärt den Mehrwert gegenüber der freien
    // Ergebnisseite. Im ausgedruckten Bericht liegt dieser Mehrwert vor.
    <div
      className="uc-no-print rounded-2xl border p-5 sm:p-6"
      style={{
        borderColor: "rgba(0,168,165,0.30)",
        background: "rgba(0,168,165,0.06)",
      }}
    >
      <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Zusätzlich in diesem Bericht
      </div>
      <p className="mt-2 text-[15px] leading-7 text-slate-700">
        Neben Ihrem Übergabeprofil enthält dieser Bericht {list}. Sie können ihn
        ausdrucken und als Grundlage für das Gespräch mit Ihrer Führungsebene
        verwenden.
      </p>
    </div>
  );
}

/** Beschreibbare Linien, die auch im Ausdruck stehen bleiben. */
function WriteLines({ count }: { count: number }) {
  return (
    <div className="mt-4 space-y-8">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden
          className="h-px w-full"
          style={{ background: "rgba(15,23,42,0.16)" }}
        />
      ))}
    </div>
  );
}

export default function PersonalReportExtras({
  scores,
  answers,
}: {
  scores: DimensionScore[];
  answers: Answers;
}) {
  const flags = computeFlags(answers);
  const summary = buildSummary(scores, flags);
  const discussion = buildDiscussionPoints(scores, flags);

  return (
    <div className="uc-report space-y-6 md:space-y-8">
      <section className="panel">
        <h2 className="text-xl font-bold text-slate-900">{SUMMARY_TITLE}</h2>
        <div className="mt-4 space-y-3">
          {summary.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-7 text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {discussion.length > 0 && (
        <section className="panel">
          <h2 className="text-xl font-bold text-slate-900">
            {DISCUSSION_TITLE}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 muted">
            {DISCUSSION_INTRO}
          </p>

          <ol className="mt-6 space-y-5">
            {discussion.map((point, index) => (
              <li key={point.id} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: "rgb(0,112,125)" }}
                >
                  {index + 1}
                </span>
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {dimensionContent(point.dimension).title}
                  </div>
                  <div className="mt-1 text-[15px] font-semibold text-slate-900">
                    {point.topic}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-7 text-slate-600">
                    {point.question}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="panel">
        <h2 className="text-xl font-bold text-slate-900">{WORKSHEET_TITLE}</h2>
        <p className="mt-2 text-[15px] leading-7 muted">{WORKSHEET_INTRO}</p>

        <div className="mt-6 space-y-8">
          {WORKSHEET_FIELDS.map((field) => (
            <div key={field.label}>
              <div className="text-[15px] font-semibold text-slate-800">
                {field.label}
              </div>
              <WriteLines count={field.lines} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

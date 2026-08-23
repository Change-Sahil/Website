// src/components/uebergabe-check/PersonalReportExtras.tsx
//
// Die Zusatzteile, die den persönlichen Ergebnis- und Arbeitsbericht von der
// frei zugänglichen Ergebnisseite unterscheiden. Erscheinen ausschließlich auf
// der Seite hinter dem Ergebnislink aus der E-Mail.
//
// Reihenfolge:
//   1. Was Sie aus diesem Ergebnis mitnehmen sollten
//   2. Ihre ausgewählten Prüffelder
//   3. Fragen für Ihre interne Diskussion
//   4. Wie sehen andere Ihr Unternehmen?
//   5. Ihr nächster Schritt (Arbeitsseite)

import PerspectiveBlock from "./PerspectiveBlock";
import { dimensionContent } from "@/lib/uebergabe-check/content";
import type { Answers } from "@/lib/uebergabe-check/items";
import {
  buildPruefelder,
  pruefelderIntro,
  pruefelderTitle,
} from "@/lib/uebergabe-check/pruefelder";
import {
  DISCUSSION_INTRO,
  DISCUSSION_TITLE,
  WORKSHEET_FIELDS,
  WORKSHEET_INTRO,
  WORKSHEET_TITLE,
  buildDiscussionPoints,
} from "@/lib/uebergabe-check/report-blocks";
import { computeFlags, type DimensionScore } from "@/lib/uebergabe-check/scoring";
import { SUMMARY_TITLE, buildSummary } from "@/lib/uebergabe-check/summary";

const ACCENT = "rgb(0,168,165)";
const ACCENT_DARK = "rgb(0,112,125)";

/**
 * Kurzer Hinweis an der Spitze der Berichtsseite: Was enthält dieser Bericht
 * über die frei zugängliche Ergebnisseite hinaus?
 */
export function ReportContentsNote({
  scores,
  answers,
}: {
  scores: DimensionScore[];
  answers: Answers;
}) {
  const flags = computeFlags(answers);
  const entries: string[] = ["eine persönliche Profilzusammenfassung"];

  if (buildPruefelder(scores, flags).length > 0) {
    entries.push("ausgewählte Prüffelder");
  }
  entries.push("Fragen für Ihre interne Diskussion");
  entries.push("eine Arbeitsseite zum Ausfüllen");

  const list = `${entries.slice(0, -1).join(", ")} sowie ${entries[entries.length - 1]}`;

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
function WriteLines({
  count,
  numbered = false,
}: {
  count: number;
  numbered?: boolean;
}) {
  return (
    <div className="mt-4 space-y-7">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-end gap-3">
          {numbered && (
            <span
              aria-hidden
              className="shrink-0 text-[13px] font-semibold text-slate-400"
            >
              {index + 1}.
            </span>
          )}
          <span
            aria-hidden
            className="block h-px w-full"
            style={{ background: "rgba(15,23,42,0.16)" }}
          />
        </div>
      ))}
    </div>
  );
}

export default function PersonalReportExtras({
  scores,
  answers,
  assessmentId,
}: {
  scores: DimensionScore[];
  answers: Answers;
  /** Für den Einstieg in den Perspektivvergleich. */
  assessmentId: string | null;
}) {
  const flags = computeFlags(answers);
  const summary = buildSummary(scores, flags);
  const pruefelder = buildPruefelder(scores, flags);
  const discussion = buildDiscussionPoints(scores, flags);

  return (
    <div className="uc-report space-y-6 md:space-y-8">
      {/* ── Profilzusammenfassung: genau drei beschriftete Absätze ───────── */}
      <section className="panel">
        <h2 className="text-xl font-bold text-slate-900">{SUMMARY_TITLE}</h2>
        <div className="mt-4 space-y-4">
          {summary.map((block) => (
            <div key={block.label}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {block.label}
              </div>
              <p className="mt-1 text-[15px] leading-7 text-slate-600">
                {block.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prüffelder. Entfällt bei einem guten Profil ohne Hinweise. ───── */}
      {pruefelder.length > 0 && (
        <section className="panel">
          <h2 className="text-xl font-bold text-slate-900">
            {pruefelderTitle(pruefelder.length)}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 muted">
            {pruefelderIntro(pruefelder.length)}
          </p>

          <div className="mt-6 space-y-4">
            {pruefelder.map((feld) => (
              <div
                key={feld.dimension}
                className="uc-avoid-break rounded-2xl border border-slate-200 border-l-[3px] bg-white p-5"
                style={{ borderLeftColor: ACCENT }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {dimensionContent(feld.dimension).title}
                </div>
                <div className="mt-1 text-[16px] font-bold text-slate-900">
                  {feld.title}
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Warum für eine Übergabe relevant
                  </div>
                  <p className="mt-1.5 text-[14px] leading-6 text-slate-600">
                    {feld.why}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 rounded-xl bg-slate-50/80 p-4 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Frage zur internen Klärung
                    </div>
                    <p className="mt-1.5 text-[14px] leading-6 text-slate-700">
                      {feld.question}
                    </p>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Möglicher erster Schritt
                    </div>
                    <p className="mt-1.5 text-[14px] leading-6 text-slate-700">
                      {feld.step}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Fragen für die interne Diskussion ────────────────────────────── */}
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
              <li key={point.id} className="uc-avoid-break flex gap-4">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: ACCENT_DARK }}
                >
                  {index + 1}
                </span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {dimensionContent(point.dimension).title}
                  </div>
                  <p className="mt-1 text-[15px] font-semibold leading-7 text-slate-900">
                    {point.question}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Perspektivvergleich als nächster Schritt ─────────────────────── */}
      <PerspectiveBlock assessmentId={assessmentId} />

      {/* ── Arbeitsseite ─────────────────────────────────────────────────── */}
      {/* Als Ganzes geschützt: aufgeteilt landete regelmäßig das letzte Feld
          allein auf einer sonst leeren Seite. Zusammenhängend ist sie außerdem
          das, was sie sein soll, nämlich eine Seite zum Ausfüllen. */}
      <section className="panel uc-avoid-break uc-worksheet">
        <h2 className="text-xl font-bold text-slate-900">{WORKSHEET_TITLE}</h2>
        <p className="mt-2 text-[15px] leading-7 muted">{WORKSHEET_INTRO}</p>

        <div className="mt-6 space-y-7">
          {WORKSHEET_FIELDS.map((field) => (
            <div key={field.label} className="uc-avoid-break">
              <div className="text-[15px] font-semibold text-slate-800">
                {field.label}
              </div>
              <WriteLines count={field.lines} numbered={field.numbered} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

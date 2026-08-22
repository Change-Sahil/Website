// src/components/uebergabe-check/Report.tsx
//
// Der Ergebnisbericht. Reine Darstellungskomponente ohne State, wird sowohl
// direkt nach dem Ausfüllen (Client) als auch auf der permanenten
// Ergebnisseite (Server) gerendert.
//
// Informationshierarchie: Diagramm und Werte zuerst, Erläuterung danach. Der
// Nutzer soll in wenigen Sekunden sehen, wo er ungefähr steht, bevor Methodik
// erklärt wird.
//
// Zwei Ergebnisebenen, die bewusst getrennt bleiben:
//  1. Der Dimensionsscore mit einer non-kausalen Einordnung. Er sagt, wie hoch
//     das Niveau insgesamt liegt, nie warum.
//  2. „Auffällig in Ihren Antworten“: einzelne Antworten, die konkret benannt
//     werden dürfen, weil sie direkt aus einem Item stammen. Sie verändern den
//     Score nicht und stehen unmittelbar bei ihrer Dimension.

import SpiderWeb, { SERIES_COLORS } from "./SpiderWeb";
import {
  CHART_EXPLANATION,
  CONTEXT_NOTE,
  FLAGS_SECTION_HINT,
  FLAGS_SECTION_TITLE,
  LEVEL_META,
  NO_TOTAL_SCORE_NOTE,
  RESULT_DISCLAIMER,
  dimensionContent,
} from "@/lib/uebergabe-check/content";
import type { Answers } from "@/lib/uebergabe-check/items";
import {
  computeFlags,
  flagsForDimension,
  formatScore,
  type DimensionScore,
  type FlagDefinition,
  type MaturityLevel,
} from "@/lib/uebergabe-check/scoring";

const LEVEL_ORDER: MaturityLevel[] = ["stable", "observe", "develop", "elevated"];

/**
 * Bis zu so vielen Item-Hinweisen wird alles direkt gezeigt. Darüber liest sich
 * die Liste als Mängelliste statt als Orientierung, deshalb bleibt dann je
 * Dimension nur der wichtigste Hinweis offen und der Rest klappt auf Wunsch aus.
 * Sechs entspricht genau einem Hinweis pro Dimension.
 */
const VISIBLE_FLAG_LIMIT = 6;

/**
 * Entscheidet, welche Hinweise sofort sichtbar sind.
 *
 * Wichtig ist, dass jede Dimension mit Hinweisen auch einen sichtbaren Hinweis
 * behält. Eine Überschrift, unter der nur ein Aufklapp-Link steht, wirkt wie
 * ein Fehler.
 */
function selectPrimaryFlags(flags: FlagDefinition[]): Set<string> {
  if (flags.length <= VISIBLE_FLAG_LIMIT) {
    return new Set(flags.map((flag) => flag.id));
  }

  const seen = new Set<number>();
  const primary = new Set<string>();
  // flags ist bereits nach interner Einstufung sortiert, der erste Treffer je
  // Dimension ist damit der wichtigste.
  for (const flag of flags) {
    if (seen.has(flag.dimension)) continue;
    seen.add(flag.dimension);
    primary.add(flag.id);
  }
  return primary;
}

function LevelBadge({ level }: { level: MaturityLevel }) {
  const meta = LEVEL_META[level];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold"
      style={{ background: `${meta.color}14`, color: meta.color }}
      title={meta.meaning}
    >
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}

function FlagCard({ flag }: { flag: FlagDefinition }) {
  return (
    <div
      className="rounded-2xl border border-slate-200 border-l-[3px] bg-white p-5"
      style={{ borderLeftColor: "rgb(0,168,165)" }}
    >
      {/* Befund */}
      <div className="text-[15px] font-semibold text-slate-900">
        {flag.heading}
      </div>
      <p className="mt-2 text-[15px] leading-7 text-slate-600">{flag.text}</p>

      {/* Deutlich abgesetzt: nichts davon ist eine Diagnose. */}
      <div className="mt-4 grid gap-4 rounded-xl bg-slate-50/80 p-4 sm:grid-cols-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Prüfimpuls
          </div>
          <p className="mt-1.5 text-[14px] leading-6 text-slate-700">
            {flag.check}
          </p>
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Möglicher nächster Schritt
          </div>
          <p className="mt-1.5 text-[14px] leading-6 text-slate-700">
            {flag.approach}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Report({
  scores,
  answers,
}: {
  scores: DimensionScore[];
  answers: Answers;
}) {
  // Bereits nach interner Einstufung sortiert.
  const flags = computeFlags(answers);
  const primaryIds = selectPrimaryFlags(flags);

  return (
    <div className="uc-report space-y-6 md:space-y-8">
      {/* ── Kurzer methodischer Hinweis (Spec Teil 4, 1.1) ───────────────── */}
      <p
        className="border-l-[3px] py-1 pl-4 text-[13px] leading-6 text-slate-600"
        style={{ borderLeftColor: "rgb(0,168,165)" }}
      >
        <strong className="font-semibold text-slate-800">
          Hinweis zur Ergebniseinordnung:
        </strong>{" "}
        {RESULT_DISCLAIMER}
      </p>

      {/* ── Diagramm und Stufenlegende ───────────────────────────────────── */}
      <div className="panel">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
          <div className="flex justify-center">
            {/* Eine Serie. Der Perspektivvergleich reicht später weitere nach. */}
            <SpiderWeb
              series={[
                {
                  id: "self",
                  label: "Ihre Einschätzung",
                  scores,
                  color: SERIES_COLORS[0],
                },
              ]}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Ihr Übergabeprofil
            </h2>
            <ul className="mt-4 space-y-2">
              {LEVEL_ORDER.map((level) => {
                const meta = LEVEL_META[level];
                return (
                  <li key={level} className="flex items-start gap-2 text-[13px]">
                    <span
                      aria-hidden
                      className="mt-[6px] h-2 w-2 shrink-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <span className="text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        {meta.range}
                      </strong>{" "}
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Die sechs Werte auf einen Blick ──────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scores.map((entry) => {
          const content = dimensionContent(entry.dimension);
          const meta = LEVEL_META[entry.level];
          const dimensionFlags = flagsForDimension(flags, entry.dimension);

          return (
            <a
              key={entry.dimension}
              href={`#dimension-${entry.dimension}`}
              className="uc-topline rounded-2xl border border-slate-200 p-4 transition-colors duration-150 hover:border-slate-300"
              style={{
                // Sehr leichte Tönung in der Farbe der Reifegradstufe. Macht
                // das Profil auf einen Blick lesbar, ohne bunt zu wirken.
                background: `linear-gradient(180deg, ${meta.color}0A, rgba(255,255,255,0.9) 60%)`,
                ["--uc-accent" as string]: meta.color,
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Dimension {entry.dimension}
                </span>
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: meta.color }}
                >
                  {formatScore(entry.score)}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {content.title}
              </div>

              <div
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                aria-hidden
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${entry.score}%`, background: meta.color }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <LevelBadge level={entry.level} />
                {dimensionFlags.length > 0 && (
                  <span className="text-[12px] font-medium text-slate-500">
                    {dimensionFlags.length === 1
                      ? "1 Hinweis"
                      : `${dimensionFlags.length} Hinweise`}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* ── Orientierung, erst nach den Zahlen ───────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 sm:p-6">
        <p className="text-[14px] leading-7 text-slate-600">
          {CHART_EXPLANATION}
        </p>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          {NO_TOTAL_SCORE_NOTE}
        </p>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          {CONTEXT_NOTE}
        </p>
      </div>

      {/* ── Detailauswertung je Dimension ────────────────────────────────── */}
      <div className="space-y-4">
        {scores.map((entry, index) => {
          const content = dimensionContent(entry.dimension);
          const text = content.levels[entry.level];
          const meta = LEVEL_META[entry.level];

          const dimensionFlags = flagsForDimension(flags, entry.dimension);
          const primary = dimensionFlags.filter((flag) =>
            primaryIds.has(flag.id)
          );
          const additional = dimensionFlags.filter(
            (flag) => !primaryIds.has(flag.id)
          );

          // Der Erklärtext zu den Item-Hinweisen steht nur einmal im Bericht,
          // beim ersten Block, der überhaupt Hinweise enthält.
          const isFirstWithFlags =
            scores.findIndex(
              (candidate) =>
                flagsForDimension(flags, candidate.dimension).length > 0
            ) === index;

          return (
            <section
              key={entry.dimension}
              id={`dimension-${entry.dimension}`}
              className="panel uc-topline scroll-mt-28"
              style={{ ["--uc-accent" as string]: meta.color }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="section-eyebrow">
                    <span className="dot" />
                    <span>Dimension {entry.dimension}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">
                    {content.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: meta.color }}
                  >
                    {formatScore(entry.score)}
                    <span className="text-base font-medium text-slate-400">
                      /100
                    </span>
                  </div>
                  <div className="mt-1">
                    <LevelBadge level={entry.level} />
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-7 text-slate-600">
                {content.explanation}
              </p>

              <div className="mt-5 space-y-4 rounded-2xl bg-slate-50/80 p-5">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Einordnung
                  </div>
                  <p className="mt-1.5 text-[15px] leading-7 text-slate-700">
                    {text.interpretation}
                  </p>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Handlungs- und Prüfimpuls
                  </div>
                  <p className="mt-1.5 text-[15px] leading-7 text-slate-700">
                    {text.impulse}
                  </p>
                </div>
              </div>

              {/* Itembasierte Hinweise, direkt bei ihrer Dimension. Erscheinen
                  auch dann, wenn der Score insgesamt gut ausfällt. */}
              {dimensionFlags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-[15px] font-bold text-slate-900">
                    {FLAGS_SECTION_TITLE}
                  </h4>
                  {isFirstWithFlags && (
                    <p className="mt-1.5 text-[13px] leading-6 muted">
                      {FLAGS_SECTION_HINT}
                    </p>
                  )}

                  {primary.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {primary.map((flag) => (
                        <FlagCard key={flag.id} flag={flag} />
                      ))}
                    </div>
                  )}

                  {additional.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer list-none text-[13px] font-medium text-teal-700 underline underline-offset-4 [&::-webkit-details-marker]:hidden">
                        Weitere Auffälligkeiten anzeigen ({additional.length})
                      </summary>
                      <div className="mt-3 space-y-3">
                        {additional.map((flag) => (
                          <FlagCard key={flag.id} flag={flag} />
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

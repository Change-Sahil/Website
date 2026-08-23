// src/components/uebergabe-check/ComparisonReport.tsx
//
// Auswertung des Perspektivvergleichs.
// Quelle: Fachliche Spezifikation Perspektivvergleich, Abschnitt 12.
//
// Reihenfolge:
//   1. Ihr Übergabeprofil im Perspektivvergleich  (Spiderweb, Rollenprofile)
//   2. Wo Sie ein ähnliches Bild haben
//   3. Wo Ihre Perspektiven auseinanderliegen
//   4. Was hinter den Unterschieden steckt        (Itemabweichungen)
//   5. Fragen für Ihr gemeinsames Gespräch
//   6. Was bedeutet das für Ihre Übergabe?        (CTA)
//
// Was hier NICHT stehen darf: welche Perspektive zutrifft, wer etwas über- oder
// unterschätzt, eine Ursache für eine Abweichung, oder ein Gesamtscore.

import SpiderWeb, { SERIES_COLORS } from "./SpiderWeb";
import { BOOKING_URL_DE } from "@/lib/booking";
import {
  CLARIFICATION_INTRO,
  HEURISTIC_DISCLOSURE,
  SMALL_GROUP_NOTE,
  SPREAD_BANDS,
  formatMean,
  type ComparisonResult,
  type DimensionComparison,
} from "@/lib/uebergabe-check/comparison";
import { METHOD_NOTE, dimensionContent } from "@/lib/uebergabe-check/content";
import { formatScore } from "@/lib/uebergabe-check/scoring";

const ACCENT = "rgb(0,168,165)";
const ACCENT_DARK = "rgb(0,112,125)";

function RoleValues({ entry }: { entry: DimensionComparison }) {
  return (
    <div className="mt-3 space-y-1.5">
      {entry.values.map((value, index) => (
        <div key={value.role} className="flex items-center gap-3 text-[14px]">
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: SERIES_COLORS[index % SERIES_COLORS.length] }}
          />
          <span className="flex-1 text-slate-600">{value.label}</span>
          <span className="font-semibold tabular-nums text-slate-800">
            {formatScore(value.score)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ComparisonReport({
  result,
}: {
  result: ComparisonResult;
}) {
  const { profiles, aligned, divergent, items, fallback } = result;

  return (
    <div className="uc-report space-y-6 md:space-y-8">
      {/* ── 1. Rollenprofile ─────────────────────────────────────────────── */}
      <div className="panel">
        <h2 className="text-xl font-bold text-slate-900">
          Ihr Übergabeprofil im Perspektivvergleich
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-7 muted">
          Jede Linie zeigt, wie eine Rolle dieselben sechs Dimensionen
          einschätzt. Ein Gesamtwert wird auch hier nicht gebildet.
        </p>

        <div className="mt-6 flex justify-center">
          <SpiderWeb
            series={profiles.map((profile, index) => ({
              id: profile.role,
              label: `${profile.label}${
                profile.participants > 1 ? ` (${profile.participants})` : ""
              }`,
              scores: profile.scores,
              color: SERIES_COLORS[index % SERIES_COLORS.length],
            }))}
          />
        </div>
      </div>

      {/* ── 2. Übereinstimmungen ─────────────────────────────────────────── */}
      <section className="panel">
        <h2 className="text-xl font-bold text-slate-900">
          Wo Sie ein ähnliches Bild haben
        </h2>
        {aligned.length > 0 ? (
          <>
            <p className="mt-2 max-w-3xl text-[15px] leading-7 muted">
              {SPREAD_BANDS.aligned.text}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aligned.map((entry) => (
                <div
                  key={entry.dimension}
                  className="uc-avoid-break rounded-2xl border border-slate-200 border-l-[3px] bg-white p-4"
                  style={{ borderLeftColor: ACCENT }}
                >
                  <div className="text-[15px] font-semibold text-slate-900">
                    {dimensionContent(entry.dimension).title}
                  </div>
                  <RoleValues entry={entry} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 max-w-3xl text-[15px] leading-7 muted">
            In keiner der sechs Dimensionen liegen die Einschätzungen eng
            beieinander. Das ist kein Befund über das Unternehmen, sondern
            zunächst nur über die Perspektiven darauf.
          </p>
        )}
      </section>

      {/* ── 3. Unterschiede ──────────────────────────────────────────────── */}
      <section className="panel">
        <h2 className="text-xl font-bold text-slate-900">
          Wo Ihre Perspektiven auseinanderliegen
        </h2>
        {divergent.length > 0 ? (
          <div className="mt-5 space-y-4">
            {divergent.map((entry) => {
              const band = SPREAD_BANDS[entry.band];
              return (
                <div
                  key={entry.dimension}
                  className="uc-avoid-break rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="text-[16px] font-bold text-slate-900">
                      {dimensionContent(entry.dimension).title}
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-[12px] font-semibold"
                      style={{
                        background: "rgba(0,168,165,0.10)",
                        color: ACCENT_DARK,
                      }}
                    >
                      {band.label}
                    </span>
                  </div>
                  <RoleValues entry={entry} />
                  <p className="mt-3 text-[14px] leading-6 text-slate-600">
                    {band.text}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 max-w-3xl text-[15px] leading-7 muted">
            In allen sechs Dimensionen liegen die Einschätzungen nah
            beieinander. Für die Vorbereitung einer Übergabe bedeutet das, dass
            zwischen den beteiligten Perspektiven zunächst kein zusätzlicher
            Klärungsbedarf sichtbar wird.
          </p>
        )}
      </section>

      {/* ── 4. und 5. Itemabweichungen mit ihrer Klärungsfrage ───────────── */}
      {/* Bewusst ein Abschnitt statt zwei: Eine separate Fragenliste würde
          jede Frage ein zweites Mal wörtlich wiederholen. Die Frage steht
          dort, wo der Befund steht, mit dem sie zu tun hat. */}
      {(items.length > 0 || fallback.length > 0) && (
        <section className="panel">
          <h2 className="text-xl font-bold text-slate-900">
            Was hinter den Unterschieden steckt
          </h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 muted">
            Die einzelnen Aussagen, bei denen die Einschätzungen am weitesten
            auseinanderliegen. Angegeben ist jeweils der Mittelwert der
            Antworten auf der fünfstufigen Skala.
          </p>
          {/* Steht einmal für den ganzen Abschnitt, nicht bei jeder Frage. */}
          <p className="mt-3 max-w-3xl text-[14px] leading-6 text-slate-500">
            {CLARIFICATION_INTRO}
          </p>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="uc-avoid-break rounded-2xl border border-slate-200 border-l-[3px] bg-white p-5"
                style={{ borderLeftColor: ACCENT }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Unterschiedliche Wahrnehmung bei
                </div>
                <div className="mt-1 text-[16px] font-bold text-slate-900">
                  {item.topic}
                </div>
                <p className="mt-2 text-[14px] leading-6 text-slate-600">
                  {item.statement}
                </p>

                <div className="mt-4 space-y-1.5">
                  {item.values.map((value, index) => (
                    <div
                      key={value.role}
                      className="flex items-center gap-3 text-[14px]"
                    >
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background: SERIES_COLORS[index % SERIES_COLORS.length],
                        }}
                      />
                      <span className="flex-1 text-slate-600">{value.label}</span>
                      <span className="font-semibold tabular-nums text-slate-800">
                        {formatMean(value.value)}
                        <span className="font-medium text-slate-400"> / 5</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-slate-50/80 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Für das gemeinsame Gespräch
                  </div>
                  <p className="mt-1.5 text-[15px] font-semibold leading-7 text-slate-800">
                    {item.question}
                  </p>
                </div>
              </div>
            ))}

            {/* Nur wenn keine einzelne Aussage die Schwelle erreicht hat. */}
            {fallback.map((question) => (
              <div
                key={question}
                className="uc-avoid-break rounded-xl bg-slate-50/80 p-4"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Für das gemeinsame Gespräch
                </div>
                <p className="mt-1.5 text-[15px] font-semibold leading-7 text-slate-800">
                  {question}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. Abschluss und CTA ─────────────────────────────────────────── */}
      <div className="dark-block p-7 sm:p-10">
        <h2 className="text-2xl font-bold text-white">
          Was bedeutet das für Ihre Übergabe?
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/70">
          Unterschiedliche Einschätzungen sind weder ungewöhnlich noch
          automatisch problematisch. Relevant wird eine Wahrnehmungslücke dann,
          wenn sie einen Bereich betrifft, der für die geplante Übergabe eine
          wichtige Rolle spielt. Welche Unterschiede zuerst geklärt werden
          sollten, hängt deshalb von Ihrer konkreten Nachfolgekonstellation ab.
        </p>
        <div className="mt-7">
          <a
            href={BOOKING_URL_DE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-[5px] bg-white px-5 py-3 font-semibold text-slate-900 transition-opacity duration-150 hover:opacity-90"
          >
            Perspektivvergleich gemeinsam einordnen
          </a>
        </div>
      </div>

      <div className="space-y-2 text-[13px] leading-6 text-slate-500">
        <p>{HEURISTIC_DISCLOSURE}</p>
        <p>{SMALL_GROUP_NOTE}</p>
        <p>{METHOD_NOTE}</p>
      </div>
    </div>
  );
}

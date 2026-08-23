// src/components/uebergabe-check/ResultCtas.tsx
//
// Abschluss der Ergebnisseite. Drei Wege mit klarer Rangfolge statt eines
// einzelnen Angebots:
//
//   1. Ergebnis gemeinsam einordnen   für alle, die direkt sprechen wollen
//   2. Perspektivvergleich starten    für alle, die zuerst intern weiterarbeiten
//   3. Persönlichen Bericht erhalten  für alle, die dokumentieren und vertiefen
//
// Weg 2 hält diejenigen im Funnel, die noch keinen Beraterkontakt möchten. Er
// erzeugt zugleich den natürlichen Kreislauf: Inhaber macht den Check, lädt
// Führungskräfte ein, unterschiedliche Wahrnehmungen werden sichtbar, daraus
// entsteht Gesprächsbedarf.

"use client";

import Link from "next/link";

import { useStartComparison } from "./PerspectiveBlock";
import { PERSPECTIVE_CTA } from "@/lib/uebergabe-check/report-blocks";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3";

export default function ResultCtas({
  variant = "live",
  discussionCount,
  assessmentId = null,
  onRequestReport,
}: {
  variant?: "live" | "report";
  /**
   * Anzahl der Diskussionsfragen im Bericht. Wird durchgereicht statt fest
   * verdrahtet, weil sie je nach Antwortprofil zwischen drei und fünf liegt.
   */
  discussionCount?: number;
  /** Für den Einstieg in den Perspektivvergleich. */
  assessmentId?: string | null;
  /** Klappt das Formular für die Zusendung auf. Nur in der Variante "live". */
  onRequestReport?: () => void;
}) {
  const comparison = useStartComparison(assessmentId);

  const secondaryClass =
    "inline-flex items-center justify-center rounded-[5px] border border-white/25 px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="dark-block uc-no-print p-7 sm:p-10">
      <div className="section-eyebrow" style={{ color: "rgba(255,255,255,0.62)" }}>
        <span className="dot" />
        {/* Nicht „Nächster Schritt“: im Bericht steht direkt darüber die
            Arbeitsseite gleichen Namens. */}
        <span>Einordnung</span>
      </div>

      <h2 className="mt-3 text-2xl font-bold text-white">
        Was bedeutet das für Ihre konkrete Nachfolge?
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70">
        Der Schnellcheck zeigt, wo sich eine genauere Betrachtung lohnt. Welche
        Punkte für Ihre konkrete Übergabesituation tatsächlich relevant sind,
        hängt unter anderem von Nachfolgeform, Zeithorizont und der zukünftigen
        Rolle des heutigen Inhabers ab.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-[5px] bg-white px-5 py-3 font-semibold text-slate-900 transition-opacity duration-150 hover:opacity-90"
        >
          Ergebnis gemeinsam einordnen
        </a>

        <button
          type="button"
          onClick={comparison.start}
          disabled={comparison.pending}
          className={secondaryClass}
        >
          {comparison.pending ? "Wird angelegt …" : PERSPECTIVE_CTA}
        </button>

        {variant === "live" ? (
          <button type="button" onClick={onRequestReport} className={secondaryClass}>
            Persönlichen Arbeitsbericht erhalten
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.print()}
            className={secondaryClass}
          >
            Als PDF sichern
          </button>
        )}
      </div>

      {comparison.error && (
        <p role="alert" className="mt-4 text-[14px] font-medium text-red-300">
          {comparison.error}
        </p>
      )}

      {/* Ohne diesen Satz ist nicht ersichtlich, warum jemand nach dem bereits
          sichtbaren Ergebnis noch eine E-Mail-Adresse hinterlassen sollte. */}
      {variant === "live" && (
        <p className="mt-4 max-w-2xl text-[14px] leading-6 text-white/60">
          Mit persönlicher Profilzusammenfassung, ausgewählten Prüffeldern,{" "}
          {discussionCount ? `${discussionCount} Fragen` : "Fragen"} für Ihre
          interne Diskussion und einer Arbeitsseite für Ihre nächsten Schritte.
        </p>
      )}

      <p className="mt-5 text-[14px] text-white/60">
        <Link
          href="/de/werkstattgespraech"
          className="underline underline-offset-4 transition-colors duration-150 hover:text-white"
        >
          Werkstattgespräch ansehen
        </Link>
      </p>
    </div>
  );
}

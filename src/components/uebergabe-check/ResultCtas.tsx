// src/components/uebergabe-check/ResultCtas.tsx
//
// Abschluss der Ergebnisseite. Bewusst eine klare Rangfolge statt drei
// gleichwertiger Buttons: der wertvollste nächste Schritt ist das Gespräch,
// der Bericht ist der Auffangmechanismus für alle, die noch nicht so weit sind.
//
// Zwei Varianten:
//  • "live"   direkt nach dem Ausfüllen. Zweiter Button führt zum Formular für
//             den Ergebnisbericht.
//  • "report" auf der permanenten Berichtsseite. Dort liegt der Bericht bereits
//             vor, deshalb steht hier das Sichern als PDF.

"use client";

import Link from "next/link";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3";

export default function ResultCtas({
  variant = "live",
  discussionCount,
  onRequestReport,
}: {
  variant?: "live" | "report";
  /**
   * Anzahl der Diskussionsfragen im Bericht. Wird durchgereicht statt fest
   * verdrahtet, weil sie je nach Antwortprofil zwischen drei und fünf liegt.
   */
  discussionCount?: number;
  /** Klappt das Formular für die Zusendung auf. Nur in der Variante "live". */
  onRequestReport?: () => void;
}) {
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

        {variant === "live" ? (
          <button
            type="button"
            onClick={onRequestReport}
            className="inline-flex items-center justify-center rounded-[5px] border border-white/25 px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-white/10"
          >
            Persönlichen Arbeitsbericht erhalten
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center rounded-[5px] border border-white/25 px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-white/10"
          >
            Als PDF sichern
          </button>
        )}
      </div>

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

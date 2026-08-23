// src/components/uebergabe-check/PerspectiveBlock.tsx
//
// „Wie sehen andere Ihr Unternehmen?“ mit echtem nächsten Schritt.
//
// Steht sowohl auf der kostenlosen Ergebnisseite als auch im persönlichen
// Bericht. Der Perspektivvergleich ist der logische nächste Erkenntnisschritt
// nach dem gerade gemachten Test, nicht ein weiteres Angebot.
//
// Zur E-Mail-Adresse: Sie wird hier nicht als Gegenleistung verlangt, sondern
// funktional gebraucht. Der Initiator wird über eingehende Einschätzungen
// informiert, und die Auswertung muss zustellbar sein. Das steht auch so unter
// dem Button. Wer den Bericht bereits angefordert hat, wird nicht erneut
// gefragt: dann legt der Klick den Vergleich sofort an.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LeadForm from "./LeadForm";
import {
  PERSPECTIVE_CTA,
  PERSPECTIVE_CTA_HINT,
  PERSPECTIVE_EMAIL_NOTE,
  PERSPECTIVE_HOOK,
  PERSPECTIVE_INTRO,
  PERSPECTIVE_TITLE,
} from "@/lib/uebergabe-check/report-blocks";

const ACCENT = "rgb(0,168,165)";

/**
 * Legt den Vergleich an und führt auf dessen Verwaltungsseite.
 *
 * Nur für den Fall, dass bereits Kontaktdaten vorliegen. Ohne gespeichertes
 * Assessment geht es gar nicht: Der Vergleich braucht die Ausgangsperspektive.
 * Das passiert nur, wenn die Datenbank nicht erreichbar war, und wird dann
 * ehrlich benannt statt mit einem toten Button kaschiert.
 */
export function useStartComparison(assessmentId: string | null) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (!assessmentId) {
      setError(
        "Ihr Ergebnis konnte nicht gespeichert werden. Ohne gespeichertes Profil lässt sich kein Vergleich anlegen."
      );
      return;
    }
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/uebergabe-check/vergleich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", assessmentId }),
      });
      const data = await response.json();
      if (!response.ok || !data?.manageToken) {
        setError(data?.error ?? "Der Vergleich konnte nicht angelegt werden.");
        setPending(false);
        return;
      }
      router.push(`/de/uebergabe-check/vergleich/${data.manageToken}`);
    } catch {
      setError("Der Vergleich konnte nicht angelegt werden. Bitte später erneut versuchen.");
      setPending(false);
    }
  }

  return { start, pending, error };
}

export default function PerspectiveBlock({
  assessmentId,
  contactKnown = false,
}: {
  assessmentId: string | null;
  /** Liegen bereits Name und E-Mail zu diesem Durchlauf vor? */
  contactKnown?: boolean;
}) {
  const direct = useStartComparison(assessmentId);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section
        className="uc-avoid-break rounded-2xl border p-6 sm:p-8"
        style={{
          borderColor: "rgba(0,168,165,0.30)",
          background: "rgba(0,168,165,0.05)",
        }}
      >
        <h2 className="text-xl font-bold text-slate-900">{PERSPECTIVE_TITLE}</h2>

        <p className="mt-3 text-[15px] leading-7 text-slate-600">
          {PERSPECTIVE_INTRO}
        </p>
        <p className="mt-3 text-[15px] font-semibold leading-7 text-slate-800">
          {PERSPECTIVE_HOOK}
        </p>

        <div className="uc-no-print mt-6">
          <button
            type="button"
            onClick={() => {
              if (contactKnown) {
                void direct.start();
              } else {
                setFormOpen(true);
              }
            }}
            disabled={direct.pending}
            className="inline-flex items-center justify-center rounded-[5px] px-5 py-3 font-semibold text-white transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: ACCENT }}
          >
            {direct.pending ? "Wird angelegt …" : PERSPECTIVE_CTA}
          </button>

          <p className="mt-3 max-w-2xl text-[14px] leading-6 text-slate-600">
            {PERSPECTIVE_CTA_HINT}
          </p>

          {/* Begründet die E-Mail-Adresse, bevor danach gefragt wird. Wer sie
              schon hinterlassen hat, braucht den Hinweis nicht mehr. */}
          {!contactKnown && (
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-500">
              {PERSPECTIVE_EMAIL_NOTE}
            </p>
          )}

          {direct.error && (
            <p role="alert" className="mt-3 text-[14px] font-medium text-red-600">
              {direct.error}
            </p>
          )}
        </div>

        {/* Im Ausdruck ist ein Button sinnlos, der Hinweis bleibt nützlich. */}
        <p className="uc-print-only mt-4 text-[14px] leading-6 text-slate-600">
          {PERSPECTIVE_CTA_HINT} Den Vergleich starten Sie über den Link zu
          Ihrem Ergebnis.
        </p>
      </section>

      {!contactKnown && (
        <LeadForm
          assessmentId={assessmentId}
          open={formOpen}
          purpose="comparison"
        />
      )}
    </>
  );
}

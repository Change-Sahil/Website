// src/components/uebergabe-check/BetaFeedback.tsx
//
// Fünf Rückmeldefragen der Pilotphase (Spec Abschnitt 5). Wird nur in der
// Beta angezeigt – über BETA_MODE in der Seitenkomponente gesteuert.

"use client";

import { useState } from "react";

import { FEEDBACK_QUESTIONS } from "@/lib/uebergabe-check/content";

type Status = "idle" | "sending" | "sent" | "error";

type FormState = Record<string, string>;

const EMPTY: FormState = Object.fromEntries(
  FEEDBACK_QUESTIONS.map((question) => [question.key, ""])
);

export default function BetaFeedback({ assessmentId }: { assessmentId: string | null }) {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  if (!assessmentId) return null;

  if (status === "sent") {
    return (
      <div className="panel">
        <h2 className="text-lg font-bold text-slate-900">Danke für Ihre Rückmeldung</h2>
        <p className="mt-2 text-sm leading-6 muted">
          Ihre Hinweise fließen direkt in die Überarbeitung des Instruments ein.
        </p>
      </div>
    );
  }

  const filled = Object.values(values).some((value) => value.trim().length > 0);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/uebergabe-check/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, ...values }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Das Speichern hat nicht geklappt.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      setStatus("error");
    }
  }

  return (
    <div className="panel uc-no-print">
      <div className="section-eyebrow">
        <span className="dot" />
        <span>Pilotphase</span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900">
        Ihre Rückmeldung zum Instrument
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-7 muted">
        Dieser Check befindet sich in der Erprobung. Ihre Einschätzung
        entscheidet mit darüber, welche Fragen bleiben und welche neu formuliert
        werden. Beantworten Sie gern nur das, wozu Sie etwas zu sagen haben.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {FEEDBACK_QUESTIONS.map((question, index) => (
          <div key={question.key}>
            <label
              htmlFor={`uc-fb-${question.key}`}
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              <span className="text-slate-400">{index + 1}.</span>{" "}
              {question.question}
            </label>
            <textarea
              id={`uc-fb-${question.key}`}
              rows={2}
              maxLength={4000}
              value={values[question.key]}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  [question.key]: event.target.value,
                }))
              }
              placeholder={question.placeholder}
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-800 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        ))}

        {status === "error" && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !filled}
          className="btn-secondary disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status === "sending" ? "Wird gesendet …" : "Rückmeldung absenden"}
        </button>
      </form>
    </div>
  );
}

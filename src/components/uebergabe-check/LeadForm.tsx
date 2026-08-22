// src/components/uebergabe-check/LeadForm.tsx
//
// Optionale Zusendung des Berichts. Das Ergebnis ist zu diesem Zeitpunkt
// bereits vollständig sichtbar – dieses Formular ist ein Angebot, keine Hürde.
//
// Datenschutz: Das Assessment liegt anonym in der Datenbank. Erst mit dem
// Absenden dieses Formulars wird eine E-Mail-Adresse damit verknüpft. Die
// Einwilligung zur Zusendung (Pflicht) und die Einwilligung zu späterer
// Kommunikation (freiwillig) sind bewusst getrennt.

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm({
  assessmentId,
  open,
}: {
  assessmentId: string | null;
  /**
   * Das Formular ist eingeklappt, bis der Nutzer den Bericht ausdrücklich
   * anfordert. Ein dauerhaft sichtbares Kontaktformular unter dem fertigen
   * Ergebnis wirkt wie eine nachgereichte Hürde.
   */
  open: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [consentReport, setConsentReport] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  // Beim Aufklappen zum Formular scrollen und den Fokus setzen, damit der
  // Klick auf den Button spürbar etwas bewirkt.
  useEffect(() => {
    if (!open || status === "sent") return;
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = window.setTimeout(() => nameRef.current?.focus(), 400);
    return () => window.clearTimeout(timer);
  }, [open, status]);

  // Solange nichts angefordert wurde, bleibt nur der Sprunganker stehen.
  if (!open && status !== "sent") {
    return <div id="ergebnisbericht" className="scroll-mt-28" />;
  }

  if (!assessmentId) {
    return (
      <div className="panel">
        <h2 className="text-lg font-bold text-slate-900">
          Ergebnis per E-Mail
        </h2>
        <p className="mt-2 text-sm leading-6 muted">
          Die Zusendung ist gerade nicht möglich, weil dieser Durchlauf nicht
          gespeichert werden konnte. Ihr Ergebnis oben bleibt vollständig
          sichtbar. Sie können die Seite ausdrucken oder als PDF sichern.
        </p>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="panel">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: "rgb(0,168,165)" }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" className="stroke-current">
              <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Bericht ist unterwegs</h2>
            <p className="mt-2 text-sm leading-6 muted">
              Wir haben Ihnen den vollständigen Bericht an{" "}
              <strong className="font-semibold text-slate-700">{email}</strong>{" "}
              geschickt. Die Mail enthält einen dauerhaften Link zu diesem
              Ergebnis. Falls sie nicht ankommt, prüfen Sie bitte den
              Spam-Ordner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/uebergabe-check/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          consentReport,
          consentMarketing,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Der Versand hat nicht geklappt.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-800 outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <div id="ergebnisbericht" ref={containerRef} className="panel scroll-mt-28">
      <div className="section-eyebrow">
        <span className="dot" />
        <span>Optional</span>
      </div>
      <h2 className="mt-2 text-xl font-bold text-slate-900">
        Ihr persönlicher Ergebnisbericht
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-7 muted">
        Sie erhalten Ihr Übergabeprofil als Arbeitsgrundlage für die weitere
        Nachfolgevorbereitung. Der Bericht enthält zusätzlich Fragen für die
        interne Diskussion und eine Seite zum Ausfüllen, damit Sie das Ergebnis
        mit Ihrer Führungsebene besprechen können.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="uc-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Name <span className="text-slate-400">*</span>
            </label>
            <input
              id="uc-name"
              ref={nameRef}
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Vor- und Nachname"
            />
          </div>
          <div>
            <label htmlFor="uc-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-Mail <span className="text-slate-400">*</span>
            </label>
            <input
              id="uc-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="name@unternehmen.de"
            />
          </div>
        </div>

        <div>
          <label htmlFor="uc-company" className="mb-1.5 block text-sm font-medium text-slate-700">
            Unternehmen
          </label>
          <input
            id="uc-company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClass}
            placeholder="Optional"
          />
        </div>

        <div className="space-y-3 rounded-2xl bg-slate-50/80 p-4">
          <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-6 text-slate-600">
            <input
              type="checkbox"
              required
              checked={consentReport}
              onChange={(event) => setConsentReport(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-teal-600"
            />
            <span>
              {/* Formulierung deckungsgleich mit der Datenschutzerklärung:
                  „anonym“ wäre falsch, sobald die Verknüpfung erfolgt. */}
              Ich möchte den Ergebnisbericht per E-Mail erhalten. Meine Angaben
              werden dafür mit meinem Testdurchlauf verknüpft, der bislang nur
              unter einer technischen Kennung gespeichert ist.{" "}
              <Link
                href="/de/datenschutz"
                className="font-medium text-teal-700 underline underline-offset-2"
              >
                Datenschutzhinweise
              </Link>
              {/* Der Hinweis gehört unmittelbar an diesen Haken. Unter beiden
                  Haken sah er aus, als gälte er für den freiwilligen. */}
              <span className="mt-1 block text-[12px] text-slate-400">
                Pflichtangabe für den Versand
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-6 text-slate-600">
            <input
              type="checkbox"
              checked={consentMarketing}
              onChange={(event) => setConsentMarketing(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-teal-600"
            />
            <span>
              Ich bin damit einverstanden, gelegentlich fachliche Impulse zur
              Unternehmensnachfolge zu erhalten. Jederzeit widerrufbar.
              <span className="mt-1 block text-[12px] text-slate-400">
                Freiwillig
              </span>
            </span>
          </label>
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !consentReport}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status === "sending" ? "Wird gesendet …" : "Ergebnisbericht anfordern"}
        </button>
      </form>
    </div>
  );
}

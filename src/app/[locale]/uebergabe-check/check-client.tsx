// src/app/[locale]/uebergabe-check/check-client.tsx
//
// Ablauf des Schnellchecks: Einstieg → sechs Schritte à vier Items → Ergebnis.
// Die Auswertung wird sofort im Browser berechnet, damit kein Ladebalken
// zwischen letzter Antwort und Diagramm steht. Parallel geht der Datensatz
// anonym an die API; der serverseitig neu berechnete Score ist der verbindliche.

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import BetaFeedback from "@/components/uebergabe-check/BetaFeedback";
import LeadForm from "@/components/uebergabe-check/LeadForm";
import LikertScale from "@/components/uebergabe-check/LikertScale";
import PerspectiveBlock from "@/components/uebergabe-check/PerspectiveBlock";
import {
  PrintClosing,
  PrintCover,
  PrintHeader,
} from "@/components/uebergabe-check/PrintFrame";
import Report from "@/components/uebergabe-check/Report";
import ResultCtas from "@/components/uebergabe-check/ResultCtas";
import { DIMENSIONS, METHOD_NOTE } from "@/lib/uebergabe-check/content";
import {
  PARTICIPANT_INTRO,
  PARTICIPANT_INTRO_DETAIL,
  PARTICIPANT_TRANSPARENCY,
  PARTICIPANT_TRANSPARENCY_TITLE,
  roleMeta,
  type RespondentRole,
} from "@/lib/uebergabe-check/comparison";
import {
  ITEMS,
  ITEM_VERSION,
  itemText,
  itemsForDimension,
  type Answers,
  type LikertValue,
} from "@/lib/uebergabe-check/items";
import { buildDiscussionPoints } from "@/lib/uebergabe-check/report-blocks";
import {
  answeredCount,
  computeFlags,
  computeScores,
  isComplete,
} from "@/lib/uebergabe-check/scoring";

const TOTAL_STEPS = DIMENSIONS.length;

type Stage = "intro" | "questions" | "result";

/**
 * Gesetzt, wenn der Check über einen Einladungslink läuft. Rolle und
 * Zugehörigkeit bestimmt ausschließlich der Server anhand des Tokens; hier
 * dienen sie nur der Anzeige und der Wahl der Itemformulierung.
 */
export type InviteContext = {
  token: string;
  role: RespondentRole;
  label: string | null;
};

/**
 * Steuert die fünf Rückmeldefragen zum Instrument am Ende der Ergebnisseite.
 *
 * Aktuell aus. Komponente, API-Route und Tabelle uc_feedback bleiben bestehen:
 * für die begleitete Pilotphase genügt es, hier wieder auf true zu setzen.
 */
const BETA_MODE = false;

export default function CheckClient({ invite }: { invite?: InviteContext }) {
  const role: RespondentRole = invite?.role ?? "owner";
  // Eigener Zwischenstand je Einladung: sonst überschreibt die Teilnahme am
  // fremden Rechner den eigenen angefangenen Check und umgekehrt.
  const storageKey = invite
    ? `uc-answers-${ITEM_VERSION}-${invite.token.slice(0, 12)}`
    : `uc-answers-${ITEM_VERSION}`;

  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const [restored, setRestored] = useState(false);
  /** Das Formular für die Zusendung erscheint erst auf ausdrücklichen Wunsch. */
  const [reportFormOpen, setReportFormOpen] = useState(false);
  /**
   * Sobald Kontaktdaten vorliegen, fragt der Einstieg in den
   * Perspektivvergleich nicht erneut danach.
   */
  const [contactKnown, setContactKnown] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  // ── Zwischenstand wiederherstellen ────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Answers;
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        setAnswers(parsed);
        setRestored(true);
      }
    } catch {
      // Beschädigter Zwischenstand ist kein Fehlerfall – einfach neu beginnen.
    }
  }, []);

  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {
      // Privater Modus o. Ä. – der Check funktioniert auch ohne Speicherung.
    }
  }, [answers]);

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const stepItems = useMemo(
    () => itemsForDimension(DIMENSIONS[step].id),
    [step]
  );
  const stepComplete = stepItems.every((item) => answers[item.id] !== undefined);
  const progress = answeredCount(answers);

  function setAnswer(itemId: string, value: LikertValue) {
    setAnswers((previous) => ({ ...previous, [itemId]: value }));
    setShowMissing(false);
  }

  function goBack() {
    setShowMissing(false);
    if (step === 0) {
      setStage("intro");
    } else {
      setStep((current) => current - 1);
    }
    scrollToTop();
  }

  async function goForward() {
    if (!stepComplete) {
      setShowMissing(true);
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep((current) => current + 1);
      scrollToTop();
      return;
    }
    await finish();
  }

  async function finish() {
    if (!isComplete(answers)) {
      setShowMissing(true);
      return;
    }
    setSubmitting(true);

    // Das Ergebnis wird unabhängig vom Speicherergebnis angezeigt – ein
    // Ausfall der Datenbank darf den Nutzer nicht um seine Auswertung bringen.
    try {
      const params = new URLSearchParams(window.location.search);
      const source =
        params.get("utm_source") ?? params.get("src") ?? document.referrer ?? "";

      const response = await fetch("/api/uebergabe-check/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          source: source.slice(0, 120) || undefined,
          inviteToken: invite?.token,
        }),
      });
      const data = await response.json();
      if (data?.id) setAssessmentId(data.id as string);
    } catch {
      // Bewusst still: siehe oben.
    }

    setSubmitting(false);
    setStage("result");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* egal */
    }
    scrollToTop();
  }

  function restart() {
    setAnswers({});
    setAssessmentId(null);
    setStep(0);
    setStage("intro");
    setRestored(false);
    setReportFormOpen(false);
    setContactKnown(false);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* egal */
    }
    scrollToTop();
  }

  // ── Ergebnis nach einer Teilnahme am Perspektivvergleich ──────────────────
  //
  // Bewusst KEIN Einzelbericht: Einordnungen und Hinweise sind durchgehend an
  // den Inhaber adressiert („ein Nachfolger trifft bei Ihnen auf …“). Einer
  // Führungskraft diese Texte zu zeigen wäre die falsche Perspektive. Die
  // Auswertung entsteht ohnehin erst aus dem Vergleich.
  if (stage === "result" && invite) {
    return (
      <div ref={topRef} className="relative mx-auto max-w-3xl">
        <div aria-hidden className="uc-wash" />
        <div className="relative panel">
          <div className="page-eyebrow">Vielen Dank</div>
          <h1 className="title mt-3">Ihre Einschätzung ist eingegangen.</h1>
          <p className="mt-5 text-[15px] leading-7 muted">
            Ihre Antworten fließen in den Perspektivvergleich ein. Die
            gemeinsame Auswertung erhält die Person, die den Vergleich
            angelegt hat.
          </p>
          <p className="mt-3 text-[15px] leading-7 muted">
            Dargestellt werden dort die zusammengefassten Werte je Rolle, nicht
            einzelne Antworten. Sie können dieses Fenster jetzt schließen.
          </p>
        </div>
      </div>
    );
  }

  // ── Ergebnis ──────────────────────────────────────────────────────────────
  if (stage === "result") {
    const scores = computeScores(answers);
    // Nur für die Nutzenbegründung am E-Mail-CTA: die Zahl soll stimmen.
    const discussionCount = buildDiscussionPoints(
      scores,
      computeFlags(answers)
    ).length;
    return (
      <div ref={topRef} className="relative space-y-6 md:space-y-8">
        <div aria-hidden className="uc-wash" />

        {/* Auch wer die Live-Ansicht über Strg+P druckt, soll ein gebrandetes
            Dokument bekommen. */}
        <PrintCover scores={scores} />
        <PrintHeader />

        <header className="max-w-3xl">
          <div className="page-eyebrow">Ergebnis</div>
          <h1 className="title mt-3">Ihr Übergabeprofil</h1>
          <p className="mt-4 text-lg leading-8 muted">
            Sechs Dimensionen, jeweils auf einer Skala von 0 bis 100. Zu jeder
            Dimension finden Sie eine Einordnung, einen Prüfimpuls und, wo
            vorhanden, konkrete Hinweise aus Ihren einzelnen Antworten.
          </p>
        </header>

        <Report scores={scores} answers={answers} />

        {/* Reihenfolge nach Nähe zum gerade Erlebten:
              1. Ergebnis
              2. Wie sehen andere das? -> Perspektivvergleich
              3. Persönlicher Ergebnis- und Arbeitsbericht
              4. Ergebnis gemeinsam einordnen
            Das Beratungsgespräch steht damit am Ende einer Bewegung und nicht
            als Verkaufsangebot direkt hinter dem Diagramm. */}
        <PerspectiveBlock
          assessmentId={assessmentId}
          contactKnown={contactKnown}
        />

        <LeadForm
          assessmentId={assessmentId}
          open={reportFormOpen}
          onSuccess={() => setContactKnown(true)}
        />

        <ResultCtas
          discussionCount={discussionCount}
          onRequestReport={() => setReportFormOpen(true)}
        />
        {BETA_MODE && <BetaFeedback assessmentId={assessmentId} />}

        {/* Der einzige methodische Vorbehalt, klein und am Ende. */}
        <p className="uc-no-print text-[13px] leading-6 text-slate-500">
          {METHOD_NOTE}
        </p>

        <PrintClosing />

        <div className="uc-no-print pt-2">
          <button
            type="button"
            onClick={restart}
            className="text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800"
          >
            Check erneut durchführen
          </button>
        </div>
      </div>
    );
  }

  // ── Einstieg für eingeladene Teilnehmer ───────────────────────────────────
  //
  // Eigener Einstieg statt der Verkaufsseite: Die eingeladene Person hat sich
  // den Check nicht ausgesucht. Der Text macht ausdrücklich klar, dass es nicht
  // darum geht, die Sicht des Inhabers zu bestätigen. Ohne diesen Hinweis
  // liefert der Vergleich angepasste Antworten statt einer eigenen Perspektive.
  if (stage === "intro" && invite) {
    return (
      <div ref={topRef} className="relative mx-auto max-w-3xl">
        <div aria-hidden className="uc-wash" />

        <div className="relative">
          <div className="page-eyebrow">Perspektivvergleich</div>
          <h1 className="title mt-3">Wie sehen Sie das Unternehmen?</h1>
          {invite.label && (
            <p className="mt-3 text-[15px] font-semibold text-slate-700">
              {invite.label}
            </p>
          )}

          <p className="mt-5 text-lg leading-8 muted">{PARTICIPANT_INTRO}</p>
          <p className="mt-4 text-[15px] leading-7 muted">
            {PARTICIPANT_INTRO_DETAIL}
          </p>
        </div>

        <div className="mt-8 panel">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ihre Perspektive
          </div>
          <div className="mt-1 text-[16px] font-bold text-slate-900">
            {roleMeta(role).singular}
          </div>
          <p className="mt-1 text-[14px] leading-6 muted">
            {roleMeta(role).description}
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "24 alltagsnahe Aussagen auf einer fünfstufigen Skala, etwa fünf Minuten.",
              "Die Auswertung fasst die Einschätzungen je Rolle zusammen, einzelne Antworten werden nicht namentlich ausgewiesen.",
              "Sie sehen die Vergleichsauswertung nicht selbst; sie geht an den Initiator.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
              >
                <span
                  aria-hidden
                  className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: "rgb(0,168,165)" }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {/* Vor der Teilnahme, nicht danach, und bewusst deutlicher gesetzt
              als ein Fußnotenhinweis: Wer 24 Aussagen beantwortet, soll vorher
              wissen, wer die Auswertung bekommt und dass eine Zuordnung zur
              eigenen Person möglich sein kann. Das ist für die eingeladene
              Führungskraft wichtiger als jeder Absatz in der
              Datenschutzerklärung. */}
          <div
            className="mt-6 rounded-2xl border p-5"
            style={{
              borderColor: "rgba(0,168,165,0.30)",
              background: "rgba(0,168,165,0.06)",
            }}
          >
            <div className="text-[14px] font-bold text-slate-900">
              {PARTICIPANT_TRANSPARENCY_TITLE}
            </div>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-600">
              {PARTICIPANT_TRANSPARENCY}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStage("questions");
                scrollToTop();
              }}
              className="btn-primary"
            >
              Einschätzung abgeben
            </button>
            {restored && progress > 0 && (
              <button
                type="button"
                onClick={restart}
                className="text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800"
              >
                Von vorn beginnen
              </button>
            )}
          </div>

          {restored && progress > 0 && (
            <p className="mt-3 text-[13px] muted">
              Ein gespeicherter Zwischenstand liegt vor: {progress} von{" "}
              {ITEMS.length} Aussagen sind bereits beantwortet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Einstieg ──────────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div ref={topRef} className="relative mx-auto max-w-4xl">
        <div aria-hidden className="uc-wash" />

        <div className="relative max-w-3xl">
          <div className="page-eyebrow">Schnellcheck</div>
          <h1 className="title mt-3">
            Wie übergabefähig ist Ihr Unternehmen wirklich?
          </h1>
          <p className="mt-5 text-lg leading-8 muted">
            Ein übergabefähiges Unternehmen muss nicht frei von Abhängigkeiten
            sein. Entscheidend ist, dass sie bekannt, bewusst und beherrschbar
            sind.
          </p>
          <p className="mt-4 text-lg leading-8 muted">
            Dieser Schnellcheck zeigt Ihnen, wie gut Ihre Organisation heute auf
            einen Eigentümer- oder Führungswechsel vorbereitet ist. Und wo
            Abhängigkeiten von einzelnen Personen, Wissen oder gewachsenen
            Strukturen die Übergabe erschweren könnten.
          </p>
        </div>

        <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { value: "24", label: "Aussagen", hint: "je vier pro Dimension" },
            { value: "6", label: "Dimensionen", hint: "der Übergabefähigkeit" },
            { value: "5", label: "Minuten", hint: "ohne Vorbereitung" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              {/* Akzent innerhalb der Karte statt als Kante: .card trägt eine
                  animierte Hover-Umrandung, die ein Clipping zerstören würde. */}
              <div
                aria-hidden
                className="h-[3px] w-9 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgb(0,168,165), rgb(0,112,125))",
                }}
              />
              <div
                className="mt-4 text-3xl font-bold"
                style={{ color: "rgb(0,112,125)" }}
              >
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[13px] muted">{stat.hint}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 panel">
          <h2 className="text-lg font-bold text-slate-900">Was Sie erwartet</h2>
          <ul className="mt-4 space-y-3">
            {[
              "24 alltagsnahe Aussagen auf einer fünfstufigen Skala.",
              "Direkt danach sehen Sie Ihr Profil über sechs Dimensionen der Übergabefähigkeit.",
              "Zu jeder Dimension erhalten Sie eine Einordnung und einen konkreten nächsten Schritt.",
              "Auf einen Gesamtscore wird bewusst verzichtet: Er könnte einzelne relevante Abhängigkeiten verdecken.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-[15px] leading-7 text-slate-600"
              >
                <span
                  aria-hidden
                  className="mt-[10px] h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: "rgb(0,168,165)" }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-slate-50/80 p-5 text-[13px] leading-6 muted">
            {/* Betont die Freiheit von der Datenangabe, nicht deren spätere
                Erhebung. Die frühere Fassung las sich unmittelbar über dem
                Startbutton wie eine angekündigte Bezahlschranke. */}
            <strong className="font-semibold text-slate-700">
              Ohne Registrierung:
            </strong>{" "}
            Ihr Ergebnis sehen Sie direkt im Anschluss vollständig. Name und
            E-Mail-Adresse sind nur erforderlich, wenn Sie zusätzlich Ihren
            persönlichen Ergebnis- und Arbeitsbericht per E-Mail erhalten
            möchten.
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStage("questions");
                scrollToTop();
              }}
              className="btn-primary"
            >
              Übergabefähigkeit prüfen
            </button>
            {restored && progress > 0 && (
              <button
                type="button"
                onClick={restart}
                className="text-sm font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800"
              >
                Von vorn beginnen
              </button>
            )}
          </div>

          {/* Der Fortschritt steht als eigene Zeile, damit die Beschriftung des
              Buttons immer dieselbe bleibt. */}
          {restored && progress > 0 && (
            <p className="mt-3 text-[13px] muted">
              Ein gespeicherter Zwischenstand liegt vor: {progress} von{" "}
              {ITEMS.length} Aussagen sind bereits beantwortet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Fragebogen ────────────────────────────────────────────────────────────
  const dimension = DIMENSIONS[step];

  return (
    <div ref={topRef} className="relative mx-auto max-w-4xl">
      <div aria-hidden className="uc-wash" />

      {/* Fortschritt */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Schritt {step + 1} von {TOTAL_STEPS}
          </span>
          <span className="text-[13px] tabular-nums muted">
            {progress} / {ITEMS.length} beantwortet
          </span>
        </div>
        {/* Sechs Segmente statt eines Balkens: der Fortschritt bildet damit
            die Struktur des Fragebogens ab, nicht nur eine Prozentzahl. */}
        <div
          className="uc-steps mt-3"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ITEMS.length}
          aria-valuenow={progress}
          aria-label="Fortschritt"
        >
          {DIMENSIONS.map((entry) => {
            const items = itemsForDimension(entry.id);
            const done = items.filter(
              (item) => answers[item.id] !== undefined
            ).length;
            return (
              <div key={entry.id} className="uc-step">
                <span style={{ width: `${(done / items.length) * 100}%` }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension */}
      <div className="max-w-3xl">
        <div className="section-eyebrow">
          <span className="dot" />
          <span>Dimension {dimension.id}</span>
        </div>
        <h1 className="section-title mt-3">{dimension.title}</h1>
        <p className="mt-3 text-[15px] leading-7 muted">{dimension.focus}</p>
      </div>

      {/* Items */}
      <div className="mt-8 space-y-4">
        {stepItems.map((item, index) => {
          const missing = showMissing && answers[item.id] === undefined;
          return (
            <div
              key={item.id}
              className="panel"
              style={
                missing
                  ? { borderColor: "rgba(185,28,28,0.35)" }
                  : undefined
              }
            >
              <p
                id={`uc-item-${item.id}`}
                className="text-[16px] font-medium leading-7 text-slate-800"
              >
                <span className="mr-2 text-slate-400 tabular-nums">
                  {index + 1}.
                </span>
                {itemText(item, role)}
              </p>
              <div className="mt-5">
                <LikertScale
                  name={`item-${item.id}`}
                  value={answers[item.id]}
                  onChange={(value) => setAnswer(item.id, value)}
                  labelledBy={`uc-item-${item.id}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showMissing && !stepComplete && (
        <p role="alert" className="mt-5 text-sm font-medium text-red-600">
          Bitte beantworten Sie alle vier Aussagen dieser Dimension. Eine
          Teilauswertung wäre nicht aussagekräftig.
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={goBack} className="btn-secondary">
          Zurück
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={submitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          {step < TOTAL_STEPS - 1
            ? "Weiter"
            : submitting
              ? "Wird ausgewertet …"
              : "Auswertung anzeigen"}
        </button>
      </div>
    </div>
  );
}

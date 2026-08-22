// src/lib/uebergabe-check/emails.ts
//
// Interne Benachrichtigung an Seref, sobald jemand seinen Ergebnisbericht
// anfordert. Die Mail an den Nutzer liegt in report-email.ts.

import { DIMENSIONS, LEVEL_META, dimensionContent } from "./content";
import {
  computeFlags,
  formatScore,
  type DimensionScore,
  type FlagPriority,
} from "./scoring";
import type { Answers } from "./items";

/** Nur für die interne Mail. Im Nutzerbericht erscheint keine Einstufung. */
const PRIORITY_LABEL: Record<FlagPriority, string> = {
  kritisch: "KRITISCH",
  erhoehte_aufmerksamkeit: "Erhöhte Aufmerksamkeit",
  hinweis: "Hinweis",
};

// ── Interne Benachrichtigung ─────────────────────────────────────────────────

export function buildInternalNotification(options: {
  name: string;
  email: string;
  company: string;
  consentMarketing: boolean;
  assessmentId: string;
  scores: DimensionScore[];
  answers: Answers;
  resultUrl: string;
}): { subject: string; text: string } {
  const {
    name,
    email,
    company,
    consentMarketing,
    assessmentId,
    scores,
    answers,
    resultUrl,
  } = options;

  // Aus den Rohantworten neu berechnet, damit interne Mail und Nutzerbericht
  // garantiert dieselben Hinweise zeigen.
  const flags = computeFlags(answers);

  const flagLines = flags.length
    ? flags.map(
        (flag) =>
          `  [${PRIORITY_LABEL[flag.priority]}] Item ${flag.itemId} (Dim ${flag.dimension}): ${flag.heading}`
      )
    : ["  keine"];

  const rawAnswers = DIMENSIONS.map((dimension) => {
    const values = Object.entries(answers)
      .filter(([id]) => id.startsWith(`${dimension.id}.`))
      .map(([id, value]) => `${id}=${value}`)
      .join("  ");
    return `  Dim ${dimension.id}: ${values}`;
  });

  const text = [
    `Neuer Übergabe-Check mit Kontaktfreigabe`,
    ``,
    `Name:     ${name}`,
    `E-Mail:   ${email}`,
    `Firma:    ${company || "(keine Angabe)"}`,
    `Marketing-Einwilligung: ${consentMarketing ? "ja" : "nein"}`,
    ``,
    `ID_Testfall: ${assessmentId}`,
    `Bericht:     ${resultUrl}`,
    ``,
    `Scores:`,
    ...scores.map(
      (entry) =>
        `  Dim ${entry.dimension} ${dimensionContent(entry.dimension).title}: ${formatScore(entry.score)} (${LEVEL_META[entry.level].label})`
    ),
    ``,
    `Auffällig in den Antworten (im Bericht sichtbar, Einstufung nur intern):`,
    ...flagLines,
    ``,
    `Rohantworten (Likert 1 bis 5):`,
    ...rawAnswers,
  ].join("\n");

  const flagSuffix = flags.length
    ? ` [${flags.length} ${flags.length === 1 ? "Hinweis" : "Hinweise"}]`
    : "";

  return {
    subject: `Übergabe-Check: ${name}${company ? ` (${company})` : ""}${flagSuffix}`,
    text,
  };
}

// src/lib/uebergabe-check/report-blocks.ts
//
// Zusatzteile des persönlichen Ergebnisberichts, also der Seite hinter dem
// Ergebnislink aus der E-Mail. Sie unterscheiden den Bericht von der frei
// zugänglichen Ergebnisseite.
//
// Die Profilzusammenfassung liegt in summary.ts, weil sie eigene methodische
// Leitplanken hat.

import { dimensionContent } from "./content";
import type { DimensionId } from "./items";
import type { DimensionScore, FlagDefinition } from "./scoring";

// ── Fragen für die interne Diskussion ───────────────────────────────────────
//
// Zusammengestellt aus bereits freigegebenen Spec-Texten: den Prüfimpulsen der
// ausgelösten Item-Hinweise, ergänzt um die dimensionalen Prüfimpulse der
// schwächsten Bereiche. Dadurch enthält der Abschnitt keine einzige neue
// inhaltliche Behauptung.

export const DISCUSSION_TITLE = "Fragen für Ihre interne Diskussion";

export const DISCUSSION_INTRO =
  "Diese Punkte eignen sich für das Gespräch mit Ihrer Führungsebene oder Ihren Mitgesellschaftern. Sie stammen unmittelbar aus Ihren Antworten und sind bewusst als Fragen formuliert, nicht als Befunde. Die Auswahl ist begrenzt, damit ein Gespräch daraus werden kann; alle Hinweise finden Sie weiter oben bei den einzelnen Dimensionen.";

/**
 * Fünf Punkte regen zum Nachdenken an, zehn wirken wie ein Audit-Fragebogen.
 * Werden mehr Hinweise ausgelöst, entscheidet die interne Einstufung, welche
 * hier landen. Die vollständige Liste steht ohnehin bei den Dimensionen.
 */
const MAX_DISCUSSION_ITEMS = 5;
/** Unter drei Punkten wirkt der Abschnitt zu dünn, dann wird aufgefüllt. */
const MIN_DISCUSSION_ITEMS = 3;

export type DiscussionPoint = {
  id: string;
  dimension: DimensionId;
  /** Worum es geht. */
  topic: string;
  /** Der eigentliche Prüfimpuls. */
  question: string;
};

export function buildDiscussionPoints(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): DiscussionPoint[] {
  // flags ist bereits nach interner Einstufung sortiert.
  const points: DiscussionPoint[] = flags
    .slice(0, MAX_DISCUSSION_ITEMS)
    .map((flag) => ({
      id: flag.id,
      dimension: flag.dimension,
      topic: flag.heading,
      question: flag.check,
    }));

  if (points.length >= MIN_DISCUSSION_ITEMS) return points;

  // Auffüllen mit den dimensionalen Prüfimpulsen der niedrigsten Werte.
  const byScore = [...scores].sort(
    (a, b) => a.score - b.score || a.dimension - b.dimension
  );
  for (const entry of byScore) {
    if (points.length >= MIN_DISCUSSION_ITEMS) break;
    const content = dimensionContent(entry.dimension);
    const id = `dim-${entry.dimension}`;
    if (points.some((point) => point.id === id)) continue;
    points.push({
      id,
      dimension: entry.dimension,
      topic: content.title,
      question: content.levels[entry.level].impulse,
    });
  }

  return points;
}

// ── Arbeitsseite „Ihr nächster Schritt“ ─────────────────────────────────────
//
// Reine Oberfläche, keine Modellinhalte. Macht aus dem Bericht ein Dokument,
// mit dem sich weiterarbeiten lässt, statt eines reinen Ergebnisausdrucks.

export const WORKSHEET_TITLE = "Ihr nächster Schritt";

export const WORKSHEET_INTRO =
  "Zum Ausdrucken und Ausfüllen, allein oder gemeinsam im Führungskreis.";

export const WORKSHEET_FIELDS: readonly { label: string; lines: number }[] = [
  { label: "Drei Punkte, die ich genauer betrachten möchte", lines: 3 },
  { label: "Wer sollte dazu einbezogen werden?", lines: 2 },
  { label: "Bis wann möchte ich Klarheit haben?", lines: 1 },
];

// src/lib/uebergabe-check/comparison.ts
//
// Perspektivvergleich: mehrere Assessments desselben Unternehmens aus
// unterschiedlichen Rollen nebeneinander.
//
// ═══════════════════════════════════════════════════════════════════════════
//  STATUS
//  Technisch vorbereitet, fachlich NICHT freigegeben. Der Vergleich ist keine
//  Leistung des kostenlosen Schnellchecks (Werttreppe, Auftrag Punkt 18 und
//  24). Freischaltung ausschließlich über COMPARISON_ENABLED.
//
//  Bewusst NICHT hier festgelegt, weil fachlich zu klären:
//   • rollenspezifische Formulierungen der 24 Items (siehe items.ts)
//   • Regeln zur Interpretation von Dimensions- und Itemdifferenzen
//   • Schwellen für „ähnlich“ und „deutlich unterschiedlich“
//   • Textbausteine des Perspektivberichts
// ═══════════════════════════════════════════════════════════════════════════

import { DIMENSION_IDS, type Answers, type DimensionId } from "./items";
import { dimensionScore, type DimensionScore } from "./scoring";

/**
 * Hauptschalter. Solange false, existiert der Perspektivvergleich für Nutzer
 * nicht: keine Einladungen, keine Vergleichsauswertung, keine Oberfläche.
 * Der Hinweis im Bericht (report-blocks.ts) bleibt davon unberührt, er kündigt
 * die Möglichkeit nur an.
 */
export const COMPARISON_ENABLED = false;

// ── Rollen ──────────────────────────────────────────────────────────────────
// Bewusst schlank gehalten.

export const RESPONDENT_ROLES = [
  "owner",
  "management",
  "leader",
  "key_person",
  "other",
] as const;

export type RespondentRole = (typeof RESPONDENT_ROLES)[number];

export const ROLE_LABELS: Record<RespondentRole, string> = {
  owner: "Inhaber oder geschäftsführender Gesellschafter",
  management: "Geschäftsführung",
  leader: "Führungskraft",
  key_person: "Schlüsselperson oder Fachexperte",
  other: "Sonstige",
};

/** Kurzform für Diagrammlegenden und Tabellenköpfe. */
export const ROLE_SHORT_LABELS: Record<RespondentRole, string> = {
  owner: "Inhaber",
  management: "Geschäftsführung",
  leader: "Führung",
  key_person: "Schlüsselpersonen",
  other: "Sonstige",
};

// ── Datenschutz ─────────────────────────────────────────────────────────────

/**
 * Keine pauschale Anonymitätszusage. Bei zwei Führungskräften ist eine
 * Einzelantwort faktisch zuordenbar, und genau das muss vorher gesagt werden.
 */
export const COMPARISON_PRIVACY_NOTE =
  "Die Auswertung erfolgt rollenbezogen. Bei kleinen Teilnehmergruppen können einzelne Einschätzungen unter Umständen einer Person zugeordnet werden.";

/**
 * Mindestgröße, falls später echte anonyme Gruppenaggregate angeboten werden.
 * Bis zur fachlichen Freigabe nur als Konstante hinterlegt, nicht erzwungen.
 */
export const MIN_GROUP_SIZE_FOR_AGGREGATE = 3;

// ── Vergleichsdaten ─────────────────────────────────────────────────────────

export type Perspective = {
  /** Einzelnes Assessment. */
  assessmentId: string;
  role: RespondentRole;
  answers: Answers;
};

/** Eine Rolle, zu einem Mittelwert je Dimension zusammengefasst. */
export type PerspectiveGroup = {
  role: RespondentRole;
  label: string;
  participants: number;
  scores: DimensionScore[];
};

function averageLevel(score: number): DimensionScore["level"] {
  if (score >= 75) return "stable";
  if (score >= 50) return "observe";
  if (score >= 25) return "develop";
  return "elevated";
}

/**
 * Fasst die Perspektiven je Rolle zusammen. Unvollständige Assessments werden
 * übersprungen, damit ein Abbruch die Gruppenwerte nicht verzerrt.
 */
export function groupByRole(perspectives: Perspective[]): PerspectiveGroup[] {
  const byRole = new Map<RespondentRole, Answers[]>();
  for (const entry of perspectives) {
    const list = byRole.get(entry.role) ?? [];
    list.push(entry.answers);
    byRole.set(entry.role, list);
  }

  const groups: PerspectiveGroup[] = [];
  for (const role of RESPONDENT_ROLES) {
    const answerSets = byRole.get(role);
    if (!answerSets || answerSets.length === 0) continue;

    const scores: DimensionScore[] = [];
    for (const dimension of DIMENSION_IDS) {
      const values = answerSets
        .map((answers) => dimensionScore(dimension, answers))
        .filter((value): value is number => value !== null);
      if (values.length === 0) continue;
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      scores.push({ dimension, score: mean, level: averageLevel(mean) });
    }
    if (scores.length === DIMENSION_IDS.length) {
      groups.push({
        role,
        label: ROLE_SHORT_LABELS[role],
        participants: answerSets.length,
        scores,
      });
    }
  }
  return groups;
}

// ── Ebene A: Dimensionsvergleich ────────────────────────────────────────────

export type DimensionDifference = {
  dimension: DimensionId;
  /** Wert je Rolle, Schlüssel ist die Rolle. */
  byRole: Partial<Record<RespondentRole, number>>;
  /** Größter Abstand zwischen zwei beteiligten Rollen. */
  spread: number;
};

export function compareDimensions(
  groups: PerspectiveGroup[]
): DimensionDifference[] {
  return DIMENSION_IDS.map((dimension) => {
    const byRole: Partial<Record<RespondentRole, number>> = {};
    const values: number[] = [];
    for (const group of groups) {
      const entry = group.scores.find((s) => s.dimension === dimension);
      if (!entry) continue;
      byRole[group.role] = entry.score;
      values.push(entry.score);
    }
    const spread =
      values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
    return { dimension, byRole, spread };
  });
}

// ── Ebene B: Itemvergleich ──────────────────────────────────────────────────

export type ItemDifference = {
  itemId: string;
  dimension: DimensionId;
  /** Mittelwert der Rohantwort je Rolle, Skala 1 bis 5. */
  byRole: Partial<Record<RespondentRole, number>>;
  /** Größter Abstand zwischen zwei beteiligten Rollen, 0 bis 4. */
  spread: number;
};

export function compareItems(
  perspectives: Perspective[],
  items: readonly { id: string; dimension: DimensionId }[]
): ItemDifference[] {
  const byRole = new Map<RespondentRole, Answers[]>();
  for (const entry of perspectives) {
    const list = byRole.get(entry.role) ?? [];
    list.push(entry.answers);
    byRole.set(entry.role, list);
  }

  return items.map((item) => {
    const perRole: Partial<Record<RespondentRole, number>> = {};
    const values: number[] = [];
    for (const [role, answerSets] of byRole) {
      const raw = answerSets
        .map((answers) => answers[item.id])
        .filter((value): value is NonNullable<typeof value> => value !== undefined);
      if (raw.length === 0) continue;
      const mean = raw.reduce((sum, value) => sum + value, 0) / raw.length;
      perRole[role] = mean;
      values.push(mean);
    }
    const spread =
      values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
    return { itemId: item.id, dimension: item.dimension, byRole: perRole, spread };
  });
}

// ── Sprachregelung ──────────────────────────────────────────────────────────

/**
 * Aus einer Differenz darf NICHT abgeleitet werden, wer richtig liegt. Weder
 * „der Inhaber überschätzt seine Führungskräfte“ noch die Umkehrung. Welche
 * Perspektive zutrifft, weiß das Instrument nicht.
 *
 * Zulässig ist ausschließlich die Feststellung, dass sich die Einschätzungen
 * unterscheiden, gefolgt von einer Gesprächsfrage.
 */
export const DIFFERENCE_STATEMENT =
  "Die Einschätzungen unterscheiden sich in diesem Bereich deutlich.";

/**
 * Darstellungsstufen für Differenzen. Ausdrücklich HEURISTISCH: keine
 * empirisch geprüften Grenzwerte, sondern eine Hilfe für die Darstellung. Die
 * endgültigen Werte werden fachlich festgelegt, bevor der Vergleich
 * freigeschaltet wird.
 */
export const HEURISTIC_SPREAD_BANDS = {
  similar: 12.5,
  noticeable: 25,
} as const;

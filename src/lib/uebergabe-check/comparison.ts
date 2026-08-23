// src/lib/uebergabe-check/comparison.ts
//
// Perspektivvergleich: Rollenmodell, Aggregation und Abweichungslogik.
// Quelle: Fachliche Spezifikation Perspektivvergleich, Abschnitte 4 bis 9.
//
// ═══════════════════════════════════════════════════════════════════════════
//  GRUNDREGELN, die nicht versehentlich aufgeweicht werden dürfen
//
//  • KEIN Gesamtscore, auch nicht über Rollen hinweg.
//  • Eine Abweichung ist KEINE Bewertung darüber, wer recht hat. Kein Text
//    darf behaupten, eine Perspektive sei zutreffender, jemand überschätze
//    oder unterschätze etwas, oder es liege ein „Wahrnehmungsproblem“ vor.
//  • Die Schwellenwerte sind heuristische Darstellungsregeln zur Auswahl der
//    Vergleichspunkte, keine empirisch validierten Cut-offs. Sie dürfen nach
//    außen nicht als validiert kommuniziert werden.
//  • Keine Ursachendiagnose aus einer Differenz ableiten.
//  • Keine Anonymität behaupten. Bei kleinen Gruppen ist eine Einzelantwort
//    faktisch zuordenbar, siehe SMALL_GROUP_NOTE.
// ═══════════════════════════════════════════════════════════════════════════

import {
  ITEMS,
  itemById,
  type Answers,
  type DimensionId,
  type ItemRole,
  type LikertValue,
} from "./items";
import { DIMENSION_QUESTIONS } from "./report-blocks";
import { dimensionScore, type DimensionScore } from "./scoring";

// ── Rollen ──────────────────────────────────────────────────────────────────

export type RespondentRole = ItemRole;

export const RESPONDENT_ROLES: readonly {
  id: RespondentRole;
  /** Bezeichnung bei genau einer Person dieser Rolle. */
  singular: string;
  /** Bezeichnung bei mehreren Personen dieser Rolle. */
  plural: string;
  /** Für die Auswahl beim Einladen. */
  description: string;
}[] = [
  {
    id: "owner",
    singular: "Inhaber/Geschäftsführung",
    plural: "Inhaber/Geschäftsführung",
    description: "Führt das Unternehmen und plant die Übergabe.",
  },
  {
    id: "leader",
    singular: "Perspektive Führungskraft",
    plural: "Perspektive Führungsebene",
    description: "Trägt Führungsverantwortung für einen Bereich oder ein Team.",
  },
  {
    id: "key_person",
    singular: "Perspektive Schlüsselperson",
    plural: "Perspektive Schlüsselpersonen",
    description:
      "Trägt geschäftskritisches Wissen, ohne formale Führungsverantwortung.",
  },
];

export function roleMeta(role: RespondentRole) {
  return RESPONDENT_ROLES.find((entry) => entry.id === role) ?? RESPONDENT_ROLES[0];
}

/**
 * Bezeichnung einer Rollengruppe.
 *
 * Spezifikation Abschnitt 9: Antwortet nur eine einzige Führungskraft, ist das
 * ausdrücklich NICHT „die Führungsebene“. Von einer zusammengefassten
 * Perspektive darf erst ab zwei Teilnehmern gesprochen werden.
 */
export function roleLabel(role: RespondentRole, participants: number): string {
  const meta = roleMeta(role);
  return participants > 1 ? meta.plural : meta.singular;
}

// ── Hinweise ────────────────────────────────────────────────────────────────

export const SMALL_GROUP_NOTE =
  "Bei kleinen Teilnehmergruppen können Einschätzungen trotz zusammengefasster Darstellung unter Umständen einzelnen Personen zugeordnet werden. Bitte berücksichtigen Sie dies bei der Auswahl der Teilnehmer.";

export const PARTICIPANT_INTRO =
  "Sie wurden eingeladen, die organisationale Übergabefähigkeit des Unternehmens aus Ihrer eigenen Perspektive einzuschätzen.";

export const PARTICIPANT_INTRO_DETAIL =
  "Es geht nicht darum, die Einschätzung anderer Personen zu bestätigen. Unterschiedliche Wahrnehmungen sind ausdrücklich möglich und können wertvolle Hinweise für die weitere Vorbereitung einer Übergabe geben.";

// ── Abweichungsbänder ───────────────────────────────────────────────────────

export type SpreadBand = "aligned" | "differing" | "distinct";

/**
 * Heuristische Orientierungswerte auf der 0-bis-100-Skala, Spezifikation
 * Abschnitt 5. Ausdrücklich nicht empirisch validiert: sie dienen allein der
 * Auswahl und Darstellung relevanter Vergleichspunkte.
 */
export const SPREAD_BANDS: Record<
  SpreadBand,
  { minSpread: number; label: string; text: string }
> = {
  aligned: {
    minSpread: 0,
    label: "Weitgehend ähnliche Einschätzung",
    text: "In diesem Bereich liegen die Einschätzungen nah beieinander. Für eine Übergabe ist das eine gute Ausgangslage, weil hier kein zusätzlicher Klärungsbedarf zwischen den Perspektiven entsteht.",
  },
  differing: {
    minSpread: 10,
    label: "Unterschiedliche Einschätzung",
    text: "In dieser Dimension unterscheiden sich die Einschätzungen erkennbar. Das bedeutet nicht, dass eine Perspektive zutreffender ist. Für die Vorbereitung einer Übergabe kann es jedoch hilfreich sein zu klären, wodurch die unterschiedlichen Wahrnehmungen entstehen.",
  },
  distinct: {
    minSpread: 25,
    label: "Deutlich unterschiedliche Einschätzung",
    text: "In dieser Dimension liegen die Einschätzungen erkennbar auseinander. Für die Vorbereitung einer Übergabe kann es hilfreich sein zu klären, wodurch die unterschiedlichen Wahrnehmungen entstehen und welche davon für die konkrete Übergabesituation relevant sind.",
  },
};

export function spreadBand(spread: number): SpreadBand {
  if (spread >= SPREAD_BANDS.distinct.minSpread) return "distinct";
  if (spread >= SPREAD_BANDS.differing.minSpread) return "differing";
  return "aligned";
}

export const HEURISTIC_DISCLOSURE =
  "Die Einteilung in ähnliche und unterschiedliche Einschätzungen folgt festen Orientierungswerten. Sie dient der Auswahl der Vergleichspunkte und ist kein validierter Grenzwert.";

// ── Eingabedaten ────────────────────────────────────────────────────────────

export type Participation = {
  /** Assessment-ID, dient nur der internen Zuordnung. */
  id: string;
  role: RespondentRole;
  answers: Answers;
};

export type RoleProfile = {
  role: RespondentRole;
  /** Wie viele Personen dieser Rolle geantwortet haben. */
  participants: number;
  /** Bezeichnung, abhängig von der Gruppengröße. */
  label: string;
  /** Mittelwert je Dimension, 0 bis 100. */
  scores: DimensionScore[];
  /** Mittelwert der Rohantwort je Item, 1 bis 5. */
  itemMeans: Record<string, number>;
};

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Fasst die Teilnehmer je Rolle zusammen. Rollen ohne Teilnehmer entfallen.
 * Reihenfolge folgt RESPONDENT_ROLES, damit die Inhaberperspektive im
 * Diagramm immer zuerst liegt.
 */
export function buildRoleProfiles(entries: Participation[]): RoleProfile[] {
  const profiles: RoleProfile[] = [];

  for (const { id: role } of RESPONDENT_ROLES) {
    const group = entries.filter((entry) => entry.role === role);
    if (group.length === 0) continue;

    // Dimensionswert je Teilnehmer, dann Mittelwert. Bewusst nicht der
    // Mittelwert der Rohantworten: das Scoring gehört vor die Aggregation,
    // sonst wäre die Polung nicht mehr sauber angewendet.
    const scores = ([1, 2, 3, 4, 5, 6] as DimensionId[]).map((dimension) => {
      const perParticipant = group
        .map((entry) => dimensionScore(dimension, entry.answers))
        .filter((value): value is number => value !== null);
      const value = perParticipant.length > 0 ? mean(perParticipant) : 0;
      return { dimension, score: value, level: levelOf(value) };
    });

    const itemMeans: Record<string, number> = {};
    for (const item of ITEMS) {
      const values = group
        .map((entry) => entry.answers[item.id])
        .filter((value): value is LikertValue => value !== undefined);
      if (values.length > 0) itemMeans[item.id] = mean(values);
    }

    profiles.push({
      role,
      participants: group.length,
      label: roleLabel(role, group.length),
      scores,
      itemMeans,
    });
  }

  return profiles;
}

/** Reifegradstufe, hier nur für die Farbgebung im Diagramm. */
function levelOf(score: number): DimensionScore["level"] {
  if (score >= 75) return "stable";
  if (score >= 50) return "observe";
  if (score >= 25) return "develop";
  return "elevated";
}

// ── Dimensionsvergleich ─────────────────────────────────────────────────────

export type DimensionComparison = {
  dimension: DimensionId;
  /** Wert je Rolle, gleiche Reihenfolge wie die übergebenen Profile. */
  values: { role: RespondentRole; label: string; score: number }[];
  /** Größter Abstand zwischen zwei Rollen, 0 bis 100. */
  spread: number;
  band: SpreadBand;
};

export function compareDimensions(
  profiles: RoleProfile[]
): DimensionComparison[] {
  return ([1, 2, 3, 4, 5, 6] as DimensionId[]).map((dimension) => {
    const values = profiles.map((profile) => ({
      role: profile.role,
      label: profile.label,
      score:
        profile.scores.find((entry) => entry.dimension === dimension)?.score ?? 0,
    }));
    const numbers = values.map((entry) => entry.score);
    const spread = numbers.length > 1 ? Math.max(...numbers) - Math.min(...numbers) : 0;
    return { dimension, values, spread, band: spreadBand(spread) };
  });
}

/** Die Dimensionen mit der höchsten Übereinstimmung, absteigend. */
export function alignedDimensions(
  comparisons: DimensionComparison[],
  limit = 3
): DimensionComparison[] {
  return comparisons
    .filter((entry) => entry.band === "aligned")
    .sort((a, b) => a.spread - b.spread || a.dimension - b.dimension)
    .slice(0, limit);
}

/** Die Dimensionen mit den größten Abweichungen, absteigend. */
export function divergentDimensions(
  comparisons: DimensionComparison[],
  limit = 3
): DimensionComparison[] {
  return comparisons
    .filter((entry) => entry.band !== "aligned")
    .sort((a, b) => b.spread - a.spread || a.dimension - b.dimension)
    .slice(0, limit);
}

// ── Itemvergleich ───────────────────────────────────────────────────────────

export type ItemComparison = {
  itemId: string;
  dimension: DimensionId;
  /** Wortlaut in der Inhaberfassung, als gemeinsame Bezugsformulierung. */
  statement: string;
  /** Rohmittelwerte 1 bis 5 je Rolle. */
  values: { role: RespondentRole; label: string; value: number }[];
  /** Abstand auf der 0-bis-100-Skala, damit dieselben Bänder gelten. */
  spread: number;
  question: string;
};

/**
 * Offene Klärungsfragen zu einzelnen Items.
 *
 * NUR TEILWEISE BEFÜLLT. Formulierungen sind Modellinhalt und werden nicht aus
 * der Programmierung heraus erfunden. Wo nichts hinterlegt ist, greift die
 * Dimensionsfrage aus report-blocks.ts. Das funktioniert, ist aber weniger
 * konkret als eine eigens formulierte Frage.
 */
const ITEM_COMPARISON_QUESTIONS: Record<string, string> = {
  "3.1":
    "Bei welchen Entscheidungen erleben beide Seiten den Handlungsspielraum unterschiedlich, und woran zeigt sich das im Alltag?",
};

/**
 * Die größten Itemabweichungen innerhalb der übergebenen Dimensionen.
 *
 * Spezifikation Abschnitt 6 und 7: nicht alle 24 Differenzen zeigen, sondern
 * die drei bis fünf relevantesten. Sonst wird die Auswertung unlesbar.
 */
export function compareItems(
  profiles: RoleProfile[],
  dimensions: DimensionId[],
  limit = 4
): ItemComparison[] {
  if (profiles.length < 2) return [];

  const results: ItemComparison[] = [];

  for (const item of ITEMS) {
    if (!dimensions.includes(item.dimension)) continue;

    const values = profiles
      .filter((profile) => profile.itemMeans[item.id] !== undefined)
      .map((profile) => ({
        role: profile.role,
        label: profile.label,
        value: profile.itemMeans[item.id],
      }));
    if (values.length < 2) continue;

    // Abstand auf der Punkteskala, damit dieselben Bänder gelten wie bei den
    // Dimensionen. Der Betrag ist unabhängig von der Polung: ein Likert-Schritt
    // entspricht 25 Punkten, egal in welche Richtung das Item gepolt ist.
    const raw = values.map((entry) => entry.value);
    const spread = (Math.max(...raw) - Math.min(...raw)) * 25;

    results.push({
      itemId: item.id,
      dimension: item.dimension,
      statement: item.text,
      values,
      spread,
      question:
        ITEM_COMPARISON_QUESTIONS[item.id] ?? DIMENSION_QUESTIONS[item.dimension],
    });
  }

  return results
    .filter((entry) => entry.spread >= SPREAD_BANDS.differing.minSpread)
    .sort((a, b) => b.spread - a.spread || a.itemId.localeCompare(b.itemId))
    .slice(0, limit);
}

// ── Gesprächsfragen ─────────────────────────────────────────────────────────

/**
 * Fragen für das gemeinsame Gespräch: zuerst die Fragen zu den auffälligen
 * Items, danach mit Dimensionsfragen auffüllen. Duplikate entfallen.
 */
export function buildComparisonQuestions(
  items: ItemComparison[],
  dimensions: DimensionComparison[],
  limit = 5
): string[] {
  const questions: string[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (questions.length >= limit) break;
    if (seen.has(item.question)) continue;
    seen.add(item.question);
    questions.push(item.question);
  }

  for (const entry of dimensions) {
    if (questions.length >= limit) break;
    const question = DIMENSION_QUESTIONS[entry.dimension];
    if (seen.has(question)) continue;
    seen.add(question);
    questions.push(question);
  }

  return questions;
}

// ── Gesamtauswertung ────────────────────────────────────────────────────────

export type ComparisonResult = {
  profiles: RoleProfile[];
  dimensions: DimensionComparison[];
  aligned: DimensionComparison[];
  divergent: DimensionComparison[];
  items: ItemComparison[];
  questions: string[];
  /** Mindestens zwei unterschiedliche Rollen liegen vor. */
  ready: boolean;
  totalParticipants: number;
};

export function buildComparison(entries: Participation[]): ComparisonResult {
  const profiles = buildRoleProfiles(entries);
  const dimensions = compareDimensions(profiles);
  const aligned = alignedDimensions(dimensions);
  const divergent = divergentDimensions(dimensions);
  const items = compareItems(
    profiles,
    divergent.map((entry) => entry.dimension)
  );

  return {
    profiles,
    dimensions,
    aligned,
    divergent,
    items,
    questions: buildComparisonQuestions(items, divergent),
    ready: profiles.length >= 2,
    totalParticipants: entries.length,
  };
}

/** Deutsche Zahlformatierung, eine Nachkommastelle. */
export function formatMean(value: number): string {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function itemDimension(itemId: string): DimensionId | undefined {
  return itemById(itemId)?.dimension;
}

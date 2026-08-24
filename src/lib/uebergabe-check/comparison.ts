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
  LIKERT_SCALE,
  itemById,
  type Answers,
  type DimensionId,
  type ItemRole,
  type LikertValue,
  type Polarity,
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
    plural: "Perspektive Führungskräfte",
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
  // Die Gruppengröße gehört sichtbar dazu. „Perspektive Führungskräfte“ ohne
  // Angabe lässt offen, ob dahinter zwei oder zwölf Personen stehen, und das
  // ändert die Aussagekraft erheblich.
  return participants > 1 ? `${meta.plural} (n=${participants})` : meta.singular;
}

// ── Hinweise ────────────────────────────────────────────────────────────────

export const SMALL_GROUP_NOTE =
  "Bei kleinen Teilnehmergruppen können Einschätzungen trotz zusammengefasster Darstellung unter Umständen einzelnen Personen zugeordnet werden. Bitte berücksichtigen Sie dies bei der Auswahl der Teilnehmer.";

export const PARTICIPANT_INTRO =
  "Sie wurden eingeladen, die organisationale Übergabefähigkeit des Unternehmens aus Ihrer eigenen Perspektive einzuschätzen.";

export const PARTICIPANT_INTRO_DETAIL =
  "Es geht nicht darum, die Einschätzung anderer Personen zu bestätigen. Unterschiedliche Wahrnehmungen sind ausdrücklich möglich und können wertvolle Hinweise für die weitere Vorbereitung einer Übergabe geben.";

/**
 * Steht VOR der Teilnahme, nicht danach.
 *
 * Ohne diesen Hinweis füllt jemand 24 Aussagen aus und merkt erst hinterher,
 * dass die Auswertung an die Person zurückläuft, die den Vergleich angelegt
 * hat. Das wäre kein fairer Umgang und würde beim nächsten Mal ehrliche
 * Antworten kosten.
 */
export const PARTICIPANT_TRANSPARENCY_TITLE = "Hinweis zum Perspektivvergleich";

export const PARTICIPANT_TRANSPARENCY =
  "Ihre Antworten werden dem Perspektivvergleich zugeordnet und fließen in die Vergleichsauswertung ein, auf die der Initiator des Vergleichs Zugriff erhält. Bei kleinen Teilnehmergruppen kann Ihre Einschätzung unter Umständen Ihrer Person zugeordnet werden.";

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

/**
 * Beschriftung eines Rohwerts auf der Antwortskala.
 *
 * Ohne sie steht im Itemvergleich nur „5,0 / 5“, und das liest sich intuitiv
 * als „besser“. Bei einem invers gepolten Item bedeutet hohe Zustimmung aber
 * eine stärkere Abhängigkeit. Die Skalenbeschriftung ist wertfrei und löst
 * genau dieses Missverständnis.
 *
 * Bei Mittelwerten mehrerer Personen liegt der Wert selten genau auf einer
 * Stufe. Dann wird die nächstgelegene Stufe genannt und als Näherung
 * gekennzeichnet, statt eine Genauigkeit zu behaupten, die es nicht gibt.
 */
export function scaleLabel(value: number): { text: string; approximate: boolean } {
  const nearest = Math.min(5, Math.max(1, Math.round(value)));
  const entry = LIKERT_SCALE.find((step) => step.value === nearest);
  return {
    text: entry?.label ?? "",
    approximate: Math.abs(value - nearest) > 0.05,
  };
}

export type ItemComparison = {
  itemId: string;
  dimension: DimensionId;
  /** Kurzbezeichnung des Sachverhalts, Überschrift des Blocks. */
  topic: string;
  /** Wortlaut in der Inhaberfassung, als gemeinsame Bezugsformulierung. */
  statement: string;
  /**
   * Bei „inverse“ bedeutet hohe Zustimmung eine stärkere Abhängigkeit. Die
   * Darstellung weist darauf hin.
   */
  polarity: Polarity;
  /** Rohmittelwerte 1 bis 5 je Rolle. */
  values: { role: RespondentRole; label: string; value: number }[];
  /** Abstand auf der 0-bis-100-Skala, damit dieselben Bänder gelten. */
  spread: number;
  question: string;
};

/** Höchstens fünf Klärungsfragen, sonst ist die Auswertung nicht besprechbar. */
export const MAX_ITEM_COMPARISONS = 5;

/**
 * Höchstens zwei Fragen aus derselben Dimension. Sonst dreht sich das ganze
 * Gespräch um einen einzigen Bereich, obwohl die Abweichungen breiter liegen.
 */
export const MAX_ITEMS_PER_DIMENSION = 2;

/**
 * Die größten Itemabweichungen innerhalb der übergebenen Dimensionen.
 *
 * Spezifikation Abschnitt 6 und 7: nicht alle 24 Differenzen zeigen, sondern
 * die relevantesten, priorisiert nach der größten Abweichung.
 */
export function compareItems(
  profiles: RoleProfile[],
  dimensions: DimensionId[],
  limit = MAX_ITEM_COMPARISONS
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
      topic: item.topic,
      statement: item.text,
      polarity: item.polarity,
      values,
      spread,
      question: item.clarificationQuestion,
    });
  }

  // Nach Abweichung priorisieren, dann je Dimension deckeln.
  const ranked = results
    .filter((entry) => entry.spread >= SPREAD_BANDS.differing.minSpread)
    .sort((a, b) => b.spread - a.spread || a.itemId.localeCompare(b.itemId));

  const perDimension = new Map<DimensionId, number>();
  const selected: ItemComparison[] = [];
  for (const entry of ranked) {
    if (selected.length >= limit) break;
    const used = perDimension.get(entry.dimension) ?? 0;
    if (used >= MAX_ITEMS_PER_DIMENSION) continue;
    perDimension.set(entry.dimension, used + 1);
    selected.push(entry);
  }
  return selected;
}

// ── Gesprächsfragen ─────────────────────────────────────────────────────────

/**
 * Steht bei invers gepolten Items unter den Werten. Ohne diesen Satz ist der
 * Itemvergleich die einzige Stelle im ganzen Check, an der ein hoher Wert
 * intuitiv falsch gelesen werden kann.
 */
export const INVERSE_ITEM_NOTE =
  "Bei dieser Aussage bedeutet eine höhere Zustimmung eine stärkere wahrgenommene Abhängigkeit.";

export const CLARIFICATION_INTRO =
  "Ziel der Klärung ist nicht festzustellen, wer richtig liegt, sondern zu verstehen, welche unterschiedlichen Erfahrungen oder Handlungsspielräume hinter den Einschätzungen stehen.";

/**
 * Rückfallebene, falls eine Dimension auffällt, ohne dass ein einzelnes Item
 * die Schwelle erreicht. Dann steht wenigstens die Dimensionsfrage zur
 * Verfügung, statt gar keine Gesprächsgrundlage.
 */
export function fallbackQuestions(
  dimensions: DimensionComparison[],
  limit = MAX_ITEM_COMPARISONS
): string[] {
  return dimensions
    .slice(0, limit)
    .map((entry) => DIMENSION_QUESTIONS[entry.dimension]);
}

// ── Gesamtauswertung ────────────────────────────────────────────────────────

export type ComparisonResult = {
  profiles: RoleProfile[];
  dimensions: DimensionComparison[];
  aligned: DimensionComparison[];
  divergent: DimensionComparison[];
  items: ItemComparison[];
  /** Nur gefüllt, wenn keine einzelne Itemabweichung die Schwelle erreicht. */
  fallback: string[];
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
    fallback: items.length === 0 ? fallbackQuestions(divergent) : [],
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

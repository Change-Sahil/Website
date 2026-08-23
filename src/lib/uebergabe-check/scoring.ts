// src/lib/uebergabe-check/scoring.ts
//
// Scoring- und Ergebnislogik.
// Quelle: Fachliche Spezifikation Perspektivvergleich, Abschnitt 4.
//
// Reine Funktionen, identisch nutzbar im Browser (für die sofortige
// Ergebnisanzeige) und in der API-Route (für den gespeicherten Datensatz).
// Es gibt bewusst nur diese eine Scoring-Implementierung: eine zweite Tabelle
// mit Polungen an anderer Stelle wäre genau die Altlast, die auseinanderläuft.

import {
  DIMENSION_IDS,
  ITEMS,
  type Answers,
  type DimensionId,
  type Item,
  type LikertValue,
} from "./items";
import { assertInstrumentIntegrity } from "./self-check";

export type MaturityLevel = "stable" | "observe" | "develop" | "elevated";

export type DimensionScore = {
  dimension: DimensionId;
  /** 0 bis 100, Vielfache von 6,25 */
  score: number;
  level: MaturityLevel;
};

/** Scores aller sechs Dimensionen, Schlüssel = Dimensionsnummer als String. */
export type Scores = Record<string, number>;

/**
 * Item-Transformation (Spec 2.1): die 5-stufige Likert-Antwort wird auf
 * 0 bis 100 Punkte abgebildet. Bei inversen Items ist die Skala gespiegelt.
 */
export function transformItem(item: Item, value: LikertValue): number {
  return item.polarity === "positive" ? (value - 1) * 25 : (5 - value) * 25;
}

/**
 * Dimensionaler Score (Spec 2.2): ungewichteter Mittelwert der vier
 * transformierten Item-Punktwerte.
 *
 * Gibt null zurück, solange nicht alle vier Items der Dimension beantwortet
 * sind. Ein Teil-Mittelwert wäre nicht interpretierbar.
 */
export function dimensionScore(
  dimension: DimensionId,
  answers: Answers
): number | null {
  const items = ITEMS.filter((item) => item.dimension === dimension);
  let sum = 0;
  for (const item of items) {
    const value = answers[item.id];
    if (value === undefined) return null;
    sum += transformItem(item, value);
  }
  return sum / items.length;
}

/**
 * Heuristische Reifegradstufen (Spec 2.3).
 * 75 bis 100 gut · 50 bis 74 überwiegend · 25 bis 49 Entwicklungsbedarf ·
 * 0 bis 24 deutlicher Entwicklungsbedarf.
 *
 * Diese Grenzen sind bewusst keine empirisch validierten Cut-off-Werte
 * (Spec 2.4). Sie strukturieren die Rückmeldung, sie klassifizieren kein
 * Unternehmen.
 */
export function maturityLevel(score: number): MaturityLevel {
  if (score >= 75) return "stable";
  if (score >= 50) return "observe";
  if (score >= 25) return "develop";
  return "elevated";
}

/**
 * Die Strukturprüfung des Instruments läuft einmal je Laufzeit, beim ersten
 * Scoring.
 *
 * self-check.ts liest FLAG_DEFINITIONS aus dieser Datei, es besteht also ein
 * Importzyklus. Er ist unkritisch, weil der Aufruf erst zur Laufzeit erfolgt
 * und beide Module dann vollständig geladen sind. Auf Modulebene aufgerufen
 * wäre er es nicht.
 */
let integrityChecked = false;
function runIntegrityCheckOnce(): void {
  if (integrityChecked) return;
  integrityChecked = true;
  assertInstrumentIntegrity();
}

/**
 * Berechnet alle sechs Dimensionen. Wirft, wenn der Fragebogen unvollständig
 * ist. Der Aufrufer muss vorher mit isComplete() prüfen.
 *
 * Bewusst KEIN aggregierter Gesamtscore (Spec 2.3): ein Mittelwert über alle
 * 24 Items würde schwere Einzelrisiken wegmitteln.
 */
export function computeScores(answers: Answers): DimensionScore[] {
  runIntegrityCheckOnce();
  return DIMENSION_IDS.map((dimension) => {
    const score = dimensionScore(dimension, answers);
    if (score === null) {
      throw new Error(`Dimension ${dimension} ist unvollständig beantwortet.`);
    }
    return { dimension, score, level: maturityLevel(score) };
  });
}

/** Flaches Score-Objekt für die Persistenz: { "1": 75, "2": 50, … } */
export function scoresToRecord(dimensionScores: DimensionScore[]): Scores {
  const record: Scores = {};
  for (const { dimension, score } of dimensionScores) {
    record[String(dimension)] = score;
  }
  return record;
}

/**
 * Anzeigeformat für Scores. Die Werte liegen auf einem 6,25er-Raster
 * (0 · 6,25 · 12,5 … 100), deshalb genügt eine Nachkommastelle. Gespeichert
 * wird immer der exakte Wert, gerundet wird ausschließlich für die Ausgabe.
 *
 * Die Rundung kann keine Reifegradstufe verfälschen: kein Rasterwert liegt
 * näher als 6,25 an einer Grenze (25/50/75).
 */
const SCORE_FORMAT = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1,
});

export function formatScore(score: number): string {
  return SCORE_FORMAT.format(score);
}

export function isComplete(answers: Answers): boolean {
  return ITEMS.every((item) => answers[item.id] !== undefined);
}

export function answeredCount(answers: Answers): number {
  return ITEMS.reduce(
    (count, item) => (answers[item.id] !== undefined ? count + 1 : count),
    0
  );
}

// ── Ergebnisebene „Auffällig in Ihren Antworten“ (Spec Teil 3, Abschnitt 3) ──
//
// Diese Hinweise werden im Bericht ANGEZEIGT. Sie machen einzelne Antworten
// sichtbar, die im Dimensionsmittelwert untergehen würden, und sind auch dann
// gültig, wenn der Dimensionsscore insgesamt gut ausfällt.
//
// Wichtige Regeln aus der Spezifikation:
//  • Ein Flag reduziert den Dimensionsscore NICHT. Der Score bildet weiterhin
//    transparent die vier Antworten ab, das Flag ergänzt eine qualitative
//    Information.
//  • Es findet keine automatische Maßnahmenpriorisierung statt. Score-Höhe
//    ist nicht gleich Priorität.
//  • Maßgeblich ist die Rohantwort (1 bis 5), nicht der transformierte Wert.

/**
 * Interne Einstufung. Sie steuert die Reihenfolge der Hinweise und die
 * Innensicht im Beratungsgespräch. Bewusst NICHT als Etikett im Nutzerbericht:
 * die Spezifikation kennzeichnet nur Überschrift, Text, Prüfimpuls und
 * Ansatzpunkt als nutzerseitige Felder.
 */
export type FlagPriority = "kritisch" | "erhoehte_aufmerksamkeit" | "hinweis";

export type FlagDefinition = {
  /** Stabile ID gemäß Spezifikation, wird so auch persistiert. */
  id: string;
  itemId: string;
  dimension: DimensionId;
  /** Rohantworten, die den Hinweis auslösen. */
  trigger: readonly LikertValue[];
  priority: FlagPriority;
  /** Nutzerüberschrift */
  heading: string;
  /** Nutzertext */
  text: string;
  /** Prüfimpuls */
  check: string;
  /** Möglicher Ansatzpunkt */
  approach: string;
};

export const FLAG_DEFINITIONS: readonly FlagDefinition[] = [
  {
    id: "D1_I1_OPERATIVE_DECISION",
    itemId: "1.1",
    dimension: 1,
    trigger: [4, 5],
    priority: "hinweis",
    heading: "Entscheidungsbindung im Alltagsgeschäft",
    text: "Bei unvorhergesehenen operativen Störungen im Tagesgeschäft wenden sich die Mitarbeiter im Regelfall direkt an Sie, um eine Entscheidung zu erhalten. Ihre Antwort deutet darauf hin, dass die Alltagssteuerung stark an Ihre persönliche Einbindung gekoppelt ist.",
    check: "Prüfen Sie, wie die Handlungskompetenz Ihrer Mitarbeiter bei Störungen im Alltag erhöht werden kann, um Sie im Tagesgeschäft zu entlasten.",
    approach: "Festlegung klarer Entscheidungsspielräume für nachgelagerte Bereiche bei Standardstörungen.",
  },
  {
    id: "D1_I2_CUSTOMER_NEGOTIATION",
    itemId: "1.2",
    dimension: 1,
    trigger: [4, 5],
    priority: "hinweis",
    heading: "Personenbindung wesentlicher Kundenverhandlungen",
    text: "Wichtige Preis-, Konditionen- oder Vertragsverhandlungen werden überwiegend von Ihnen persönlich geführt. Ihre Antwort deutet darauf hin, dass diese Verhandlungsschritte im Regelfall an Ihre Person gebunden sind.",
    check: "Prüfen Sie, wie nachfolgende Mitarbeiter schrittweise an diese Verhandlungen herangeführt werden können, um die langfristige Übertragbarkeit der Kundenbeziehungen zu erproben.",
    approach: "Gemeinsame Verhandlungstermine mit Schlüsselkräften, um Kunden schrittweise an neue Ansprechpartner zu gewöhnen.",
  },
  {
    id: "D1_I3_OWNER_ABSENCE",
    itemId: "1.3",
    dimension: 1,
    trigger: [1, 2],
    priority: "erhoehte_aufmerksamkeit",
    heading: "Operative Verzögerungen bei Inhaberabwesenheit",
    text: "Ein mehrwöchiger Ausfall des Inhabers führt nach Ihrer Einschätzung zu nennenswerten Verzögerungen im operativen Alltagsgeschäft. Ihre Antwort deutet darauf hin, dass die Alltagsabläufe spürbar an Ihre persönliche Präsenz gekoppelt sind.",
    check: "Prüfen Sie, welche konkreten Entscheidungen, Freigaben oder Kundenkontakte bei einer längeren Abwesenheit prioritär verzögert würden.",
    approach: "Schrittweiser Aufbau einer Notfall- oder Stellvertretungsstruktur für Kernentscheidungen.",
  },
  {
    id: "D1_I4_LIMITS_MISSING",
    itemId: "1.4",
    dimension: 1,
    // Item 1.4 ist seit beta-2.0 positiv gepolt und fragt das Vorhandensein
    // der Freigabegrenzen ab. Der Hinweis greift deshalb bei niedrigen Werten.
    trigger: [1, 2],
    priority: "hinweis",
    heading: "Fehlen dezentraler Freigabegrenzen",
    text: "Für finanzielle Freigaben bestehen nach Ihrer Einschätzung keine klar definierten Grenzen, innerhalb derer andere Personen eigenständig entscheiden können. Ihre Antwort deutet darauf hin, dass Routinefreigaben im Alltag von Ihnen persönlich autorisiert werden müssen.",
    check: "Prüfen Sie, ob die Festlegung klarer, betragsbezogener Freigabegrenzen Ihre Mitarbeiter im Alltag entlasten und zu eigenständigem Handeln anregen kann.",
    approach: "Einführung einer einfachen Freigaberichtlinie für Einkäufe oder Rabatte.",
  },
  {
    id: "D2_I1_DEPUTY_MISSING",
    itemId: "2.1",
    dimension: 2,
    trigger: [1, 2],
    priority: "erhoehte_aufmerksamkeit",
    heading: "Fehlende Stellvertretungen bei geschäftskritischen Fachaufgaben",
    text: "Für geschäftskritische Fachaufgaben sind nach Ihrer Einschätzung keine qualifizierten Stellvertretungen vorhanden. Ihre Antwort deutet darauf hin, dass an diesen Fachstellen mögliche personelle Engpässe bestehen.",
    check: "Prüfen Sie, bei welchen spezifischen Fachaufgaben (z. B. IT-Administration oder Betreuung von Kernsystemen) keine Vertretung existiert und wie hoch die Ausfallwahrscheinlichkeit ist.",
    approach: "Erstellung einer Qualifikationsübersicht, um systematisch Doppelbesetzungen vorzubereiten.",
  },
  {
    id: "D2_I3_KEY_PERSON_RISK",
    itemId: "2.3",
    dimension: 2,
    trigger: [4, 5],
    priority: "kritisch",
    heading: "Personelle Abhängigkeit auf Fachebene",
    text: "Die ungeplante Kündigung einer einzelnen Fachkraft könnte nach Ihrer Einschätzung die Leistungsfähigkeit eines geschäftskritischen Bereichs für mehrere Wochen deutlich beeinträchtigen. Ihre Antwort deutet darauf hin, dass in diesem Bereich ein personelles Kopfmonopol vorliegt.",
    check: "Prüfen Sie, inwieweit das geschäftskritische Erfahrungswissen dieser Fachkraft schrittweise im Team geteilt werden kann, um die Abhängigkeit bei personellem Ausfall zu verringern.",
    approach: "Dokumentation von Einzelschritten oder gezielter Wissenstransfer an weitere Wissensträger im Team.",
  },
  {
    id: "D3_I1_BUDGET_AUTONOMY",
    itemId: "3.1",
    dimension: 3,
    trigger: [1, 2],
    priority: "hinweis",
    heading: "Geringe Budget- und Entscheidungsbefugnisse der Führungsebene",
    text: "Führungskräfte verfügen nach Ihrer Einschätzung innerhalb klar definierter Grenzen nicht über eigene Entscheidungs- und Budgetbefugnisse ohne vorherige Freigabe. Ihre Antwort deutet darauf hin, dass nachgelagerte Bereiche im Alltag stark von Ihrer persönlichen Autorisierung abhängig sind.",
    check: "Prüfen Sie, in welchen Bereichen (z. B. kleinere Sachausgaben oder Teambudgets) die Einräumung eigenständiger Befugnisse die Handlungsreife des Managements fördern kann.",
    approach: "Erprobung begrenzter Handlungsbudgets für einzelne Abteilungsleiter.",
  },
  {
    id: "D3_I3_BACK_DELEGATION",
    itemId: "3.3",
    dimension: 3,
    trigger: [4, 5],
    priority: "hinweis",
    heading: "Rückversicherungsverhalten der Führungsebene",
    text: "Führungskräfte binden Sie regelmäßig bei alltäglichen Standardentscheidungen zur Absicherung ein. Ihre Antwort deutet darauf hin, dass Alltagsverantwortung im Betrieb tendenziell nach oben rückdelegiert wird.",
    check: "Prüfen Sie, welche Bedingungen oder klaren Absprachen notwendig sind, damit Ihre Führungskräfte Alltagsentscheidungen eigenständig und vollumfänglich tragen.",
    approach: "Vereinbarung einer klaren CC-Regel zur Reduzierung von informellen Rückversicherungen.",
  },
  {
    id: "D4_I1_DOCUMENTATION_GAP",
    itemId: "4.1",
    dimension: 4,
    trigger: [1, 2],
    priority: "hinweis",
    heading: "Geringer Dokumentationsgrad der Arbeitsabläufe",
    text: "Arbeitsabläufe sind nach Ihrer Einschätzung im Alltag nicht so dokumentiert, dass sich eine neue Fachkraft weitgehend selbstständig darin einarbeiten kann. Ihre Antwort deutet darauf hin, dass für die Einarbeitung eine hohe persönliche Begleitung erforderlich ist.",
    check: "Prüfen Sie, in welchen Bereichen einfache Checklisten oder Dokumentationshilfen die Einarbeitung Dritter wesentlich erleichtern könnten.",
    approach: "Dokumentation von Standardprozessen durch einfache, visuelle Ablaufbeschreibungen.",
  },
  {
    id: "D4_I3_INFORMAL_ROUTINES",
    itemId: "4.3",
    dimension: 4,
    trigger: [4, 5],
    priority: "hinweis",
    heading: "Dominanz informeller Absprachen im Alltag",
    text: "Die tatsächlichen Arbeitsabläufe weichen nach Ihrer Einschätzung im Alltag deutlich von den vorgesehenen Abläufen ab und beruhen stattdessen auf informellen Absprachen. Ihre Antwort deutet darauf hin, dass das Tagesgeschäft über informelle Sonderwege gesteuert wird.",
    check: "Prüfen Sie, inwieweit diese informellen Absprachen die Stabilität und Nachvollziehbarkeit des Systems bei einem Eigentümerwechsel beeinträchtigen könnten.",
    approach: "Anpassung veralteter Vorgaben an die tatsächlich gelebten Alltagsabläufe.",
  },
  {
    id: "D5_I1_OWNER_PREFERENCE",
    itemId: "5.1",
    dimension: 5,
    trigger: [4, 5],
    priority: "erhoehte_aufmerksamkeit",
    heading: "Kulturelle Inhaberkopplung im Arbeitsalltag",
    text: "Mitarbeiter begründen Entscheidungen im Arbeitsalltag häufig mit Ihren persönlichen Präferenzen. Ihre Antwort deutet auf eine starke inhaltliche Ausrichtung des kollektiven Handelns an Ihrer Person hin.",
    check: "Prüfen Sie, wie die Begründung von Entscheidungen im Team schrittweise von Ihrer Person hin zu sachlichen, unternehmensbezogenen Standards verlagert werden kann.",
    approach: "Kommunikation alltäglicher Vorgaben auf Basis einheitlicher Unternehmensziele.",
  },
  {
    id: "D5_I3_ABSENCE_IMPACT",
    itemId: "5.3",
    dimension: 5,
    trigger: [4, 5],
    priority: "erhoehte_aufmerksamkeit",
    heading: "Erhöhte Reibungsverluste bei Inhaberabwesenheit",
    text: "Die Zusammenarbeit und Abstimmung im Unternehmen werden nach Ihrer Einschätzung bei Ihrer längeren Abwesenheit erkennbar schwieriger. Ihre Antwort deutet darauf hin, dass die alltägliche Koordination spürbar an Ihre persönliche Präsenz gekoppelt ist.",
    check: "Prüfen Sie, in welchen operativen Bereichen regelmäßige, selbstständige Abstimmungsrunden der Mitarbeiter die Kooperation bei Abwesenheit stützen könnten.",
    approach: "Etablierung eigenständiger Abstimmungstermine für das Führungsteam.",
  },
  {
    id: "D6_I4_HISTORIC_RIGHTS_BLOCK",
    itemId: "6.4",
    dimension: 6,
    trigger: [4, 5],
    priority: "erhoehte_aufmerksamkeit",
    heading: "Mögliche Reibung bei der Anpassung von Sonderregelungen",
    text: "Veränderungen historisch gewachsener Sonderregelungen führen nach Ihrer Einschätzung häufig zu länger anhaltendem Widerstand. Ihre Antwort deutet darauf hin, dass das Team empfindlich auf die Veränderung gewohnter Sonderregelungen reagiert.",
    check: "Prüfen Sie, welche spezifischen Sonderregelungen oder Sonderrechte im Betrieb bestehen, die vor einer geplanten Übergabe transparent besprochen werden sollten.",
    approach: "Schrittweise Überprüfung und offene Kommunikation einheitlicher Standards im Team.",
  },
];

const PRIORITY_ORDER: Record<FlagPriority, number> = {
  kritisch: 0,
  erhoehte_aufmerksamkeit: 1,
  hinweis: 2,
};

/**
 * Ermittelt die ausgelösten Item-Hinweise, sortiert nach interner Einstufung
 * und danach nach Item-Reihenfolge.
 */
export function computeFlags(answers: Answers): FlagDefinition[] {
  return FLAG_DEFINITIONS.filter((flag) => {
    const value = answers[flag.itemId];
    return value !== undefined && flag.trigger.includes(value);
  }).sort(
    (a, b) =>
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
      a.itemId.localeCompare(b.itemId)
  );
}

/** Nur die IDs, für die Persistenz im Datensatz. */
export function computeFlagIds(answers: Answers): string[] {
  return computeFlags(answers).map((flag) => flag.id);
}

export function flagsForDimension(
  flags: FlagDefinition[],
  dimension: DimensionId
): FlagDefinition[] {
  return flags.filter((flag) => flag.dimension === dimension);
}

export function flagById(id: string): FlagDefinition | undefined {
  return FLAG_DEFINITIONS.find((flag) => flag.id === id);
}

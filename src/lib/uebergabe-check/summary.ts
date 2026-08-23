// src/lib/uebergabe-check/summary.ts
//
// Regelbasierte Profilzusammenfassung des persönlichen Ergebnisberichts.
//
// Aufbau: GENAU DREI Absätze mit fester Überschrift.
//   1. Was bereits trägt
//   2. Wo genaueres Hinsehen lohnt
//   3. Was das für eine Übergabe bedeutet
//
// Die frühere Fassung hatte bis zu fünf Bausteine, darunter eine Einleitung und
// eine Erläuterung der Item-Hinweise. Beides ist entfallen: Der Abschnitt soll
// den Übergang von „Auswertung lesen“ zu „damit arbeiten“ markieren und direkt
// in die Prüffelder führen, statt vorher noch einmal zu erklären.
//
// Methodische Leitplanken, die beim Ändern von Texten gelten:
//  • Die Zusammenfassung führt ausschließlich bereits erhobene Dimensionsstufen
//    zusammen. Sie behauptet keine Ursachen, Dringlichkeiten oder Prioritäten.
//  • Sie muss für jede mögliche Scorekonstellation sachlich zutreffen, auch
//    wenn alle sechs Werte identisch sind.
//  • Formuliert wird über die „betrachteten Voraussetzungen“, nie über
//    „Stärken“ oder „Schwächen“ des Unternehmens.
//  • Jeder der drei Absätze wird immer gefüllt. Ein leerer Absatz mit
//    Überschrift sähe aus wie ein Fehler.

import { dimensionContent } from "./content";
import type { DimensionId } from "./items";
import type { DimensionScore, FlagDefinition } from "./scoring";

/** Ab diesem Wert gilt eine Dimension als gut ausgeprägt. */
const STRONG_THRESHOLD = 75;
/** Unter diesem Wert bietet sich eine genauere Betrachtung an. */
const DEVELOP_THRESHOLD = 50;
/** Unter diesem Wert heißt es „stark“ statt „noch spürbar“ personengebunden. */
const LOW_THRESHOLD = 25;
/** Mehr als zwei Dimensionen je Absatz machen den Satz unlesbar. */
const MAX_NAMED_DIMENSIONS = 2;

export const SUMMARY_TITLE = "Was Sie aus diesem Ergebnis mitnehmen sollten";

export type SummaryBlock = {
  label: string;
  text: string;
};

const LABEL = {
  carries: "Was bereits trägt",
  look: "Wo genaueres Hinsehen lohnt",
  meaning: "Was das für eine Übergabe bedeutet",
} as const;

function joinNames(ids: DimensionId[]): string {
  const names = ids.map((id) => dimensionContent(id).title);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} und ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} sowie ${names[names.length - 1]}`;
}

/** Sortiert absteigend nach Punktwert, bei Gleichstand nach Dimensionsnummer. */
function byScoreDesc(a: DimensionScore, b: DimensionScore): number {
  return b.score - a.score || a.dimension - b.dimension;
}

/** Sortiert aufsteigend nach Punktwert, bei Gleichstand nach Dimensionsnummer. */
function byScoreAsc(a: DimensionScore, b: DimensionScore): number {
  return a.score - b.score || a.dimension - b.dimension;
}

function namesOf(entries: DimensionScore[]): string {
  return joinNames(entries.map((entry) => entry.dimension));
}

/** Absatz 1: Was bereits trägt. */
function buildCarries(scores: DimensionScore[]): string {
  const strong = scores.filter((entry) => entry.score >= STRONG_THRESHOLD);

  if (strong.length === scores.length) {
    return "Über alle sechs Dimensionen hinweg wirkt Ihr Unternehmen bereits weitgehend unabhängig von einzelnen Personen aufgestellt. Für einen inhabergeführten Betrieb ist das eine ungewöhnlich gute Ausgangslage: Ein Nachfolger trifft überall auf Funktionierendes und muss nicht erst etwas aufbauen.";
  }

  if (strong.length > 0) {
    const named = [...strong].sort(byScoreDesc).slice(0, MAX_NAMED_DIMENSIONS);
    const more = strong.length > named.length;
    return `Tragfähig wirkt vor allem ${namesOf(named)}${
      more ? ", daneben weitere Bereiche" : ""
    }. Für eine Übergabe ist das ein realer Vorteil, weil ein Nachfolger hier auf Funktionierendes trifft und nicht erst etwas aufbauen muss.`;
  }

  // Keine Dimension über 75. Dann trägt vergleichsweise das, was am weitesten
  // oben liegt. Bewusst als Vergleich formuliert, nicht als Gütesiegel.
  const best = [...scores].sort(byScoreDesc).slice(0, MAX_NAMED_DIMENSIONS);
  const allMiddle = scores.every((entry) => entry.score >= DEVELOP_THRESHOLD);

  if (allMiddle) {
    return `Über alle sechs Dimensionen hinweg liegt Ihr Profil in einem mittleren Bereich, am weitesten entwickelt wirkt ${namesOf(
      best
    )}. Das spricht für eine Organisation, die im Alltag zuverlässig funktioniert, deren Belastbarkeit sich aber erst zeigt, wenn gewohnte Personen und eingespielte Wege wegfallen.`;
  }

  return `Verglichen mit den übrigen Bereichen steht ${namesOf(
    best
  )} am stabilsten da. Auf dieser Seite trifft ein Nachfolger auf die klarsten Strukturen, auch wenn die Voraussetzungen insgesamt noch nicht durchgängig tragen.`;
}

/** Absatz 2: Wo genaueres Hinsehen lohnt. */
function buildLook(scores: DimensionScore[]): string {
  const develop = scores.filter((entry) => entry.score < DEVELOP_THRESHOLD);

  if (develop.length === scores.length) {
    return "Ihr Profil spricht dafür, dass die Organisation an vielen Stellen noch stark von einzelnen Personen getragen wird. Das ist im inhabergeführten Mittelstand der Normalfall und kein Zeichen schlechter Führung. Für eine Übergabe wird daraus allerdings Arbeit, weil sich persönliche Routinen und Beziehungen nicht zusammen mit dem Eigentum übertragen lassen.";
  }

  if (develop.length > 0) {
    const named = [...develop].sort(byScoreAsc).slice(0, MAX_NAMED_DIMENSIONS);
    const low = named.some((entry) => entry.score < LOW_THRESHOLD);
    const more = develop.length > named.length;
    return `Genauer hinsehen sollten Sie vor allem bei ${namesOf(named)}${
      more ? " und den übrigen Bereichen unterhalb der Mitte" : ""
    }. Die Antworten legen nahe, dass die Organisation dort ${
      low ? "stark" : "noch spürbar"
    } an Personen hängt statt an Regeln, und genau das lässt sich bei einem Wechsel nicht mit übergeben.`;
  }

  // Nichts unter 50. Trotzdem gibt es immer einen schwächsten Bereich, und
  // genau der ist der sinnvolle Ansatzpunkt.
  const weakest = [...scores].sort(byScoreAsc).slice(0, MAX_NAMED_DIMENSIONS);
  return `Keine der sechs Dimensionen fällt deutlich ab. Am ehesten lohnt ein genauerer Blick auf ${namesOf(
    weakest
  )}: Dort verweisen die Antworten noch am stärksten auf einzelne Personen statt auf tragende Regelungen.`;
}

/** Absatz 3: Was das für eine Übergabe bedeutet. */
function buildMeaning(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): string {
  const base =
    "Welche dieser Punkte für Sie tatsächlich Priorität haben, hängt von der Nachfolgeform, dem Zeithorizont und Ihrer künftigen Rolle im Unternehmen ab. Für eine Übergabe dürfte es sich lohnen, zuerst dort anzusetzen, wo eine deutliche Abhängigkeit und ein naher Zeitpunkt zusammenfallen.";

  if (flags.length === 0) return base;

  const allStrong = scores.every((entry) => entry.score >= STRONG_THRESHOLD);
  // Bewusst ohne Anzahl: „fünf Auffälligkeiten“ würde die Hinweise
  // dramatisieren, obwohl sie den Punktwert gar nicht verändern.
  const lead = allStrong
    ? "Auch bei einem insgesamt starken Profil fallen einzelne Antworten auf, die für eine Übergabe bedeutsam sein können. "
    : "Hinzu kommen einzelne Antworten, die unabhängig vom jeweiligen Dimensionswert bedeutsam sein können. ";

  return lead + base;
}

/**
 * Baut die Zusammenfassung als drei beschriftete Absätze. Die Länge ist fix,
 * nur der Inhalt hängt vom Profil ab.
 */
export function buildSummary(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): SummaryBlock[] {
  return [
    { label: LABEL.carries, text: buildCarries(scores) },
    { label: LABEL.look, text: buildLook(scores) },
    { label: LABEL.meaning, text: buildMeaning(scores, flags) },
  ];
}

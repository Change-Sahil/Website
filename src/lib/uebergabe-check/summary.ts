// src/lib/uebergabe-check/summary.ts
//
// Regelbasierte Profilzusammenfassung des persönlichen Ergebnisberichts.
//
// Methodische Leitplanken, die beim Ändern von Texten gelten:
//  • Die Zusammenfassung führt ausschließlich bereits erhobene Dimensionsstufen
//    und vorhandene Item-Hinweise zusammen.
//  • Sie behauptet keine Ursachen, Dringlichkeiten, Prioritäten oder
//    Zusammenhänge zwischen Dimensionen, die das Instrument nicht erhebt.
//  • Sie muss für jede mögliche Scorekonstellation sachlich zutreffen.
//  • Formuliert wird über die „betrachteten Voraussetzungen“, nie über
//    „Stärken“ oder „Schwächen“ des Unternehmens.
//
// Umfang: drei bis fünf Sätze, verteilt auf bis zu vier Absätze.

import { dimensionContent } from "./content";
import type { DimensionId } from "./items";
import type { DimensionScore, FlagDefinition } from "./scoring";

/** Ab diesem Wert gilt eine Dimension als gut ausgeprägt. */
const STRONG_THRESHOLD = 75;
/** Unter diesem Wert bietet sich eine genauere Betrachtung an. */
const DEVELOP_THRESHOLD = 50;
/** Unter diesem Wert heißt es „gering“ statt „nur teilweise“ ausgeprägt. */
const LOW_THRESHOLD = 25;
/** Mehr als drei Dimensionen aufzuzählen macht den Satz unlesbar. */
const MAX_NAMED_DIMENSIONS = 3;

export const SUMMARY_TITLE = "Was Sie aus diesem Ergebnis mitnehmen sollten";

/**
 * Alle Textbausteine an einer Stelle, damit sich Formulierungen ändern lassen,
 * ohne die Regeln anzufassen.
 */
const TEXT = {
  // Bewusst „im direkten Vergleich“ statt „können unterschiedlich ausgeprägt
  // sein“: der Satz muss auch dann elegant sein, wenn alle sechs Werte
  // identisch ausfallen.
  intro:
    "Ihr Übergabeprofil zeigt die Ausprägung der sechs betrachteten Bereiche im direkten Vergleich. Entscheidend ist dabei nicht ein Gesamtwert, sondern der Blick auf die einzelnen Dimensionen und die für Ihre konkrete Übergabesituation relevanten Abhängigkeiten.",

  strongSingle: (name: string) =>
    `Besonders gut ausgeprägt ist in Ihrer Einschätzung der Bereich ${name}.`,
  strongFew: (list: string) =>
    `Besonders gut ausgeprägt sind in Ihrer Einschätzung die Bereiche ${list}.`,
  strongMany: (list: string) =>
    `Mehrere der betrachteten Bereiche sind in Ihrer Einschätzung bereits gut ausgeprägt. Dazu zählen insbesondere ${list}.`,
  strongAll:
    "Die im Schnellcheck betrachteten Voraussetzungen sind in Ihrer Einschätzung über alle sechs Dimensionen hinweg gut ausgeprägt.",

  developSingle: (name: string, low: boolean) =>
    `Eine genauere Betrachtung bietet sich insbesondere bei ${name} an. Die dort betrachteten Voraussetzungen sind in Ihrer Einschätzung bislang ${low ? "gering" : "nur teilweise"} ausgeprägt.`,
  developFew: (list: string, low: boolean) =>
    `Eine genauere Betrachtung bietet sich insbesondere bei ${list} an. Die dort betrachteten Voraussetzungen sind in Ihrer Einschätzung bislang ${low ? "nur teilweise beziehungsweise gering" : "nur teilweise"} ausgeprägt.`,
  developAll:
    "In mehreren Bereichen zeigt Ihr Profil Entwicklungsbedarf im Hinblick auf eine spätere Übergabe. Das bedeutet nicht, dass die heutige Organisation schlecht funktioniert. Vielmehr lohnt sich eine gezielte Betrachtung der bestehenden Abhängigkeiten und ihrer Bedeutung für die geplante Nachfolge.",

  middleAll:
    "Die betrachteten Voraussetzungen sind in Ihrer Einschätzung über die sechs Dimensionen hinweg überwiegend ausgeprägt. Die Einzelwerte liegen dabei in einem Bereich, in dem sich eine differenzierte Betrachtung der jeweiligen Teilaspekte lohnt.",

  itemFindings:
    "Zusätzlich fallen einzelne Antworten auf, die unabhängig vom jeweiligen Dimensionswert für eine Übergabe relevant sein können. Diese Hinweise finden Sie bei den entsprechenden Dimensionen unter „Auffällig in Ihren Antworten“.",
  // Bei durchgehend hohen Werten wäre „zusätzlich fallen Antworten auf“ ein
  // Bruch. Der Satz greift das starke Profil auf und behält den Verweis bei.
  itemFindingsStrongProfile:
    "Auch bei einem insgesamt starken Profil können einzelne Antworten auf Abhängigkeiten hinweisen, die für die konkrete Übergabesituation relevant sind. Diese Hinweise finden Sie bei den entsprechenden Dimensionen unter „Auffällig in Ihren Antworten“.",

  close:
    "Welche dieser Punkte tatsächlich Priorität haben, lässt sich aus dem Schnellcheck allein nicht ableiten. Das hängt unter anderem von der geplanten Nachfolgeform, dem Zeithorizont und der zukünftigen Rolle des heutigen Inhabers ab.",
};

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

/**
 * Baut die Zusammenfassung als Liste von Absätzen.
 *
 * Bausteine:
 *   1. intro                  immer
 *   2. strong_dimensions      wenn mindestens eine Dimension >= 75
 *   3. development_dimensions wenn mindestens eine Dimension < 50
 *   4. item_findings          wenn mindestens ein Item-Hinweis ausgelöst wurde
 *   5. context_close          immer
 *
 * Sonderfälle ersetzen Baustein 2 und 3 durch eine Gesamtaussage:
 *   • alle sechs >= 75   Gesamtformulierung statt Aufzählung
 *   • alle sechs <  50   mittelstandsgerechte Formulierung ohne Defizitlabel
 *   • alle sechs 50–74   eigene neutrale Formulierung
 */
export function buildSummary(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): string[] {
  const strong = scores.filter((entry) => entry.score >= STRONG_THRESHOLD);
  const develop = scores.filter((entry) => entry.score < DEVELOP_THRESHOLD);

  const allStrong = strong.length === scores.length;
  const allDevelop = develop.length === scores.length;
  const allMiddle = strong.length === 0 && develop.length === 0;

  const paragraphs: string[] = [TEXT.intro];

  if (allStrong) {
    paragraphs.push(TEXT.strongAll);
  } else if (allDevelop) {
    paragraphs.push(TEXT.developAll);
  } else if (allMiddle) {
    paragraphs.push(TEXT.middleAll);
  } else {
    if (strong.length > 0) {
      const named = [...strong].sort(byScoreDesc).slice(0, MAX_NAMED_DIMENSIONS);
      const list = joinNames(named.map((entry) => entry.dimension));
      paragraphs.push(
        strong.length === 1
          ? TEXT.strongSingle(list)
          : strong.length > MAX_NAMED_DIMENSIONS
            ? TEXT.strongMany(list)
            : TEXT.strongFew(list)
      );
    }

    if (develop.length > 0) {
      const named = [...develop].sort(byScoreAsc).slice(0, MAX_NAMED_DIMENSIONS);
      const list = joinNames(named.map((entry) => entry.dimension));
      // „gering“ nur, wenn unter den genannten Dimensionen tatsächlich eine
      // in der untersten Stufe liegt.
      const hasLow = named.some((entry) => entry.score < LOW_THRESHOLD);
      paragraphs.push(
        develop.length === 1
          ? TEXT.developSingle(list, hasLow)
          : TEXT.developFew(list, hasLow)
      );
    }
  }

  if (flags.length > 0) {
    // Bewusst ohne Anzahl: „fünf Risiken“ würde die Hinweise dramatisieren.
    paragraphs.push(
      allStrong ? TEXT.itemFindingsStrongProfile : TEXT.itemFindings
    );
  }

  paragraphs.push(TEXT.close);
  return paragraphs;
}

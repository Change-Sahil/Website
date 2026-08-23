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
  // „im direkten Vergleich“ statt „können unterschiedlich ausgeprägt sein“:
  // der Satz muss auch dann tragen, wenn alle sechs Werte identisch ausfallen.
  intro:
    "Ihr Übergabeprofil zeigt die sechs betrachteten Bereiche im direkten Vergleich. Aussagekräftig ist dabei nicht ein Gesamtwert, sondern das Muster: wo Ihr Unternehmen bereits gute Voraussetzungen mitbringt und wo eine Übergabe auf Abhängigkeiten treffen würde.",

  strongSingle: (name: string) =>
    `Besonders tragfähig wirkt ${name}. Für eine Übergabe ist das ein realer Vorteil, weil ein Nachfolger hier auf Funktionierendes trifft und nicht erst etwas aufbauen muss.`,
  strongFew: (list: string) =>
    `Besonders tragfähig wirken ${list}. Für eine Übergabe ist das ein realer Vorteil, weil ein Nachfolger hier auf Funktionierendes trifft und nicht erst etwas aufbauen muss.`,
  strongMany: (list: string) =>
    `Mehrere Bereiche wirken bereits tragfähig, darunter vor allem ${list}. Ein Nachfolger trifft dort auf Funktionierendes und muss nicht erst etwas aufbauen.`,
  strongAll:
    "Über alle sechs Dimensionen hinweg wirkt Ihr Unternehmen bereits weitgehend unabhängig von einzelnen Personen aufgestellt. Das ist für einen inhabergeführten Betrieb eine ungewöhnlich gute Ausgangslage.",

  developSingle: (name: string, low: boolean) =>
    `Genauer hinsehen sollten Sie vor allem bei ${name}. Die Antworten legen nahe, dass die Organisation hier ${low ? "stark" : "noch spürbar"} an Personen hängt statt an Regeln, und genau das lässt sich bei einem Wechsel nicht mit übergeben.`,
  developFew: (list: string, low: boolean) =>
    `Genauer hinsehen sollten Sie vor allem bei ${list}. Die Antworten legen nahe, dass die Organisation dort ${low ? "stark" : "noch spürbar"} an Personen hängt statt an Regeln, und genau das lässt sich bei einem Wechsel nicht mit übergeben.`,
  developAll:
    "Ihr Profil spricht dafür, dass die Organisation an vielen Stellen noch stark von einzelnen Personen getragen wird. Das ist im inhabergeführten Mittelstand der Normalfall und kein Zeichen schlechter Führung. Für eine Übergabe wird daraus allerdings Arbeit, weil sich persönliche Routinen und Beziehungen nicht zusammen mit dem Eigentum übertragen lassen.",

  middleAll:
    "Über alle sechs Dimensionen hinweg liegt Ihr Profil in einem mittleren Bereich. Das spricht für eine Organisation, die im Alltag zuverlässig funktioniert, deren Belastbarkeit sich aber erst zeigt, wenn gewohnte Personen und eingespielte Wege wegfallen.",

  itemFindings:
    "Besonders ins Auge fallen einzelne Antworten, die unabhängig vom jeweiligen Dimensionswert für eine Übergabe bedeutsam sein können. Sie finden sie bei den betreffenden Dimensionen unter „Auffällig in Ihren Antworten“ und gebündelt in den ausgewählten Prüffeldern.",
  // Bei durchgehend hohen Werten wäre „besonders ins Auge fallen“ ein Bruch.
  itemFindingsStrongProfile:
    "Auch bei einem insgesamt starken Profil fallen einzelne Antworten auf, die für eine Übergabe bedeutsam sein können. Sie finden sie bei den betreffenden Dimensionen unter „Auffällig in Ihren Antworten“.",

  close:
    "Welche dieser Punkte für Sie tatsächlich Priorität haben, hängt von der Nachfolgeform, dem Zeithorizont und Ihrer künftigen Rolle im Unternehmen ab. Für eine Übergabe dürfte es sich lohnen, zuerst dort anzusetzen, wo eine deutliche Abhängigkeit und ein naher Zeitpunkt zusammenfallen.",
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

// src/lib/uebergabe-check/pruefelder.ts
//
// „Ihre ausgewählten Prüffelder“ im persönlichen Ergebnis- und Arbeitsbericht.
//
// Auswahlregeln (Auftrag Punkt 7):
//  • Nicht einfach die drei niedrigsten Dimensionswerte nehmen.
//  • Ausgelöste Item-Hinweise zählen stärker als ein niedriger Dimensionswert.
//  • Höchstens ein Prüffeld je Dimension, dadurch möglichst unterschiedliche
//    Themen.
//  • Höchstens drei insgesamt. Gibt es nur ein oder zwei relevante Felder,
//    erscheinen auch nur diese.
//  • Bei einem guten Profil ohne Hinweise entsteht KEIN künstlicher
//    Entwicklungsbedarf: der Abschnitt entfällt dann vollständig.
//
// Die interne Einstufung der Hinweise steuert nur die Reihenfolge und wird im
// Bericht nicht angezeigt.

import { dimensionContent } from "./content";
import type { DimensionId } from "./items";
import type { DimensionScore, FlagDefinition, FlagPriority } from "./scoring";

export const PRUEFFELDER_TITLE = "Ihre ausgewählten Prüffelder";

export const PRUEFFELDER_INTRO =
  "Aus Ihrem Profil ergeben sich einige Bereiche, die sich für eine vertiefte Betrachtung besonders anbieten. Die Auswahl ist keine automatische Prioritätenliste. Sie bündelt auffällige Punkte, mit denen Sie sinnvoll weiterarbeiten können.";

export type Pruefeld = {
  dimension: DimensionId;
  title: string;
  /** Warum für eine Übergabe relevant, zwei bis drei Sätze. */
  why: string;
  /** Eine konkrete Frage zur internen Klärung. */
  question: string;
  /** Ein konkreter, unverbindlicher erster Schritt. */
  step: string;
};

/**
 * Ein Prüffeld je Dimension. Welche davon erscheinen, entscheidet die Auswahl
 * weiter unten.
 */
const CATALOGUE: Record<DimensionId, Omit<Pruefeld, "dimension">> = {
  1: {
    title: "Entscheidungen und Außenkontakte, die an Ihrer Person hängen",
    why: "Ein Nachfolger übernimmt Verträge, Zahlen und Mitarbeiter, aber keine persönlichen Beziehungen und keine über Jahre eingespielten Entscheidungswege. Genau diese sind im Alltag oft unsichtbar und fallen erst auf, wenn sie fehlen. Je klarer vorher geregelt ist, wer welche Entscheidung trifft und wer welchen Kontakt hält, desto weniger Reibung entsteht nach dem Wechsel.",
    question:
      "Welche Entscheidungen und welche Kundenkontakte laufen heute ausschließlich über den Inhaber, und wer könnte sie realistisch übernehmen?",
    step: "Notieren Sie zwei Wochen lang jede Situation, in der Sie eingebunden wurden. Markieren Sie anschließend, was davon tatsächlich Inhaberaufgabe ist.",
  },
  2: {
    title: "Wissen, das nur an einer Stelle vorhanden ist",
    why: "Eine Übergabe ist auch für die Belegschaft eine Zeit der Unsicherheit, in der Wechsel wahrscheinlicher werden. Wenn geschäftskritisches Wissen dann nur bei einer Person liegt, trifft ein Weggang das Unternehmen doppelt. Verteiltes Wissen macht die Organisation in dieser Phase belastbarer.",
    question:
      "Bei welchen Aufgaben hätten wir ein echtes Problem, wenn die zuständige Person mehrere Wochen ausfiele?",
    step: "Listen Sie Ihre wichtigsten Funktionen auf und tragen Sie je Funktion ein, wer heute vertreten könnte. Die Lücken zeigen sich von selbst.",
  },
  3: {
    title: "Entscheidungsräume der Führungsebene",
    why: "Ein Nachfolger braucht ein Führungsteam, das trägt, und nicht eines, das auf Anweisungen wartet. Formale Befugnisse allein genügen dafür nicht; entscheidend ist, ob sie im Alltag tatsächlich genutzt werden. Wo Führungskräfte sich gewohnheitsmäßig absichern, erbt der Nachfolger die operativen Entscheidungen gleich mit.",
    question:
      "Welche Entscheidungen dürfen unsere Führungskräfte formal treffen, und welche treffen sie tatsächlich?",
    step: "Vereinbaren Sie für einen Bereich ausdrücklich, welche Entscheidungen ohne Rückfrage getroffen werden, und lassen Sie sie dort auch dann stehen, wenn Sie anders entschieden hätten.",
  },
  4: {
    title: "Abläufe, die nur Eingeweihte verstehen",
    why: "Vieles funktioniert im Mittelstand, weil die Beteiligten sich kennen und wissen, wie es gemeint ist. Für einen Nachfolger ist genau dieses Wissen zunächst unsichtbar. Er kann Zahlen lesen, aber nicht die ungeschriebenen Regeln dahinter.",
    question:
      "Was müsste jemand von außen über unsere Abläufe wissen, um sie führen zu können, ohne uns zu fragen?",
    step: "Nehmen Sie den wichtigsten Kernprozess und halten Sie fest, wer entscheidet, wer beteiligt wird und was bei Abweichungen passiert. Mehr braucht es für den Anfang nicht.",
  },
  5: {
    title: "Orientierung, die an der Person des Inhabers hängt",
    why: "Mitarbeiter richten ihr Handeln an dem aus, was sie für erwartet halten. Kommt diese Erwartung überwiegend von einer Person, entsteht mit deren Austritt eine Lücke, die kein Organigramm schließt. Ein eigenständiges Selbstverständnis macht den Wechsel für das Team berechenbarer.",
    question:
      "Woran orientieren sich unsere Mitarbeiter bei Entscheidungen, wenn keine Vorgabe des Inhabers vorliegt?",
    step: "Fragen Sie mehrere Personen unabhängig voneinander, wofür das Unternehmen steht. Die Unterschiede in den Antworten sind der eigentliche Befund.",
  },
  6: {
    title: "Umgang mit Veränderungen an Zuständigkeiten",
    why: "Eine Nachfolge verändert nicht nur die Spitze, sondern Nähe zur Führung, Einfluss und gewachsene Sonderstellungen. Wer dabei etwas verliert, bremst selten offen, sondern verzögert. Der rechtliche Eigentümerwechsel ist schnell vollzogen, der tatsächliche Übergang dauert dann deutlich länger.",
    question:
      "Wer würde durch eine Nachfolge an Einfluss, Verantwortung oder gewohnten Freiheiten verlieren, und wie würden wir damit umgehen?",
    step: "Gehen Sie eine frühere Veränderung durch, die schwerfiel, und klären Sie im Führungskreis, woran es damals tatsächlich lag.",
  },
};

const PRIORITY_WEIGHT: Record<FlagPriority, number> = {
  kritisch: 3,
  erhoehte_aufmerksamkeit: 2,
  hinweis: 1,
};

/** Ein niedriger Dimensionswert allein wiegt weniger als ein Item-Hinweis. */
const LEVEL_WEIGHT: Record<string, number> = {
  elevated: 3,
  develop: 2,
  observe: 0,
  stable: 0,
};

const MAX_PRUEFFELDER = 3;

export function buildPruefelder(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): Pruefeld[] {
  const relevance = new Map<DimensionId, number>();

  for (const entry of scores) {
    const weight = LEVEL_WEIGHT[entry.level] ?? 0;
    if (weight > 0) relevance.set(entry.dimension, weight);
  }
  for (const flag of flags) {
    relevance.set(
      flag.dimension,
      (relevance.get(flag.dimension) ?? 0) + PRIORITY_WEIGHT[flag.priority]
    );
  }

  // Kein Eintrag bedeutet: gutes Profil ohne Hinweise. Dann bleibt der
  // Abschnitt leer, statt Entwicklungsbedarf zu erfinden.
  const scoreOf = new Map(scores.map((entry) => [entry.dimension, entry.score]));

  return [...relevance.entries()]
    .sort(
      (a, b) =>
        b[1] - a[1] ||
        (scoreOf.get(a[0]) ?? 0) - (scoreOf.get(b[0]) ?? 0) ||
        a[0] - b[0]
    )
    .slice(0, MAX_PRUEFFELDER)
    .map(([dimension]) => ({ dimension, ...CATALOGUE[dimension] }));
}

/** Überschrift der Dimension, für die Zuordnung im Bericht. */
export function pruefeldDimensionTitle(dimension: DimensionId): string {
  return dimensionContent(dimension).title;
}

// src/lib/uebergabe-check/items.ts
//
// Erhebungsinstrument, 24 verhaltensnahe Items, 4 je Dimension.
// Quelle: Fachliche Spezifikation Perspektivvergleich, Abschnitt 2
// („Finale Item-Matrix“), die die konsolidierte Gesamtspezifikation ablöst.
//
// WICHTIG: Diese Datei ist versioniert. Wird eine Item-Formulierung oder eine
// Polarität geändert, muss ITEM_VERSION erhöht werden. Sonst lassen sich
// Datensätze verschiedener Erhebungswellen später nicht sauber getrennt
// auswerten.

// beta-2.0 = finale Item-Matrix mit Rollenvarianten. Gegenüber beta-1.5:
//  • Rollenvarianten für 1.3, 3.1, 3.2, 3.3, 3.4, 5.1 und 5.3
//  • Polarität von 1.4 auf „positive“ und von 5.4 auf „inverse“ gedreht,
//    jeweils mit neuem Wortlaut
//  • Wortlaut in 1.1, 1.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4, 5.2, 6.1, 6.2, 6.3
//    und 6.4 angepasst
export const ITEM_VERSION = "beta-2.0";

/** Polarität bestimmt die Punktetransformation (siehe scoring.ts). */
export type Polarity = "positive" | "inverse";

export type DimensionId = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Rollen, für die eine eigene Formulierung hinterlegt werden kann.
 * Deckungsgleich mit RespondentRole in comparison.ts, hier bewusst lokal
 * gehalten, damit items.ts keine Abhängigkeit zum Vergleichsmodul hat.
 */
export type ItemRole = "owner" | "leader" | "key_person";

export type Item = {
  /** Stabile ID, wird als Schlüssel im gespeicherten Antwort-Objekt genutzt. */
  id: string;
  dimension: DimensionId;
  polarity: Polarity;
  /**
   * Standardformulierung. Sie gilt für die Inhaberperspektive und überall
   * dort, wo keine rollenspezifische Variante hinterlegt ist.
   */
  text: string;
  /**
   * Rollenspezifische Varianten für den Perspektivvergleich.
   *
   * Grundregel der Spezifikation: Eine Variante darf ausschließlich die
   * Perspektive der Formulierung verändern, niemals das gemessene Konstrukt.
   * Item-ID, Dimension, Polung und Scoringlogik bleiben identisch, sonst
   * würden die Rollen nicht mehr dasselbe vergleichen.
   *
   * Nur dort hinterlegt, wo die Inhaberperspektive die Antwort sonst
   * verzerren würde. Wo ein Item bereits neutral formuliert ist, bekommen
   * alle Rollen denselben Wortlaut.
   */
  roleText?: Partial<Record<ItemRole, string>>;
};

export const ITEMS: readonly Item[] = [
  // ── Dimension 1: Inhaberunabhängigkeit ────────────────────────────────────
  {
    id: "1.1",
    dimension: 1,
    polarity: "inverse",
    text: "Bei unvorhergesehenen operativen Störungen im Tagesgeschäft wenden sich Mitarbeiter im Regelfall direkt an den Inhaber bzw. die Geschäftsführung, um eine Entscheidung zu erhalten.",
  },
  {
    id: "1.2",
    dimension: 1,
    polarity: "inverse",
    text: "Verhandlungen über Preise, Konditionen oder Verträge mit wesentlichen Kunden werden überwiegend vom Inhaber bzw. der Geschäftsführung persönlich geführt.",
  },
  {
    id: "1.3",
    dimension: 1,
    polarity: "positive",
    text: "Wenn ich für vier Wochen ungeplant vollständig ausfalle, läuft das operative Tagesgeschäft ohne nennenswerte Verzögerungen weiter.",
    roleText: {
      leader:
        "Wenn der Inhaber bzw. die Geschäftsführung für vier Wochen ungeplant vollständig ausfällt, läuft das operative Tagesgeschäft ohne nennenswerte Verzögerungen weiter.",
      key_person:
        "Wenn der Inhaber bzw. die Geschäftsführung für vier Wochen ungeplant vollständig ausfällt, läuft das operative Tagesgeschäft ohne nennenswerte Verzögerungen weiter.",
    },
  },
  {
    id: "1.4",
    dimension: 1,
    // Gegenüber beta-1.5 gedreht: das Item fragt jetzt das Vorhandensein der
    // Grenzen ab, nicht mehr deren Fehlen.
    polarity: "positive",
    text: "Für finanzielle Freigaben bestehen klar definierte Grenzen, innerhalb derer andere Personen im Unternehmen eigenständig entscheiden können.",
  },

  // ── Dimension 2: Schlüsselpersonen & Wissen ───────────────────────────────
  // Benötigt laut Spezifikation keine Rollenvarianten. Alle vier Items sind
  // bereits neutral formuliert, was methodisch der Idealfall ist.
  {
    id: "2.1",
    dimension: 2,
    polarity: "positive",
    text: "Für geschäftskritische Fachaufgaben gibt es eine qualifizierte Stellvertretung im Unternehmen.",
  },
  {
    id: "2.2",
    dimension: 2,
    polarity: "positive",
    text: "Für die Lösung seltener fachlicher oder organisatorischer Probleme ist relevantes Erfahrungswissen so geteilt, dass nicht nur eine einzelne Person darauf zurückgreifen kann.",
  },
  {
    id: "2.3",
    dimension: 2,
    polarity: "inverse",
    text: "Die ungeplante Kündigung einer einzelnen Fachkraft könnte die Leistungsfähigkeit eines geschäftskritischen Bereichs für mehrere Wochen deutlich beeinträchtigen.",
  },
  {
    id: "2.4",
    dimension: 2,
    polarity: "positive",
    text: "Bei personellen Wechseln auf der Fachebene gibt es einen bewährten Prozess, um relevantes Erfahrungswissen strukturiert an die nachfolgende Person zu übergeben.",
  },

  // ── Dimension 3: Führung & Verantwortung ──────────────────────────────────
  // Die Dimension mit dem höchsten Vergleichswert. Die Führungskraft antwortet
  // bewusst aus der Ich-Perspektive: gerade die Differenz zwischen zugestandener
  // und erlebter Autonomie ist der interessante Befund.
  {
    id: "3.1",
    dimension: 3,
    polarity: "positive",
    text: "Führungskräfte verfügen innerhalb klar definierter Grenzen über eigene Entscheidungs- und Budgetbefugnisse, die sie ohne meine vorherige Freigabe nutzen.",
    roleText: {
      leader:
        "Ich verfüge in meinem Verantwortungsbereich innerhalb klar definierter Grenzen über Entscheidungs- und Budgetbefugnisse, die ich ohne vorherige Freigabe des Inhabers bzw. der Geschäftsführung nutzen kann.",
      key_person:
        "Führungskräfte verfügen innerhalb klar definierter Grenzen über eigene Entscheidungs- und Budgetbefugnisse, die sie ohne vorherige Freigabe des Inhabers bzw. der Geschäftsführung nutzen.",
    },
  },
  {
    id: "3.2",
    dimension: 3,
    polarity: "positive",
    text: "Bei auftretenden Problemen bringen Führungskräfte in der Regel eigene Lösungsvorschläge ein, statt die Entscheidung an mich zurückzugeben.",
    roleText: {
      leader:
        "Bei auftretenden Problemen erarbeiten wir in der Führungsebene in der Regel eigene Lösungsvorschläge, statt die Entscheidung an den Inhaber bzw. die Geschäftsführung zurückzugeben.",
      key_person:
        "Bei auftretenden Problemen bringen Führungskräfte in der Regel eigene Lösungsvorschläge ein, statt die Entscheidung an den Inhaber bzw. die Geschäftsführung zurückzugeben.",
    },
  },
  {
    id: "3.3",
    dimension: 3,
    polarity: "inverse",
    text: "Führungskräfte binden mich bei alltäglichen Standardentscheidungen häufig ein, um sich abzusichern.",
    roleText: {
      leader:
        "Bei alltäglichen Standardentscheidungen binde ich den Inhaber bzw. die Geschäftsführung häufig ein, um mich abzusichern.",
      key_person:
        "Führungskräfte binden den Inhaber bzw. die Geschäftsführung bei alltäglichen Standardentscheidungen häufig ein, um sich abzusichern.",
    },
  },
  {
    id: "3.4",
    dimension: 3,
    polarity: "positive",
    text: "Das Führungsteam trifft abteilungsübergreifende Absprachen selbstständig, auch wenn ich bei diesen Terminen nicht anwesend bin.",
    roleText: {
      leader:
        "Das Führungsteam trifft abteilungsübergreifende Absprachen selbstständig, auch wenn der Inhaber bzw. die Geschäftsführung bei diesen Terminen nicht anwesend ist.",
      key_person:
        "Das Führungsteam trifft abteilungsübergreifende Absprachen selbstständig, auch wenn der Inhaber bzw. die Geschäftsführung bei diesen Terminen nicht anwesend ist.",
    },
  },

  // ── Dimension 4: Strukturen & Prozesse ────────────────────────────────────
  {
    id: "4.1",
    dimension: 4,
    polarity: "positive",
    text: "Die wesentlichen Arbeitsabläufe sind so dokumentiert, dass sich eine neue Fachkraft weitgehend selbstständig darin einarbeiten kann.",
  },
  {
    id: "4.2",
    dimension: 4,
    polarity: "positive",
    // „schriftlich“ ist bewusst entfallen. Der Dokumentationsgrad wird bereits
    // von 4.1 gemessen; 4.2 misst die Eindeutigkeit der Regelung selbst.
    text: "Aufgaben, Befugnisse und Verantwortlichkeiten an wichtigen Schnittstellen sind eindeutig geregelt.",
  },
  {
    id: "4.3",
    dimension: 4,
    polarity: "inverse",
    text: "Die tatsächlichen Arbeitsabläufe weichen im Alltag deutlich von den vorgesehenen Abläufen ab und beruhen stattdessen auf informellen Absprachen.",
  },
  {
    id: "4.4",
    dimension: 4,
    polarity: "positive",
    text: "Für Konflikte oder Unklarheiten an wichtigen Schnittstellen gibt es nachvollziehbare Wege zur Klärung, ohne dass dafür regelmäßig der Inhaber bzw. die Geschäftsführung eingreifen muss.",
  },

  // ── Dimension 5: Kultur & Identität ───────────────────────────────────────
  {
    id: "5.1",
    dimension: 5,
    polarity: "inverse",
    text: "Mitarbeiter begründen Entscheidungen im Arbeitsalltag häufig mit meinen persönlichen Präferenzen oder Erwartungen.",
    roleText: {
      leader:
        "Mitarbeiter begründen Entscheidungen im Arbeitsalltag häufig mit persönlichen Präferenzen oder Erwartungen des Inhabers bzw. der Geschäftsführung.",
      key_person:
        "Mitarbeiter begründen Entscheidungen im Arbeitsalltag häufig mit persönlichen Präferenzen oder Erwartungen des Inhabers bzw. der Geschäftsführung.",
    },
  },
  {
    id: "5.2",
    dimension: 5,
    polarity: "positive",
    text: "Erfolge und gute Leistungen werden im Unternehmen erkennbar mit dem Unternehmen, seinen Leistungen oder gemeinsamen Zielen verbunden und nicht vor allem mit der Person des Inhabers.",
  },
  {
    id: "5.3",
    dimension: 5,
    polarity: "inverse",
    text: "Bei meiner längeren Abwesenheit werden Zusammenarbeit und Abstimmung im Unternehmen erkennbar schwieriger.",
    roleText: {
      leader:
        "Bei längerer Abwesenheit des Inhabers bzw. der Geschäftsführung werden Zusammenarbeit und Abstimmung im Unternehmen erkennbar schwieriger.",
      key_person:
        "Bei längerer Abwesenheit des Inhabers bzw. der Geschäftsführung werden Zusammenarbeit und Abstimmung im Unternehmen erkennbar schwieriger.",
    },
  },
  {
    id: "5.4",
    dimension: 5,
    // Gegenüber beta-1.5 gedreht: das Item fragt jetzt die Skepsis ab, nicht
    // mehr die Offenheit.
    polarity: "inverse",
    text: "In der Belegschaft zeigt sich eine grundsätzlich skeptische Haltung, wenn externe Führungskräfte oder deutlich veränderte Führungsstrukturen eingeführt werden.",
  },

  // ── Dimension 6: Veränderungsfähigkeit & Anpassungsbereitschaft ───────────
  {
    id: "6.1",
    dimension: 6,
    polarity: "positive",
    text: "Personelle Wechsel in Führungspositionen werden von der Belegschaft im Regelfall zügig akzeptiert und im Arbeitsalltag unterstützt.",
  },
  {
    id: "6.2",
    dimension: 6,
    polarity: "positive",
    text: "Veränderte Zuständigkeiten oder Führungsstrukturen werden nach ihrer Einführung im Arbeitsalltag zeitnah umgesetzt und nicht über längere Zeit informell umgangen.",
  },
  {
    id: "6.3",
    dimension: 6,
    polarity: "positive",
    text: "Frühere organisatorische Veränderungen wurden im Unternehmen ohne langanhaltende Beeinträchtigungen von Zusammenarbeit und Leistungsfähigkeit bewältigt.",
  },
  {
    id: "6.4",
    dimension: 6,
    polarity: "inverse",
    // „Gewohnheitsrechte“ ist bewusst entfallen: der Begriff wirkt wertend und
    // arbeitsrechtlich konnotiert.
    text: "Veränderungen historisch gewachsener Sonderregelungen führen im Unternehmen häufig zu länger anhaltendem Widerstand.",
  },
] as const;

/** Einheitliche 5-stufige Likert-Skala für alle Items. */
export const LIKERT_SCALE = [
  { value: 1, label: "Trifft gar nicht zu" },
  { value: 2, label: "Trifft eher nicht zu" },
  { value: 3, label: "Teils/teils" },
  { value: 4, label: "Trifft eher zu" },
  { value: 5, label: "Trifft voll zu" },
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

/** Antwortobjekt: Item-ID auf Likert-Rohwert. */
export type Answers = Record<string, LikertValue>;

export const DIMENSION_IDS: readonly DimensionId[] = [1, 2, 3, 4, 5, 6];

export function itemsForDimension(dimension: DimensionId): Item[] {
  return ITEMS.filter((item) => item.dimension === dimension);
}

export function itemById(id: string): Item | undefined {
  return ITEMS.find((item) => item.id === id);
}

/**
 * Liefert die für eine Rolle passende Formulierung. Ohne hinterlegte Variante
 * kommt die Standardformulierung zurück, die zugleich die Inhaberfassung ist.
 */
export function itemText(item: Item, role: ItemRole = "owner"): string {
  return item.roleText?.[role] ?? item.text;
}

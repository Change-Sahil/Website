// src/lib/uebergabe-check/items.ts
//
// Beta-Erhebungsinstrument v1.0, 24 verhaltensnahe Items, 4 je Dimension.
// Quelle: Gesamtspezifikation (finale, konsolidierte Fassung), Teil 3, Abschnitt 1.
//
// WICHTIG: Diese Datei ist versioniert. Wird eine Item-Formulierung oder eine
// Polarität geändert, muss ITEM_VERSION erhöht werden. Sonst lassen sich
// Datensätze verschiedener Erhebungswellen später nicht sauber getrennt
// auswerten.

// beta-1.5 = finale konsolidierte Spezifikation. Gegenüber der Vorfassung
// wurden neun Itemtexte angepasst und bei Item 1.4 sowie Item 5.4 die
// Polarität gedreht.
export const ITEM_VERSION = "beta-1.5";

/** Polarität bestimmt die Punktetransformation (siehe scoring.ts). */
export type Polarity = "positive" | "inverse";

export type DimensionId = 1 | 2 | 3 | 4 | 5 | 6;

export type Item = {
  /** Stabile ID, wird als Schlüssel im gespeicherten Antwort-Objekt genutzt. */
  id: string;
  dimension: DimensionId;
  polarity: Polarity;
  text: string;
};

export const ITEMS: readonly Item[] = [
  // ── Dimension 1: Inhaberunabhängigkeit ────────────────────────────────────
  {
    id: "1.1",
    dimension: 1,
    polarity: "inverse",
    text: "Bei unvorhergesehenen operativen Störungen im Tagesgeschäft wenden sich Mitarbeiter im Regelfall direkt an den Inhaber, um eine Entscheidung zu erhalten.",
  },
  {
    id: "1.2",
    dimension: 1,
    polarity: "inverse",
    text: "Verhandlungen über Preise, Konditionen oder Verträge mit wesentlichen Kunden werden überwiegend vom Inhaber persönlich geführt.",
  },
  {
    id: "1.3",
    dimension: 1,
    polarity: "positive",
    text: "Wenn der Inhaber für vier Wochen komplett ausfällt, läuft das operative Tagesgeschäft ohne nennenswerte Verzögerungen weiter.",
  },
  {
    id: "1.4",
    dimension: 1,
    polarity: "inverse",
    text: "Für nachgelagerte Funktionen sind keine operativen Freigabegrenzen definiert.",
  },

  // ── Dimension 2: Schlüsselpersonen & Wissen ───────────────────────────────
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
    text: "Die unvorhergesehene Kündigung einer einzelnen Fachkraft würde die Leistungserstellung in diesem Bereich für mehrere Wochen spürbar beeinträchtigen.",
  },
  {
    id: "2.4",
    dimension: 2,
    polarity: "positive",
    text: "Bei personellen Wechseln auf der Fachebene existiert ein bewährter Prozess, um das Erfahrungswissen strukturiert an den Nachfolger zu übergeben.",
  },

  // ── Dimension 3: Führung & Verantwortung ──────────────────────────────────
  {
    id: "3.1",
    dimension: 3,
    polarity: "positive",
    text: "Führungskräfte verfügen innerhalb klar definierter Grenzen über eigene Entscheidungs- und Budgetbefugnisse, die sie ohne vorherige Freigabe des Inhabers nutzen.",
  },
  {
    id: "3.2",
    dimension: 3,
    polarity: "positive",
    text: "Bei auftretenden Problemen präsentieren Führungskräfte dem Inhaber direkt ausgearbeitete Lösungsvorschläge, statt die Entscheidung an ihn zurückzudelegieren.",
  },
  {
    id: "3.3",
    dimension: 3,
    polarity: "inverse",
    text: "Führungskräfte binden den Inhaber bei alltäglichen Standardentscheidungen (z. B. per CC-E-Mail oder kurzem Zuruf) ein, um sich abzusichern.",
  },
  {
    id: "3.4",
    dimension: 3,
    polarity: "positive",
    text: "Das Führungsteam trifft abteilungsübergreifende Absprachen in regelmäßigen Runden selbstständig, auch wenn der Inhaber bei diesen Terminen nicht anwesend ist.",
  },

  // ── Dimension 4: Strukturen & Prozesse ────────────────────────────────────
  {
    id: "4.1",
    dimension: 4,
    polarity: "positive",
    text: "Unsere Arbeitsabläufe sind so dokumentiert (z. B. in Form von Checklisten, Richtlinien oder Diagrammen), dass sich eine neue Fachkraft weitgehend selbstständig darin einarbeiten kann.",
  },
  {
    id: "4.2",
    dimension: 4,
    polarity: "positive",
    text: "Aufgaben, Befugnisse und Verantwortlichkeiten an den Schnittstellen zwischen den Abteilungen sind eindeutig und schriftlich geregelt.",
  },
  {
    id: "4.3",
    dimension: 4,
    polarity: "inverse",
    text: "Die tatsächlichen Arbeitsabläufe weichen im Alltag stark von den offiziellen Vorgaben ab und basieren stattdessen auf informellen Absprachen.",
  },
  {
    id: "4.4",
    dimension: 4,
    polarity: "positive",
    text: "Konflikte zwischen Abteilungen werden im Alltag über festgelegte Abstimmungswege gelöst, statt sie persönlich auszutragen.",
  },

  // ── Dimension 5: Kultur & Identität ───────────────────────────────────────
  {
    id: "5.1",
    dimension: 5,
    polarity: "inverse",
    text: "Mitarbeiter begründen Entscheidungen im Arbeitsalltag häufig mit persönlichen Präferenzen des Inhabers („Der Chef möchte das so“).",
  },
  {
    id: "5.2",
    dimension: 5,
    polarity: "positive",
    text: "Die Identifikation der Belegschaft mit dem Unternehmen basiert primär auf der Leistung und dem Angebot des Betriebs, nicht auf der Person des Inhabers.",
  },
  {
    id: "5.3",
    dimension: 5,
    polarity: "inverse",
    text: "Bei längerer Abwesenheit des Inhabers werden Zusammenarbeit und Abstimmung im Unternehmen erkennbar schwieriger.",
  },
  {
    id: "5.4",
    dimension: 5,
    polarity: "positive",
    text: "Neue, externe Führungskräfte werden von der Belegschaft offen aufgenommen und respektiert.",
  },

  // ── Dimension 6: Veränderungsfähigkeit & Anpassungsbereitschaft ───────────
  {
    id: "6.1",
    dimension: 6,
    polarity: "positive",
    text: "Personelle Wechsel auf Führungspositionen (z. B. Abteilungsleiter) werden von der Belegschaft im Regelfall zügig akzeptiert und operativ unterstützt.",
  },
  {
    id: "6.2",
    dimension: 6,
    polarity: "positive",
    text: "Veränderte Zuständigkeiten oder Führungsstrukturen werden nach ihrer Einführung im Arbeitsalltag zeitnah umgesetzt, statt über längere Zeit informell umgangen zu werden.",
  },
  {
    id: "6.3",
    dimension: 6,
    polarity: "positive",
    text: "Frühere organisatorische Veränderungen wurden von der Belegschaft zügig und konstruktiv bewältigt.",
  },
  {
    id: "6.4",
    dimension: 6,
    polarity: "inverse",
    text: "Die Anpassung etablierter Sonderregelungen für einzelne Mitarbeiter führt im Team im Regelfall zu spürbaren Widerständen.",
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

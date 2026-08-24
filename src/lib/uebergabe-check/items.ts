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

// 1.0 = erste öffentliche Fassung. Inhaltlich identisch mit der Vorfassung
// beta-2.0; umbenannt beim Launch, weil zu diesem Zeitpunkt kein einziger
// Datensatz in der Datenbank lag. Es kann also keine Verwechslung zwischen
// Erhebungswellen geben, und Produktivdaten tragen nicht die Kennung „beta“.
//
// Gegenüber beta-1.5 waren die Änderungen:
//  • Rollenvarianten für 1.3, 3.1, 3.2, 3.3, 3.4, 5.1 und 5.3
//  • Polarität von 1.4 auf „positive“ und von 5.4 auf „inverse“ gedreht,
//    jeweils mit neuem Wortlaut
//  • Wortlaut in 1.1, 1.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4, 5.2, 6.1, 6.2, 6.3
//    und 6.4 angepasst
export const ITEM_VERSION = "1.0";

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
  /**
   * Kurzbezeichnung des Sachverhalts, den das Item abfragt. Überschrift des
   * Vergleichsblocks („Unterschiedliche Wahrnehmung bei: …“).
   */
  topic: string;
  /**
   * Offene Frage für das gemeinsame Gespräch, wenn die Rollen dieses Item
   * deutlich unterschiedlich einschätzen.
   *
   * Erscheint AUSSCHLIESSLICH im Perspektivvergleich und nur dann, wenn das
   * Item tatsächlich eine relevante Abweichung zeigt. Nie im Einzelbericht.
   *
   * Die Frage ist weder Diagnose noch Interpretation darüber, welche
   * Perspektive richtig ist. Sie übersetzt eine auffällige Wahrnehmungs-
   * differenz in eine konkrete Gesprächsfrage. Deshalb fragt etwa 5.4 nicht,
   * warum die Organisation skeptisch ist: das würde voraussetzen, dass
   * Skepsis besteht.
   */
  clarificationQuestion: string;
};

export const ITEMS: readonly Item[] = [
  // ── Dimension 1: Inhaberunabhängigkeit ────────────────────────────────────
  {
    id: "1.1",
    dimension: 1,
    polarity: "inverse",
    text: "Bei unvorhergesehenen operativen Störungen im Tagesgeschäft wenden sich Mitarbeiter im Regelfall direkt an den Inhaber bzw. die Geschäftsführung, um eine Entscheidung zu erhalten.",
    topic: "Operative Störungen",
    clarificationQuestion:
      "Bei welchen operativen Störungen unterscheiden sich die Einschätzungen darüber, wie häufig eine Entscheidung des Inhabers tatsächlich benötigt wird?",
  },
  {
    id: "1.2",
    dimension: 1,
    polarity: "inverse",
    text: "Verhandlungen über Preise, Konditionen oder Verträge mit wesentlichen Kunden werden überwiegend vom Inhaber bzw. der Geschäftsführung persönlich geführt.",
    topic: "Kundenverhandlungen",
    clarificationQuestion:
      "Welche Kundenbeziehungen und Verhandlungen könnten heute bereits ohne persönliche Beteiligung des Inhabers geführt werden, und wo wird seine Beteiligung weiterhin als notwendig angesehen?",
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
    topic: "Abwesenheit des Inhabers",
    clarificationQuestion:
      "Bei welchen Entscheidungen oder Abläufen unterscheiden sich die Einschätzungen darüber, was bei einer mehrwöchigen Abwesenheit des Inhabers tatsächlich ins Stocken geraten würde?",
  },
  {
    id: "1.4",
    dimension: 1,
    // Gegenüber beta-1.5 gedreht: das Item fragt jetzt das Vorhandensein der
    // Grenzen ab, nicht mehr deren Fehlen.
    polarity: "positive",
    text: "Für finanzielle Freigaben bestehen klar definierte Grenzen, innerhalb derer andere Personen im Unternehmen eigenständig entscheiden können.",
    topic: "Finanzielle Entscheidungsgrenzen",
    clarificationQuestion:
      "Wie klar sind die bestehenden Entscheidungs- und Freigabegrenzen im Alltag tatsächlich, und werden sie von Inhaber und Führungskräften gleichermaßen als nutzbarer Handlungsspielraum erlebt?",
  },

  // ── Dimension 2: Schlüsselpersonen & Wissen ───────────────────────────────
  // Benötigt laut Spezifikation keine Rollenvarianten. Alle vier Items sind
  // bereits neutral formuliert, was methodisch der Idealfall ist.
  {
    id: "2.1",
    dimension: 2,
    polarity: "positive",
    text: "Für geschäftskritische Fachaufgaben gibt es eine qualifizierte Stellvertretung im Unternehmen.",
    topic: "Stellvertretung",
    clarificationQuestion:
      "Bei welchen geschäftskritischen Aufgaben unterscheiden sich die Einschätzungen darüber, ob eine andere Person kurzfristig und eigenständig übernehmen könnte?",
  },
  {
    id: "2.2",
    dimension: 2,
    polarity: "positive",
    text: "Für die Lösung seltener fachlicher oder organisatorischer Probleme ist relevantes Erfahrungswissen so geteilt, dass nicht nur eine einzelne Person darauf zurückgreifen kann.",
    topic: "Erfahrungswissen",
    clarificationQuestion:
      "Welches wichtige Erfahrungswissen ist aus Sicht der Beteiligten bereits ausreichend geteilt, und bei welchem Wissen bestehen unterschiedliche Einschätzungen über seine Verfügbarkeit?",
  },
  {
    id: "2.3",
    dimension: 2,
    polarity: "inverse",
    text: "Die ungeplante Kündigung einer einzelnen Fachkraft könnte die Leistungsfähigkeit eines geschäftskritischen Bereichs für mehrere Wochen deutlich beeinträchtigen.",
    topic: "Ausfall einer Fachkraft",
    clarificationQuestion:
      "Bei welchen Funktionen wird unterschiedlich eingeschätzt, wie stark der unerwartete Ausfall einer einzelnen Fachkraft den Betrieb tatsächlich beeinträchtigen würde?",
  },
  {
    id: "2.4",
    dimension: 2,
    polarity: "positive",
    text: "Bei personellen Wechseln auf der Fachebene gibt es einen bewährten Prozess, um relevantes Erfahrungswissen strukturiert an die nachfolgende Person zu übergeben.",
    topic: "Wissenstransfer bei Wechseln",
    clarificationQuestion:
      "Wie unterschiedlich wird erlebt, ob Erfahrungswissen bei personellen Wechseln tatsächlich systematisch an Nachfolger übergeben wird?",
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
    topic: "Entscheidungs- und Budgetbefugnisse",
    clarificationQuestion:
      "Wo unterscheiden sich Inhaber und Führungskräfte in ihrer Einschätzung, welche Entscheidungen Führungskräfte tatsächlich ohne vorherige Freigabe treffen können?",
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
    topic: "Umgang mit Problemen",
    clarificationQuestion:
      "Wie unterschiedlich erleben Inhaber und Führungskräfte, ob Probleme mit eigenen Lösungsvorschlägen bearbeitet oder zur Entscheidung nach oben gegeben werden?",
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
    topic: "Rückversicherung beim Inhaber",
    clarificationQuestion:
      "In welchen Alltagssituationen erleben Führungskräfte die Rückversicherung beim Inhaber anders als der Inhaber selbst?",
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
    topic: "Zusammenarbeit im Führungsteam",
    clarificationQuestion:
      "Bei welchen abteilungsübergreifenden Themen unterscheiden sich die Einschätzungen darüber, wie selbstständig das Führungsteam ohne Beteiligung des Inhabers handelt?",
  },

  // ── Dimension 4: Strukturen & Prozesse ────────────────────────────────────
  {
    id: "4.1",
    dimension: 4,
    polarity: "positive",
    text: "Die wesentlichen Arbeitsabläufe sind so dokumentiert, dass sich eine neue Fachkraft weitgehend selbstständig darin einarbeiten kann.",
    topic: "Dokumentierte Arbeitsabläufe",
    clarificationQuestion:
      "Bei welchen wichtigen Arbeitsabläufen unterscheiden sich die Einschätzungen darüber, ob eine neue Fachkraft sie anhand der vorhandenen Dokumentation tatsächlich selbstständig übernehmen könnte?",
  },
  {
    id: "4.2",
    dimension: 4,
    polarity: "positive",
    // „schriftlich“ ist bewusst entfallen. Der Dokumentationsgrad wird bereits
    // von 4.1 gemessen; 4.2 misst die Eindeutigkeit der Regelung selbst.
    text: "Aufgaben, Befugnisse und Verantwortlichkeiten an wichtigen Schnittstellen sind eindeutig geregelt.",
    topic: "Schnittstellen und Verantwortlichkeiten",
    clarificationQuestion:
      "An welchen Schnittstellen wird unterschiedlich wahrgenommen, wie eindeutig Aufgaben, Befugnisse und Verantwortlichkeiten geregelt sind?",
  },
  {
    id: "4.3",
    dimension: 4,
    polarity: "inverse",
    text: "Die tatsächlichen Arbeitsabläufe weichen im Alltag deutlich von den vorgesehenen Abläufen ab und beruhen stattdessen auf informellen Absprachen.",
    topic: "Formelle und tatsächliche Abläufe",
    clarificationQuestion:
      "Bei welchen Abläufen unterscheiden sich die Einschätzungen darüber, wie stark die tägliche Praxis von den vorgesehenen Prozessen abweicht?",
  },
  {
    id: "4.4",
    dimension: 4,
    polarity: "positive",
    text: "Für Konflikte oder Unklarheiten an wichtigen Schnittstellen gibt es nachvollziehbare Wege zur Klärung, ohne dass dafür regelmäßig der Inhaber bzw. die Geschäftsführung eingreifen muss.",
    topic: "Umgang mit Schnittstellenkonflikten",
    clarificationQuestion:
      "Wie unterschiedlich wird erlebt, ob Konflikte zwischen Bereichen über vereinbarte Wege geklärt werden oder von einzelnen Personen gelöst werden müssen?",
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
    topic: "Orientierung am Inhaber",
    clarificationQuestion:
      "Woran orientieren sich Mitarbeiter bei Entscheidungen tatsächlich, und warum wird die Bedeutung der persönlichen Präferenzen des Inhabers von den Beteiligten unterschiedlich eingeschätzt?",
  },
  {
    id: "5.2",
    dimension: 5,
    polarity: "positive",
    text: "Erfolge und gute Leistungen werden im Unternehmen erkennbar mit dem Unternehmen, seinen Leistungen oder gemeinsamen Zielen verbunden und nicht vor allem mit der Person des Inhabers.",
    topic: "Identifikation mit dem Unternehmen",
    clarificationQuestion:
      "Womit verbinden Mitarbeiter aus Sicht der verschiedenen Beteiligten ihre Identifikation mit dem Unternehmen, eher mit dessen Leistung und Profil oder stärker mit einzelnen Personen?",
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
    topic: "Abwesenheit und Zusammenarbeit",
    clarificationQuestion:
      "Wie unterschiedlich wird wahrgenommen, ob sich Zusammenarbeit und Abstimmung verändern, wenn der Inhaber über längere Zeit nicht präsent ist?",
  },
  {
    id: "5.4",
    dimension: 5,
    // Gegenüber beta-1.5 gedreht: das Item fragt jetzt die Skepsis ab, nicht
    // mehr die Offenheit.
    polarity: "inverse",
    text: "In der Belegschaft zeigt sich eine grundsätzlich skeptische Haltung, wenn externe Führungskräfte oder deutlich veränderte Führungsstrukturen eingeführt werden.",
    topic: "Reaktion auf neue Führung",
    // Fragt bewusst nach der Herkunft der unterschiedlichen Einschätzungen,
    // nicht nach den Gründen der Skepsis. Letzteres würde voraussetzen, dass
    // Skepsis besteht.
    clarificationQuestion:
      "Woher könnten die unterschiedlichen Einschätzungen dazu kommen, wie offen die Organisation gegenüber neuen Führungskräften oder veränderten Führungsstrukturen ist?",
  },

  // ── Dimension 6: Veränderungsfähigkeit & Anpassungsbereitschaft ───────────
  {
    id: "6.1",
    dimension: 6,
    polarity: "positive",
    text: "Personelle Wechsel in Führungspositionen werden von der Belegschaft im Regelfall zügig akzeptiert und im Arbeitsalltag unterstützt.",
    topic: "Wechsel in Führungspositionen",
    clarificationQuestion:
      "Welche Erfahrungen mit bisherigen Führungswechseln führen dazu, dass deren Akzeptanz und Unterstützung unterschiedlich eingeschätzt werden?",
  },
  {
    id: "6.2",
    dimension: 6,
    polarity: "positive",
    text: "Veränderte Zuständigkeiten oder Führungsstrukturen werden nach ihrer Einführung im Arbeitsalltag zeitnah umgesetzt und nicht über längere Zeit informell umgangen.",
    topic: "Veränderte Zuständigkeiten und Führungsstrukturen",
    clarificationQuestion:
      "Bei welchen Veränderungen von Zuständigkeiten oder Führungsstrukturen unterscheiden sich die Einschätzungen darüber, wie schnell diese im Arbeitsalltag tatsächlich umgesetzt werden?",
  },
  {
    id: "6.3",
    dimension: 6,
    polarity: "positive",
    text: "Frühere organisatorische Veränderungen wurden im Unternehmen ohne langanhaltende Beeinträchtigungen von Zusammenarbeit und Leistungsfähigkeit bewältigt.",
    topic: "Erfahrungen mit Veränderungen",
    clarificationQuestion:
      "Welche früheren Veränderungen werden von den Beteiligten unterschiedlich bewertet, insbesondere hinsichtlich ihrer Auswirkungen auf Leistung, Zusammenarbeit oder Stimmung?",
  },
  {
    id: "6.4",
    dimension: 6,
    polarity: "inverse",
    // „Gewohnheitsrechte“ ist bewusst entfallen: der Begriff wirkt wertend und
    // arbeitsrechtlich konnotiert.
    text: "Veränderungen historisch gewachsener Sonderregelungen führen im Unternehmen häufig zu länger anhaltendem Widerstand.",
    topic: "Gewachsene Sonderregelungen",
    clarificationQuestion:
      "Bei welchen gewachsenen Sonderregelungen unterscheiden sich die Einschätzungen darüber, wie schwierig eine Veränderung im Zuge einer Übergabe tatsächlich wäre?",
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

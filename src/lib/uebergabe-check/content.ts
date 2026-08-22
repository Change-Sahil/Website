// src/lib/uebergabe-check/content.ts
//
// Textbausteine für den Ergebnisbericht.
// Quelle: Gesamtspezifikation (finale, konsolidierte Fassung), Teil 4.
//
// Alle Einordnungstexte sind bewusst non-kausal: sie beschreiben das
// aggregierte Niveau der Dimension und leiten daraus keine Einzelursache ab.
// Konkrete Aussagen zu einzelnen Antworten entstehen ausschließlich über die
// Item-Hinweise in scoring.ts.

import type { DimensionId } from "./items";
import type { MaturityLevel } from "./scoring";

/** Callout an der Spitze der Ergebnisseite (Spec Teil 4, 1.1). */
export const RESULT_DISCLAIMER =
  "Der Schnellcheck dient einer strukturierten Erstindikation der organisationalen Übergabefähigkeit. Er zeigt Ansatzpunkte für eine vertiefte Betrachtung, ersetzt aber keine individuelle Analyse der konkreten Nachfolgesituation oder eine persönliche Nachfolgeberatung.";

/** Semantische Erklärung des Diagramms (Spec Teil 4, 1.2). */
export const CHART_EXPLANATION =
  "Das Diagramm zeigt die Ausprägung der sechs Dimensionen auf einen Blick. Je weiter außen eine Achse liegt, desto stärker sind die im Schnellcheck betrachteten Voraussetzungen für eine organisationale Übergabe in diesem Bereich ausgeprägt.";

export const NO_TOTAL_SCORE_NOTE =
  "Ein Gesamtwert wird bewusst nicht ausgewiesen. Er würde einzelne kritische Abhängigkeiten im Mittel verschwinden lassen.";

export const FLAGS_SECTION_TITLE = "Auffällig in Ihren Antworten";

/**
 * Kontextualisierung statt Dringlichkeit. Ein niedriger Wert bedeutet je nach
 * Zeithorizont und Nachfolgeform etwas völlig anderes, das Tool soll daraus
 * keinen Handlungsdruck erzeugen.
 */
export const CONTEXT_NOTE =
  "Ob und wann ein Bereich Aufmerksamkeit braucht, hängt von Ihrer konkreten Situation ab. Derselbe Wert bedeutet bei zehn Jahren Vorlauf etwas anderes als sechs Monate vor einer Übergabe.";

export const FLAGS_SECTION_HINT =
  "Einzelne Antworten, die unabhängig vom Punktwert dieser Dimension eine nähere Betrachtung verdienen. Sie verändern den Punktwert nicht und bedeuten keine Rangfolge: welche Punkte zuerst Aufmerksamkeit brauchen, hängt von Ihrem Übergabezeitpunkt, der Art der Nachfolge und Ihrer künftigen Rolle ab.";

export type LevelMeta = {
  label: string;
  /** Bedeutung der Stufe, dimensionsunabhängig (Spec 2.3). */
  meaning: string;
  color: string;
  range: string;
};

export const LEVEL_META: Record<MaturityLevel, LevelMeta> = {
  stable: {
    label: "Gut ausgeprägt",
    range: "75–100",
    color: "rgb(0,168,165)",
    meaning:
      "Die im Schnellcheck betrachteten Voraussetzungen in dieser Dimension sind insgesamt gut ausgeprägt.",
  },
  observe: {
    label: "Überwiegend ausgeprägt",
    range: "50–74",
    color: "rgb(0,112,125)",
    meaning:
      "Die Voraussetzungen sind überwiegend vorhanden. Einzelne Teilaspekte können unterschiedlich ausgeprägt sein und sollten im Hinblick auf die Übergabe geprüft werden.",
  },
  develop: {
    label: "Entwicklungsbedarf",
    range: "25–49",
    color: "rgb(202,138,4)",
    meaning:
      "Die Voraussetzungen sind nur teilweise ausgeprägt. Eine gezielte Betrachtung der einzelnen Teilaspekte ist ratsam.",
  },
  elevated: {
    label: "Deutlicher Entwicklungsbedarf",
    range: "0–24",
    color: "rgb(185,28,28)",
    meaning:
      "Die im Schnellcheck betrachteten Voraussetzungen in dieser Dimension sind insgesamt gering ausgeprägt. Eine vertiefte Betrachtung der einzelnen Teilaspekte ist im Hinblick auf die konkrete Übergabesituation sinnvoll.",
  },
};

export type LevelText = {
  /** Einordnung */
  interpretation: string;
  /** Handlungs- und Prüfimpuls */
  impulse: string;
};

export type DimensionContent = {
  id: DimensionId;
  /** Vollständiger Name für Berichtsüberschriften. */
  title: string;
  /** Kurzform für Badges und Navigation. */
  shortTitle: string;
  /** Zweizeiliges Label für die Achsen des Diagramms. */
  axisLabel: readonly [string, string];
  /** Leitfrage, die dem Nutzer während der Befragung den Fokus erklärt. */
  focus: string;
  /** Score-unabhängige Kurzerklärung im Bericht. */
  explanation: string;
  levels: Record<MaturityLevel, LevelText>;
};

export const DIMENSIONS: readonly DimensionContent[] = [
  {
    id: 1,
    title: "Inhaberunabhängigkeit",
    shortTitle: "Inhaberunabhängigkeit",
    axisLabel: ["Inhaber-", "unabhängigkeit"],
    focus:
      "Wie weit funktioniert das operative Tagesgeschäft unabhängig von der unmittelbaren Einbindung des Inhabers?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die im Schnellcheck erfassten Bereiche des operativen Tagesgeschäfts unabhängig von der unmittelbaren Einbindung des Inhabers funktionieren. Betrachtet werden operative Entscheidungen, wesentliche Kundenverhandlungen, die Fortführung bei längerer Abwesenheit sowie dezentrale Freigabegrenzen.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Inhaberunabhängigkeit insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie im Hinblick auf die geplante Übergabe, ob dieses Niveau in allen vier betrachteten Bereichen belastbar ist und auch bei einer veränderten Rolle des Inhabers erhalten bleibt.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Inhaberunabhängigkeit insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, wo im Hinblick auf die konkrete Übergabesituation noch eine stärkere Unabhängigkeit vom Inhaber sinnvoll sein könnte.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Inhaberunabhängigkeit insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie die vier betrachteten Bereiche einzeln darauf, welche Abhängigkeiten für die geplante Übergabe tatsächlich relevant sind und wo eine stärkere organisatorische Absicherung sinnvoll sein könnte.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Inhaberunabhängigkeit insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der einzelnen Antworten ist vor einer Übergabe besonders sinnvoll. Entscheidend ist dabei, welche der erkennbaren Abhängigkeiten für die konkrete Übergabesituation tatsächlich relevant und gezielt abzusichern sind.",
      },
    },
  },
  {
    id: 2,
    title: "Schlüsselpersonen & Wissen",
    shortTitle: "Schlüsselpersonen",
    axisLabel: ["Schlüsselpersonen", "& Wissen"],
    focus:
      "Wie geht die Organisation mit personengebundenem Fach- und Erfahrungswissen um?",
    explanation:
      "Diese Dimension betrachtet, wie die Organisation in den abgefragten Bereichen mit personengebundenem Fach- und Erfahrungswissen umgeht. Betrachtet werden Stellvertretung, Verteilung von Erfahrungswissen, Auswirkungen des Ausfalls einzelner Fachkräfte und Wissenstransfer bei personellen Wechseln.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Absicherung von Schlüsselpersonen und Erfahrungswissen insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie, ob die vorhandene Absicherung auch für diejenigen Fachaufgaben und Wissensträger belastbar ist, die für die konkrete Übergabesituation besonders relevant sind.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Absicherung von Schlüsselpersonen und Erfahrungswissen insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, wo personelle Abhängigkeiten oder Anforderungen an den Wissenstransfer im Hinblick auf die Übergabe noch genauer betrachtet werden sollten.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Absicherung von Schlüsselpersonen und Erfahrungswissen insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie anhand Ihrer Einzelantworten, welche Fachaufgaben und welches Erfahrungswissen für die Fortführung des Unternehmens besonders relevant sind und wo eine zusätzliche Absicherung sinnvoll sein könnte.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen zur Absicherung von Schlüsselpersonen und Erfahrungswissen insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der einzelnen Antworten ist vor einer Übergabe besonders sinnvoll. Dabei sollte geklärt werden, welche personengebundenen Abhängigkeiten für die Fortführung des Unternehmens tatsächlich kritisch sind und deshalb gezielt betrachtet werden sollten.",
      },
    },
  },
  {
    id: 3,
    title: "Führung & Verantwortung",
    shortTitle: "Führung & Verantwortung",
    axisLabel: ["Führung &", "Verantwortung"],
    focus:
      "Wie weit kann die Führungsebene eigenständig handeln und Verantwortung übernehmen?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die Führungsebene in den abgefragten Bereichen eigenständig handeln und Verantwortung übernehmen kann. Betrachtet werden Entscheidungs- und Budgetbefugnisse, eigenständige Problembearbeitung, Rückversicherung beim Inhaber und die selbstständige Abstimmung im Führungsteam.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eigenständige Führung und Verantwortungsübernahme insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie im Hinblick auf die geplante Übergabe, ob dieses Niveau auch unter veränderten Eigentums- und Führungsverhältnissen tragfähig ist.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eigenständige Führung und Verantwortungsübernahme insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, wo die Eigenständigkeit der Führungsebene für die konkrete Übergabesituation noch weiter gestärkt werden sollte.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eigenständige Führung und Verantwortungsübernahme insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie anhand der Einzelantworten, in welchen Bereichen die Führungsebene bereits ausreichend eigenständig handeln kann und wo im Hinblick auf die Übergabe noch Klärungs- oder Entwicklungsbedarf besteht.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eigenständige Führung und Verantwortungsübernahme insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der Führungs- und Verantwortungsstrukturen ist vor einer Übergabe besonders sinnvoll. Entscheidend ist, welche der betrachteten Bereiche für die zukünftige Führungsstruktur besonders relevant sind.",
      },
    },
  },
  {
    id: 4,
    title: "Strukturen & Prozesse",
    shortTitle: "Strukturen & Prozesse",
    axisLabel: ["Strukturen", "& Prozesse"],
    focus:
      "Wie nachvollziehbar und organisatorisch abgesichert sind Arbeitsabläufe und Schnittstellen?",
    explanation:
      "Diese Dimension betrachtet die Nachvollziehbarkeit und organisatorische Absicherung der abgefragten Arbeitsabläufe und Schnittstellen. Betrachtet werden Dokumentation und Einarbeitbarkeit, Zuständigkeiten zwischen Abteilungen, das Verhältnis zwischen offiziellen Vorgaben und gelebter Praxis sowie festgelegte Abstimmungswege bei Konflikten.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen im Bereich Strukturen und Prozesse insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie, ob die vorhandenen Strukturen auch aus Sicht einer Person nachvollziehbar und nutzbar sind, die nicht auf langjährige informelle Kenntnis des Unternehmens zurückgreifen kann.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen im Bereich Strukturen und Prozesse insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, wo für eine Übergabe noch mehr Klarheit, Nachvollziehbarkeit oder personenunabhängige Absicherung sinnvoll sein könnte.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen im Bereich Strukturen und Prozesse insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie anhand Ihrer Einzelantworten, welche Abläufe und Schnittstellen für einen Nachfolger besonders relevant sind und wo deren Nachvollziehbarkeit oder organisatorische Absicherung genauer betrachtet werden sollte.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen im Bereich Strukturen und Prozesse insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der einzelnen Antworten ist vor einer Übergabe besonders sinnvoll. Dabei sollte geklärt werden, welche Strukturen und Abläufe für die Fortführung des Unternehmens besonders relevant und deshalb vorrangig zu betrachten sind.",
      },
    },
  },
  {
    id: 5,
    title: "Kultur & Identität",
    shortTitle: "Kultur & Identität",
    axisLabel: ["Kultur &", "Identität"],
    focus:
      "Wie unabhängig von der Person des Inhabers sind Orientierung und Zusammenarbeit im Alltag?",
    explanation:
      "Diese Dimension betrachtet, inwieweit die in den vier Items erfassten Orientierungsmuster und Formen der Zusammenarbeit von der Person des Inhabers unabhängig sind. Betrachtet werden inhaberbezogene Entscheidungsorientierung, Identifikation mit dem Unternehmen, Zusammenarbeit bei Inhaberabwesenheit und Offenheit gegenüber externen Führungskräften.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eine vom Inhaber unabhängige organisationale Orientierung insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie im Hinblick auf die konkrete Übergabe, ob diese Ausgangslage auch bei einer veränderten Rolle des bisherigen Inhabers und einer neuen Führung tragfähig bleibt.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eine vom Inhaber unabhängige organisationale Orientierung insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, welche davon für die Akzeptanz und Stabilität der konkreten Übergabe besonders relevant sein könnten.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eine vom Inhaber unabhängige organisationale Orientierung insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie anhand Ihrer Einzelantworten, in welchen Bereichen die Organisation bereits unabhängig von der Person des Inhabers funktioniert und wo die konkrete Übergabesituation eine vertiefte Betrachtung sinnvoll macht.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für eine vom Inhaber unabhängige organisationale Orientierung insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der einzelnen Antworten ist vor einer Übergabe besonders sinnvoll. Dabei sollte insbesondere geklärt werden, welche der erfassten Orientierungsmuster für den vorgesehenen Führungswechsel tatsächlich relevant sind.",
      },
    },
  },
  {
    id: 6,
    title: "Veränderungsfähigkeit & Anpassungsbereitschaft",
    shortTitle: "Veränderungsfähigkeit",
    axisLabel: ["Veränderungs-", "fähigkeit"],
    focus:
      "Wie geht die Organisation mit personellen und strukturellen Veränderungen um?",
    explanation:
      "Diese Dimension betrachtet, wie die Organisation in den abgefragten Bereichen mit personellen und strukturellen Veränderungen umgeht. Betrachtet werden Führungswechsel, veränderte Zuständigkeiten und Führungsstrukturen, Erfahrungen mit früheren organisatorischen Veränderungen sowie der Umgang mit der Anpassung bestehender Sonderregelungen.",
    levels: {
      stable: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für Veränderungsfähigkeit und Anpassungsbereitschaft insgesamt gut ausgeprägt sind.",
        impulse:
          "Prüfen Sie, welche Erfahrungen und vorhandenen Stärken aus bisherigen Veränderungen für die konkrete Übergabesituation genutzt werden können.",
      },
      observe: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für Veränderungsfähigkeit und Anpassungsbereitschaft insgesamt überwiegend ausgeprägt sind. Einzelne Teilaspekte können dabei unterschiedlich ausgeprägt sein.",
        impulse:
          "Betrachten Sie die vier abgefragten Bereiche einzeln und prüfen Sie, welche davon für die bevorstehende Übergabe besondere Aufmerksamkeit verdienen.",
      },
      develop: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für Veränderungsfähigkeit und Anpassungsbereitschaft insgesamt nur teilweise ausgeprägt sind.",
        impulse:
          "Prüfen Sie anhand Ihrer Einzelantworten, welche Arten von Veränderungen in der konkreten Übergabesituation zu erwarten sind und welche organisatorischen Voraussetzungen dafür besonders relevant sein werden.",
      },
      elevated: {
        interpretation:
          "Ihre Antworten deuten darauf hin, dass die betrachteten Voraussetzungen für Veränderungsfähigkeit und Anpassungsbereitschaft insgesamt gering ausgeprägt sind.",
        impulse:
          "Eine vertiefte Betrachtung der einzelnen Antworten ist vor einer Übergabe besonders sinnvoll. Dabei sollte geklärt werden, welche Veränderungen mit der vorgesehenen Nachfolgelösung tatsächlich verbunden sind und welche der betrachteten Voraussetzungen dafür besonders wichtig sind.",
      },
    },
  },
];

export function dimensionContent(id: DimensionId): DimensionContent {
  const content = DIMENSIONS.find((dimension) => dimension.id === id);
  if (!content) throw new Error(`Unbekannte Dimension: ${id}`);
  return content;
}

// ── Beta-Feedback (Spec Teil 4, Abschnitt 2) ─────────────────────────────────
// Freiwillige Beantwortung, keine Pflichtfragen.

export type FeedbackQuestion = {
  /** Spaltenname in der Tabelle uc_feedback. */
  key:
    | "q1_verstaendlichkeit"
    | "q2_vollstaendigkeit"
    | "q3_praxisabgleich"
    | "q4_anwendbarkeit"
    | "q5_verbesserung";
  label: string;
  question: string;
  placeholder: string;
};

export const FEEDBACK_QUESTIONS: readonly FeedbackQuestion[] = [
  {
    key: "q1_verstaendlichkeit",
    label: "Verständlichkeit",
    question:
      "Gab es Fragen, die Sie im ersten Moment nicht eindeutig beantworten konnten oder bei denen Sie dachten: „Das kommt ganz darauf an“? Wenn ja, welche?",
    placeholder: "z. B. Frage 3 in Dimension 4 …",
  },
  {
    key: "q2_vollstaendigkeit",
    label: "Vollständigkeit",
    question:
      "Fehlt aus Ihrer Sicht ein wesentlicher Aspekt, um die Unabhängigkeit eines Unternehmens vom Inhaber valide zu bewerten?",
    placeholder: "Was würden Sie ergänzen?",
  },
  {
    key: "q3_praxisabgleich",
    label: "Praxis-Abgleich",
    question:
      "Spiegelt das grafische Ergebnis (das Spiderweb-Diagramm) Ihre eigene, ehrliche Einschätzung Ihres Unternehmens realistisch wider?",
    placeholder: "Wo trifft es zu, wo nicht?",
  },
  {
    key: "q4_anwendbarkeit",
    label: "Anwendbarkeit",
    question:
      "Könnten Sie sich vorstellen, dieses Assessment mit Ihrer zweiten Führungsebene durchzuführen, um Wahrnehmungsunterschiede aufzudecken?",
    placeholder: "Was wäre dafür nötig?",
  },
  {
    key: "q5_verbesserung",
    label: "Verbesserung",
    question:
      "Welcher Begriff, welche Frage oder welcher Prozessschritt hat Sie beim Ausfüllen am meisten gestört?",
    placeholder: "Ganz offen …",
  },
];

// src/lib/uebergabe-check/report-blocks.ts
//
// Zusatzteile des persönlichen Ergebnis- und Arbeitsberichts.
// Die Profilzusammenfassung liegt in summary.ts, die Prüffelder in
// pruefelder.ts.

import { dimensionContent } from "./content";
import type { DimensionId } from "./items";
import type { DimensionScore, FlagDefinition } from "./scoring";

// ── Fragen für die interne Diskussion ───────────────────────────────────────
//
// Eigene Textfelder statt der Prüfimpulse aus der Spezifikation: Die
// Prüfimpulse sind Aufforderungen an den Inhaber („Prüfen Sie …“). Unter der
// Überschrift „Fragen für Ihre interne Diskussion“ braucht es offene Fragen,
// die man in einer Führungsrunde tatsächlich vorlesen kann.
//
// Inhaltlich decken sie denselben Sachverhalt ab wie der jeweilige Prüfimpuls.

export const DISCUSSION_TITLE = "Fragen für Ihre interne Diskussion";

export const DISCUSSION_INTRO =
  "Die folgenden Fragen greifen ausgewählte Auffälligkeiten und Prüfpunkte aus Ihrem Übergabeprofil auf. Grundlage der Auswahl sind Ihre Dimensionswerte und die in Ihren Einzelantworten erkennbaren Hinweise. Sie sind als Gesprächsimpulse gedacht, beispielsweise für den Austausch mit Ihrer Führungsebene, Mitgesellschaftern oder anderen Schlüsselpersonen. Die Auswahl ist bewusst auf fünf Fragen begrenzt.";

/** Gesprächsfrage je Item-Hinweis, Schlüssel ist die Flag-ID. */
const FLAG_QUESTIONS: Record<string, string> = {
  D1_I1_OPERATIVE_DECISION:
    "Bei welchen Störungen im Tagesgeschäft landet die Entscheidung heute beim Inhaber, obwohl sie auch im Team getroffen werden könnte?",
  D1_I2_CUSTOMER_NEGOTIATION:
    "Welche Kundenbeziehungen hängen so an einer Person, dass ein Wechsel für den Kunden spürbar wäre, und wie würden wir ihn darauf vorbereiten?",
  D1_I3_OWNER_ABSENCE:
    "Welche Entscheidungen, Freigaben oder Kundenkontakte würden tatsächlich ins Stocken geraten, wenn der Inhaber vier Wochen nicht erreichbar wäre?",
  D1_I4_LIMITS_MISSING:
    "Bis zu welchem Betrag und in welchen Fällen dürfen Mitarbeiter bei uns ohne Rückfrage entscheiden, und wissen sie das auch?",
  D2_I1_DEPUTY_MISSING:
    "Bei welchen geschäftskritischen Aufgaben hätten wir heute ein echtes Problem, wenn die zuständige Person für mehrere Wochen ausfiele?",
  D2_I3_KEY_PERSON_RISK:
    "Welches Wissen einer einzelnen Person würde uns fehlen, wenn sie das Unternehmen kurzfristig verließe, und an welcher anderen Stelle ist es noch vorhanden?",
  D3_I1_BUDGET_AUTONOMY:
    "Welche Entscheidungen dürfen unsere Führungskräfte formal treffen, und welche treffen sie tatsächlich?",
  D3_I3_BACK_DELEGATION:
    "In welchen Situationen sichern sich Führungskräfte bei uns ab, obwohl sie entscheiden dürften, und was hält sie davon ab?",
  D4_I1_DOCUMENTATION_GAP:
    "Was müsste eine neue Fachkraft bei uns wissen, das heute nirgends steht, sondern nur erfragt werden kann?",
  D4_I3_INFORMAL_ROUTINES:
    "An welchen Stellen weicht unsere gelebte Praxis von den offiziellen Vorgaben ab, und warum hat sich das so entwickelt?",
  D5_I1_OWNER_PREFERENCE:
    "Woran orientieren sich unsere Mitarbeiter bei Entscheidungen, wenn gerade keine Vorgabe des Inhabers vorliegt?",
  D5_I3_ABSENCE_IMPACT:
    "Was genau wird bei längerer Abwesenheit des Inhabers schwieriger, und woran liegt das aus Sicht der Beteiligten?",
  D6_I4_HISTORIC_RIGHTS_BLOCK:
    "Welche gewachsenen Sonderregelungen gibt es bei uns, und wie würden wir reagieren, wenn ein Nachfolger sie infrage stellt?",
};

/** Auffüllfrage je Dimension, wenn zu wenige Item-Hinweise vorliegen. */
const DIMENSION_QUESTIONS: Record<DimensionId, string> = {
  1: "Wo im Tagesgeschäft läuft heute noch etwas zwingend über den Inhaber, und was müsste sich ändern, damit es ohne ihn ginge?",
  2: "Bei welchen Aufgaben hängt unsere Leistungsfähigkeit an einer einzelnen Person?",
  3: "Welche Entscheidungen wollen wir künftig auf der Führungsebene sehen, die heute noch nach oben wandern?",
  4: "Was müsste jemand von außen über unsere Abläufe wissen, um sie führen zu können, ohne uns zu fragen?",
  5: "Wofür steht unser Unternehmen, unabhängig von der Person an der Spitze?",
  6: "Was hat bei früheren Veränderungen bei uns gut funktioniert, und was hat sie ausgebremst?",
};

/** Fünf Fragen lassen sich in einer Runde besprechen, zehn nicht. */
const DISCUSSION_COUNT = 5;

export type DiscussionPoint = {
  id: string;
  dimension: DimensionId;
  /** Worum es geht. */
  topic: string;
  /** Die eigentliche Gesprächsfrage. */
  question: string;
};

export function buildDiscussionPoints(
  scores: DimensionScore[],
  flags: FlagDefinition[]
): DiscussionPoint[] {
  // flags ist bereits nach interner Einstufung sortiert.
  const points: DiscussionPoint[] = [];
  for (const flag of flags) {
    if (points.length >= DISCUSSION_COUNT) break;
    const question = FLAG_QUESTIONS[flag.id];
    if (!question) continue;
    points.push({
      id: flag.id,
      dimension: flag.dimension,
      topic: flag.heading,
      question,
    });
  }

  // Auffüllen über die niedrigsten Dimensionen, damit auch ein gutes Profil
  // brauchbare Gesprächsimpulse erhält.
  const byScore = [...scores].sort(
    (a, b) => a.score - b.score || a.dimension - b.dimension
  );
  for (const entry of byScore) {
    if (points.length >= DISCUSSION_COUNT) break;
    const id = `dim-${entry.dimension}`;
    if (points.some((point) => point.id === id)) continue;
    points.push({
      id,
      dimension: entry.dimension,
      topic: dimensionContent(entry.dimension).title,
      question: DIMENSION_QUESTIONS[entry.dimension],
    });
  }

  return points;
}

// ── Hinweis auf den Perspektivvergleich ─────────────────────────────────────
//
// Erscheint im Bericht vor der Arbeitsseite. Der Vergleich selbst ist NICHT
// Teil des kostenlosen Schnellchecks, siehe comparison.ts.

export const PERSPECTIVE_TITLE = "Wie sehen andere Ihr Unternehmen?";

export const PERSPECTIVE_PARAGRAPHS: readonly string[] = [
  "Sie haben den Schnellcheck aus Ihrer Perspektive beantwortet. Gerade bei Verantwortung, Schlüsselwissen, informellen Strukturen und Kultur können andere Personen im Unternehmen dieselbe Organisation anders erleben.",
  "Eine interessante nächste Frage lautet deshalb: Wie würden Ihre Führungskräfte oder ausgewählte Schlüsselpersonen dieselben Themen einschätzen?",
  "Unterschiedliche Einschätzungen sind dabei nicht automatisch richtig oder falsch. Sie können sichtbar machen, an welchen Stellen unterschiedliche Wahrnehmungen bestehen und ein gemeinsames Gespräch besonders sinnvoll ist.",
];

// ── Arbeitsseite „Ihr nächster Schritt“ ─────────────────────────────────────
//
// Reine Oberfläche, keine Modellinhalte.

export const WORKSHEET_TITLE = "Ihr nächster Schritt";

export const WORKSHEET_INTRO =
  "Zum Ausdrucken und Ausfüllen, allein oder gemeinsam im Führungskreis.";

export const WORKSHEET_FIELDS: readonly {
  label: string;
  lines: number;
  /** Nummerierte Zeilen statt einfacher Linien. */
  numbered?: boolean;
}[] = [
  {
    label: "Drei Punkte, die ich genauer betrachten möchte",
    lines: 3,
    numbered: true,
  },
  { label: "Mit wem sollte ich diese Punkte besprechen?", lines: 2 },
  { label: "Welche Information fehlt mir noch?", lines: 2 },
  { label: "Was möchte ich innerhalb der nächsten 30 Tage klären?", lines: 2 },
];

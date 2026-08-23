// src/lib/uebergabe-check/self-check.ts
//
// Strukturprüfungen des Erhebungsinstruments, die bei jedem Start laufen.
//
// Hintergrund: Itemtext und Polarität liegen zwangsläufig an getrennten Stellen
// im Code. Wird ein Item umformuliert und die Polung nicht mitgezogen, rechnet
// das System still falsch, ohne dass irgendetwas abstürzt. Genau so ist der
// Fehler bei Item 1.4 entstanden.
//
// Diese Datei prüft deshalb die Invarianten, die sich maschinell prüfen lassen.
// Die semantische Frage, ob „Trifft voll zu“ eine bessere Voraussetzung oder
// eine stärkere Abhängigkeit bedeutet, kann Code nicht beantworten. Sie steht
// als Kontrollregel in der Dokumentation und wird beim Ändern eines Itemtexts
// von Hand entschieden.

import {
  DIMENSION_IDS,
  ITEMS,
  itemById,
  type LikertValue,
} from "./items";
import { FLAG_DEFINITIONS, transformItem } from "./scoring";

/**
 * Liefert alle gefundenen Verstöße als lesbare Meldungen. Leeres Array
 * bedeutet: alles konsistent.
 */
export function checkInstrumentIntegrity(): string[] {
  const problems: string[] = [];

  // ── Aufbau der Itemliste ──────────────────────────────────────────────────
  const ids = new Set<string>();
  for (const item of ITEMS) {
    if (ids.has(item.id)) problems.push(`Item-ID ${item.id} kommt doppelt vor.`);
    ids.add(item.id);

    if (item.id !== `${item.dimension}.${item.id.split(".")[1]}`) {
      problems.push(
        `Item ${item.id} steht in Dimension ${item.dimension}, die ID passt nicht dazu.`
      );
    }
    if (!item.text.trim()) {
      problems.push(`Item ${item.id} hat keinen Text.`);
    }
    for (const [role, text] of Object.entries(item.roleText ?? {})) {
      if (!text.trim()) {
        problems.push(`Item ${item.id} hat eine leere Variante für Rolle ${role}.`);
      }
    }
  }

  for (const dimension of DIMENSION_IDS) {
    const count = ITEMS.filter((item) => item.dimension === dimension).length;
    if (count !== 4) {
      problems.push(`Dimension ${dimension} hat ${count} Items statt vier.`);
    }
  }

  // ── Transformation ────────────────────────────────────────────────────────
  // Die volle Punktzahl muss immer die bessere Übergabevoraussetzung sein,
  // unabhängig von der Polung.
  for (const item of ITEMS) {
    const best: LikertValue = item.polarity === "positive" ? 5 : 1;
    const worst: LikertValue = item.polarity === "positive" ? 1 : 5;
    if (transformItem(item, best) !== 100 || transformItem(item, worst) !== 0) {
      problems.push(
        `Item ${item.id}: Die Transformation liefert für die Polung „${item.polarity}“ nicht 0 bis 100.`
      );
    }
  }

  // ── Flags gegen die Polung ────────────────────────────────────────────────
  // Ein Hinweis markiert immer eine Hürde. Bei einem positiv gepolten Item
  // liegt die Hürde bei niedrigen Antwortwerten, bei einem invers gepolten bei
  // hohen. Diese Prüfung hätte den Fehler bei Item 1.4 sofort gefunden.
  for (const flag of FLAG_DEFINITIONS) {
    const item = itemById(flag.itemId);
    if (!item) {
      problems.push(`Hinweis ${flag.id} verweist auf das unbekannte Item ${flag.itemId}.`);
      continue;
    }
    if (item.dimension !== flag.dimension) {
      problems.push(
        `Hinweis ${flag.id} ist Dimension ${flag.dimension} zugeordnet, Item ${flag.itemId} liegt aber in Dimension ${item.dimension}.`
      );
    }
    if (flag.trigger.length === 0) {
      problems.push(`Hinweis ${flag.id} hat keine auslösenden Antwortwerte.`);
      continue;
    }

    const expected = item.polarity === "positive" ? [1, 2] : [4, 5];
    const wrong = flag.trigger.filter((value) => !expected.includes(value));
    if (wrong.length > 0) {
      problems.push(
        `Hinweis ${flag.id} löst bei ${flag.trigger.join("/")} aus. ` +
          `Item ${flag.itemId} ist „${item.polarity}“ gepolt, dort markieren ` +
          `${expected.join("/")} die Hürde. Wurde der Itemtext gedreht, ohne den Trigger anzupassen?`
      );
    }
  }

  return problems;
}

/**
 * Wird beim Laden von scoring.ts ausgeführt.
 *
 * In der Entwicklung mit Absicht laut: eine falsche Polung erzeugt Ergebnisse,
 * die plausibel aussehen und trotzdem falsch sind. In der Produktion wird nur
 * geloggt, damit ein Textfehler nicht die ganze Seite lahmlegt.
 */
export function assertInstrumentIntegrity(): void {
  const problems = checkInstrumentIntegrity();
  if (problems.length === 0) return;

  const message =
    "Übergabe-Check, Instrument inkonsistent:\n" +
    problems.map((line) => `  • ${line}`).join("\n");

  if (process.env.NODE_ENV === "production") {
    console.error(message);
    return;
  }
  throw new Error(message);
}

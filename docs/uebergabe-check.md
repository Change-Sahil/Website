# Übergabe-Check – Betriebsanleitung

Kostenloser Schnellcheck zur organisationalen Übergabefähigkeit.
Umsetzung der Gesamtspezifikation Beta v1.0 (24 Items, 6 Dimensionen).

**URL:** `/de/uebergabe-check` — in der Beta bewusst `noindex`, nicht in der
Navigation und nicht in der Sitemap. Nur per direktem Link erreichbar.

---

## 1. Einmalige Einrichtung

### Supabase

1. Auf [supabase.com](https://supabase.com) ein Projekt anlegen. **Region:
   `eu-central-1` (Frankfurt).** Die Datenschutzerklärung sagt eine europäische
   Serverregion zu, und die Region lässt sich nach dem Anlegen nicht mehr
   ändern. Vor dem Klick auf „Create" prüfen.
2. **SQL Editor → New query** → Inhalt von [`supabase/uebergabe-check.sql`](../supabase/uebergabe-check.sql)
   einfügen → **Run**. Das legt vier Tabellen und die Auswertungs-View an.
3. **Database → Extensions** → `pg_cron` aktivieren. Danach
   [`supabase/uebergabe-check-loeschlogik.sql`](../supabase/uebergabe-check-loeschlogik.sql)
   ausführen. Ohne diesen Schritt laufen die Speicherfristen nicht ab, die in
   der Datenschutzerklärung zugesagt sind.
4. **Project Settings → Data API** → *Project URL* kopieren.
5. **Project Settings → API Keys** → *service_role* (secret) kopieren.

Kontrolle, dass die Löschlogik greift:

```sql
select * from cron.job where jobname = 'uc-purge-expired';
select * from public.uc_purge_expired();   -- sofort ausführen
```

### Umgebungsvariablen

Lokal in `.env.local`, produktiv in **Vercel → Settings → Environment Variables**:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Zusätzlich müssen die bereits vorhandenen Variablen gesetzt sein:
`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

> Der Service-Role-Key umgeht Row Level Security. Er darf ausschließlich
> serverseitig verwendet werden – niemals mit `NEXT_PUBLIC_` prefixen.

Ohne konfigurierte Datenbank bleibt der Check benutzbar: das Ergebnis wird
angezeigt, aber nicht gespeichert, und die Zusendung per Mail entfällt.

---

## 2. Was wo liegt

| Zweck | Datei |
| :--- | :--- |
| 24 Items, Polarität, Item-Version | [`src/lib/uebergabe-check/items.ts`](../src/lib/uebergabe-check/items.ts) |
| Scoring, Reifegradstufen, Flags | [`src/lib/uebergabe-check/scoring.ts`](../src/lib/uebergabe-check/scoring.ts) |
| Berichtstexte, Feedbackfragen | [`src/lib/uebergabe-check/content.ts`](../src/lib/uebergabe-check/content.ts) |
| Ablauf des Fragebogens | [`src/app/[locale]/uebergabe-check/check-client.tsx`](../src/app/%5Blocale%5D/uebergabe-check/check-client.tsx) |
| Netzdiagramm (Inline-SVG) | [`src/components/uebergabe-check/SpiderWeb.tsx`](../src/components/uebergabe-check/SpiderWeb.tsx) |
| Ergebnisbericht | [`src/components/uebergabe-check/Report.tsx`](../src/components/uebergabe-check/Report.tsx) |
| Zusatzteile des persönlichen Berichts | [`src/lib/uebergabe-check/report-blocks.ts`](../src/lib/uebergabe-check/report-blocks.ts) |
| Profilzusammenfassung | [`src/lib/uebergabe-check/summary.ts`](../src/lib/uebergabe-check/summary.ts) |
| Auswahl der Prüffelder | [`src/lib/uebergabe-check/pruefelder.ts`](../src/lib/uebergabe-check/pruefelder.ts) |
| Perspektivvergleich (Schalter, Rollen, Vergleichslogik) | [`src/lib/uebergabe-check/comparison.ts`](../src/lib/uebergabe-check/comparison.ts) |
| Deckblatt, Briefkopf, Schlussblatt im Druck | [`src/components/uebergabe-check/PrintFrame.tsx`](../src/components/uebergabe-check/PrintFrame.tsx) |
| Ergebnismail an den Nutzer | [`src/lib/uebergabe-check/report-email.ts`](../src/lib/uebergabe-check/report-email.ts) |
| Interne Benachrichtigung | [`src/lib/uebergabe-check/emails.ts`](../src/lib/uebergabe-check/emails.ts) |
| Datenbankschema | [`supabase/uebergabe-check.sql`](../supabase/uebergabe-check.sql) |
| Erweiterung Perspektivvergleich | [`supabase/uebergabe-check-perspektivvergleich.sql`](../supabase/uebergabe-check-perspektivvergleich.sql) |

Item-Texte und Berichtstexte sind reine Daten. Formulierungen lassen sich
ändern, ohne die Logik anzufassen.

---

## 2a. Die Wertstufen

Vier Stufen mit steigender Verbindlichkeit. Jede Stufe ist für sich nützlich,
keine hält etwas zurück, was zum Verstehen der vorherigen nötig wäre.

| Stufe | Was | Preis |
| :--- | :--- | :--- |
| 1 | Schnellcheck mit vollständigem Ergebnis | kostenlos, ohne Registrierung |
| 2 | Persönlicher Ergebnis- und Arbeitsbericht | gegen E-Mail-Adresse |
| 3 | Perspektivvergleich mehrerer Rollen | kostenpflichtig, **noch nicht gebaut**, siehe Abschnitt 6 |
| 4 | Gemeinsame Einordnung im Gespräch | Mandatsanbahnung |

Stufe 1 gegen Stufe 2 im Detail:

| | Ergebnisseite (frei) | Persönlicher Bericht (nach E-Mail) |
| :--- | :--- | :--- |
| Netzdiagramm und sechs Werte | ✓ | ✓ |
| Einordnung und Prüfimpuls je Dimension | ✓ | ✓ |
| Auffällig in Ihren Antworten | ✓ | ✓ |
| Zusammenfassung des Profils | – | ✓ |
| Ihre ausgewählten Prüffelder | – | ✓ (entfällt bei gutem Profil) |
| Fragen für die interne Diskussion | – | ✓ |
| Ausblick Perspektivvergleich | – | ✓ |
| Arbeitsseite „Ihr nächster Schritt" | – | ✓ |
| Deckblatt, Briefkopf, Schlussblatt im Druck | – | ✓ |
| Als PDF sichern | – | ✓ |

Der Bericht ist die Seite unter `/de/uebergabe-check/ergebnis/<uuid>`, erreichbar
nur über den Link aus der Mail. Kein separates PDF-Rendering: der Druck-Stylesheet
erzeugt daraus ein sauberes Dokument, und der Link lässt sich an die
Führungsebene weiterreichen.

### Die Ergebnismail

Sie ist die persönliche Zustellung eines angeforderten Arbeitsdokuments, keine
Marketingmail. Bewusst so gebaut und nicht ohne Grund ändern:

* kleines Logo statt Header-Banner, **kein Portraitfoto**. Der Nutzer kommt
  gerade aus einem sachlichen Diagnosetool
* **genau zwei Handlungen** mit klarer Rangfolge: Bericht öffnen als Button,
  Gespräch als Textlink. Kein Werkstattgespräch, kein LinkedIn, kein Newsletter
* **keine Ergebnistabelle.** Die Zahlen stehen im Bericht, die Mail stellt ihn
  zu. Eine Tabelle würde mit dem Dokument konkurrieren, das sie ankündigt
* Absender mit Anzeigename `Seref Sahil | Change-Werkstatt`, siehe
  `senderWithName()`. Kein `noreply@`
* Betreff: „Ihr persönliches Übergabeprofil"

### Profilzusammenfassung

Implementiert in [`summary.ts`](../src/lib/uebergabe-check/summary.ts), fünf
Bausteine, drei bis fünf Sätze:

| Baustein | Bedingung |
| :--- | :--- |
| `intro` | immer |
| `strong_dimensions` | mindestens eine Dimension ≥ 75 |
| `development_dimensions` | mindestens eine Dimension < 50 |
| `item_findings` | mindestens ein Item-Hinweis ausgelöst |
| `context_close` | immer |

Drei Sonderfälle ersetzen Baustein 2 und 3 durch eine Gesamtaussage: alle sechs
≥ 75, alle sechs < 50 (bewusst ohne Defizitlabel) und alle sechs zwischen 50 und
74. Genannt werden höchstens drei Dimensionen, sortiert nach Punktwert und bei
Gleichstand nach Dimensionsnummer.

Methodische Leitplanken, die beim Ändern von Texten gelten:

* nur bereits erhobene Dimensionsstufen und vorhandene Item-Hinweise
  zusammenführen, keine Ursachen, Dringlichkeiten oder Prioritäten behaupten
* nie von „Stärken" oder „Schwächen" sprechen, immer von den „betrachteten
  Voraussetzungen"
* keine Anzahl der Item-Hinweise nennen. „Fünf Risiken" würde dramatisieren
* für jede Scorekonstellation sachlich zutreffend bleiben

Alle vier Sonderfälle sind gegen die Spezifikation geprüft. Zwei Stellen sind
Auslegung und leicht änderbar: bei genannten Dimensionen unter 25 Punkten heißt
es „gering" statt „nur teilweise" ausgeprägt, und bei durchgehend hohen Werten
ersetzt ein eigener Satz den Standardhinweis auf die Item-Befunde, statt beide
nacheinander zu zeigen.

### Ihre ausgewählten Prüffelder

[`pruefelder.ts`](../src/lib/uebergabe-check/pruefelder.ts) wählt **höchstens
drei** Felder, je Dimension eines. Jedes Feld nennt: warum es für eine Übergabe
relevant ist, eine Frage zur internen Klärung und einen möglichen ersten
Schritt.

Die Auswahl gewichtet zwei Signale, die interne Flag-Priorität
(`PRIORITY_WEIGHT`) und die Dimensionsstufe (`LEVEL_WEIGHT`). Sichtbar wird
davon nichts, weder Rangnummer noch Punktzahl.

> Bei einem guten Profil ohne Hinweise bleibt die Liste **leer** und der ganze
> Abschnitt entfällt. Das ist Absicht: ein Bedarf wird nicht erfunden, nur weil
> der Bericht sonst dünner aussieht.

### Fragen für die interne Diskussion

`buildDiscussionPoints()` liefert bis zu `DISCUSSION_COUNT` (aktuell fünf)
offene Fragen. Grundlage sind die ausgelösten Item-Hinweise über
`FLAG_QUESTIONS`; reichen die nicht, füllen dimensionsbezogene Fragen aus
`DIMENSION_QUESTIONS` auf. Es sind echte Fragen, keine als Frage getarnten
Handlungsaufforderungen.

---

## 3. Datenfluss und Datenschutz

```
Fragebogen ausfüllen
      ↓  POST /api/uebergabe-check/submit
uc_assessments        ← ANONYM: nur Antworten, Scores, Flags. Kein Name, keine
      │                 E-Mail, keine IP.
      ├─ optional ─→  uc_leads      (nur bei ausdrücklichem Wunsch nach Zusendung)
      └─ optional ─→  uc_feedback   (Beta-Rückmeldung, ohne Personenbezug)
```

* Die **Einwilligung zur Zusendung** und die **Einwilligung zu späterer
  Kommunikation** sind getrennte Checkboxen und getrennte Spalten.
* Der Ergebnislink `/de/uebergabe-check/ergebnis/<uuid>` ist über eine
  Zufalls-UUID erreichbar, `noindex, nocache`.
* Die **deutsche Datenschutzerklärung** deckt den Check vollständig ab
  ([`datenschutz-de.tsx`](../src/app/%5Blocale%5D/datenschutz/datenschutz-de.tsx)).
  Die Fassungen in en/tr/es stehen weiterhin in den Message-Dateien und sind
  auf dem älteren Stand: vor dem öffentlichen MVP nachziehen.
* **Zugesagte Speicherfristen**, umgesetzt in
  [`uebergabe-check-loeschlogik.sql`](../supabase/uebergabe-check-loeschlogik.sql):
  Testdurchläufe ohne Kontaktdaten verlieren nach sechs Monaten das
  Herkunftsfeld, Kontaktdaten werden nach zwölf Monaten gelöscht. Danach ist
  der Datensatz personenbezugsfrei und darf als Statistik erhalten bleiben.
  **Wird `pg_cron` nicht aktiviert, verspricht die Datenschutzerklärung etwas,
  das das System nicht einhält.**

---

## 4. Kritische Punkte der Spezifikation

Diese Entscheidungen sind bewusst so umgesetzt und sollten nicht versehentlich
geändert werden:

* **Kein Gesamtscore.** Ein Mittelwert über alle 24 Items würde einzelne
  kritische Abhängigkeiten wegmitteln.
* **Zwei getrennte Ergebnisebenen.** Der Dimensionsscore trägt eine
  *non-kausale* Einordnung: er sagt, wie hoch das Niveau insgesamt liegt, nie
  warum. Konkrete Aussagen entstehen ausschließlich über die 13 Item-Hinweise
  unter „Auffällig in Ihren Antworten", weil diese direkt aus einer einzelnen
  Antwort stammen. Diese Trennung nicht aufweichen.
* **Flags verändern den Score nicht.** Ein Hinweis erscheint auch bei einem
  insgesamt guten Dimensionswert. Und die Reihenfolge der Hinweise ist keine
  Maßnahmenpriorität: was zuerst dran ist, hängt vom Übergabezeitpunkt und der
  Nachfolgekonstellation ab.
* **Die interne Einstufung bleibt intern.** `FlagPriority` (kritisch,
  erhöhte Aufmerksamkeit, Hinweis) steuert nur Sortierung und interne Mail. Die
  Spezifikation kennzeichnet ausschließlich Überschrift, Text, Prüfimpuls und
  Ansatzpunkt als nutzerseitige Felder.
* **Höchstens sechs Hinweise auf den ersten Blick.** `VISIBLE_FLAG_LIMIT` in
  `Report.tsx`: bis zu sechs Hinweise stehen offen, darüber bleibt je Dimension
  der wichtigste sichtbar und der Rest klappt aus. Eine Liste aus dreizehn
  Hinweisen liest sich als Mängelliste, nicht als Orientierung. Im Ausdruck
  sind alle Hinweise aufgeklappt.
* **Keine erzeugte Dringlichkeit.** Kein Text sagt „Sie sollten jetzt handeln".
  Stattdessen steht auf der Ergebnisseite, dass derselbe Wert bei zehn Jahren
  Vorlauf etwas anderes bedeutet als sechs Monate vor einer Übergabe
  (`CONTEXT_NOTE`).
* **Vollständigkeit je Dimension.** Ein Schritt lässt sich erst abschließen,
  wenn alle vier Items beantwortet sind. Ein Teilmittelwert wäre nicht
  interpretierbar.
* **Schwellenwerte sind nicht validiert.** Die Grenzen 0/25/50/75 strukturieren
  die Rückmeldung, sie klassifizieren kein Unternehmen. Die Nutzerkommunikation
  darf nicht behaupten, ein Betrieb sei objektiv übergabefähig oder nicht
  (Spec 2.4). Deshalb steht dieser Hinweis hier und nicht auf der Ergebnisseite.
* **`ITEM_VERSION`.** Bei *jeder* Änderung an Itemtext oder Polarität in
  `items.ts` hochzählen. Aktueller Stand: `beta-1.5`, entsprechend der finalen
  konsolidierten Spezifikation. Gegenüber der Vorfassung wurden neun Itemtexte
  angepasst und bei Item 1.4 sowie Item 5.4 die **Polarität gedreht**.

---

## 5. Rollout

### Phase 0 – Begleitete Pretests (n=3)

Läuft mit dem aktuellen Stand. Link direkt weitergeben.
Für die Zuordnung eignet sich ein Query-Parameter, der als `source`
mitgespeichert wird:

```
https://change-werkstatt-sahil.de/de/uebergabe-check?src=pretest-01
```

### Phase 1 – Online-Piloten (n=10–20)

Unverändert derselbe Stand. `BETA_MODE` in `check-client.tsx` steht auf `false`,
die fünf Feedbackfragen erscheinen also **nicht**. Tabelle, API-Route und
Formularkomponente bleiben erhalten: ein Umschalten auf `true` blendet sie
wieder ein.

Auswertung im Supabase SQL Editor:

```sql
select * from uc_beta_overview;
```

### Phase 2 – Öffentlicher MVP

1. `INDEXABLE = true` in [`src/app/[locale]/uebergabe-check/page.tsx`](../src/app/%5Blocale%5D/uebergabe-check/page.tsx)
2. `BETA_MODE` in `check-client.tsx` steht bereits auf `false`
3. `/uebergabe-check` in `staticPages` in [`src/app/sitemap.ts`](../src/app/sitemap.ts) ergänzen
4. Navigationseintrag in [`src/components/Header.tsx`](../src/components/Header.tsx) und Einstiegspunkte
   auf Startseite, Leistungen und in den Impulse-Artikeln setzen
5. `ITEM_VERSION` auf `mvp-1.0` setzen, falls Items überarbeitet wurden

---

## 6. Perspektivvergleich: vorbereitet, bewusst nicht gebaut

Ziel ist, dass Inhaber, Führungsebene und Schlüsselrollen dieselben 24 Items
beantworten und die Wahrnehmungslücke sichtbar wird. Beratungspraktisch ist das
der interessanteste Teil: „Inhaber sagt 81, Führungsteam sagt 44" erzeugt
Gesprächsbedarf, den ein einzelnes Profil nicht erzeugt.

**Was bereits vorbereitet ist:**

* `uc_assessments` hat `organization_id` und `respondent_role`, dazu die Tabelle
  `uc_organizations`. Mehrere Assessments je Unternehmen sind schreibbar.
* [`uebergabe-check-perspektivvergleich.sql`](../supabase/uebergabe-check-perspektivvergleich.sql)
  ergänzt `uc_comparisons` (klammert die Einzelchecks), `uc_comparison_invites`
  (ein Token je Teilnehmer), die Spalte `uc_assessments.comparison_id` und die
  View `uc_comparison_scores`. Die Rollenliste wächst auf `owner`, `management`,
  `leader`, `key_person`, `other`.
  **Noch nicht ausgeführt.** Bis dahin gilt: `comparison_id` darf nicht
  mitselektiert werden, sonst antwortet Supabase mit `42703` und die
  Ergebnisseite läuft ins Leere. Deshalb ist das Feld in
  [`db.ts`](../src/lib/uebergabe-check/db.ts) optional und aus dem Select
  ausgenommen.
* [`comparison.ts`](../src/lib/uebergabe-check/comparison.ts) enthält
  Rollenmodell, Gruppierung, Dimensions- und Itemvergleich sowie
  `MIN_GROUP_SIZE_FOR_AGGREGATE`. Der Hauptschalter `COMPARISON_ENABLED` steht
  auf `false`; **nur er** gibt den Vergleich frei, nicht die Migration.
* [`items.ts`](../src/lib/uebergabe-check/items.ts) kennt `roleText` und
  `itemText(item, role)`. Die Varianten sind bewusst **leer**, siehe Punkt 2.
* [`SpiderWeb.tsx`](../src/components/uebergabe-check/SpiderWeb.tsx) nimmt
  `series: ChartSeries[]` entgegen und zeichnet beliebig viele Profile
  übereinander, inklusive Legende. Achsenwerte erscheinen nur bei einer Serie.
  Ein überlagertes Diagramm ist damit eine Datenfrage, keine Neuentwicklung.
  Farbreihenfolge in `SERIES_COLORS`.

**Was fachlich vorher geklärt sein muss** (alles Sache des Modellentwicklers,
nicht der Umsetzung):

1. **Wer darf teilnehmen?** Rollenmodell, Mindestzahl je Rolle, Umgang mit
   Anonymität bei kleinen Gruppen (bei zwei Führungskräften ist eine Einzelantwort
   faktisch zuordenbar).
2. **Welche Items brauchen rollenspezifische Formulierungen?** Mehrere Items sind
   derzeit aus der Inhabersicht formuliert („ohne vorherige Freigabe des
   Inhabers"). Entweder bleiben sie identisch, oder es braucht minimale Varianten.
   Ohne diese Prüfung wird später nicht dasselbe Konstrukt verglichen.
3. **Wie werden Abweichungen interpretiert,** ohne daraus eine vermeintliche
   Wahrheit abzuleiten? Ab welcher Differenz gilt eine Abweichung als
   berichtenswert, und mit welcher Sprachregelung? Der Vergleich zeigt, wo
   Wahrnehmungen übereinstimmen und wo sie auseinanderliegen. Er zeigt nicht die
   „tatsächliche Übergabefähigkeit".

4. **Ab welcher Differenz ist eine Abweichung berichtenswert?**
   `HEURISTIC_SPREAD_BANDS` in `comparison.ts` enthält vorläufige Schwellen,
   ausdrücklich als Heuristik gekennzeichnet. Sie sind nicht validiert und
   dürfen ohne fachliche Freigabe nicht in einen ausgelieferten Bericht.
5. **Die Texte des Perspektivberichts** existieren noch nicht. Im persönlichen
   Bericht steht bisher nur der Ausblick `PERSPECTIVE_PARAGRAPHS`.

Erst danach programmieren. In Beta v1.0 laufen alle Datensätze mit
`organization_id = null`, `comparison_id = null` und `respondent_role = 'owner'`.

---

## 7. Drucklayout

Der Bericht wird nicht als PDF gerendert, sondern über das Print-Stylesheet in
[`globals.css`](../src/app/globals.css) gedruckt (Block `@media print`).

* `@page { size: A4 }` ist zwingend. Ohne die Angabe druckt Chrome je nach
  Systemvorgabe US Letter, und das Deckblatt ist auf A4 bemessen.
* Die Schriftgrößen müssen **einzeln** überschrieben werden. Fast jeder Text
  trägt eine explizite Tailwind-Klasse wie `text-[15px]`, und die schlägt eine
  am Container geerbte Größe. Der Punkt in einem arbiträren Wert wird von
  Tailwind zu `\.` maskiert: `.text-\[12\.5px\]`.
* Ausgeblendet wird `body > header` und `body > footer`, nicht `header`.
  Ein pauschaler Selektor träfe auch die Überschrift des Berichts.
* **Kein** `break-inside: avoid` auf Panels und Sections. Eine Dimension füllt
  oft zwei Drittel einer Seite; ein unerfüllbares Umbruchverbot zwingt jede
  Dimension auf eine neue Seite und verdoppelt das Dokument fast. Geschützt wird
  nur, was zusammengehört: `.uc-avoid-break`.
* Überschriften tragen `break-after: avoid`, sonst steht eine Abschnitts-
  überschrift als letzte Zeile einer Seite.
* `.uc-print-cover-inner { min-height: 238mm }` liegt bewusst deutlich unter dem
  Satzspiegel von 269mm. Bei 265mm schob die Fußzeile des Deckblatts eine
  zweite, ansonsten leere Seite an.
* Die Arbeitsseite ist die einzige Ausnahme von der Verdichtung. Ihre Abstände
  sind über `.uc-worksheet` in Millimetern bemessen, weil dort mit der Hand
  geschrieben wird.

Geprüfter Stand über vier Antwortprofile, ohne leere Seiten, Waisenzeilen oder
Überschriften am Seitenfuß:

| Profil | Seiten |
| :--- | ---: |
| alle Dimensionen 100, keine Hinweise | 9 |
| alle Dimensionen 50, keine Hinweise | 9 |
| gemischt, sechs Hinweise | 12 |
| alle Dimensionen 0, dreizehn Hinweise | 13 |

Die Seitenzahl schwankt mit der Zahl der Hinweise, und das ist richtig so: bei
dreizehn Hinweisen steht mehr im Bericht. Nicht künstlich auf eine feste
Seitenzahl optimieren.

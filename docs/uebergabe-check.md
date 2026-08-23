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
| 24 Items, Polarität, Rollenvarianten, Item-Version | [`src/lib/uebergabe-check/items.ts`](../src/lib/uebergabe-check/items.ts) |
| Scoring, Reifegradstufen, Flags | [`src/lib/uebergabe-check/scoring.ts`](../src/lib/uebergabe-check/scoring.ts) |
| Strukturprüfung des Instruments | [`src/lib/uebergabe-check/self-check.ts`](../src/lib/uebergabe-check/self-check.ts) |
| Berichtstexte, Feedbackfragen | [`src/lib/uebergabe-check/content.ts`](../src/lib/uebergabe-check/content.ts) |
| Ablauf des Fragebogens | [`src/app/[locale]/uebergabe-check/check-client.tsx`](../src/app/%5Blocale%5D/uebergabe-check/check-client.tsx) |
| Netzdiagramm (Inline-SVG) | [`src/components/uebergabe-check/SpiderWeb.tsx`](../src/components/uebergabe-check/SpiderWeb.tsx) |
| Ergebnisbericht | [`src/components/uebergabe-check/Report.tsx`](../src/components/uebergabe-check/Report.tsx) |
| Zusatzteile des persönlichen Berichts | [`src/lib/uebergabe-check/report-blocks.ts`](../src/lib/uebergabe-check/report-blocks.ts) |
| Profilzusammenfassung | [`src/lib/uebergabe-check/summary.ts`](../src/lib/uebergabe-check/summary.ts) |
| Auswahl der Prüffelder | [`src/lib/uebergabe-check/pruefelder.ts`](../src/lib/uebergabe-check/pruefelder.ts) |
| Perspektivvergleich, Rollen und Vergleichslogik | [`src/lib/uebergabe-check/comparison.ts`](../src/lib/uebergabe-check/comparison.ts) |
| Perspektivvergleich, Datenzugriff | [`src/lib/uebergabe-check/comparison-db.ts`](../src/lib/uebergabe-check/comparison-db.ts) |
| Vergleichsauswertung | [`src/components/uebergabe-check/ComparisonReport.tsx`](../src/components/uebergabe-check/ComparisonReport.tsx) |
| Einladungen verwalten | [`src/components/uebergabe-check/ComparisonManager.tsx`](../src/components/uebergabe-check/ComparisonManager.tsx) |
| Einstieg in den Vergleich (CTA) | [`src/components/uebergabe-check/PerspectiveBlock.tsx`](../src/components/uebergabe-check/PerspectiveBlock.tsx) |
| Buchungslinks, alle Sprachen | [`src/lib/booking.ts`](../src/lib/booking.ts) |
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

| Stufe | Beantwortet die Frage | Preis |
| :--- | :--- | :--- |
| 1 | „Wie sehe ich die Übergabefähigkeit meines Unternehmens?“ | kostenlos, ohne Registrierung |
| 2 | dasselbe, dokumentiert und vertieft als Arbeitsbericht | gegen E-Mail-Adresse |
| 3 | „Sehen die Menschen, die das Unternehmen mittragen müssen, es genauso?“ | kostenlos, siehe Abschnitt 6 |
| 4 | „Was bedeuten diese Unterschiede für unsere konkrete Übergabe?“ | Einordnungsgespräch, Mandatsanbahnung |

Der Perspektivvergleich liegt bewusst **nicht** hinter einer Bezahlschranke.
Er soll genug Erkenntnis erzeugen, dass ein relevanter Klärungsbedarf sichtbar
wird, ohne dessen Ursache oder Lösung zu behaupten. Genau dort beginnt die
Beratungsleistung.

Stufe 1 gegen Stufe 2 im Detail:

| | Ergebnisseite (frei) | Persönlicher Bericht (nach E-Mail) |
| :--- | :--- | :--- |
| Netzdiagramm und sechs Werte | ✓ | ✓ |
| Einordnung und Prüfimpuls je Dimension | ✓ | ✓ |
| Auffällig in Ihren Antworten | ✓ | ✓ |
| Einstieg in den Perspektivvergleich | ✓ | ✓ |
| Zusammenfassung des Profils | – | ✓ |
| Prüffelder für Ihre Übergabe | – | ✓ (entfällt bei gutem Profil) |
| Fragen für die interne Diskussion | – | ✓ |
| Arbeitsseite „Vom Ergebnis zur nächsten Klärung" | – | ✓ |
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

Implementiert in [`summary.ts`](../src/lib/uebergabe-check/summary.ts). **Genau
drei** beschriftete Absätze, feste Länge, nur der Inhalt hängt vom Profil ab:

| Absatz | Inhalt |
| :--- | :--- |
| Was bereits trägt | Dimensionen ≥ 75. Gibt es keine, der vergleichsweise stabilste Bereich. |
| Wo genaueres Hinsehen lohnt | Dimensionen < 50. Gibt es keine, der schwächste Bereich. |
| Was das für eine Übergabe bedeutet | Kontext, plus ein Satz zu den Item-Hinweisen, falls welche vorliegen. |

Jeder Absatz wird immer gefüllt: eine Überschrift ohne Text sähe aus wie ein
Fehler. Genannt werden höchstens zwei Dimensionen je Absatz.

Frühere Fassungen hatten bis zu fünf Bausteine samt Einleitung und einer
Erläuterung der Item-Hinweise. Beides ist bewusst entfallen. Der Abschnitt
markiert den Übergang von „Auswertung lesen" zu „damit arbeiten" und führt
direkt in die Prüffelder.

Methodische Leitplanken, die beim Ändern von Texten gelten:

* nur bereits erhobene Dimensionsstufen zusammenführen, keine Ursachen,
  Dringlichkeiten oder Prioritäten behaupten
* nie von „Stärken" oder „Schwächen" sprechen, immer von den „betrachteten
  Voraussetzungen"
* keine Anzahl der Item-Hinweise nennen, das würde dramatisieren
* für jede Scorekonstellation sachlich zutreffend bleiben, auch wenn alle sechs
  Werte identisch sind

### Prüffelder für Ihre Übergabe

[`pruefelder.ts`](../src/lib/uebergabe-check/pruefelder.ts) wählt **höchstens
drei** Felder, je Dimension eines. Die Anzahl steht in der Überschrift
(`pruefelderTitle`), sie muss deshalb zur tatsächlichen Liste passen. Jedes Feld nennt: warum es für eine Übergabe
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
  `items.ts` hochzählen. Aktueller Stand: `beta-2.0`, entsprechend der finalen
  Item-Matrix der Spezifikation Perspektivvergleich. Gegenüber `beta-1.5`
  kamen Rollenvarianten hinzu, dreizehn Itemtexte wurden angepasst und bei
  Item 1.4 sowie Item 5.4 die **Polarität gedreht** (1.4 jetzt positiv,
  5.4 jetzt invers).

### Buchungslinks

Alle „Bookings with me"-Links stehen in [`booking.ts`](../src/lib/booking.ts)
und nirgends sonst. Eine gültige URL hat die Form

```
.../bookwithme/user/<id>@<domain>/meetingtype/<typ>?anonymous
```

Der Teil ab `@` ist **nicht** optional. Im Übergabe-Check war an vier Stellen
eine gekürzte Fassung ohne Domain und ohne `meetingtype` in Umlauf; Microsoft
antwortet darauf mit „Dieser Link ist ungültig". Betroffen waren Ergebnisseite,
Bericht, Vergleichsauswertung, PDF-Schlussblatt und die Ergebnismail. Dieselbe
Fehlerklasse wie bei der Polung: dieselbe Information an mehreren Stellen.

### Die Polungsregel

Itemtext und Polarität liegen zwangsläufig an getrennten Stellen. Wird ein Item
umformuliert und die Polung nicht mitgezogen, rechnet das System still falsch,
ohne dass etwas abstürzt. Genau so ist der Fehler bei Item 1.4 entstanden.

> **Kontrollregel.** Bedeutet „Trifft voll zu“ eine **bessere
> Übergabevoraussetzung**, ist das Item **positiv**. Bedeutet es eine
> **stärkere Abhängigkeit oder Hürde**, ist es **invers**.

Diese Frage muss beim Ändern eines Itemtexts von Hand entschieden werden, Code
kann sie nicht beantworten. Was Code prüfen kann, prüft
[`self-check.ts`](../src/lib/uebergabe-check/self-check.ts) bei jedem Start,
ausgelöst vom ersten `computeScores()`:

* 24 Items, eindeutige IDs, vier je Dimension, kein leerer Text oder Rollentext
* volle Punktzahl entspricht immer der besseren Voraussetzung
* **Flag-Trigger gegen die Polung:** Ein Hinweis markiert immer eine Hürde. Bei
  einem positiv gepolten Item liegt sie bei 1 und 2, bei einem invers gepolten
  bei 4 und 5. Jede andere Kombination ist ein Fehler.

In der Entwicklung wirft die Prüfung, in der Produktion loggt sie nur: ein
Textfehler soll nicht die ganze Seite lahmlegen. Es gibt bewusst nur **eine**
Scoring-Implementierung (`transformItem`), die Client, API-Route,
Berichtsseite und Vergleichslogik gemeinsam nutzen. Eine zweite Polungstabelle
an anderer Stelle wäre genau die Altlast, die auseinanderläuft.

Stand der Prüfung: alle 24 Items und alle 13 Flag-Trigger sind konsistent,
neun Items invers (1.1, 1.2, 2.3, 3.3, 4.3, 5.1, 5.3, 5.4, 6.4), fünfzehn
positiv.

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

## 6. Perspektivvergleich

Inhaber, Führungskräfte und Schlüsselpersonen beantworten dieselben 24 Items
aus ihrer jeweiligen Rolle. Sichtbar wird die Wahrnehmungslücke: „Inhaber sagt
81, Führungsebene sagt 44" erzeugt Gesprächsbedarf, den ein einzelnes Profil
nicht erzeugt.

> **Migrationen** (Supabase SQL Editor, in dieser Reihenfolge):
> [`uebergabe-check-perspektivvergleich.sql`](../supabase/uebergabe-check-perspektivvergleich.sql),
> danach
> [`uebergabe-check-loeschlogik-vergleich.sql`](../supabase/uebergabe-check-loeschlogik-vergleich.sql).
> Ohne die erste bleibt der Einzelcheck vollständig funktionsfähig; der Button
> „Perspektivvergleich starten" meldet dann sauber, dass die Einrichtung fehlt.

### Ablauf

```
Einzelcheck abschließen
      ↓  „Perspektivvergleich starten“
POST /api/uebergabe-check/vergleich  { action: "create" }
      ↓  legt uc_comparisons an, hängt das eigene Assessment als owner daran
/de/uebergabe-check/vergleich/<manage_token>
      ├─ Vergleich benennen
      ├─ je Teilnehmer einen Einladungslink erzeugen (Rolle + optionale Notiz)
      └─ Auswertung, sobald eine zweite Rolle geantwortet hat
                  ↑
/de/uebergabe-check/teilnehmen/<invite_token>
      Rollenspezifische Itemtexte, danach eine Dankseite. KEIN Einzelbericht:
      alle Einordnungstexte sind an den Inhaber adressiert.
```

### Zugangsmodell

Kein Login, der Check ist anonym nutzbar. Zugriff regeln zwei Geheimnisse:

| Token | Wer | Darf |
| :--- | :--- | :--- |
| `manage_token` | Initiator | Auswertung sehen, einladen, zurückziehen, umbenennen |
| `invite token` | Teilnehmer | genau einmal antworten, sieht die Auswertung **nicht** |

Beide stehen nur im jeweiligen Link. Der Verwaltungslink lässt sich nicht
wiederherstellen, deshalb steht auf der Seite die Aufforderung, ihn als
Lesezeichen zu speichern. Rolle und Vergleichszuordnung liest der Server
ausschließlich aus dem Token, nie aus dem Request: sonst könnte jeder Antworten
in einen fremden Vergleich schreiben oder sich eine andere Rolle geben.

### Rollen und Itemvarianten

Drei Rollen: `owner`, `leader`, `key_person`. Die Rollenvariante darf
ausschließlich die Perspektive der Formulierung ändern, niemals das gemessene
Konstrukt. Item-ID, Dimension, Polung und Scoring bleiben identisch, sonst
vergleichen die Rollen nicht mehr dasselbe.

Varianten hinterlegt bei **1.3, 3.1, 3.2, 3.3, 3.4, 5.1 und 5.3**. Die übrigen
17 Items sind neutral formuliert und für alle Rollen gleich. Das ist Absicht:
drei künstlich unterschiedliche Fragebögen wären methodisch schlechter.

Bei 3.1 bis 3.3 antwortet die Führungskraft in der **Ich-Perspektive**. Gerade
die Differenz zwischen zugestandener und erlebter Autonomie ist der
interessante Befund.

### Aggregation und Abweichung

* Dimensionswert je Teilnehmer berechnen, **dann** je Rolle mitteln. Nicht
  umgekehrt, sonst wäre die Polung nicht sauber angewendet.
* Kein Gesamtscore, auch nicht über Rollen hinweg.
* Abweichung = größter Abstand zweier Rollen in einer Dimension.

| Differenz | Darstellung |
| ---: | :--- |
| 0–9 | weitgehend ähnliche Einschätzung |
| 10–24 | unterschiedliche Einschätzung |
| ab 25 | deutlich unterschiedliche Einschätzung |

**Heuristische Orientierungswerte, keine validierten Cut-offs.** Sie steuern nur
die Auswahl und Darstellung der Vergleichspunkte. `HEURISTIC_DISCLOSURE` sagt
das dem Nutzer auch.

Auf Itemebene gilt dieselbe Skala: ein Likert-Schritt entspricht 25 Punkten.
Gezeigt werden höchstens vier Itemabweichungen, und nur innerhalb der
auffälligen Dimensionen. Alle 24 anzuzeigen macht die Auswertung unlesbar.

### Was der Vergleich nicht sagen darf

Diese Grenze ist der eigentliche Kern, nicht die Technik:

* keine Aussage, welche Perspektive zutrifft
* kein „der Inhaber überschätzt seine Organisation"
* kein „die Führungskräfte sehen die Realität kritischer"
* kein „hier besteht ein Wahrnehmungsproblem"
* keine Ursachendiagnose aus einer Differenz
* **keine Anonymität behaupten.** Bei zwei Führungskräften ist eine
  Einzelantwort faktisch zuordenbar. `SMALL_GROUP_NOTE` steht deshalb sowohl
  beim Einladen als auch vor der Teilnahme.

Sonderfall eine Person je Rolle: Dann heißt es „Perspektive Führungskraft“,
nicht „Perspektive Führungsebene“. `roleLabel()` entscheidet das anhand der
Gruppengröße. Von einer zusammengefassten Sicht darf erst ab zwei Teilnehmern
gesprochen werden.

### Klärungsfragen auf Itemebene

Jedes der 24 Items trägt in [`items.ts`](../src/lib/uebergabe-check/items.ts)
zwei Felder für den Vergleich:

* `topic` – Kurzbezeichnung, Überschrift des Blocks
* `clarificationQuestion` – offene Frage für das gemeinsame Gespräch

Sie liegen bewusst direkt am Item und nicht in einer eigenen Tabelle: dieselbe
Begründung wie bei der Polung. Was zusammengehört, soll nicht auseinanderlaufen.
`self-check.ts` prüft, dass beide Felder gefüllt sind.

Ausgabe:

```
Unterschiedliche Wahrnehmung bei
[topic]
[Itemwortlaut in der Inhaberfassung]

  Inhaber/Geschäftsführung   4,5 / 5
  Perspektive Führungsebene  2,3 / 5

Für das gemeinsame Gespräch
[clarificationQuestion]
```

Regeln: höchstens fünf Blöcke (`MAX_ITEM_COMPARISONS`), höchstens zwei je
Dimension (`MAX_ITEMS_PER_DIMENSION`), priorisiert nach der größten Abweichung.
`CLARIFICATION_INTRO` steht **einmal** über dem Abschnitt, nicht bei jeder
Frage.

Die Fragen erscheinen ausschließlich im Perspektivvergleich und nur bei
tatsächlicher Abweichung. Sie sind keine Diagnose darüber, welche Perspektive
richtig ist. Item 5.4 fragt deshalb nach der Herkunft der unterschiedlichen
Einschätzungen und nicht nach den Gründen der Skepsis: Letzteres würde
voraussetzen, dass Skepsis besteht.

Erreicht keine einzelne Aussage die Schwelle, obwohl eine Dimension auffällt,
greift `fallbackQuestions()` mit der allgemeineren Dimensionsfrage.

### Speicherfrist

[`uebergabe-check-loeschlogik-vergleich.sql`](../supabase/uebergabe-check-loeschlogik-vergleich.sql)
erweitert `uc_purge_expired()`: Ein Vergleich wird **zwölf Monate nach der
letzten Aktivität** gelöscht. Letzte Aktivität ist das jüngste aus Anlage,
Einladung und eingegangener Einschätzung, berechnet in der View
`uc_comparison_activity`.

Zwölf Monate, weil ein Vergleich personenbezogen nutzbar ist: Der
Verwaltungslink identifiziert den Initiator, und bei kleinen Gruppen sind
Einzelantworten faktisch zuordenbar. Die Einladungen hängen per
`ON DELETE CASCADE` daran, die Assessments per `ON DELETE SET NULL` – sie
verlieren nur die Zuordnung zueinander und fallen danach unter die bestehende
Sechsmonatsregel. Der Cron-Job ruft dieselbe Funktion auf und muss nicht neu
eingerichtet werden.

### Was noch offen ist

* **Kein E-Mail-Versand an Teilnehmer.** Eingeladen wird über kopierbare Links.
  Würden hier die Adressen der Führungskräfte eingetragen, verarbeiteten wir
  personenbezogene Daten Dritter, die nie eingewilligt haben. Das braucht
  vorher eine Ergänzung der Datenschutzerklärung. Bewusste Entscheidung, nicht
  Rückstand: nachrüsten, wenn sich im Einsatz zeigt, dass es gebraucht wird.
* **Die Datenschutzerklärung nennt den Perspektivvergleich noch nicht.** Vor
  dem öffentlichen Start ergänzen: Vergleichsdaten, Zwölfmonatsfrist, Hinweis
  auf die faktische Zuordenbarkeit bei kleinen Gruppen.



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
| gemischt, mehrere Hinweise | 12 |
| alle Dimensionen 0, alle Hinweise | 13 |

Geprüft wird maschinell mit PyMuPDF über den Textstrom je Seite: leere Seiten,
Seiten mit höchstens drei Zeilen, und Überschriften, die als letzte Zeile einer
Seite stehen. Zwei Fehlerklassen sind dabei aufgefallen und behoben: das
Deckblatt schob eine leere Seite an, und der Kopf einer Dimension zerfiel in
Titel/Punktwert am Seitenfuß und Reifegradstufe auf der Folgeseite
(`uc-avoid-break` auf der Kopfzeile).

Die Seitenzahl schwankt mit der Zahl der Hinweise, und das ist richtig so: bei
dreizehn Hinweisen steht mehr im Bericht. Nicht künstlich auf eine feste
Seitenzahl optimieren.

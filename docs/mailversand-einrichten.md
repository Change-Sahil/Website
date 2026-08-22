# Mailversand einrichten (Resend)

Schritt-für-Schritt-Anleitung. Reihenfolge einhalten, Schritt 2 dauert am
längsten, weil DNS-Änderungen Zeit brauchen.

---

## Ausgangslage (geprüft am 22.08.2026)

| Prüfpunkt | Befund |
| :--- | :--- |
| `RESEND_API_KEY` in `.env.local` | vorhanden, aber von Resend **abgelehnt**: „API key is invalid" |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` — Resends Testabsender |
| `CONTACT_TO_EMAIL` | nicht gesetzt |
| `NEXT_PUBLIC_SITE_URL` | nicht gesetzt |
| Verifizierte Domain in Resend | konnte nicht geprüft werden, Key ungültig |

**Warum das für den Schnellcheck nicht reicht:** `onboarding@resend.dev` ist ein
Testabsender. Damit lassen sich E-Mails **ausschließlich an die eigene
Kontoadresse** senden. Das Kontaktformular funktioniert damit, weil es an dich
selbst schreibt. Der Ergebnisbericht geht aber an fremde Adressen und würde von
Resend abgelehnt. Dafür braucht es eine eigene, verifizierte Absenderdomain.

---

## Schritt 1: Neuen API-Key erzeugen

1. Auf [resend.com](https://resend.com) einloggen.
2. Links **API Keys** → **Create API Key**.
3. Name z. B. `change-werkstatt-produktiv`, Permission **Sending access**.
4. Key kopieren. **Er wird nur einmal angezeigt.**

---

## Schritt 2: Absenderdomain verifizieren

Das ist der eigentliche Freischaltschritt.

1. In Resend links **Domains** → **Add Domain**.
2. Domain eintragen: `change-werkstatt-sahil.de`
3. Region: **Europe (Ireland)** wählen. Passt zur Zusage in der
   Datenschutzerklärung, dass europäische Serverregionen genutzt werden.
4. Resend zeigt jetzt drei bis vier DNS-Einträge an, typischerweise:

   | Typ | Name | Zweck |
   | :--- | :--- | :--- |
   | `MX` | `send` | Rückläufer und Bounces |
   | `TXT` | `send` | SPF, erlaubt Resend den Versand |
   | `TXT` | `resend._domainkey` | DKIM-Signatur |
   | `TXT` | `_dmarc` | optional, empfohlen |

5. Diese Einträge bei deinem Domain-Anbieter im DNS anlegen.

   **Häufigster Fehler:** Viele Anbieter hängen die Domain automatisch an. Wenn
   Resend `send.change-werkstatt-sahil.de` anzeigt, trägst du dort nur `send`
   ein. Sonst entsteht `send.change-werkstatt-sahil.de.change-werkstatt-sahil.de`
   und die Verifizierung schlägt fehl.

6. Zurück in Resend auf **Verify DNS Records**. Der Status springt auf
   `Verified`, sobald die Einträge sichtbar sind. Meist wenige Minuten,
   je nach Anbieter bis zu 24 Stunden.

---

## Schritt 3: Umgebungsvariablen setzen

### Lokal in `.env.local`

```
RESEND_API_KEY=re_dein_neuer_key
CONTACT_FROM_EMAIL=info@change-werkstatt-sahil.de
CONTACT_TO_EMAIL=seref.sahil@change-werkstatt-sahil.com
NEXT_PUBLIC_SITE_URL=https://change-werkstatt-sahil.de
```

* `CONTACT_FROM_EMAIL` **muss** auf der in Schritt 2 verifizierten Domain
  liegen. Ein Postfach dahinter ist nicht nötig.
* `CONTACT_TO_EMAIL` ist dein tatsächlich gelesenes Postfach. Dorthin gehen die
  internen Benachrichtigungen, und dorthin gehen auch Antworten auf den
  Ergebnisbericht (`replyTo`).
* `NEXT_PUBLIC_SITE_URL` wird für das Logo und die Links in der Mail gebraucht.
  Ohne diese Variable greift die Produktions-URL als Rückfallwert.

### Auf Vercel

Dieselben vier Variablen unter **Settings → Environment Variables**, jeweils für
*Production*, *Preview* und *Development*. Danach **einmal neu deployen**,
Vercel übernimmt geänderte Variablen nicht in bestehende Deployments.

---

## Schritt 4: Versand testen

Ohne die App, direkt gegen die Resend-API. In PowerShell im Projektordner:

```powershell
$env:RESEND_KEY = "re_dein_neuer_key"
$body = @{
  from    = "Seref Sahil | Change-Werkstatt <info@change-werkstatt-sahil.de>"
  to      = @("deine.testadresse@example.com")
  subject = "Testversand Change-Werkstatt"
  text    = "Wenn diese Mail ankommt, funktionieren Key und Domain."
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://api.resend.com/emails" `
  -Headers @{ Authorization = "Bearer $($env:RESEND_KEY)"; "Content-Type" = "application/json" } `
  -Body $body
```

**Wichtig:** Als Empfänger eine Adresse nehmen, die *nicht* dir gehört, zum
Beispiel eine private Adresse bei einem anderen Anbieter. Nur so zeigt sich, ob
die Domainverifizierung wirklich greift. Mit dem Testabsender an die eigene
Adresse funktioniert es auch ohne verifizierte Domain, und der Fehler fällt erst
beim ersten echten Nutzer auf.

Erwartete Antwort: ein JSON mit einer `id`. Typische Fehler:

| Fehlermeldung | Ursache |
| :--- | :--- |
| `API key is invalid` | Key falsch kopiert oder widerrufen |
| `The ... domain is not verified` | Schritt 2 nicht abgeschlossen |
| `You can only send testing emails to your own email address` | `from` liegt noch auf `resend.dev` |

---

## Schritt 5: Vollständiger Durchlauf

Erst möglich, wenn **auch Supabase eingerichtet** ist, siehe
[uebergabe-check.md](uebergabe-check.md). Der Ergebnisbericht braucht einen
gespeicherten Testfall, sonst gibt es keinen Link zum Versenden.

1. `npm run dev`
2. `/de/uebergabe-check` vollständig ausfüllen
3. Unten „Ergebnisbericht anfordern" mit einer echten Adresse
4. Prüfen: Kommt die Mail an, stimmt der Absendername, öffnet der Link den
   Bericht, ist die interne Benachrichtigung bei dir eingegangen?

---

## Zustellbarkeit

Für die ersten Wochen relevant, weil eine frische Absenderdomain zunächst kein
Vertrauen bei den Empfängerservern hat:

* **DMARC setzen**, auch wenn Resend es als optional ausweist. Ohne DMARC landen
  Mails an Microsoft-365-Postfächer häufiger im Spam. Zum Start reicht
  `v=DMARC1; p=none; rua=mailto:dein-postfach@…`.
* **Erste Testmails an verschiedene Anbieter** schicken (Gmail, Outlook, GMX)
  und in den Spam-Ordner schauen.
* Im Resend-Dashboard unter **Logs** ist für jede Mail sichtbar, ob sie
  zugestellt, verzögert oder abgewiesen wurde. Bei Problemen in der Pilotphase
  ist das die erste Anlaufstelle.

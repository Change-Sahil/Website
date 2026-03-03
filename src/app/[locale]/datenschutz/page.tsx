// src/app/[locale]/datenschutz/page.tsx
export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">
        Datenschutzerklärung
      </h1>

      <div className="mt-6 space-y-8 text-slate-700 text-sm leading-7">
        <section className="space-y-3">
          <p>
            Mit dieser Datenschutzerklärung informieren wir Sie über die
            Verarbeitung personenbezogener Daten bei der Nutzung unserer Website.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
            identifiziert werden können.
          </p>
          <p>
            Diese Website dient der Information über unsere Leistungen und der
            Kontaktaufnahme.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Verantwortlicher
          </h2>
          <p>
            Seref Sahil (Change-Werkstatt Sahil)
            <br />
            Wiesendorfstraße 6
            <br />
            73433 Aalen
            <br />
            Deutschland
            <br />
            E-Mail:{" "}
            <a
              className="underline underline-offset-2"
              href="mailto:seref.sahil@change-werkstatt-sahil.com"
            >
              seref.sahil@change-werkstatt-sahil.com
            </a>
            <br />
            Telefon: +49 176 84076507
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Zwecke und Rechtsgrundlagen
          </h2>
          <p>Wir verarbeiten personenbezogene Daten zu folgenden Zwecken:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Bereitstellung der Website (Verbindungsdaten/Server-Logfiles)
            </li>
            <li>Bearbeitung von Anfragen über das Kontaktformular</li>
            <li>Kommunikation per E-Mail oder Telefon</li>
            <li>IT-Sicherheit und Missbrauchsprävention</li>
          </ul>
          <p className="mt-3">
            Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. b DSGVO
            (Anbahnung/Erfüllung eines Vertrags), Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an sicherem Betrieb und Optimierung) sowie –
            sofern erforderlich – Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Hosting und Bereitstellung der Website
          </h2>
          <p>
            Unsere Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website
            werden technisch notwendige Daten verarbeitet, um die Website
            auszuliefern (z. B. IP-Adresse, Datum/Uhrzeit, abgerufene Seite,
            Referrer-URL, Browser/ Betriebssystem).
          </p>
          <p>
            Diese Daten werden in der Regel in Server-Logfiles verarbeitet und
            dienen dem sicheren und stabilen Betrieb der Website.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
            Interesse am sicheren Betrieb).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Kontaktaufnahme und Kontaktformular
          </h2>
          <p>
            Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, verarbeiten
            wir die von Ihnen gemachten Angaben (z. B. Name, E-Mail-Adresse,
            Unternehmen, Nachricht), um Ihre Anfrage zu bearbeiten und mit Ihnen
            zu kommunizieren.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
            Maßnahmen) sowie Art. 6 Abs. 1 lit. f DSGVO (effiziente Bearbeitung
            von Anfragen).
          </p>
          <p>
            Wir bewahren Anfragen so lange auf, wie dies zur Bearbeitung und
            Dokumentation erforderlich ist, und löschen sie anschließend im Rahmen
            der gesetzlichen Aufbewahrungsfristen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Versand von E-Mails / Dienstleister (Resend)
          </h2>
          <p>
            Für den Versand und die Zustellung von E-Mails (z. B. Bestätigungen
            oder Kontaktanfragen) kann ein technischer Dienstleister eingesetzt
            werden (z. B. Resend). Dabei können personenbezogene Daten (z. B.
            Name, E-Mail-Adresse, Inhalt der Nachricht) verarbeitet werden.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bearbeitung der
            Anfrage) sowie Art. 6 Abs. 1 lit. f DSGVO (zuverlässige
            Zustellung/Kommunikation).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Cookies und Tracking
          </h2>
          <p>
            Auf dieser Website setzen wir derzeit keine Analyse- oder
            Marketing-Cookies ein. Technisch notwendige Funktionen können ohne
            solche Cookies bereitgestellt werden.
          </p>
          <p>
            Sollten künftig Tracking- oder Marketing-Tools eingesetzt werden,
            informieren wir an dieser Stelle gesondert und holen – sofern
            erforderlich – Ihre Einwilligung ein.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Empfänger und Drittlandübermittlung
          </h2>
          <p>
            Im Rahmen des Hostings und des E-Mail-Versands können Dienstleister
            Daten in unserem Auftrag verarbeiten. Dabei kann eine Verarbeitung in
            Drittländern (z. B. USA) nicht ausgeschlossen werden. In diesen Fällen
            stellen wir sicher, dass geeignete Garantien (z. B.
            Standardvertragsklauseln) bestehen, sofern erforderlich.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Ihre Rechte
          </h2>
          <p>Sie haben folgende Rechte nach der DSGVO:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen Verarbeitung (Art. 21 DSGVO)</li>
            <li>Widerruf einer Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p className="mt-3">
            Außerdem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu
            beschweren (Art. 77 DSGVO).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Datensicherheit
          </h2>
          <p>
            Wir setzen angemessene technische und organisatorische Maßnahmen ein,
            um Ihre Daten gegen Verlust, Missbrauch und unbefugten Zugriff zu
            schützen. Eine vollständige Sicherheit der Datenübertragung im
            Internet kann jedoch nicht garantiert werden.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">
            Stand und Änderungen
          </h2>
          <p>
            Wir können diese Datenschutzerklärung anpassen, wenn sich die Rechts-
            oder Faktenlage ändert oder wenn wir neue Dienste einsetzen.
          </p>
          <p>Stand: {new Date().toLocaleDateString("de-DE")}</p>
        </section>
      </div>
    </div>
  );
}
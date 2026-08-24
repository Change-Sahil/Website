// src/app/[locale]/datenschutz/datenschutz-de.tsx
//
// Deutsche Fassung der Datenschutzerklärung, bewusst NICHT über die
// Message-Dateien, sondern als eigenständiger Inhalt.
//
// Grund: Diese Fassung deckt den Schnellcheck mit Supabase, Resend und den
// Speicherfristen ab. Eine Übersetzung juristischer Texte ohne fachliche
// Prüfung wäre riskanter als keine. Die Fassungen in en/tr/es stehen weiterhin
// in src/messages/*.json und sind auf dem älteren Stand.
//
// VOR DEM ÖFFENTLICHEN MVP: die drei anderen Sprachen auf diesen Stand bringen
// oder auf die deutsche Fassung verweisen. Solange der Schnellcheck ein rein
// deutschsprachiges Angebot ist und auf /de/datenschutz verlinkt, ist die
// deutsche Fassung die einschlägige.

type Section = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Absätze, die nach der Liste stehen. */
  after?: string[];
  /** Adressblock o. Ä., Zeilenumbrüche bleiben erhalten. */
  block?: string;
};

const INTRO: string[] = [
  "Mit dieser Datenschutzerklärung informiere ich Sie über die Verarbeitung personenbezogener Daten bei der Nutzung meiner Website. Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.",
  "Diese Website dient der Information über meine Leistungen, der Kontaktaufnahme sowie der Bereitstellung digitaler Angebote wie des Schnellchecks zur organisationalen Übergabefähigkeit.",
];

const SECTIONS: Section[] = [
  {
    title: "Verantwortlicher",
    block: [
      "Seref Sahil",
      "Change-Werkstatt Sahil",
      "Wiesendorfstraße 6",
      "73433 Aalen",
      "Deutschland",
      "",
      "E-Mail: seref.sahil@change-werkstatt-sahil.com",
      "Telefon: +49 176 84076507",
    ].join("\n"),
  },
  {
    title: "Zwecke und Rechtsgrundlagen der Verarbeitung",
    paragraphs: [
      "Ich verarbeite personenbezogene Daten insbesondere zu folgenden Zwecken:",
    ],
    list: [
      "Bereitstellung und sicherer Betrieb der Website",
      "Verarbeitung technisch erforderlicher Verbindungsdaten und Server-Logfiles",
      "Bearbeitung von Anfragen über das Kontaktformular",
      "Kommunikation per E-Mail oder Telefon",
      "Durchführung und Auswertung des Schnellchecks zur organisationalen Übergabefähigkeit",
      "Speicherung der im Schnellcheck gegebenen Antworten und der daraus berechneten Auswertungsergebnisse",
      "Erstellung und Bereitstellung eines persönlichen Ergebnis- und Arbeitsberichts",
      "Versand des Ergebnisberichts per E-Mail, sofern dieser von Ihnen angefordert wird",
      "IT-Sicherheit und Missbrauchsprävention",
    ],
    after: [
      "Als Rechtsgrundlagen kommen insbesondere Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen und die Erfüllung vertraglicher oder von Ihnen angeforderter Leistungen, Art. 6 Abs. 1 lit. f DSGVO aufgrund meines berechtigten Interesses am sicheren und wirtschaftlichen Betrieb meiner Website sowie, soweit erforderlich, Art. 6 Abs. 1 lit. a DSGVO aufgrund Ihrer Einwilligung in Betracht.",
    ],
  },
  {
    title: "Hosting und Bereitstellung der Website",
    paragraphs: [
      "Meine Website wird über Vercel bereitgestellt. Anbieter ist die Vercel Inc., USA.",
      "Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, um die Website auszuliefern und ihren sicheren Betrieb zu gewährleisten. Hierzu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browser, Betriebssystem und weitere technische Verbindungsdaten gehören.",
      "Diese Daten können in Server-Logfiles verarbeitet werden und dienen insbesondere der Bereitstellung, Stabilität, Fehleranalyse und Sicherheit der Website.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt im sicheren und zuverlässigen Betrieb meines Internetangebots.",
      "Im Rahmen der Nutzung von Vercel kann eine Verarbeitung personenbezogener Daten außerhalb des Europäischen Wirtschaftsraums, insbesondere in den USA, stattfinden. Für entsprechende Datenübermittlungen werden die datenschutzrechtlich vorgesehenen Garantien eingesetzt.",
    ],
  },
  {
    title: "Kontaktaufnahme und Kontaktformular",
    paragraphs: [
      "Wenn Sie mich über das Kontaktformular, per E-Mail oder telefonisch kontaktieren, verarbeite ich die von Ihnen übermittelten Angaben, beispielsweise Ihren Namen, Ihre E-Mail-Adresse, Ihr Unternehmen, Ihre Telefonnummer und den Inhalt Ihrer Nachricht.",
      "Die Verarbeitung erfolgt, um Ihre Anfrage zu bearbeiten und mit Ihnen zu kommunizieren.",
      "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf eine mögliche Zusammenarbeit oder einen Vertrag gerichtet ist. Im Übrigen erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der effizienten Bearbeitung eingehender Anfragen.",
      "Ich bewahre entsprechende Daten so lange auf, wie dies zur Bearbeitung und Dokumentation Ihrer Anfrage erforderlich ist. Soweit gesetzliche Aufbewahrungspflichten bestehen, bleiben diese unberührt.",
    ],
  },
  {
    title: "Schnellcheck zur organisationalen Übergabefähigkeit",
    paragraphs: [
      "Auf meiner Website können Sie freiwillig einen Schnellcheck zur organisationalen Übergabefähigkeit Ihres Unternehmens durchführen.",
      "Im Rahmen des Schnellchecks beantworten Sie 24 Aussagen zu sechs Bereichen der organisationalen Übergabefähigkeit. Ihre Antworten werden verarbeitet, um daraus die jeweiligen Dimensionswerte und die zugehörigen Auswertungstexte zu berechnen.",
      "Auf Grundlage bestimmter Einzelantworten können zusätzlich Hinweise auf Aspekte erzeugt werden, die im Hinblick auf eine mögliche Unternehmensübergabe einer genaueren Betrachtung bedürfen.",
      "Der Schnellcheck dient einer strukturierten Erstindikation. Er stellt keine umfassende Organisationsanalyse oder persönliche Nachfolgeberatung dar. Es findet keine automatisierte Entscheidung statt, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie in vergleichbarer Weise erheblich beeinträchtigt.",
    ],
  },
  {
    title: "Durchführung ohne Kontaktdaten",
    paragraphs: [
      "Für die Durchführung des Schnellchecks müssen Sie zunächst weder Ihren Namen noch Ihre E-Mail-Adresse angeben.",
      "Ihre Antworten und die daraus berechneten Ergebnisse werden zunächst unter einer technischen Kennung gespeichert. Eine unmittelbare Zuordnung zu Ihrem Namen oder Ihrer E-Mail-Adresse erfolgt zu diesem Zeitpunkt nicht.",
    ],
  },
  {
    title: "Persönlicher Ergebnis- und Arbeitsbericht",
    paragraphs: [
      "Nach Abschluss des Schnellchecks können Sie freiwillig einen persönlichen Ergebnis- und Arbeitsbericht per E-Mail anfordern.",
      "Wenn Sie diese Möglichkeit nutzen, werden die von Ihnen angegebenen Kontaktdaten mit dem zuvor durchgeführten Schnellcheck verknüpft. Dadurch können die Antworten und Auswertungsergebnisse ab diesem Zeitpunkt Ihrer Person zugeordnet werden.",
      "Der persönliche Ergebnis- und Arbeitsbericht kann neben den bereits angezeigten Ergebnissen weitere für die Bearbeitung bestimmte Inhalte enthalten, beispielsweise eine Zusammenfassung des Profils, ausgewählte Fragen für die interne Diskussion und Arbeitsimpulse für mögliche nächste Schritte.",
      "Ihre Kontaktdaten werden verwendet, um den von Ihnen angeforderten Ergebnisbericht bereitzustellen und die damit unmittelbar zusammenhängende Kommunikation zu ermöglichen.",
      "Die Anforderung des Ergebnisberichts stellt keine Anmeldung zu einem Newsletter dar. Ihre E-Mail-Adresse wird dadurch nicht automatisch für Newsletter oder sonstige regelmäßige Werbe-E-Mails verwendet.",
    ],
  },
  {
    title: "Perspektivvergleich",
    paragraphs: [
      "Mit dem Perspektivvergleich können Einschätzungen mehrerer Personen zu einem gemeinsamen Unternehmen zusammengeführt und miteinander verglichen werden. Der Initiator des Perspektivvergleichs kann hierzu Einladungslinks für weitere Personen, beispielsweise Führungskräfte oder Schlüsselpersonen, erstellen und weitergeben.",
      "Zum Anlegen eines Perspektivvergleichs sind Name und E-Mail-Adresse des Initiators erforderlich. Die Kontaktdaten werden benötigt, um den Zugang zum Vergleich bereitzustellen und die zugehörigen Benachrichtigungen zu versenden. Mit dem Anlegen wird zugleich der persönliche Ergebnis- und Arbeitsbericht bereitgestellt.",
      "Bei der Teilnahme werden insbesondere die über den Einladungslink zugeordnete Rolle, die Antworten auf den Übergabe-Check sowie die daraus berechneten Dimensionswerte verarbeitet und dem jeweiligen Perspektivvergleich zugeordnet.",
      "Die Vergleichsauswertung kann zusammengefasste Ergebnisse verschiedener Rollen sowie Unterschiede zwischen den Einschätzungen darstellen. Sie dient dazu, Übereinstimmungen und unterschiedliche Wahrnehmungen sichtbar zu machen.",
      "Die Ergebnisse werden nicht als vollständig anonym bezeichnet. Insbesondere bei kleinen Teilnehmergruppen kann es trotz zusammengefasster oder rollenbezogener Darstellung möglich sein, einzelne Einschätzungen einer bestimmten Person zuzuordnen. Teilnehmer werden hierauf vor der Teilnahme hingewiesen.",
      "Der Initiator des Perspektivvergleichs erhält Zugriff auf die vorgesehene Vergleichsauswertung. Er kann außerdem per E-Mail darüber informiert werden, wenn weitere eingeladene Personen teilgenommen haben oder neue Ergebnisse im von ihm angelegten Perspektivvergleich verfügbar sind. Diese Benachrichtigungen dienen ausschließlich der Durchführung und Bereitstellung des vom Initiator selbst angelegten Perspektivvergleichs und sind keine Anmeldung zu einem Newsletter oder zu sonstiger werblicher Kommunikation.",
      "Rechtsgrundlage für die Verarbeitung im Zusammenhang mit der angeforderten Bereitstellung des Ergebnisberichts bzw. des Perspektivvergleichs ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchführung der vom Nutzer angeforderten Leistung erforderlich ist. Soweit eine Verarbeitung darüber hinaus auf einer Einwilligung beruht, ist Art. 6 Abs. 1 lit. a DSGVO die Rechtsgrundlage.",
    ],
  },
  {
    title: "Speicherung der Daten des Schnellchecks / Supabase",
    paragraphs: [
      "Für die Speicherung und technische Verarbeitung der Daten des Schnellchecks nutze ich Supabase.",
      "Dabei können insbesondere folgende Daten verarbeitet werden:",
    ],
    list: [
      "technische Kennung des Testdurchlaufs",
      "Antworten auf die Aussagen des Schnellchecks",
      "daraus berechnete Dimensionswerte",
      "aufgrund einzelner Antworten erzeugte Hinweise",
      "technische Angaben zum Testdurchlauf",
      "gegebenenfalls Name und E-Mail-Adresse, wenn Sie einen persönlichen Ergebnis- und Arbeitsbericht anfordern oder einen Perspektivvergleich anlegen",
      "bei einem Perspektivvergleich zusätzlich dessen Bezeichnung, die zugeordnete Rolle je Teilnahme, der Bearbeitungsstand der Einladungen sowie die technischen Zugangskennungen der Beteiligten",
    ],
    after: [
      "Das für den Schnellcheck verwendete Supabase-Projekt wird in einer europäischen Serverregion betrieben.",
      "Soweit im Rahmen der technischen Bereitstellung oder des Supports dennoch personenbezogene Daten außerhalb des Europäischen Wirtschaftsraums verarbeitet werden, erfolgt dies unter Beachtung der hierfür geltenden datenschutzrechtlichen Anforderungen und unter Verwendung geeigneter Garantien.",
    ],
  },
  {
    title: "Speicherdauer der Daten des Schnellchecks",
    paragraphs: [
      "Testdurchläufe, die nicht mit personenbezogenen Kontaktdaten verknüpft wurden, werden grundsätzlich spätestens nach sechs Monaten gelöscht oder so anonymisiert, dass eine Zuordnung zu einer Person nicht mehr möglich ist.",
      "Wenn Sie einen persönlichen Ergebnis- und Arbeitsbericht anfordern und dadurch Ihre Kontaktdaten mit dem Testdurchlauf verknüpft werden, werden die damit verbundenen Daten grundsätzlich spätestens nach zwölf Monaten gelöscht, sofern sich daraus keine weitere Geschäftsbeziehung entwickelt und keine gesetzlichen Aufbewahrungspflichten oder sonstigen rechtlichen Gründe einer Löschung entgegenstehen.",
      "Die personenbezogenen Daten und Vergleichsdaten eines Perspektivvergleichs werden grundsätzlich für höchstens zwölf Monate nach der letzten Aktivität des jeweiligen Perspektivvergleichs gespeichert und anschließend gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten oder andere Rechtsgründe eine längere Speicherung erfordern. Als letzte Aktivität gilt das jüngste der folgenden Ereignisse: das Anlegen des Vergleichs, das Erstellen einer Einladung oder der Eingang einer Einschätzung.",
      "Soweit Daten vollständig anonymisiert wurden und damit keinen Personenbezug mehr aufweisen, können sie darüber hinaus für statistische Auswertungen und zur Weiterentwicklung des Schnellchecks verwendet werden.",
    ],
  },
  {
    title: "Versand von E-Mails / Resend",
    paragraphs: [
      "Für den technischen Versand von E-Mails nutze ich Resend. Dies betrifft insbesondere die Zustellung angeforderter persönlicher Ergebnis- und Arbeitsberichte, die Benachrichtigungen an den Initiator eines Perspektivvergleichs sowie gegebenenfalls weitere über die Website ausgelöste E-Mail-Kommunikation.",
      "Dabei werden die für die Zustellung erforderlichen Daten verarbeitet. Hierzu können insbesondere Ihre E-Mail-Adresse, Ihr Name, der Inhalt der jeweiligen Nachricht sowie technische Informationen über den Versand gehören.",
      "Die Verarbeitung erfolgt zur Bereitstellung der von Ihnen angeforderten Kommunikation bzw. Leistung sowie zur zuverlässigen technischen Zustellung der E-Mail.",
      "Im Rahmen der Nutzung von Resend kann eine Verarbeitung personenbezogener Daten in den USA stattfinden. Für entsprechende internationale Datenübermittlungen werden die hierfür vorgesehenen datenschutzrechtlichen Garantien eingesetzt.",
    ],
  },
  {
    title: "Cookies, Tracking und Vercel Analytics",
    paragraphs: [
      "Ich setze keine Marketing- oder Retargeting-Cookies ein.",
      "Zur statistischen Auswertung der Nutzung meiner Website verwende ich Vercel Analytics. Dabei werden Nutzungsdaten verarbeitet, um beispielsweise Seitenaufrufe und die technische Nutzung der Website statistisch auszuwerten.",
      "Vercel Analytics wird nicht von mir eingesetzt, um personenbezogene Nutzerprofile für Werbezwecke zu erstellen oder Nutzer über verschiedene Websites hinweg zu verfolgen.",
      "Rechtsgrundlage ist, soweit keine Einwilligung erforderlich ist, Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in der technischen Optimierung und statistischen Auswertung meiner Website.",
      "Sollten künftig Dienste eingesetzt werden, für die eine vorherige Einwilligung erforderlich ist, werden diese erst nach entsprechender Einwilligung eingesetzt und diese Datenschutzerklärung entsprechend ergänzt.",
    ],
  },
  {
    title: "Empfänger und Auftragsverarbeiter",
    paragraphs: [
      "Zur Bereitstellung meiner Website und der darüber angebotenen Funktionen setze ich technische Dienstleister ein.",
      "Hierzu gehören insbesondere Anbieter für:",
    ],
    list: [
      "Hosting und Bereitstellung der Website",
      "Datenbank und Speicherung der Schnellcheck-Daten",
      "technischen Versand von E-Mails",
    ],
    after: [
      "Soweit diese Dienstleister personenbezogene Daten in meinem Auftrag verarbeiten, erfolgt die Verarbeitung auf Grundlage der datenschutzrechtlich erforderlichen Vereinbarungen.",
      "Eine Weitergabe personenbezogener Daten an andere Empfänger erfolgt nur, wenn dies zur Erbringung einer von Ihnen angeforderten Leistung erforderlich ist, eine gesetzliche Verpflichtung besteht, Sie eingewilligt haben oder eine andere Rechtsgrundlage die Übermittlung erlaubt.",
    ],
  },
  {
    title: "Drittlandübermittlung",
    paragraphs: [
      "Bei der Nutzung einzelner technischer Dienstleister kann nicht ausgeschlossen werden, dass personenbezogene Daten außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums verarbeitet werden.",
      "Soweit für das jeweilige Drittland kein Angemessenheitsbeschluss der Europäischen Kommission besteht, erfolgt eine entsprechende Übermittlung nur unter Beachtung der Voraussetzungen der Art. 44 ff. DSGVO und unter Verwendung geeigneter Garantien, soweit diese erforderlich sind.",
    ],
  },
  {
    title: "Ihre Rechte",
    paragraphs: [
      "Sie haben im Rahmen der gesetzlichen Voraussetzungen insbesondere folgende Rechte:",
    ],
    list: [
      "Recht auf Auskunft gemäß Art. 15 DSGVO",
      "Recht auf Berichtigung gemäß Art. 16 DSGVO",
      "Recht auf Löschung gemäß Art. 17 DSGVO",
      "Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO",
      "Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO",
      "Recht auf Widerspruch gemäß Art. 21 DSGVO",
      "Recht auf Widerruf einer erteilten Einwilligung gemäß Art. 7 Abs. 3 DSGVO",
    ],
    after: [
      "Der Widerruf einer Einwilligung berührt nicht die Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung.",
      "Wenn eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO erfolgt, haben Sie unter den gesetzlichen Voraussetzungen das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch gegen die Verarbeitung einzulegen.",
      "Zur Ausübung Ihrer Rechte können Sie sich jederzeit an die oben angegebenen Kontaktdaten wenden.",
    ],
  },
  {
    title: "Beschwerderecht bei einer Aufsichtsbehörde",
    paragraphs: [
      "Sie haben gemäß Art. 77 DSGVO das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.",
    ],
  },
  {
    title: "Datensicherheit",
    paragraphs: [
      "Ich setze angemessene technische und organisatorische Maßnahmen ein, um personenbezogene Daten gegen Verlust, Manipulation, Missbrauch und unbefugten Zugriff zu schützen.",
      "Die Datenübertragung zwischen Ihrem Browser und meiner Website erfolgt verschlüsselt. Eine vollständige Sicherheit elektronischer Datenübertragungen kann jedoch nicht garantiert werden.",
    ],
  },
  {
    title: "Stand und Änderungen",
    paragraphs: [
      "Ich passe diese Datenschutzerklärung an, wenn Änderungen der eingesetzten Dienste, der Datenverarbeitung oder der rechtlichen Rahmenbedingungen dies erforderlich machen.",
      "Stand: August 2026",
    ],
  },
];

export default function DatenschutzDe() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">
        Datenschutzerklärung
      </h1>

      <div className="mt-6 space-y-8 text-sm leading-7 text-slate-700">
        <section className="space-y-3">
          {INTRO.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>

        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              {section.title}
            </h2>

            {section.block && (
              <p className="whitespace-pre-line">{section.block}</p>
            )}

            {section.paragraphs?.map((text) => (
              <p key={text}>{text}</p>
            ))}

            {section.list && (
              <ul className="list-disc space-y-1 pl-5">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {section.after?.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

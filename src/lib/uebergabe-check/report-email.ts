// src/lib/uebergabe-check/report-email.ts
//
// Die Ergebnismail an den Nutzer.
//
// Haltung: Das ist die persönliche Zustellung eines angeforderten
// Arbeitsdokuments, keine Marketingmail. Deshalb bewusst:
//  • kleines Logo statt Header-Banner, kein Portraitfoto
//  • genau zwei Handlungen, mit klarer Rangfolge
//  • keine Ergebnistabelle. Die Zahlen stehen im Bericht, die Mail stellt ihn
//    zu. Sonst konkurriert die Mail mit dem Dokument, das sie ankündigt.
//  • kein Newsletter, kein LinkedIn, keine Leistungsübersicht

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Absendername für Resend. Wirkt persönlicher als eine nackte Adresse und
 * verhindert den Eindruck einer automatisierten Zustellung.
 */
export function senderWithName(fromEmail: string): string {
  // Falls in der Umgebungsvariable bereits ein Anzeigename steht, bleibt der.
  if (fromEmail.includes("<")) return fromEmail;
  return `Seref Sahil | Change-Werkstatt <${fromEmail}>`;
}

export function buildReportEmail(options: {
  name: string;
  resultUrl: string;
  bookingUrl: string;
  baseUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, resultUrl, bookingUrl, baseUrl } = options;

  const html = `<!doctype html>
<html lang="de"><body style="margin:0;padding:24px;background:#f8f7f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
    <tr><td>

      <p style="margin:0 0 28px;">
        <img src="${baseUrl}/logo.png" width="196" alt="Change-Werkstatt Sahil" style="display:block;width:196px;height:auto;border:0;">
      </p>

      <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#1f2937;">
        Guten Tag ${escapeHtml(name)},
      </p>

      <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4b5563;">
        hier finden Sie Ihren persönlichen Ergebnis- und Arbeitsbericht zum
        Schnellcheck der organisationalen Übergabefähigkeit.
      </p>

      <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#4b5563;">
        Neben Ihrem Übergabeprofil enthält der Bericht die Einordnung der sechs
        Dimensionen, auffällige Einzelantworten sowie ausgewählte Fragen für die
        weitere interne Diskussion.
      </p>

      <!-- Button als Tabelle, nicht als inline-block-Link: Outlook rendert mit
           der Word-Engine und verwirft padding auf einem <a>. Der Button sah
           dort nur wie schwarz hinterlegter Text aus. Hintergrund und Abstand
           liegen deshalb auf der Zelle. -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
        <tr>
          <td bgcolor="#0a0f1a" style="border-radius:5px;padding:14px 26px;">
            <a href="${resultUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <span style="color:#ffffff;">Persönlichen Ergebnisbericht öffnen</span>
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#4b5563;">
        Der Schnellcheck zeigt, wo sich eine genauere Betrachtung lohnen kann.
        Welche Punkte für Ihre konkrete Nachfolgesituation tatsächlich relevant
        sind, hängt unter anderem von Nachfolgeform, Zeithorizont und Ihrer
        zukünftigen Rolle im Unternehmen ab.
      </p>

      <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:#4b5563;">
        Wenn Sie Ihr Ergebnis dazu einmal gemeinsam einordnen möchten:
        <!-- Farbe zusätzlich im span: Outlook überschreibt sonst die
             Linkfarbe mit seinem eigenen Violett. -->
        <a href="${bookingUrl}" style="color:#00707d;font-weight:600;text-decoration:none;"><span style="color:#00707d;">Ergebnis gemeinsam einordnen &rarr;</span></a>
      </p>

      <p style="margin:0 0 4px;font-size:15px;line-height:1.65;color:#1f2937;">
        Viele Grüße
      </p>
      <p style="margin:0 0 2px;font-size:15px;line-height:1.65;font-weight:600;color:#1f2937;">
        Seref Sahil
      </p>
      <p style="margin:0 0 2px;font-size:14px;line-height:1.55;color:#4b5563;">
        Change-Werkstatt Sahil
      </p>
      <p style="margin:0 0 2px;font-size:13px;line-height:1.55;color:#00707d;">
        Umsetzung wirksam machen, wenn Organisation unter Druck gerät
      </p>
      <p style="margin:0 0 28px;font-size:13px;line-height:1.55;">
        <a href="${baseUrl}/de" style="color:#4b5563;text-decoration:none;"><span style="color:#4b5563;">${baseUrl.replace(/^https?:\/\//, "")}</span></a>
      </p>

      <p style="margin:0;padding-top:20px;border-top:1px solid #e8eaee;font-size:12px;line-height:1.6;color:#9aa3af;">
        Der Schnellcheck dient einer strukturierten Erstindikation der
        organisationalen Übergabefähigkeit. Er ersetzt keine individuelle
        Analyse der konkreten Nachfolgesituation oder eine persönliche
        Nachfolgeberatung.<br><br>
        Der Ergebnislink ist persönlich und nicht öffentlich auffindbar.
        Sie können die Löschung Ihrer Daten jederzeit formlos verlangen.<br><br>
        <a href="${baseUrl}/de/impressum" style="color:#9aa3af;">Impressum</a>
        &nbsp;·&nbsp;
        <a href="${baseUrl}/de/datenschutz" style="color:#9aa3af;">Datenschutz</a>
      </p>

    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Guten Tag ${name},`,
    "",
    "hier finden Sie Ihren persönlichen Ergebnis- und Arbeitsbericht zum Schnellcheck der organisationalen Übergabefähigkeit.",
    "",
    "Neben Ihrem Übergabeprofil enthält der Bericht die Einordnung der sechs Dimensionen, auffällige Einzelantworten sowie ausgewählte Fragen für die weitere interne Diskussion.",
    "",
    `Persönlichen Ergebnisbericht öffnen: ${resultUrl}`,
    "",
    "Der Schnellcheck zeigt, wo sich eine genauere Betrachtung lohnen kann. Welche Punkte für Ihre konkrete Nachfolgesituation tatsächlich relevant sind, hängt unter anderem von Nachfolgeform, Zeithorizont und Ihrer zukünftigen Rolle im Unternehmen ab.",
    "",
    `Ergebnis gemeinsam einordnen: ${bookingUrl}`,
    "",
    "Viele Grüße",
    "Seref Sahil",
    "Change-Werkstatt Sahil",
    "Umsetzung wirksam machen, wenn Organisation unter Druck gerät",
    baseUrl.replace(/^https?:\/\//, ""),
    "",
    "Der Schnellcheck dient einer strukturierten Erstindikation und ersetzt keine individuelle Analyse der konkreten Nachfolgesituation.",
    `Impressum: ${baseUrl}/de/impressum`,
    `Datenschutz: ${baseUrl}/de/datenschutz`,
  ].join("\n");

  return {
    subject: "Ihr persönliches Übergabeprofil",
    html,
    text,
  };
}

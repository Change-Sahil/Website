// src/lib/uebergabe-check/comparison-email.ts
//
// Benachrichtigung an den Initiator, wenn eine weitere Einschätzung eingegangen
// ist.
//
// Das ist eine transaktionale Nachricht über einen Vorgang, den der Empfänger
// selbst angestoßen hat, und keine Marketingmail. Beim Anlegen des Vergleichs
// steht ausdrücklich, dass genau darüber informiert wird.
//
// Bewusst OHNE Ergebnisdaten: Keine Punktwerte, keine Aussage darüber, ob die
// Perspektiven übereinstimmen. Erstens gehört die Auswertung auf die geschützte
// Seite und nicht in ein Postfach, das mitgelesen werden kann. Zweitens wäre
// „in mehreren Bereichen liegen die Perspektiven auseinander“ bereits eine
// Interpretation, bevor der Empfänger die Zahlen gesehen hat.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildComparisonUpdateEmail(options: {
  name: string;
  /** Wie viele Einschätzungen liegen insgesamt vor, inklusive der eigenen. */
  total: number;
  /** Wie viele Einladungen sind noch offen. */
  open: number;
  /** Sind bereits mindestens zwei Perspektiven vorhanden? */
  ready: boolean;
  comparisonUrl: string;
  label: string | null;
  baseUrl: string;
}): { subject: string; html: string; text: string } {
  const { name, total, open, ready, comparisonUrl, label, baseUrl } = options;

  const subject = label
    ? `Neue Einschätzung zu Ihrem Perspektivvergleich (${label})`
    : "Neue Einschätzung zu Ihrem Perspektivvergleich";

  const status = ready
    ? "Damit liegen genug Perspektiven für eine Auswertung vor."
    : "Sobald eine weitere Rolle geantwortet hat, entsteht daraus die Vergleichsauswertung.";

  const pending =
    open === 0
      ? "Alle von Ihnen verschickten Einladungen sind damit eingelöst."
      : open === 1
        ? "Eine Einladung ist noch offen."
        : `${open} Einladungen sind noch offen.`;

  const intro = `zu Ihrem Perspektivvergleich liegt eine weitere Einschätzung vor. Insgesamt sind es jetzt ${
    total === 1 ? "eine Einschätzung" : `${total} Einschätzungen`
  }. ${status}`;

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
        ${escapeHtml(intro)}
      </p>

      <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#4b5563;">
        ${escapeHtml(pending)}
      </p>

      <!-- Button als Tabelle: Outlook verwirft padding auf einem <a>. -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
        <tr>
          <td bgcolor="#0a0f1a" style="border-radius:5px;padding:14px 26px;">
            <a href="${comparisonUrl}" style="color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <span style="color:#ffffff;">Perspektivvergleich ansehen</span>
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 4px;font-size:15px;line-height:1.65;color:#1f2937;">
        Viele Grüße
      </p>
      <p style="margin:0 0 2px;font-size:15px;line-height:1.65;font-weight:600;color:#1f2937;">
        Seref Sahil
      </p>
      <p style="margin:0 0 2px;font-size:14px;line-height:1.55;color:#4b5563;">
        Change-Werkstatt Sahil
      </p>
      <p style="margin:0 0 28px;font-size:13px;line-height:1.55;">
        <a href="${baseUrl}/de" style="color:#4b5563;text-decoration:none;"><span style="color:#4b5563;">${baseUrl.replace(/^https?:\/\//, "")}</span></a>
      </p>

      <p style="margin:0;padding-top:20px;border-top:1px solid #e8eaee;font-size:12px;line-height:1.6;color:#9aa3af;">
        Sie erhalten diese Nachricht, weil Sie den Perspektivvergleich selbst
        angelegt haben. Der Link ist persönlich und nicht öffentlich
        auffindbar.<br><br>
        Bei kleinen Teilnehmergruppen können Einschätzungen trotz
        zusammengefasster Darstellung unter Umständen einzelnen Personen
        zugeordnet werden.<br><br>
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
    intro,
    "",
    pending,
    "",
    `Perspektivvergleich ansehen: ${comparisonUrl}`,
    "",
    "Viele Grüße",
    "Seref Sahil",
    "Change-Werkstatt Sahil",
    baseUrl.replace(/^https?:\/\//, ""),
    "",
    "Sie erhalten diese Nachricht, weil Sie den Perspektivvergleich selbst angelegt haben.",
  ].join("\n");

  return { subject, html, text };
}

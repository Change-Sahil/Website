// src/app/api/uebergabe-check/lead/route.ts
//
// Verknüpft nachträglich Kontaktdaten mit einem bereits anonym gespeicherten
// Assessment – ausschließlich dann, wenn der Nutzer die Zusendung des Berichts
// aktiv wünscht. Einwilligung zur Zusendung und Einwilligung zu späterer
// Marketingkommunikation werden getrennt erfasst und getrennt gespeichert.

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getAssessment, getDb } from "@/lib/uebergabe-check/db";
import { buildInternalNotification } from "@/lib/uebergabe-check/emails";
import {
  buildReportEmail,
  senderWithName,
} from "@/lib/uebergabe-check/report-email";
import { computeScores } from "@/lib/uebergabe-check/scoring";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3";

const leadSchema = z.object({
  assessmentId: z.uuid(),
  name: z.string().min(1, "Bitte geben Sie Ihren Namen an.").max(200),
  email: z.email("Bitte prüfen Sie die E-Mail-Adresse.").max(320),
  company: z.string().max(200).optional().default(""),
  // Ohne diese Einwilligung wird nichts gespeichert und nichts versendet.
  consentReport: z.literal(true),
  consentMarketing: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  if (!rateLimit("uc-lead", clientIp(req), { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    parsed = leadSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 }
    );
  }

  const { assessmentId, name, email, company, consentMarketing } = parsed.data;

  const db = getDb();
  const assessment = await getAssessment(assessmentId);
  if (!db || !assessment) {
    return NextResponse.json(
      { ok: false, error: "Der zugehörige Testfall wurde nicht gefunden." },
      { status: 404 }
    );
  }

  const { error: upsertError } = await db.from("uc_leads").upsert(
    {
      assessment_id: assessmentId,
      name,
      email,
      company: company || null,
      consent_report: true,
      consent_marketing: consentMarketing,
      consent_at: new Date().toISOString(),
    },
    { onConflict: "assessment_id" }
  );

  if (upsertError) {
    console.error("UC_LEAD_UPSERT_ERROR", upsertError);
    return NextResponse.json(
      { ok: false, error: "Die Daten konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }

  const resultUrl = `${BASE_URL}/de/uebergabe-check/ergebnis/${assessmentId}`;
  const scores = computeScores(assessment.answers);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("UC_LEAD_NO_RESEND_KEY");
    return NextResponse.json(
      { ok: false, error: "Der Versand ist derzeit nicht möglich." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "info@change-werkstatt-sahil.de";
  const internalTo = process.env.CONTACT_TO_EMAIL || "info@change-werkstatt-sahil.com";

  const report = buildReportEmail({
    name,
    resultUrl,
    bookingUrl: BOOKING_URL,
    baseUrl: BASE_URL,
  });

  try {
    const sent = await resend.emails.send({
      // Mit Anzeigename: die Mail soll nach persönlicher Zustellung aussehen,
      // nicht nach Automation.
      from: senderWithName(fromEmail),
      // Antworten sollen im tatsächlich gelesenen Postfach landen. Die
      // Absenderdomain muss in Resend verifiziert sein, das Antwortpostfach
      // nicht.
      replyTo: internalTo,
      to: email,
      subject: report.subject,
      html: report.html,
      text: report.text,
    });
    if (sent.error) throw new Error(sent.error.message);

    await db
      .from("uc_leads")
      .update({ report_sent_at: new Date().toISOString() })
      .eq("assessment_id", assessmentId);
  } catch (err) {
    console.error("UC_LEAD_SEND_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "Die Ergebnis-Mail konnte nicht zugestellt werden." },
      { status: 502 }
    );
  }

  // Interne Benachrichtigung – Fehler hier dürfen den Nutzer nicht betreffen.
  try {
    const notification = buildInternalNotification({
      name,
      email,
      company,
      consentMarketing,
      assessmentId,
      scores,
      answers: assessment.answers,
      resultUrl,
    });
    await resend.emails.send({
      from: fromEmail,
      to: internalTo,
      replyTo: email,
      subject: notification.subject,
      text: notification.text,
    });
  } catch (err) {
    console.error("UC_LEAD_NOTIFY_ERROR", err);
  }

  return NextResponse.json({ ok: true, resultUrl });
}

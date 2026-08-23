// src/app/api/uebergabe-check/submit/route.ts
//
// Speichert einen abgeschlossenen Übergabe-Check ANONYM ab und liefert die
// ID_Testfall zurück. Kontaktdaten werden hier bewusst nicht entgegengenommen –
// sie kommen ggf. später über /api/uebergabe-check/lead dazu.

import { NextResponse } from "next/server";
import { z } from "zod";

import { Resend } from "resend";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { buildRoleProfiles } from "@/lib/uebergabe-check/comparison";
import {
  completeInvite,
  getInitiatorContact,
  getInviteByToken,
  listInvites,
  listParticipations,
} from "@/lib/uebergabe-check/comparison-db";
import { buildComparisonUpdateEmail } from "@/lib/uebergabe-check/comparison-email";
import { getDb } from "@/lib/uebergabe-check/db";
import { senderWithName } from "@/lib/uebergabe-check/report-email";
import { ITEMS, ITEM_VERSION, type Answers } from "@/lib/uebergabe-check/items";
import {
  computeFlagIds,
  computeScores,
  scoresToRecord,
} from "@/lib/uebergabe-check/scoring";

/** Genau die 24 bekannten Item-IDs, jeweils ein Likert-Wert 1 bis 5. */
const answersSchema = z.object(
  Object.fromEntries(
    ITEMS.map((item) => [item.id, z.number().int().min(1).max(5)])
  ) as Record<string, z.ZodNumber>
).strict();

const submitSchema = z.object({
  answers: answersSchema,
  source: z.string().max(120).optional(),
  organizationId: z.uuid().optional(),
  /**
   * Nur bei einer Teilnahme am Perspektivvergleich gesetzt. Rolle und
   * Vergleichszuordnung werden bewusst NICHT vom Client übernommen, sondern
   * aus der Einladung gelesen: sonst könnte jeder Antworten in einen fremden
   * Vergleich schreiben oder sich eine andere Rolle geben.
   */
  inviteToken: z.string().min(16).max(64).optional(),
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

/**
 * Informiert den Initiator über eine neu eingegangene Einschätzung.
 *
 * Ohne hinterlegte Kontaktdaten passiert nichts. Das betrifft Vergleiche aus
 * der Zeit vor der Registrierungspflicht; dort wurde nie etwas zugesagt.
 */
async function notifyInitiator(comparisonId: string): Promise<void> {
  const contact = await getInitiatorContact(comparisonId);
  if (!contact) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const [participations, invites] = await Promise.all([
    listParticipations(comparisonId),
    listInvites(comparisonId),
  ]);

  const mail = buildComparisonUpdateEmail({
    name: contact.name,
    total: participations.length,
    open: invites.filter((invite) => !invite.used_at).length,
    ready:
      buildRoleProfiles(
        participations.map((entry) => ({
          id: entry.id,
          role: entry.respondent_role,
          answers: entry.answers,
        }))
      ).length >= 2,
    comparisonUrl: `${BASE_URL}/de/uebergabe-check/vergleich/${contact.manageToken}`,
    label: contact.label,
    baseUrl: BASE_URL,
  });

  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "info@change-werkstatt-sahil.de";

  await new Resend(apiKey).emails.send({
    from: senderWithName(fromEmail),
    replyTo: process.env.CONTACT_TO_EMAIL || "info@change-werkstatt-sahil.com",
    to: contact.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
}

export async function POST(req: Request) {
  if (!rateLimit("uc-submit", clientIp(req), { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    parsed = submitSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Der Fragebogen ist unvollständig oder fehlerhaft." },
      { status: 400 }
    );
  }

  const { answers, source, organizationId, inviteToken } = parsed.data;

  // Scores und Flags werden serverseitig neu berechnet – der Client-Wert dient
  // nur der sofortigen Anzeige und wird nie übernommen.
  const dimensionScores = computeScores(answers as Answers);
  const flags = computeFlagIds(answers as Answers);

  const db = getDb();
  if (!db) {
    // Ohne Datenbank bleibt der Check nutzbar, das Ergebnis ist dann aber nur
    // in der laufenden Sitzung verfügbar.
    console.warn("UC_SUBMIT_NO_DB: Assessment wurde nicht gespeichert.");
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  // Einladung auflösen. Rolle und Vergleich stammen ausschließlich von hier.
  let invite: Awaited<ReturnType<typeof getInviteByToken>> = null;
  if (inviteToken) {
    invite = await getInviteByToken(inviteToken);
    if (!invite) {
      return NextResponse.json(
        { ok: false, error: "Dieser Einladungslink ist ungültig." },
        { status: 404 }
      );
    }
    if (invite.invite.used_at) {
      return NextResponse.json(
        { ok: false, error: "Dieser Einladungslink wurde bereits verwendet." },
        { status: 409 }
      );
    }
  }

  // comparison_id nur mitschicken, wenn es wirklich einen Vergleich gibt.
  // Ist die Migration noch nicht gelaufen, existiert die Spalte nicht und
  // PostgREST würde den gesamten Insert ablehnen. Der Einzelcheck darf davon
  // nicht abhängen.
  const row: Record<string, unknown> = {
    item_version: ITEM_VERSION,
    locale: "de",
    organization_id: organizationId ?? null,
    respondent_role: invite?.invite.respondent_role ?? "owner",
    answers,
    scores: scoresToRecord(dimensionScores),
    flags,
    source: source ?? null,
  };
  if (invite) row.comparison_id = invite.comparisonId;

  const { data, error } = await db
    .from("uc_assessments")
    .insert(row)
    .select("id")
    .single();

  if (error || !data) {
    console.error("UC_SUBMIT_INSERT_ERROR", error);
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  if (invite) {
    await completeInvite(invite.invite.id, data.id as string);
    // Beim Anlegen des Vergleichs wurde zugesagt, über neue Einschätzungen zu
    // informieren. Ein Fehler beim Versand darf die Teilnahme aber nicht
    // scheitern lassen: die Antwort ist gespeichert, das ist das Wesentliche.
    try {
      await notifyInitiator(invite.comparisonId);
    } catch (err) {
      console.error("UC_COMPARISON_NOTIFY_ERROR", err);
    }
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    persisted: true,
    partOfComparison: Boolean(invite),
  });
}

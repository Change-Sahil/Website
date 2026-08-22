// src/app/api/uebergabe-check/submit/route.ts
//
// Speichert einen abgeschlossenen Übergabe-Check ANONYM ab und liefert die
// ID_Testfall zurück. Kontaktdaten werden hier bewusst nicht entgegengenommen –
// sie kommen ggf. später über /api/uebergabe-check/lead dazu.

import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getDb } from "@/lib/uebergabe-check/db";
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
  respondentRole: z.enum(["owner", "management", "other"]).optional(),
  organizationId: z.uuid().optional(),
});

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

  const { answers, source, respondentRole, organizationId } = parsed.data;

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

  const { data, error } = await db
    .from("uc_assessments")
    .insert({
      item_version: ITEM_VERSION,
      locale: "de",
      organization_id: organizationId ?? null,
      respondent_role: respondentRole ?? "owner",
      answers,
      scores: scoresToRecord(dimensionScores),
      flags,
      source: source ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("UC_SUBMIT_INSERT_ERROR", error);
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  return NextResponse.json({ ok: true, id: data.id, persisted: true });
}

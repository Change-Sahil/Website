// src/app/api/uebergabe-check/feedback/route.ts
//
// Fünf Pflichtfragen der Beta-Pilotphase (Spec Abschnitt 5). Der Datensatz
// bleibt ohne Personenbezug und wird über die ID_Testfall mit dem Assessment
// verknüpft – so lässt sich später auswerten, bei welchen Score-Konstellationen
// Verständnisschwierigkeiten aufgetreten sind.

import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getDb } from "@/lib/uebergabe-check/db";

const answer = z.string().max(4000).optional().default("");

const feedbackSchema = z.object({
  assessmentId: z.uuid(),
  q1_verstaendlichkeit: answer,
  q2_vollstaendigkeit: answer,
  q3_praxisabgleich: answer,
  q4_anwendbarkeit: answer,
  q5_verbesserung: answer,
});

export async function POST(req: Request) {
  if (!rateLimit("uc-feedback", clientIp(req), { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal." },
      { status: 429 }
    );
  }

  let parsed;
  try {
    parsed = feedbackSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Ungültige Eingabe." }, { status: 400 });
  }

  const { assessmentId, ...answers } = parsed.data;

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "Rückmeldungen können derzeit nicht gespeichert werden." },
      { status: 503 }
    );
  }

  const { error } = await db.from("uc_feedback").upsert(
    {
      assessment_id: assessmentId,
      q1_verstaendlichkeit: answers.q1_verstaendlichkeit || null,
      q2_vollstaendigkeit: answers.q2_vollstaendigkeit || null,
      q3_praxisabgleich: answers.q3_praxisabgleich || null,
      q4_anwendbarkeit: answers.q4_anwendbarkeit || null,
      q5_verbesserung: answers.q5_verbesserung || null,
    },
    { onConflict: "assessment_id" }
  );

  if (error) {
    console.error("UC_FEEDBACK_UPSERT_ERROR", error);
    return NextResponse.json(
      { ok: false, error: "Die Rückmeldung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

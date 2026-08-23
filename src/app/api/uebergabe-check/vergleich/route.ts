// src/app/api/uebergabe-check/vergleich/route.ts
//
// Legt einen Perspektivvergleich an und verwaltet dessen Einladungen.
//
// Zugriff über zwei Geheimnisse statt über ein Konto, siehe comparison-db.ts.
// Jede verwaltende Aktion verlangt das manage_token; die zugehörige
// comparison_id wird immer serverseitig daraus aufgelöst und nie vom Client
// übernommen.

import { NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  createComparison,
  createInvite,
  deleteInvite,
  getComparisonByManageToken,
  renameComparison,
} from "@/lib/uebergabe-check/comparison-db";
import { isDbConfigured } from "@/lib/uebergabe-check/db";

const createSchema = z.object({
  action: z.literal("create"),
  assessmentId: z.uuid(),
  label: z.string().max(120).optional(),
});

const inviteSchema = z.object({
  action: z.literal("invite"),
  manageToken: z.string().min(16).max(64),
  role: z.enum(["owner", "leader", "key_person"]),
  note: z.string().max(120).optional(),
});

const renameSchema = z.object({
  action: z.literal("rename"),
  manageToken: z.string().min(16).max(64),
  label: z.string().min(1).max(120),
});

const revokeSchema = z.object({
  action: z.literal("revoke"),
  manageToken: z.string().min(16).max(64),
  inviteId: z.uuid(),
});

const bodySchema = z.discriminatedUnion("action", [
  createSchema,
  inviteSchema,
  renameSchema,
  revokeSchema,
]);

const MIGRATION_HINT =
  "Der Perspektivvergleich ist noch nicht eingerichtet. Bitte die Migration supabase/uebergabe-check-perspektivvergleich.sql ausführen.";

export async function POST(req: Request) {
  if (!rateLimit("uc-comparison", clientIp(req), { limit: 20, windowMs: 60_000 })) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen. Bitte gleich noch einmal versuchen." },
      { status: 429 }
    );
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: MIGRATION_HINT },
      { status: 503 }
    );
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const body = parsed.data;

  if (body.action === "create") {
    const created = await createComparison(body.assessmentId, body.label);
    if (!created) {
      return NextResponse.json({ ok: false, error: MIGRATION_HINT }, { status: 503 });
    }
    return NextResponse.json({ ok: true, manageToken: created.manageToken });
  }

  // Alle übrigen Aktionen setzen ein gültiges Verwaltungstoken voraus.
  const comparison = await getComparisonByManageToken(body.manageToken);
  if (!comparison) {
    return NextResponse.json(
      { ok: false, error: "Dieser Verwaltungslink ist ungültig." },
      { status: 404 }
    );
  }

  if (body.action === "invite") {
    const invite = await createInvite(comparison.id, body.role, body.note);
    if (!invite) {
      return NextResponse.json(
        { ok: false, error: "Die Einladung konnte nicht angelegt werden." },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, invite });
  }

  if (body.action === "rename") {
    const done = await renameComparison(comparison.id, body.label);
    return NextResponse.json({ ok: done });
  }

  const done = await deleteInvite(comparison.id, body.inviteId);
  return NextResponse.json({ ok: done });
}

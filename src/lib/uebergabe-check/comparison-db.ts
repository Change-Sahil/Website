// src/lib/uebergabe-check/comparison-db.ts
//
// Datenzugriff für den Perspektivvergleich. NUR serverseitig verwenden, der
// Service-Role-Key umgeht Row Level Security.
//
// Zugangsmodell ohne Login, bewusst so gewählt: Der Check ist anonym nutzbar,
// ein Konto wäre eine Hürde vor dem Nutzen. Zugriff regeln zwei Geheimnisse:
//
//   manage_token  Der Initiator. Sieht die Auswertung, lädt Teilnehmer ein.
//   invite token  Eine eingeladene Person. Darf genau einmal antworten und
//                 sieht die Vergleichsauswertung NICHT.
//
// Beide Tokens sind kryptografisch zufällig und stehen nur im jeweiligen Link.

import { randomBytes } from "node:crypto";
import type { Answers } from "./items";
import type { RespondentRole } from "./comparison";
import { getDb } from "./db";

/** 32 Zeichen aus 24 Zufallsbytes, URL-tauglich. */
function newToken(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * Meldet Supabase, dass die Spalte initiator_assessment_id fehlt?
 *
 * PostgREST antwortet beim Insert mit PGRST204 und einer Meldung wie
 * „Could not find the 'x' column of 'y' in the schema cache“, Postgres selbst
 * mit dem SQLSTATE 42703.
 */
function isMissingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  return Boolean(error.message?.includes("initiator_assessment_id"));
}

export type ComparisonRow = {
  id: string;
  created_at: string;
  label: string | null;
};

export type InviteRow = {
  id: string;
  token: string;
  respondent_role: RespondentRole;
  note: string | null;
  used_at: string | null;
  assessment_id: string | null;
};

/**
 * Legt einen Vergleich an und hängt das Ausgangs-Assessment als
 * Inhaberperspektive daran.
 *
 * Gibt null zurück, wenn die Migration noch nicht gelaufen ist. Der Aufrufer
 * meldet das als klaren Fehler, statt eine halb angelegte Struktur zu
 * hinterlassen.
 */
export async function createComparison(
  assessmentId: string,
  label?: string
): Promise<{ id: string; manageToken: string } | null> {
  const db = getDb();
  if (!db) return null;

  const manageToken = newToken();
  const base = { manage_token: manageToken, label: label ?? null };

  let { data, error } = await db
    .from("uc_comparisons")
    .insert({ ...base, initiator_assessment_id: assessmentId })
    .select("id")
    .single();

  // Spalte existiert noch nicht. Tritt zwischen Deploy und Migration auf.
  // PostgREST meldet beim INSERT PGRST204 (Spalte nicht im Schema-Cache),
  // Postgres selbst 42703. Beide abfangen.
  //
  // Der Vergleich soll dann trotzdem funktionieren; nur die Benachrichtigung
  // über neue Einschätzungen entfällt, weil der Initiator nicht auflösbar ist.
  if (isMissingColumn(error)) {
    console.warn(
      "UC_COMPARISON_NO_INITIATOR_COLUMN: Bitte supabase/uebergabe-check-perspektivvergleich.sql erneut ausführen. Ohne initiator_assessment_id werden keine Benachrichtigungen versendet."
    );
    ({ data, error } = await db
      .from("uc_comparisons")
      .insert(base)
      .select("id")
      .single());
  }

  if (error || !data) {
    console.error("UC_COMPARISON_CREATE", error);
    return null;
  }

  const { error: linkError } = await db
    .from("uc_assessments")
    .update({ comparison_id: data.id, respondent_role: "owner" })
    .eq("id", assessmentId);

  if (linkError) {
    console.error("UC_COMPARISON_LINK", linkError);
    // Der Vergleich ohne das Ausgangsprofil wäre wertlos. Wieder entfernen,
    // damit keine Karteileiche zurückbleibt.
    await db.from("uc_comparisons").delete().eq("id", data.id);
    return null;
  }

  return { id: data.id as string, manageToken };
}

export async function getComparisonByManageToken(
  token: string
): Promise<ComparisonRow | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("uc_comparisons")
    .select("id, created_at, label")
    .eq("manage_token", token)
    .maybeSingle();

  if (error) {
    console.error("UC_COMPARISON_GET", error);
    return null;
  }
  return (data as ComparisonRow) ?? null;
}

export async function renameComparison(
  comparisonId: string,
  label: string
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const { error } = await db
    .from("uc_comparisons")
    .update({ label })
    .eq("id", comparisonId);
  if (error) console.error("UC_COMPARISON_RENAME", error);
  return !error;
}

export async function createInvite(
  comparisonId: string,
  role: RespondentRole,
  note?: string
): Promise<InviteRow | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("uc_comparison_invites")
    .insert({
      comparison_id: comparisonId,
      token: newToken(),
      respondent_role: role,
      note: note?.trim() || null,
    })
    .select("id, token, respondent_role, note, used_at, assessment_id")
    .single();

  if (error || !data) {
    console.error("UC_INVITE_CREATE", error);
    return null;
  }
  return data as InviteRow;
}

export async function listInvites(comparisonId: string): Promise<InviteRow[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("uc_comparison_invites")
    .select("id, token, respondent_role, note, used_at, assessment_id")
    .eq("comparison_id", comparisonId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("UC_INVITE_LIST", error);
    return [];
  }
  return (data as InviteRow[]) ?? [];
}

export async function deleteInvite(
  comparisonId: string,
  inviteId: string
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  // comparison_id mitprüfen: sonst könnte ein gültiges manage_token fremde
  // Einladungen löschen.
  const { error } = await db
    .from("uc_comparison_invites")
    .delete()
    .eq("id", inviteId)
    .eq("comparison_id", comparisonId)
    .is("used_at", null);
  if (error) console.error("UC_INVITE_DELETE", error);
  return !error;
}

export type InviteContext = {
  invite: InviteRow;
  comparisonId: string;
  label: string | null;
};

export async function getInviteByToken(
  token: string
): Promise<InviteContext | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("uc_comparison_invites")
    .select(
      "id, token, respondent_role, note, used_at, assessment_id, comparison_id, uc_comparisons(label)"
    )
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("UC_INVITE_GET", error);
    return null;
  }

  const joined = data as unknown as InviteRow & {
    comparison_id: string;
    uc_comparisons: { label: string | null } | { label: string | null }[] | null;
  };
  const related = Array.isArray(joined.uc_comparisons)
    ? joined.uc_comparisons[0]
    : joined.uc_comparisons;

  return {
    invite: {
      id: joined.id,
      token: joined.token,
      respondent_role: joined.respondent_role,
      note: joined.note,
      used_at: joined.used_at,
      assessment_id: joined.assessment_id,
    },
    comparisonId: joined.comparison_id,
    label: related?.label ?? null,
  };
}

/**
 * Kontaktdaten und Verwaltungslink des Initiators, für die Benachrichtigung
 * über eine neu eingegangene Einschätzung.
 *
 * Gibt null zurück, wenn kein Lead hängt. Das kann bei Vergleichen aus der
 * Zeit vor der Registrierungspflicht vorkommen; dann wird eben nicht
 * benachrichtigt, statt zu raten.
 */
export async function getInitiatorContact(comparisonId: string): Promise<{
  name: string;
  email: string;
  manageToken: string;
  label: string | null;
} | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("uc_comparisons")
    .select("manage_token, label, initiator_assessment_id")
    .eq("id", comparisonId)
    .maybeSingle();

  // Fehlt die Spalte noch, gibt es niemanden zu benachrichtigen. Kein Fehler:
  // dann wurde beim Anlegen auch nichts zugesagt.
  if (error || !data?.initiator_assessment_id) {
    if (error && !isMissingColumn(error)) {
      console.error("UC_INITIATOR_LOOKUP", error);
    }
    return null;
  }

  const { data: lead, error: leadError } = await db
    .from("uc_leads")
    .select("name, email")
    .eq("assessment_id", data.initiator_assessment_id)
    .maybeSingle();

  if (leadError || !lead?.email) {
    if (leadError) console.error("UC_INITIATOR_LEAD", leadError);
    return null;
  }

  return {
    name: lead.name as string,
    email: lead.email as string,
    manageToken: data.manage_token as string,
    label: (data.label as string | null) ?? null,
  };
}

/** Markiert eine Einladung als eingelöst. */
export async function completeInvite(
  inviteId: string,
  assessmentId: string
): Promise<void> {
  const db = getDb();
  if (!db) return;
  const { error } = await db
    .from("uc_comparison_invites")
    .update({ used_at: new Date().toISOString(), assessment_id: assessmentId })
    .eq("id", inviteId);
  if (error) console.error("UC_INVITE_COMPLETE", error);
}

export type ParticipationRow = {
  id: string;
  respondent_role: RespondentRole;
  answers: Answers;
};

/** Alle Antwortsätze eines Vergleichs, Grundlage der Auswertung. */
export async function listParticipations(
  comparisonId: string
): Promise<ParticipationRow[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from("uc_assessments")
    .select("id, respondent_role, answers")
    .eq("comparison_id", comparisonId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("UC_COMPARISON_PARTICIPATIONS", error);
    return [];
  }
  return (data as ParticipationRow[]) ?? [];
}

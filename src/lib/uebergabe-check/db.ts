// src/lib/uebergabe-check/db.ts
//
// Supabase-Zugriff für den Übergabe-Check. NUR serverseitig verwenden:
// der Service-Role-Key umgeht Row Level Security und darf niemals im
// Client-Bundle landen. Deshalb bewusst ohne NEXT_PUBLIC_-Prefix.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Answers } from "./items";
import type { Scores } from "./scoring";

export type AssessmentRow = {
  id: string;
  created_at: string;
  item_version: string;
  locale: string;
  organization_id: string | null;
  respondent_role: string;
  /**
   * Klammert mehrere Assessments zu einem Perspektivvergleich.
   *
   * Optional, weil die Spalte erst durch
   * supabase/uebergabe-check-perspektivvergleich.sql angelegt wird. Sie wird
   * bewusst noch nicht mitgelesen: ein Select auf eine fehlende Spalte lässt
   * Supabase mit 42703 fehlschlagen und die Ergebnisseite liefe ins Leere.
   * Erst mitselektieren, wenn die Auswertung sie tatsächlich braucht.
   */
  comparison_id?: string | null;
  answers: Answers;
  scores: Scores;
  /** IDs der ausgelösten Item-Hinweise, z. B. "D2_I3_KEY_PERSON_RISK". */
  flags: string[];
  source: string | null;
};

let cached: SupabaseClient | null = null;

/**
 * Gibt den Service-Role-Client zurück oder null, wenn die Umgebung nicht
 * konfiguriert ist. Aufrufer behandeln null als „Speichern nicht möglich“ –
 * der Check bleibt dann trotzdem benutzbar (Ergebnis wird nur angezeigt).
 */
export function getDb(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Lädt einen Datensatz für die permanente Ergebnisseite. */
export async function getAssessment(id: string): Promise<AssessmentRow | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from("uc_assessments")
    .select("id, created_at, item_version, locale, organization_id, respondent_role, answers, scores, flags, source")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("UC_DB_GET_ASSESSMENT", error);
    return null;
  }
  return (data as AssessmentRow) ?? null;
}

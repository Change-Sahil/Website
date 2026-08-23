-- ============================================================================
--  Uebergabe-Check: Speicherfrist fuer Perspektivvergleiche
--
--  Ergaenzt uc_purge_expired() um die Vergleichsdaten. Ohne diesen Schritt
--  wuerden Vergleiche unbegrenzt bestehen bleiben, waehrend fuer den
--  Einzelcheck bereits Fristen gelten.
--
--  Regel: Ein Vergleich wird ZWOELF Monate nach der letzten Aktivitaet
--  geloescht. Letzte Aktivitaet ist das juengste der folgenden Ereignisse:
--    • Anlage des Vergleichs
--    • Anlage einer Einladung
--    • Eingang einer Einschaetzung
--
--  Zwoelf Monate, weil ein Vergleich personenbezogen nutzbar ist: Der
--  Verwaltungslink identifiziert den Initiator, und bei kleinen Gruppen sind
--  Einzelantworten faktisch zuordenbar. Damit gilt dieselbe Frist wie fuer
--  verknuepfte Kontaktdaten.
--
--  Was NICHT geloescht wird: die einzelnen Antwortsaetze in uc_assessments.
--  Sie verlieren durch das Loeschen des Vergleichs ihre Zuordnung zueinander
--  (comparison_id wird null) und unterliegen danach der bestehenden
--  Sechsmonatsregel fuer Durchlaeufe ohne Kontaktdaten. Vollstaendig
--  anonymisierte Aggregationen duerfen erhalten bleiben.
--
--  Einmalig im Supabase SQL Editor ausfuehren, NACHDEM
--  uebergabe-check-perspektivvergleich.sql und uebergabe-check-loeschlogik.sql
--  gelaufen sind. Wiederholbar.
-- ============================================================================

-- ── Letzte Aktivitaet je Vergleich ──────────────────────────────────────────
create or replace view public.uc_comparison_activity as
select
  c.id,
  c.created_at,
  greatest(
    c.created_at,
    coalesce((select max(i.created_at) from public.uc_comparison_invites i
               where i.comparison_id = c.id), c.created_at),
    coalesce((select max(i.used_at) from public.uc_comparison_invites i
               where i.comparison_id = c.id), c.created_at),
    coalesce((select max(a.created_at) from public.uc_assessments a
               where a.comparison_id = c.id), c.created_at)
  ) as last_activity
from public.uc_comparisons c;

comment on view public.uc_comparison_activity is
  'Letzte Aktivitaet je Vergleich, Grundlage der Zwoelfmonatsfrist.';

-- ── Aufraeumfunktion erweitern ──────────────────────────────────────────────
create or replace function public.uc_purge_expired()
returns table (
  anonymised_assessments integer,
  deleted_leads          integer,
  deleted_comparisons    integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anonymised  integer := 0;
  v_deleted     integer := 0;
  v_comparisons integer := 0;
begin
  -- 1) Ohne Kontaktdaten, aelter als sechs Monate: Herkunftsangabe entfernen.
  update public.uc_assessments a
     set source = null
   where a.created_at < now() - interval '6 months'
     and a.source is not null
     and not exists (
       select 1 from public.uc_leads l where l.assessment_id = a.id
     );
  get diagnostics v_anonymised = row_count;

  -- 2) Kontaktdaten, aelter als zwoelf Monate: vollstaendig loeschen.
  delete from public.uc_leads l
   where l.created_at < now() - interval '12 months';
  get diagnostics v_deleted = row_count;

  -- 3) Vergleiche ohne Aktivitaet seit zwoelf Monaten loeschen.
  --    Die Einladungen haengen per ON DELETE CASCADE daran, die Assessments
  --    per ON DELETE SET NULL: Sie verlieren nur die Zuordnung zueinander.
  delete from public.uc_comparisons c
   using public.uc_comparison_activity act
   where act.id = c.id
     and act.last_activity < now() - interval '12 months';
  get diagnostics v_comparisons = row_count;

  return query select v_anonymised, v_deleted, v_comparisons;
end;
$$;

comment on function public.uc_purge_expired() is
  'Speicherfristen: 6 Monate ohne Kontaktdaten, 12 Monate mit Kontaktdaten, 12 Monate nach letzter Aktivitaet fuer Perspektivvergleiche.';

-- ── Manuelle Kontrolle ──────────────────────────────────────────────────────
-- Was wuerde beim naechsten Lauf passieren?
--
--   select count(*) as zu_loeschende_vergleiche
--     from public.uc_comparison_activity
--    where last_activity < now() - interval '12 months';
--
-- Sofort ausfuehren:
--
--   select * from public.uc_purge_expired();
--
-- Der bestehende Cron-Job ruft dieselbe Funktion auf und muss nicht neu
-- eingerichtet werden.

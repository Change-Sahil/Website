-- ============================================================================
--  Uebergabe-Check: automatische Loeschung nach Ablauf der Speicherfristen
--
--  Setzt um, was die Datenschutzerklaerung zusagt:
--
--   • Testdurchlaeufe OHNE Kontaktdaten werden spaetestens nach SECHS Monaten
--     geloescht oder so anonymisiert, dass eine Zuordnung zu einer Person nicht
--     mehr moeglich ist.
--   • Wurden Kontaktdaten verknuepft, werden die damit verbundenen Daten
--     spaetestens nach ZWOELF Monaten geloescht.
--   • Vollstaendig anonymisierte Daten duerfen fuer statistische Auswertungen
--     und zur Weiterentwicklung des Instruments erhalten bleiben.
--
--  Umsetzung: Nach zwoelf Monaten wird der Lead-Datensatz geloescht. Damit
--  entfaellt jeder Personenbezug; der verbleibende Testdurchlauf enthaelt nur
--  noch Antworten und Punktwerte zu einer Organisation, keine Angaben zu einer
--  Person. Bei Durchlaeufen ohne Kontaktdaten wird nach sechs Monaten das
--  Herkunftsfeld geleert, das als einziges Feld einen indirekten Rueckschluss
--  erlauben koennte.
--
--  Einmalig im Supabase SQL Editor ausfuehren, NACHDEM uebergabe-check.sql
--  gelaufen ist.
-- ============================================================================

-- ── Aufraeumfunktion ────────────────────────────────────────────────────────
create or replace function public.uc_purge_expired()
returns table (anonymised_assessments integer, deleted_leads integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anonymised integer := 0;
  v_deleted    integer := 0;
begin
  -- 1) Ohne Kontaktdaten, aelter als sechs Monate: Herkunftsangabe entfernen.
  --    Antworten und Punktwerte bleiben als anonyme Statistik erhalten.
  update public.uc_assessments a
     set source = null
   where a.created_at < now() - interval '6 months'
     and a.source is not null
     and not exists (
       select 1 from public.uc_leads l where l.assessment_id = a.id
     );
  get diagnostics v_anonymised = row_count;

  -- 2) Kontaktdaten, aelter als zwoelf Monate: vollstaendig loeschen.
  --    Der Testdurchlauf verliert damit jeden Personenbezug.
  delete from public.uc_leads l
   where l.created_at < now() - interval '12 months';
  get diagnostics v_deleted = row_count;

  return query select v_anonymised, v_deleted;
end;
$$;

comment on function public.uc_purge_expired() is
  'Setzt die Speicherfristen der Datenschutzerklaerung um: 6 Monate ohne Kontaktdaten, 12 Monate mit Kontaktdaten.';

-- ── Taegliche Ausfuehrung ───────────────────────────────────────────────────
-- Voraussetzung: Erweiterung pg_cron aktivieren unter
-- Dashboard → Database → Extensions → pg_cron.
--
-- Danach diesen Block ausfuehren. Er ist wiederholbar: ein bereits
-- vorhandener Job wird zuerst entfernt.

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule('uc-purge-expired')
      where exists (select 1 from cron.job where jobname = 'uc-purge-expired');

    perform cron.schedule(
      'uc-purge-expired',
      '17 3 * * *',                        -- taeglich um 03:17 UTC
      $job$ select public.uc_purge_expired(); $job$
    );
    raise notice 'Cron-Job uc-purge-expired eingerichtet.';
  else
    raise notice 'pg_cron ist nicht aktiviert. Funktion angelegt, aber kein Zeitplan. Extension aktivieren und diesen Block erneut ausfuehren.';
  end if;
end;
$$;

-- ── Manuelle Kontrolle ──────────────────────────────────────────────────────
-- Was wuerde beim naechsten Lauf passieren?
--
--   select
--     (select count(*) from public.uc_assessments a
--       where a.created_at < now() - interval '6 months'
--         and a.source is not null
--         and not exists (select 1 from public.uc_leads l
--                          where l.assessment_id = a.id)) as zu_anonymisieren,
--     (select count(*) from public.uc_leads
--       where created_at < now() - interval '12 months') as zu_loeschen;
--
-- Sofort ausfuehren:
--
--   select * from public.uc_purge_expired();

-- ============================================================================
--  Uebergabe-Check: Nutzung ansehen
--
--  Im Supabase SQL Editor einfuegen und ausfuehren. Rein lesend, veraendert
--  nichts. Am besten als benannte Abfrage speichern ("Uebergabe-Check
--  Nutzung"), dann genuegt kuenftig ein Klick.
--
--  Die vier Abfragen entsprechen den Stufen des Trichters:
--    1. Wie viele haben den Check gemacht?
--    2. Wie verteilt sich das ueber die Tage?
--    3. Wer hat Kontaktdaten hinterlassen?
--    4. Was ist aus den Perspektivvergleichen geworden?
--
--  Der SQL Editor zeigt immer nur das Ergebnis der LETZTEN Abfrage. Zum
--  Ansehen einer einzelnen Stufe die uebrigen markieren und auskommentieren,
--  oder die gewuenschte Abfrage einzeln markieren und "Run selected"
--  verwenden.
-- ============================================================================

-- ── 1. Trichter auf einen Blick ─────────────────────────────────────────────
select
  (select count(*) from public.uc_assessments
    where comparison_id is null)                     as einzelchecks,
  (select count(*) from public.uc_assessments
    where comparison_id is not null)                 as im_vergleich,
  (select count(*) from public.uc_leads)             as kontaktdaten,
  (select count(*) from public.uc_leads
    where report_sent_at is not null)                as bericht_versendet,
  (select count(*) from public.uc_leads
    where consent_marketing)                         as marketing_ok,
  (select count(*) from public.uc_comparisons)       as vergleiche,
  (select count(*) from public.uc_comparison_invites) as einladungen,
  (select count(*) from public.uc_comparison_invites
    where used_at is not null)                       as einladungen_beantwortet;

-- ── 2. Durchlaeufe je Tag, letzte 30 Tage ───────────────────────────────────
select
  date_trunc('day', created_at)::date as tag,
  count(*)                            as durchlaeufe,
  count(*) filter (where respondent_role = 'owner')      as inhaber,
  count(*) filter (where respondent_role <> 'owner')     as teilnehmer
from public.uc_assessments
where created_at > now() - interval '30 days'
group by 1
order by 1 desc;

-- ── 3. Kontaktdaten, neueste zuerst ─────────────────────────────────────────
-- Zeigt auch, ob die Ergebnismail tatsaechlich rausging. Steht dort NULL,
-- wurde der Datensatz angelegt, der Versand ist aber gescheitert.
select
  l.created_at::timestamp(0) as zeitpunkt,
  l.name,
  l.email,
  l.company                  as unternehmen,
  l.consent_marketing        as marketing_einwilligung,
  l.report_sent_at is not null as bericht_versendet,
  a.source                   as herkunft
from public.uc_leads l
left join public.uc_assessments a on a.id = l.assessment_id
order by l.created_at desc;

-- ── 4. Perspektivvergleiche mit Beteiligung ─────────────────────────────────
select
  c.created_at::timestamp(0)                                as angelegt,
  coalesce(c.label, '(ohne Bezeichnung)')                   as bezeichnung,
  (select count(*) from public.uc_assessments a
    where a.comparison_id = c.id)                           as einschaetzungen,
  (select count(*) from public.uc_comparison_invites i
    where i.comparison_id = c.id)                           as einladungen,
  (select count(*) from public.uc_comparison_invites i
    where i.comparison_id = c.id and i.used_at is not null) as davon_beantwortet
from public.uc_comparisons c
order by c.created_at desc;

-- ── Hinweis zur Herkunft ────────────────────────────────────────────────────
-- Die Spalte "source" fuellt sich aus dem Query-Parameter der Einstiegs-URL
-- oder dem Referrer. Fuer eigene Kampagnen deshalb mit Parameter verlinken:
--
--   https://change-werkstatt-sahil.de/de/uebergabe-check?src=linkedin-2026-09
--   https://change-werkstatt-sahil.de/de/uebergabe-check?src=pretest-01
--
-- Ohne Parameter steht dort der Referrer, bei Direktaufrufen nichts.

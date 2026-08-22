-- ============================================================================
--  Übergabe-Check – Datenbankschema (Beta v1.0)
--  Einmalig im Supabase SQL Editor ausführen:
--  Dashboard → SQL Editor → New query → Inhalt einfügen → Run
-- ============================================================================
--
--  Datenschutz-Architektur:
--   • uc_assessments wird ANONYM gespeichert (keine Kontaktdaten, keine IP).
--   • uc_leads wird nur angelegt, wenn der Nutzer die Ergebniszusendung
--     ausdrücklich wünscht. Einwilligung Zusendung und Einwilligung
--     Marketingkommunikation sind getrennte Spalten.
--   • uc_feedback referenziert das Assessment über die ID_Testfall (FK),
--     bleibt selbst aber ohne Personenbezug.
--
--  Row Level Security ist auf allen Tabellen aktiv und es gibt bewusst KEINE
--  Policies. Damit hat ausschließlich der Service-Role-Key Zugriff (er umgeht
--  RLS); der anon-Key kann selbst bei Leak nichts lesen oder schreiben.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Organisationen ──────────────────────────────────────────────────────────
-- Vorbereitung für Mehrfach-Assessments pro Unternehmen (Inhaber vs. zweite
-- Führungsebene → Wahrnehmungslücke). In Beta v1.0 im Frontend NICHT angeboten;
-- Datensätze werden vorerst mit organization_id = null geschrieben.
create table if not exists public.uc_organizations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  notes       text
);

-- ── Assessments (ID_Testfall) ───────────────────────────────────────────────
create table if not exists public.uc_assessments (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  -- Version des Item-Pools. Muss bei jeder Formulierungsänderung hochgezählt
  -- werden, sonst sind Beta-Kohorten nicht vergleichbar.
  item_version     text not null,
  locale           text not null default 'de',

  -- Mehrfach-Assessments: technisch vorgesehen, Frontend nutzt es noch nicht.
  organization_id  uuid references public.uc_organizations (id) on delete set null,
  respondent_role  text not null default 'owner'
                     check (respondent_role in ('owner', 'management', 'other')),

  -- Rohe Likert-Werte 1–5, Schlüssel = Item-ID: { "1.1": 4, "1.2": 2, … }
  answers          jsonb not null,
  -- Dimensionale Scores 0–100: { "1": 75, "2": 50, … }
  scores           jsonb not null,
  -- IDs der ausgeloesten Item-Hinweise ("Auffaellig in Ihren Antworten"),
  -- z. B. ["D2_I3_KEY_PERSON_RISK"]. Werden dem Nutzer im Bericht angezeigt.
  flags            jsonb not null default '[]'::jsonb,

  -- Herkunft des Aufrufs (z. B. utm_source oder 'pretest'), für die Auswertung.
  source           text
);

create index if not exists uc_assessments_created_at_idx
  on public.uc_assessments (created_at desc);
create index if not exists uc_assessments_organization_idx
  on public.uc_assessments (organization_id);

-- ── Leads ───────────────────────────────────────────────────────────────────
-- Wird erst angelegt, wenn der Nutzer die Zusendung des Berichts wünscht.
create table if not exists public.uc_leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  assessment_id       uuid not null references public.uc_assessments (id) on delete cascade,

  name                text not null,
  email               text not null,
  company             text,

  -- Getrennte Einwilligungen (DSGVO Art. 6 Abs. 1 lit. a)
  consent_report      boolean not null default false,
  consent_marketing   boolean not null default false,
  consent_at          timestamptz not null default now(),

  -- Versandstatus der Ergebnis-Mail
  report_sent_at      timestamptz
);

create unique index if not exists uc_leads_assessment_uniq
  on public.uc_leads (assessment_id);
create index if not exists uc_leads_email_idx
  on public.uc_leads (lower(email));

-- ── Beta-Feedback ───────────────────────────────────────────────────────────
-- Fünf Pflichtfragen der Pilotphase, über den Fremdschlüssel mit dem Testfall
-- verknüpft (Spec Abschnitt 5.1).
create table if not exists public.uc_feedback (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  assessment_id         uuid not null references public.uc_assessments (id) on delete cascade,

  q1_verstaendlichkeit  text,
  q2_vollstaendigkeit   text,
  q3_praxisabgleich     text,
  q4_anwendbarkeit      text,
  q5_verbesserung       text
);

create unique index if not exists uc_feedback_assessment_uniq
  on public.uc_feedback (assessment_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.uc_organizations enable row level security;
alter table public.uc_assessments   enable row level security;
alter table public.uc_leads         enable row level security;
alter table public.uc_feedback      enable row level security;

-- ── Auswertungs-View für die Beta-Analyse ───────────────────────────────────
-- Ein Datensatz pro Testfall mit Scores, Flags und Feedback nebeneinander.
create or replace view public.uc_beta_overview as
select
  a.id                                    as assessment_id,
  a.created_at,
  a.item_version,
  a.respondent_role,
  a.source,
  (a.scores ->> '1')::numeric             as s_dim1,
  (a.scores ->> '2')::numeric             as s_dim2,
  (a.scores ->> '3')::numeric             as s_dim3,
  (a.scores ->> '4')::numeric             as s_dim4,
  (a.scores ->> '5')::numeric             as s_dim5,
  (a.scores ->> '6')::numeric             as s_dim6,
  jsonb_array_length(a.flags)             as flag_count,
  a.flags,
  a.answers,
  (l.id is not null)                      as has_lead,
  l.consent_marketing,
  (f.id is not null)                      as has_feedback,
  f.q1_verstaendlichkeit,
  f.q2_vollstaendigkeit,
  f.q3_praxisabgleich,
  f.q4_anwendbarkeit,
  f.q5_verbesserung
from public.uc_assessments a
left join public.uc_leads    l on l.assessment_id = a.id
left join public.uc_feedback f on f.assessment_id = a.id
order by a.created_at desc;

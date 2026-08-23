-- ============================================================================
--  Uebergabe-Check: Vorbereitung des Perspektivvergleichs
--
--  Legt die Struktur an, damit mehrere Assessments desselben Unternehmens aus
--  verschiedenen Rollen zusammengefuehrt werden koennen.
--
--  WICHTIG: Damit ist der Perspektivvergleich NICHT freigeschaltet. Die
--  Freischaltung erfolgt ausschliesslich ueber COMPARISON_ENABLED in
--  src/lib/uebergabe-check/comparison.ts. Der kostenlose Schnellcheck bleibt
--  ein Einzelcheck.
--
--  Einmalig im Supabase SQL Editor ausfuehren, NACHDEM uebergabe-check.sql
--  gelaufen ist. Wiederholbar.
-- ============================================================================

-- ── Vergleichsvorgang ───────────────────────────────────────────────────────
-- Klammert mehrere Assessments zu einem Perspektivvergleich zusammen.
create table if not exists public.uc_comparisons (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Optionaler Bezug auf eine Organisation, falls dort gepflegt.
  organization_id uuid references public.uc_organizations (id) on delete set null,

  -- Frei waehlbare Bezeichnung, z. B. "Perspektivvergleich Mustermann GmbH".
  label         text,

  -- Wer den Vergleich angestossen hat. Zeigt auf den Lead des Initiators,
  -- damit die Kontaktdaten nicht doppelt gespeichert werden.
  initiated_by_lead uuid references public.uc_leads (id) on delete set null,

  -- Solange false, werden eingehende Assessments zwar zugeordnet, aber keine
  -- Vergleichsauswertung erzeugt.
  released      boolean not null default false
);

create index if not exists uc_comparisons_created_at_idx
  on public.uc_comparisons (created_at desc);

-- ── Einladungen ─────────────────────────────────────────────────────────────
-- Ein Token je Teilnehmer. Der Token steht im individuellen Link und wird beim
-- Absenden des Fragebogens mitgeschickt.
create table if not exists public.uc_comparison_invites (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  comparison_id  uuid not null references public.uc_comparisons (id) on delete cascade,

  token          text not null unique,
  respondent_role text not null
                   check (respondent_role in
                     ('owner', 'management', 'leader', 'key_person', 'other')),

  -- Optionale interne Bezeichnung, z. B. "Leitung Fertigung". Bewusst kein
  -- Pflichtfeld: der Vergleich ist rollenbezogen, nicht personenbezogen.
  note           text,

  used_at        timestamptz,
  assessment_id  uuid references public.uc_assessments (id) on delete set null
);

create index if not exists uc_comparison_invites_comparison_idx
  on public.uc_comparison_invites (comparison_id);

-- ── Assessments an den Vergleich anbinden ───────────────────────────────────
alter table public.uc_assessments
  add column if not exists comparison_id uuid
    references public.uc_comparisons (id) on delete set null;

create index if not exists uc_assessments_comparison_idx
  on public.uc_assessments (comparison_id);

-- Rollenliste erweitern. Bisher waren nur owner, management und other erlaubt.
alter table public.uc_assessments
  drop constraint if exists uc_assessments_respondent_role_check;

alter table public.uc_assessments
  add constraint uc_assessments_respondent_role_check
  check (respondent_role in
    ('owner', 'management', 'leader', 'key_person', 'other'));

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.uc_comparisons        enable row level security;
alter table public.uc_comparison_invites enable row level security;

-- ── Auswertungs-View ────────────────────────────────────────────────────────
-- Dimensionswerte je Rolle innerhalb eines Vergleichs. Reine Aggregation ohne
-- Interpretation: Aus einer Differenz laesst sich NICHT ableiten, welche
-- Perspektive zutrifft.
create or replace view public.uc_comparison_scores as
select
  a.comparison_id,
  a.respondent_role,
  count(*)                                   as teilnehmer,
  round(avg((a.scores ->> '1')::numeric), 2) as s_dim1,
  round(avg((a.scores ->> '2')::numeric), 2) as s_dim2,
  round(avg((a.scores ->> '3')::numeric), 2) as s_dim3,
  round(avg((a.scores ->> '4')::numeric), 2) as s_dim4,
  round(avg((a.scores ->> '5')::numeric), 2) as s_dim5,
  round(avg((a.scores ->> '6')::numeric), 2) as s_dim6
from public.uc_assessments a
where a.comparison_id is not null
group by a.comparison_id, a.respondent_role;

comment on view public.uc_comparison_scores is
  'Rollenbezogene Mittelwerte je Vergleich. Keine Interpretation von Differenzen.';

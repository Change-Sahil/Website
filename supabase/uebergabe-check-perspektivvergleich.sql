-- ============================================================================
--  Uebergabe-Check: Perspektivvergleich
--
--  Mehrere Personen desselben Unternehmens beantworten denselben Check aus
--  ihrer jeweiligen Rolle. Die Einzelergebnisse werden zu einem Vergleich
--  zusammengefuehrt.
--
--  Einmalig im Supabase SQL Editor ausfuehren, NACHDEM uebergabe-check.sql
--  gelaufen ist. Wiederholbar.
--
--  WICHTIG: Ohne diese Migration bleibt der Einzelcheck voll funktionsfaehig,
--  aber der Button "Perspektivvergleich starten" laeuft auf einen Fehler.
-- ============================================================================

-- ── Vergleichsvorgang ───────────────────────────────────────────────────────
create table if not exists public.uc_comparisons (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Geheimer Link des Initiators. Wer ihn hat, sieht die Auswertung und kann
  -- Teilnehmer einladen. Bewusst kein Login: der Check ist anonym nutzbar.
  manage_token  text not null unique,

  -- Frei waehlbare Bezeichnung, z. B. "Uebergabe-Check Muster GmbH".
  label         text,

  organization_id uuid references public.uc_organizations (id) on delete set null
);

create index if not exists uc_comparisons_created_at_idx
  on public.uc_comparisons (created_at desc);

-- ── Einladungen ─────────────────────────────────────────────────────────────
-- Ein Token je eingeladener Person. Steht im individuellen Link.
create table if not exists public.uc_comparison_invites (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  comparison_id  uuid not null references public.uc_comparisons (id) on delete cascade,

  token          text not null unique,
  respondent_role text not null
                   check (respondent_role in ('owner', 'leader', 'key_person')),

  -- Optionale interne Bezeichnung, z. B. "Leitung Fertigung". Bewusst kein
  -- Pflichtfeld und bewusst keine E-Mail-Adresse: der Vergleich ist
  -- rollenbezogen, nicht personenbezogen.
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

-- Rollenliste an das Modell angleichen: Inhaber/Geschaeftsfuehrung,
-- Fuehrungskraft, Schluesselperson.
alter table public.uc_assessments
  drop constraint if exists uc_assessments_respondent_role_check;

alter table public.uc_assessments
  add constraint uc_assessments_respondent_role_check
  check (respondent_role in ('owner', 'leader', 'key_person'));

-- Altbestand: fruehere Rollenwerte auf 'owner' vereinheitlichen. Alle
-- bisherigen Datensaetze stammen aus dem Einzelcheck des Inhabers.
update public.uc_assessments
   set respondent_role = 'owner'
 where respondent_role not in ('owner', 'leader', 'key_person');

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Keine Policies: nur der service_role-Schluessel des Servers kommt heran.
alter table public.uc_comparisons        enable row level security;
alter table public.uc_comparison_invites enable row level security;

-- ── Auswertungs-View ────────────────────────────────────────────────────────
-- Rollenbezogene Mittelwerte je Vergleich. Reine Aggregation ohne
-- Interpretation: Aus einer Differenz laesst sich NICHT ableiten, welche
-- Perspektive zutrifft.
create or replace view public.uc_comparison_scores as
select
  a.comparison_id,
  a.respondent_role,
  count(*)                                   as teilnehmer,
  round(avg((a.scores ->> '1')::numeric), 1) as s_dim1,
  round(avg((a.scores ->> '2')::numeric), 1) as s_dim2,
  round(avg((a.scores ->> '3')::numeric), 1) as s_dim3,
  round(avg((a.scores ->> '4')::numeric), 1) as s_dim4,
  round(avg((a.scores ->> '5')::numeric), 1) as s_dim5,
  round(avg((a.scores ->> '6')::numeric), 1) as s_dim6
from public.uc_assessments a
where a.comparison_id is not null
group by a.comparison_id, a.respondent_role;

comment on view public.uc_comparison_scores is
  'Rollenbezogene Mittelwerte je Vergleich. Keine Interpretation von Differenzen.';

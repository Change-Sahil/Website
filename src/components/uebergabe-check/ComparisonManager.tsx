// src/components/uebergabe-check/ComparisonManager.tsx
//
// Verwaltung eines Perspektivvergleichs: benennen, Teilnehmer einladen,
// Einladungslinks kopieren.
//
// Bewusst über kopierbare Links statt über E-Mail-Versand. Würde der Initiator
// hier die Adressen seiner Führungskräfte eintragen, verarbeiteten wir
// personenbezogene Daten Dritter, die nie eingewilligt haben. Das braucht
// vorher eine Ergänzung der Datenschutzerklärung. Der Link erfüllt denselben
// Zweck und lässt die Weitergabe bei dem, der die Beziehung hat.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  RESPONDENT_ROLES,
  SMALL_GROUP_NOTE,
  roleMeta,
  type RespondentRole,
} from "@/lib/uebergabe-check/comparison";

const ACCENT = "rgb(0,168,165)";

export type ManagedInvite = {
  id: string;
  token: string;
  respondent_role: RespondentRole;
  note: string | null;
  used_at: string | null;
};

function InviteRow({
  invite,
  origin,
  manageToken,
  onChanged,
}: {
  invite: ManagedInvite;
  origin: string;
  manageToken: string;
  onChanged: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const url = `${origin}/de/uebergabe-check/teilnehmen/${invite.token}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Zwischenablage gesperrt: das Feld ist markierbar, das genügt.
    }
  }

  async function revoke() {
    setBusy(true);
    await fetch("/api/uebergabe-check/vergleich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", manageToken, inviteId: invite.id }),
    });
    setBusy(false);
    onChanged();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-[15px] font-semibold text-slate-900">
            {roleMeta(invite.respondent_role).singular}
          </span>
          {invite.note && (
            <span className="ml-2 text-[14px] text-slate-500">{invite.note}</span>
          )}
        </div>
        {invite.used_at ? (
          <span
            className="rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{ background: "rgba(0,168,165,0.12)", color: "rgb(0,112,125)" }}
          >
            Beantwortet
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-semibold text-slate-500">
            Offen
          </span>
        )}
      </div>

      {!invite.used_at && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={url}
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 rounded-[5px] border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-600"
            />
            <button
              type="button"
              onClick={copy}
              className="rounded-[5px] px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: ACCENT }}
            >
              {copied ? "Kopiert" : "Link kopieren"}
            </button>
          </div>
          <button
            type="button"
            onClick={revoke}
            disabled={busy}
            className="mt-2 text-[13px] font-medium text-slate-500 underline underline-offset-4 hover:text-slate-800 disabled:opacity-50"
          >
            Einladung zurückziehen
          </button>
        </>
      )}
    </div>
  );
}

export default function ComparisonManager({
  manageToken,
  label,
  invites,
  origin,
}: {
  manageToken: string;
  label: string | null;
  invites: ManagedInvite[];
  origin: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState<RespondentRole>("leader");
  const [note, setNote] = useState("");
  const [name, setName] = useState(label ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/uebergabe-check/vergleich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, manageToken }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? "Das hat nicht geklappt. Bitte erneut versuchen.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Das hat nicht geklappt. Bitte erneut versuchen.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Bezeichnung ────────────────────────────────────────────────── */}
      <section className="panel">
        <h2 className="text-lg font-bold text-slate-900">Bezeichnung</h2>
        <p className="mt-1.5 text-[14px] leading-6 muted">
          Nur für Ihre eigene Orientierung, etwa wenn Sie mehrere Vergleiche
          führen. Eingeladene Personen sehen sie ebenfalls.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="z. B. Übergabe-Check Muster GmbH"
            maxLength={120}
            className="min-w-0 flex-1 rounded-[5px] border border-slate-300 px-3 py-2 text-[15px]"
          />
          <button
            type="button"
            onClick={() => name.trim() && post({ action: "rename", label: name.trim() })}
            disabled={busy || !name.trim()}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Speichern
          </button>
        </div>
      </section>

      {/* ── Einladen ───────────────────────────────────────────────────── */}
      <section className="panel">
        <h2 className="text-lg font-bold text-slate-900">Teilnehmer einladen</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-6 muted">
          Legen Sie je Person einen eigenen Link an und geben Sie ihn weiter.
          Jeder Link gilt für genau eine Teilnahme. Die Aussagen sind auf die
          jeweilige Rolle zugeschnitten, gemessen wird bei allen dasselbe.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Rolle</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as RespondentRole)}
              className="mt-1 w-full rounded-[5px] border border-slate-300 px-3 py-2 text-[15px]"
            >
              {RESPONDENT_ROLES.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.singular}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">
              Notiz (optional)
            </span>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="z. B. Leitung Fertigung"
              maxLength={120}
              className="mt-1 w-full rounded-[5px] border border-slate-300 px-3 py-2 text-[15px]"
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={async () => {
                const done = await post({ action: "invite", role, note: note || undefined });
                if (done) setNote("");
              }}
              disabled={busy}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Link erzeugen
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[14px] font-medium text-red-600">
            {error}
          </p>
        )}

        {invites.length > 0 && (
          <div className="mt-6 space-y-3">
            {invites.map((invite) => (
              <InviteRow
                key={invite.id}
                invite={invite}
                origin={origin}
                manageToken={manageToken}
                onChanged={() => router.refresh()}
              />
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-slate-50/80 p-5 text-[13px] leading-6 muted">
          <strong className="font-semibold text-slate-700">
            Bitte beachten:
          </strong>{" "}
          {SMALL_GROUP_NOTE}
        </div>
      </section>
    </div>
  );
}

// src/app/[locale]/uebergabe-check/vergleich/[token]/page.tsx
//
// Verwaltungs- und Auswertungsseite des Perspektivvergleichs.
//
// Erreichbar nur über das Verwaltungstoken im Link. Der Token steht in keiner
// Datenbank im Klartext beim Nutzer, sondern nur in dessen Adresszeile: die
// Seite ist deshalb noindex und der Initiator wird aufgefordert, sie zu
// speichern.

import type { Metadata } from "next";
import { headers } from "next/headers";

import ComparisonManager from "@/components/uebergabe-check/ComparisonManager";
import ComparisonReport from "@/components/uebergabe-check/ComparisonReport";
import {
  PrintComparisonClosing,
  PrintComparisonCover,
  PrintHeader,
} from "@/components/uebergabe-check/PrintFrame";
import { buildComparison } from "@/lib/uebergabe-check/comparison";
import {
  getComparisonByManageToken,
  listInvites,
  listParticipations,
} from "@/lib/uebergabe-check/comparison-db";

export const dynamic = "force-dynamic";

const DATE_FORMAT = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const metadata: Metadata = {
  title: "Perspektivvergleich",
  robots: { index: false, follow: false, nocache: true },
};

async function currentOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const list = await headers();
  const host = list.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export default async function VergleichPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const comparison = await getComparisonByManageToken(token);

  if (!comparison) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20">
        <div className="panel">
          <h1 className="text-2xl font-bold text-slate-900">
            Dieser Verwaltungslink ist nicht gültig.
          </h1>
          <p className="mt-4 text-[15px] leading-7 muted">
            Bitte prüfen Sie, ob der Link vollständig kopiert wurde. Wenn Sie
            ihn verloren haben, legen Sie den Vergleich bitte neu an. Aus
            Sicherheitsgründen lässt er sich nicht wiederherstellen.
          </p>
        </div>
      </main>
    );
  }

  const [invites, participations, origin] = await Promise.all([
    listInvites(comparison.id),
    listParticipations(comparison.id),
    currentOrigin(),
  ]);

  const result = buildComparison(
    participations.map((entry) => ({
      id: entry.id,
      role: entry.respondent_role,
      answers: entry.answers,
    }))
  );

  const open = invites.filter((invite) => !invite.used_at).length;
  const created = DATE_FORMAT.format(new Date(comparison.created_at));

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <div className="space-y-6 md:space-y-8">
        {result.ready && (
          <>
            <PrintComparisonCover
              roles={result.profiles.map((profile) => ({
                label: profile.label,
                participants: profile.participants,
              }))}
              label={comparison.label}
              date={created}
            />
            <PrintHeader date={created} title="Ihr Perspektivvergleich" />
          </>
        )}

        {/* Bildschirmteile: im Ausdruck ersetzt sie das Deckblatt. */}
        <header className="uc-no-print max-w-3xl">
          <div className="page-eyebrow">Perspektivvergleich</div>
          <h1 className="title mt-3">
            {comparison.label ?? "Wie sehen andere Ihr Unternehmen?"}
          </h1>
          <p className="mt-4 text-lg leading-8 muted">
            Laden Sie Führungskräfte oder Schlüsselpersonen zu einer eigenen
            Einschätzung ein. Sobald weitere Einschätzungen vorliegen, sehen Sie
            hier, wo die Perspektiven übereinstimmen und bei welchen Themen sich
            eine gemeinsame Klärung lohnt.
          </p>
        </header>

        {/* Ohne diesen Hinweis ist der Zugang beim Schließen des Tabs weg. */}
        <div
          className="uc-no-print rounded-2xl border p-5 text-[14px] leading-6"
          style={{
            borderColor: "rgba(0,168,165,0.30)",
            background: "rgba(0,168,165,0.06)",
          }}
        >
          <strong className="font-semibold text-slate-800">
            Diese Seite als Lesezeichen speichern.
          </strong>{" "}
          Der Link in Ihrer Adresszeile ist der einzige Zugang zu diesem
          Vergleich. Wir können ihn nicht wiederherstellen.
        </div>

        {/* Einladungsverwaltung gehört nicht in den ausgedruckten Bericht. */}
        <div className="uc-no-print">
          <ComparisonManager
            manageToken={token}
            label={comparison.label}
            invites={invites}
            origin={origin}
          />
        </div>

        {result.ready ? (
          <>
            <ComparisonReport result={result} />
            <PrintComparisonClosing />
          </>
        ) : (
          <div className="panel">
            <h2 className="text-lg font-bold text-slate-900">
              Die Auswertung erscheint, sobald eine weitere Perspektive vorliegt.
            </h2>
            <p className="mt-2 text-[15px] leading-7 muted">
              Bisher liegt {result.totalParticipants === 1
                ? "nur Ihre eigene Einschätzung"
                : `${result.totalParticipants} Einschätzungen aus einer Rolle`}{" "}
              vor.
              {open > 0
                ? ` ${open === 1 ? "Eine Einladung ist" : `${open} Einladungen sind`} noch offen.`
                : " Legen Sie oben einen Einladungslink an und geben Sie ihn weiter."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

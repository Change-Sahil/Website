// src/app/[locale]/uebergabe-check/teilnehmen/[token]/page.tsx
//
// Einstieg für eine eingeladene Person. Der Token im Link bestimmt Rolle und
// Vergleich; beides wird serverseitig aufgelöst und nie vom Client übernommen.

import type { Metadata } from "next";

import CheckClient from "../../check-client";
import { getInviteByToken } from "@/lib/uebergabe-check/comparison-db";
import type { RespondentRole } from "@/lib/uebergabe-check/comparison";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perspektivvergleich – Ihre Einschätzung",
  robots: { index: false, follow: false, nocache: true },
};

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20">
      <div className="panel">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-4 text-[15px] leading-7 muted">{text}</p>
      </div>
    </main>
  );
}

export default async function TeilnehmenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const context = await getInviteByToken(token);

  if (!context) {
    return (
      <Notice
        title="Dieser Einladungslink ist nicht gültig."
        text="Möglicherweise wurde die Einladung zurückgezogen oder der Link ist unvollständig kopiert worden. Bitte wenden Sie sich an die Person, die Ihnen den Link geschickt hat."
      />
    );
  }

  if (context.invite.used_at) {
    return (
      <Notice
        title="Diese Einladung wurde bereits verwendet."
        text="Über diesen Link wurde schon eine Einschätzung abgegeben. Jeder Link gilt für genau eine Teilnahme, damit die Auswertung nicht doppelt zählt."
      />
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <CheckClient
        invite={{
          token,
          role: context.invite.respondent_role as RespondentRole,
          label: context.label,
        }}
      />
    </main>
  );
}

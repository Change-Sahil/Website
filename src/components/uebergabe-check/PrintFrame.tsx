// src/components/uebergabe-check/PrintFrame.tsx
//
// Deckblatt, Briefkopf und Schlussblatt, ausschließlich im Ausdruck sichtbar.
//
// Im Druck werden Website-Header und -Footer ausgeblendet. Ohne diese Bausteine
// stünde das PDF ohne Absenderkennung da. Der Bericht soll ausgedruckt und im
// Führungskreis herumgereicht werden können.
//
// Der letzte inhaltliche Eindruck soll die Möglichkeit zur gemeinsamen
// Einordnung sein, nicht ein Disclaimer. Der methodische Hinweis steht deshalb
// kompakt am Fuß derselben Seite und nicht auf einer eigenen.

import { DIMENSIONS, LEVEL_META, METHOD_NOTE } from "@/lib/uebergabe-check/content";
import { formatScore, type DimensionScore } from "@/lib/uebergabe-check/scoring";

const CONTACT = {
  name: "Seref Sahil",
  company: "Change-Werkstatt Sahil",
  claim: "Umsetzung wirksam machen, wenn Organisation unter Druck gerät",
  phone: "+49 176 84076507",
  email: "seref.sahil@change-werkstatt-sahil.com",
  website: "change-werkstatt-sahil.de",
  booking:
    "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3",
};

const ACCENT = "rgb(0,168,165)";
const ACCENT_DARK = "rgb(0,112,125)";

/* Der methodische Hinweis steht am Fuß der Schlussseite und nirgends sonst.
   Text: METHOD_NOTE aus content.ts. */

function AccentRule({ thick = false }: { thick?: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        height: thick ? "3px" : "2px",
        background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
      }}
    />
  );
}

function ScoreTable({ scores }: { scores: DimensionScore[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {scores.map((entry) => {
          const meta = LEVEL_META[entry.level];
          const content = DIMENSIONS[entry.dimension - 1];
          return (
            <tr key={entry.dimension}>
              <td
                style={{
                  padding: "7px 0",
                  borderBottom: "1px solid #e8eaee",
                  fontSize: "13px",
                  color: "#1f2937",
                }}
              >
                {content.title}
              </td>
              <td
                style={{
                  padding: "7px 0",
                  borderBottom: "1px solid #e8eaee",
                  fontSize: "13px",
                  fontWeight: 700,
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  color: meta.color,
                }}
              >
                {formatScore(entry.score)}
              </td>
              <td
                style={{
                  padding: "7px 0 7px 18px",
                  borderBottom: "1px solid #e8eaee",
                  fontSize: "12px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  color: meta.color,
                }}
              >
                {meta.label}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Deckblatt, erste Seite des Ausdrucks. */
export function PrintCover({
  scores,
  date,
}: {
  scores: DimensionScore[];
  date?: string;
}) {
  return (
    <div className="uc-print-only uc-print-cover">
      <div className="uc-print-cover-inner">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Change-Werkstatt Sahil"
            style={{ height: "44px", width: "auto" }}
          />
        </div>

        <div className="uc-print-cover-title">
          <h1 className="text-[42px] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900">
            Ihr Übergabeprofil
          </h1>
          <div
            className="mt-3 text-[15px] font-semibold"
            style={{ color: ACCENT_DARK }}
          >
            Persönlicher Ergebnis- und Arbeitsbericht
          </div>
          <p className="mt-5 max-w-[36em] text-[14px] leading-7 text-slate-600">
            Wo Ihr Unternehmen bereits gute Voraussetzungen für eine Übergabe
            mitbringt, welche Abhängigkeiten Aufmerksamkeit verdienen und welche
            Fragen Sie vor einer Nachfolge klären sollten.
          </p>
          {date && (
            <p className="mt-5 text-[12px] text-slate-500">Erstellt am {date}</p>
          )}

          <div className="mt-9">
            <AccentRule />
            <div className="mt-4">
              <ScoreTable scores={scores} />
            </div>
          </div>
        </div>

        <div className="text-[11px] leading-5 text-slate-500">
          {CONTACT.name} · {CONTACT.company} · {CONTACT.website}
        </div>
      </div>
    </div>
  );
}

/** Schmaler Briefkopf über dem Inhalt, ab der zweiten Seite. */
export function PrintHeader({ date }: { date?: string }) {
  return (
    <div className="uc-print-only">
      <div className="flex items-end justify-between gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Change-Werkstatt Sahil"
          style={{ height: "30px", width: "auto" }}
        />
        <div className="text-right">
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: ACCENT_DARK }}
          >
            Ihr Übergabeprofil
          </div>
          {date && (
            <div className="mt-0.5 text-[10.5px] text-slate-500">{date}</div>
          )}
        </div>
      </div>
      <div className="mt-2.5">
        <AccentRule />
      </div>
    </div>
  );
}

/** Schlussblatt, letzte Seite des Ausdrucks. */
export function PrintClosing() {
  return (
    <div className="uc-print-only uc-print-closing">
      <div className="uc-print-cover-inner">
        <div>
          <AccentRule thick />
        </div>

        <div>
          <h2 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-slate-900">
            Was bedeutet das für Ihre konkrete Nachfolge?
          </h2>

          <p className="mt-5 max-w-[38em] text-[14px] leading-7 text-slate-600">
            Ihr Profil zeigt, wo Ihr Unternehmen bereits gute Voraussetzungen
            für eine Übergabe mitbringt und welche Themen genauer betrachtet
            werden sollten.
          </p>

          {/* Zwei Wege statt einem: externes Sparring oder interne Vertiefung.
              Wer noch nicht sprechen möchte, bleibt über den Perspektivvergleich
              trotzdem in Bewegung. */}
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div
              className="rounded-[6px] px-5 py-4"
              style={{
                background: "rgba(0,168,165,0.08)",
                border: `1px solid ${ACCENT}`,
              }}
            >
              <div className="text-[13px] font-semibold leading-6 text-slate-800">
                Sie möchten Ihre Ergebnisse einordnen?
              </div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">
                Im persönlichen Gespräch betrachten wir, welche Themen für Ihre
                konkrete Nachfolgesituation tatsächlich relevant sind.
              </p>
              <div
                className="mt-3 text-[14px] font-bold"
                style={{ color: ACCENT_DARK }}
              >
                Ergebnis gemeinsam einordnen
              </div>
              <div className="mt-1 break-all text-[10px] leading-4 text-slate-500">
                {CONTACT.booking}
              </div>
            </div>

            <div className="rounded-[6px] border border-slate-300 px-5 py-4">
              <div className="text-[13px] font-semibold leading-6 text-slate-800">
                Oder möchten Sie zunächst wissen, wie andere Ihr Unternehmen
                einschätzen?
              </div>
              <p className="mt-1 text-[12px] leading-5 text-slate-600">
                Laden Sie Führungskräfte oder Schlüsselpersonen zum Schnellcheck
                ein und vergleichen Sie anschließend die Perspektiven.
              </p>
              <div
                className="mt-3 text-[14px] font-bold"
                style={{ color: ACCENT_DARK }}
              >
                Perspektivvergleich starten
              </div>
              <div className="mt-1 text-[10px] leading-4 text-slate-500">
                Über den Link zu Ihrem Ergebnis
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 text-[13px] leading-6">
            <div>
              <div className="text-[15px] font-bold text-slate-900">
                {CONTACT.name}
              </div>
              <div className="text-slate-600">{CONTACT.company}</div>
              <div className="mt-1" style={{ color: ACCENT_DARK }}>
                {CONTACT.claim}
              </div>
            </div>
            <div className="text-slate-600">
              <div>{CONTACT.phone}</div>
              <div>{CONTACT.email}</div>
              <div>{CONTACT.website}</div>
            </div>
          </div>
        </div>

        {/* Kompakt und am Fuß derselben Seite, nicht als eigener Abschnitt. */}
        <p className="uc-avoid-break text-[10.5px] leading-5 text-slate-500">
          <strong className="font-semibold text-slate-600">Hinweis:</strong>{" "}
          {METHOD_NOTE}
        </p>
      </div>
    </div>
  );
}

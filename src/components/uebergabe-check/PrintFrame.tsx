// src/components/uebergabe-check/PrintFrame.tsx
//
// Deckblatt, Briefkopf und Schlussblatt, die ausschließlich im Ausdruck
// erscheinen.
//
// Im Druck werden Website-Header und -Footer ausgeblendet. Ohne diese Bausteine
// stünde das PDF ohne Absenderkennung da. Der Bericht soll ausgedruckt und im
// Führungskreis herumgereicht werden können, ohne dass jemand fragen muss,
// woher er stammt.

import { DIMENSIONS, LEVEL_META } from "@/lib/uebergabe-check/content";
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

/**
 * Deckblatt, erste Seite des Ausdrucks.
 *
 * Enthält bewusst schon die sechs Werte: Wer das PDF weiterreicht, soll auf der
 * ersten Seite erkennen, worum es geht, ohne blättern zu müssen.
 */
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
          <div
            className="text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: ACCENT_DARK }}
          >
            Schnellcheck Übergabefähigkeit
          </div>
          <h1 className="mt-3 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-slate-900">
            Ihr Übergabeprofil
          </h1>
          <p className="mt-4 max-w-[34em] text-[14px] leading-7 text-slate-600">
            Ergebnis- und Arbeitsbericht zur organisationalen Übergabefähigkeit.
            Sechs Dimensionen, jeweils auf einer Skala von 0 bis 100, mit
            Einordnung, Prüfimpulsen und Fragen für die interne Diskussion.
          </p>
          {date && (
            <p className="mt-5 text-[12px] text-slate-500">Erstellt am {date}</p>
          )}

          <div className="mt-9">
            <AccentRule />
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              className="mt-4"
            >
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
                        <span style={{ color: "#9aa3af", fontWeight: 400 }}>
                          /100
                        </span>
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
          <div
            className="text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: ACCENT_DARK }}
          >
            Nächster Schritt
          </div>
          <h2 className="mt-3 text-[26px] font-bold leading-tight tracking-[-0.02em] text-slate-900">
            Was bedeutet das für Ihre konkrete Nachfolge?
          </h2>
          <p className="mt-4 max-w-[36em] text-[14px] leading-7 text-slate-600">
            Der Schnellcheck zeigt, wo sich eine genauere Betrachtung lohnt.
            Welche Punkte für Ihre konkrete Übergabesituation tatsächlich
            relevant sind, hängt unter anderem von Nachfolgeform, Zeithorizont
            und der zukünftigen Rolle des heutigen Inhabers ab. Genau diese
            Einordnung lässt sich im Gespräch klären.
          </p>

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
              <div className="mt-3 text-[11px] leading-5 text-slate-500">
                Termin vereinbaren:
                <br />
                <span className="break-all">{CONTACT.booking}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] leading-5 text-slate-500">
          Der Schnellcheck dient einer strukturierten Erstindikation der
          organisationalen Übergabefähigkeit. Er zeigt Ansatzpunkte für eine
          vertiefte Betrachtung, ersetzt aber keine individuelle Analyse der
          konkreten Nachfolgesituation oder eine persönliche Nachfolgeberatung.
          Die Auswertung leitet aus den gegebenen Antworten Hinweise ab; nicht
          jede Interpretation muss die individuelle Situation vollständig
          treffen.
        </p>
      </div>
    </div>
  );
}

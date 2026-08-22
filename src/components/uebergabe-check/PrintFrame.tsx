// src/components/uebergabe-check/PrintFrame.tsx
//
// Kopf und Fuß, die ausschließlich im Ausdruck erscheinen.
//
// Im Druck werden Website-Header und -Footer ausgeblendet, sonst stünde das
// PDF ohne Absenderkennung da. Der Nutzer soll den Bericht ausdrucken und im
// Führungskreis herumreichen können, ohne dass jemand fragen muss, woher er
// kommt.

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

export function PrintHeader({ date }: { date?: string }) {
  return (
    <div className="uc-print-only">
      <div className="flex items-end justify-between gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Change-Werkstatt Sahil"
          style={{ height: "34px", width: "auto" }}
        />
        <div className="text-right">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: ACCENT_DARK }}
          >
            Schnellcheck Übergabefähigkeit
          </div>
          {date && (
            <div className="mt-0.5 text-[11px] text-slate-500">
              Ergebnis vom {date}
            </div>
          )}
        </div>
      </div>
      <div
        className="mt-3"
        style={{
          height: "2px",
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
        }}
      />
    </div>
  );
}

export function PrintFooter() {
  return (
    <div className="uc-print-only uc-print-footer">
      <div
        style={{
          height: "2px",
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
        }}
      />

      <h2 className="mt-5 text-[17px] font-bold text-slate-900">
        Was bedeutet das für Ihre konkrete Nachfolge?
      </h2>
      <p className="mt-2 max-w-[52em] text-[13px] leading-6 text-slate-600">
        Der Schnellcheck zeigt, wo sich eine genauere Betrachtung lohnt. Welche
        Punkte für Ihre konkrete Übergabesituation tatsächlich relevant sind,
        hängt unter anderem von Nachfolgeform, Zeithorizont und der zukünftigen
        Rolle des heutigen Inhabers ab. Wenn Sie Ihr Ergebnis gemeinsam
        einordnen möchten, vereinbaren Sie gern einen Termin.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-6 text-[12px] leading-6">
        <div>
          <div className="font-semibold text-slate-900">{CONTACT.name}</div>
          <div className="text-slate-600">{CONTACT.company}</div>
          <div style={{ color: ACCENT_DARK }}>{CONTACT.claim}</div>
        </div>
        <div className="text-slate-600">
          <div>{CONTACT.phone}</div>
          <div>{CONTACT.email}</div>
          <div>{CONTACT.website}</div>
          <div className="mt-1 break-all text-[11px] text-slate-500">
            Termin: {CONTACT.booking}
          </div>
        </div>
      </div>

      <p className="mt-5 text-[10.5px] leading-5 text-slate-500">
        Der Schnellcheck dient einer strukturierten Erstindikation der
        organisationalen Übergabefähigkeit. Er zeigt Ansatzpunkte für eine
        vertiefte Betrachtung, ersetzt aber keine individuelle Analyse der
        konkreten Nachfolgesituation oder eine persönliche Nachfolgeberatung.
      </p>
    </div>
  );
}

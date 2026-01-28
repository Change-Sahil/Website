import { NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const company = String(body.company ?? "").trim();
    const details = String(body.details ?? "").trim();

    if (!name || !email || !details) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const to = "info@change-werkstatt-sahil.com";

    // Muss eine Absenderadresse auf deiner Domain sein (muss nicht zwingend als Postfach existieren,
    // aber für Zustellbarkeit ist "info@..." als existierendes Postfach ideal)
    const from = process.env.CONTACT_FROM_EMAIL || "info@change-werkstatt-sahil.com";

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Website-Anfrage: ${name}${company ? ` (${company})` : ""}`,
      text:
        `Name: ${name}\n` +
        `E-Mail: ${email}\n` +
        (company ? `Firma: ${company}\n` : "") +
        `\nNachricht:\n${details}\n`,
    });

    // Optional: zum Debuggen in Vercel Logs sichtbar machen
    console.log("RESEND_RESULT", result);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("CONTACT_API_ERROR", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

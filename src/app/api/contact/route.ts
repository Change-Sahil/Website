import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const to = "seref.sahil@change-werkstatt-sahil.de";
    const from = process.env.CONTACT_FROM_EMAIL; // muss bei Resend verifiziert sein

    if (!process.env.RESEND_API_KEY || !from) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    await resend.emails.send({
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

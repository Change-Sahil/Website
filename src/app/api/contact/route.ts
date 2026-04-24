import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

// ── Rate Limiting ────────────────────────────────────────────────────────────
// Einfaches In-Memory-Limit: max. 5 Anfragen pro IP pro 60 Sekunden
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const limit = 5;
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// ── Validierung ──────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(1, "Name fehlt").max(200),
  email: z.email("Ungültige E-Mail-Adresse").max(320),
  company: z.string().max(200).optional().default(""),
  details: z.string().min(1, "Nachricht fehlt").max(5000),
});

// ── Resend ───────────────────────────────────────────────────────────────────
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(req: Request) {
  // Rate Limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen – bitte versuche es in einer Minute erneut." },
      { status: 429 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = contactSchema.safeParse({
      name: String(raw.name ?? "").trim(),
      email: String(raw.email ?? "").trim(),
      company: String(raw.company ?? "").trim(),
      details: String(raw.details ?? "").trim(),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
        { status: 400 }
      );
    }

    const { name, email, company, details } = parsed.data;

    const to = process.env.CONTACT_TO_EMAIL || "info@change-werkstatt-sahil.com";
    const from = process.env.CONTACT_FROM_EMAIL || "info@change-werkstatt-sahil.com";

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ ok: false, error: "Konfigurationsfehler" }, { status: 500 });
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

    console.log("RESEND_RESULT", result);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("CONTACT_API_ERROR", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

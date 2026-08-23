// src/app/[locale]/contact/contact-client.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { bookingUrl as getBookingUrl } from "@/lib/booking";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const f = useTranslations("contact.form");
  const d = useTranslations("contact.direct");

  const steps = (t.raw("steps") as string[]) ?? [];

  const [sending, setSending]   = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus("idle");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd   = new FormData(form);
    const payload = {
      name:    String(fd.get("name")    ?? ""),
      email:   String(fd.get("email")   ?? ""),
      company: String(fd.get("company") ?? ""),
      details: String(fd.get("details") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data?.error || f("errorSend"));
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(f("errorNetwork"));
    } finally {
      setSending(false);
    }
  }

  const email    = String(d("email"));
  const phoneRaw = String(d("phone"));
  const phoneHref = phoneRaw.replace(/[^\d+]/g, "");

  // Zentral in @/lib/booking, damit die Links auf allen Seiten identisch
  // bleiben. Im Übergabe-Check war unbemerkt eine gekürzte, ungültige Fassung
  // in Umlauf.
  const bookingUrl = getBookingUrl(locale);

  const inputClass =
    "w-full border border-[rgba(14,20,32,.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-150 " +
    "placeholder:text-slate-400 " +
    "focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgba(0,168,165,.10)] " +
    "hover:border-[rgba(14,20,32,.22)]";

  return (
    <div>

      {/* ── HERO — dunkle Text-Fläche ── */}
      <section
        className="hero-bleed flex flex-col justify-end"
        style={{
          marginTop: "-6rem",
          minHeight: "calc(48vh + 6rem)",
          background: "rgb(10,15,26)",
        }}
      >
        <div className="page-wrap pb-14 pt-28 md:pt-32 md:pb-16">
          <div className="max-w-2xl">
            <h1
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 850,
                lineHeight: 1.08,
                letterSpacing: "-0.036em",
                color: "rgba(255,255,255,.95)",
              }}
            >
              {t("title")}
            </h1>
            <p
              className="mt-5 text-lg leading-[1.75] whitespace-pre-line"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              {t("intro")}
            </p>
          </div>
        </div>
      </section>


      {/* ── FORMULAR + TERMIN + DIREKTKONTAKT ── */}
      <Reveal>
      <section className="py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">

          {/* Links: Termin + Direktkontakt */}
          <div className="lg:col-span-5 space-y-12">

            {/* Termin buchen */}
            <div
              className="p-7"
              style={{
                border: "1px solid rgba(0,168,165,.22)",
                background: "rgba(0,168,165,.03)",
              }}
            >
              <h2 className="text-[1rem] font-[720] leading-[1.3] tracking-[-0.01em]"
                  style={{ color: "rgba(var(--ink), .90)" }}>
                {t("tabSchedule")}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.78]"
                 style={{ color: "rgba(var(--ink), .70)" }}>
                {t("scheduleHint")}
              </p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full text-center inline-flex items-center justify-center font-semibold px-5 py-3 text-sm"
                style={{
                  borderRadius: "5px",
                  background: "linear-gradient(135deg, rgb(0,168,165), rgb(0,112,125))",
                  color: "rgba(255,255,255,.96)",
                  boxShadow: "0 8px 22px rgba(0,168,165,.22)",
                }}
              >
                {t("scheduleButton")}
              </a>
              <p className="mt-3 text-[11px] text-center"
                 style={{ color: "rgba(var(--ink), .40)" }}>
                {t("scheduleNote")}
              </p>
            </div>

            {/* Direktkontakt */}
            <div>
              <h2 className="text-[1rem] font-[720] leading-[1.3] tracking-[-0.01em] mb-5"
                  style={{ color: "rgba(var(--ink), .90)" }}>
                {d("title")}
              </h2>
              <div className="space-y-2">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center px-4 py-3 text-sm font-[560] transition-colors duration-150 hover:border-[rgba(14,20,32,.18)]"
                  style={{
                    border: "1px solid rgba(14,20,32,.09)",
                    background: "rgba(255,255,255,.80)",
                    color: "rgba(var(--ink), .85)",
                    wordBreak: "break-word",
                  }}
                >
                  {email}
                </a>
                <a
                  href={`tel:${phoneHref}`}
                  className="flex items-center px-4 py-3 text-sm font-[560] transition-colors duration-150 hover:border-[rgba(14,20,32,.18)]"
                  style={{
                    border: "1px solid rgba(14,20,32,.09)",
                    background: "rgba(255,255,255,.80)",
                    color: "rgba(var(--ink), .85)",
                  }}
                >
                  {phoneRaw}
                </a>
              </div>
            </div>
          </div>

          {/* Rechts: Formular */}
          <div className="lg:col-span-7">
            <div className="panel">
              <h2 className="text-[1rem] font-[720] leading-[1.3] tracking-[-0.01em]"
                  style={{ color: "rgba(var(--ink), .90)" }}>
                {t("formEyebrow")}
              </h2>
              <p className="mt-2 text-[15px] leading-[1.78]"
                 style={{ color: "rgba(var(--ink), .68)" }}>
                {t("formIntro")}
              </p>

              <div className="mt-6 hr-soft" />

              <form onSubmit={onSubmit} className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-[620] text-slate-900">{f("name")}</label>
                    <input name="name" required autoComplete="name"
                           placeholder={f("namePlaceholder")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-[620] text-slate-900">{f("email")}</label>
                    <input name="email" type="email" required autoComplete="email"
                           placeholder={f("emailPlaceholder")} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-[620] text-slate-900">{f("company")}</label>
                  <input name="company" autoComplete="organization"
                         placeholder={f("companyPlaceholder")} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-[620] text-slate-900">{f("details")}</label>
                  <textarea
                    name="details"
                    required
                    placeholder={f("detailsPlaceholder")}
                    className={`min-h-[120px] resize-y ${inputClass}`}
                  />
                </div>

                <label
                  className="flex items-start gap-3 p-4 text-sm transition-colors duration-150 cursor-pointer"
                  style={{ border: "1px solid rgba(14,20,32,.09)", background: "rgba(255,255,255,.70)" }}
                >
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 border-slate-300 text-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgba(0,168,165,.12)]"
                  />
                  <span style={{ color: "rgba(var(--ink), .70)" }}>
                    {f.rich("consent", {
                      privacy: (chunks) => (
                        <Link href={`/${locale}/datenschutz`}
                              className="underline underline-offset-2 hover:text-slate-900">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                </label>

                {status === "success" && (
                  <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {f("success")}
                  </p>
                )}
                {status === "error" && (
                  <p className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center font-semibold px-5 py-3 text-sm transition-all duration-150 disabled:opacity-60"
                  style={{
                    borderRadius: "5px",
                    background: "rgb(10,15,26)",
                    color: "rgba(255,255,255,.92)",
                    boxShadow: "0 4px 14px rgba(10,15,26,.18)",
                  }}
                  disabled={sending}
                >
                  {sending ? f("sending") : f("submit")}
                </button>

                <p className="text-[12px]" style={{ color: "rgba(var(--ink), .45)" }}>
                  {t("responseHint")}
                </p>
              </form>
            </div>
          </div>

        </div>
      </section>
      </Reveal>


      {/* ── SO BEGINNT DIE ZUSAMMENARBEIT — warmgrau ── */}
      {steps.length > 0 && (
        <Reveal>
          <section className="hero-bleed py-14 md:py-16" style={{ background: "rgb(237,236,231)" }}>
            <div className="page-wrap">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="text-[1.6rem] font-[760] tracking-[-0.02em] leading-[1.2]">
                    {t("stepsTitle")}
                  </h2>
                </div>
                <ol className="lg:col-span-8 grid gap-6 sm:grid-cols-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="shrink-0 text-[11px] font-[700] tracking-[0.08em] mt-[3px] tabular-nums"
                        style={{ color: "rgb(var(--accent))" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14.5px] leading-[1.68] text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </Reveal>
      )}

    </div>
  );
}

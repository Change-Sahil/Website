// src/app/[locale]/contact/contact-client.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const f = useTranslations("contact.form");
  const d = useTranslations("contact.direct");

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-150 " +
    "placeholder:text-slate-400 " +
    "focus:border-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgba(0,168,165,.12)] " +
    "hover:border-slate-300";

  return (
    <div className="page-stack">
      <Reveal>
        <section className="panel shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">

            {/* LINKS */}
            <div>
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("eyebrow")}</span>
              </div>
              <h1 className="mt-6 title">{t("title")}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 muted md:text-lg">{t("intro")}</p>

              <div className="mt-10">
                <div className="panel">
                  <div className="section-eyebrow">
                    <span className="dot" />
                    <span>{d("title")}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7" style={{ color: "rgba(var(--ink), .74)" }}>
                    {d("text")}
                  </p>
                  <div className="mt-6 grid gap-3">
                    <a
                      href={`mailto:${email}`}
                      className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-50 hover:border-slate-300"
                      style={{ wordBreak: "break-word" }}
                    >
                      {email}
                    </a>
                    <a
                      href={`tel:${phoneHref}`}
                      className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-slate-50 hover:border-slate-300"
                    >
                      {phoneRaw}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RECHTS – Formular */}
            <div className="panel h-fit shadow-[0_24px_70px_rgba(2,6,23,0.12)]">
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{t("formEyebrow")}</span>
              </div>
              <p className="mt-3 text-sm leading-7" style={{ color: "rgba(var(--ink), .74)" }}>
                {t("formIntro")}
              </p>

              <div className="mt-6 hr-soft" />

              <form onSubmit={onSubmit} className="mt-6 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">{f("name")}</label>
                    <input name="name" required autoComplete="name" placeholder={f("namePlaceholder")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-900">{f("email")}</label>
                    <input name="email" type="email" required autoComplete="email" placeholder={f("emailPlaceholder")} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">{f("company")}</label>
                  <input name="company" autoComplete="organization" placeholder={f("companyPlaceholder")} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-900">{f("details")}</label>
                  <textarea
                    name="details"
                    required
                    placeholder={f("detailsPlaceholder")}
                    className={`min-h-[180px] resize-y ${inputClass}`}
                  />
                </div>

                <label className="mt-1 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm transition-colors duration-150 hover:bg-white/90 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[rgb(var(--accent))] focus:ring-4 focus:ring-[rgba(0,168,165,.14)]"
                  />
                  <span style={{ color: "rgba(var(--ink), .74)" }}>
                    {f.rich("consent", {
                      privacy: (chunks) => (
                        <Link href={`/${locale}/datenschutz`} className="underline underline-offset-2 hover:text-slate-900">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                </label>

                {status === "success" && (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {f("success")}
                  </p>
                )}
                {status === "error" && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {errorMsg}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full" disabled={sending}>
                  {sending ? f("sending") : f("submit")}
                </button>

                <p className="text-xs" style={{ color: "rgba(var(--ink), .55)" }}>{t("responseHint")}</p>
              </form>
            </div>

          </div>
        </section>
      </Reveal>
    </div>
  );
}

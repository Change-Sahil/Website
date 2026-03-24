"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="section-eyebrow">
        <span className="dot" />
        <span>Fehler</span>
      </div>
      <h1 className="title">Etwas ist schiefgelaufen</h1>
      <p className="muted max-w-md">
        Bitte versuche es erneut oder gehe zurück zur Startseite.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn-primary">
          Erneut versuchen
        </button>
        <Link href={`/${locale}`} className="btn-secondary">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}

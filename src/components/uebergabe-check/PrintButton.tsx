// src/components/uebergabe-check/PrintButton.tsx
//
// Löst den Druckdialog aus. Eigene Datei, damit die umgebenden Berichtsseiten
// Server-Komponenten bleiben können.
//
// Bewusst keine erneute Abfrage von Kontaktdaten: Wer bis hierher gekommen
// ist, hat den Vorgang selbst angelegt und seine Adresse bereits hinterlassen.
// Ein zweites Formular vor dem eigenen Ergebnis wäre konstruiert.

"use client";

export default function PrintButton({
  label,
  variant = "light",
}: {
  label: string;
  /** "light" auf hellem Grund, "dark" innerhalb eines dunklen Blocks. */
  variant?: "light" | "dark";
}) {
  const className =
    variant === "dark"
      ? "inline-flex items-center justify-center rounded-[5px] border border-white/25 px-5 py-3 font-semibold text-white transition-colors duration-150 hover:bg-white/10"
      : "inline-flex items-center justify-center rounded-[5px] border border-slate-300 px-5 py-3 font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`uc-no-print ${className}`}
    >
      {label}
    </button>
  );
}

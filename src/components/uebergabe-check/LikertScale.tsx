// src/components/uebergabe-check/LikertScale.tsx
"use client";

import { LIKERT_SCALE, type LikertValue } from "@/lib/uebergabe-check/items";

type Props = {
  /** Eindeutiger Name der Radiogruppe, i. d. R. die Item-ID. */
  name: string;
  value: LikertValue | undefined;
  onChange: (value: LikertValue) => void;
  /** ID des Fragetextes, wird der Gruppe als Beschriftung zugeordnet. */
  labelledBy: string;
};

export default function LikertScale({ name, value, onChange, labelledBy }: Props) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="grid grid-cols-1 gap-2 sm:grid-cols-5"
    >
      {LIKERT_SCALE.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={[
              "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all duration-150",
              "sm:min-h-[52px] sm:items-center sm:justify-center sm:px-2 sm:text-center",
              selected
                ? "border-transparent text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            ].join(" ")}
            style={
              selected
                ? {
                    background:
                      "linear-gradient(135deg, rgb(0,168,165), rgb(0,112,125))",
                    boxShadow: "0 6px 18px rgba(0,168,165,0.22)",
                  }
                : undefined
            }
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value as LikertValue)}
              className="sr-only"
            />
            {/* Bewusst ohne sichtbare Ziffer: die Zahlen verleiten dazu, in
                „Punkten“ statt in Zustimmung zu denken. Gewählt wird über die
                Beschriftung, die Skala ergibt sich aus der Reihenfolge. */}
            <span
              aria-hidden
              className={[
                "h-4 w-4 shrink-0 rounded-full border-2 transition-colors duration-150 sm:hidden",
                selected ? "border-white bg-white/30" : "border-slate-300",
              ].join(" ")}
            />
            <span className="leading-snug sm:text-[12.5px]">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

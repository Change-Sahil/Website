// src/components/uebergabe-check/WriteLines.tsx
//
// Beschreibbare Linien für die Arbeitsseiten, die auch im Ausdruck stehen
// bleiben. Von Einzelbericht und Perspektivvergleich gemeinsam genutzt.
//
// Die Abstände kommen im Druck aus .uc-worksheet in globals.css und sind dort
// in Millimetern bemessen: Hier wird mit der Hand geschrieben.

export default function WriteLines({
  count,
  numbered = false,
}: {
  count: number;
  numbered?: boolean;
}) {
  return (
    <div className="mt-4 space-y-7">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-end gap-3">
          {numbered && (
            <span
              aria-hidden
              className="shrink-0 text-[13px] font-semibold text-slate-400"
            >
              {index + 1}.
            </span>
          )}
          <span
            aria-hidden
            className="block h-px w-full"
            style={{ background: "rgba(15,23,42,0.16)" }}
          />
        </div>
      ))}
    </div>
  );
}

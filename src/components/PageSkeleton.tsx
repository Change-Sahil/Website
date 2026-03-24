/**
 * Generischer Seitenlade-Skeleton.
 * Wird als Suspense-Fallback auf allen Seiten genutzt.
 * Entspricht grob der typischen Zwei-Spalten-Hero-Struktur.
 */
export function PageSkeleton() {
  return (
    <div className="page-wrap pt-10 pb-16 md:pt-14" aria-hidden="true">
      {/* Eyebrow */}
      <div className="skeleton h-3 w-28 rounded-full" />

      {/* Hero-Grid */}
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
        {/* Text-Seite */}
        <div className="lg:col-span-6 space-y-4">
          <div className="skeleton h-10 w-3/4 rounded-xl" />
          <div className="skeleton h-10 w-1/2 rounded-xl" />
          <div className="mt-6 space-y-2">
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-5/6 rounded-md" />
            <div className="skeleton h-4 w-4/6 rounded-md" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="skeleton h-11 w-36 rounded-full" />
            <div className="skeleton h-11 w-28 rounded-full" />
          </div>
        </div>

        {/* Bild-Seite */}
        <div className="lg:col-span-6">
          <div className="skeleton h-[360px] w-full rounded-2xl md:h-[420px]" />
        </div>
      </div>

      {/* Content-Blöcke */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>

      <div className="mt-8">
        <div className="skeleton h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}

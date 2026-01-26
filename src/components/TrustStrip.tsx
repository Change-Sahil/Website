"use client";

export default function TrustStrip({
  items
}: {
  items: { title: string; text: string }[];
}) {
  const safe = Array.isArray(items) ? items.slice(0, 3) : [];

  if (!safe.length) return null;

  return (
    <section className="panel-elev p-8 md:p-10">
      <div className="grid gap-4 md:grid-cols-3">
        {safe.map((x, i) => (
          <div key={i} className="panel-solid p-6 hover-lift hover-3d">
            <div className="kicker">
              <span className="kicker-dot" />
              <span>{x.title}</span>
            </div>
            <div className="mt-4 text-sm text-black/70 leading-6">{x.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

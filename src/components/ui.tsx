import LocalizedLink from "./LocalizedLink";
import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5">{children}</div>;
}

export function PageHeader({
  kicker,
  title,
  lead,
  actions,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white" />
      <div className="relative px-7 py-10 md:px-10 md:py-12">
        {kicker ? (
          <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium text-zinc-700">
            {kicker}
          </div>
        ) : null}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {lead ? <p className="mt-3 max-w-3xl text-zinc-700">{lead}</p> : null}
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      {title ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle ? <p className="mt-1 text-zinc-700">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Card({
  title,
  children,
  footer,
}: {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
      <div className={title ? "mt-3" : ""}>{children}</div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : "border bg-white text-zinc-900 hover:bg-zinc-50";
  return (
  <LocalizedLink className={`${base} ${styles}`} href={href}>
    {children}
  </LocalizedLink>
);

}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-zinc-700">
      {items.map((x, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

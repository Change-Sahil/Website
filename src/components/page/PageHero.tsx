import Link from "next/link";

type PageHeroProps = {
  title: string;
  intro?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export default function PageHero({
  title,
  intro,
  primaryCta,
  secondaryCta
}: PageHeroProps) {
  return (
    <section className="page-wrap py-14 md:py-20">
      <div className="max-w-3xl">
        <h1 className="title">{title}</h1>

        {intro && (
          <p className="mt-5 text-lg leading-8 muted">
            {intro}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryCta && (
              <Link href={primaryCta.href} className="btn-primary">
                {primaryCta.label}
              </Link>
            )}

            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn-secondary">
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

import { ReactNode } from "react";

type SectionProps = {
  eyebrow?: string;
  title: string;
  children: ReactNode;
};

export default function Section({
  eyebrow,
  title,
  children
}: SectionProps) {
  return (
    <section className="page-wrap section-pad">
      <div className="page-stack">
        <div className="section-head">
          <div>
            {eyebrow && (
              <div className="section-eyebrow">
                <span className="dot" />
                <span>{eyebrow}</span>
              </div>
            )}
            <h2 className="section-title mt-3">
              {title}
            </h2>
          </div>
        </div>

        <div>
          {children}
        </div>
      </div>
    </section>
  );
}

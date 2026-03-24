// Typen für t.raw()-Aufrufe in Client-Komponenten

export interface HomeHero {
  kicker: string;
  title: string;
  intro: string;
}

export interface HomePillarItem {
  title: string;
  text: string;
  meta?: string;
}

export interface HomePillars {
  subtitle: string;
  title: string;
  items: HomePillarItem[];
}

export interface HomeAudience {
  subtitle: string;
  title: string;
  boxTitles: [string, string];
  targets: string[];
  triggers: string[];
}

export type ServiceKey = "workshops" | "partnership" | "sparring";

export interface ServiceLabels {
  detailsTitle: string;
  whenTitle: string;
  topicsTitle: string;
  deliverablesTitle: string;
}

export interface ServiceCta {
  kicker: string;
  text: string;
}

export interface ServiceUi {
  kicker: string;
  navTitle: string;
  cardTitles: Record<ServiceKey, string>;
  teaser: Record<string, string>;
  when: Record<string, string>;
  tags: Record<string, string[]>;
  duration: Record<string, string>;
  deliverables: Record<string, string[]>;
  topics: Record<string, string[]>;
  labels: ServiceLabels;
  cta: ServiceCta;
}

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

export interface ServiceFormat {
  trigger: string;
  name: string;
  description: string;
  when: string[];
  notWhen: string[];
}

export interface ServiceCta {
  kicker: string;
  text: string;
}

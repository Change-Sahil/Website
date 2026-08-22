// src/lib/rate-limit.ts
//
// Einfaches In-Memory-Rate-Limit pro IP. Bewusst simpel gehalten: bei einem
// Tool mit wenigen Aufrufen pro Tag genügt das, um automatisierte Fluten
// abzufangen. Auf serverlosen Instanzen gilt das Limit je Instanz – das ist
// als Missbrauchsbremse ausreichend, nicht als harte Quote gedacht.

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Map<string, Entry>>();

export function rateLimit(
  namespace: string,
  ip: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): boolean {
  let bucket = buckets.get(namespace);
  if (!bucket) {
    bucket = new Map();
    buckets.set(namespace, bucket);
  }

  const now = Date.now();
  const entry = bucket.get(ip);

  if (!entry || now > entry.resetAt) {
    bucket.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

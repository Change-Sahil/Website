// src/lib/booking.ts
//
// Buchungslinks für „Bookings with me“ an EINER Stelle.
//
// Hintergrund: Der Übergabe-Check trug an vier Stellen eine gekürzte Fassung
// der URL ohne Domainanteil und ohne meetingtype. Microsoft antwortet darauf
// mit „Dieser Link ist ungültig“. Die Kontaktseite hatte die vollständige
// Fassung, beide sind unbemerkt auseinandergelaufen.
//
// Eine gültige URL hat die Form
//   .../bookwithme/user/<id>@<domain>/meetingtype/<typ>?anonymous
// Der Teil ab „@“ ist NICHT optional.

export const BOOKING_URLS = {
  de: "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3@change-werkstatt-sahil.com/meetingtype/6IciwIU95kSU87UB6uKcUA2?anonymous",
  en: "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3@change-werkstatt-sahil.com/meetingtype/LTbeWL46bUWoOR-oXljwUA2?anonymous",
  tr: "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3@change-werkstatt-sahil.com/meetingtype/wh5p9216QE6pcRhcpP0fQA2?anonymous",
  es: "https://outlook.office.com/bookwithme/user/6de68b0b8be247aea52fe665683a25e3@change-werkstatt-sahil.com/meetingtype/xp-hh-yFWkSVpnYPdqC0Eg2?anonymous",
} as const;

export function bookingUrl(locale = "de"): string {
  return (BOOKING_URLS as Record<string, string>)[locale] ?? BOOKING_URLS.de;
}

/**
 * Der Übergabe-Check ist ausschließlich deutschsprachig.
 * Für den Ausdruck: die URL steht dort als Text und wird abgetippt oder
 * abfotografiert, deshalb ohne den technischen Query-Parameter.
 */
export const BOOKING_URL_DE = BOOKING_URLS.de;
export const BOOKING_URL_PRINT = BOOKING_URLS.de.replace("?anonymous", "");

// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,

  // WICHTIG: weil du NUR /[locale]/... Routen hast
  localePrefix: "always",
});

export const config = {
  matcher: [
    // Root + alle "echten" Seiten (ohne _next, api, Dateien)
    "/",
    "/(de|en|tr|es)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};

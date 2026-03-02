// src/proxy.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/",
    "/(de|en|tr|es)/:path*",
    "/((?!api|_next|.*\\..*).*)",
  ],
};
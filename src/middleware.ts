// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except: API routes, static files, Next.js internals, images
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)",
  ],
};

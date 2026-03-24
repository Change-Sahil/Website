// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// Inter Variable Font – unterstützt alle Gewichte 100–900,
// inkl. der im CSS genutzten Zwischenwerte (650, 750, 780).
// latin-ext deckt türkische Sonderzeichen (ğ, ı, ş, ü …) ab.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://change-werkstatt-sahil.de";

  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return `https://${raw}`;
  }
  return raw;
}

const BASE_URL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Change-Werkstatt Sahil",
    template: "%s | Change-Werkstatt Sahil",
  },

  description:
    "Transformations- und Umsetzungsbegleitung für Industrie & Mittelstand.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png" },
    ],
  },

  themeColor: "#ffffff",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Change-Werkstatt Sahil",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

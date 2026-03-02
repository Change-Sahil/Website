// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://change-werkstatt-sahil.de";

  // Falls jemand versehentlich "change-werkstatt-sahil.de" ohne Protokoll setzt
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

  description: "Transformations- und Umsetzungsbegleitung für Industrie & Mittelstand.",

  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
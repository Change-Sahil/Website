// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Change-Werkstatt Sahil",
    template: "%s",
  },

  description:
    "Operative Change-Beratung für den produzierenden Mittelstand.",

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
  return children as unknown as React.ReactElement;
}

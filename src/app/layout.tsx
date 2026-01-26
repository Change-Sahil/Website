import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change-Werkstatt Sahil",
  description: "Effizienz und Kultur im Einklang",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

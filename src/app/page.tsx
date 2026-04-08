import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://change-werkstatt-sahil.de";

export const metadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/de`,
  },
};

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

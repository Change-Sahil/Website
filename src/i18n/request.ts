import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const resolved = (locale ?? defaultLocale) as string;
  if (!isLocale(resolved)) notFound();

  const messages = (await import(`../messages/${resolved}.json`)).default;

  return {
    locale: resolved,
    messages
  };
});

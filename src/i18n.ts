import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./i18n/config";

export default getRequestConfig(async (params: { locale?: string }) => {
  const locale = params.locale ?? defaultLocale;

  if (!isLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

"use client";

import Link, { type LinkProps } from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps & {
    href: string;
  };

function isExternal(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  );
}

export default function LocalizedLink({ href, ...props }: Props) {
  const params = useParams();
  const locale = (params?.locale as string) || "de";

  // Already external? do nothing
  if (isExternal(href)) return <a href={href} {...(props as any)} />;

  // Ensure internal paths always start with "/"
  const normalized = href.startsWith("/") ? href : `/${href}`;

  // If href already has a locale prefix, keep it
  const hasLocalePrefix = /^\/(de|en|tr|es)(\/|$)/.test(normalized);
  const finalHref = hasLocalePrefix ? normalized : `/${locale}${normalized}`;

  return <Link href={finalHref} {...props} />;
}

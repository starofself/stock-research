"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import type { ComponentProps } from "react";

export function useLocale(): Locale {
  const path = usePathname() || "/";
  const seg = path.split("/")[1];
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

// Link that keeps the current locale prefix for internal absolute paths.
export default function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  let target = href;
  if (href.startsWith("/")) {
    const already = locales.some((l) => href === `/${l}` || href.startsWith(`/${l}/`));
    if (!already) target = `/${locale}${href === "/" ? "" : href}`;
  }
  return <Link href={target} {...rest} />;
}

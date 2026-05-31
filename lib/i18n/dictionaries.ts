import type { Locale } from "./config";
import ko from "./dictionaries/ko.json";

export type Dictionary = typeof ko;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => Promise.resolve(ko),
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.ko)();
}

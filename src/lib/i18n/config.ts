export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getValidLocale(value?: string | null): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

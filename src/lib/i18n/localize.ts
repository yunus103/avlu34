import { Locale, defaultLocale } from "./config";

/**
 * Represents a field localized at field-level.
 * Example: { tr: "Mağaza", en: "Store" }
 */
export type LocalizedField<T> = {
  tr: T;
  en?: T;
} & Record<string, T | undefined>;

/**
 * Resolves the value of a localized field based on the active locale.
 * Falls back to the default locale (tr) if the target locale value is missing.
 */
export function localize<T>(field: LocalizedField<T> | T | null | undefined, locale: Locale): T | undefined {
  if (field === null || field === undefined) {
    return undefined;
  }

  // If the field is an object and contains the default locale key (tr), treat it as LocalizedField
  if (typeof field === "object" && field !== null && "tr" in field) {
    const localized = field as LocalizedField<T>;
    
    // Attempt to return target locale, fallback to tr
    if (localized[locale] !== undefined && localized[locale] !== null && localized[locale] !== "") {
      return localized[locale];
    }
    return localized[defaultLocale];
  }

  // Fallback: if it's not localized field-level, return it directly
  return field as T;
}

/**
 * Curried version of localize for cleaner inline template code.
 * Example: const t = localizeFor(locale); t(store.title);
 */
export function localizeFor(locale: Locale) {
  return <T>(field: LocalizedField<T> | T | null | undefined): T | undefined => {
    return localize(field, locale);
  };
}

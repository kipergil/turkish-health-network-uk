/**
 * Every language the site can display. English is the "base" language —
 * it's what's stored directly on each item's fields. Any other language is
 * an optional override stored in the `translations` collection; when a
 * translation is missing for a given item/field, the English value is used.
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[] =
  SUPPORTED_LANGUAGES.map((language) => language.code);

export function isSupportedLanguage(value: string): value is LanguageCode {
  return (SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(value);
}

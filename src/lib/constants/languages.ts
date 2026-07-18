/**
 * Supported spoken-language codes across the network.
 * Deliberately a superset of "Turkish" so the platform can grow into
 * multi-community support without a schema change.
 */
export const LANGUAGE_CODES = [
  "en",
  "tr",
  "ar",
  "el",
  "bg",
  "ro",
  "pl",
  "ur",
  "so",
] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  tr: "Turkish",
  ar: "Arabic",
  el: "Greek",
  bg: "Bulgarian",
  ro: "Romanian",
  pl: "Polish",
  ur: "Urdu",
  so: "Somali",
};

export function isLanguageCode(value: string): value is LanguageCode {
  return (LANGUAGE_CODES as readonly string[]).includes(value);
}

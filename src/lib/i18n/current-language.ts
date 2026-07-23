import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type LanguageCode,
} from "@/lib/i18n/languages";

export const LANGUAGE_COOKIE = "site_lang";

/**
 * The visitor's selected display language, from the language-switcher
 * cookie. Falls back to the default language if there's no request to read
 * a cookie from at all — `generateStaticParams` and `sitemap.ts` call the
 * same data-layer functions at build time, outside any HTTP request, where
 * `cookies()` throws rather than returning an empty store.
 */
export async function getCurrentLanguage(): Promise<LanguageCode> {
  try {
    const store = await cookies();
    const value = store.get(LANGUAGE_COOKIE)?.value;
    return value && isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

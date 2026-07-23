"use server";

import { cookies } from "next/headers";
import { LANGUAGE_COOKIE } from "@/lib/i18n/current-language";
import { isSupportedLanguage, type LanguageCode } from "@/lib/i18n/languages";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function setLanguageAction(language: LanguageCode): Promise<void> {
  if (!isSupportedLanguage(language)) return;

  const store = await cookies();
  store.set(LANGUAGE_COOKIE, language, {
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
    sameSite: "lax",
  });
}

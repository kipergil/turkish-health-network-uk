import "server-only";
import { getTranslationMap, translationKey } from "@/lib/data/translations";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/languages";

/**
 * Overlays translated values (from the `translations` collection) onto
 * `fields` of each item, for the visitor's current language. Items are
 * returned unchanged wherever no translation row exists for that
 * item/field/language — i.e. English (the value already on the item) is
 * always the fallback.
 */
export async function applyTranslations<
  T extends { id: string },
  K extends keyof T & string,
>(collection: string, items: T[], fields: readonly K[]): Promise<T[]> {
  const language = await getCurrentLanguage();
  if (language === DEFAULT_LANGUAGE) {
    return items;
  }

  const map = await getTranslationMap();

  return items.map((item) => {
    let changed = false;
    const next = { ...item };
    for (const field of fields) {
      const value = map.get(
        translationKey(collection, item.id, field, language),
      );
      if (value !== undefined) {
        next[field] = value as T[K];
        changed = true;
      }
    }
    return changed ? next : item;
  });
}

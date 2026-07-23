import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import { translationsFileSchema, type Translation } from "@/lib/schemas";

export const getAllTranslations = cache(async (): Promise<Translation[]> => {
  const items = await directus.request(readItems("translations", { limit: -1 }));
  return translationsFileSchema.parse(stripNulls(items));
});

export function translationKey(
  collection: string,
  itemId: string,
  field: string,
  language: string,
): string {
  return `${collection}:${itemId}:${field}:${language}`;
}

/** Lookup of `collection:itemId:field:language` -> translated value. */
export const getTranslationMap = cache(async (): Promise<Map<string, string>> => {
  const translations = await getAllTranslations();
  const map = new Map<string, string>();
  for (const translation of translations) {
    map.set(
      translationKey(
        translation.collection,
        translation.itemId,
        translation.field,
        translation.language,
      ),
      translation.value,
    );
  }
  return map;
});

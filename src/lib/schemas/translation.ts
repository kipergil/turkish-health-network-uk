import { z } from "zod";

/**
 * A single field-level translation override: "for item `itemId` in
 * `collection`, field `field` reads as `value` when the visitor's language
 * is `language`." English itself is never stored here — it's the base
 * value already on the item; this collection only holds the overrides for
 * every other supported language.
 */
export const translationSchema = z.object({
  id: z.string().min(1),
  collection: z.string().min(1),
  itemId: z.string().min(1),
  field: z.string().min(1),
  language: z.string().min(1),
  value: z.string().min(1),
});

export type Translation = z.infer<typeof translationSchema>;

export const translationsFileSchema = z.array(translationSchema);

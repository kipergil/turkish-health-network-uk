import "server-only";
import { createItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import {
  listingSuggestionSchema,
  type ListingSuggestion,
  type ListingSuggestionKind,
} from "@/lib/schemas";

export async function createListingSuggestion(input: {
  kind: ListingSuggestionKind;
  name: string;
  categoryText?: string;
  city?: string;
  phone?: string;
  website?: string;
  notes?: string;
  submittedByUserId: string;
}): Promise<ListingSuggestion> {
  const item = await directus.request(
    createItem("listing_suggestions", {
      kind: input.kind,
      name: input.name,
      categoryText: input.categoryText,
      city: input.city,
      phone: input.phone,
      website: input.website,
      notes: input.notes,
      status: "pending",
      submittedByUserId: input.submittedByUserId,
      createdAt: new Date().toISOString(),
    }),
  );
  return listingSuggestionSchema.parse(item);
}

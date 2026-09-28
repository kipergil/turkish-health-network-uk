import "server-only";
import { createItem, readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import {
  listingSuggestionSchema,
  type ListingSuggestion,
  type ListingSuggestionKind,
  type ListingSuggestionStatus,
} from "@/lib/schemas";

/** Every suggestion awaiting admin review, oldest first. */
export async function getPendingListingSuggestions(): Promise<
  ListingSuggestion[]
> {
  const items = await directus.request(
    readItems("listing_suggestions", {
      filter: { status: { _eq: "pending" } },
      sort: ["createdAt"],
      limit: -1,
    }),
  );
  return listingSuggestionSchema.array().parse(stripNulls(items));
}

/** A signed-in member's own suggestions, any status, newest first. */
export async function getListingSuggestionsBySubmitter(
  userId: string,
): Promise<ListingSuggestion[]> {
  const items = await directus.request(
    readItems("listing_suggestions", {
      filter: { submittedByUserId: { _eq: userId } },
      sort: ["-createdAt"],
      limit: -1,
    }),
  );
  return listingSuggestionSchema.array().parse(stripNulls(items));
}

export async function updateListingSuggestionStatus(
  id: string,
  status: ListingSuggestionStatus,
): Promise<void> {
  await directus.request(updateItem("listing_suggestions", id, { status }));
}

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
  return listingSuggestionSchema.parse(stripNulls(item));
}

import "server-only";
import { createItem, deleteItems, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import {
  favoriteSchema,
  type Favorite,
  type FavoriteSubjectKind,
} from "@/lib/schemas";

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  const items = await directus.request(
    readItems("favorites", {
      filter: { userId: { _eq: userId } },
      limit: -1,
    }),
  );
  return favoriteSchema.array().parse(items);
}

export async function isFavorite(
  userId: string,
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<boolean> {
  const items = await directus.request(
    readItems("favorites", {
      filter: {
        userId: { _eq: userId },
        subjectKind: { _eq: subjectKind },
        subjectId: { _eq: subjectId },
      },
      limit: 1,
      fields: ["id"],
    }),
  );
  return items.length > 0;
}

export async function addFavorite(
  userId: string,
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<void> {
  const alreadySaved = await isFavorite(userId, subjectKind, subjectId);
  if (alreadySaved) return;

  await directus.request(
    createItem("favorites", {
      userId,
      subjectKind,
      subjectId,
      createdAt: new Date().toISOString(),
    }),
  );
}

export async function removeFavorite(
  userId: string,
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<void> {
  const existing = await directus.request(
    readItems("favorites", {
      filter: {
        userId: { _eq: userId },
        subjectKind: { _eq: subjectKind },
        subjectId: { _eq: subjectId },
      },
      fields: ["id"],
      limit: -1,
    }),
  );
  if (existing.length === 0) return;
  await directus.request(
    deleteItems(
      "favorites",
      existing.map((item) => item.id),
    ),
  );
}

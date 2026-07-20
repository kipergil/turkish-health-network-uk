import "server-only";
import { createItem, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import {
  reviewSchema,
  type FavoriteSubjectKind,
  type Review,
} from "@/lib/schemas";

export async function getPublishedReviewsForSubject(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<Review[]> {
  const items = await directus.request(
    readItems("reviews", {
      filter: {
        subjectKind: { _eq: subjectKind },
        subjectId: { _eq: subjectId },
        status: { _eq: "published" },
      },
      sort: ["-createdAt"],
      limit: -1,
    }),
  );
  return reviewSchema.array().parse(stripNulls(items));
}

export async function createReview(input: {
  subjectKind: FavoriteSubjectKind;
  subjectId: string;
  rating: number;
  comment?: string;
  authorUserId: string;
}): Promise<Review> {
  const item = await directus.request(
    createItem("reviews", {
      subjectKind: input.subjectKind,
      subjectId: input.subjectId,
      rating: input.rating,
      comment: input.comment,
      authorUserId: input.authorUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  );
  return reviewSchema.parse(stripNulls(item));
}

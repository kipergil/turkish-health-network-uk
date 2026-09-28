import "server-only";
import { createItem, readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import {
  reviewSchema,
  type FavoriteSubjectKind,
  type Review,
  type ReviewStatus,
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

/** Every review awaiting admin moderation, oldest first. */
export async function getPendingReviews(): Promise<Review[]> {
  const items = await directus.request(
    readItems("reviews", {
      filter: { status: { _eq: "pending" } },
      sort: ["createdAt"],
      limit: -1,
    }),
  );
  return reviewSchema.array().parse(stripNulls(items));
}

/** A signed-in member's own reviews, any status, newest first. */
export async function getReviewsByAuthor(userId: string): Promise<Review[]> {
  const items = await directus.request(
    readItems("reviews", {
      filter: { authorUserId: { _eq: userId } },
      sort: ["-createdAt"],
      limit: -1,
    }),
  );
  return reviewSchema.array().parse(stripNulls(items));
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<void> {
  await directus.request(updateItem("reviews", id, { status }));
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

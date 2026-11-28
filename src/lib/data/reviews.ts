import "server-only";
import { cache } from "react";
import { createItem, readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import {
  reviewSchema,
  type FavoriteSubjectKind,
  type Review,
  type ReviewStatus,
} from "@/lib/schemas";

/**
 * Every published review, request-cached — cards derive a per-subject
 * rating summary from this instead of each issuing its own filtered
 * Directus query (a listing page can render dozens of cards at once).
 */
export const getAllPublishedReviews = cache(async (): Promise<Review[]> => {
  const items = await directus.request(
    readItems("reviews", {
      filter: { status: { _eq: "published" } },
      limit: -1,
    }),
  );
  return reviewSchema.array().parse(stripNulls(items));
});

export async function getPublishedReviewsForSubject(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<Review[]> {
  const reviews = await getAllPublishedReviews();
  return reviews
    .filter(
      (review) =>
        review.subjectKind === subjectKind && review.subjectId === subjectId,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface ReviewSummary {
  average: number;
  count: number;
}

export function summarizeReviews(reviews: readonly Review[]): ReviewSummary | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}

/** Average rating + count across a subject's published reviews, or `null` if it has none. */
export async function getReviewSummary(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
): Promise<ReviewSummary | null> {
  const reviews = await getPublishedReviewsForSubject(subjectKind, subjectId);
  return summarizeReviews(reviews);
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

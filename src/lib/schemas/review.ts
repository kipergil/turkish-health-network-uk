import { z } from "zod";
import { favoriteSubjectKindSchema } from "@/lib/schemas/favorite";

export const reviewStatusSchema = z.enum(["pending", "published", "rejected"]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

/**
 * A signed-in member's review of a provider or organization. Starts
 * `pending` so an admin can moderate health-sector reviews in the Directus
 * Data Studio before they appear publicly — only `published` reviews are
 * ever read back by the app.
 */
export const reviewSchema = z.object({
  id: z.string().min(1),
  subjectKind: favoriteSubjectKindSchema,
  subjectId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  authorUserId: z.string().min(1),
  status: reviewStatusSchema.default("pending"),
  createdAt: z.string().min(1),
});

export type Review = z.infer<typeof reviewSchema>;

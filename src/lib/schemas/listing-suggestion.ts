import { z } from "zod";

export const listingSuggestionKindSchema = z.enum([
  "provider",
  "organization",
  "turkey_referral",
]);
export type ListingSuggestionKind = z.infer<typeof listingSuggestionKindSchema>;

export const listingSuggestionStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);
export type ListingSuggestionStatus = z.infer<
  typeof listingSuggestionStatusSchema
>;

/**
 * A signed-in member's suggestion for a listing not yet in the directory
 * (a new doctor, clinic, or Turkey referral). Reviewed and turned into a
 * real Provider/Organization/TurkeyReferral record by an admin in the
 * Directus Data Studio — this collection is the intake queue, not the
 * canonical record.
 */
export const listingSuggestionSchema = z.object({
  id: z.string().min(1),
  kind: listingSuggestionKindSchema,
  name: z.string().min(1),
  categoryText: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
  status: listingSuggestionStatusSchema.default("pending"),
  submittedByUserId: z.string().min(1),
  createdAt: z.string().min(1),
});

export type ListingSuggestion = z.infer<typeof listingSuggestionSchema>;

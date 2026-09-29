import { z } from "zod";
import { favoriteSubjectKindSchema } from "@/lib/schemas/favorite";

export const changeRequestActionSchema = z.enum(["update", "remove"]);
export type ChangeRequestAction = z.infer<typeof changeRequestActionSchema>;

export const changeRequestStatusSchema = z.enum([
  "pending",
  "resolved",
  "rejected",
]);
export type ChangeRequestStatus = z.infer<typeof changeRequestStatusSchema>;

/**
 * A visitor's report that a provider/organization record needs updating or
 * removing. Anonymous-friendly by design (no Clerk sign-in required) — the
 * reporter's name/email are free text collected on the form itself, used
 * only to let them know once an admin has acted on the request. Reviewed
 * and actioned by hand in the Directus Data Studio, same as
 * listing_suggestions; this collection is the intake queue, not something
 * that changes the target record on its own.
 */
export const changeRequestSchema = z.object({
  id: z.string().min(1),
  subjectKind: favoriteSubjectKindSchema,
  subjectId: z.string().min(1),
  action: changeRequestActionSchema,
  reason: z.string().min(1),
  reporterName: z.string().optional(),
  reporterEmail: z.email().optional(),
  status: changeRequestStatusSchema.default("pending"),
  createdAt: z.string().min(1),
});

export type ChangeRequest = z.infer<typeof changeRequestSchema>;

import { z } from "zod";

/** What a favorite/review points at — a Provider or an Organization record. */
export const favoriteSubjectKindSchema = z.enum(["provider", "organization"]);
export type FavoriteSubjectKind = z.infer<typeof favoriteSubjectKindSchema>;

/**
 * A signed-in member's saved provider/organization. `userId` is a Clerk
 * user id (foreign key into app_users), not a Directus-generated user.
 */
export const favoriteSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  subjectKind: favoriteSubjectKindSchema,
  subjectId: z.string().min(1),
  createdAt: z.string().min(1),
});

export type Favorite = z.infer<typeof favoriteSchema>;

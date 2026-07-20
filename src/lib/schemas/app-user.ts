import { z } from "zod";

/**
 * A mirror of the Clerk user, kept in Directus so other collections
 * (favorites, reviews, listing suggestions) can hold a normal relational
 * foreign key instead of reaching out to Clerk on every read. Populated by
 * the /api/webhooks/clerk route on user.created/user.updated/user.deleted.
 */
export const appUserSchema = z.object({
  id: z.string().min(1), // Clerk user id (e.g. "user_...") — used directly as the Directus PK
  email: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type AppUser = z.infer<typeof appUserSchema>;

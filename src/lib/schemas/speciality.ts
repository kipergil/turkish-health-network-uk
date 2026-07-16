import { z } from "zod";
import { slugSchema } from "@/lib/schemas/common";
import { PROVIDER_CATEGORIES } from "@/lib/constants/categories";

/**
 * A service/specialism offered by a provider or organization, e.g.
 * "Cardiology", "Root Canal Treatment", "Cognitive Behavioural Therapy".
 * `categories` restricts which provider sections the speciality can be
 * attached to, driving filter dropdowns per section.
 */
export const specialitySchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.enum(PROVIDER_CATEGORIES)).min(1),
});

export type Speciality = z.infer<typeof specialitySchema>;

export const specialitiesFileSchema = z.array(specialitySchema);

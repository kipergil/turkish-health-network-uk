import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { specialitiesFileSchema, type Speciality } from "@/lib/schemas";
import type { ProviderCategory } from "@/lib/constants/categories";

/**
 * Repository for specialities, now backed by Directus. `cache()` dedupes
 * the fetch within a single render pass — cross-request freshness comes
 * from the route-level `revalidate` window (see src/app/layout.tsx), not
 * from holding the array in memory indefinitely the way the old
 * JSON-backed module scope constant did.
 */
export const getAllSpecialities = cache(async (): Promise<Speciality[]> => {
  const items = await directus.request(
    readItems("specialities", { limit: -1 }),
  );
  return specialitiesFileSchema.parse(items);
});

export async function getSpecialitiesByCategory(
  category: ProviderCategory,
): Promise<Speciality[]> {
  const specialities = await getAllSpecialities();
  return specialities.filter((speciality) =>
    speciality.categories.includes(category),
  );
}

export async function getSpecialityBySlug(
  slug: string,
): Promise<Speciality | undefined> {
  const specialities = await getAllSpecialities();
  return specialities.find((speciality) => speciality.slug === slug);
}

export async function getSpecialitiesByIds(
  ids: readonly string[],
): Promise<Speciality[]> {
  const specialities = await getAllSpecialities();
  const idSet = new Set(ids);
  return specialities.filter((speciality) => idSet.has(speciality.id));
}

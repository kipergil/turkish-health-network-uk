import "server-only";
import specialitiesJson from "@data/specialities.json";
import { specialitiesFileSchema, type Speciality } from "@/lib/schemas";
import type { ProviderCategory } from "@/lib/constants/categories";

/**
 * Repository for specialities. Currently reads a static JSON file; once a
 * database is introduced this module is the only place that needs to
 * change (e.g. to `prisma.speciality.findMany()`) — callers throughout the
 * app only ever import from `@/lib/data/*`.
 */
export const allSpecialities: Speciality[] =
  specialitiesFileSchema.parse(specialitiesJson);

export async function getAllSpecialities(): Promise<Speciality[]> {
  return allSpecialities;
}

export async function getSpecialitiesByCategory(
  category: ProviderCategory,
): Promise<Speciality[]> {
  return allSpecialities.filter((speciality) =>
    speciality.categories.includes(category),
  );
}

export async function getSpecialityBySlug(
  slug: string,
): Promise<Speciality | undefined> {
  return allSpecialities.find((speciality) => speciality.slug === slug);
}

export async function getSpecialitiesByIds(
  ids: readonly string[],
): Promise<Speciality[]> {
  const idSet = new Set(ids);
  return allSpecialities.filter((speciality) => idSet.has(speciality.id));
}

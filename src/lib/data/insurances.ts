import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { insurancesFileSchema, type Insurance } from "@/lib/schemas";

export const getAllInsurances = cache(async (): Promise<Insurance[]> => {
  const items = await directus.request(readItems("insurances", { limit: -1 }));
  return insurancesFileSchema.parse(items);
});

export async function getInsuranceBySlug(
  slug: string,
): Promise<Insurance | undefined> {
  const insurances = await getAllInsurances();
  return insurances.find((insurance) => insurance.slug === slug);
}

export async function getInsurancesByIds(
  ids: readonly string[],
): Promise<Insurance[]> {
  const insurances = await getAllInsurances();
  const idSet = new Set(ids);
  return insurances.filter((insurance) => idSet.has(insurance.id));
}

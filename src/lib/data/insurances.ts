import "server-only";
import insurancesJson from "@data/insurances.json";
import { insurancesFileSchema, type Insurance } from "@/lib/schemas";

export const allInsurances: Insurance[] =
  insurancesFileSchema.parse(insurancesJson);

export async function getAllInsurances(): Promise<Insurance[]> {
  return allInsurances;
}

export async function getInsuranceBySlug(
  slug: string,
): Promise<Insurance | undefined> {
  return allInsurances.find((insurance) => insurance.slug === slug);
}

export async function getInsurancesByIds(
  ids: readonly string[],
): Promise<Insurance[]> {
  const idSet = new Set(ids);
  return allInsurances.filter((insurance) => idSet.has(insurance.id));
}

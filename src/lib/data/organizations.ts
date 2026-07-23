import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import { organizationsFileSchema, type Organization } from "@/lib/schemas";
import type { OrganizationType } from "@/lib/constants/categories";
import { sortByDistance, type WithGeo } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";
import { assertReferencesExist } from "@/lib/data/integrity";
import { getAllSpecialities } from "@/lib/data/specialities";
import { getAllInsurances } from "@/lib/data/insurances";
import { applyTranslations } from "@/lib/i18n/apply-translations";

export const getAllOrganizations = cache(async (): Promise<Organization[]> => {
  const [items, specialities, insurances] = await Promise.all([
    directus.request(readItems("organizations", { limit: -1 })),
    getAllSpecialities(),
    getAllInsurances(),
  ]);
  const organizations = organizationsFileSchema.parse(stripNulls(items));

  const specialityIdSet = new Set(
    specialities.map((speciality) => speciality.id),
  );
  const insuranceIdSet = new Set(insurances.map((insurance) => insurance.id));
  for (const organization of organizations) {
    assertReferencesExist(
      `Organization "${organization.slug}"`,
      "speciality",
      organization.specialityIds,
      specialityIdSet,
    );
    assertReferencesExist(
      `Organization "${organization.slug}"`,
      "insurance",
      organization.insuranceIds,
      insuranceIdSet,
    );
  }

  return applyTranslations("organizations", organizations, [
    "name",
    "description",
  ]);
});

export async function getOrganizationsByType(
  type: OrganizationType,
): Promise<Organization[]> {
  const organizations = await getAllOrganizations();
  return organizations.filter((organization) => organization.type === type);
}

export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization | undefined> {
  const organizations = await getAllOrganizations();
  return organizations.find((organization) => organization.slug === slug);
}

export async function getOrganizationsByIds(
  ids: readonly string[],
): Promise<Organization[]> {
  const organizations = await getAllOrganizations();
  const idSet = new Set(ids);
  return organizations.filter((organization) => idSet.has(organization.id));
}

export async function getFeaturedOrganizations(
  limit = 6,
): Promise<Organization[]> {
  const organizations = await getAllOrganizations();
  return organizations
    .filter((organization) => organization.featured)
    .slice(0, limit);
}

export async function getOrganizationsNear(
  origin: GeoPoint,
  limit = 10,
): Promise<Organization[]> {
  const organizations = await getAllOrganizations();
  return sortByDistance(
    organizations as (Organization & WithGeo)[],
    origin,
  ).slice(0, limit);
}

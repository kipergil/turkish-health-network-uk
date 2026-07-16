import "server-only";
import clinicsJson from "@data/clinics.json";
import hospitalsJson from "@data/hospitals.json";
import pharmaciesJson from "@data/pharmacies.json";
import { organizationsFileSchema, type Organization } from "@/lib/schemas";
import type { OrganizationType } from "@/lib/constants/categories";
import { sortByDistance, type WithGeo } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";
import { assertReferencesExist } from "@/lib/data/integrity";
import { allSpecialities } from "@/lib/data/specialities";
import { allInsurances } from "@/lib/data/insurances";

export const allOrganizations: Organization[] = [
  ...organizationsFileSchema.parse(clinicsJson),
  ...organizationsFileSchema.parse(hospitalsJson),
  ...organizationsFileSchema.parse(pharmaciesJson),
];

const specialityIdSet = new Set(
  allSpecialities.map((speciality) => speciality.id),
);
const insuranceIdSet = new Set(allInsurances.map((insurance) => insurance.id));

for (const organization of allOrganizations) {
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

export async function getAllOrganizations(): Promise<Organization[]> {
  return allOrganizations;
}

export async function getOrganizationsByType(
  type: OrganizationType,
): Promise<Organization[]> {
  return allOrganizations.filter((organization) => organization.type === type);
}

export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization | undefined> {
  return allOrganizations.find((organization) => organization.slug === slug);
}

export async function getOrganizationsByIds(
  ids: readonly string[],
): Promise<Organization[]> {
  const idSet = new Set(ids);
  return allOrganizations.filter((organization) => idSet.has(organization.id));
}

export async function getFeaturedOrganizations(
  limit = 6,
): Promise<Organization[]> {
  return allOrganizations
    .filter((organization) => organization.featured)
    .slice(0, limit);
}

export async function getOrganizationsNear(
  origin: GeoPoint,
  limit = 10,
): Promise<Organization[]> {
  return sortByDistance(
    allOrganizations as (Organization & WithGeo)[],
    origin,
  ).slice(0, limit);
}

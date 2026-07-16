import "server-only";
import doctorsJson from "@data/doctors.json";
import dentistsJson from "@data/dentists.json";
import psychologistsJson from "@data/psychologists.json";
import physiotherapistsJson from "@data/physiotherapists.json";
import dietitiansJson from "@data/dietitians.json";
import { providersFileSchema, type Provider } from "@/lib/schemas";
import type { ProviderCategory } from "@/lib/constants/categories";
import {
  getAllOrganizations,
  allOrganizations,
} from "@/lib/data/organizations";
import { distanceInKm } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";
import { assertReferencesExist } from "@/lib/data/integrity";
import { allSpecialities } from "@/lib/data/specialities";
import { allInsurances } from "@/lib/data/insurances";

const allProviders: Provider[] = [
  ...providersFileSchema.parse(doctorsJson),
  ...providersFileSchema.parse(dentistsJson),
  ...providersFileSchema.parse(psychologistsJson),
  ...providersFileSchema.parse(physiotherapistsJson),
  ...providersFileSchema.parse(dietitiansJson),
];

const specialityIdSet = new Set(
  allSpecialities.map((speciality) => speciality.id),
);
const insuranceIdSet = new Set(allInsurances.map((insurance) => insurance.id));
const organizationIdSet = new Set(
  allOrganizations.map((organization) => organization.id),
);

for (const provider of allProviders) {
  assertReferencesExist(
    `Provider "${provider.slug}"`,
    "speciality",
    provider.specialityIds,
    specialityIdSet,
  );
  assertReferencesExist(
    `Provider "${provider.slug}"`,
    "insurance",
    provider.insuranceIds,
    insuranceIdSet,
  );
  assertReferencesExist(
    `Provider "${provider.slug}"`,
    "organization",
    provider.organizationIds,
    organizationIdSet,
  );
}

export async function getAllProviders(): Promise<Provider[]> {
  return allProviders;
}

export async function getProvidersByCategory(
  category: ProviderCategory,
): Promise<Provider[]> {
  return allProviders.filter((provider) => provider.category === category);
}

export async function getProviderBySlug(
  slug: string,
): Promise<Provider | undefined> {
  return allProviders.find((provider) => provider.slug === slug);
}

export async function getProvidersByIds(
  ids: readonly string[],
): Promise<Provider[]> {
  const idSet = new Set(ids);
  return allProviders.filter((provider) => idSet.has(provider.id));
}

export async function getProvidersByOrganization(
  organizationId: string,
): Promise<Provider[]> {
  return allProviders.filter((provider) =>
    provider.organizationIds.includes(organizationId),
  );
}

/** Doctors who see NHS patients, whether NHS-only or NHS-and-private. */
export async function getNhsDoctors(): Promise<Provider[]> {
  return allProviders.filter(
    (provider) =>
      provider.category === "doctor" && provider.nhsStatus !== "private",
  );
}

export async function getFeaturedProviders(limit = 6): Promise<Provider[]> {
  return allProviders.filter((provider) => provider.featured).slice(0, limit);
}

/**
 * Providers don't carry their own coordinates — they practice at one or
 * more organizations, which do. Distance is measured to the nearest
 * organization a provider is affiliated with.
 */
export async function getProvidersNear(
  origin: GeoPoint,
  limit = 10,
): Promise<Provider[]> {
  const organizations = await getAllOrganizations();
  const organizationById = new Map(
    organizations.map((organization) => [organization.id, organization]),
  );

  const withDistance = allProviders
    .map((provider) => {
      const distances = provider.organizationIds
        .map((id) => organizationById.get(id))
        .filter(
          (organization): organization is NonNullable<typeof organization> =>
            organization !== undefined,
        )
        .map((organization) => distanceInKm(organization.geo, origin));

      return {
        provider,
        distance:
          distances.length > 0
            ? Math.min(...distances)
            : Number.POSITIVE_INFINITY,
      };
    })
    .filter((entry) => Number.isFinite(entry.distance))
    .sort((a, b) => a.distance - b.distance);

  return withDistance.slice(0, limit).map((entry) => entry.provider);
}

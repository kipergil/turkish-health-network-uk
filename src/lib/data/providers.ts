import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import { providersFileSchema, type Provider } from "@/lib/schemas";
import type { ProviderCategory } from "@/lib/constants/categories";
import { getAllOrganizations } from "@/lib/data/organizations";
import { distanceInKm } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";
import { assertReferencesExist } from "@/lib/data/integrity";
import { getAllSpecialities } from "@/lib/data/specialities";
import { getAllInsurances } from "@/lib/data/insurances";

export const getAllProviders = cache(async (): Promise<Provider[]> => {
  const [items, specialities, insurances, organizations] = await Promise.all([
    directus.request(readItems("providers", { limit: -1 })),
    getAllSpecialities(),
    getAllInsurances(),
    getAllOrganizations(),
  ]);
  const providers = providersFileSchema.parse(stripNulls(items));

  const specialityIdSet = new Set(
    specialities.map((speciality) => speciality.id),
  );
  const insuranceIdSet = new Set(insurances.map((insurance) => insurance.id));
  const organizationIdSet = new Set(
    organizations.map((organization) => organization.id),
  );

  for (const provider of providers) {
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

  return providers;
});

export async function getProvidersByCategory(
  category: ProviderCategory,
): Promise<Provider[]> {
  const providers = await getAllProviders();
  return providers.filter((provider) => provider.category === category);
}

export async function getProviderBySlug(
  slug: string,
): Promise<Provider | undefined> {
  const providers = await getAllProviders();
  return providers.find((provider) => provider.slug === slug);
}

export async function getProvidersByIds(
  ids: readonly string[],
): Promise<Provider[]> {
  const providers = await getAllProviders();
  const idSet = new Set(ids);
  return providers.filter((provider) => idSet.has(provider.id));
}

export async function getProvidersByOrganization(
  organizationId: string,
): Promise<Provider[]> {
  const providers = await getAllProviders();
  return providers.filter((provider) =>
    provider.organizationIds.includes(organizationId),
  );
}

/** Doctors who see NHS patients, whether NHS-only or NHS-and-private. */
export async function getNhsDoctors(): Promise<Provider[]> {
  const providers = await getAllProviders();
  return providers.filter(
    (provider) =>
      provider.category === "doctor" && provider.nhsStatus !== "private",
  );
}

export async function getFeaturedProviders(limit = 6): Promise<Provider[]> {
  const providers = await getAllProviders();
  return providers.filter((provider) => provider.featured).slice(0, limit);
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
  const [providers, organizations] = await Promise.all([
    getAllProviders(),
    getAllOrganizations(),
  ]);
  const organizationById = new Map(
    organizations.map((organization) => [organization.id, organization]),
  );

  const withDistance = providers
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

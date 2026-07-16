import "server-only";
import { getAllProviders, getAllOrganizations } from "@/lib/data";
import {
  PROVIDER_CATEGORY_LABELS,
  ORGANIZATION_TYPE_LABELS,
  PROVIDER_CATEGORY_ROUTES,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";
import type { LanguageCode } from "@/lib/constants/languages";
import type { NhsStatus } from "@/lib/constants/categories";
import type { GeoPoint } from "@/lib/schemas/common";

/**
 * A flattened, search/map-friendly view over both providers and
 * organizations. This is the shape consumed by the global search index
 * and the interactive map — both need "one list of pins/results",
 * not two entity types with different field names.
 */
export interface DirectoryEntry {
  id: string;
  kind: "provider" | "organization";
  name: string;
  slug: string;
  href: string;
  categoryLabel: string;
  summary: string;
  city: string;
  geo: GeoPoint | undefined;
  languagesSpoken: LanguageCode[];
  turkishSpeaking: boolean;
  nhsStatus: NhsStatus;
}

export async function getDirectoryEntries(): Promise<DirectoryEntry[]> {
  const [providers, organizations] = await Promise.all([
    getAllProviders(),
    getAllOrganizations(),
  ]);
  const organizationById = new Map(
    organizations.map((organization) => [organization.id, organization]),
  );

  const providerEntries: DirectoryEntry[] = providers.map((provider) => {
    const primaryOrganization = provider.organizationIds
      .map((id) => organizationById.get(id))
      .find((organization) => organization !== undefined);

    return {
      id: provider.id,
      kind: "provider",
      name: `${provider.title} ${provider.name}`,
      slug: provider.slug,
      href: `/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`,
      categoryLabel: PROVIDER_CATEGORY_LABELS[provider.category],
      summary: provider.bio,
      city: primaryOrganization?.address.city ?? "United Kingdom",
      geo: primaryOrganization?.geo,
      languagesSpoken: provider.languagesSpoken,
      turkishSpeaking: provider.turkishSpeaking,
      nhsStatus: provider.nhsStatus,
    };
  });

  const organizationEntries: DirectoryEntry[] = organizations.map(
    (organization) => ({
      id: organization.id,
      kind: "organization",
      name: organization.name,
      slug: organization.slug,
      href: `/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`,
      categoryLabel: ORGANIZATION_TYPE_LABELS[organization.type],
      summary: organization.description,
      city: organization.address.city,
      geo: organization.geo,
      languagesSpoken: organization.languagesSpoken,
      turkishSpeaking: organization.turkishSpeakingStaff,
      nhsStatus: organization.nhsStatus,
    }),
  );

  return [...providerEntries, ...organizationEntries];
}

import { isLanguageCode, type LanguageCode } from "@/lib/constants/languages";
import { NHS_STATUSES, type NhsStatus } from "@/lib/constants/categories";
import type { Provider } from "@/lib/schemas/provider";
import type { Organization } from "@/lib/schemas/organization";
import type { Speciality } from "@/lib/schemas/speciality";
import type { Insurance } from "@/lib/schemas/insurance";
import type { TurkeyReferral } from "@/lib/schemas/turkey-referral";

export type SearchParamsInput = Record<string, string | string[] | undefined>;

export const PROVIDER_SORT_OPTIONS = [
  "name",
  "speciality",
  "createdAt",
  "updatedAt",
] as const;
export type ProviderSortOption = (typeof PROVIDER_SORT_OPTIONS)[number];

export function isProviderSortOption(
  value: string,
): value is ProviderSortOption {
  return (PROVIDER_SORT_OPTIONS as readonly string[]).includes(value);
}

export const PROVIDER_SORT_UI_OPTIONS: { value: ProviderSortOption; label: string }[] =
  [
    { value: "name", label: "Name (A–Z)" },
    { value: "speciality", label: "Speciality" },
    { value: "createdAt", label: "Newest added" },
    { value: "updatedAt", label: "Recently updated" },
  ];

export interface DirectoryFilterValues {
  nhs?: NhsStatus;
  lang?: LanguageCode;
  specialitySlug?: string;
  insuranceSlug?: string;
  turkishOnly: boolean;
  sort?: ProviderSortOption;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDirectoryFilters(
  searchParams: SearchParamsInput,
): DirectoryFilterValues {
  const nhsRaw = firstValue(searchParams.nhs);
  const langRaw = firstValue(searchParams.lang);
  const sortRaw = firstValue(searchParams.sort);

  return {
    nhs:
      nhsRaw && (NHS_STATUSES as readonly string[]).includes(nhsRaw)
        ? (nhsRaw as NhsStatus)
        : undefined,
    lang: langRaw && isLanguageCode(langRaw) ? langRaw : undefined,
    specialitySlug: firstValue(searchParams.speciality),
    insuranceSlug: firstValue(searchParams.insurance),
    turkishOnly: firstValue(searchParams.turkish) === "1",
    sort: sortRaw && isProviderSortOption(sortRaw) ? sortRaw : undefined,
  };
}

export function filterProviders(
  providers: readonly Provider[],
  filters: DirectoryFilterValues,
  specialities: readonly Speciality[],
  insurances: readonly Insurance[],
): Provider[] {
  const specialityId = specialities.find(
    (s) => s.slug === filters.specialitySlug,
  )?.id;
  const insuranceId = insurances.find(
    (i) => i.slug === filters.insuranceSlug,
  )?.id;

  return providers.filter((provider) => {
    if (filters.nhs && provider.nhsStatus !== filters.nhs) return false;
    if (filters.lang && !provider.languagesSpoken.includes(filters.lang))
      return false;
    if (filters.turkishOnly && !provider.turkishSpeaking) return false;
    if (specialityId && !provider.specialityIds.includes(specialityId))
      return false;
    if (insuranceId && !provider.insuranceIds.includes(insuranceId))
      return false;
    return true;
  });
}

/**
 * Sorts by speciality name using the first entry in each provider's
 * resolved speciality list — providers can have several, but the list
 * view only has room to show one sort key.
 */
export function sortProviders(
  providers: readonly Provider[],
  sort: ProviderSortOption | undefined,
  specialitiesById: ReadonlyMap<string, readonly Speciality[]>,
): Provider[] {
  if (!sort) return [...providers];

  const sorted = [...providers];
  switch (sort) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "speciality":
      sorted.sort((a, b) => {
        const aName = specialitiesById.get(a.id)?.[0]?.name ?? "";
        const bName = specialitiesById.get(b.id)?.[0]?.name ?? "";
        return aName.localeCompare(bName);
      });
      break;
    case "createdAt":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "updatedAt":
      sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      break;
  }
  return sorted;
}

export function filterOrganizations(
  organizations: readonly Organization[],
  filters: DirectoryFilterValues,
  specialities: readonly Speciality[],
  insurances: readonly Insurance[],
): Organization[] {
  const specialityId = specialities.find(
    (s) => s.slug === filters.specialitySlug,
  )?.id;
  const insuranceId = insurances.find(
    (i) => i.slug === filters.insuranceSlug,
  )?.id;

  return organizations.filter((organization) => {
    if (filters.nhs && organization.nhsStatus !== filters.nhs) return false;
    if (filters.lang && !organization.languagesSpoken.includes(filters.lang))
      return false;
    if (filters.turkishOnly && !organization.turkishSpeakingStaff) return false;
    if (specialityId && !organization.specialityIds.includes(specialityId))
      return false;
    if (insuranceId && !organization.insuranceIds.includes(insuranceId))
      return false;
    return true;
  });
}

/**
 * Turkey referrals record speciality/city as free text (see the schema
 * comment for why — no UK speciality taxonomy or address model applies),
 * so filtering is a plain string match rather than an id lookup.
 */
export interface TurkeyReferralFilterValues {
  speciality?: string;
  city?: string;
}

export function parseTurkeyReferralFilters(
  searchParams: SearchParamsInput,
): TurkeyReferralFilterValues {
  return {
    speciality: firstValue(searchParams.speciality),
    city: firstValue(searchParams.city),
  };
}

export function filterTurkeyReferrals(
  referrals: readonly TurkeyReferral[],
  filters: TurkeyReferralFilterValues,
): TurkeyReferral[] {
  return referrals.filter((referral) => {
    if (filters.speciality && referral.specialityText !== filters.speciality)
      return false;
    if (filters.city && referral.city !== filters.city) return false;
    return true;
  });
}

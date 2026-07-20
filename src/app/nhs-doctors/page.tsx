import type { Metadata } from "next";
import { DirectoryFilters } from "@/components/filters/directory-filters";
import { FiltersDisclosure } from "@/components/filters/filters-disclosure";
import { ProviderCard } from "@/components/providers/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { ResultsView } from "@/components/shared/results-view";
import type { MapEntry } from "@/components/map/network-map";
import {
  getAllInsurances,
  getNhsDoctors,
  getSpecialitiesByCategory,
  getSpecialitiesByIds,
} from "@/lib/data";
import { getDirectoryEntries } from "@/lib/directory";
import { LANGUAGE_CODES } from "@/lib/constants/languages";
import {
  filterProviders,
  parseDirectoryFilters,
  type SearchParamsInput,
} from "@/lib/filtering";

export const metadata: Metadata = {
  title: "NHS Doctors",
  description:
    "Find Turkish-speaking doctors accepting NHS patients across the UK.",
};

export default async function NhsDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const resolvedSearchParams = await searchParams;
  const [doctors, specialities, insurances, directoryEntries] =
    await Promise.all([
      getNhsDoctors(),
      getSpecialitiesByCategory("doctor"),
      getAllInsurances(),
      getDirectoryEntries(),
    ]);

  const filters = parseDirectoryFilters(resolvedSearchParams);
  const filtered = filterProviders(doctors, filters, specialities, insurances);

  const specialityByProvider = await Promise.all(
    filtered.map(
      async (provider) =>
        [
          provider.id,
          await getSpecialitiesByIds(provider.specialityIds),
        ] as const,
    ),
  );
  const specialitiesById = new Map(specialityByProvider);

  const filteredIds = new Set(filtered.map((provider) => provider.id));
  const mapEntries: MapEntry[] = directoryEntries
    .filter(
      (entry): entry is typeof entry & { geo: NonNullable<typeof entry.geo> } =>
        entry.kind === "provider" &&
        filteredIds.has(entry.id) &&
        entry.geo !== undefined,
    )
    .map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      name: entry.name,
      href: entry.href,
      categoryLabel: entry.categoryLabel,
      geo: entry.geo,
    }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "NHS Doctors" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Turkish-speaking NHS doctors
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Doctors in the network who see NHS patients, either exclusively or
        alongside private appointments.
      </p>

      <div className="mt-6">
        <FiltersDisclosure>
          <DirectoryFilters
            specialityOptions={specialities.map((s) => ({
              slug: s.slug,
              name: s.name,
            }))}
            insuranceOptions={insurances.map((i) => ({
              slug: i.slug,
              name: i.name,
            }))}
            languageOptions={[...LANGUAGE_CODES]}
          />
        </FiltersDisclosure>
      </div>

      <p className="text-muted-foreground mt-4 text-sm" role="status">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-4">
          <ResultsView mapEntries={mapEntries} totalCount={filtered.length}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  specialities={specialitiesById.get(provider.id) ?? []}
                />
              ))}
            </div>
          </ResultsView>
        </div>
      )}
    </div>
  );
}

import { DirectoryFilters } from "@/components/filters/directory-filters";
import { FiltersDisclosure } from "@/components/filters/filters-disclosure";
import { OrganizationCard } from "@/components/organizations/organization-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { ResultsView } from "@/components/shared/results-view";
import type { MapEntry } from "@/components/map/network-map";
import {
  getAllInsurances,
  getOrganizationsByType,
  getAllSpecialities,
} from "@/lib/data";
import { getDirectoryEntries } from "@/lib/directory";
import {
  ORGANIZATION_TYPE_PLURAL_LABELS,
  type OrganizationType,
} from "@/lib/constants/categories";
import { LANGUAGE_CODES } from "@/lib/constants/languages";
import {
  filterOrganizations,
  parseDirectoryFilters,
  type SearchParamsInput,
} from "@/lib/filtering";

export async function OrganizationTypeView({
  type,
  searchParams,
}: {
  type: OrganizationType;
  searchParams: SearchParamsInput;
}) {
  const [organizations, specialities, insurances, directoryEntries] =
    await Promise.all([
      getOrganizationsByType(type),
      getAllSpecialities(),
      getAllInsurances(),
      getDirectoryEntries(),
    ]);

  const filters = parseDirectoryFilters(searchParams);
  const filtered = filterOrganizations(
    organizations,
    filters,
    specialities,
    insurances,
  );

  const filteredIds = new Set(filtered.map((organization) => organization.id));
  const mapEntries: MapEntry[] = directoryEntries
    .filter(
      (entry): entry is typeof entry & { geo: NonNullable<typeof entry.geo> } =>
        entry.kind === "organization" &&
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

  const pluralLabel = ORGANIZATION_TYPE_PLURAL_LABELS[type];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: pluralLabel }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {pluralLabel} serving the Turkish-speaking community
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Browse {pluralLabel.toLowerCase()} across the network. Filter by NHS or
        private status, spoken language and accepted insurance.
      </p>

      <div className="mt-6">
        <FiltersDisclosure>
          <DirectoryFilters
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
              {filtered.map((organization) => (
                <OrganizationCard
                  key={organization.id}
                  organization={organization}
                />
              ))}
            </div>
          </ResultsView>
        </div>
      )}
    </div>
  );
}

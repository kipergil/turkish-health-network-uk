import { DirectoryFilters } from "@/components/filters/directory-filters";
import { OrganizationCard } from "@/components/organizations/organization-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import {
  getAllInsurances,
  getOrganizationsByType,
  getAllSpecialities,
} from "@/lib/data";
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
  const [organizations, specialities, insurances] = await Promise.all([
    getOrganizationsByType(type),
    getAllSpecialities(),
    getAllInsurances(),
  ]);

  const filters = parseDirectoryFilters(searchParams);
  const filtered = filterOrganizations(
    organizations,
    filters,
    specialities,
    insurances,
  );
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
        <DirectoryFilters
          insuranceOptions={insurances.map((i) => ({
            slug: i.slug,
            name: i.name,
          }))}
          languageOptions={[...LANGUAGE_CODES]}
        />
      </div>

      <p className="text-muted-foreground mt-4 text-sm" role="status">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      )}
    </div>
  );
}

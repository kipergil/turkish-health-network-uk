import { DirectoryFilters } from "@/components/filters/directory-filters";
import { ProviderCard } from "@/components/providers/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import {
  getAllInsurances,
  getProvidersByCategory,
  getSpecialitiesByCategory,
  getSpecialitiesByIds,
} from "@/lib/data";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_PLURAL_LABELS,
  type ProviderCategory,
} from "@/lib/constants/categories";
import { LANGUAGE_CODES } from "@/lib/constants/languages";
import {
  filterProviders,
  parseDirectoryFilters,
  type SearchParamsInput,
} from "@/lib/filtering";

export async function ProviderCategoryView({
  category,
  searchParams,
}: {
  category: ProviderCategory;
  searchParams: SearchParamsInput;
}) {
  const [providers, specialities, insurances] = await Promise.all([
    getProvidersByCategory(category),
    getSpecialitiesByCategory(category),
    getAllInsurances(),
  ]);

  const filters = parseDirectoryFilters(searchParams);
  const filtered = filterProviders(
    providers,
    filters,
    specialities,
    insurances,
  );

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

  const pluralLabel = PROVIDER_CATEGORY_PLURAL_LABELS[category];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: pluralLabel }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Turkish-speaking {pluralLabel.toLowerCase()} in the UK
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Browse {PROVIDER_CATEGORY_LABELS[category].toLowerCase()}s across the
        network. Filter by speciality, NHS or private status, spoken language
        and accepted insurance.
      </p>

      <div className="mt-6">
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
          {filtered.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              specialities={specialitiesById.get(provider.id) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

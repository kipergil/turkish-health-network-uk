import type { Metadata } from "next";
import { DirectoryFilters } from "@/components/filters/directory-filters";
import { ProviderCard } from "@/components/providers/provider-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import {
  getAllInsurances,
  getNhsDoctors,
  getSpecialitiesByCategory,
  getSpecialitiesByIds,
} from "@/lib/data";
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
  const [doctors, specialities, insurances] = await Promise.all([
    getNhsDoctors(),
    getSpecialitiesByCategory("doctor"),
    getAllInsurances(),
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

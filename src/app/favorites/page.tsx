import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { ProviderCard } from "@/components/providers/provider-card";
import { OrganizationCard } from "@/components/organizations/organization-card";
import {
  getFavoritesByUser,
  getOrganizationsByIds,
  getProvidersByIds,
  getSpecialitiesByIds,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Providers and organizations you've saved.",
};

export default async function FavoritesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const favorites = await getFavoritesByUser(userId);
  const providerIds = favorites
    .filter((favorite) => favorite.subjectKind === "provider")
    .map((favorite) => favorite.subjectId);
  const organizationIds = favorites
    .filter((favorite) => favorite.subjectKind === "organization")
    .map((favorite) => favorite.subjectId);

  const [providers, organizations] = await Promise.all([
    getProvidersByIds(providerIds),
    getOrganizationsByIds(organizationIds),
  ]);

  const specialityByProvider = await Promise.all(
    providers.map(
      async (provider) =>
        [
          provider.id,
          await getSpecialitiesByIds(provider.specialityIds),
        ] as const,
    ),
  );
  const specialitiesById = new Map(specialityByProvider);

  const isEmpty = providers.length === 0 && organizations.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "Favorites" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Your favorites
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Providers and organizations you&apos;ve saved for later.
      </p>

      {isEmpty ? (
        <div className="mt-6">
          <EmptyState
            title="No favorites yet"
            description="Tap Save on any provider or organization profile to add it here."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {providers.length > 0 && (
            <section aria-labelledby="favorite-providers-heading">
              <h2
                id="favorite-providers-heading"
                className="text-lg font-semibold"
              >
                Practitioners
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    specialities={specialitiesById.get(provider.id) ?? []}
                  />
                ))}
              </div>
            </section>
          )}

          {organizations.length > 0 && (
            <section aria-labelledby="favorite-organizations-heading">
              <h2
                id="favorite-organizations-heading"
                className="text-lg font-semibold"
              >
                Places
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {organizations.map((organization) => (
                  <OrganizationCard
                    key={organization.id}
                    organization={organization}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

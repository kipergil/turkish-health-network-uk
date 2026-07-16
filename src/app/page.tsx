import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPinned, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickSearchForm } from "@/components/search/quick-search-form";
import { ProviderCard } from "@/components/providers/provider-card";
import { OrganizationCard } from "@/components/organizations/organization-card";
import { InsuranceCard } from "@/components/insurance/insurance-card";
import { DIRECTORY_NAV_ITEMS } from "@/lib/constants/nav";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/constants/site";
import {
  getAllInsurances,
  getAllOrganizations,
  getAllProviders,
  getFeaturedOrganizations,
  getFeaturedProviders,
  getSpecialitiesByIds,
} from "@/lib/data";

export const metadata: Metadata = {
  title: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
};

export default async function HomePage() {
  const [
    providers,
    organizations,
    featuredProviders,
    featuredOrganizations,
    insurances,
  ] = await Promise.all([
    getAllProviders(),
    getAllOrganizations(),
    getFeaturedProviders(3),
    getFeaturedOrganizations(3),
    getAllInsurances(),
  ]);

  const specialityByProvider = await Promise.all(
    featuredProviders.map(
      async (provider) =>
        [
          provider.id,
          await getSpecialitiesByIds(provider.specialityIds),
        ] as const,
    ),
  );
  const specialitiesById = new Map(specialityByProvider);

  const cities = new Set(
    organizations.map((organization) => organization.address.city),
  );

  return (
    <div>
      <section className="border-border from-muted/50 to-background border-b bg-gradient-to-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Turkish-speaking healthcare, across the UK.
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            {SITE_DESCRIPTION}
          </p>

          <div className="mt-8">
            <QuickSearchForm />
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <dt className="text-2xl font-bold">{providers.length}</dt>
              <dd className="text-muted-foreground text-sm">Practitioners</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold">{organizations.length}</dt>
              <dd className="text-muted-foreground text-sm">Locations</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold">{cities.size}</dt>
              <dd className="text-muted-foreground text-sm">Cities</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="browse-heading"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6"
      >
        <h2 id="browse-heading" className="text-xl font-semibold sm:text-2xl">
          Browse the directory
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {DIRECTORY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border-border hover:border-primary focus-visible:ring-ring/50 flex flex-col justify-between rounded-lg border p-4 transition-colors focus-visible:ring-3 focus-visible:outline-none"
            >
              <span className="font-medium">{item.label}</span>
              <ArrowRight
                className="text-muted-foreground group-hover:text-primary mt-3 size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {featuredProviders.length > 0 && (
        <section
          aria-labelledby="featured-providers-heading"
          className="border-border bg-muted/30 border-t"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="flex items-center justify-between">
              <h2
                id="featured-providers-heading"
                className="text-xl font-semibold sm:text-2xl"
              >
                Featured practitioners
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  specialities={specialitiesById.get(provider.id) ?? []}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredOrganizations.length > 0 && (
        <section
          aria-labelledby="featured-organizations-heading"
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6"
        >
          <h2
            id="featured-organizations-heading"
            className="text-xl font-semibold sm:text-2xl"
          >
            Featured clinics &amp; hospitals
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOrganizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="explore-heading"
        className="border-border bg-muted/30 border-t"
      >
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 sm:px-6">
          <Link
            href="/map"
            className="group border-border bg-background hover:border-primary focus-visible:ring-ring/50 flex flex-col justify-between rounded-lg border p-6 transition-colors focus-visible:ring-3 focus-visible:outline-none"
          >
            <div>
              <MapPinned className="text-primary size-6" aria-hidden="true" />
              <h2 id="explore-heading" className="mt-3 text-lg font-semibold">
                Explore the map
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                See every provider and organization plotted across the UK.
              </p>
            </div>
            <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Open map <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>

          <Link
            href="/search"
            className="group border-border bg-background hover:border-primary focus-visible:ring-ring/50 flex flex-col justify-between rounded-lg border p-6 transition-colors focus-visible:ring-3 focus-visible:outline-none"
          >
            <div>
              <SearchIcon className="text-primary size-6" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold">
                Search the whole network
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Search by name, speciality, city or language.
              </p>
            </div>
            <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Start searching{" "}
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="insurance-heading"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6"
      >
        <div className="flex items-center justify-between">
          <h2
            id="insurance-heading"
            className="text-xl font-semibold sm:text-2xl"
          >
            Insurance accepted across the network
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/insurance">
              View all <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insurances.slice(0, 4).map((insurance) => (
            <InsuranceCard key={insurance.id} insurance={insurance} />
          ))}
        </div>
      </section>
    </div>
  );
}

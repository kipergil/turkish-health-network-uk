import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  MapPinned,
  Search as SearchIcon,
  Sparkles,
} from "lucide-react";
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
      <section className="border-border bg-hero-pattern bg-hero-glow relative isolate overflow-hidden border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="animate-fade-up">
            <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Turkish-speaking care
            </span>

            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Turkish-speaking healthcare, across the UK.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl text-lg">
              {SITE_DESCRIPTION}
            </p>

            <div className="mt-8">
              <QuickSearchForm />
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center sm:gap-4 sm:text-left">
              <div className="bg-card/60 rounded-xl p-3 sm:bg-transparent sm:p-0">
                <dt className="text-primary text-2xl font-bold">
                  {providers.length}
                </dt>
                <dd className="text-muted-foreground text-sm">Practitioners</dd>
              </div>
              <div className="bg-card/60 rounded-xl p-3 sm:bg-transparent sm:p-0">
                <dt className="text-primary text-2xl font-bold">
                  {organizations.length}
                </dt>
                <dd className="text-muted-foreground text-sm">Locations</dd>
              </div>
              <div className="bg-card/60 rounded-xl p-3 sm:bg-transparent sm:p-0">
                <dt className="text-primary text-2xl font-bold">
                  {cities.size}
                </dt>
                <dd className="text-muted-foreground text-sm">Cities</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="browse-heading"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
      >
        <p className="text-primary text-xs font-semibold tracking-wide uppercase">
          Directory
        </p>
        <h2
          id="browse-heading"
          className="mt-1 text-xl font-semibold sm:text-2xl"
        >
          Browse by category
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {DIRECTORY_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring/50 flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:outline-none"
            >
              <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-10 items-center justify-center rounded-lg transition-colors">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="flex items-center justify-between gap-1 font-medium">
                {item.label}
                <ArrowRight
                  className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featuredProviders.length > 0 && (
        <section
          aria-labelledby="featured-providers-heading"
          className="border-border bg-muted/40 border-t"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              Featured
            </p>
            <h2
              id="featured-providers-heading"
              className="mt-1 text-xl font-semibold sm:text-2xl"
            >
              Featured practitioners
            </h2>
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
          className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
        >
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            Featured
          </p>
          <h2
            id="featured-organizations-heading"
            className="mt-1 text-xl font-semibold sm:text-2xl"
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
        className="border-border bg-muted/40 border-t"
      >
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 sm:px-6 sm:py-16">
          <Link
            href="/map"
            className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring/50 flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:outline-none"
          >
            <div>
              <span className="bg-primary/10 text-primary inline-flex size-11 items-center justify-center rounded-lg">
                <MapPinned className="size-5.5" aria-hidden="true" />
              </span>
              <h2 id="explore-heading" className="mt-3 text-lg font-semibold">
                Explore the map
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                See every provider and organization plotted across the UK.
              </p>
            </div>
            <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Open map{" "}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>

          <Link
            href="/search"
            className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring/50 flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-3 focus-visible:outline-none"
          >
            <div>
              <span className="bg-primary/10 text-primary inline-flex size-11 items-center justify-center rounded-lg">
                <SearchIcon className="size-5.5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-lg font-semibold">
                Search the whole network
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Search by name, speciality, city or language.
              </p>
            </div>
            <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Start searching{" "}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="insurance-heading"
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              Insurance
            </p>
            <h2
              id="insurance-heading"
              className="mt-1 text-xl font-semibold sm:text-2xl"
            >
              Accepted across the network
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="shrink-0">
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

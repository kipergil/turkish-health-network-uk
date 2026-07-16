import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { ProviderCard } from "@/components/providers/provider-card";
import { OrganizationCard } from "@/components/organizations/organization-card";
import {
  getAllInsurances,
  getAllOrganizations,
  getAllProviders,
  getInsuranceBySlug,
} from "@/lib/data";

const INSURANCE_KIND_LABELS = {
  "private-health-insurance": "Private health insurance",
  "cash-plan": "Cash plan",
  "nhs-scheme": "NHS scheme",
} as const;

export async function generateStaticParams() {
  const insurances = await getAllInsurances();
  return insurances.map((insurance) => ({ slug: insurance.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insurance = await getInsuranceBySlug(slug);
  if (!insurance) return {};
  return { title: insurance.name, description: insurance.description };
}

export default async function InsuranceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insurance = await getInsuranceBySlug(slug);
  if (!insurance) notFound();

  const [providers, organizations] = await Promise.all([
    getAllProviders(),
    getAllOrganizations(),
  ]);
  const acceptingProviders = providers.filter((provider) =>
    provider.insuranceIds.includes(insurance.id),
  );
  const acceptingOrganizations = organizations.filter((organization) =>
    organization.insuranceIds.includes(insurance.id),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs
        items={[
          { label: "Insurance", href: "/insurance" },
          { label: insurance.name },
        ]}
      />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {insurance.name}
      </h1>
      <Badge variant="outline" className="mt-2">
        {INSURANCE_KIND_LABELS[insurance.kind]}
      </Badge>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        {insurance.description}
      </p>
      {insurance.website ? (
        <p className="mt-2">
          <a
            href={insurance.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline"
          >
            Visit {insurance.name}
          </a>
        </p>
      ) : null}

      <section aria-labelledby="providers-heading" className="mt-8">
        <h2 id="providers-heading" className="text-lg font-semibold">
          Practitioners accepting {insurance.name}
        </h2>
        {acceptingProviders.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No practitioners listed yet"
              description="Check back soon."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acceptingProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                specialities={[]}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="organizations-heading" className="mt-8">
        <h2 id="organizations-heading" className="text-lg font-semibold">
          Organizations accepting {insurance.name}
        </h2>
        {acceptingOrganizations.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No organizations listed yet"
              description="Check back soon."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acceptingOrganizations.map((organization) => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

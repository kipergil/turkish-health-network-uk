import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AccessibilityBadges } from "@/components/shared/accessibility-badges";
import { DirectusEditLink } from "@/components/shared/directus-edit-link";
import { FavoriteButton } from "@/components/shared/favorite-button";
import {
  GoogleMapsDirectionsLink,
  GoogleMapsLink,
} from "@/components/shared/google-maps-link";
import { GoogleSearchLink } from "@/components/shared/google-search-link";
import { LanguageBadges } from "@/components/shared/language-badges";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { OpeningHoursTable } from "@/components/shared/opening-hours-table";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { TurkishSpeakingBadge } from "@/components/shared/turkish-speaking-badge";
import { ProviderCard } from "@/components/providers/provider-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllInsurances,
  getOrganizationBySlug,
  getProvidersByOrganization,
  getPublishedReviewsForSubject,
  getSpecialitiesByIds,
  isFavorite,
} from "@/lib/data";
import {
  ORGANIZATION_TYPE_LABELS,
  ORGANIZATION_TYPE_PLURAL_LABELS,
  ORGANIZATION_TYPE_ROUTES,
  type OrganizationType,
} from "@/lib/constants/categories";
import { isAdmin } from "@/lib/admin";
import { directusItemAdminUrl } from "@/lib/directus/admin-url";
import { organizationJsonLd } from "@/lib/seo/structured-data";
import type { Organization } from "@/lib/schemas/organization";

export async function loadOrganizationForType(
  slug: string,
  expectedType: OrganizationType,
): Promise<Organization> {
  const organization = await getOrganizationBySlug(slug);
  if (!organization || organization.type !== expectedType) {
    notFound();
  }
  return organization;
}

export async function OrganizationProfileView({
  organization,
}: {
  organization: Organization;
}) {
  const { userId } = await auth();
  const [specialities, insurances, providers, reviews, alreadyFavorited, canEditInDirectus] =
    await Promise.all([
      getSpecialitiesByIds(organization.specialityIds),
      getAllInsurances().then((all) =>
        all.filter((insurance) =>
          organization.insuranceIds.includes(insurance.id),
        ),
      ),
      getProvidersByOrganization(organization.id),
      getPublishedReviewsForSubject("organization", organization.id),
      userId ? isFavorite(userId, "organization", organization.id) : false,
      isAdmin(),
    ]);

  const profilePath = `/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`;
  const googleSearchQuery = `${organization.name} ${organization.address.city}`;
  const directusEditUrl = canEditInDirectus
    ? directusItemAdminUrl("organizations", organization.id)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd data={organizationJsonLd(organization)} />
      <PageBreadcrumbs
        items={[
          {
            label: ORGANIZATION_TYPE_PLURAL_LABELS[organization.type],
            href: `/${ORGANIZATION_TYPE_ROUTES[organization.type]}`,
          },
          { label: organization.name },
        ]}
      />

      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {organization.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {ORGANIZATION_TYPE_LABELS[organization.type]} ·{" "}
            {organization.address.city}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <NhsStatusBadge status={organization.nhsStatus} />
            {organization.turkishSpeakingStaff ? (
              <TurkishSpeakingBadge />
            ) : null}
            {organization.verified ? (
              <Badge variant="secondary">Verified</Badge>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {directusEditUrl ? <DirectusEditLink href={directusEditUrl} /> : null}
          <FavoriteButton
            subjectKind="organization"
            subjectId={organization.id}
            initialFavorited={alreadyFavorited}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-lg font-semibold">
              About
            </h2>
            <p className="text-muted-foreground mt-2">
              {organization.description}
            </p>
          </section>

          {specialities.length > 0 && (
            <section aria-labelledby="services-heading">
              <h2 id="services-heading" className="text-lg font-semibold">
                Services
              </h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {specialities.map((speciality) => (
                  <li key={speciality.id}>
                    <Badge variant="outline">{speciality.name}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="languages-heading">
            <h2 id="languages-heading" className="text-lg font-semibold">
              Languages spoken
            </h2>
            <div className="mt-2">
              <LanguageBadges languages={organization.languagesSpoken} />
            </div>
          </section>

          {insurances.length > 0 && (
            <section aria-labelledby="insurance-heading">
              <h2 id="insurance-heading" className="text-lg font-semibold">
                Insurance accepted
              </h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {insurances.map((insurance) => (
                  <li key={insurance.id}>
                    <Badge variant="outline">{insurance.name}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {organization.accessibility ? (
            <section aria-labelledby="accessibility-heading">
              <h2 id="accessibility-heading" className="text-lg font-semibold">
                Accessibility
              </h2>
              <div className="mt-2">
                <AccessibilityBadges
                  accessibility={organization.accessibility}
                />
              </div>
            </section>
          ) : null}

          {providers.length > 0 && (
            <section aria-labelledby="practitioners-heading">
              <h2 id="practitioners-heading" className="text-lg font-semibold">
                Practitioners here
              </h2>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    specialities={[]}
                  />
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="text-lg font-semibold">
              Reviews
            </h2>
            <div className="mt-2">
              <ReviewList reviews={reviews} />
            </div>
            <div className="mt-4">
              <ReviewForm
                subjectKind="organization"
                subjectId={organization.id}
                profilePath={profilePath}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <address className="not-italic">
                {organization.address.line1}
                {organization.address.line2 ? (
                  <>, {organization.address.line2}</>
                ) : null}
                <br />
                {organization.address.city}, {organization.address.postcode}
              </address>
              {organization.contact.phone ? (
                <p>
                  <a
                    href={`tel:${organization.contact.phone}`}
                    className="hover:underline"
                  >
                    {organization.contact.phone}
                  </a>
                </p>
              ) : null}
              {organization.contact.email ? (
                <p>
                  <a
                    href={`mailto:${organization.contact.email}`}
                    className="hover:underline"
                  >
                    {organization.contact.email}
                  </a>
                </p>
              ) : null}
              {organization.contact.website ? (
                <p>
                  <a
                    href={organization.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Website
                  </a>
                </p>
              ) : null}
              <Separator />
              <div className="flex flex-col gap-2">
                <GoogleMapsLink geo={organization.geo} />
                <GoogleMapsDirectionsLink geo={organization.geo} />
                <GoogleSearchLink query={googleSearchQuery} />
              </div>
            </CardContent>
          </Card>

          {organization.openingHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opening hours</CardTitle>
              </CardHeader>
              <CardContent>
                <OpeningHoursTable hours={organization.openingHours} />
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

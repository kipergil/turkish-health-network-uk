import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { OrganizationCard } from "@/components/organizations/organization-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getInsurancesByIds,
  getOrganizationsByIds,
  getProviderBySlug,
  getPublishedReviewsForSubject,
  getSpecialitiesByIds,
  isFavorite,
} from "@/lib/data";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_PLURAL_LABELS,
  PROVIDER_CATEGORY_ROUTES,
  type ProviderCategory,
} from "@/lib/constants/categories";
import { isAdmin } from "@/lib/admin";
import { directusItemAdminUrl } from "@/lib/directus/admin-url";
import { initialsFor } from "@/lib/initials";
import { providerJsonLd } from "@/lib/seo/structured-data";
import type { Provider } from "@/lib/schemas/provider";

export async function loadProviderForCategory(
  slug: string,
  expectedCategory: ProviderCategory,
): Promise<Provider> {
  const provider = await getProviderBySlug(slug);
  if (!provider || provider.category !== expectedCategory) {
    notFound();
  }
  return provider;
}

export async function ProviderProfileView({
  provider,
}: {
  provider: Provider;
}) {
  const { userId } = await auth();
  const [specialities, insurances, organizations, reviews, alreadyFavorited, canEditInDirectus] =
    await Promise.all([
      getSpecialitiesByIds(provider.specialityIds),
      getInsurancesByIds(provider.insuranceIds),
      getOrganizationsByIds(provider.organizationIds),
      getPublishedReviewsForSubject("provider", provider.id),
      userId ? isFavorite(userId, "provider", provider.id) : false,
      isAdmin(),
    ]);

  const primaryOrganization = organizations[0];
  const profilePath = `/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`;
  const directusEditUrl = canEditInDirectus
    ? directusItemAdminUrl("providers", provider.id)
    : null;
  const googleSearchQuery = [
    provider.title,
    provider.name,
    PROVIDER_CATEGORY_LABELS[provider.category],
    primaryOrganization?.name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd data={providerJsonLd(provider, specialities, organizations)} />
      <PageBreadcrumbs
        items={[
          {
            label: PROVIDER_CATEGORY_PLURAL_LABELS[provider.category],
            href: `/${PROVIDER_CATEGORY_ROUTES[provider.category]}`,
          },
          { label: `${provider.title} ${provider.name}` },
        ]}
      />

      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            {provider.photoUrl ? (
              <AvatarImage src={provider.photoUrl} alt="" />
            ) : null}
            <AvatarFallback className="bg-muted text-foreground text-xl font-medium">
              {initialsFor(provider.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {provider.title} {provider.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {PROVIDER_CATEGORY_LABELS[provider.category]}
              {specialities.length > 0
                ? ` · ${specialities.map((s) => s.name).join(", ")}`
                : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <NhsStatusBadge status={provider.nhsStatus} />
              {provider.turkishSpeaking ? <TurkishSpeakingBadge /> : null}
              {provider.verified ? (
                <Badge variant="secondary">Verified</Badge>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {directusEditUrl ? <DirectusEditLink href={directusEditUrl} /> : null}
          <FavoriteButton
            subjectKind="provider"
            subjectId={provider.id}
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
            <p className="text-muted-foreground mt-2">{provider.bio}</p>
          </section>

          {provider.qualifications.length > 0 && (
            <section aria-labelledby="qualifications-heading">
              <h2 id="qualifications-heading" className="text-lg font-semibold">
                Qualifications
              </h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {provider.qualifications.map((qualification) => (
                  <li key={qualification}>
                    <Badge variant="outline">{qualification}</Badge>
                  </li>
                ))}
              </ul>
              {provider.registrationBody && provider.registrationNumber ? (
                <p className="text-muted-foreground mt-2 text-sm">
                  {provider.registrationBody} registration:{" "}
                  {provider.registrationNumber}
                </p>
              ) : null}
            </section>
          )}

          <section aria-labelledby="languages-heading">
            <h2 id="languages-heading" className="text-lg font-semibold">
              Languages spoken
            </h2>
            <div className="mt-2">
              <LanguageBadges languages={provider.languagesSpoken} />
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

          {provider.accessibility ? (
            <section aria-labelledby="accessibility-heading">
              <h2 id="accessibility-heading" className="text-lg font-semibold">
                Accessibility
              </h2>
              <div className="mt-2">
                <AccessibilityBadges accessibility={provider.accessibility} />
              </div>
            </section>
          ) : null}

          {organizations.length > 0 && (
            <section aria-labelledby="practices-heading">
              <h2 id="practices-heading" className="text-lg font-semibold">
                Practices at
              </h2>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {organizations.map((organization) => (
                  <OrganizationCard
                    key={organization.id}
                    organization={organization}
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
                subjectKind="provider"
                subjectId={provider.id}
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
              {provider.contact.phone ? (
                <p>
                  <a
                    href={`tel:${provider.contact.phone}`}
                    className="hover:underline"
                  >
                    {provider.contact.phone}
                  </a>
                </p>
              ) : null}
              {provider.contact.email ? (
                <p>
                  <a
                    href={`mailto:${provider.contact.email}`}
                    className="hover:underline"
                  >
                    {provider.contact.email}
                  </a>
                </p>
              ) : null}
              {provider.contact.website ? (
                <p>
                  <a
                    href={provider.contact.website}
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
                {primaryOrganization ? (
                  <>
                    <GoogleMapsLink geo={primaryOrganization.geo} />
                    <GoogleMapsDirectionsLink geo={primaryOrganization.geo} />
                  </>
                ) : null}
                <GoogleSearchLink query={googleSearchQuery} />
              </div>
            </CardContent>
          </Card>

          {provider.openingHours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <OpeningHoursTable hours={provider.openingHours} />
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

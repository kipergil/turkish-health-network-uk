import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LanguageIndicator } from "@/components/shared/language-indicator";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { RatingSummary } from "@/components/shared/rating-summary";
import { VerifiedStamp } from "@/components/shared/verified-stamp";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_ROUTES,
} from "@/lib/constants/categories";
import { getOrganizationsByIds, getReviewSummary } from "@/lib/data";
import { googleMapsDirectionsUrl } from "@/lib/geo";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t } from "@/lib/i18n/messages";
import { initialsFor } from "@/lib/initials";
import type { Provider } from "@/lib/schemas/provider";
import type { Speciality } from "@/lib/schemas/speciality";

export async function ProviderCard({
  provider,
  specialities,
}: {
  provider: Provider;
  specialities: Speciality[];
}) {
  const [language, reviewSummary, organizations] = await Promise.all([
    getCurrentLanguage(),
    getReviewSummary("provider", provider.id),
    getOrganizationsByIds(provider.organizationIds),
  ]);
  const href = `/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`;
  const primaryOrganization = organizations[0];

  return (
    <Card className="hover:border-primary/30 relative h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <LanguageIndicator languages={provider.languagesSpoken} />
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <Avatar className="size-12 shrink-0">
          {provider.photoUrl ? (
            <AvatarImage src={provider.photoUrl} alt="" />
          ) : null}
          <AvatarFallback className="bg-muted text-foreground font-medium">
            {initialsFor(provider.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate leading-tight font-semibold">
              <Link
                href={href}
                className="focus-visible:ring-ring/50 rounded-sm after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                {provider.title} {provider.name}
              </Link>
            </h3>
            {provider.verified ? <VerifiedStamp language={language} /> : null}
          </div>
          <p className="text-muted-foreground text-sm">
            {PROVIDER_CATEGORY_LABELS[provider.category]}
            {primaryOrganization ? ` · ${primaryOrganization.address.city}` : ""}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <RatingSummary summary={reviewSummary} language={language} />
        {specialities.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {specialities.map((speciality) => (
              <Badge key={speciality.id} variant="outline">
                {speciality.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-1.5">
          <NhsStatusBadge status={provider.nhsStatus} language={language} />
        </div>
        {provider.contact.phone || primaryOrganization ? (
          <div className="relative z-10 flex items-center gap-3 border-t pt-3 text-sm">
            {provider.contact.phone ? (
              <a
                href={`tel:${provider.contact.phone}`}
                className="text-primary font-medium hover:underline"
              >
                {t("contact_call", language)}
              </a>
            ) : null}
            {primaryOrganization ? (
              <a
                href={googleMapsDirectionsUrl(primaryOrganization.geo)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                {t("contact_directions", language)}
              </a>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

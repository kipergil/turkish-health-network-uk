import Link from "next/link";
import { Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LanguageIndicator } from "@/components/shared/language-indicator";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { OpenStatusIndicator } from "@/components/shared/open-status-indicator";
import { RatingSummary } from "@/components/shared/rating-summary";
import { VerifiedStamp } from "@/components/shared/verified-stamp";
import {
  ORGANIZATION_TYPE_LABELS,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";
import { getReviewSummary } from "@/lib/data";
import { googleMapsDirectionsUrl } from "@/lib/geo";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t } from "@/lib/i18n/messages";
import type { Organization } from "@/lib/schemas/organization";

export async function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  const [language, reviewSummary] = await Promise.all([
    getCurrentLanguage(),
    getReviewSummary("organization", organization.id),
  ]);
  const href = `/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`;

  return (
    <Card className="hover:border-primary/30 relative h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <LanguageIndicator languages={organization.languagesSpoken} />
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <Avatar className="size-12 shrink-0">
          {organization.images[0] ? (
            <AvatarImage src={organization.images[0]} alt="" />
          ) : null}
          <AvatarFallback className="bg-muted text-muted-foreground">
            <Building2 className="size-5" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate leading-tight font-semibold">
              <Link
                href={href}
                className="focus-visible:ring-ring/50 rounded-sm after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:outline-none"
              >
                {organization.name}
              </Link>
            </h3>
            {organization.verified ? (
              <VerifiedStamp language={language} />
            ) : null}
          </div>
          <p className="text-muted-foreground text-sm">
            {ORGANIZATION_TYPE_LABELS[organization.type]} ·{" "}
            {organization.address.city}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <RatingSummary summary={reviewSummary} language={language} />
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {organization.description}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <NhsStatusBadge status={organization.nhsStatus} language={language} />
          <OpenStatusIndicator
            openingHours={organization.openingHours}
            language={language}
          />
        </div>
        <div className="relative z-10 flex items-center gap-3 border-t pt-3 text-sm">
          {organization.contact.phone ? (
            <a
              href={`tel:${organization.contact.phone}`}
              className="text-primary font-medium hover:underline"
            >
              {t("contact_call", language)}
            </a>
          ) : null}
          <a
            href={googleMapsDirectionsUrl(organization.geo)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            {t("contact_directions", language)}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

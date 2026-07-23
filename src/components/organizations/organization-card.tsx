import Link from "next/link";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LanguageBadges } from "@/components/shared/language-badges";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { TurkishSpeakingBadge } from "@/components/shared/turkish-speaking-badge";
import {
  ORGANIZATION_TYPE_LABELS,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";
import type { Organization } from "@/lib/schemas/organization";

export function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  const href = `/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`;

  return (
    <Card className="hover:border-primary/30 relative h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-full">
          <Building2
            className="text-muted-foreground size-5"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate leading-tight font-semibold">
            <Link
              href={href}
              className="focus-visible:ring-ring/50 rounded-sm after:absolute after:inset-0 hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              {organization.name}
            </Link>
          </h3>
          <p className="text-muted-foreground text-sm">
            {ORGANIZATION_TYPE_LABELS[organization.type]} ·{" "}
            {organization.address.city}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {organization.description}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <NhsStatusBadge status={organization.nhsStatus} />
          {organization.turkishSpeakingStaff ? <TurkishSpeakingBadge /> : null}
        </div>
        <LanguageBadges languages={organization.languagesSpoken} />
      </CardContent>
    </Card>
  );
}

import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DirectusEditLink } from "@/components/shared/directus-edit-link";
import { GoogleSearchLink } from "@/components/shared/google-search-link";
import { directusItemAdminUrl } from "@/lib/directus/admin-url";
import type { TurkeyReferral } from "@/lib/schemas/turkey-referral";

export function TurkeyReferralCard({
  referral,
  canEditInDirectus = false,
}: {
  referral: TurkeyReferral;
  canEditInDirectus?: boolean;
}) {
  const directusEditUrl = canEditInDirectus
    ? directusItemAdminUrl("turkey_referrals", referral.id)
    : null;
  const googleSearchQuery = [
    referral.title,
    referral.name,
    referral.city,
    referral.city.toLowerCase() === "turkey" ? null : "Turkey",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="h-full">
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="leading-tight font-semibold">
            {referral.title ? `${referral.title} ` : ""}
            {referral.name}
          </h3>
          {directusEditUrl ? (
            <DirectusEditLink href={directusEditUrl} iconOnly />
          ) : null}
        </div>
        <p className="text-muted-foreground text-sm">
          {referral.specialityText} · {referral.city}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {referral.affiliation ? (
          <p className="text-muted-foreground text-sm">
            {referral.affiliation}
          </p>
        ) : null}
        {referral.notes ? (
          <p className="text-muted-foreground text-sm">{referral.notes}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={referral.verified ? "secondary" : "outline"}>
            {referral.verified
              ? "Web-verified"
              : "Chat-sourced — call to confirm"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {referral.phone ? (
            <a
              href={`tel:${referral.phone}`}
              className="text-primary hover:underline"
            >
              {referral.phone}
            </a>
          ) : null}
          {referral.website ? (
            <a
              href={referral.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 hover:underline"
            >
              <Globe className="size-3.5" aria-hidden="true" />
              Website
            </a>
          ) : null}
        </div>
        <GoogleSearchLink query={googleSearchQuery} />
      </CardContent>
    </Card>
  );
}

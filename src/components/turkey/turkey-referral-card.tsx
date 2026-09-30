import { AtSign, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DirectusEditLink } from "@/components/shared/directus-edit-link";
import { GoogleSearchLink } from "@/components/shared/google-search-link";
import { VerifiedStamp } from "@/components/shared/verified-stamp";
import { directusItemAdminUrl } from "@/lib/directus/admin-url";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { initialsFor } from "@/lib/initials";
import type { TurkeyReferral } from "@/lib/schemas/turkey-referral";

/**
 * Same card shell/avatar treatment as ProviderCard/OrganizationCard (photo,
 * verified stamp, hover lift) rather than a one-off layout — this listing
 * has no detail page of its own, so the admin edit link and Google search
 * fallback live in the footer instead of a profile-page aside.
 */
export async function TurkeyReferralCard({
  referral,
  canEditInDirectus = false,
}: {
  referral: TurkeyReferral;
  canEditInDirectus?: boolean;
}) {
  const language = await getCurrentLanguage();
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
    <Card className="hover:border-primary/30 relative h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {referral.verified ? (
        <VerifiedStamp language={language} className="absolute top-3 right-3" />
      ) : null}
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <Avatar className="size-12 shrink-0">
          {referral.photoUrl ? (
            <AvatarImage src={referral.photoUrl} alt="" />
          ) : null}
          <AvatarFallback className="bg-muted text-foreground font-medium">
            {initialsFor(referral.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="leading-tight font-semibold">
            {referral.title ? `${referral.title} ` : ""}
            {referral.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {referral.specialityText} · {referral.city}
          </p>
        </div>
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
          {referral.instagram ? (
            <a
              href={referral.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 hover:underline"
            >
              <AtSign className="size-3.5" aria-hidden="true" />
              Instagram
            </a>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <GoogleSearchLink query={googleSearchQuery} />
          {directusEditUrl ? (
            <DirectusEditLink href={directusEditUrl} iconOnly />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

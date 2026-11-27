import { AtSign, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VerifiedStamp } from "@/components/shared/verified-stamp";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { initialsFor } from "@/lib/initials";
import type { TurkeyReferral } from "@/lib/schemas/turkey-referral";

/**
 * A trimmed-down, plain (non-async) sibling of TurkeyReferralCard for the
 * client-side search results tree — the original uses async server
 * subcomponents (DirectusEditLink, GoogleSearchLink) that can't render
 * inside client code, so this one skips the admin-edit and Google-search
 * fallback links and takes `language` as a prop instead of self-fetching.
 */
export function TurkeyReferralResultCard({
  referral,
  language = DEFAULT_LANGUAGE,
}: {
  referral: TurkeyReferral;
  language?: LanguageCode;
}) {
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
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {referral.notes}
          </p>
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
      </CardContent>
    </Card>
  );
}

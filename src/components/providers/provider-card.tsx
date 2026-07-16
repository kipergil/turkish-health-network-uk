import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LanguageBadges } from "@/components/shared/language-badges";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { TurkishSpeakingBadge } from "@/components/shared/turkish-speaking-badge";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_ROUTES,
} from "@/lib/constants/categories";
import { initialsFor } from "@/lib/initials";
import type { Provider } from "@/lib/schemas/provider";
import type { Speciality } from "@/lib/schemas/speciality";

export function ProviderCard({
  provider,
  specialities,
}: {
  provider: Provider;
  specialities: Speciality[];
}) {
  const href = `/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`;

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
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
          <h3 className="truncate leading-tight font-semibold">
            <Link
              href={href}
              className="focus-visible:ring-ring/50 rounded-sm hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              {provider.title} {provider.name}
            </Link>
          </h3>
          <p className="text-muted-foreground text-sm">
            {PROVIDER_CATEGORY_LABELS[provider.category]}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {specialities.length > 0 ? (
          <p className="text-muted-foreground text-sm">
            {specialities.map((s) => s.name).join(" · ")}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-1.5">
          <NhsStatusBadge status={provider.nhsStatus} />
          {provider.turkishSpeaking ? <TurkishSpeakingBadge /> : null}
        </div>
        <LanguageBadges languages={provider.languagesSpoken} />
      </CardContent>
    </Card>
  );
}

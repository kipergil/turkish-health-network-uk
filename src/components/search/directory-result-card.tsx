import Link from "next/link";
import { Building2, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageBadges } from "@/components/shared/language-badges";
import { NhsStatusBadge } from "@/components/shared/nhs-status-badge";
import { TurkishSpeakingBadge } from "@/components/shared/turkish-speaking-badge";
import type { DirectoryEntry } from "@/lib/directory";

export function DirectoryResultCard({ entry }: { entry: DirectoryEntry }) {
  const Icon = entry.kind === "provider" ? User : Building2;

  return (
    <Card className="hover:border-primary/30 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate leading-tight font-semibold">
            <Link
              href={entry.href}
              className="focus-visible:ring-ring/50 rounded-sm hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              {entry.name}
            </Link>
          </h3>
          <p className="text-muted-foreground text-sm">
            <Badge variant="secondary" className="mr-1.5">
              {entry.categoryLabel}
            </Badge>
            {entry.city}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {entry.summary}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <NhsStatusBadge status={entry.nhsStatus} />
          {entry.turkishSpeaking ? <TurkishSpeakingBadge /> : null}
        </div>
        <LanguageBadges languages={entry.languagesSpoken} />
      </CardContent>
    </Card>
  );
}

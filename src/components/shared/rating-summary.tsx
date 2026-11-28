import { Star } from "lucide-react";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";
import type { ReviewSummary } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

/**
 * Average rating + review count, or an honest "No reviews yet" when a
 * subject has none — shared by provider/organization cards and profile
 * headers so the same trust signal reads the same way everywhere.
 */
export function RatingSummary({
  summary,
  language = DEFAULT_LANGUAGE,
  className,
}: {
  summary: ReviewSummary | null;
  language?: LanguageCode;
  className?: string;
}) {
  if (!summary) {
    return (
      <span className={cn("text-muted-foreground text-sm", className)}>
        {t("no_reviews_yet", language)}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <Star className="fill-stamp text-stamp size-3.5 shrink-0" aria-hidden="true" />
      <span className="text-foreground font-semibold">
        {summary.average.toFixed(1)}
      </span>
      <span className="text-muted-foreground">
        ({summary.count}{" "}
        {summary.count === 1
          ? t("review_one", language)
          : t("review_many", language)}
        )
      </span>
    </span>
  );
}

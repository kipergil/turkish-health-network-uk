import { getOpenStatus } from "@/lib/opening-hours";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";
import type { OpeningHoursEntry } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

/**
 * A live open/closed signal from `openingHours` — `null` when an
 * organization hasn't recorded any hours, rather than guessing "closed".
 */
export function OpenStatusIndicator({
  openingHours,
  language = DEFAULT_LANGUAGE,
  className,
}: {
  openingHours: readonly OpeningHoursEntry[];
  language?: LanguageCode;
  className?: string;
}) {
  if (openingHours.length === 0) return null;
  const status = getOpenStatus(openingHours);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        status.open ? "text-status-teal" : "text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          status.open ? "bg-status-teal" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {status.open ? t("open_now", language) : t("closed_now", language)}
      {status.time ? (
        <span className="text-muted-foreground font-normal">
          · {status.open ? t("closes_at", language) : t("opens_at", language)}{" "}
          {status.time}
        </span>
      ) : null}
    </span>
  );
}

import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

/**
 * A small rotated, bordered mark rather than a filled Badge — evokes a
 * rubber-stamped "verified" mark on a paper record, used on cards for
 * entries with `verified: true`. Plain (non-async): also reachable from
 * the client-side search results tree, so callers must pass `language`.
 */
export function VerifiedStamp({
  language = DEFAULT_LANGUAGE,
  className,
}: {
  language?: LanguageCode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-status-teal border-status-teal shrink-0 -rotate-3 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase",
        className,
      )}
    >
      {t("verified", language)}
    </span>
  );
}
